
import {
  getOrganizations,
  getOrganizationById,
} from "../models/organizations.js";

import {
  getProjectsByOrganizationId,
} from "../models/projects.js";

// Display all organizations
const buildOrganizations = async (req, res, next) => {
  try {
    const organizations = await getOrganizations();

    res.render("organizations", {
      title: "Organizations",
      organizations,
    });
  } catch (error) {
    next(error);
  }
};

// Display one organization and its projects
const buildOrganizationDetails = async (req, res, next) => {
  try {
    const organizationId = req.params.id;

    const organization = await getOrganizationById(organizationId);

    if (!organization) {
      return res.status(404).render("errors/404", {
        title: "Page Not Found",
      });
    }

    const projects = await getProjectsByOrganizationId(organizationId);

    res.render("organization", {
      title: organization.organization_name,
      organization,
      projects,
    });
  } catch (error) {
    next(error);
  }
};

export {
  buildOrganizations,
  buildOrganizationDetails,
};
