
import { validationResult } from "express-validator";

import {
  getProjectById,
  getUpcomingProjects,
  createProject,
  updateProject,
} from "../models/projects.js";

import {
  getCategories,
  getCategoriesByProjectId,
  updateProjectCategories,
} from "../models/categories.js";

import {
  getOrganizations,
} from "../models/organizations.js";

// Validate additional project information
const validateProject = (project, organizations) => {
  const errors = [];

  if (!project.description) {
    errors.push("Project description is required.");
  }

  if (!project.organization_id) {
    errors.push("Please select an organization.");
  } else if (
    !organizations.some(
      (organization) =>
        String(organization.organization_id) ===
        String(project.organization_id)
    )
  ) {
    errors.push("Please select a valid organization.");
  }

  if (project.location.length > 200) {
    errors.push("Location cannot exceed 200 characters.");
  }

  if (project.project_date) {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;

    if (!datePattern.test(project.project_date)) {
      errors.push("Please enter a valid project date.");
    } else {
      const date = new Date(`${project.project_date}T00:00:00`);

      if (
        Number.isNaN(date.getTime()) ||
        date.toISOString().slice(0, 10) !== project.project_date
      ) {
        errors.push("Please enter a valid project date.");
      }
    }
  }

  return errors;
};

// Display the next five upcoming projects
const buildProjects = async (req, res, next) => {
  try {
    const projects = await getUpcomingProjects();

    res.render("projects", {
      title: "Upcoming Service Projects",
      projects,
    });
  } catch (error) {
    next(error);
  }
};

// Display one project and its categories
const buildProjectDetails = async (req, res, next) => {
  try {
    const projectId = req.params.id;
    const project = await getProjectById(projectId);

    if (!project) {
      return res.status(404).render("errors/404", {
        title: "Page Not Found",
      });
    }

    const categories = await getCategoriesByProjectId(projectId);

    res.render("project", {
      title: project.project_name,
      project,
      categories,
    });
  } catch (error) {
    next(error);
  }
};

// Display new project form
const buildNewProject = async (req, res, next) => {
  try {
    const organizations = await getOrganizations();

    res.render("new-project", {
      title: "Add Service Project",
      organizations,
      errors: [],
      project: {},
    });
  } catch (error) {
    next(error);
  }
};

// Process new project form
const createNewProject = async (req, res, next) => {
  const project = {
    project_name: req.body.project_name || "",
    description: req.body.description?.trim() || "",
    organization_id: req.body.organization_id || "",
    location: req.body.location?.trim() || "",
    project_date: req.body.project_date || "",
  };

  try {
    const organizations = await getOrganizations();

    const validationErrors = validationResult(req).array().map(
      (error) => error.msg
    );

    const errors = [
      ...validationErrors,
      ...validateProject(project, organizations),
    ];

    if (errors.length > 0) {
      return res.status(400).render("new-project", {
        title: "Add Service Project",
        organizations,
        project,
        errors,
      });
    }

    const newProject = await createProject(
      project.project_name,
      project.description,
      project.organization_id,
      project.location || null,
      project.project_date || null
    );

    req.flash("success", "Project created successfully!");
    res.redirect(`/projects/${newProject.project_id}`);
  } catch (error) {
    if (error.code === "23505") {
      const organizations = await getOrganizations();

      return res.status(400).render("new-project", {
        title: "Add Service Project",
        organizations,
        project,
        errors: ["A project with that name already exists."],
      });
    }

    next(error);
  }
};

// Display edit project form
const buildEditProject = async (req, res, next) => {
  try {
    const project = await getProjectById(req.params.id);

    if (!project) {
      return res.status(404).render("errors/404", {
        title: "Page Not Found",
      });
    }

    const organizations = await getOrganizations();

    res.render("edit-project", {
      title: "Edit Service Project",
      project,
      organizations,
      errors: [],
    });
  } catch (error) {
    next(error);
  }
};

// Process edit project form
const updateExistingProject = async (req, res, next) => {
  const project = {
    project_id: req.params.id,
    project_name: req.body.project_name || "",
    description: req.body.description?.trim() || "",
    organization_id: req.body.organization_id || "",
    location: req.body.location?.trim() || "",
    project_date: req.body.project_date || "",
  };

  try {
    const organizations = await getOrganizations();

    const validationErrors = validationResult(req).array().map(
      (error) => error.msg
    );

    const errors = [
      ...validationErrors,
      ...validateProject(project, organizations),
    ];

    if (errors.length > 0) {
      return res.status(400).render("edit-project", {
        title: "Edit Service Project",
        project,
        organizations,
        errors,
      });
    }

    await updateProject(
      project.project_id,
      project.project_name,
      project.description,
      project.organization_id,
      project.location || null,
      project.project_date || null
    );

    req.flash("success", "Project updated successfully!");
    res.redirect(`/projects/${project.project_id}`);
  } catch (error) {
    if (error.code === "23505") {
      const organizations = await getOrganizations();

      return res.status(400).render("edit-project", {
        title: "Edit Service Project",
        project,
        organizations,
        errors: ["A project with that name already exists."],
      });
    }

    next(error);
  }
};

// Display category assignment form
const buildEditProjectCategories = async (req, res, next) => {
  try {
    const projectId = req.params.id;
    const project = await getProjectById(projectId);

    if (!project) {
      return res.status(404).render("errors/404", {
        title: "Page Not Found",
      });
    }

    const categories = await getCategories();
    const assignedCategories = await getCategoriesByProjectId(projectId);

    const assignedCategoryIds = assignedCategories.map((category) =>
      String(category.category_id)
    );

    res.render("edit-project-categories", {
      title: "Edit Project Categories",
      project,
      categories,
      assignedCategoryIds,
    });
  } catch (error) {
    next(error);
  }
};

// Save category assignments
const updateProjectCategoryAssignments = async (req, res, next) => {
  try {
    const projectId = req.params.id;
    const project = await getProjectById(projectId);

    if (!project) {
      return res.status(404).render("errors/404", {
        title: "Page Not Found",
      });
    }

    let categoryIds = req.body.category_ids || [];

    if (!Array.isArray(categoryIds)) {
      categoryIds = [categoryIds];
    }

    const categories = await getCategories();
    const validCategoryIds = new Set(
      categories.map((category) => String(category.category_id))
    );

    categoryIds = categoryIds.filter((id) =>
      validCategoryIds.has(String(id))
    );

    await updateProjectCategories(projectId, categoryIds);

    req.flash("success", "Project categories updated successfully!");
    res.redirect(`/projects/${projectId}`);
  } catch (error) {
    next(error);
  }
};

export {
  buildProjects,
  buildProjectDetails,
  buildNewProject,
  createNewProject,
  buildEditProject,
  updateExistingProject,
  buildEditProjectCategories,
  updateProjectCategoryAssignments,
};
