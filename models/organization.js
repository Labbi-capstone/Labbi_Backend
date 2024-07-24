import mongoose from "mongoose";

const { Schema } = mongoose;

const organizationSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  orgAdmin: { type: Schema.Types.ObjectId, ref: "User", default: null },
  members: [{ type: Schema.Types.ObjectId, ref: "User" }],
  dashboardIds: [{ type: Schema.Types.ObjectId, ref: "Dashboard" }],
});

const Organization = mongoose.model("Organization", organizationSchema);

export default Organization;
