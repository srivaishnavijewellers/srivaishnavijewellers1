import mongoose from "mongoose";

const stockSchema = new mongoose.Schema(
  {
    itemNumber: {
      type: String,
      required: true,
      trim: true
    },
    itemName: {
      type: String,
      required: true,
      trim: true
    },
    designName: {
      type: String,
      default: "",
      trim: true
    },
    subCategory: {
      type: String,
      default: "",
      trim: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    barcode: {
      type: String,
      default: "",
      trim: true
    },
    weight: {
      type: Number,
      required: true,
      min: 0
    },
    grossWeight: {
      type: Number,
      required: true,
      min: 0
    },
    netWeight: {
      type: Number,
      default: null,
      min: 0
    },
    count: {
      type: Number,
      default: 1,
      min: 0
    },
    purity: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ["Available", "Issued", "Sold"],
      default: "Available"
    },
    description: {
      type: String,
      default: "",
      trim: true
    },
    supplier: {
      type: String,
      default: "",
      trim: true
    },
    createdBy: {
      type: String,
      default: "System"
    },
    addedBy: {
      type: String,
      default: "System"
    }
  },
  {
    timestamps: true
  }
);

export const Stock = mongoose.model("Stock", stockSchema);
