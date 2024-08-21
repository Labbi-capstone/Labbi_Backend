import mongoose from "mongoose";

const { Schema } = mongoose;

const dashboardSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  organization_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  visibility: {
    type: Boolean,
    default: true,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  chart_ids: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chart",
    },
  ],
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

const Dashboard = mongoose.model("Dashboard", dashboardSchema);
export default Dashboard;
