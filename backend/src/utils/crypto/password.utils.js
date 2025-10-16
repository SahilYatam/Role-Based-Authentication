import bcrypt from "bcrypt";

export const hashPassword = async (password) => {
    const salt = bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

export const comparePassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
}
