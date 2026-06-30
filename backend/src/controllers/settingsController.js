import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { Settings } from "../models/Settings.js";
import { Stock } from "../models/Stock.js";
import { User } from "../models/User.js";
import { AppError } from "../utils/appError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getOrCreate = async () => {
  let doc = await Settings.findOne();
  if (!doc) doc = await Settings.create({});
  return doc;
};

export const getSettings = asyncHandler(async (_req, res) => {
  const settings = await getOrCreate();
  res.json({ settings });
});

export const updateSettings = asyncHandler(async (req, res) => {
  const settings = await getOrCreate();

  const {
    goldRate,
    goldRateHistory,
    goldRateUpdatedBy,
    goldRateUpdatedAt,
    ...rest
  } = req.body;

  Object.assign(settings, rest);

  if (goldRate !== undefined) {
    const newRate = Number(goldRate);
    if (!isNaN(newRate) && newRate !== settings.goldRate) {
      settings.goldRateHistory.push({
        rate: newRate,
        updatedBy: req.user.name || req.user.email || "Admin",
        updatedAt: new Date()
      });
      settings.goldRate = newRate;
      settings.goldRateUpdatedBy = req.user.name || req.user.email || "Admin";
      settings.goldRateUpdatedAt = new Date();
    }
  }

  await settings.save();
  res.json({ message: "Settings saved successfully.", settings });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmPassword) {
    throw new AppError("All password fields are required.", 400);
  }
  if (newPassword !== confirmPassword) {
    throw new AppError("New password and confirm password do not match.", 400);
  }
  if (newPassword.length < 6) {
    throw new AppError("New password must be at least 6 characters.", 400);
  }

  const user = await User.findById(req.user.sub);
  if (!user) throw new AppError("User not found.", 404);

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) throw new AppError("Current password is incorrect.", 400);

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.json({ message: "Password changed successfully." });
});

export const getSystemStatus = asyncHandler(async (_req, res) => {
  const states = {
    0: "Disconnected",
    1: "Connected",
    2: "Connecting",
    3: "Disconnecting"
  };

  const [totalItems, totalUsers, categories, weightAgg] = await Promise.all([
    Stock.countDocuments(),
    User.countDocuments(),
    Stock.distinct("category"),
    Stock.aggregate([
      {
        $group: {
          _id: null,
          totalWeight: { $sum: { $ifNull: ["$grossWeight", "$weight"] } }
        }
      }
    ])
  ]);

  res.json({
    dbStatus: states[mongoose.connection.readyState] || "Unknown",
    apiStatus: "Online",
    totalItems,
    totalUsers,
    totalCategories: categories.length,
    totalWeight: Number(((weightAgg[0]?.totalWeight) || 0).toFixed(3))
  });
});

export const testPrinter = asyncHandler(async (_req, res) => {
  res.json({ message: "Printer test signal sent successfully." });
});

export const testLabel = asyncHandler(async (_req, res) => {
  res.json({
    label: {
      itemNumber: "SVJ000001",
      itemName: "Test Ring",
      grossWeight: "8.500",
      purity: "22K"
    }
  });
});
