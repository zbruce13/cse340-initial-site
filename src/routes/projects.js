import express from "express";
import { body } from "express-validator";

import {
  buildProjects,
  buildProjectDetails,
  buildNewProject,
  createNewProject,
  buildEditProject,
  updateExistingProject,
  buildEditProjectCategories,
  updateProjectCategoryAssignments,
} from "../controllers/projects.js";

import { requireRole } from "../middleware/auth.js";

const router = express.Router();

// Project validation
const projectValidation = [
  body("project_name")
    .trim()
    .notEmpty()
    .withMessage("Project name is required.")
    .isLength({ min: 3, max: 100 })
    .withMessage("Project name must be between 3 and 100 characters."),
];

// Display projects (available to everyone)
router.get("/", buildProjects);

// Create projects (admin only)
router.get("/new", requireRole("admin"), buildNewProject);
router.post(
  "/new",
  requireRole("admin"),
  projectValidation,
  createNewProject
);

// Edit project categories (admin only)
router.get(
  "/edit-project-categories/:id",
  requireRole("admin"),
  buildEditProjectCategories
);

router.post(
  "/edit-project-categories/:id",
  requireRole("admin"),
  updateProjectCategoryAssignments
);

// Edit projects (admin only)
router.get("/edit/:id", requireRole("admin"), buildEditProject);
router.post(
  "/edit/:id",
  requireRole("admin"),
  projectValidation,
  updateExistingProject
);

// Project details (available to everyone)
router.get("/:id", buildProjectDetails);

export default router;