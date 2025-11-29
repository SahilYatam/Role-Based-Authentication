import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios.js";

export const applyRoleRequest = createAsyncThunk(
    "roleRequest/applyForRole",
    async (requestedRole, { rejectWithValue }) => {
        try {
            const res = await axios.post(
                "/roleRequest/apply-roleRequest",
                { requestedRole }
            );

            return {
                appliedRole: res?.data?.data?.roleRequested,
                message: res?.data?.message,
            };
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                "Unable to process role request. Please try again later.";

            return rejectWithValue(message);
        }
    }
);

export const getRoleRequests = createAsyncThunk(
    "roleRequest/roleRequest",
    async () => {
        const res = await axios.get("/roleRequest/get-role-request");
        return {
            requestedRoles: res.data.data.requestedRoles,
            message: res.data.message
        }
    }
)

export const approveRole = createAsyncThunk(
    "roleRequest/approveRole",
    async (requestId, { rejectWithValue }) => {
        try {
             const res = await axios.post(`/roleRequest/approve-role/${requestId}`);

            return {
                requestId: requestId,
                approvedRole: res.data.data,
                message: res.data.message,
            }
        } catch (error) {
            const message = error.response?.data?.message || "Something went wrong while approving role, please try again"
            return rejectWithValue(message);
        }
    }
);

export const rejectRole = createAsyncThunk(
    "roleRequest/rejectRole",
    async (requestId, { rejectWithValue }) => {
        try {
            const res = await axios.post(`/roleRequest/reject-role/${requestId}`);

            return {
                requestId: requestId,
                rejectedRole: res.data.data,
                message: res.data.message
            }
        } catch (error) {
            const message = error.response?.data?.message || "Something went wrong while rejecting role, please try again"
            return rejectWithValue(message);
        }
    }
);
