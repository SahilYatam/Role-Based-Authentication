import { Task } from "../models/task.model.js"

const findTaskById = (id) => Task.findById(id).lean();

const createTask = (data) => Task.create(data);

const updateTask = (id, updates) => Task.findByIdAndUpdate(id, updates, {new: true});

const deleteTask = (id) => Task.findByIdAndDelete(id);

const findCompletedTasksByUserId = (userId) => Task.find({userId, isCompleted: true}).lean();

const findAllTasks = () => Task.find().lean();

export const taskRepo = {
    findTaskById,
    createTask,
    updateTask,
    deleteTask,
    findCompletedTasksByUserId,
    findAllTasks
}