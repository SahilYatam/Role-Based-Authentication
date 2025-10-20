import { Task } from "../models/task.model.js";
import { taskRepo } from "../repositories/task.repository.js";
import { logger, ApiError } from "../utils/index.js";

export const taskService = {
    async createTask (userId, data) {
        const task = await taskRepo.createTask({ 
            userId, 
            taskName: data.taskName, 
            taskDescription: data.taskDescription
        });

        return task;
    },

    async updateTask (id, data) {
        const updatedTask = await taskRepo.updateTask(id, data)
        return updatedTask;
    },

    async deleteTask (id) {
        const deletedTask = await taskRepo.deleteTask(id);
        if (!deletedTask) throw new ApiError(404, "Task not found or already deleted");
        return deletedTask;
    },

    async getAllTask () {
        const task = await taskRepo.findAllTasks();
        if(task.length === 0) return {message: "No tasks found. Please create a new task to get started."};
        return task;
    },

    async markTaskAsCompleted (id) {
        const taskCompleted = await taskRepo.updateTask(id, {isCompleted: true});
        if(!taskCompleted) throw new ApiError(403, "Task not found or already completed");
        return taskCompleted;
    },

    async getCompletedTasks () {
        const completedTasks = await taskRepo.findAllTasks();
        const filteredTasks = completedTasks.filter(task => task.isCompleted);

        if(filteredTasks.length === 0){
            return {message: "No completed task found."};
        }

        return filteredTasks;
    },

    async getUserCompletedTasks (userId){
        const completedTasks = await taskRepo.findCompletedTasksByUserId(userId);

        if(completedTasks.length === 0){
            return {message: "You haven't completed any tasks yet."};
        }
        return completedTasks;
    }

}
