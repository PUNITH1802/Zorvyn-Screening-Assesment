const router = require("express").Router();
const { body } = require("express-validator");
const { protect, authorize } = require("../middleware/auth");
const validate = require("../middleware/validate");
const ctrl = require("../controllers/financeController");

const recordValidation = [
  body("amount").isFloat({ gt: 0 }).withMessage("Amount must be a positive number"),
  body("type").isIn(["income", "expense"]).withMessage("Type must be income or expense"),
  body("category").trim().notEmpty().withMessage("Category is required"),
  body("date").optional().isISO8601().withMessage("Date must be a valid ISO 8601 date"),
  body("notes").optional().trim().isLength({ max: 500 }).withMessage("Notes max 500 characters"),
];

// Viewer, Analyst, Admin → view
router.get("/", protect, authorize("viewer", "analyst", "admin"), ctrl.getAll);
router.get("/:id", protect, authorize("viewer", "analyst", "admin"), ctrl.getOne);

// Admin only → create / update / delete
router.post("/", protect, authorize("admin"), recordValidation, validate, ctrl.create);
router.put("/:id", protect, authorize("admin"), recordValidation, validate, ctrl.update);
router.delete("/:id", protect, authorize("admin"), ctrl.remove);

module.exports = router;
