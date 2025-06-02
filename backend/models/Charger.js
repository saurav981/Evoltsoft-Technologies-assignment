import mongoose from "mongoose";

const chargerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    powerOutput: { type: Number, required: true },
    connectorType: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Charger", chargerSchema);
