import User from "../models/User.js";
import { generateToken } from "../config/jwt.js";
import bcrypt from "bcryptjs";

const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword });

    const token = generateToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000 * 30, // 30 days
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });

    res.json({ message: "Logged in successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};

const checkAuth = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId).select(
      "-_id -createdAt -updatedAt -__v"
    );
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "No user found for this token" });
    }
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log("Error in checkAuth:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { register, login, logout, checkAuth };
