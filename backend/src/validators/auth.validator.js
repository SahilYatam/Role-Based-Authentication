import Joi from "joi";

const registerSchema = Joi.object({
    email: Joi.string().email({tlds: {allow: false}}).trim().lowercase().required().messages({
        "any.required": "Email is required",
        "string.email": "Email must be a valid email address",
        "string.base": "Email must be a string",
        "string.empty": "Email cannot be empty"
    }),
});

const verifyOtpSchema = {
  body: Joi.object({
    otp: Joi.string()
      .trim()
      .length(6) // assuming a 6-digit OTP, change as needed
      .pattern(/^\d+$/)
      .required()
      .messages({
        "string.base": "OTP must be a string",
        "string.empty": "OTP is required",
        "string.length": "OTP must be exactly 6 digits",
        "string.pattern.base": "OTP must contain only numeric digits",
        "any.required": "OTP is required",
      }),
  }),

  params: Joi.object({
    userId: Joi.string()
      .required()
      .messages({
        "string.base": "User ID must be a string",
        "string.empty": "User ID cannot be empty",
        "any.required": "User ID is required",
      }),
  }),
};


const nameAndPasswordSchema = Joi.object({
    name: Joi.string().trim().min(2).max(20).required().messages({
        "any.required": "Name is required",
        "string.base": "Name must be a string",
        "string.empty": "Name cannot be empty",
        "string.min": "Name must be at least 2 characters long",
        "string.max": "Name must be at most 20 characters long",
    }),

    password: Joi.string().min(8).max(16).pattern(new RegExp("^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$")).required().messages({
        "any.required": "Password is required",
        "string.min": "Password must be at lease 8 characters long",
        "string.max": "Password cannot exceed 20 characters",
        "string.pattern.base": "Password must contain at least one latter and one number",
        "stringe.empty": "Password cannot be empty",
    })
});

const loginSchema = Joi.object({
    email: Joi.string().email().trim().lowercase().required().messages({
        "string.email": "Email must be valid",
        "any.required": "Email is required",
        "string.empty": "Email cannot be empty"
    }),

    password: Joi.string().min(8).max(16).required().messages({
        "any.required": "Password is required",
        "string.empty": "Password cannot be empty",
    })
});

const logoutSchema = Joi.object({
    refreshToken: Joi.string().required().messages({
        "any.required": "Refresh token is required to logout",
        "string.empty": "Refresh token cannot be empty"
    })
});

const forgetPasswordSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } }) // disables TLD restriction like `.com` only
    .trim()
    .lowercase()
    .required()
    .messages({
      "string.email": "Please enter a valid email address.",
      "any.required": "Email is required.",
    }),
});

const resetPasswordSchema = Joi.object({
    password: Joi.string().pattern(new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,30}$"
    )).required()
    .messages({
      "string.pattern.base":
        "Password must be 8–30 characters, include uppercase, lowercase, number, and special character.",
      "any.required": "Password is required.",
    }),
});

export const authValidate = {
    registerSchema,
    verifyOtpSchema,
    nameAndPasswordSchema,
    loginSchema,
    logoutSchema,
    forgetPasswordSchema,
    resetPasswordSchema
}