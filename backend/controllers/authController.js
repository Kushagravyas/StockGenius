import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { v2 as cloudinary } from "cloudinary";

// Helper function to create JWT token
const createToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

//1. Register User
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(404).json({
        success: false,
        message: "Please provide all the details.",
      });
    }
    const user = await User.create({ name, email, password });

    const token = createToken(user);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (error) {
    // Handle duplicate email error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// 2. Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    //select("+password"): add password field to the response too because by default it is chosen to never "select" in the response.
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    //correctPassword(enteredPassword, userDbpassword)
    const isMatch = await user.correctPassword(password, user.password);
    if (!isMatch) {
      return res.status(402).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate token
    const token = createToken(user);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// 3. Get current user profile
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user profile",
    });
  }
};

//4. Update user profile (with photo upload)
export const updateProfile = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // Handle file upload if exists
    if (req.file) {
      // Delete old avatar if exists
      if (req.user.avatar) {
        const publicId = req.user.avatar.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`stock-genius/users/${publicId}`);
      }

      updateData.avatar = req.file.path; // Cloudinary URL
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.status(200).json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Profile update error:", error); // Log the full error object
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update profile",
    });
  }
};

//5. Delete user account (with avatar cleanup)
export const deleteUserAccount = async (req, res) => {
  try {
    // Delete avatar from Cloudinary if exists
    if (req.user.avatar) {
      const publicId = req.user.avatar.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`stock-genius/users/${publicId}`);
    }

    await User.findByIdAndDelete(req.user.id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully!",
    });
  } catch (error) {
    console.error("Delete account error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete account",
    });
  }
};

// 6. Password Reset
export const resetPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select("+password");

    if (!(await user.correctPassword(currentPassword, user.password))) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to update password",
    });
  }
};
