import mongoose from "mongoose";
import { Stock } from "../models/Stock.js";
import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/appError.js";

export const getDashboardSummary = asyncHandler(async (_req, res) => {
  const [summary] = await Stock.aggregate([
    {
      $group: {
        _id: null,
        totalItems: { $sum: 1 },
        totalWeight: { $sum: { $ifNull: ["$grossWeight", "$weight"] } },
        categories: { $addToSet: "$category" }
      }
    },
    {
      $project: {
        _id: 0,
        totalItems: 1,
        totalWeight: { $round: ["$totalWeight", 2] },
        totalCategories: { $size: "$categories" }
      }
    }
  ]);

  res.json(
    summary || {
      totalItems: 0,
      totalWeight: 0,
      totalCategories: 0
    }
  );
});

export const getRecentStock = asyncHandler(async (_req, res) => {
  const items = await Stock.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .select("itemNumber itemName category weight grossWeight netWeight purity addedBy createdAt");

  res.json({ items });
});

export const getSystemStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.sub).select(
    "name email role status lastLogin createdAt"
  );

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  const connectionStates = {
    0: "Disconnected",
    1: "Connected",
    2: "Connecting",
    3: "Disconnecting"
  };

  res.json({
    backendStatus: "Online",
    mongoStatus: connectionStates[mongoose.connection.readyState] || "Unknown",
    user: {
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      lastLogin: user.lastLogin || null
    }
  });
});

