import {
  getCategories,
  getCategoryById,
  getProjectsByCategoryId,
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

export {
  buildCategories,
  buildCategoryDetails,
};