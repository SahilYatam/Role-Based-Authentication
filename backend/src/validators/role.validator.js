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
    id: Joi.string().trim().min(2).max(50).required(),
  }),
  body: Joi.object({
    newRoleKey: Joi.string().trim().min(2).max(50).required(),
  }),
};

export const roleValidate = {
  assignRoleToUserSchema,
  getRoleByKeySchema,
  getAllRolesSchema,
  getDefaultRolesSchema,
};