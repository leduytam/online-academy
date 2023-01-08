import path from 'path';
import uniqueSlug from 'unique-slug';

import EMedia from '../constant/media.js';
import Course from '../models/course.model.js';
import Lesson from '../models/lesson.model.js';
import Media from '../models/media.model.js';
import Section from '../models/section.model.js';
import Subcategory from '../models/subcategory.model.js';
import User from '../models/user.model.js';
import gcsService from '../services/gcs.service.js';
import logger from '../utils/logger.js';

const get = async (req, res, next) => {
  res.render('instructor/courses', {
    title: 'Courses',
  });
};

const getInfo = async (req, res, next) => {
  const { user } = req.session;
  const userDisplay = await User.findById(user._id ?? '')
    .populate('avatar')
    .lean();
  res.render('instructor/profile', {
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
      res.redirect('/instructor/profile');
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
      res.redirect('/instructor/profile');
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
    res.redirect('/instructor/profile');
  });
};

// course
const getCoursesView = async (req, res, next) => {
  const { user } = req.session;
  const courses = await Course.find({ instructor: user._id })
    .populate('coverPhoto')
    .populate('category')
    .populate('instructor')
    .lean();
  res.render('instructor/courses', {
    title: 'Courses',
    courses,
  });
};

const getCourseView = async (req, res, next) => {
  const { courseSlug } = req.params;
  const { user } = req.session;

  // validate course instructor is the same as the logged in user
  const course = await Course.findOne({ slug: courseSlug })
    .populate('coverPhoto')
    .populate('category')
    .populate('instructor')
    .lean();

  if (!course) {
    res.redirect('/instructor');
    return;
  }
  if (course.instructor._id.toString() !== user._id.toString()) {
    req.session.error = 'You are not authorized to view this course';
    res.redirect('/instructor');
    return;
  }
  res.render('instructor/course', {
    title: 'Course',
    course,
  });
};

const createCourse = async (req, res, next) => {
  try {
    const { file } = req;
    const { user } = req.session;
    if (!file) {
      req.session.error = 'Please upload an image';
      req.session.save((err) => {
        res.redirect('/instructor/courses');
      });
      return;
    }
    if (!user) {
      req.session.error = 'Please login to create a course';
      res.redirect('/login');
      return;
    }
    const extname = path.extname(file.originalname);
    const filename = `${uniqueSlug()}${Date.now()}${extname}`;
    await gcsService.uploadImage(file, filename);
    const media = await Media.create({
      filename,
      type: 'image',
    });

    const { name, briefDescription, detailDescription, category, price } =
      req.body;
    const subcategory = await Subcategory.findById(category);

    await Course.create({
      name,
      briefDescription,
      detailDescription,
      category: subcategory._id,
      price,
      coverPhoto: media._id,
      instructor: user._id,
    });
    req.session.success = 'Course created successfully';
    res.redirect('/instructor');
  } catch (e) {
    logger.error(e);
    req.session.error = 'Something went wrong';
    res.redirect('/instructor');
  }
};

const updateCourse = async (req, res, next) => {
  try {
    const { courseSlug } = req.params;
    const { file } = req;
    const { user } = req.session;

    const { name, briefDescription, detailDescription, category, price } =
      req.body;

    const course = await Course.findOne({ slug: courseSlug });

    if (!course) {
      req.session.error = 'Course not found';
      res.redirect('/instructor');
      return;
    }

    if (course.instructor.toString() !== user._id.toString()) {
      req.session.error = 'You are not authorized to update this course';
      res.redirect('/instructor');
      return;
    }

    let media = null;

    if (file) {
      const extname = path.extname(file.originalname);
      const filename = `${uniqueSlug()}${Date.now()}${extname}`;
      await gcsService.uploadImage(file, filename);
      media = await Media.create({
        filename,
        type: 'image',
      });
    }

    if (media) {
      course.coverPhoto = media._id;
    }
    if (name) {
      course.name = name;
    }
    if (briefDescription) {
      course.briefDescription = briefDescription;
    }
    if (detailDescription) {
      course.detailDescription = detailDescription;
    }
    if (category) {
      const subcategory = await Subcategory.findById(category);
      course.category = subcategory._id;
    }
    if (price) {
      course.price = price;
    }

    await course.save();
    req.session.success = 'Course updated successfully';
    res.redirect('/instructor');
  } catch (e) {
    logger.error(e);
    req.session.error = 'Something went wrong';
    res.redirect('/instructor');
  }
};

