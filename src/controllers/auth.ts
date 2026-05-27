import type { CookieOptions, RequestHandler } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User, RefreshToken } from "#models";
import {
  ACCESS_JWT_SECRET,
  REFRESH_JWT_SECRET,
  ACCESS_TOKEN_TTL,
  REFRESH_TOKEN_TTL,
  SALT_ROUNDS,
  IS_PRODUCTION,
} from "#config";

const normalizeUser = (doc: any) => {
  const { _id, __v, password, ...rest } = doc;
  return { id: _id, ...rest };
};

const createTokens = async (userId: string, roles: string[]) => {
  const accessToken = jwt.sign({ roles }, ACCESS_JWT_SECRET, {
    subject: userId,
    expiresIn: ACCESS_TOKEN_TTL,
  });

  const refreshToken = jwt.sign({}, REFRESH_JWT_SECRET, {
    subject: userId,
    expiresIn: REFRESH_TOKEN_TTL,
  });

  await RefreshToken.create({ token: refreshToken, userId });
  return { accessToken, refreshToken };
};

const refreshCookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: IS_PRODUCTION ? "none" : "lax",
  secure: IS_PRODUCTION,
  maxAge: REFRESH_TOKEN_TTL * 1000,
};

const clearRefreshCookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: IS_PRODUCTION ? "none" : "lax",
  secure: IS_PRODUCTION,
};

export const register: RequestHandler = async (req, res) => {
  const { name, email, password } = req.body;
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
    roles: ["user"],
  });

  const safeUser = await User.findById(user._id).lean();
  if (!safeUser) {
    throw new Error("Failed to load user after register.", {
      cause: { status: 500 },
    });
  }

  const { accessToken, refreshToken } = await createTokens(
    user._id,
    user.roles,
  );

  res.cookie("refreshToken", refreshToken, refreshCookieOptions);
  res.status(201).json({
    message: "Registration successful.",
    accessToken,
    user: normalizeUser(safeUser),
  });
};

export const login: RequestHandler = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new Error("Invalid email or password.", { cause: { status: 401 } });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw new Error("Invalid email or password.", { cause: { status: 401 } });
  }

  await RefreshToken.deleteMany({ userId: user._id });

  const { accessToken, refreshToken } = await createTokens(
    user._id,
    user.roles,
  );

  res.cookie("refreshToken", refreshToken, refreshCookieOptions);
  res.json({ message: "Login successful.", accessToken });
};

export const refresh: RequestHandler = async (req, res) => {
  const token = req.cookies?.refreshToken as string | undefined;
  if (!token) {
    throw new Error("Refresh token is missing.", { cause: { status: 401 } });
  }

  const stored = await RefreshToken.findOne({ token });
  if (!stored) {
    throw new Error("Invalid refresh token.", { cause: { status: 401 } });
  }

  const payload = jwt.verify(token, REFRESH_JWT_SECRET) as jwt.JwtPayload;
  const userId = String(payload.sub);

  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found.", { cause: { status: 404 } });
  }

  await RefreshToken.deleteOne({ _id: stored._id });

  const { accessToken, refreshToken } = await createTokens(userId, user.roles);

  res.cookie("refreshToken", refreshToken, refreshCookieOptions);
  res.json({ message: "Token refreshed.", accessToken });
};

export const logout: RequestHandler = async (req, res) => {
  const token = req.cookies?.refreshToken as string | undefined;
  if (token) {
    await RefreshToken.deleteOne({ token });
  }

  res.clearCookie("refreshToken", clearRefreshCookieOptions);
  res.json({ message: "Logout successful." });
};

export const me: RequestHandler = async (req, res) => {
  if (!req.user) {
    throw new Error("Unauthorized", { cause: { status: 401 } });
  }

  const user = await User.findById(req.user.id).lean();
  if (!user) {
    throw new Error("User not found.", { cause: { status: 404 } });
  }

  res.json({ user: normalizeUser(user) });
};
