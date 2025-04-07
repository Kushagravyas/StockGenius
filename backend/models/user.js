import { Schema, model } from "mongoose";
import { hash, compare } from "bcryptjs";
import { isEmail } from "validator";

const userSchema = new Schema({
    name: {
        type: "String",
        required: [true, "Please enter your name"],
        trim: true

         },

    email: {
        type: "String",
        required: [true, "Please enter your email"],
        unique: true,
        lowercase: true,
        validate: [isEmail,"Please provide valid email"]

    },

    password: {
        type: "String",
        required: true,
        minlength: [8,"Length should be more then 8 characters"], 
    },

    passwordChangedAt: Date,


    createdAt: {
        type: Date, 
        default: Date.now,
    }
});

// MIDDLEWARE: Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    this.password = await hash(this.password, 12);
    next();
  });
  
  // INSTANCE METHOD: Check password correctness
  userSchema.methods.correctPassword = async function(
    candidatePassword, 
    userPassword
  ) {
    return await compare(candidatePassword, userPassword);
  };
  
  const User = model('User', userSchema);
  export default User;