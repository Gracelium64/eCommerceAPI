import { Schema, model } from "mongoose";
import { REFRESH_TOKEN_TTL } from "#config";

const refreshTokenSchema = new Schema(
  {
    token: { type: String, required: true, unique: true },
    userId: { type: String, required: true, ref: "User" },
    expireAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + REFRESH_TOKEN_TTL * 1000)
    }
  },
  { timestamps: true }
);

refreshTokenSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

export const RefreshToken = model("RefreshToken", refreshTokenSchema);