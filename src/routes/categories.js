import express from "express";
import { body } from "express-validator";

import {
  buildCategories,
  buildCategoryDetails,
  buildNewCategory,
  createNewCategory,
  buildEditCategory,
  updateExistingCategory,
} from "../controllers/categories.js";

import { requireRole } from "../middleware/auth.js";

const router = express.Router();

// Category list and details (available to everyone)
router.get("/categories", buildCategories);
router.get("/categories/:id", buildCategoryDetails);

// Preserve the old singular URL aliases
router.get("/category", buildCategories);
router.get("/category/:id", buildCategoryDetails);

// Category validation
const categoryValidation = [
  body("category_name")
    .trim()
    .notEmpty()
    .withMessage("Category name is required.")
    .isLength({ min: 3, max: 100 })
    .withMessage("Category name must be between 3 and 100 characters."),
];

// Create category (admin only)
router.get("/new-category", requireRole("admin"), buildNewCategory);
router.post(
  "/new-category",
  requireRole("admin"),
  categoryValidation,
  createNewCategory
);

// Edit category (admin only)
router.get("/edit-category/:id", requireRole("admin"), buildEditCategory);
router.post(
  "/edit-category/:id",
  requireRole("admin"),
  categoryValidation,
  updateExistingCategory
);

export default router;