const [User, Ingredient, Otp, Admin] = require('../Models/appModel');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const validator = require("validator");
const Razorpay = require('razorpay');
const crypto = require('crypto');

const register = async (req, res) => {
    try {
        const { name, username, email, phone, password } = new User(req.body);
        const chkUserMail = await User.findOne({ email });
        const chkUsername = await User.findOne({ username });

        if (chkUserMail) {
            return res.status(400).json({ msg: "Email Already Exits" });
        }
        else {
            if (chkUsername) {
                return res.status(400).json({ msg: "Username Not Available" });
            }
            else {
                const result = await User.create({ name, username, email, phone, password });
                res.status(201).json({
                    msg: "User Created Successfully",
                    token: await result.generateToken(),
                    userId: result._id.toString(),
                });
            }
        }
    } catch (err) {
        console.log(err);
        next(err);
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userExist = await User.findOne({ email });

        if (!userExist) {
            res.status(401).json({ msg: 'Invalid Credentials' });
        } else {

            const user = await userExist.verifyPassword(password);

            if (!user) {
                res.status(401).json({ msg: "invalid email or password" });
            } else {

                res.status(200).json({
                    msg: "Login Successfull",
                    token: await userExist.generateToken(),
                    userId: userExist._id.toString(),
                });
            }
        }
    } catch (err) {
        next(err);
    }
}

const updateingred = async (req, res) => {
    try {
        const { _id, price, stock } = req.body;
        const result = await Ingredient.updateOne({ _id }, { $set: { price, stock } });

        if (result) {
            return res.status(200).json({ msg: "Update Successfull" });
        } else {
            res.status(500).json({ msg: "Update Failed" });
        }
    } catch (error) {
        err = { status: 400 };
        next(err);
    }
};

const ingredient = async (req, res) => {
    try {
        const result = await Ingredient.find();
        if (!result) {
            res.status(500).json({ msg: 'Internal Server Error' });
        } else {
            res.status(200).send(result);
        }
    } catch (error) {
        console.error(error);
    }
}

const userData = async (req, res) => {
    try {
        const result = await User.find({}, { password: 0, cart: 0, orders: 0 });
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(500).json({ msg: "Internal Server Error" });
        }
    } catch (error) {
        console.log(error);
    }
}

const userinfo = async (req, res) => {
    try {
        const { token } = req.body;
        const result = await jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log(result);
        if (result) {
            const { userId } = result;
            const userdata = await User.findOne({ _id: userId }).select({ password: 0, cart: 0, orders: 0 });
            res.status(200).json(userdata);
        } else {
            res.status(500).json({ msg: 'Internal Server Error' });
        }
    } catch (error) {
        console.log(error);
    }
}

const generateOTP = () => {
    let digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 4; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
};

const sendmail = async (req, res) => {
    try {
        const { email } = req.body;
        if (validator.isEmail(email)) {
            const userExist = await User.findOne({ email });
            if (userExist) {
                res.status(400).json({ msg: "Email is already in use." });
                return;
            } else {
                const otp = generateOTP();
                let transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: process.env.AUTH_ID,
                        pass: process.env.AUTH_PASS,
                    },
                });

                const info = await transporter.sendMail({
                    from: '"Pizza Delivery Service" <instaidanime@gmail.com>', // sender address
                    to: `${email}`, // list of receivers
                    subject: "To Register on Pizza Delivery Service", // Subject line
                    text: "Registration OTP", // plain text body
                    html: `<b>Your OTP for registration on Pizza Delivery Service is ${otp}</b>`, // html body
                });

                if (info) {
                    await Otp.create({ email, otp });
                    res.status(200).json({ msg: "OTP Sent Successfully", });
                } else {
                    res.status(500).json({ msg: "Internal Server Error" });
                }
            }
        } else {
            res.status(400).json({ msg: "Incorrect Email" });
        }
    } catch (error) {
        console.log(error);
    }
}

const varifyMail = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const result = await Otp.findOne({ email });
        if (result) {
            const OTP = result.otp;
            if (OTP === otp) {
                res.status(200).json({ msg: "Email Verified" });
            } else {
                res.status(400).json({ msg: "Wrong OTP" });
            }
        }
    } catch (error) {
        console.log(error);
    }
};

