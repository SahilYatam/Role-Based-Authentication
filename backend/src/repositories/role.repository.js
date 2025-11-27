const getModel = async () => {
    const { Role } = await import("../models/role.model.js");
    return Role;
};

const createRole = async (data) => {
    const Role = await getModel();
    return Role.create(data);
};

const findRoleByKey = async (key) => {
    const Role = await getModel();
    return Role.findOne({ key }).lean();
};

const findRoleById = async (id) => {
    const Role = await getModel();
    return Role.findById(id).lean();
};

const findAllRoles = async () => {
    const Role = await getModel();
    return Role.find().lean();
};

const updateRole = async (id, updates) => {
    const Role = await getModel();
    return Role.findByIdAndUpdate(id, updates, { new: true }).lean();
};

const deleteRole = async (id) => {
    const Role = await getModel();
    return Role.findByIdAndDelete(id);
};

export const roleRepo = {
    createRole,
    findRoleByKey,
    findRoleById,
    findAllRoles,
    updateRole,
    deleteRole,
};