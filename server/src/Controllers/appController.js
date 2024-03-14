const [User, Ingredient, Otp] = require('../Models/appModel');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const validator = require("validator");

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
        const { name, price, stock, description } = req.body;
        const itemExist = await Ingredient.findOne({ name });

        if (itemExist) {
            return res.status(400).send("Item Already Exits");
        } else {
            const result = await Ingredient.create({ name, price, stock, description });
            res.status(200).json({ msg: "Item Added" });
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
        const result = await User.find({}, { password: 0 });
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
            const userdata = await User.findOne({ _id: userId }).select({ password: 0 });
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
                        user: "instaidanime@gmail.com",
                        pass: "usqdusszkmfzvotp",
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

module.exports = { register, login, ingredient, updateingred, userData, userinfo, sendmail, varifyMail };