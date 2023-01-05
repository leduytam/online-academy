import '../models/category.model.js';
import Course from '../models/course.model.js';
import Enrollment from '../models/enrollment.model.js';
import '../models/lesson.model.js';
import '../models/media.model.js';
import Review from '../models/review.model.js';
import '../models/section.model.js';
import '../models/user.model.js';

const getCourseDetail = async (slug) => {
  const course = await Course.findOne({ slug })
    .populate([
      'instructor',
      'coverPhoto',
      'category',
      {
        path: 'sections',
        populate: {
          path: 'lessons',
          populate: 'video',
        },
      },
    ])
    .lean();

  return course;
};

const getReviews = async (courseId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const reviews = await Review.find({ course: courseId })
    .sort('-createdAt')
    .skip(skip)
    .limit(limit)
    .lean();

  return reviews;
};

const getReviewStats = async (courseId) => {
  const avgs = await Review.aggregate([
    {
      $match: { course: courseId },
    },
    {
      $group: {
        _id: null,
        rating: { $avg: '$rating' },
        total: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
  ]);

  const rating = avgs.length > 0 ? avgs[0].rating : 0;
  const total = avgs.length > 0 ? avgs[0].total : 0;

  const ratings = await Review.aggregate([
    {
      $match: { course: courseId },
    },
    {
      $group: {
        _id: '$rating',
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        rating: '$_id',
        percentage: { $multiply: [{ $divide: ['$count', total] }, 100] },
      },
    },
    {
      $sort: { rating: -1 },
    },
  ]);

  return { rating, total, ratings };
};

const isEnrolled = async (courseId, studentId) => {
  const enrollment = await Enrollment.findOne({
    course: courseId,
    student: studentId,
  });

  return !!enrollment;
};

const isContainLesson = async (courseSlug, lessonSlug) => {
  const course = await Course.findOne({ slug: courseSlug })
    .populate({
      path: 'sections',
      populate: {
        path: 'lessons',
        match: { slug: lessonSlug },
      },
    })
    .lean();

  return course.sections.some((section) => section.lessons.length > 0);
};

export default {
  getCourseDetail,
  isEnrolled,
  isContainLesson,
  getReviews,
  getReviewStats,
};
