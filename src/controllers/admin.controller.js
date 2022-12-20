import User from '../models/user.model.js';

const get = async (req, res, next) => {
  res.render('admin/dashboard', {
    title: 'Admin page',
  });
};

const getUsers = async (req, res, next) => {
  // find all user without password
  const users = await User.find({}, '-password').lean();
  res.render('admin/managementUsers', {
    title: 'Manage users',
    users,
  });
};

const getCourses = async (req, res, next) => {
  res.render('admin/managementCourses', {
    title: 'Manage courses',
  });
};

export default {
  get,
  getUsers,
  getCourses,
};
