import mongoose from "mongoose";
import { Stock } from "../models/Stock.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/appError.js";

const buildSearchQuery = (search) => {
  if (!search) {
    return {};
  }

  const regex = new RegExp(search, "i");

  return {
    $or: [
      { itemNumber: regex },
      { itemName: regex },
      { designName: regex },
      { barcode: regex },
      { category: regex }
    ]
  };
};

const buildSortQuery = (sortBy) => {
  switch (sortBy) {
    case "oldest":
      return { createdAt: 1 };
    case "weight_desc":
      return { weight: -1, createdAt: -1 };
    case "weight_asc":
      return { weight: 1, createdAt: -1 };
    default:
      return { createdAt: -1 };
  }
};

const formatItemNumber = (sequence) => `SVJ${String(sequence).padStart(6, "0")}`;

const getNumericPart = (value) => {
  const match = `${value || ""}`.match(/(\d+)$/);
  return match ? Number(match[1]) : 0;
};

const normalizePayload = (payload) => {
  const grossWeight = Number(payload.grossWeight ?? payload.weight ?? 0);
  // net weight mirrors gross weight when not explicitly provided
  const netWeight =
    payload.netWeight === "" || payload.netWeight === undefined || payload.netWeight === null
      ? grossWeight
      : Number(payload.netWeight);

  return {
    itemNumber: `${payload.itemNumber || ""}`.trim(),
    itemName: `${payload.itemName || ""}`.trim(),
    designName: `${payload.designName || ""}`.trim(),
    category: `${payload.category || ""}`.trim(),
    subCategory: `${payload.subCategory || ""}`.trim(),
    barcode: `${payload.barcode || ""}`.trim(),
    weight: grossWeight,
    grossWeight,
    netWeight,
    count: Number(payload.count ?? 1),
    purity: `${payload.purity || ""}`.trim(),
    status: payload.status || "Available",
    description: `${payload.description || ""}`.trim(),
    supplier: `${payload.supplier || ""}`.trim(),
    createdBy: `${payload.createdBy || payload.addedBy || "System"}`.trim(),
    addedBy: `${payload.addedBy || payload.createdBy || "System"}`.trim()
  };
};

const validateStockPayload = async (payload, excludeId = null) => {
  if (!payload.itemNumber) {
    throw new AppError("Item Number is required.", 400);
  }

  if (!payload.itemName) {
    throw new AppError("Item Name is required.", 400);
  }

  if (payload.designName && !/^[a-zA-Z0-9\s]*$/.test(payload.designName)) {
    throw new AppError("Design Name must be alphanumeric.", 400);
  }

  if (!payload.category) {
    throw new AppError("Category is required.", 400);
  }

  if (!payload.purity) {
    throw new AppError("Purity is required.", 400);
  }

  if (!payload.count || payload.count <= 0) {
    throw new AppError("Pieces / Count must be greater than zero.", 400);
  }

  if (!payload.grossWeight || payload.grossWeight <= 0) {
    throw new AppError("Gross Weight must be greater than zero.", 400);
  }

  const duplicateItemNumber = await Stock.findOne({
    itemNumber: payload.itemNumber,
    ...(excludeId ? { _id: { $ne: excludeId } } : {})
  });

  if (duplicateItemNumber) {
    throw new AppError("Item Number already exists.", 409);
  }

  if (payload.barcode) {
    const duplicateBarcode = await Stock.findOne({
      barcode: payload.barcode,
      ...(excludeId ? { _id: { $ne: excludeId } } : {})
    });

    if (duplicateBarcode) {
      throw new AppError("Barcode already exists.", 409);
    }
  }
};

export const getStocks = asyncHandler(async (req, res) => {
  const { search = "", category = "", purity = "", designName = "", sortBy = "newest" } = req.query;
  const query = {
    ...buildSearchQuery(search)
  };

  if (category) {
    query.category = category;
  }

  if (purity) {
    query.purity = purity;
  }

  if (designName) {
    query.designName = designName;
  }

  const items = await Stock.find(query).sort(buildSortQuery(sortBy));
  res.json({ items });
});

