import {configureStore}  from "@reduxjs/toolkit"
import authReducer from "../features/auth/authSlice.js"
import taskReducer from "../features/task/taskSlice.js"
import roleReducer from "../features/role/roleSlice.js"
import roleRequestReducer from "../features/roleRequest/roleRequestSlice.js"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        task: taskReducer,
        role: roleReducer,
        roleRequest: roleRequestReducer,
    }
})