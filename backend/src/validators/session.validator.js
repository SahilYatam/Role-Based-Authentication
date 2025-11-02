import Joi from "joi";

export const refreshAccessTokenSchema = Joi.object({
  refreshToken: Joi.string().min(20).required().messages({
    'string.base': 'Refresh token must be a string',
    'string.empty': 'Refresh token cannot be empty',
    'string.min': 'Refresh token must be at least 20 characters',
    'any.required': 'Refresh token is required',
  })
}).unknown(true)