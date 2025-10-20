import { User } from "../models/user.model.js";

const findByEmail = (email) => {
    const userEmail = email.toLowerCase().trim();
    return User.findOne({email: userEmail}).lean();
}
const findById = (id) => User.findById(id).lean();
const createUser = (data) => User.create(data);
const updateById = (id, updates) => User.findByIdAndUpdate(id, updates, {new: true});
const findByResetToken = (token) => User.findOne({resetPasswordToken: token});

export const userRepo = {
    findByEmail,
    findById,
    createUser,
    updateById,
    findByResetToken
};