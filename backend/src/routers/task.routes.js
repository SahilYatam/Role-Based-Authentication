import { Router } from "express";
import { taskController } from "../controllers/task.controller.js";

import { validateRequest } from "../middlewares/joiValidation.middleware.js";

import { authentication } from "../middlewares/auth.middleware.js";


import { taskValidate } from "../validators/task.validator.js";

const router = Router();

router.post(
  "/create-task",
  authentication,
  validateRequest(taskValidate.createTaskSchema),
  taskController.createTask
);

router.patch(
  "/update-task/:id",
  authentication,
  validateRequest(taskValidate.updateTaskSchema, ["body", "params"]),
  taskController.updateTask
);

router.post(
  "/mark-complete-task/:id",
  authentication,
  validateRequest(taskValidate.taskIdParamSchema, "params"),
  taskController.markTaskAsCompleted
);

router.get("/all-task", taskController.getAllTask);

router.get("/get-complete-task", taskController.getCompletedTasks);

router.get("/user-complete-task", taskController.getUserCompletedTasks);

router.delete(
  "/delete-task/:id",
  authentication,
  validateRequest(taskValidate.taskIdParamSchema, "params"),
  taskController.deleteTask
);

export default router;
