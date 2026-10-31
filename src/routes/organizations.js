import express from "express";

import {
  buildOrganizations,
  buildOrganizationDetails,
} from "../controllers/organizations.js";

const router = express.Router();

router.get("/", buildOrganizations);
router.get("/:id", buildOrganizationDetails);

export default router;