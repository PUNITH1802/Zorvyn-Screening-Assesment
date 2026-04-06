const financeService = require("../services/financeService");

const create = async (req, res, next) => {
  try {
    const record = await financeService.createRecord(req.body, req.user._id);
    res.status(201).json({ success: true, message: "Record created.", data: record });
  } catch (err) {
    next(err);
  }
};

const getAll = async (req, res, next) => {
  try {
    const result = await financeService.getRecords(req.query);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

const getOne = async (req, res, next) => {
  try {
    const record = await financeService.getRecordById(req.params.id);
    res.json({ success: true, data: record });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const record = await financeService.updateRecord(req.params.id, req.body);
    res.json({ success: true, message: "Record updated.", data: record });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await financeService.deleteRecord(req.params.id);
    res.json({ success: true, message: "Record deleted (soft)." });
  } catch (err) {
    next(err);
  }
};

module.exports = { create, getAll, getOne, update, remove };
