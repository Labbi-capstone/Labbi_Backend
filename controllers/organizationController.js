import Organization from "../models/organizationModel.js";
import mongoose from "mongoose";
import {User} from "../models/userModel.js"; 

// Middleware to check if the user is an admin
export const isAdmin = (req, res, next) => {
  if (req.headers.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

// Controller to create an organization (only accessible by admin)
export const createOrganization = async (req, res) => {
  try {
    const { name } = req.body;
    const newOrg = new Organization({ name });
    await newOrg.save();
    res.status(201).json(newOrg);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to add an orgAdmin (only accessible by admin)
export const addOrgAdmin = async (req, res) => {
  try {
    const { orgId } = req.params;
    const { orgAdmins } = req.body;

    // Validate the user
    const user = await User.findById(orgAdmins);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const org = await Organization.findById(orgId);
    if (!org) {
      return res.status(404).json({ message: "Organization not found." });
    }

    // Add the user to orgAdmins array if not already present
    if (!org.orgAdmins.includes(orgAdmins)) {
      org.orgAdmins.push(orgAdmins);
    }

    await org.save();
    res.status(200).json(org);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to add a user to an organization (only accessible by admin)
export const addOrganizationUser = async (req, res) => {
  try {
    const { orgId } = req.params;
    const { user } = req.body;

    // Validate the user
    const userExists = await User.findById(user);
    if (!userExists) {
      return res.status(404).json({ message: "User not found." });
    }

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
};