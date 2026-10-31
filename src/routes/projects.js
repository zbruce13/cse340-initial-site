import express from "express";

import {
  buildProjects,
  buildProjectDetails,
} from "../controllers/projects.js";

const router = express.Router();

router.get("/", buildProjects);
router.get("/:id", buildProjectDetails);

export default router;