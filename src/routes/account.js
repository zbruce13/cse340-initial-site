
import express from "express";
import {
  buildLogin,
  buildRegister,
  registerAccount,
  loginAccount,
  logoutAccount,
} from "../controllers/account.js";
import { requireLogin } from "../middleware/auth.js";

const router = express.Router();

// Registration
router.get("/register", buildRegister);
router.post("/register", registerAccount);

// Login
router.get("/login", buildLogin);
router.post("/login", loginAccount);

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
