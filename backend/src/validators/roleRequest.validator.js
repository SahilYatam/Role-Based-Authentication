// validations/roleRequest.validation.js
import Joi from "joi";

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

/**
 * applyRoleRequest
 * - req.body must contain `requestedRole`
 * - `requestedRole` may be:
 *    - a string role key (e.g. "admin"), OR
 *    - an object { id: "<ObjectId>", key: "<roleKey>" }
 */
const applyRoleRequestSchema = Joi.object({
  requestedRole: Joi.alternatives()
    .try(
      Joi.string().trim().min(2).max(50),
      Joi.object({
        id: Joi.string().trim().regex(objectIdPattern).messages({
          "string.pattern.base": "requestedRole.id must be a valid MongoDB ObjectId",
          "string.empty": "requestedRole.id cannot be empty",
        }),
        key: Joi.string().trim().min(2).max(50).required().messages({
          "any.required": "requestedRole.key is required when requestedRole is an object",
          "string.empty": "requestedRole.key cannot be empty",
          "string.min": "requestedRole.key must be at least 2 characters",
          "string.max": "requestedRole.key cannot exceed 50 characters",
        }),
      }).required()
    )
    .required()
    .messages({
      "any.required": "requestedRole is required",
      "alternatives.match": "requestedRole must be either a role key string or an object with { id, key }",
    }),
});

/**
 * approveRole
 * - req.params.requestId required and must be an ObjectId
 */
const approveRoleSchema = Joi.object({
  requestId: Joi.string().trim().regex(objectIdPattern).required().messages({
    "any.required": "Request ID is required",
    "string.empty": "Request ID cannot be empty",
    "string.pattern.base": "Request ID must be a valid MongoDB ObjectId",
  }),
});

/**
 * rejectRole
 * - req.params.requestId required and must be an ObjectId
 */
const rejectRoleSchema = Joi.object({
  requestId: Joi.string().trim().regex(objectIdPattern).required().messages({
    "any.required": "Request ID is required",
    "string.empty": "Request ID cannot be empty",
    "string.pattern.base": "Request ID must be a valid MongoDB ObjectId",
  }),
});

/**
 * removeRequestNotification
 * - req.params.requestId required and must be an ObjectId
 */
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
    removeRequestNotificationSchema
}