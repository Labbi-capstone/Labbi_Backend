import mongoose from "mongoose";

// Define the schema for the user model
const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true, // Full name is required
  },
  email: {
    type: String,
    required: true, // Email is required
    unique: true, // Email must be unique across users
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, // Regex to validate email format
      "Please fill a valid email address", // Custom error message for invalid emails
    ],
  },
  password: {
    type: String,
    required: true, // Password is required
  },
  role: {
    type: String,
    required: false, // Role is required
    enum: ["user", "developer", "admin", "adminOrg"], // Enum to restrict role to specific values
    default: "user", // Default role if not specified
  },
  dashboardUids: [
    {
      type: String,
      required: false, // Each dashboard UID is required
    },
  ],
});

// Pre-save hook to hash the password before saving the user document
userSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10); // Generate a salt
  this.password = await bcrypt.hash(this.password, salt); // Hash the password with the salt
});

// Method to compare a candidate password with the user's password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password); // Returns true if passwords match
};

// Define a schema for AdminOrg which extends userSchema with an additional field for organizations
const AdminOrgSchema = new mongoose.Schema({
  ...userSchema.obj, // Spread operator to inherit properties from userSchema
  orgs: [String], // List of organizations the adminOrg owns
});

// Create models from the schemas
const User = mongoose.model("User", userSchema);
const AdminOrg = mongoose.model("AdminOrg", AdminOrgSchema);

// Export the models
export { User, AdminOrg };




