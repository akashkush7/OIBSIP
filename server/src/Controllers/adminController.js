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

module.exports = { orderDetails };