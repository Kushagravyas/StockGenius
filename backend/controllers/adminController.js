import User from "../models/user.js";

// 1. Fetch all users(as an Admin)
export const allUsers = async (req, res) => {
  try {
    // Destructure query parameters with defaults
    const { search, role, page = 1, limit = 10 } = req.query;

    // Maximum users per page
    const MAX_LIMIT = 100;

    // Validate and sanitize inputs
    const currentPage = Math.max(Number(page) || 1, 1);
    // Ensure pagNumber ≥ 1 (pageNumber can't be negative)
    // ----
    let itemsPerPage = Number(limit) || 10;
    // Basic type conversion (like if limit=abc , then Number(abc)=NaN so, if NaN then itemsPerPage = 10 instead)
    // ----
    itemsPerPage = Math.min(itemsPerPage, MAX_LIMIT);
    // Enforce max limit (if ${itemsPerPage} = 1000, then min(1000,100) is 100 so ${itemsPerPage} = 100)
    // ----
    itemsPerPage = Math.max(itemsPerPage, 1);
    // Prevent negative/zero values (if ${itemsPerPage} = -10, then max(-10,1) is 1 so ${itemsPerPage} = 1)
    // ----
    const skip = (currentPage - 1) * itemsPerPage;
    // if currentPage = 2, skip= (2-1) * 10 , skip=1*10=10; means skip 10 users(skip 1-10 users and show 11-20).
    // if 3, skip=(3-1)*10, skip=2*10=20; means skip 20 users(skip 1-20 users and show 21-30).

    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (role) {
      filter.role = role;
    }

    const totalUsers = await User.countDocuments(filter);

    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(itemsPerPage)
      .select("_id name email role createdAt");

    res.status(200).json({
      success: true,
      totalUsers,
      totalPages: Math.ceil(totalUsers / itemsPerPage),
      currentPage,
      itemsPerPage,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message,
    });
  }
};

// 2. Delete user (Admin only)
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("userID: ",userId)

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "Admin cannot delete themselves",
      });
    }

    // Delete the user
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: error.message,
    });
  }
};

// 3. Update user.role (From "user" -> "admin" OR "admin" -> "user")
export const updateRole = async (req, res) => {
  try {
    const { userId, role } = req.body;

    // Validate role
    const validRoles = ["admin", "user"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Invalid role. Allowed roles are: ${validRoles.join(", ")}`,
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent admin from changing their own role
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "Admin cannot change their own role",
      });
    }

    // Prevent unnecessary updates
    if (user.role === role) {
      return res.status(400).json({
        success: false,
        message: `User already has the role '${role}'`,
      });
    }

    // Update the user's role
    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User role updated to '${role}'`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating user role",
      error: error.message,
    });
  }
};
