const router = require("express").Router();
const { body } = require("express-validator");
const { protect, authorize } = require("../middleware/auth");
const validate = require("../middleware/validate");
const ctrl = require("../controllers/userController");

// ── Public ────────────────────────────────────────────────────────────────
router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("role").optional().isIn(["viewer", "analyst", "admin"]).withMessage("Invalid role"),
  ],
  validate,
  ctrl.register
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validate,
  ctrl.login
);

// ── Protected ─────────────────────────────────────────────────────────────
router.get("/profile", protect, ctrl.getProfile);

// ── Admin only ────────────────────────────────────────────────────────────
router.get("/", protect, authorize("admin"), ctrl.listUsers);

router.patch(
  "/:id/role",
  protect,
  authorize("admin"),
  [body("role").isIn(["viewer", "analyst", "admin"]).withMessage("Invalid role")],
  validate,
  ctrl.assignRole
);

router.patch(
  "/:id/status",
  protect,
  authorize("admin"),
  [body("status").isIn(["active", "inactive"]).withMessage("Invalid status")],
  validate,
  ctrl.setStatus
);

module.exports = router;