const addToCart = async (req, res) => {
    try {
        const { token, ingredients, price } = req.body;
        const result = await jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (result) {
            const { userId } = result;
            console.log(ingredients, price);
            const response = await User.updateOne({ _id: userId }, { $push: { cart: { ingredients, price } } });
            if (response) {
                console.log(response);
                res.status(200).json({ msg: "Added to Cart" });
            } else {
                res.status(500).json({ msg: "Item not added to the Cart" });
            }
        }
    } catch (error) {
        console.log(error);
    }
}

const deleteFromCart = async (req, res) => {
    try {
        const { _id, email } = req.body;
        const response = await User.updateOne({ email }, { $pull: { "cart": { _id } } });
        if (response) {
            res.status(200).json({ msg: "Deleted Item from Cart" });
        } else {
            res.status(500).json({ msg: "Failed to Delete" });
        }
    } catch (error) {
        console.log(error);
    }
}

const createPayment = async (req, res) => {
    const razorpay = new Razorpay({
        key_id: process.env.RAZOR_ID,
        key_secret: process.env.RAZOR_PASS,
    });

    const options = {
        amount: req.body.amount,
        currency: req.body.currency,
        receipt: "",
        payment_capture: 1
    };
    try {
        const response = await razorpay.orders.create(options)
        res.json({
            order_id: response.id,
            currency: response.currency,
            amount: response.amount,
        })
    } catch (err) {
        res.status(400).send('Not able to create order. Please try again!');
    }
}

const paymentCapture = (req, res) => {
    const { orderDetails } = req.body;
    const data = crypto.createHmac('sha256', "zuprjSXKrG1ybXqzzBocOnre");

    console.log(orderDetails);

    data.update(`${orderDetails["orderId"]}|${orderDetails.paymentId['current']}`)

    const digest = data.digest('hex')

    if (digest === orderDetails["signature"]) {

        console.log('request is legit')

        //We can send the response and store information in a database.

        res.json({

            status: 'ok'

        })

    } else {
        res.status(400).send('Invalid signature');

    }
}

const refund = async (req, res) => {

    try {

        //Verify the payment Id first, then access the Razorpay API.

        const options = {

            payment_id: req.body.paymentId,

            amount: req.body.amount,

        };

        const razorpayResponse = await Razorpay.refund(options);

        //We can send the response and store information in a database

        res.send('Successfully refunded')

    } catch (error) {

        console.log(error);

        res.status(400).send('unable to issue a refund');

    }
}

const makeOrder = async (req, res) => {
    try {
        const { order, email, price, address, orderId, paymentStatus, name, phone } = req.body;
        const resultUser = await User.updateOne({ email }, { $push: { orders: { orderId, paymentStatus } } });
        const resultAdmin = await Admin.create({ order, name, phone, price, address, orderId, paymentStatus });
        if (order[0]['_id']) {
            await User.updateOne({ email }, { $set: { cart: [] } })
        }
        if (resultUser && resultAdmin) {
            res.status(200).json({ msg: "Ordered Successfully" });
        } else {
            res.status(500).json({ msg: "Order Failed" });
        }
    } catch (error) {
        console.log(error);
    }
}

const recentOrders = async (req, res) => {
    const { email } = req.body;
    try {
        const result = await User.find({ email }).select({ orders: 1 }).slice('orders', -5);
        if (result) {
            res.status(200).send(result);
        } else {
            res.status(500).send("Internal Server Error");
        }
    } catch (error) {
        console.log(error);
    }
}

const cartItems = async (req, res) => {
    const { email } = req.body;
    try {
        const result = await User.find({ email }).select({ cart: 1 });
        if (result) {
            res.status(200).send(result);
        } else {
            res.status(500).send("Internal Server Error");
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = { register, login, ingredient, updateingred, userData, userinfo, sendmail, varifyMail, addToCart, deleteFromCart, paymentCapture, refund, createPayment, makeOrder, recentOrders, cartItems };