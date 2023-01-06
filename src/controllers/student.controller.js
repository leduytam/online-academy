import User from '../models/user.model.js';

const getHomeView = async (req, res, next) => {
  res.render('students/home', {
    title: 'Home page',
  });
};

const getLessonView = async (req, res, next) => {
  res.render('students/lesson', {
    title: 'Lesson',
    layout: false,
  });
};

const getProfile = async (req, res, next) => {
  const { user } = req.session;
  const userDisplay = await User.findById(user._id).lean();
  res.render('students/profile', {
    title: 'Profile',
    user: userDisplay,
  });
};

export default {
  getHomeView,
  getLessonView,
  getProfile,
};
