const [User, Ingredient, Otp, Admin] = require('../Models/appModel');
const nodemailer = require('nodemailer');

const orderDetails = async (req, res) => {
    const { id } = req.body;
    try {
        const result = await Admin.findOne({ orderId: id }).select({ _id: 0 });
        if (result) {
            res.status(200).send(result);
        } else {
            res.status(500).json({ msg: "Unable to Fetch Order Details" });
        }
    } catch (error) {
        console.log(error);
    }
};

const getOrders = async (req, res) => {
    try {
        const result = await Admin.find({ $and: [{ orderStatus: { $ne: "Delivered" } }, { orderStatus: { $ne: "Cancelled" } }] });
        if (result) {
            res.status(200).send(result);
        } else {
            res.status(500).json({ msg: "Failed to get Orders" })
        }
    } catch (error) {
        console.log(error);
    }
}

const sendMail = async (item) => {
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.AUTH_ID,
            pass: process.env.AUTH_PASS,
        },
    });

    const info = await transporter.sendMail({
        from: '"Pizza Delivery Service" <instaidanime@gmail.com>', // sender address
        to: process.env.ADMIN, // list of receivers
        subject: "Stocks are Low", // Subject line
        text: "Stocks are Low", // plain text body
        html: `<html>
                    <h1>The Following Stocks are very Low.</h1>
                    <ul>
                        <li><h3>Ingredient Name: ${item.name}</h3></li>
                        <li><h3>Available in Stocks: ${item.stock}</h3></li>
                    </ul
                </html>`,
    });
}

const updateStocks = async (item) => {
    const updateStock = await Ingredient.updateOne({ name: item.name }, { $set: { stock: item.stock } })
}

const updateStatus = async (req, res) => {
    //To update the stocks and the order Status.
    const { orderId, orderStatus } = req.body;
    if (orderStatus === "Out-For-Delivery") {
        let ingredients = {
            PizzaBase: 0,
            Sauces: 0,
            Cheese: 0,
            Protein: 0,
            Veggies: 0,
            Greens: 0,
        }
        try {
            const findOrder = await Admin.find({ orderId });
            if (findOrder) {
                findOrder[0]['order'].forEach((item) => {
                    let items = item['ingredients'];
                    Object.keys(items).forEach((curr) => {
                        if (typeof (curr) === Array) {
                            ingredients[curr] += curr.length;
                        } else {
                            ingredients[curr.replace(" ", "")] += 1;
                        }
                    })
                })
            }
            const getIng = await Ingredient.find();
            getIng.forEach((item) => {
                item['stock'] -= ingredients[item['name'].replace(" ", "")]
                if (item['stock'] < 30) {
                    sendMail(item);
                }
                updateStocks(item);
            })
        } catch (error) {
            console.log(error);
        }
    }
    try {
        const result = await Admin.updateOne({ orderId }, { $set: { orderStatus } });
        if (result) {
            res.status(200).json({ msg: "Order Status Update Successfull" });
        } else {
            res.status(500).json({ msg: "Failed to Update Order Status" });
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = { orderDetails, getOrders, updateStatus };