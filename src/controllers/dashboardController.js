const dashboardService = require("../services/dashboardService");

const summary = async (req, res, next) => {
  try {
    const data = await dashboardService.getSummary();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const categoryBreakdown = async (req, res, next) => {
  try {
    const data = await dashboardService.getCategoryBreakdown();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const trends = async (req, res, next) => {
  try {
    const { year } = req.query;
    const data = await dashboardService.getMonthlyTrends(year);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

module.exports = { summary, categoryBreakdown, trends };
