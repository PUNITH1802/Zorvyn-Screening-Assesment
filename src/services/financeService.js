const FinanceRecord = require("../models/FinanceRecord");

const createRecord = async (data, userId) => {
  return FinanceRecord.create({ ...data, createdBy: userId });
};

const getRecords = async ({ type, category, startDate, endDate, page = 1, limit = 20, search } = {}) => {
  const query = {};

  if (type) query.type = type;
  if (category) query.category = new RegExp(category, "i");
  if (search) query.notes = new RegExp(search, "i");

  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }

  const skip = (page - 1) * limit;
  const [records, total] = await Promise.all([
    FinanceRecord.find(query)
      .populate("createdBy", "name email")
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit),
    FinanceRecord.countDocuments(query),
  ]);

  return { records, total, page, pages: Math.ceil(total / limit) };
};

const getRecordById = async (id) => {
  const record = await FinanceRecord.findById(id).populate("createdBy", "name email");
  if (!record) {
    const err = new Error("Finance record not found.");
    err.statusCode = 404;
    throw err;
  }
  return record;
};

const updateRecord = async (id, data) => {
  const record = await FinanceRecord.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!record) {
    const err = new Error("Finance record not found.");
    err.statusCode = 404;
    throw err;
  }
  return record;
};

const deleteRecord = async (id) => {
  // Soft delete
  const record = await FinanceRecord.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  if (!record) {
    const err = new Error("Finance record not found.");
    err.statusCode = 404;
    throw err;
  }
  return record;
};

module.exports = { createRecord, getRecords, getRecordById, updateRecord, deleteRecord };
