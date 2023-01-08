import Category from '../models/category.model.js';
import Course from '../models/course.model.js';
import SubCategory from '../models/subcategory.model.js';
import User from '../models/user.model.js';
import logger from '../utils/logger.js';

// View
const getUsersView = async (req, res, next) => {
  const users = await User.find({}).lean();
  res.render('admin/users/users-list', {
    title: 'Manage users',
    users,
  });
};

const getCoursesView = async (req, res, next) => {
  const courses = await Course.find({}).lean();
  res.render('admin/courses/courses-list', {
    title: 'Manage courses',
    courses,
  });
};

const getCreateUserView = async (req, res, next) => {
  res.render('admin/users/create-user', {
    title: 'Create user',
  });
};

const getEditUserView = async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id).lean();
  res.render(`admin/users/edit-user`, {
    title: 'Edit user',
    user,
  });
};

const getDashboardView = async (req, res, next) => {
  res.render('admin/dashboard', {
    title: 'Admin dashboard',
  });
};

// Action
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
      if (req.flash) {
        req.flash('error_msg', 'Email is already taken');
      }
      res.redirect('/admin/users');
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
    res.redirect('/admin/users');
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
    res.redirect('/admin/users');
  } catch (e) {
    logger.error(e);
    req.flash('error_msg', e.message);
    res.send({ status: false, message: e.message });
  }
};

const editUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, role, email } = req.body;
    const user = await User.findById(id);
    if (!user) {
      req.flash('error_msg', 'User not found');
      res.redirect('/admin/users');
      return;
    }
    if (user.isDeleted) {
      req.flash('error_msg', 'User is deleted');
      res.redirect('/admin/users');
      return;
    }
    if (user.email !== email) {
      if (await User.isEmailTaken(email)) {
        req.flash('error_msg', 'Email is already taken');
        res.redirect('/admin/users');
        return;
      }
      user.email = email;
    }
    user.name = name;
    user.role = role;
    await user.save();
    req.flash('success_msg', `Edited user ${user.name} successfully`);
    res.redirect('/admin/users');
  } catch (e) {
    logger.error(e);
    req.flash('error_msg', e.message);
    res.send({ status: false, message: e.message });
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      req.flash('error_msg', 'User not found');
      res.redirect('/admin/users');
      return;
    }
    const courses = await Course.find({ instructor: user._id });

    const resultData = {
      ...user.toObject(),
      courses: courses.map((course) => course.toObject()),
    };
    res.send({
      status: true,
      data: resultData,
    });
  } catch (e) {
    logger.error(e);
    req.flash('error_msg', e.message);
    res.send({ status: false, message: e.message });
  }
};

const getCourseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) {
      req.flash('error_msg', 'Course not found');
      res.redirect('/admin/courses');
      return;
    }
    const instructor = await User.findById(course.instructor);
    const subCategory = await SubCategory.findById(course.category);

    const resultData = {
      ...course.toObject(),
      instructor: instructor.toObject(),
      subCategory: subCategory?.toObject(),
    };
    res.send({ status: true, data: resultData });
  } catch (e) {
    logger.error(e);
    req.flash('error_msg', e.message);
    res.send({ status: false, message: e.message });
  }
};

const getCoursesOfUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      req.flash('error_msg', 'User not found');
      res.redirect('/admin/users');
      return;
    }
    const courses = await Course.find({ instructor: user._id });
    res.send({ status: true, data: courses });
  } catch (e) {
    logger.error(e);
    req.flash('error_msg', e.message);
    res.send({ status: false, message: e.message });
  }
};

const deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) {
      res.send({ status: false, message: 'Course not found' });
      return;
    }
    course.isDeleted = !course.isDeleted;
    await course.save();
    req.flash('success_msg', `Deleted course ${course.name} successfully`);
    res.redirect('/admin/courses');
  } catch (e) {
    logger.error(e);
    req.flash('error_msg', e.message);
    res.send({ status: false, message: e.message });
  }
};

const getCategoriesView = async (req, res, next) => {
  try {
    const categories = await Category.find().populate('subcategories').lean();
    const courses = await Course.find().lean();
    categories.forEach((category) => {
      category.subcategories.forEach((subcategory) => {
        subcategory.countCourses = courses.filter(
          (course) => course.category.toString() === subcategory._id.toString()
        ).length;
      });
    });

    res.render('admin/categories/categories-list', {
      title: 'Categories',
      categories,
    });
  } catch (e) {
    logger.error(e);
    req.flash('error_msg', e.message);
    res.redirect('/admin');
  }
};

const getAddCategoryView = async (req, res, next) => {
  res.render('admin/categories/add-category', {
    title: 'Add Category',
  });
};

const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const category = new Category({ name });
    await category.save();
    res.redirect('/admin/categories');
  } catch (e) {
    logger.error(e);
    res.redirect('/admin/categories');
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const category = await Category.findById(id);
    if (!category) {
      res.flash('error_msg', 'Category not found');
      return;
    }
    category.name = name;
    await category.save();
    res.status(200).send({ status: true });
  } catch (e) {
    logger.error(e);
    res.status(500).send({ status: false, message: e.message });
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
      res.flash('error_msg', 'Category not found');
      return;
    }
    if (category.subcategories.length > 0) {
      res.status(200).send({
        status: false,
        message: 'Please delete all subcategories in this category first',
      });
      return;
    }
    await category.remove();
    res.status(200).send({ status: true });
  } catch (e) {
    logger.error(e);
    res.status(500).send({ status: false, message: e.message });
  }
};

export default {
  getUsersView,
  getCoursesView,
  getDashboardView,
  getCreateUserView,
  getEditUserView,
  getUsersList,
  createUser,
  deleteUser,
  editUser,
  getUserById,
  getCourseById,
  getCoursesOfUser,
  deleteCourse,
  getCategoriesView,
  getAddCategoryView,
  createCategory,
  updateCategory,
  deleteCategory,
};
