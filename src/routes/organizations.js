
import express from "express";

import {
  buildOrganizations,
  buildOrganizationDetails,
  buildNewOrganization,
  createNewOrganization,
  buildEditOrganization,
  updateExistingOrganization,
} from "../controllers/organizations.js";

import { requireRole } from "../middleware/auth.js";

const router = express.Router();

// Display all organizations (available to everyone)
router.get("/", buildOrganizations);

// Display new organization form (admin only)
router.get("/new", requireRole("admin"), buildNewOrganization);

// Process new organization form (admin only)
router.post("/new", requireRole("admin"), createNewOrganization);

// Display edit organization form (admin only)
router.get("/edit/:id", requireRole("admin"), buildEditOrganization);

// Process edit organization form (admin only)
router.post("/edit/:id", requireRole("admin"), updateExistingOrganization);

// Display one organization (available to everyone)
router.get("/:id", buildOrganizationDetails);

export default router;
