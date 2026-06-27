import mongoose from "mongoose";

const goldRateEntrySchema = new mongoose.Schema(
  {
    rate: { type: Number, required: true },
    updatedBy: { type: String, default: "System" },
    updatedAt: { type: Date, default: () => new Date() }
  },
  { _id: false }
);

const settingsSchema = new mongoose.Schema(
  {
    shopName: { type: String, default: "Sri Vaishnavi Jewellers", trim: true },
    ownerName: { type: String, default: "", trim: true },
    shopAddress: {
      type: String,
      default:
        "No 370, Big Bazaar Street\n(Opp - B.G. Naidu Sweets)\nTrichy",
      trim: true
    },
    phone1: { type: String, default: "", trim: true },
    phone2: { type: String, default: "", trim: true },
    email: {
      type: String,
      default: "srivaishnavijewellers1@gmail.com",
      trim: true
    },
    gstNumber: { type: String, default: "", trim: true },
    shopLogo: { type: String, default: "" },

    goldRate: { type: Number, default: 0 },
    goldRateUpdatedBy: { type: String, default: "" },
    goldRateUpdatedAt: { type: Date, default: null },
    goldRateHistory: { type: [goldRateEntrySchema], default: [] },

    barcodePrefix: { type: String, default: "SVJ", trim: true },
    itemNumberPrefix: { type: String, default: "SVJ", trim: true }
  },
  { timestamps: true }
);

export const Settings = mongoose.model("Settings", settingsSchema);
