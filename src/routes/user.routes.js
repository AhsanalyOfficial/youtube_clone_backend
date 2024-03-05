import { Router } from "express";
import {
  userLogin,
  userLogout,
  userRegister,
  refreshAccessToken,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { JWTVerify } from "../middlewares/auth.middleware.js";
const router = new Router();

router.post(
  "/register",
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  userRegister
);
router.post("/login", userLogin);
router.post("/logout", JWTVerify, userLogout);
router.post("/refresh_token", refreshAccessToken);
export default router;
