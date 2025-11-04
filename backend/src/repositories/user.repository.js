import { User } from "../models/user.model.js";

const findByEmail = (email) => {
    const userEmail = email.toLowerCase().trim();
    return User.findOne({email: userEmail}).lean();
}
const findById = (id) => {
    return User.findById(id).lean()
};

const createUser = (data) => {
    return User.create(data)
};

const updateById = (id, updates) => {
    return User.findByIdAndUpdate(id, updates, {new: true})
};

const findByIdWithRole = (id) => {
    return User.findById(id)
        .select("role")
        .populate("role", "name key permissions")
}

const findByResetToken = (token) => {
    return User.findOne({resetPasswordToken: token})
};

const assignRoleToUser = (userId, roleId) =>{
    return User.findByIdAndUpdate(userId, 
        { role: roleId }, 
        { new: true })
        .populate("role")
};


export const userRepo = {
    findByEmail,
    findById,
    findByIdWithRole,
    createUser,
    updateById,
    findByResetToken,
    assignRoleToUser
};