import express from "express";
import { isAdmin, createOrganization, addOrgAdmin, addOrganizationUser } from "../controllers/organizationController.js";

const router = express.Router();

// Route to create an organization (only accessible by admin)
router.post("/create", isAdmin, createOrganization);

// Route to add an orgAdmin (only accessible by admin)
router.post("/:orgId/addOrgAdmin", isAdmin, addOrgAdmin);

// Route to add a normal user to an organization (only accessible by admin)

router.post("/:orgId/addOrganizationUser", isAdmin, addOrganizationUser);

export default router;