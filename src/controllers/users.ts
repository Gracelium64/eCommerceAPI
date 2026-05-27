import type { RequestHandler } from "express";
import bcrypt from "bcrypt";
import { User } from "#models";
import { SALT_ROUNDS } from "#config";

export const getAllUsers: RequestHandler = async (_req, res) => {
  const users = await User.find().lean();
  res.json(users);
};

export const createUser: RequestHandler = async (req, res) => {
  const { name, email, password, roles } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    throw new Error("A user with this email already exists.", {
      cause: { status: 409 },
    });
  }

  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hashed = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashed,
    roles: roles ?? ["user"],
  });

  const safeUser = await User.findById(user._id).lean();
  res.status(201).json(safeUser);
};

export const getUserById: RequestHandler = async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id).lean();
  if (!user) {
    throw new Error(`User with id ${id} not found.`, {
      cause: { status: 404 },
    });
  }

  res.json(user);
};

export const updateUser: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, roles } = req.body;

  const user = await User.findById(id).select("+password");
  if (!user) {
    throw new Error(`User with id ${id} not found.`, {
      cause: { status: 404 },
    });
  }

  if (email && email !== user.email) {
    const emailExists = await User.findOne({ email, _id: { $ne: id } });
    if (emailExists) {
      throw new Error("A user with this email already exists.", {
        cause: { status: 409 },
      });
    }
    user.email = email;
  }

  if (name !== undefined) user.name = name;
  if (roles !== undefined) user.roles = roles;

  if (password) {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    user.password = await bcrypt.hash(password, salt);
  }

  await user.save();

  const safeUser = await User.findById(id).lean();
  res.json(safeUser);
};

export const deleteUser: RequestHandler = async (req, res) => {
  const { id } = req.params;

  const deleted = await User.findByIdAndDelete(id);
  if (!deleted) {
    throw new Error(`User with id ${id} not found.`, {
      cause: { status: 404 },
    });
  }

  res.json({ message: `User with id ${id} deleted.` });
};
