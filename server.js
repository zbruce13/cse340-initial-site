
import "dotenv/config";
import express from "express";
import session from "express-session";
import flash from "connect-flash";
import path from "node:path";
import { fileURLToPath } from "node:url";

import organizationRoutes from "./src/routes/organizations.js";
import projectRoutes from "./src/routes/projects.js";
import categoryRoutes from "./src/routes/categories.js";
import accountRoutes from "./src/routes/account.js";

import { getAllUsers } from "./src/models/users.js";
import { requireRole } from "./src/middleware/auth.js";

const app = express();
const port = process.env.PORT || 3000;
const dirname = path.dirname(fileURLToPath(import.meta.url));

// Static files and form data
app.use(express.static(path.join(dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "cse340-development-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
    },
  })
);

// Flash messages
app.use(flash());

// Make user information and messages available to EJS
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  res.locals.success_msg = req.flash("success");
  res.locals.error_msg = req.flash("error");
  next();
});

// EJS configuration
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

// Authentication routes
app.use("/account", accountRoutes);

// Registered users page (admin only)
app.get("/users", requireRole("admin"), async (req, res, next) => {
  try {
    const users = await getAllUsers();

    res.render("users", {
      title: "Registered Users",
      users,
    });
  } catch (error) {
    next(error);
  }
});

// Organization routes
app.use("/organizations", organizationRoutes);
app.use("/organization", organizationRoutes);

// Project routes
app.use("/projects", projectRoutes);
app.use("/project", projectRoutes);

// Category routes
app.use("/", categoryRoutes);

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

// Start server
app.listen(port, () => {
  console.log(`Website running at http://localhost:${port}`);
});
