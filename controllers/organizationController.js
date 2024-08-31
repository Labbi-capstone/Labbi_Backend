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

    // Fetch the organization by ID and populate the orgAdmins and members arrays
    const organization = await Organization.findById(orgId)
      .populate("orgAdmins")
      .populate("members");

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // Prepare the response with users categorized by their roles and include the id
    const orgAdmins = organization.orgAdmins.map((user) => ({
      id: user._id, // Add the user ID here
      fullName: user.fullName,
      email: user.email,
      role: "orgAdmin",
    }));

    const members = organization.members.map((user) => ({
      id: user._id, // Add the user ID here
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

// Fetch users not in a specific organization
export const listUsersNotInOrg = async (req, res) => {
  try {
    const { orgId } = req.params;

    // Fetch organization by ID
    const organization = await Organization.findById(orgId).populate(
      "members orgAdmins"
    );

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // Get IDs of all members (including orgAdmins) in the organization
    const orgMemberIds = [
      ...organization.members.map((member) => member._id),
      ...organization.orgAdmins.map((admin) => admin._id),
    ];

    // Fetch users not in the organization
    const usersNotInOrg = await User.find({
      _id: { $nin: orgMemberIds }, // Exclude users who are in the organization
    });

    // Format the response to include id, fullName, email, and role
    const users = usersNotInOrg.map((user) => ({
      id: user._id, // Add the user ID here
      fullName: user.fullName,
      email: user.email,
      role: user.role, // Assuming 'role' field exists in your User schema
    }));

    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ message: error.message });
  }
};


// Controller to add an orgAdmin (only accessible by admin)
// Controller to add multiple orgAdmins (only accessible by admin)
export const addOrgAdmin = async (req, res) => {
  try {
    const { orgId } = req.params;
    const { orgAdmins } = req.body; // Expecting an array of user IDs

    const org = await Organization.findById(orgId);
    if (!org) {
      return res.status(404).json({ message: "Organization not found." });
    }

    // Validate each user and add them to orgAdmins array if not already present
    for (const adminId of orgAdmins) {
      const user = await User.findById(adminId);
      if (!user) {
        return res.status(404).json({ message: `User with ID ${adminId} not found.` });
      }
      if (!org.orgAdmins.includes(adminId)) {
        org.orgAdmins.push(adminId);
      }
    }

    await org.save();
    res.status(200).json(org);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Controller to add multiple users to an organization (only accessible by admin)
export const addOrgMember = async (req, res) => {
  try {
    const { orgId } = req.params;
    const { members } = req.body; // Expecting an array of user IDs

    const org = await Organization.findById(orgId);
    if (!org) {
      return res.status(404).json({ message: "Organization not found." });
    }

    // Validate each user and add them to members array if not already present
    for (const memberId of members) {
      const user = await User.findById(memberId);
      if (!user) {
        return res.status(404).json({ message: `User with ID ${memberId} not found.` });
      }
      if (!org.members.includes(memberId)) {
        org.members.push(memberId);
      }
    }

    await org.save();
    res.status(200).json(org);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

