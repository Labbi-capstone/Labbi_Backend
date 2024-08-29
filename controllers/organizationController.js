import Organization from "../models/organizationModel.js";
import mongoose from "mongoose";
import {User} from "../models/userModel.js"; 

// Middleware to check if the user is an admin


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
export const listOrganizations = async (req, res) => {
  try {
    console.log("Listing organizations...");
    const organizations = await Organization.find();
    res.status(200).json(organizations);
  } catch (error) {
    console.error("Error fetching organizations:", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const listOrganizationUsers = async (req, res) => {
  try {
    const { orgId } = req.params;

    // Fetch the organization by ID
    const organization = await Organization.findById(orgId)
      .populate("orgAdmins")
      .populate("members");

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // Prepare the response with users categorized by their roles
    const orgAdmins = organization.orgAdmins.map((user) => ({
      fullName: user.fullName,
      email: user.email,
      role: "orgAdmin",
    }));

    const members = organization.members.map((user) => ({
      fullName: user.fullName,
      email: user.email,
      role: "member",
    }));

    const users = [...orgAdmins, ...members];

    res.status(200).json({ users });
  } catch (error) {
    console.error("Error listing users:", error.message);
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
export const addOrgUser = async (req, res) => {
  try {
    const { orgId } = req.params;
    const { members } = req.body; // Notice the change here from `user` to `members`

    // Validate the user
    const userExists = await User.findById(members);
    if (!userExists) {
      return res.status(404).json({ message: "User not found." });
    }

    const org = await Organization.findById(orgId);
    if (!org) {
      return res.status(404).json({ message: "Organization not found." });
    }

    // Ensure the user is not already a member
    if (!org.members.includes(members)) {
      org.members.push(members);
    }

    await org.save();
    res.status(200).json(org);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
