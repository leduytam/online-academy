import User from '../models/user.model.js';

import courseService from '../services/course.service.js';
import gcsService from '../services/gcs.service.js';

const getHomeView = async (req, res, next) => {
  res.render('students/home', {
    title: 'Home page',
  });
};

const getCourseLessonView = async (req, res, next) => {
  const { courseSlug, lessonSlug } = req.params;
  const { user } = req.session;

  const course = await courseService.getCourseDetail(courseSlug);

  if (!course) {
    res.redirect('/404');
    return;
  }

  if (!(await courseService.isEnrolled(course._id, user._id))) {
    res.redirect('/403');
    return;
  }

  const activeSection = course.sections.find((section) => {
    return section.lessons.some((ls) => ls.slug === lessonSlug);
  });

  // TODO: get first valid lesson
  if (!activeSection) {
    res.redirect(
      `/courses/${courseSlug}/lessons/${course.sections[0].lessons[0].slug}`
    );

    return;
  }

  const activeLesson = activeSection.lessons.find(
    (ls) => ls.slug === lessonSlug
  );

  res.locals.activeSection = activeSection;
  res.locals.activeLesson = activeLesson;
  res.locals.course = course;
  res.locals.video = await gcsService.getVideoSignedUrl(
    activeLesson.video.filename
  );

  res.render('students/lesson', {
    title: course.name,
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
  getProfile,
  getCourseLessonView,
};
