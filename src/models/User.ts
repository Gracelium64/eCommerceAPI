import { randomUUID } from "node:crypto";
import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    _id: { type: String, default: () => randomUUID() },
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, select: false },
    roles: { type: [String], default: ["user"] },
  },
  { timestamps: true },
);

userSchema.set("toJSON", {
  transform: (_doc, ret: Record<string, any> & { __v?: any }) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.password;
    return ret;
  },
});

export const User = model("User", userSchema);
