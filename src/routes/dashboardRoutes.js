const router = require("express").Router();
const { protect, authorize } = require("../middleware/auth");
const ctrl = require("../controllers/dashboardController");

// Analyst and Admin can access full dashboard
// Viewer can only access summary
router.get("/summary", protect, authorize("viewer", "analyst", "admin"), ctrl.summary);
router.get("/category", protect, authorize("analyst", "admin"), ctrl.categoryBreakdown);
router.get("/trends", protect, authorize("analyst", "admin"), ctrl.trends);

module.exports = router;
