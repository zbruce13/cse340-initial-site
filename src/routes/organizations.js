import express from "express";
import { body } from "express-validator";

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

// Organization validation
const organizationValidation = [
  body("organization_name")
    .trim()
    .notEmpty()
    .withMessage("Organization name is required.")
    .isLength({ min: 3, max: 100 })
    .withMessage("Organization name must be between 3 and 100 characters."),
];

// Display all organizations (available to everyone)
router.get("/", buildOrganizations);

// Display new organization form (admin only)
router.get("/new", requireRole("admin"), buildNewOrganization);

// Process new organization form (admin only)
router.post(
  "/new",
  requireRole("admin"),
  organizationValidation,
  createNewOrganization
);

// Display edit organization form (admin only)
router.get("/edit/:id", requireRole("admin"), buildEditOrganization);

// Process edit organization form (admin only)
router.post(
  "/edit/:id",
  requireRole("admin"),
  organizationValidation,
  updateExistingOrganization
);

// Display one organization (available to everyone)
router.get("/:id", buildOrganizationDetails);

export default router;