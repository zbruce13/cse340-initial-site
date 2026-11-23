
import bcrypt from "bcryptjs";
import {
  getUserByEmail,
  registerUser,
} from "../models/users.js";

// Display login page
export function buildLogin(req, res) {
  res.render("login", {
    title: "Login",
    errors: [],
  });
}

// Display registration page
export function buildRegister(req, res) {
  res.render("register", {
    title: "Register",
    errors: [],
    user_name: "",
    user_email: "",
  });
}

// Register a new user
export async function registerAccount(req, res, next) {
  const name = (req.body.user_name || "").trim();
  const email = (req.body.user_email || "").trim().toLowerCase();
  const password = req.body.user_password || "";
  const errors = [];

  if (!name) errors.push("Name is required.");
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("Enter a valid email address.");
  }
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters.");
  }

  if (errors.length) {
    return res.status(400).render("register", {
      title: "Register",
      errors,
      user_name: name,
      user_email: email,
    });
  }

  try {
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res.status(400).render("register", {
        title: "Register",
        errors: ["That email address is already registered."],
        user_name: name,
        user_email: email,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await registerUser(name, email, hashedPassword);

    req.flash("success", "Registration successful. Please log in.");
    res.redirect("/account/login");
  } catch (error) {
    next(error);
  }
}

// Log in
export async function loginAccount(req, res, next) {
  const email = (req.body.user_email || "").trim().toLowerCase();
  const password = req.body.user_password || "";

  try {
    const user = await getUserByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.user_password))) {
      req.flash("error", "Invalid email or password.");
      return res.redirect("/account/login");
    }

    req.session.regenerate((error) => {
      if (error) return next(error);

      req.session.user = {
        user_id: user.user_id,
        user_name: user.user_name,
        user_email: user.user_email,
        user_role: user.user_role,
      };

      req.flash("success", `Welcome, ${user.user_name}!`);
      req.session.save((saveError) => {
        if (saveError) return next(saveError);
        res.redirect("/account");
      });
    });
  } catch (error) {
    next(error);
  }
}

// Log out
export function logoutAccount(req, res, next) {
  req.session.destroy((error) => {
    if (error) return next(error);
    res.clearCookie("connect.sid");
    res.redirect("/");
  });
}
