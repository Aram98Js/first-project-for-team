import { body, validationResult } from "express-validator";


const loginValidator = [
    body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is Required")
        .isEmail()
    .withMessage("Please enter a valid email address"),

    body("password")
    .notEmpty()
    .withMessage("password is Required")
]

export {loginValidator, validationResult}