import User from '../models/user.model.js';
import logger from '../utils/logger.js';

const getUsersView = async (req, res, next) => {
  const users = await User.find({}).lean();
  res.render('admin/users-list', {
    title: 'Manage users',
    users,
  });
};

const getCoursesView = async (req, res, next) => {
  res.render('admin/managementCourses', {
    title: 'Manage courses',
  });
};

const createUserView = async (req, res, next) => {
  res.render('admin/create-user', {
    title: 'Create user',
  });
};

const getUsersList = async (req, res, next) => {
  try {
    let { limit, page } = req.query;
    limit = Number(limit);
    page = Number(page);
    const skip = (page - 1) * limit;
    const users = await User.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);
    const numberOrder = await User.countDocuments({});
    const totalPages = Math.ceil(numberOrder / limit) ?? 1;
    const currentPage = Number(page);
    res.send({
      status: true,
      code: 200,
      currentPage,
      totalPages,
      data: users,
      sum: 0,
    });
  } catch (e) {
    res.send({ status: false, message: e.message });
  }
};

const createUser = async (req, res, next) => {
  try {
    const { email, name, role } = req.body;
    if (await User.isEmailTaken(email)) {
      req.flash('error_msg', 'Email is already taken');
      res.redirect('/admin/users-list');
      return;
    }
    const user = await User.create({
      email,
      name,
      password: 'Qwerty@123',
      role,
    });
    await user.save();
    req.flash('success_msg', `Created user ${user.name} successfully`);
    res.redirect('/admin/users-list');
  } catch (e) {
    logger.error(e);
    req.flash('error_msg', e.message);
    res.send({ status: false, message: e.message });
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      res.send({ status: false, message: 'User not found' });
      return;
    }
    user.isDeleted = !user.isDeleted;
    await user.save();
    req.flash('success_msg', `Deleted user ${user.name} successfully`);
    res.redirect('/admin/users-list');
  } catch (e) {
    logger.error(e);
    req.flash('error_msg', e.message);
    res.send({ status: false, message: e.message });
  }
};

export default {
  getUsersView,
  getCoursesView,
  createUserView,
  getUsersList,
  createUser,
  deleteUser,
};
