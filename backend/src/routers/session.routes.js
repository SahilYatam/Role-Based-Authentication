import { Router } from "express";
import { refreshAccessToken } from "../controllers/session.controller.js";

const router = Router();

router.post(
  "/refresh-accessToken",
  refreshAccessToken
);

export default router;
