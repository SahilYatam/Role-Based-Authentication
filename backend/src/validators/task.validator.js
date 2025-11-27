import Joi from "joi";

// ✅ CREATE TASK
const createTaskSchema = Joi.object({
  taskName: Joi.string().trim().min(3).max(100).required().messages({
    "any.required": "Task title is required",
    "string.empty": "Task title cannot be empty",
    "string.min": "Task title must be at least 3 characters long",
    "string.max": "Task title cannot exceed 100 characters",
  }),

  taskDescription: Joi.string().trim().allow("").max(500).messages({
    "string.max": "Task description cannot exceed 500 characters",
  }),
});

// ✅ UPDATE TASK
const updateTaskSchema = Joi.object({
  taskName: Joi.string().trim().min(3).max(100).messages({
    "string.min": "Task title must be at least 3 characters long",
    "string.max": "Task title cannot exceed 100 characters",
  }),

  taskDescription: Joi.string().trim().allow("").max(500).messages({
    "string.max": "Task description cannot exceed 500 characters",
  }),
}).min(1).messages({
  "object.min": "At least one field must be provided to update the task",
});

// ✅ DELETE TASK / MARK COMPLETED / GET SINGLE TASK BY ID
const taskIdParamSchema = Joi.object({
  id: Joi.string().trim().regex(/^[0-9a-fA-F]{24}$/).required().messages({
    "string.pattern.base": "Task ID must be a valid MongoDB ObjectId",
    "any.required": "Task ID is required",
  }),
});

const userIdSchema = Joi.object({
  userId: Joi.string().trim().regex(/^[0-9a-fA-F]{24}$/).required().messages({
    "string.pattern.base": "User ID must be a valid MongoDB ObjectId",
    "any.required": "User ID is required",
  }),
});

export const taskValidate = {
    createTaskSchema,
    updateTaskSchema,
    taskIdParamSchema,
    userIdSchema
}