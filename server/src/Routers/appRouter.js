const express = require("express");
const router = express.Router();
const controller = require("../Controllers/appController");
const authSchema = require("../Validators/auth-validation");
const validate = require("../middlewares/validation_middleware");

router.route('/register').post(validate(authSchema.signupSchema), controller.register);

router.route('/login').post(validate(authSchema.loginSchema), controller.login);

router.route('/ingredient').post(validate(authSchema.itemSchema), controller.updateingred);

router.route('/ingredient').get(controller.ingredient);

router.route('/userinfo').post(controller.userinfo);

router.route('/admin/user').get(controller.userData);

router.route('/verification/mail').post(controller.sendmail);

router.route('/verification/otp').post(controller.varifyMail);

router.route('/cart').post(controller.addToCart);

router.route('/cart').patch(controller.deleteFromCart);

router.route('/payment').post(controller.paymentCapture);

router.route('/order').post(controller.createPayment);

router.route('/refund').post(controller.refund);

router.route('/makeOrder').post(controller.makeOrder);

module.exports = router;