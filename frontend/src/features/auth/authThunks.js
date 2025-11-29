import { createAsyncThunk } from "@reduxjs/toolkit"
import axios from "../../api/axios.js"

// returns user + userId
export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (email, {rejectWithValue}) => {
        try {
            const res = await axios.post("/auth/register", {email});
            return res.data.data.user; // contains user._id
        } catch (error) {
            const message = error.response?.data?.message || "Email already registered"
            return rejectWithValue(message)
        }
    }
);

// needs userId (userId will come from local storage) + otp
export const verifyOtp = createAsyncThunk(
    "auth/verifyOtp",
    async ({userId, otp}, {rejectWithValue}) => {
        try {
            const res = await axios.post("/auth/verifyOtp", {userId, otp});
            return res.data;
        } catch (error) {
            const message = error.response?.data?.message || "Invalid OTP"
            return rejectWithValue(message)
        }
    }
);

// VALIDATE CREDENTIALS → userId + name + password
export const validateCredentials = createAsyncThunk(
    "auth/validateCredentials",
    async ({userId, name, password}) => {
        const res = await axios.post("/auth/validate-credentials", {
            userId, name, password
        });

        // backend sets cookies here
        return res.data.data.user; // final user profile
    }
);

export const loadUser = createAsyncThunk(
    "user/me",
    async () => {
        const res = await axios.get("/user/me");
        return res.data.data.user;
    }
);

export const logoutUser = createAsyncThunk(
    "auth/logoutUser",
    async () => {
        const res = await axios.post("/auth/logout");
        return res.data;
    }
);

export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async ({email, password}, {rejectWithValue}) => {
        try {
            const res = await axios.post("/auth/login", {email, password});
            return res.data.data.user;
        } catch (error) {
            const message = error.response?.data?.message || "Invalid email or password"
            return rejectWithValue(message)
        }
    }
);

export const forgetPasswordRequest = createAsyncThunk(
    "auth/forget-password-request",
    
    async (email, thunkAPI) => {
        try {
            const res = await axios.post("/auth/forgetPassword-request", {email});
            return res.data.message || "Password reset link sent";
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Something went wrong, while sending password reset email"
            );
        }
    }
);

export const resetPassword = createAsyncThunk(
    "auth/resetPassword",
    async({token, password}, thunkAPI) => {
        try {
            const url = `/auth/reset-password/${token}`;
            
            const res = await axios.post(url, {
                password
            });
            return res.data.message || "Password reset successful";
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to reset password"
            )
        }
    }
)
