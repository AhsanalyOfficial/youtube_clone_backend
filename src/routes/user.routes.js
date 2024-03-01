import { Router } from "express";
import { userAuth, userRegister } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
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
router.get("/auth", userAuth);

export default router;
