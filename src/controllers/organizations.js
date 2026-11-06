
import {
  getOrganizations,
  getOrganizationById,
  createOrganization,
  updateOrganization,
} from "../models/organizations.js";

import {
  getProjectsByOrganizationId,
} from "../models/projects.js";

// Validate organization information
const validateOrganization = (organization) => {
  const errors = [];

  if (!organization.organization_name) {
    errors.push("Organization name is required.");
  } else if (organization.organization_name.length < 3) {
    errors.push("Organization name must be at least 3 characters.");
  } else if (organization.organization_name.length > 150) {
    errors.push("Organization name cannot exceed 150 characters.");
  }

  if (organization.contact_email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(organization.contact_email)) {
      errors.push("Please enter a valid email address.");
    }

    if (organization.contact_email.length > 255) {
      errors.push("Email cannot exceed 255 characters.");
    }
  }

  if (organization.logo_filename.length > 255) {
    errors.push("Logo filename cannot exceed 255 characters.");
  }

  return errors;
};

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

// Display new organization form
const buildNewOrganization = (req, res) => {
  res.render("new-organization", {
    title: "Add Organization",
    errors: [],
    organization: {},
  });
};

// Process new organization form
const createNewOrganization = async (req, res, next) => {
  const organization = {
    organization_name: req.body.organization_name?.trim() || "",
    description: req.body.description?.trim() || "",
    contact_email: req.body.contact_email?.trim() || "",
    logo_filename: req.body.logo_filename?.trim() || "",
  };

  const errors = validateOrganization(organization);

  if (errors.length > 0) {
    return res.status(400).render("new-organization", {
      title: "Add Organization",
      errors,
      organization,
    });
  }

  try {
    await createOrganization(
      organization.organization_name,
      organization.description || null,
      organization.contact_email || null,
      organization.logo_filename || null
    );

    req.flash("success", "Organization created successfully.");
    res.redirect("/organizations");
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).render("new-organization", {
        title: "Add Organization",
        errors: ["An organization with that name already exists."],
        organization,
      });
    }

    next(error);
  }
};

// Display edit organization form
const buildEditOrganization = async (req, res, next) => {
  try {
    const organization = await getOrganizationById(req.params.id);

    if (!organization) {
      return res.status(404).render("errors/404", {
        title: "Page Not Found",
      });
    }

    res.render("edit-organization", {
      title: "Edit Organization",
      organization,
      errors: [],
    });
  } catch (error) {
    next(error);
  }
};

// Process edit organization form
const updateExistingOrganization = async (req, res, next) => {
  const organization = {
    organization_id: req.params.id,
    organization_name: req.body.organization_name?.trim() || "",
    description: req.body.description?.trim() || "",
    contact_email: req.body.contact_email?.trim() || "",
    logo_filename: req.body.logo_filename?.trim() || "",
  };

  const errors = validateOrganization(organization);

  if (errors.length > 0) {
    return res.status(400).render("edit-organization", {
      title: "Edit Organization",
      organization,
      errors,
    });
  }

  try {
    const updated = await updateOrganization(
      organization.organization_id,
      organization.organization_name,
      organization.description || null,
      organization.contact_email || null,
      organization.logo_filename || null
    );

    if (!updated) {
      return res.status(404).render("errors/404", {
        title: "Page Not Found",
      });
    }

    req.flash("success", "Organization updated successfully.");
    res.redirect(`/organizations/${req.params.id}`);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).render("edit-organization", {
        title: "Edit Organization",
        organization,
        errors: ["An organization with that name already exists."],
      });
    }

    next(error);
  }
};

export {
  buildOrganizations,
  buildOrganizationDetails,
  buildNewOrganization,
  createNewOrganization,
  buildEditOrganization,
  updateExistingOrganization,
};
