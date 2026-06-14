import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/index.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ where: { email } });

  if (userExists) {
    throw new ApiError(400, "User already exists with this email");
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    phone,
  });

  const token = generateToken(user.id);

  res.status(201).json(
    new ApiResponse(
      201,
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
        token,
      },
      "User registered successfully",
    ),
  );
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Please provide email and password");
  }

  // Check for user
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  // Check password
  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid credentials");
  }

  const token = generateToken(user.id);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
        token,
      },
      "Login successful",
    ),
  );
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.id, {
    attributes: { exclude: ["password"] },
  });

  res
    .status(200)
    .json(new ApiResponse(200, { user }, "User retrieved successfully"));
});

export const searchUsers = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q || q.length < 2) {
    throw new ApiError(400, "Search query must be at least 2 characters");
  }

  const users = await User.findAll({
    where: {
      [Op.or]: [
        { name: { [Op.iLike]: `%${q}%` } },
        { email: { [Op.iLike]: `%${q}%` } },
      ],
    },
    attributes: ["id", "name", "email"],
    limit: 10,
  });

  res.status(200).json(new ApiResponse(200, { users }, "Users found"));
});