export const getIssuedStocks = asyncHandler(async (req, res) => {
  const { search = "", category = "", purity = "", status = "", sortBy = "newest" } = req.query;
  
  const query = {};

  if (search) {
    const regex = new RegExp(search, "i");
    query.$or = [
      { "stockSnapshot.itemNumber": regex },
      { "stockSnapshot.itemName": regex },
      { "stockSnapshot.barcode": regex },
      { "stockSnapshot.category": regex },
      { customerId: regex },
      { transactionId: regex }
    ];
  }

  if (category && category !== "All") {
    query["stockSnapshot.category"] = category;
  }

  if (purity && purity !== "All") {
    query["stockSnapshot.purity"] = purity;
  }
  
  if (status && status !== "All") {
    if (status === "Issued") {
      query.movementType = "ISSUE";
    } else if (status === "Returned") {
      query.movementType = "RETURN";
    } else {
      query.movementType = status;
    }
  }

  const sortQuery = buildSortQuery(sortBy);
  
  const rawItems = await mongoose.connection.db.collection('stockmovements').find(query).sort(sortQuery).toArray();
  
  const items = rawItems.map(item => ({
    _id: item._id,
    itemNumber: item.stockSnapshot?.itemNumber || item.itemNumber,
    itemName: item.stockSnapshot?.itemName || item.itemName,
    category: item.stockSnapshot?.category || item.category,
    purity: item.stockSnapshot?.purity || item.purity,
    barcode: item.stockSnapshot?.barcode || item.barcode,
    weight: item.weight || item.stockSnapshot?.grossWeight,
    grossWeight: item.stockSnapshot?.grossWeight,
    count: item.quantity || item.stockSnapshot?.quantity,
    issueDate: item.createdAt,
    issuedTo: item.customerId || item.issuedTo,
    transactionNumber: item.transactionId || item.transactionNumber,
    status: item.movementType === 'ISSUE' ? 'Issued' : (item.movementType === 'RETURN' ? 'Returned' : (item.movementType || 'Issued'))
  }));

  res.json({ items });
});

export const generateItemNumber = asyncHandler(async (_req, res) => {
  const latestStock = await Stock.findOne().sort({ createdAt: -1 }).select("itemNumber");
  const nextSequence = getNumericPart(latestStock?.itemNumber) + 1 || 1;

  res.json({
    itemNumber: formatItemNumber(nextSequence)
  });
});

export const generateBarcode = asyncHandler(async (req, res) => {
  const itemNumber = `${req.body.itemNumber || ""}`.trim();

  if (!itemNumber) {
    throw new AppError("Item Number is required to generate barcode.", 400);
  }

  const sequence = getNumericPart(itemNumber);
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const barcode = `SVJ${yy}${mm}${dd}${String(sequence).padStart(6, "0")}`;

  res.json({ barcode });
});

export const printLabel = asyncHandler(async (req, res) => {
  const { itemNumber, barcode, itemName, grossWeight, purity } = req.body;

  res.json({
    label: {
      itemNumber,
      barcode: barcode || itemNumber,
      itemName,
      grossWeight,
      purity
    }
  });
});

export const createStock = asyncHandler(async (req, res) => {
  const payload = normalizePayload(req.body);
  await validateStockPayload(payload);

  const item = await Stock.create(payload);

  res.status(201).json({
    message: "Stock item created successfully.",
    item
  });
});

export const getStockById = asyncHandler(async (req, res) => {
  const stock = await Stock.findById(req.params.id);

  if (!stock) {
    throw new AppError("Stock item not found.", 404);
  }

  res.json({ item: stock });
});

export const updateStock = asyncHandler(async (req, res) => {
  const stock = await Stock.findById(req.params.id);

  if (!stock) {
    throw new AppError("Stock item not found.", 404);
  }

  const payload = normalizePayload({ ...stock.toObject(), ...req.body });
  await validateStockPayload(payload, stock._id);
  Object.assign(stock, payload);

  await stock.save();
  res.json({ message: "Stock item updated successfully.", item: stock });
});

export const deleteStock = asyncHandler(async (req, res) => {
  const stock = await Stock.findById(req.params.id);

  if (!stock) {
    throw new AppError("Stock item not found.", 404);
  }

  await stock.deleteOne();
  res.json({ message: "Stock item deleted successfully." });
});
