import {
  getProjectById,
  getUpcomingProjects,
} from "../models/projects.js";

import {
  getCategoriesByProjectId,
} from "../models/categories.js";

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

export {
  buildProjects,
  buildProjectDetails,
};