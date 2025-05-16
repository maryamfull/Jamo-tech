import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    userType: {
      type: String,
      enum: ["Admin", "User"],
      default: "User",
      required: true,
    },
    boughtProduct: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }],
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);
