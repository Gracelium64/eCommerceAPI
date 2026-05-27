import { randomUUID } from "node:crypto";
import { Schema, model } from "mongoose";

const productSchema = new Schema(
  {
    _id: { type: String, default: () => randomUUID() },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    categoryId: { type: String, required: true, ref: "Category" },
  },
  { timestamps: true },
);

productSchema.set("toJSON", {
  transform: (_doc, ret: Record<string, any> & { __v?: any }) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Product = model("Product", productSchema);
