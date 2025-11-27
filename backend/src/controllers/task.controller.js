import { asyncHandler, ApiResponse } from "../utils/index.js";
import { taskService } from "../services/task.service.js";

const createTask = asyncHandler(async (req, res) => {
  const uesrId = req.user?._id;
  const {taskName, taskDescription} = req.body
  const task = await taskService.createTask(uesrId, taskName, taskDescription);
  return res.status(201).json(new ApiResponse(201, { task }, "Task created"));
});

const updateTask = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const task = await taskService.updateTask(id, req.body);
  return res
    .status(200)
    .json(new ApiResponse(200, { task }, "Task updated successfully"));
});

const deleteTask = asyncHandler(async (req, res) => {
  const id = req.params.id;
  await taskService.deleteTask(id);
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Task deleted"));
});

const getAllTask = asyncHandler(async (req, res) => {
  const task = await taskService.getAllTask();
  return res
    .status(200)
    .json(new ApiResponse(200, { task }, "All task fetched successfully"));
});

const markTaskAsCompleted = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const completedTask = await taskService.markTaskAsCompleted(id);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { task: completedTask },
        "Task marked as completed successfully."
      )
    );
});

const getCompletedTasks = asyncHandler(async (req, res) => {
  const completedTasks = await taskService.getCompletedTasks();

  if (completedTasks.message) {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, completedTasks.message));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { task: completedTasks },
        "All completed tasks retrieved successfully."
      )
    );
});

export const taskController = {
  createTask,
  updateTask,
  deleteTask,
  getAllTask,
  markTaskAsCompleted,
  getCompletedTasks
};
