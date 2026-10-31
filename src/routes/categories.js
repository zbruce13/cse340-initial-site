import express from "express";

import {
  buildCategories,
  buildCategoryDetails,
} from "../controllers/categories.js";

const router = express.Router();

router.get("/", buildCategories);
router.get("/:id", buildCategoryDetails);

export default router;