
export function requireLogin(req, res, next) {
  if (!req.session.user) {
    req.flash("error", "Please log in to access that page.");
    return res.redirect("/account/login");
  }

  next();
}

export function requireRole(role) {
  return (req, res, next) => {
    if (!req.session.user) {
      req.flash("error", "Please log in first.");
      return res.redirect("/account/login");
    }

    if (req.session.user.user_role !== role) {
      req.flash("error", "You are not authorized to access that page.");
      return res.redirect("/account");
    }

    next();
  };
}
