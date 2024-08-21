import mongoose from "mongoose";

const chartSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  query_url: {
    type: String,
    required: true,
  },
  query_params: {
    type: Map,
    of: String,
  },
  chart_type: {
    type: String,
    enum: ["line", "bar", "pie"],
    required: true,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

export const Chart = mongoose.model("Chart", chartSchema);
