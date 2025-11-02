import Joi from "joi";

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

const applyRoleRequestSchema = Joi.object({
  requestedRole: Joi.alternatives()
    .try(
      Joi.string().trim().min(2).max(50),
      Joi.object({
        id: Joi.string().trim().regex(objectIdPattern).required().messages({
          "string.pattern.base": "Role ID must be a valid MongoDB ObjectId",
          "string.empty": "Role ID cannot be empty",
          "any.required": "Role ID is required",
        }),
        key: Joi.string().trim().min(2).max(50).required().messages({
          "any.required": "Role key is required",
          "string.empty": "Role key cannot be empty",
          "string.min": "Role key must be at least 2 characters",
          "string.max": "Role key cannot exceed 50 characters",
        }),
      }).label('requestedRole')
    )
    .required()
    .messages({
      "any.required": "requestedRole is required",
      "alternatives.match": "requestedRole must be either a role key string or an object with id and key",
    }),
});

const approveRoleSchema = Joi.object({
  requestId: Joi.string().trim().regex(objectIdPattern).required().messages({
    "any.required": "Request ID is required",
    "string.empty": "Request ID cannot be empty",
    "string.pattern.base": "Request ID must be a valid MongoDB ObjectId",
  }),
});

const rejectRoleSchema = Joi.object({
  requestId: Joi.string().trim().regex(objectIdPattern).required().messages({
    "any.required": "Request ID is required",
    "string.empty": "Request ID cannot be empty",
    "string.pattern.base": "Request ID must be a valid MongoDB ObjectId",
  }),
});

const removeRequestNotificationSchema = Joi.object({
  requestId: Joi.string().trim().regex(objectIdPattern).required().messages({
    "any.required": "Request ID is required",
    "string.empty": "Request ID cannot be empty",
    "string.pattern.base": "Request ID must be a valid MongoDB ObjectId",
  }),
});

export const roleRequestValidate = {
  applyRoleRequestSchema,
  approveRoleSchema,
  rejectRoleSchema,
  removeRequestNotificationSchema,
};