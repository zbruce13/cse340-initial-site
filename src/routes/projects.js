
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

const router = express.Router();

// Display projects
router.get("/", buildProjects);

// Create projects
router.get("/new", buildNewProject);
router.post("/new", createNewProject);

// Edit project categories (keep before the general ID route)
router.get(
  "/edit-project-categories/:id",
  buildEditProjectCategories
);
router.post(
  "/edit-project-categories/:id",
  updateProjectCategoryAssignments
);

// Edit projects
router.get("/edit/:id", buildEditProject);
router.post("/edit/:id", updateExistingProject);

// Project details
router.get("/:id", buildProjectDetails);

export default router;
