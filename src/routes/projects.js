
import express from "express";

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

// Display projects (available to everyone)
router.get("/", buildProjects);

// Create projects (admin only)
router.get("/new", requireRole("admin"), buildNewProject);
router.post("/new", requireRole("admin"), createNewProject);

// Edit project categories (admin only)
// Keep these routes before the general ID route.
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
router.post("/edit/:id", requireRole("admin"), updateExistingProject);

// Project details (available to everyone)
router.get("/:id", buildProjectDetails);

export default router;
