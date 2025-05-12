import jwt from 'jsonwebtoken';
import User from '../models/User.js';


// Helper function to create JWT token
const createToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN, // Ensure no extra spaces
    });
};

  export const register = async (req, res) => {
       try {
             const {name, email, password} = req.body;

             if(!name || !email || !password){
                 res.status(404).json({
                    success: false,
                    message: "Please provide all details"
                 })
             }

             const user = await User.create({
                name, email, password
             })
        
             const token = createToken(user._id);

             res.status(201).json({success: true, token, user:{name:user.name, email:user.email, avatar:user.avatar, id:user._id}})
       } catch (error) {
           
            if(error.code===11000){
                return res.status(400).json({success: false, message: "Email already exist"})

            }
            console.log(error);
            
            res.status(500).json({success: false, message: "Server error"})
        
       }
  }

  export const login = async (req, res) => {
    try { const {email, password} = req.body

    const user = await User.findOne({email}).select("+password");
       if(!user){
        return res.status(401).json({
            success: false,
            message: "User not found",
        })
       }

       const isMatch = await user.correctPassword(password,user.password);
       if(!isMatch){
        return res.status(402).json({
            success: false,
            message: "Invalid email or password",
        })
       }
        
       const token = createToken(user._id);

       res.status(200).json({
        success: true,
        token,
        user: {name:user.name, email:user.email, avatar:user.avatar, id:user._id}
       })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Sever is not responding"
        })
    }
  }

  export const protect = async (req, res, next) =>{
    try { const token = req.headers.authorization?.split(" ")[1];
        if(!token){
            return res.status(401).json({
                success: false,
                message: "Not authorized, Token not found", 
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId);
        if(!user){
            return res.status(401).json({
                success: false,
                message: "User not found",
            })
        }
        
        req.user=user;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "No token found",
        })
    }
  }

export const updateProfile = async (req, res) => {
    try {
        const updateData = { ...req.body };

        console.log("Request Body:", req.body);
        console.log("Uploaded File:", req.file);

        // Handle avatar upload
        if (req.file) {
            // Delete the old avatar from Cloudinary if it exists
            if (req.user.avatar) {
                const publicId = req.user.avatar.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(`stock-genius/users/${publicId}`);
            }

            // Update the avatar path
            updateData.avatar = req.file.path;
        }

        // Update the user in the database
        const updatedUser = await User.findByIdAndUpdate(req.user.id, updateData, {
            new: true,
            runValidators: true,
        }).select("-password");

        res.status(200).json({
            success: true,
            user: updatedUser,
        });
    } catch (error) {
        console.error("Error in updateProfile:", error); // Log the error for debugging
        console.log("Request Body:", req.body);
        console.log("Uploaded File:", req.file);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

export const deleteUser = async(req, res) =>{
    try {
        if (req.user.avatar) {
            const publicId = req.user.avatar.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(`stock-genius/users/${publicId}`);
        }
        await User.findOneAndDelete(req.user.id)
        res.status(204).json({
            success: true,
            message: "User deleted successfully",
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete user",
        })
        
    }
  }

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