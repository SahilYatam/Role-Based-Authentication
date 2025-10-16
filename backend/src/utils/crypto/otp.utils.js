import crypto from "crypto";

export const generateOtp = () => {
    let otp = '';
    for(let i = 0; i < 6; i++){
        const digit = crypto.randomInt(0, 10);
        otp += digit.toString();
    }
    return otp;
}