import { asyncHandler, ApiResponse } from "../utils/index.js";
import { taskService } from "../services/task.service.js";

const createTask = asyncHandler(async (req, res) => {
  const uesrId = req.user?._id;
  const task = await taskService.createTask(uesrId, req.body);
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
  const deletedTask = await taskService.deleteTask(id);
  return res
    .status(200)
    .json(new ApiResponse(200, { deletedTask }, "Task deleted"));
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
        { completedTask },
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
        { completedTasks },
        "All completed tasks retrieved successfully."
      )
    );
});

const getUserCompletedTasks = asyncHandler(async(req, res) => {
    const userId = req.user?._id;

    const completedTasks = await taskService.getUserCompletedTasks(userId);

    if(completedTasks.message) {
        return res.status(200)
                .json(new ApiResponse(200, {}, completedTasks.message));
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {completedTasks}, "Your completed tasks fetched successfully"));

})

export const taskController = {
  createTask,
  updateTask,
  deleteTask,
  getAllTask,
  markTaskAsCompleted,
  getCompletedTasks,
  getUserCompletedTasks
};
