
import express from "express";

import {
  buildCategories,
  buildCategoryDetails,
  buildNewCategory,
  createNewCategory,
  buildEditCategory,
  updateExistingCategory,
} from "../controllers/categories.js";

const router = express.Router();

// Category list and details
router.get("/categories", buildCategories);
router.get("/categories/:id", buildCategoryDetails);

// Preserve the old singular URL aliases
router.get("/category", buildCategories);
router.get("/category/:id", buildCategoryDetails);

// Create category
router.get("/new-category", buildNewCategory);
router.post("/new-category", createNewCategory);

// Edit category
router.get("/edit-category/:id", buildEditCategory);
router.post("/edit-category/:id", updateExistingCategory);

export default router;
