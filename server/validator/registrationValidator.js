import { body, validationResult } from "express-validator";

const registerValidator = [
    body("username")
    .trim()
   .notEmpty()
    .withMessage("Username us Required")
    .isLength({
        min: 2,
        max: 30
    })
    .withMessage("Username must be  from 2 to 30"),


    body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is Required")
    .isEmail()
    .withMessage("Please enter a valid email"),

      body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .withMessage("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."),

  body("confirmPassword")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match"),


  body("phoneNumber")
    .optional({ values: "falsy" })
    .matches(/^\+[1-9]\d{7,14}$/)
    .withMessage("Please enter a valid phone number"),

  body("country")
    .trim()
    .notEmpty()
    .withMessage("Country is required"),
]

export {registerValidator,validationResult}