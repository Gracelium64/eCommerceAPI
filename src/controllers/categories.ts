import type { RequestHandler } from "express";
import { Category } from "#models";

export const getAllCategories: RequestHandler = async (_req, res) => {
  const categories = await Category.find().lean();
  res.json(categories);
};

export const createCategory: RequestHandler = async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json(category);
};

export const getCategoryById: RequestHandler = async (req, res) => {
  const { id } = req.params;

  const category = await Category.findById(id).lean();
  if (!category) {
    throw new Error(`Category with id ${id} not found.`, { cause: { status: 404 } });
  }

  res.json(category);
};

export const updateCategory: RequestHandler = async (req, res) => {
  const { id } = req.params;

  const category = await Category.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true
  }).lean();

  if (!category) {
    throw new Error(`Category with id ${id} not found.`, { cause: { status: 404 } });
  }

  res.json(category);
};

export const deleteCategory: RequestHandler = async (req, res) => {
  const { id } = req.params;

  const deleted = await Category.findByIdAndDelete(id);
  if (!deleted) {
    throw new Error(`Category with id ${id} not found.`, { cause: { status: 404 } });
  }

  res.json({ message: `Category with id ${id} deleted.` });
};