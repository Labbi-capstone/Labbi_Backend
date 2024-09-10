import mongoose from "mongoose";
import Organization from "../models/organizationModel.js";
import { User } from "../models/userModel.js";

// Middleware to check if the user is an admin
// This would be implemented separately based on your authentication and authorization setup

// Controller to create an organization (only accessible by admin)
export const createOrganization = async (req, res) => {
  try {
    const { name, orgAdmins, members } = req.body;

    const newOrg = new Organization({
      name,
      orgAdmins: orgAdmins || [], // Admins can be added during creation if needed
      members: members || [], // Members can be added during creation if needed
    });

    await newOrg.save();
    res.status(201).json(newOrg);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to list all organizations
export const listOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.find();
    res.status(200).json(organizations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const listOrgByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find organizations where the user is either an admin or a member
    const organizations = await Organization.find({
      $or: [{ orgAdmins: userId }, { members: userId }],
    });

    // Return organizations if found
    if (organizations.length === 0) {
      return res
        .status(404)
        .json({ message: "No organizations found for this user." });
    }

    res.status(200).json(organizations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to list users (admins and members) within an organization
export const listOrganizationUsers = async (req, res) => {
  try {
    const { orgId } = req.params;

    // Fetch the organization by ID and populate the orgAdmins and members arrays
    const organization = await Organization.findById(orgId)
      .populate("orgAdmins", "fullName email role") // Populate with selected fields
      .populate("members", "fullName email role");

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // Combine orgAdmins and members into a single response
    const users = [
      ...organization.orgAdmins.map((user) => ({
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: "orgAdmin",
      })),
      ...organization.members.map((user) => ({
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: "member",
      })),
    ];

    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to list users not in a specific organization
export const listUsersNotInOrg = async (req, res) => {
  try {
    const { orgId } = req.params;

    // Fetch organization by ID and populate members and orgAdmins
    const organization = await Organization.findById(orgId)
      .populate("members", "_id") // Populate only IDs for better performance
      .populate("orgAdmins", "_id");

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

    // Format the response
    const users = usersNotInOrg.map((user) => ({
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    }));

    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to add orgAdmins (only accessible by admin)
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
        return res
          .status(404)
          .json({ message: `User with ID ${adminId} not found.` });
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

// Controller to add members to an organization (only accessible by admin)
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
        return res
          .status(404)
          .json({ message: `User with ID ${memberId} not found.` });
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
// Controller to remove a user (admin or member) from an organization
export const removeUserFromOrg = async (req, res) => {
  try {
    const { orgId, userId } = req.params;

    // Find the organization by ID
    const org = await Organization.findById(orgId);
    if (!org) {
      return res.status(404).json({ message: "Organization not found." });
    }

    // Check if the user is an orgAdmin or a member
    const isOrgAdmin = org.orgAdmins.includes(userId);
    const isMember = org.members.includes(userId);

    if (!isOrgAdmin && !isMember) {
      return res
        .status(404)
        .json({ message: "User is not part of the organization." });
    }

    // Remove the user from the respective array
    if (isOrgAdmin) {
      org.orgAdmins = org.orgAdmins.filter((adminId) => adminId.toString() !== userId);
    }

    if (isMember) {
      org.members = org.members.filter((memberId) => memberId.toString() !== userId);
    }

    // Save the updated organization
    await org.save();

    res.status(200).json({ message: "User removed from organization successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
