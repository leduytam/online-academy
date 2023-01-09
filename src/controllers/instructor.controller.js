import path from 'path';
import uniqueSlug from 'unique-slug';

import EMedia from '../constant/media.js';
import Course from '../models/course.model.js';
import Lesson from '../models/lesson.model.js';
import Media from '../models/media.model.js';
import Section from '../models/section.model.js';
import Subcategory from '../models/subcategory.model.js';
import User from '../models/user.model.js';
import categoryService from '../services/category.service.js';
import courseService from '../services/course.service.js';
import gcsService from '../services/gcs.service.js';
import logger from '../utils/logger.js';

const get = async (req, res, next) => {
  res.render('instructor/dashboard', {
    title: 'Courses',
  });
};

const getInfo = async (req, res, next) => {
  const { user } = req.session;
  const userDisplay = await User.findById(user._id ?? '')
    .populate('avatar')
    .lean();
  const courses = await courseService.getAllByInstructor(user._id ?? '');
  res.render('instructor/profile', {
    title: 'Profile',
    user: userDisplay,
    courses,
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

  res.locals.categories = await categoryService.getAll();

  const course = await Course.findOne({ slug: courseSlug })
    .populate('coverPhoto')
    .populate('category')
    .populate('instructor')
    .populate({
      path: 'sections',
      populate: {
        path: 'lessons',
      },
    })
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
  res.render('instructor/course-detail', {
    title: 'Course',
    course,
    categories: res.locals.categories,
  });
};

const createCourse = async (req, res, next) => {
  try {
    const { file } = req;
    const { user } = req.session;
    if (!file) {
      req.session.error = 'Please upload an image';
      req.session.save((err) => {
        res.redirect('/instructor');
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
    res.redirect(`/instructor/courses/${courseSlug}`);
  } catch (e) {
    logger.error(e);
    req.session.error = 'Something went wrong';
    res.redirect(`/instructor/courses/${courseSlug}`);
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

const createSectionView = async (req, res, next) => {
  const { courseSlug } = req.params;

  res.render('instructor/create-section', {
    title: 'Create section',
    courseSlug,
  });
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
    res.redirect(`/instructor/courses/${courseSlug}`);
  } catch (e) {
    logger.error(e);
    req.session.error = 'Something went wrong';
    res.redirect(`/instructor/courses/${courseSlug}`);
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
    res.render('instructor/section-detail', {
      title: 'Section',
      course,
      section,
      courseSlug,
      sectionId,
    });
  } catch (e) {
    logger.error(e);
    req.session.error = 'Something went wrong';
    res.redirect('/instructor');
  }
};

const updateSection = async (req, res, next) => {
  const { user } = req.session;
  const { courseSlug, sectionId } = req.params;
  const { name } = req.body;
  try {
    const course = await Course.findOne({ slug: courseSlug });
    if (course.instructor.toString() !== user._id.toString()) {
      req.session.error = 'You are not authorized to update this section';
      res.redirect('/instructor');
      return;
    }
    const section = await Section.findById(sectionId);
    section.name = name;
    await section.save();
    res.redirect(`/instructor`);
  } catch (e) {
    logger.error(e);
    req.session.error = 'Something went wrong';
    res.redirect('/instructor');
  }
};

const deleteSection = async (req, res, next) => {
  const { user } = req.session;
  const { courseSlug, sectionId } = req.params;
  try {
    const course = await Course.findOne({ slug: courseSlug });
    if (course.instructor.toString() !== user._id.toString()) {
      req.session.error = 'You are not authorized to delete this section';
      res.redirect('/instructor');
      return;
    }
    const section = await Section.findById(sectionId);
    course.sections = course.sections.filter(
      (s) => s.toString() !== section._id.toString()
    );
    await course.save();
    res.redirect(`/instructor/`);
  } catch (e) {
    logger.error(e);
    req.session.error = 'Something went wrong';
    res.redirect('/instructor');
  }
};

//  lesson

const createLessonView = async (req, res, next) => {
  const { courseSlug, sectionId, lessonSlug } = req.params;

  res.render('instructor/create-lesson', {
    title: 'Create lesson',
    courseSlug,
    sectionId,
    lessonSlug,
  });
};

const createLesson = async (req, res, next) => {
  try {
    const { courseSlug, sectionId } = req.params;
    const { name, preview } = req.body;

    const isPreview = preview == 'on' ? true : false;

    const { file } = req;
    if (!file) {
      req.session.error = 'Please upload a video';
      req.session.save((err) => {
        res.redirect(`/instructor/${courseSlug}/${sectionId}`);
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
      preview: isPreview,
      slug: uniqueSlug(),
    });

    const section = await Section.findById(sectionId);
    section.lessons.push(lesson._id);
    await section.save();
    res.redirect(`/instructor/courses/${courseSlug}/${sectionId}`);
  } catch (e) {
    logger.error(e);
    req.session.error = 'Something went wrong';
    res.redirect(`/instructor/courses/${courseSlug}/${sectionId}`);
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
    const lesson = await Lesson.findOne({ slug: lessonSlug })
      .populate({
        path: 'video',
      })
      .lean();

    const videoUrl = lesson?.video?.filename
      ? await gcsService.getVideoSignedUrl(lesson.video.filename)
      : null;

    res.render('instructor/lesson-detail', {
      title: 'Lesson',
      course,
      section,
      lesson,
      videoUrl,
    });
  } catch (e) {
    logger.error(e);
    req.session.error = 'Something went wrong';
    res.redirect('/instructor');
  }
};

const updateLesson = async (req, res, next) => {
  const { user } = req.session;
  const { courseSlug, lessonSlug, sectionId } = req.params;
  const { name, preview } = req.body;
  const { file } = req;
  try {
    const course = await Course.findOne({ slug: courseSlug });
    if (course.instructor.toString() !== user._id.toString()) {
      req.session.error = 'You are not authorized to update this lesson';
      res.redirect('/instructor');
      return;
    }
    const lesson = await Lesson.findOne({ slug: lessonSlug });
    lesson.name = name;
    lesson.preview = preview;
    if (file) {
      const extname = path.extname(file.originalname);
      const filename = `${uniqueSlug()}${Date.now()}${extname}`;
      await gcsService.uploadVideo(file, filename);
      const media = await Media.create({
        filename,
        type: 'video',
      });
      lesson.video = media._id;
    }
    await lesson.save();
    res.redirect(`/instructor/courses/${courseSlug}/${sectionId}`);
  } catch (e) {
    logger.error(e);
    req.session.error = 'Something went wrong';
    res.redirect('/instructor/courses/${courseSlug}/${sectionId}');
  }
};

const deleteLesson = async (req, res, next) => {
  const { user } = req.session;
  const { courseSlug, sectionId, lessonSlug } = req.params;
  try {
    const course = await Course.findOne({ slug: courseSlug });
    if (course.instructor.toString() !== user._id.toString()) {
      req.session.error = 'You are not authorized to delete this lesson';
      res.redirect('/instructor');
      return;
    }
    const lesson = await Lesson.findOne({ slug: lessonSlug });
    const section = await Section.findById(sectionId);
    section.lessons = section.lessons.filter(
      (l) => l.toString() !== lesson._id.toString()
    );
    await section.save();
    await lesson.remove();
    res.redirect(`/instructor/`);
  } catch (e) {
    logger.error(e);
    req.session.error = 'Something went wrong';
    res.redirect('/instructor');
  }
};

const getCreateCourseView = async (req, res, next) => {
  res.locals.categories = await categoryService.getAll();
  res.render('instructor/create-course', {
    title: 'Create course',
    categories: res.locals.categories,
  });
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
  updateSection,
  deleteSection,
  updateLesson,
  deleteLesson,
  getCreateCourseView,
  createSectionView,
  createLessonView,
};
