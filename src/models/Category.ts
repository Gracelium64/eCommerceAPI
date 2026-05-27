import { randomUUID } from "node:crypto";
import { Schema, model } from "mongoose";

const categorySchema = new Schema(
  {
    _id: { type: String, default: () => randomUUID() },
    name: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

categorySchema.set("toJSON", {
  transform: (_doc, ret: Record<string, any> & { __v?: any }) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Category = model("Category", categorySchema);
