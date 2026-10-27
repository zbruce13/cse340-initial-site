
import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { getOrganizations } from "./src/models/organizations.js";
import { getProjects } from "./src/models/projects.js";
import { getCategories } from "./src/models/categories.js";
import pool from "./src/models/database.js";

const app = express();
const port = process.env.PORT || 3000;
const dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.join(dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(dirname, "src", "views"));

app.get("/", (req, res) => {
  res.render("home", { title: "Home" });
});

app.get("/organizations", async (req, res, next) => {
  try {
    const organizations = await getOrganizations();
    res.render("organizations", {
      title: "Organizations",
      organizations,
    });
  } catch (error) {
    next(error);
  }
});

app.get("/projects", async (req, res, next) => {
  try {
    const projects = await getProjects();
    res.render("projects", {
      title: "Service Projects",
      projects,
    });
  } catch (error) {
    next(error);
  }
});

app.get("/categories", async (req, res, next) => {
  try {
    const categories = await getCategories();
    res.render("categories", {
      title: "Service Project Categories",
      categories,
    });
  } catch (error) {
    next(error);
  }
});

app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.send("Database connection successful.");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    res.status(500).send("Database connection failed.");
  }
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).send("Server error. Check the VS Code terminal.");
});

app.use((req, res) => {
  res.status(404).send("Page not found");
});

app.listen(port, () => {
  console.log(`Website running at http://localhost:${port}`);
});
