import path from 'path';
import uniqueSlug from 'unique-slug';

import EMedia from '../constant/media.js';
import Media from '../models/media.model.js';
import User from '../models/user.model.js';
import logger from '../utils/logger.js';

import Course from '../models/course.model.js';
import Enrollment from '../models/enrollment.model.js';
import gcsService from '../services/gcs.service.js';
import courseService from '../services/course.service.js';
import WishList from '../models/wishList.model.js';
import '../models/media.model.js';


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
  let courses = await Course
    .find({
      _id: {
        $in: coursesId,
      },
    })
    .populate('instructor')
    .populate('coverPhoto')
    .lean();
  courses = await Promise.all(courses.map(async (course) => {
    const { avg, total } = await courseService.getReviewStats(course._id);
    const media = await Media.findById(course.coverPhoto);
    const enrollment = await Enrollment.findOne({
      student: _id,
      course: course._id,
    });
    return {
      ...course,
      coverPhoto: gcsService.getPublicImageUrl(media.filename),
      avgRating: avg,
      totalRatings: total,
      isWishListed: true,
      price: course.price,
      isDone: enrollment.done,
    }
  }));
  res.render('students/myCourses', {
    title: 'My Courses',
    courses,
  });
};

const getWishlistView = async (req, res, next) => {
  const { _id } = req.session.user
  let wishList = await WishList
    .find({
      student: _id,
    })
    .populate('course')
    .lean();
  wishList = await Promise.all(wishList.map(async (list) => {
    const { avg, total } = await courseService.getReviewStats(list.course._id);
    const instructor = await User.findById(list.course.instructor);
    const media = await Media.findById(list.course.coverPhoto);
    return {
      coverPhoto: gcsService.getPublicImageUrl(media.filename),
      avgRating: avg,
      totalRatings: total,
      isWishListed: true,
      _id: list.course._id,
      slug: list.course.slug,
      name: list.course.name,
      price: list.course.price,
      instructorName: instructor.name,
    }
  }));
  res.render('students/wishlist', {
    title: 'Wish List',
    courses: wishList,
  });
};

const toggleWishList = async (req, res, next) => {
  try {
    const { courseId } = req.body;
    const { _id } = req.session.user;
    if (!_id) {
      res.send({
        status: false,
        code: 401,
        message: 'Please login',
      });
      return;
    }
    const wishList = await WishList.findOne({
      student: _id,
      course: courseId,
    });
    if (wishList) {
      await WishList.findOneAndDelete({
        student: _id,
        course: courseId,
      });
    }
    else {
      await WishList.create({
        student: _id,
        course: courseId,
      });
    }
    res.send({
      status: true,
      code: 200,
      isWishListed: wishList ? false : true,
    });
  } catch (error) {
    res.send({
      status: false,
      code: 500,
      message: error.message,
    });
  }
};

export default {
  getProfileView,
  updateInformation,
  uploadProfileImage,
  getMyCoursesView,
  getWishlistView,
  toggleWishList,
};
