
import express from "express";

import {
  buildOrganizations,
  buildOrganizationDetails,
  buildNewOrganization,
  createNewOrganization,
  buildEditOrganization,
  updateExistingOrganization,
} from "../controllers/organizations.js";

const router = express.Router();

// Display all organizations
router.get("/", buildOrganizations);

// Display new organization form
router.get("/new", buildNewOrganization);

// Process new organization form
router.post("/new", createNewOrganization);

// Display edit organization form
router.get("/edit/:id", buildEditOrganization);

// Process edit organization form
router.post("/edit/:id", updateExistingOrganization);

// Display one organization
router.get("/:id", buildOrganizationDetails);

export default router;
