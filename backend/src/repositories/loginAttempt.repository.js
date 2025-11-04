import { LoginAttempt } from "../models/loginAttempt.model.js";


const createAttempt = (data) => {
    return LoginAttempt.create(data)
};

const findByEmailAndIP = (email, ip) => {
    const userEmail = email.trim().toLowerCase();
    return  LoginAttempt.findOne({ email: userEmail, ip })
};

const incrementAttempt = async (email, ip) => {
    const userEmail = email.trim().toLowerCase();
    return await LoginAttempt.findOneAndUpdate(
        {email: userEmail, ip},
        {$inc: {attempts: 1}, $set: { lastAttemptAt: new Date() }},
        {new: true, upsert: true} // upsert ensures a record exists
    );
};

const resetAttempts = async (email, ip) => {
    const userEmail = email.trim().toLowerCase();
    return await LoginAttempt.findOneAndUpdate(
        {email: userEmail, ip},
        {attempts: 0, isBlocked: false, blockedUntil: null},
        {new: true}
    );
};

const blockTemporarily = async (email, ip) => {
    const userEmail = email.trim().toLowerCase();
    const blockedUntil = new Date(Date.now() + 30 * 60 * 1000);
    return await LoginAttempt.findOneAndUpdate(
        {email: userEmail, ip},
        {isBlocked: true, blockedUntil},
        {new: true}
    );
};

const blockPermanently = async (email, ip) => {
    const userEmail = email.trim().toLowerCase();
    return await LoginAttempt.findOneAndUpdate(
        {email: userEmail, ip},
        {permanentlyBlocked: true, isBlocked: true},
        {new: true}
    );
};

export const loginAttemptRepo = {
    createAttempt,
    findByEmailAndIP,
    incrementAttempt,
    resetAttempts,
    blockTemporarily,
    blockPermanently
}