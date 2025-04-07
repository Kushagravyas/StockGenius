const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const userSchema = new mongoose.Schema({
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
        validate: [validator.isEmail,"Please provide valid email"]

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
    
    this.password = await bcrypt.hash(this.password, 12);
    next();
  });
  
  // INSTANCE METHOD: Check password correctness
  userSchema.methods.correctPassword = async function(
    candidatePassword, 
    userPassword
  ) {
    return await bcrypt.compare(candidatePassword, userPassword);
  };
  
  const User = mongoose.model('User', userSchema);
  module.exports = User;