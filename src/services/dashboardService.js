const FinanceRecord = require("../models/FinanceRecord");

const getSummary = async () => {
  const result = await FinanceRecord.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: "$type",
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
  ]);

  const summary = { totalIncome: 0, totalExpense: 0, netBalance: 0, incomeCount: 0, expenseCount: 0 };

  for (const row of result) {
    if (row._id === "income") {
      summary.totalIncome = row.total;
      summary.incomeCount = row.count;
    } else if (row._id === "expense") {
      summary.totalExpense = row.total;
      summary.expenseCount = row.count;
    }
  }

  summary.netBalance = summary.totalIncome - summary.totalExpense;
  return summary;
};

const getCategoryBreakdown = async () => {
  return FinanceRecord.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: { category: "$category", type: "$type" },
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
    { $sort: { total: -1 } },
    {
      $group: {
        _id: "$_id.category",
        breakdown: {
          $push: { type: "$_id.type", total: "$total", count: "$count" },
        },
        totalAmount: { $sum: "$total" },
      },
    },
    { $sort: { totalAmount: -1 } },
  ]);
};

const getMonthlyTrends = async (year) => {
  const matchStage = { isDeleted: false };
  if (year) {
    matchStage.date = {
      $gte: new Date(`${year}-01-01`),
      $lte: new Date(`${year}-12-31`),
    };
  }

  return FinanceRecord.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: {
          year: { $year: "$date" },
          month: { $month: "$date" },
          type: "$type",
        },
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
    {
      $group: {
        _id: { year: "$_id.year", month: "$_id.month" },
        entries: {
          $push: { type: "$_id.type", total: "$total", count: "$count" },
        },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);
};

module.exports = { getSummary, getCategoryBreakdown, getMonthlyTrends };
