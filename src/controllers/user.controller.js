import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
  // Step:1 get user details from frontend
  // Step:2 validation check for empty fields
  // Step:3 check whether a user with the same email or username already exists
  // Step:4 check for images, check for avatar
  // Step:5 upload images to cloudinary, check for avatar upload
  // Step:6 create user object - create entry in db
  // Step:7 remove password and refreshToken fields from response
  // Step:8 check for user creation
  // Step:9 return response

  // Step 1
  const { fullname, username, email, password } = req.body;

  // Step 2
  if (
    [fullname, username, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // Step 3
  const userExists = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (userExists) {
    throw new ApiError(409, "User with this username or email already exists");
  }

  // Step 4
  // console.log("req.files", req.files);
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar image is required");
  }
  // Step 5
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar image is required");
  }

  // Step 6
  // Here the key values should match the values defined in User model
  const user = await User.create({
    fullname,
    username: username.toLowerCase(),
    email,
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });

  // Step 7
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // Step 8
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Registered Successfully"));
});

export { registerUser };
