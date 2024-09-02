import mongoose from "mongoose";

const chartSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  prometheus_endpoint_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PrometheusEndpoint",
    required: true,
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
    required: false,
  },
  dashboard_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Dashboard",
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

