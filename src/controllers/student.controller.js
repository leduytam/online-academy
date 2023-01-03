import path from 'path';
import uniqueSlug from 'unique-slug';

import EMedia from '../constant/media.js';
import Media from '../models/media.model.js';
import User from '../models/user.model.js';
import gcsService from '../services/gcs.service.js';
import logger from '../utils/logger.js';

import User from '../models/user.model.js';
import Course from '../models/course.model.js';
import Enrollment from '../models/enrollment.model.js';

const getHomeView = async (req, res, next) => {
  res.render('students/home', {
    title: 'Home page',
  });
};

const getProfileView = async (req, res, next) => {
  const { user } = req.session;
  const userDisplay = await User.findById(user._id ?? '')
    .populate('avatar')
    .lean();

  res.render('students/profile', {
    title: 'Profile',
    user: userDisplay,
  });
};

const updateInformation = async (req, res, next) => {
  try {
    const { user } = req.session;
    const userUpdate = await User.findById(user._id ?? '');
    const { name, facebook, website, twitter, linkedin, bio, youtube } =
      req.body;

    userUpdate.name = name;
    userUpdate.facebookLink = facebook;
    userUpdate.websiteLink = website;
    userUpdate.twitterLink = twitter;
    userUpdate.linkedinLink = linkedin;
    userUpdate.bio = bio;
    userUpdate.youtubeLink = youtube;

    await userUpdate.save();
    req.session.user = userUpdate;
    req.session.save((err) => {
      res.redirect('/profile');
    });
  } catch (e) {
    logger.error(e);
  }
};

const uploadProfileImage = async (req, res, next) => {
  const { file } = req;
  const { user } = req.session;
  const userUpdate = await User.findById(user._id ?? '');

  if (!file) {
    req.session.error = 'Please upload an image';
    req.session.save((err) => {
      res.redirect('/profile');
    });
    return;
  }

  const extname = path.extname(file.originalname);

  const filename = `${uniqueSlug()}${Date.now()}${extname}`;

  try {
    const media = await Media.create({
      type: EMedia.Image,
      filename,
    });
    userUpdate.avatar = media._id;
    await userUpdate.save();
    req.session.user = userUpdate;
    await gcsService.uploadImage(file, filename);
  } catch (error) {
    req.session.error = error.message;
  }

  req.session.save((err) => {
    res.redirect('/profile');
  });
};

const getMyCoursesView = async (req, res, next) => {
  const { _id } = req.session.user;
  const enrollments = await Enrollment
    .find({
      student: _id,
    })
    .lean();
  const coursesId = enrollments.map((enrollment) => enrollment.course);
  const courses = await Course
    .find({
      _id: {
        $in: coursesId,
      },
    })
    .populate('instructor')
    .lean();
  res.render('students/myCourses', {
    title: 'My courses',
    courses,
  });
};

const getWishlistView = async (req, res, next) => {
  const { _id } = req.session.user
};

export default {
  getHomeView,
  getProfileView,
  updateInformation,
  uploadProfileImage,
  uploadImage,
  getLessonView,
  getMyCoursesView,
  getWishlistView,
};
