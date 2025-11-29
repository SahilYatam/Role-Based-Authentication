import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios.js";

export const addTask = createAsyncThunk(
    "task/addTask",
    async ({ taskName, taskDescription }) => {
        const res = await axios.post("/task/create-task", { taskName, taskDescription })
        const task = res.data.data.task;

        return {
            ...task,
            completed: task.isCompleted
        };
    }
);

export const updateTask = createAsyncThunk(
    "task/updateTask",
    async ({ id, taskName, taskDescription }) => {
        const res = await axios.patch(`/task/update-task/${id}`, { taskName, taskDescription });
        return res.data.data.task
    }
);

export const deleteTask = createAsyncThunk(
    "task/deleteTask",
    async (id) => {
        await axios.delete(`/task/delete-task/${id}`);
        return id;
    }
);

export const getAllTask = createAsyncThunk(
    "task/getAllTask",
    async () => {
        const res = await axios.get("/task/all-task");
        const tasks = res.data.data.task;
        
        return tasks.map(task => ({
            ...task,
            completed: task.isCompleted
        }));
    }
);

export const markTaskAsCompleted = createAsyncThunk(
    "task/markTaskCompleted",
    async (id, { rejectWithValue }) => {
        try {
            const res = await axios.patch(`/task/mark-complete-task/${id}`);
            const task = res.data.data.task;

            return {
                ...task,
                completed: task.isCompleted
            };
        } catch (error) {
            const message = error.response?.data?.message || "Failed to mark task completed";
            return rejectWithValue(message);
        }
    }
);

export const getCompletedTasks = createAsyncThunk(
    "task/getCompletedTask",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get("/task/get-complete-task");
            return res.data.data.task;
        } catch (error) {
            const message = error.response?.data?.message || "No completed tasks found."
            return rejectWithValue(message)
        }
    }
)