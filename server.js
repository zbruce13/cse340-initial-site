import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

import organizationRoutes from "./src/routes/organizations.js";
import projectRoutes from "./src/routes/projects.js";
import categoryRoutes from "./src/routes/categories.js";

const app = express();
const port = process.env.PORT || 3000;
const dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.join(dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(dirname, "src", "views"));

// Home page
app.get("/", (req, res) => {
  res.render("home", { title: "Home" });
});

// Database health check
app.get("/health", async (req, res) => {
  try {
    const { default: pool } = await import("./src/models/database.js");
    await pool.query("SELECT 1");
    res.send("Database connection successful.");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    res.status(500).send("Database connection failed.");
  }
});

// MVC routes
app.use("/organizations", organizationRoutes);
app.use("/organization", organizationRoutes);

app.use("/projects", projectRoutes);
app.use("/project", projectRoutes);

app.use("/categories", categoryRoutes);
app.use("/category", categoryRoutes);

// 404 error handler
app.use((req, res) => {
  res.status(404).render("errors/404", {
    title: "Page Not Found",
  });
});

// 500 error handler
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).render("errors/500", {
    title: "Server Error",
  });
});

app.listen(port, () => {
  console.log(`Website running at http://localhost:${port}`);
});