import express from "express";
import { body } from "express-validator";

import {
  buildLogin,
  buildRegister,
  registerAccount,
  loginAccount,
  logoutAccount,
} from "../controllers/account.js";

import { requireLogin } from "../middleware/auth.js";

const router = express.Router();

// Registration validation
const registrationValidation = [
  body("user_name")
    .trim()
    .notEmpty()
    .withMessage("Name is required.")
    .isLength({ min: 3, max: 100 })
    .withMessage("Name must be between 3 and 100 characters."),

  body("user_email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Enter a valid email address.")
    .normalizeEmail(),

  body("user_password")
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters."),
];

// Login validation
const loginValidation = [
  body("user_email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Enter a valid email address.")
    .normalizeEmail(),

  body("user_password")
    .notEmpty()
    .withMessage("Password is required."),
];

// Registration
router.get("/register", buildRegister);
router.post("/register", registrationValidation, registerAccount);

// Login
router.get("/login", buildLogin);
router.post("/login", loginValidation, loginAccount);

// Dashboard
router.get("/", requireLogin, (req, res) => {
  res.render("account", {
    title: "Dashboard",
    user: req.session.user,
  });
});

// Logout
router.get("/logout", requireLogin, logoutAccount);

export default router;