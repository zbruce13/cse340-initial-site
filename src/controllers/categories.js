import { validationResult } from "express-validator";

import {
  getCategories,
  getCategoryById,
  getProjectsByCategoryId,
  createCategory,
  updateCategory,
} from "../models/categories.js";

// Display all categories
const buildCategories = async (req, res, next) => {
  try {
    const categories = await getCategories();

    res.render("categories", {
      title: "Service Project Categories",
      categories,
    });
  } catch (error) {
    next(error);
  }
};

// Display one category and its projects
const buildCategoryDetails = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const category = await getCategoryById(categoryId);

    if (!category) {
      return res.status(404).render("errors/404", {
        title: "Page Not Found",
      });
    }

    const projects = await getProjectsByCategoryId(categoryId);

    res.render("category", {
      title: category.category_name,
      category,
      projects,
    });
  } catch (error) {
    next(error);
  }
};

// Display new category form
const buildNewCategory = (req, res) => {
  res.render("new-category", {
    title: "Add Category",
    errors: [],
    category_name: "",
  });
};

// Process new category form
const createNewCategory = async (req, res, next) => {
  const errors = validationResult(req);
  const categoryName = req.body.category_name;

  if (!errors.isEmpty()) {
    return res.status(400).render("new-category", {
      title: "Add Category",
      errors: errors.array().map((error) => error.msg),
      category_name: categoryName,
    });
  }

  try {
    await createCategory(categoryName);

    req.flash("success", "Category created successfully!");
    res.redirect("/categories");
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).render("new-category", {
        title: "Add Category",
        errors: ["A category with that name already exists."],
        category_name: categoryName,
      });
    }

    next(error);
  }
};

// Display edit category form
const buildEditCategory = async (req, res, next) => {
  try {
    const category = await getCategoryById(req.params.id);

    if (!category) {
      return res.status(404).render("errors/404", {
        title: "Page Not Found",
      });
    }

    res.render("edit-category", {
      title: "Edit Category",
      category,
      errors: [],
    });
  } catch (error) {
    next(error);
  }
};

// Process edit category form
const updateExistingCategory = async (req, res, next) => {
  const errors = validationResult(req);
  const categoryName = req.body.category_name;
  const categoryId = req.params.id;

  try {
    const category = await getCategoryById(categoryId);

    if (!category) {
      return res.status(404).render("errors/404", {
        title: "Page Not Found",
      });
    }

    if (!errors.isEmpty()) {
      category.category_name = categoryName;

      return res.status(400).render("edit-category", {
        title: "Edit Category",
        category,
        errors: errors.array().map((error) => error.msg),
      });
    }

    await updateCategory(categoryId, categoryName);

    req.flash("success", "Category updated successfully!");
    res.redirect(`/categories/${categoryId}`);
  } catch (error) {
    if (error.code === "23505") {
      try {
        const category = await getCategoryById(categoryId);

        if (!category) {
          return res.status(404).render("errors/404", {
            title: "Page Not Found",
          });
        }

        category.category_name = categoryName;

        return res.status(400).render("edit-category", {
          title: "Edit Category",
          category,
          errors: ["A category with that name already exists."],
        });
      } catch (lookupError) {
        return next(lookupError);
      }
    }

    next(error);
  }
};

export {
  buildCategories,
  buildCategoryDetails,
  buildNewCategory,
  createNewCategory,
  buildEditCategory,
  updateExistingCategory,
};