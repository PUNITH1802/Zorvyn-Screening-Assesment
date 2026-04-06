const userService = require("../services/userService");

const register = async (req, res, next) => {
  try {
    const { user, token } = await userService.registerUser(req.body);
    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      data: { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } },
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { user, token } = await userService.loginUser(req.body);
    res.json({
      success: true,
      message: "Login successful.",
      data: { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } },
    });
  } catch (err) {
    next(err);
  }
};

const getProfile = (req, res) => {
  res.json({ success: true, data: req.user });
};

const listUsers = async (req, res, next) => {
  try {
    const result = await userService.getAllUsers(req.query);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

const assignRole = async (req, res, next) => {
  try {
    const user = await userService.updateUserRole(req.params.id, req.body.role);
    res.json({ success: true, message: "Role updated.", data: user });
  } catch (err) {
    next(err);
  }
};

const setStatus = async (req, res, next) => {
  try {
    const user = await userService.setUserStatus(req.params.id, req.body.status);
    res.json({ success: true, message: `User ${user.status}.`, data: user });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, getProfile, listUsers, assignRole, setStatus };
