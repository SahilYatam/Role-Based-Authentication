import Joi from "joi";

const getAllRolesSchema = Joi.object({});

const getRoleByKeySchema = {
  params: Joi.object({
    key: Joi.string().trim().min(2).max(50).required(),
  }),
};

const getDefaultRolesSchema = Joi.object({});

const assignRoleToUserSchema = {
  params: Joi.object({
    key: Joi.string().trim().min(2).max(50).required(),
  }),
  body: Joi.object({
    newRoleKey: Joi.string().trim().min(2).max(50).required(),
  }),
};

const updateRolePermissionsSchema = {
  params: Joi.object({
    id: Joi.string().trim().length(24).hex().required(),
  }),
  body: Joi.object({
    permissions: Joi.array().items(Joi.string().trim().min(3).max(100)).min(1).required(),
  }),
};

const deleteRoleSchema = {
  params: Joi.object({
    id: Joi.string().trim().length(24).hex().required(),
    key: Joi.string().trim().min(2).max(50).required(),
  }),
};

export const roleValidate = {
  assignRoleToUserSchema,
  updateRolePermissionsSchema,
  deleteRoleSchema,
  getRoleByKeySchema,
  getAllRolesSchema,
  getDefaultRolesSchema,
};