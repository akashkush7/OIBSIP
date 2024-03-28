const [User, Ingredient, Otp, Admin] = require('../Models/appModel');

const orderDetails = async (req, res) => {
    const { id } = req.body;
    console.log(id);
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

const updateStatus = async (req, res) => {
    const { orderId, orderStatus } = req.body;
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