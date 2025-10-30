import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { loginRateLimiter } from "../middlewares/loginRateLimiter.js";

import { authentication } from "../middlewares/auth.middleware.js";

import { validateRequest } from "../middlewares/joiValidation.middleware.js";

import { authValidate } from "../validators/auth.validator.js";

const router = Router();

router.post(
  "/register",
  validateRequest(authValidate.registerSchema),
  authController.register
);

router.post(
  "/verifyOtp",
  validateRequest(authValidate.verifyOtpSchema, ["body", "params"]),
  authController.verifyOtp
);

router.post(
  "/validate-credentials",
  validateRequest(authValidate.nameAndPasswordSchema),
  authController.validateCredentials
);

router.post(
  "/login",
  validateRequest(authValidate.loginSchema),
  loginRateLimiter,
  authController.login
);

router.post(
  "/logout",
  authentication,
  validateRequest(authValidate.logoutSchema),
  authController.logout
);

router.post(
  "/forgetPassword-request",
  validateRequest(authValidate.forgetPasswordSchema),
  authController.forgetPasswordRequest
);

router.post(
  "/reset-password/:token",
  validateRequest(authValidate.resetPasswordSchema, ["body", "params"]),
  authController.resetPassword
);

router.get("/user", authentication, authController.getUser);

export default router;
