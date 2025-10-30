import { Router } from "express";
import {refreshAccessToken} from "../controllers/session.controller.js";

import { validateRequest } from "../middlewares/joiValidation.middleware.js";
import { refreshAccessTokenSchema } from "../validators/session.validator.js";

import { authentication } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/refresh-accessToken", authentication, validateRequest(refreshAccessTokenSchema), refreshAccessToken);

export default router;
