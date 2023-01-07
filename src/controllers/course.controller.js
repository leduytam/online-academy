import hbs from '../configs/hbs.js';
import Category from '../models/category.model.js';
import Course from '../models/course.model.js';
import Enrollment from '../models/enrollment.model.js';
import Lesson from '../models/lesson.model.js';
import Media from '../models/media.model.js';
import Review from '../models/review.model.js';
import Section from '../models/section.model.js';
import Subcategory from '../models/subcategory.model.js';
import courseService from '../services/course.service.js';
import gcsService from '../services/gcs.service.js';

const getCourseDetailView = async (req, res, next) => {
  const { slug } = req.params;
  const course = await Course.findOne({ slug });
  res.render('courses/course-detail', {
    title: course.name,
    data: course,
  });
};

const getCourseDetail = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const course = await Course.findOne({ slug })
      .populate('instructor')
      .populate('category');

    const subcategory = await Subcategory.findById(course.category);
    const category = await Category.findOne({ subcategories: subcategory._id });
    const reviews = await Review.find({ course: course._id }).populate('owner');
    const enrollments = await Enrollment.find({ course: course._id });
    const sections = await Promise.all(
      course.sections.map(async (sectionId) => {
        const section = await Section.findById(sectionId);
        const lessons = await Promise.all(
          section.lessons.map(async (sectionLesson) => {
            const lesson = await Lesson.findById(sectionLesson);
            return lesson;
          })
        );
        return {
          ...section.toObject(),
          lessons,
        };
      })
    );
    const media = course.coverPhoto
      ? await Media.findById(course.coverPhoto)
      : null;
    let thumbnail = null;
    if (media) {
      if (media.type === 'image') {
        thumbnail = {
          type: 'image',
          url: gcsService.getPublicImageUrl(media.filename),
        };
      }
      if (media.type === 'video') {
        thumbnail = {
          type: 'video',
          url: await gcsService.getVideoSignedUrl(media.filename),
        };
      }
    }

    const result = {
      ...course.toObject(),
      category,
      subcategory,
      reviews,
      enrollments,
      sections,
      thumbnail,
    };
    res.status(200).send(result);
  } catch (error) {
    res.status(500);
  }
};

const getRelatedCourses = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const course = await Course.findOne({ slug });
    const subcategory = await Subcategory.findById(course.category);
    const courses = await Course.find({ category: subcategory._id });
    const relatedCourses = await Promise.all(
      courses.map(async (c) => {
        const media = c.coverPhoto ? await Media.findById(c.coverPhoto) : null;
        let thumbnail = null;
        if (media) {
          if (media.type === 'image') {
            thumbnail = {
              type: 'image',
              url: gcsService.getPublicImageUrl(media.filename),
            };
          }
          if (media.type === 'video') {
            thumbnail = {
              type: 'video',
              url: await gcsService.getVideoSignedUrl(media.filename),
            };
          }
        }
        return {
          ...c.toObject(),
          thumbnail,
        };
      })
    );

    const data = relatedCourses
      .filter((c) => c.slug !== slug)
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);

    res.status(200).send(data);
  } catch (error) {
    res.status(500);
  }
};

const getLessonView = async (req, res, next) => {
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

  const completedLessons = await courseService.getCompletedLessons(
    course._id,
    user._id
  );

  let firstLesson = null;
  let activeSection = null;

  let count = 0;
  for (let i = 0; i < course.sections.length; i += 1) {
    let completedLessonsCount = 0;
    let totalDuration = 0;

    // eslint-disable-next-line no-loop-func
    course.sections[i].lessons = course.sections[i].lessons.map((ls) => {
      count += 1;
      const completed = completedLessons.some((cl) => cl.equals(ls._id));

      if (!firstLesson) {
        firstLesson = ls;
      }

      if (!activeSection && ls.slug === lessonSlug) {
        activeSection = course.sections[i];
      }

      if (completed) {
        completedLessonsCount += 1;
      }

      if (ls.video) {
        totalDuration += ls.video.duration;
      }

      return {
        ...ls,
        order: count,
        completed,
      };
    });

    course.sections[i].completedLessonsCount = completedLessonsCount;
    course.sections[i].totalDuration = totalDuration;
  }

  if (!activeSection) {
    res.redirect(
      firstLesson
        ? `/courses/${course.slug}/lessons/${firstLesson.slug}`
        : '/404'
    );
    return;
  }

  const activeLesson = activeSection.lessons.find(
    (ls) => ls.slug === lessonSlug
  );

  if (!activeLesson.completed) {
    await courseService.completeLesson(course._id, user._id, activeLesson._id);
    activeLesson.completed = true;
    activeSection.completedLessonsCount += 1;
    completedLessons.push(activeLesson._id);
  }

  if (count === completedLessons.length) {
    courseService.completeCourse(course._id, user._id);
  }

  const reviews = await courseService.getReviews(courseSlug);
  const reviewStats = await courseService.getReviewStats(course._id);
  const myReview = await courseService.getCourseReviewOfUser(
    course._id,
    user._id
  );
  const video = activeLesson.video
    ? await gcsService.getVideoSignedUrl(activeLesson.video.filename)
    : null;

  res.render('students/lesson', {
    title: course.name,
    layout: false,
    activeSection,
    activeLesson,
    course,
    video,
    reviews,
    reviewStats,
    myReview,
    progress: {
      total: count,
      completed: completedLessons.length,
      percentage: (completedLessons.length / count) * 100,
    },
  });
};

const getReviews = async (req, res, next) => {
  const { courseSlug } = req.params;
  const { skip, limit } = req.query;

  const reviews = await courseService.getReviews(courseSlug, skip, limit);

  const html = await hbs.render('src/views/partials/reviewItems.hbs', {
    reviews,
  });

  res.send(html);
};

const cudReview = async (req, res, next) => {
  const { courseSlug } = req.params;
  const { rating, review } = req.body;
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

  const oldReview = await courseService.getCourseReviewOfUser(
    course._id,
    user._id
  );

  if (oldReview) {
    if (+rating === 0) {
      await Review.findByIdAndDelete(oldReview._id);
    } else {
      await Review.findByIdAndUpdate(oldReview._id, {
        rating,
        review,
      });
    }
  } else {
    await Review.create({
      course: course._id,
      owner: user._id,
      rating,
      review,
    });
  }

  res.redirect(req.headers.referer || `/courses/${courseSlug}/lessons`);
};

const getCheckoutPage = async (req, res, next) => {
  const { slug } = req.params;
  const course = await Course.findOne({ slug });
  const media = course.coverPhoto
    ? await Media.findById(course.coverPhoto)
    : null;
  let thumbnail = null;
  if (media) {
    if (media.type === 'image') {
      thumbnail = {
        type: 'image',
        url: GCSService.getPublicImageUrl(media.filename),
      };
    }
    if (media.type === 'video') {
      thumbnail = {
        type: 'video',
        url: await GCSService.getVideoSignedUrl(media.filename),
      };
    }
  }
  res.render('courses/checkout', {
    title: `Check out | ${course.name}`,
    data: {
      ...course.toObject(),
      thumbnail,
    },
  });
};

export default {
  getCourseDetailView,
  getCourseDetail,
  getRelatedCourses,
  getLessonView,
  getReviews,
  cudReview,
  getCheckoutPage,
};
