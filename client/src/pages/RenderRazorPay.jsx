import { useEffect, useRef } from 'react';
import crypto from 'crypto-js';
import Axios from 'axios';
import { useAuth } from '../store/auth';
import { toast } from "react-toastify"

// Function to load script and append in DOM tree.
const loadScript = src => new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => {
        console.log('razorpay loaded successfully');
        resolve(true);
    };
    script.onerror = () => {
        console.log('error in loading razorpay');
        resolve(false);
    };
    document.body.appendChild(script);
});


const RenderRazorpay = ({
    orderId,
    currency,
    amount,
}) => {
    const paymentId = useRef(null);
    const paymentMethod = useRef(null);
    const { orderList, userData, total, address, setDisplayRazorpay } = useAuth();

    // To load razorpay checkout modal script.
    const displayRazorpay = async (options) => {
        const res = await loadScript(
            'https://checkout.razorpay.com/v1/checkout.js',
        );

        if (!res) {
            console.log('Razorpay SDK failed to load. Are you online?');
            return;
        }
        // All information is loaded in options which we will discuss later.
        const rzp1 = new window.Razorpay(options);

        // If you want to retreive the chosen payment method.
        rzp1.on('payment.submit', (response) => {
            paymentMethod.current = response.method;
        });

        // To get payment id in case of failed transaction.
        rzp1.on('payment.failed', (response) => {
            paymentId.current = response.error.metadata.payment_id;
        });

        // to open razorpay checkout modal.
        rzp1.open();
    };


    // informing server about payment
    const handlePayment = async (status, orderDetails = {}) => {
        await Axios.post("http://localhost:8000/payment",
            {
                status,
                orderDetails,
            });
        if (status === "succeeded") {
            const resOrder = await fetch("http://localhost:8000/makeOrder", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ order: orderList, email: userData["email"], price: total, address, paymentStatus: status, orderId: orderDetails["orderId"] })
            });
            const resData = await resOrder.json();
            if (resOrder.ok) {
                toast.success(resData.msg);
            } else {
                toast.error(resData.msg);
            }
        }
    };


    const options = {
        key: "rzp_test_AD88GErZRnFY7V", // key id from props but been used directly
        amount, // Amount in lowest denomination from props
        currency, // Currency from props.
        name: 'Pizza Delivery Service', // Title for your organization to display in checkout modal
        // image, // custom logo  url
        order_id: orderId, // order id from props
        // This handler menthod is always executed in case of succeeded payment
        handler: (response) => {
            console.log(response);
            paymentId.current = response.razorpay_payment_id;

            // Most important step to capture and authorize the payment. This can be done of Backend server.
            const succeeded = crypto.HmacSHA256(`${orderId}|${response.razorpay_payment_id}`, "zuprjSXKrG1ybXqzzBocOnre").toString() === response.razorpay_signature;

            // If successfully authorized. Then we can consider the payment as successful.
            if (succeeded) {
                handlePayment('succeeded', {
                    orderId,
                    paymentId,
                    signature: response.razorpay_signature,
                });
                toast.success('Payment Done');

            } else {
                handlePayment('failed', {
                    orderId,
                    paymentId: response.razorpay_payment_id,
                });
                toast.error("Payment Failed");
            }
            setDisplayRazorpay(false);
        },
        modal: {
            confirm_close: true, // this is set to true, if we want confirmation when clicked on cross button.
            // This function is executed when checkout modal is closed
            // There can be 3 reasons when this modal is closed.
            ondismiss: async (reason) => {
                const {
                    reason: paymentReason, field, step, code,
                } = reason && reason.error ? reason.error : {};
                // Reason 1 - when payment is cancelled. It can happend when we click cross icon or cancel any payment explicitly. 
                if (reason === undefined) {
                    toast.error('cancelled');
                    handlePayment('Cancelled');
                }
                // Reason 2 - When modal is auto closed because of time out
                else if (reason === 'timeout') {
                    toast.error('timedout');
                    handlePayment('timedout');
                }
                // Reason 3 - When payment gets failed.
                else {
                    toast.error('failed');
                    handlePayment('failed', {
                        paymentReason, field, step, code,
                    });
                }
            },
        },
        // This property allows to enble/disable retries.
        // This is enabled true by default. 
        retry: {
            enabled: false,
        },
        timeout: 300, // Time limit in Seconds
        theme: {
            color: '#F98866', // Custom color for your checkout modal.
        },
    };

    useEffect(() => {
        console.log('in razorpay');
        displayRazorpay(options);
    }, []);

    return null;
};

export default RenderRazorpay;