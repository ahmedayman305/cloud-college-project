import bcrypt from "bcryptjs";

import User from "../models/user.model.js";
import { generateToken, throwError } from "../utils/utils.js";

export const signup = async (req, res, next) => {
  const { email, name, password, role } = req.body; // Change fullname to name

  try {
    if (!email || !name || !password || !role) {
      // Also change fullname to name
      return next(throwError(400, "All fields are required"));
    }

    if (!["merchant", "delivery"].includes(role)) {
      return next(throwError(400, "Invalid role"));
    }

    if (password.length < 6) {
      return next(throwError(400, "Password must be at least 6 characters"));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(throwError(400, "Email already exists"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      fullname: name, // Save name as fullname in the database
      password: hashedPassword,
      role,
    });

    const savedUser = await newUser.save();

    await generateToken(res, savedUser._id);

    res.status(201).json({
      _id: savedUser._id,
      fullname: savedUser.fullname,
      email: savedUser.email,
      role: savedUser.role,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return next(throwError(400, "Email and password are required"));
    }

    const user = await User.findOne({ email });
    if (!user) {
      return next(throwError(400, "Invalid credentials"));
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next(throwError(400, "Invalid credentials"));
    }

    await generateToken(res, user._id);

    res.status(200).json({
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      role: user.role, // Adding role to response
    });
  } catch (error) {
    next(error);
  }
};
