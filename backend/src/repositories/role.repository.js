import { Role } from "../models/role.model.js";

const createRole = (data) => Role.create(data);

const findRoleById = (id) => Role.findById(id);

const findRoleByName = (name) => Role.findOne({name});

const findRoleByKey = (key) => Role.findOne({key});

const findAllRoles = () => Role.find().lean();

const updateRole = (id, updates) => Role.findByIdAndUpdate(id, updates, {new: true});

const deleteRole = (id) => Role.findByIdAndDelete(id);

export const roleRepo = {
    createRole,
    findRoleById,
    findRoleByName,
    findRoleByKey,
    findAllRoles,
    updateRole,
    deleteRole
}