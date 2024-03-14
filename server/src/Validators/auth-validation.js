const { z } = require('zod');

const signupSchema = z.object({
    name: z
        .string({ required_error: "Name is required" }),
    username: z
        .string({ required_error: "UserName is required" })
        .trim()
        .min(3, { message: "UserName must be atleast of 3 characters." })
        .max(30, { message: "UserName must be under 30 characters" }),
    email: z
        .string({ required_error: 'Email.is Required' })
        .trim()
        .email({ message: "Invalid email address" }),
    phone: z
        .string({ required_error: 'Phone number is required' })
        .trim()
        .min(10, { message: "Phone number must be atleast of 10 digits" })
        .max(20, { message: "Phone number must be atmost of 20 digits" }),
    password: z
        .string({ required_error: "Password is required" })
        .trim()
        .min(7, { message: "Password must be atleast of 8 characters." })
        .max(30, { message: "Password should be atmost of 30 charaters" })
});

const loginSchema = z.object({
    email: z
        .string({ required_error: 'Email.is Required' })
        .trim()
        .email({ message: "Invalid email address" }),
    password: z
        .string({ required_error: "Password is required" })
        .trim()
        .min(8, { message: "Password must be atleast of 8 characters." })
        .max(30, { message: "Password should be atmost of 30 charaters" })
});

const itemSchema = z.object({
    name: z
        .string({ required_error: 'Item Name is required' })
        .trim(),
    price: z
        .number({ required_error: "Price of item is required" }),
    stock: z
        .number({ required_error: "Stock can,t be zero" }),
    description: z
        .string(),
});

module.exports = { signupSchema, loginSchema, itemSchema };