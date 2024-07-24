import express from "express";
import Organization from "../models/organization.js";

const router = express.Router();

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
  if (req.headers.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

// Route to create an organization (only accessible by admin)
router.post("/create", isAdmin, async (req, res) => {
  try {
    const { name } = req.body;
    const newOrg = new Organization({ name });
    await newOrg.save();
    res.status(201).json(newOrg);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to add an orgAdmin (only accessible by admin)
router.post("/:orgId/addOrgAdmin", isAdmin, async (req, res) => {
  try {
    const { orgId } = req.params;
    const { orgAdmin } = req.body;
    const org = await Organization.findById(orgId);
    if (!org) {
      return res.status(404).json({ message: "Organization not found." });
    }
    org.orgAdmin = orgAdmin;
    await org.save();
    res.status(200).json(org);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to add a normal user to an organization (only accessible by admin)
router.post("/:orgId/addUser", isAdmin, async (req, res) => {
  try {
    const { orgId } = req.params;
    const { user } = req.body;
    const org = await Organization.findById(orgId);
    if (!org) {
      return res.status(404).json({ message: "Organization not found." });
    }
    org.members.push(user);
    await org.save();
    res.status(200).json(org);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
