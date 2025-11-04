import { Router } from "express";
import { refreshAccessToken } from "../controllers/session.controller.js";

import { validateRequest } from "../middlewares/joiValidation.middleware.js";
import { refreshAccessTokenSchema } from "../validators/session.validator.js";


const router = Router();

router.post(
  "/refresh-accessToken",
  validateRequest(refreshAccessTokenSchema, "cookies"),
  refreshAccessToken
);

export default router;
