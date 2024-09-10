import express from "express";
import {
  listOrganizations,
  listOrganizationUsers,
  listUsersNotInOrg,
  createOrganization,
  addOrgAdmin,
  addOrgMember,
  listOrgByUserId,
  removeUserFromOrg,
} from "../controllers/organizationController.js";
import { authenticateUser, isAdmin } from "../middlewares/authenticate.js";

const router = express.Router();

// Route to create an organization (only accessible by admin)
router.post("/create", authenticateUser, isAdmin, createOrganization);
// Route to list all organizations (accessible by admin only)
router.get("/list", authenticateUser, listOrganizations);

router.get("/user/:userId/orgs", authenticateUser, listOrgByUserId);

// Route to list all users in an organization (accessible by admin only)
router.get("/:orgId/users", authenticateUser, listOrganizationUsers);

router.get(
  "/:orgId/users/not-in-org",
  authenticateUser,
  isAdmin,
  listUsersNotInOrg
);
// Route to add an orgAdmin (only accessible by admin)
router.post("/:orgId/addOrgAdmin", authenticateUser, isAdmin, addOrgAdmin);

// Route to add a normal user to an organization (only accessible by admin)

router.post("/:orgId/addOrgMember", authenticateUser, isAdmin, addOrgMember);

// Route to remove a user from an organization (only accessible by admin)
router.delete("/:orgId/removeUser/:userId", removeUserFromOrg);

export default router;
