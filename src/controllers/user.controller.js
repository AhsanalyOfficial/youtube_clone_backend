import ApiError from "../utils/ApiError.js";
import { asynHandler } from "../utils/asynHandler.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const userRegister = asynHandler(async (req, res) => {
  const { username, email, fullName, password } = req.body;
  console.log(username);
  // check required fields
  if ([username, email, fullName].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }
  // check if username or email already exist
  const existUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existUser) {
    throw new ApiError(409, "User with username or email already exist");
  }
  // check files avatar and coverIamge
  const avatarLocalPath = req.files?.avatar[0]?.path;
  //   const coverImageLocalPath = req.files?.coverImage[0]?.path;
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  if (!avatar) {
    throw new ApiError(400, "Avatar file required");
  }
  // create user
  const user = await User.create({
    username: username.toLowerCase(),
    email,
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    password,
  });
  // remove password and refreshToken
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the error");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});
const userAuth = async (req, res) => {
  const { email, password } = req.body;
  if (email?.toLowerCase() === "") {
    throw new ApiError(400, "All fields are required");
  }
  const token = await User.isPasswordCorrect(email, password);
  console.log(token);
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(400, "User is not found.");
  }
  if (!token) {
    throw new ApiError(400, "Password is not correct.");
  }
  return res
    .status(200)
    .json(new ApiResponse(201, user, "user found successfully"));
};

export { userRegister, userAuth };