const deleteCourse = async (req, res, next) => {
  const { courseSlug } = req.params;
  const { user } = req.session;
  try {
    const course = await Course.findOne({ slug: courseSlug });
    if (!course) {
      req.session.error = 'Course not found';
      res.redirect('/instructor');
      return;
    }

    if (course.instructor.toString() !== user._id.toString()) {
      req.session.error = 'You are not authorized to delete this course';
      res.redirect('/instructor');
      return;
    }

    await Course.findOneAnd({ slug: courseSlug }).deleteOne();
    req.session.success = 'Course deleted successfully';
    res.redirect('/instructor');
  } catch (e) {
    logger.error(e);
    req.session.error = 'Something went wrong';
    res.redirect('/instructor');
  }
};

// section
const getSectionsView = async (req, res, next) => {
  try {
    const { courseSlug } = req.params;
    const course = await Course.findOne({ slug: courseSlug })
      .populate('sections')
      .lean();
    res.render('instructor/sections', {
      title: 'Sections',
      course,
    });
  } catch (e) {
    logger.error(e);
    req.session.error = 'Something went wrong';
    res.redirect('/instructor');
  }
};

const createSection = async (req, res, next) => {
  const { name } = req.body;
  const { courseSlug } = req.params;
  try {
    const course = await Course.findOne({ slug: courseSlug });
    const section = await Section.create({
      name,
    });
    course.sections.push(section._id);
    await course.save();
    res.redirect(`/instructor/`);
  } catch (e) {
    logger.error(e);
    req.session.error = 'Something went wrong';
    res.redirect('/instructor');
  }
};

const getSectionView = async (req, res, next) => {
  const { courseSlug, sectionId } = req.params;
  try {
    const course = await Course.findOne({ slug: courseSlug })
      .populate('sections')
      .lean();
    const section = await Section.findById(sectionId)
      .populate('lessons')
      .lean();
    res.render('instructor/section', {
      title: 'Section',
      course,
      section,
    });
  } catch (e) {
    logger.error(e);
    req.session.error = 'Something went wrong';
    res.redirect('/instructor');
  }
};

//  lesson
const createLesson = async (req, res, next) => {
  try {
    const { sectionId } = req.params;
    const { name, preview } = req.body;
    const { file } = req;
    if (!file) {
      req.session.error = 'Please upload a video';
      req.session.save((err) => {
        res.redirect('/instructor/courses');
      });
      return;
    }
    const extname = path.extname(file.originalname);
    const filename = `${uniqueSlug()}${Date.now()}${extname}`;
    await gcsService.uploadVideo(file, filename);
    const media = await Media.create({
      filename,
      type: 'video',
    });
    const lesson = await Lesson.create({
      name,
      video: media._id,
      preview,
      slug: uniqueSlug(),
    });

    const section = await Section.findById(sectionId);
    section.lessons.push(lesson._id);
    await section.save();
    res.redirect(`/instructor/`);
  } catch (e) {
    logger.error(e);
    req.session.error = 'Something went wrong';
    res.redirect('/instructor');
  }
};

const getLessonView = async (req, res, next) => {
  const { courseSlug, sectionId, lessonSlug } = req.params;
  try {
    const course = await Course.findOne({ slug: courseSlug })
      .populate('sections')
      .lean();
    const section = await Section.findById(sectionId)
      .populate('lessons')
      .lean();
    const lesson = await Lesson.findOne({ slug: lessonSlug }).lean();
    res.render('instructor/lesson', {
      title: 'Lesson',
      course,
      section,
      lesson,
    });
  } catch (e) {
    logger.error(e);
    req.session.error = 'Something went wrong';
    res.redirect('/instructor');
  }
};

export default {
  get,
  getInfo,
  getCoursesView,
  updateInformation,
  uploadProfileImage,
  createCourse,
  createSection,
  createLesson,
  getCourseView,
  getSectionsView,
  getSectionView,
  getLessonView,
  deleteCourse,
  updateCourse,
};
