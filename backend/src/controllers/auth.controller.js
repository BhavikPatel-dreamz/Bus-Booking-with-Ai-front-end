import jwt from "jsonwebtoken";
import { asynchandller } from "../util/asynchandller.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";

const generateAccessToken = (user) => {
  try {
    const accessToken = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.ACCESS_TOKEN,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRE },
    );
    return accessToken;
  } catch (error) {
    console.error(error);
  }
};

export const login = asynchandller(async (req, res) => {
  const { email, password } = req.body;

  if ([email, password].some((field) => field == "")) {
    return res.status(400).json({
      success: false,
      message: "Missing fields",
    });
  }

  const user = await User.findOne({ email: email });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "User not found",
    });
  }

  const checkpassword = await bcrypt.compare(password, user.password);
  if (!checkpassword) {
    return res.status(400).json({
      success: false,
      message: "Enter correct password",
    });
  }

  const accessToken = await generateAccessToken(user);
  const options = {
    httpOnly: true,
    secure: false,
    sameSite: "Lax",
    maxAge: 24 * 60 * 60 * 1000,
  };
  return res
    .status(200)
    .cookie("accesstoken", accessToken, options)
    .json({
      success: true,
      message: "Login successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      token: accessToken,
    });
});

export const generateMcpToken = asynchandller(async (req, res) => {
  const { email, password } = req.body;

  if ([email, password].some((field) => field == "")) {
    return res.status(400).json({
      success: false,
      message: "Please fill all fields",
    });
  }

  const user = await User.findOne({ email: email });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "User not found",
    });
  }

  const checkpassword = await bcrypt.compare(password, user.password);
  if (!checkpassword) {
    return res.status(400).json({
      success: false,
      message: "Enter correct password",
    });
  }

  // Generate a long-lived token (1 year)
  const mcpToken = jwt.sign(
    {
      id: user.id,
      role: user.role,
      tokenType: "mcp",
    },
    process.env.ACCESS_TOKEN,
    { expiresIn: "365d" },
  );

  return res.status(200).json({
    success: true,
    message: "MCP Token generated successfully",
    token: mcpToken,
    expires: "1 year",
  });
});

export const forgotPassword = asynchandller(async (req, res) => {
  const { email, password } = req.body;

  if ([email, password].some((field) => field == "")) {
    return res.status(400).json({
      success: false,
      message: "Missing fields",
    });
  }

  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "User not found",
    });
  }

  const newPassword = await bcrypt.hash(password, 10);
  await User.findByIdAndUpdate(user.id, { password: newPassword });
  return res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });
});

export const logout = asynchandller(async (req, res) => {
  return res.status(200).cookie("accesstoken", "").json({
    message: "Logout successfully",
  });
});

//get user
export const authenticateUser = asynchandller(async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "User is Authenticated",
    user: req.user,
  });
});
