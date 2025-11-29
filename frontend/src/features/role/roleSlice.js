import { createSlice } from "@reduxjs/toolkit";
import { assignRole, loadAllUser } from "./roleThunks.js";

const initialState = {
    users: [],
    successMessage: null,
    loading: false,
    error: null,
}

const roleSlice = createSlice({
    name: "role",
    initialState,

    reducers: {
        clearMessages(state) {
            state.successMessage = null,
            state.error = null
        }
    },

    extraReducers: (builder) => {
        builder

        .addCase(assignRole.pending, (state) => {
            state.loading = true
        })
        .addCase(assignRole.fulfilled, (state, action) => {
            state.loading = false;
            const {userId, role, successMsg} = action.payload;

            const userIndex = state.users.findIndex(u => u._id === userId);
            if(userIndex !== -1){
                state.users[userIndex].role = role;
            }

            state.successMessage = successMsg;

        })
        .addCase(assignRole.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload
        })

        // loadAllUsers
        .addCase(loadAllUser.pending, (state) => {
            state.loading = true;
        })
        .addCase(loadAllUser.fulfilled, (state, action) => {
            state.loading = false;
            state.users = action.payload;
        })
        .addCase(loadAllUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Failed to load users";
        })

    }
})

export const { clearMessages } = roleSlice.actions;
export default roleSlice.reducer;
