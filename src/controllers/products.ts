import type { RequestHandler } from "express";
import { Category, Product } from "#models";

const normalize = (doc: any) => {
  const { _id, __v, ...rest } = doc;
  return { id: _id, ...rest };
};

const normalizeMany = (docs: any[]) => docs.map(normalize);

export const getAllProducts: RequestHandler = async (req, res) => {
  const { categoryId } = req.query as { categoryId?: string };

  const filter = categoryId ? { categoryId } : {};
  const products = await Product.find(filter).lean();

  res.json(normalizeMany(products));
};

export const createProduct: RequestHandler = async (req, res) => {
  const { categoryId } = req.body;

  const category = await Category.findById(categoryId);
  if (!category) {
    throw new Error("Invalid categoryId: category does not exist.", {
      cause: { status: 400 },
    });
  }

  const product = await Product.create(req.body);
  res.status(201).json(product);
};

export const getProductById: RequestHandler = async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id).lean();
  if (!product) {
    throw new Error(`Product with id ${id} not found.`, {
      cause: { status: 404 },
    });
  }

  res.json(normalize(product));
};

export const updateProduct: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { categoryId } = req.body as { categoryId?: string };

  const product = await Product.findById(id);
  if (!product) {
    throw new Error(`Product with id ${id} not found.`, {
      cause: { status: 404 },
    });
  }

  if (categoryId !== undefined) {
    const category = await Category.findById(categoryId);
    if (!category) {
      throw new Error("Invalid categoryId: category does not exist.", {
        cause: { status: 400 },
      });
    }
    product.categoryId = categoryId;
  }

  if (req.body.name !== undefined) product.name = req.body.name;
  if (req.body.description !== undefined)
    product.description = req.body.description;
  if (req.body.price !== undefined) product.price = req.body.price;

  await product.save();
  res.json(product);
};

export const deleteProduct: RequestHandler = async (req, res) => {
  const { id } = req.params;

  const deleted = await Product.findByIdAndDelete(id);
  if (!deleted) {
    throw new Error(`Product with id ${id} not found.`, {
      cause: { status: 404 },
    });
  }

  res.json({ message: `Product with id ${id} deleted.` });
};
