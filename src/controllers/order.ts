import type { RequestHandler } from "express";
import { Order, Product, User } from "#models";

type OrderItemInput = {
  productId: string;
  quantity: number;
};

const normalize = (doc: any) => {
  const { _id, __v, ...rest } = doc;
  return { id: _id, ...rest };
};

const normalizeMany = (docs: any[]) => docs.map(normalize);

const hasPrivilegedRole = (roles: string[]) =>
  roles.includes("admin") || roles.includes("manager");

const calculateOrderTotal = async (
  items: OrderItemInput[],
): Promise<number> => {
  const productIds = items.map((item) => item.productId);
  const uniqueProductIds = [...new Set(productIds)];

  const products = await Product.find({
    _id: { $in: uniqueProductIds },
  }).lean();

  if (products.length !== uniqueProductIds.length) {
    throw new Error("One or more productIds do not exist.", {
      cause: { status: 400 },
    });
  }

  const priceByProductId = new Map(products.map((p) => [p._id, p.price]));
  let total = 0;

  for (const item of items) {
    const price = priceByProductId.get(item.productId);
    if (price === undefined) {
      throw new Error(`Product with id ${item.productId} not found.`, {
        cause: { status: 400 },
      });
    }
    total += price * item.quantity;
  }

  return total;
};

const ensureUserExists = async (userId: string): Promise<void> => {
  const user = await User.findById(userId).lean();
  if (!user) {
    throw new Error(`User with id ${userId} not found.`, {
      cause: { status: 400 },
    });
  }
};

const ensureOrderAccess = (
  actor: { id: string; roles: string[] } | undefined,
  orderUserId: string,
): void => {
  if (!actor) {
    throw new Error("Unauthorized", { cause: { status: 401 } });
  }

  if (hasPrivilegedRole(actor.roles)) return;
  if (actor.id === orderUserId) return;

  throw new Error("Forbidden", { cause: { status: 403 } });
};

export const getAllOrders: RequestHandler = async (req, res) => {
  if (!req.user) throw new Error("Unauthorized", { cause: { status: 401 } });

  const filter = hasPrivilegedRole(req.user.roles)
    ? {}
    : { userId: req.user.id };

  const orders = await Order.find(filter).lean();
  res.json(normalizeMany(orders));
};

export const createOrder: RequestHandler = async (req, res) => {
  if (!req.user) throw new Error("Unauthorized", { cause: { status: 401 } });

  const { userId, products } = req.body as {
    userId: string;
    products: OrderItemInput[];
  };

  if (!hasPrivilegedRole(req.user.roles) && userId !== req.user.id) {
    throw new Error("You can only create orders for yourself.", {
      cause: { status: 403 },
    });
  }

  await ensureUserExists(userId);
  const total = await calculateOrderTotal(products);

  const order = await Order.create({
    userId,
    products,
    total,
  });

  res.status(201).json(order);
};

export const getOrderById: RequestHandler = async (req, res) => {
  const { id } = req.params;

  const order = await Order.findById(id).lean();
  if (!order) {
    throw new Error(`Order with id ${id} not found.`, {
      cause: { status: 404 },
    });
  }

  ensureOrderAccess(req.user, order.userId);
  res.json(normalize(order));
};

export const updateOrder: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { userId, products } = req.body as {
    userId: string;
    products: OrderItemInput[];
  };

  const existingOrder = await Order.findById(id).lean();
  if (!existingOrder) {
    throw new Error(`Order with id ${id} not found.`, {
      cause: { status: 404 },
    });
  }

  ensureOrderAccess(req.user, existingOrder.userId);

  if (!req.user) throw new Error("Unauthorized", { cause: { status: 401 } });
  if (!hasPrivilegedRole(req.user.roles) && userId !== req.user.id) {
    throw new Error("You can only assign orders to yourself.", {
      cause: { status: 403 },
    });
  }

  await ensureUserExists(userId);
  const total = await calculateOrderTotal(products);

  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    { userId, products, total },
    { new: true, runValidators: true },
  );

  if (!updatedOrder) {
    throw new Error(`Order with id ${id} not found.`, {
      cause: { status: 404 },
    });
  }

  res.json(updatedOrder);
};

export const deleteOrder: RequestHandler = async (req, res) => {
  const { id } = req.params;

  const order = await Order.findById(id);
  if (!order) {
    throw new Error(`Order with id ${id} not found.`, {
      cause: { status: 404 },
    });
  }

  ensureOrderAccess(req.user, order.userId);

  await order.deleteOne();
  res.json({ message: `Order with id ${id} deleted.` });
};
