import { createSlice } from "@reduxjs/toolkit";
import {
    registerUser,
    verifyOtp,
    validateCredentials,
    loadUser,
    logoutUser,
    loginUser,
    forgetPasswordRequest,
    resetPassword,
} from "./authThunks";

const initialState = {
    userId: null,
    user: null,
    role: "MEMBER",
    loading: false,
    otpVerified: false,
    error: null,
    successMessage: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,

    reducers: {
        logout(state) {
            state.user = null;
        },
        clearMessages(state){
            state.successMessage = null;
            state.error = null;
        }
    },

    extraReducers: (builder) => {
        builder
            // register
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.userId = action.payload.userId; // store userId in redux
                localStorage.setItem("tempUserId", action.payload.userId); // localStorage for next steps
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // verify-otp
            .addCase(verifyOtp.pending, (state) => {
                state.loading = true;
            })
            .addCase(verifyOtp.fulfilled, (state, action) => {
                state.loading = false;
                state.otpVerified = action.payload;
            })
            .addCase(verifyOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // validate-credentials
            .addCase(validateCredentials.pending, (state) => {
                state.loading = true;
            })
            .addCase(validateCredentials.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.role = action.payload.role;
                localStorage.removeItem("tempUserId");
            })

            // loadUser
            .addCase(loadUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(loadUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })

            // logoutUser
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
            })

            // loginUser
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ForgetPasswordReuqest
            .addCase(forgetPasswordRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(forgetPasswordRequest.fulfilled, (state, action) => {
                state.loading = false;
                state.successMessage = action.payload;
            })
            .addCase(forgetPasswordRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ResetPassowrd
            .addCase(resetPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(resetPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.successMessage = action.payload; // “Password reset successful”
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});
export const { clearMessages, logout } = authSlice.actions;
export default authSlice.reducer;
