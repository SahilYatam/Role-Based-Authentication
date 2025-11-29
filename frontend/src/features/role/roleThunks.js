import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios.js";

export const assignRole = createAsyncThunk(
    "role/assignRole",
    async ({id, newRoleKey}, {rejectWithValue}) => {
        try {
            const res = await axios.post(`/role/assign-role/${id}`, {newRoleKey}); 
            return {
                userId: id,
                role: res.data.data.role,
                successMsg: res.data.message,
            }
        } catch (error) {
            const message = error.response?.data?.message || "Error while assigning role"
            return rejectWithValue(message);
        }
    }
)

export const loadAllUser = createAsyncThunk(
    "user/users",
    async (roleKey, {rejectWithValue}) => {
        try {
            const res = await axios.get("/user/users", {
                params: roleKey ? {roleKey} : {}
            });
            return res.data.data || [];
        } catch (error) {
            const message = error.response?.data?.message || "Something went wrong";
            return rejectWithValue(message);
        }
    }
)