import Joi from "joi";

/* ---------------------------------------------------------
   1️⃣  GET ALL ROLES
   --------------------------------------------------------- */
// No parameters required, but you could optionally support query params later
const getAllRolesSchema = Joi.object({});

/* ---------------------------------------------------------
   2️⃣  GET ROLE BY KEY
   --------------------------------------------------------- */
const getRoleByKeySchema = Joi.object({
  key: Joi.string().trim().min(2).max(50).required().messages({
    "any.required": "Role key is required",
    "string.empty": "Role key cannot be empty",
    "string.min": "Role key must be at least 2 characters long",
    "string.max": "Role key cannot exceed 50 characters",
  }),
});

/* ---------------------------------------------------------
   3️⃣  GET DEFAULT ROLES
   --------------------------------------------------------- */
// No params or body needed
const getDefaultRolesSchema = Joi.object({});

/* ---------------------------------------------------------
   4️⃣  ASSIGN ROLE TO USER
   --------------------------------------------------------- */
const assignRoleToUserSchema = {
  params: Joi.object({
    key: Joi.string().trim().min(2).max(50).required().messages({
      "any.required": "Acting user key is required",
      "string.empty": "Acting user key cannot be empty",
      "string.min": "Acting user key must be at least 2 characters long",
      "string.max": "Acting user key cannot exceed 50 characters",
    }),
  }),

  body: Joi.object({
    newRoleKey: Joi.string().trim().min(2).max(50).required().messages({
      "any.required": "New role key is required",
      "string.empty": "New role key cannot be empty",
      "string.min": "New role key must be at least 2 characters long",
      "string.max": "New role key cannot exceed 50 characters",
    }),
  }),
};

/* ---------------------------------------------------------
   5️⃣  UPDATE ROLE PERMISSIONS
   --------------------------------------------------------- */
const updateRolePermissionsSchema = {
  params: Joi.object({
    id: Joi.string().trim().regex(/^[0-9a-fA-F]{24}$/).required().messages({
      "any.required": "Role ID is required",
      "string.pattern.base": "Role ID must be a valid MongoDB ObjectId",
    }),
  }),

  body: Joi.object({
    permissions: Joi.array()
      .items(Joi.string().trim().min(3).max(100))
      .min(1)
      .required()
      .messages({
        "any.required": "Permissions list is required",
        "array.base": "Permissions must be an array",
        "array.min": "At least one permission must be provided",
        "string.min": "Each permission must be at least 3 characters long",
        "string.max": "Each permission cannot exceed 100 characters",
      }),
  }),
};

/* ---------------------------------------------------------
   6️⃣  DELETE ROLE
   --------------------------------------------------------- */
const deleteRoleSchema = {
  params: Joi.object({
    id: Joi.string().trim().regex(/^[0-9a-fA-F]{24}$/).required().messages({
      "any.required": "Role ID is required",
      "string.pattern.base": "Role ID must be a valid MongoDB ObjectId",
    }),

    key: Joi.string().trim().min(2).max(50).required().messages({
      "any.required": "Acting user key is required",
      "string.empty": "Acting user key cannot be empty",
      "string.min": "Acting user key must be at least 2 characters long",
      "string.max": "Acting user key cannot exceed 50 characters",
    }),
  }),
};

export const roleValidate = {
    assignRoleToUserSchema,
    updateRolePermissionsSchema,
    deleteRoleSchema,
    getRoleByKeySchema,
    getAllRolesSchema,
    getDefaultRolesSchema
}