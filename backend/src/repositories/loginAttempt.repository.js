import { LoginAttempt } from "../models/loginAttempt.model.js";


const createAttempt = (data) => LoginAttempt.create(data);

const findByEmailAndIP = (email, ip) => LoginAttempt.findOne({ email, ip });

const incrementAttempt = async (email, ip) => {
    return await LoginAttempt.findOneAndUpdate(
        {email, ip},
        {$inc: {attempts: 1}, $set: { lastAttemptAt: new Date() }},
        {new: true, upsert: true} // upsert ensures a record exists
    );
};

const resetAttempts = async (email, ip) => {
    return await LoginAttempt.findOneAndUpdate(
        {email, ip},
        {attempts: 0, isBlocked: false, blockedUntil: null},
        {new: true}
    );
};

const blockTemporarily = async (email, ip) => {
    const blockedUntil = new Date(Date.now() + 30 * 60 * 1000);
    return await LoginAttempt.findOneAndUpdate(
        {email, ip},
        {isBlocked: true, blockedUntil},
        {new: true}
    );
};

const blockPermanently = async (email, ip) => {
    return await LoginAttempt.findOneAndUpdate(
        {email, ip},
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