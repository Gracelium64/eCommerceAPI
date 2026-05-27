import { randomUUID } from "node:crypto";
import { Schema, model } from "mongoose";

const orderItemSchema = new Schema(
  {
    productId: { type: String, required: true, ref: "Product" },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false },
);

const orderSchema = new Schema(
  {
    _id: { type: String, default: () => randomUUID() },
    userId: { type: String, required: true, ref: "User" },
    products: { type: [orderItemSchema], required: true },
    total: { type: Number, required: true, min: 0 },
  },
  { timestamps: true },
);

orderSchema.set("toJSON", {
  transform: (_doc, ret: Record<string, any> & { __v?: any }) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Order = model("Order", orderSchema);
