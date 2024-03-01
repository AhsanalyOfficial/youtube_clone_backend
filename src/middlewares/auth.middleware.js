import { User } from "../models/user.models.js";
import ApiError from "../utils/ApiError.js";
import { asynHandler } from "../utils/asynHandler.js";
import jwt from "jsonwebtoken";

const JWTVerify = asynHandler(async (req, _, next) => {
  try {
    // get token
    const token =
      req.cookies?.accessToken ||
      req.headers("Authorization").replace("Bearer ", "");
    if (!token) {
      throw new ApiError(400, "Unauthorized");
    }
    // user info by token
    const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    // password and refresh token delete
    const user = await User.findById(decodeToken._id).select([
      "-password -refreshToken",
    ]);
    if (!user) {
      throw new ApiError(500, "Invalid access token");
    }
    // send user
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(500, "Invalid access token");
  }
});

export { JWTVerify };
