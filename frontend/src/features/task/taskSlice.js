import { createSlice } from "@reduxjs/toolkit";
import {
    addTask,
    updateTask,
    deleteTask,
    getAllTask,
    markTaskAsCompleted,
    getCompletedTasks,
} from "./taskThunks.js";

const initialState = {
    task: [],
    successMessage: null,
    error: null,
    loading: false,
}

const taskSlice = createSlice({
    name: "task",
    initialState,

    reducers: {},

    extraReducers: (builder) => {
        builder
            // Fetch all task
            .addCase(getAllTask.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllTask.fulfilled, (state, action) => {
                state.loading = false;
                state.task = action.payload;
            })
            .addCase(getAllTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Create task
            .addCase(addTask.fulfilled, (state, action) => {
                state.task.push(action.payload);
            })

            // Update task
            .addCase(updateTask.fulfilled, (state, action) => {
                const index = state.task.findIndex(t => t._id === action.payload._id);
                if (index !== -1) {
                    state.task[index] = action.payload;
                }
            })

            // Delete task
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.task = state.task.filter(t => t._id !== action.payload)
            })

            // MarkCompleted task
            .addCase(markTaskAsCompleted.fulfilled, (state, action) => {
                const task = state.task.find(t => t._id === action.payload._id);
                if (task) {
                    Object.assign(task, action.payload);
                }
            })

            // GetCompleted task
            .addCase(getCompletedTasks.pending, (state) => {
                state.loading = true
            })
            .addCase(getCompletedTasks.fulfilled, (state, action) => {
                state.loading = false;
                state.task = action.payload
            })
            .addCase(getCompletedTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload
            })

    }

});

export default taskSlice.reducer;