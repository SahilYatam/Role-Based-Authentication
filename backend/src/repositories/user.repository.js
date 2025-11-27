import { Role } from "../models/role.model.js";
import { User } from "../models/user.model.js";

const findByEmail = (email) => {
    const userEmail = email.toLowerCase().trim();
    return User.findOne({email: userEmail}).populate('role').lean();
}
const findById = (id) => {
    return User.findById(id)
        .populate("role", "key name")
        .lean()
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

const updateUserRole = (userId, roleId) =>{
    return User.findByIdAndUpdate(userId, 
        { role: roleId }, 
        { new: true })
        .populate("role")
};

const findUserByRoleKey = async (roleKey) => {
    const role = await Role.findOne({key: roleKey});
    if(!role){
        return [];
    }

    return User.find({role: role._id})
        .populate("role", "key name")
        .select("name email role") 
        .lean();
}

const findAllUserWithRoles = () => {
    return User.find()
        .populate("role", "key name")
        .select("name role")
        .lean();
}

export const userRepo = {
    findByEmail,
    findById,
    findByIdWithRole,
    createUser,
    updateById,
    findByResetToken,
    updateUserRole,
    findUserByRoleKey,
    findAllUserWithRoles
};