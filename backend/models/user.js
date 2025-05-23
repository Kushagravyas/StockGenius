import { Schema, model } from "mongoose";
import { hash, compare } from "bcryptjs";
import validator from "validator";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide valid email"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 8,
      select: false,
    },
    avatar: {
      type: String,
      default: "",
    },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    watchlist: [
      {
        symbol: String,
        name: String,
        addedAt: { type: Date, default: Date.now },
      },
    ],
    passwordChangedAt: Date,
  },
  { timestamps: true }
);

// Password hashing middleware
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await hash(this.password, 12);
  next();
});

// Password comparison method
userSchema.methods.correctPassword = async function (candidatePassword) {
  return await compare(candidatePassword, this.password);
};

export default model("User", userSchema);
