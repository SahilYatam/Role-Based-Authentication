import { createSlice } from "@reduxjs/toolkit";
import {
  applyRoleRequest,
  getRoleRequests,
  approveRole,
  rejectRole,
} from "./roleRequestThunks.js";


const initialState = {
    myRequest: null, // Current user's request
    allRequests: [], // For superAdmin/admin - all pending requests
    successMsg: null,
    loading: false,
    error: null,
}

const roleRequestSlice = createSlice({
    name: "roleRequest",
    initialState,

    reducers: {
        clearMessages(state) {
            state.successMsg = null,
            state.error = null
        },
    },

    extraReducers: (builder) => {
        builder
        // for user to apply role
        .addCase(applyRoleRequest.pending, (state) => {
            state.loading = true
        })
        .addCase(applyRoleRequest.fulfilled, (state, action) => {
            state.loading = false;
            state.myRequest = action.payload.appliedRole;
            state.successMsg = action.payload.message;
        })
        .addCase(applyRoleRequest.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        // Admin gets all requests
        .addCase(getRoleRequests.pending, (state) => {
            state.loading = true;
        })
        .addCase(getRoleRequests.fulfilled, (state, action) => {
            state.loading = false;
            state.allRequests = action.payload.requestedRoles;
            state.successMsg = action.payload.message;
        })

        // Admin approves request
        .addCase(approveRole.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(approveRole.fulfilled, (state, action) => {
            state.loading = false;
            const { requestId, message } = action.payload;
            
            // Remove from pending requests
            state.allRequests = state.allRequests.filter(
                req => req._id !== requestId
            );
            state.successMsg = message;
        })
        .addCase(approveRole.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        // Admin rejects request
        .addCase(rejectRole.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(rejectRole.fulfilled, (state, action) => {
            state.loading = false;
            const { requestId, message } = action.payload;
            
            // Remove from pending requests
            state.allRequests = state.allRequests.filter(
                req => req._id !== requestId
            );
            state.successMsg = message;
        })
        .addCase(rejectRole.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
    }
});

export const {clearMessages} = roleRequestSlice.actions;
export default roleRequestSlice.reducer;
