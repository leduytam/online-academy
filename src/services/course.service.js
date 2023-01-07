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

const getReviewStats = async (courseId) => {
  const course = await Course.findById(courseId);

  if (!course) {
    return null;
  }

  const avgTotal = await Review.aggregate([
    {
      $match: { course: courseId },
    },
    {
      $group: {
        _id: null,
        avg: { $avg: '$rating' },
        total: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
  ]);

  const avg = avgTotal.length > 0 ? avgTotal[0].avg : 0;
  const total = avgTotal.length > 0 ? avgTotal[0].total : 0;

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
        count: 1,
      },
    },
  ]);

  for (let i = 1; i <= 5; i += 1) {
    if (!ratings.some((r) => r.rating === i)) {
      ratings.push({ rating: i, count: 0 });
    }
  }

  return {
    avg,
    total,
    ratings: ratings
      .map((rating) => {
        return {
          ...rating,
          percentage: (rating.count / total) * 100,
        };
      })
      .sort((a, b) => b.rating - a.rating),
  };
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

const getReviews = async (courseSlug, skip = 0, limit = 5) => {
  const course = await Course.findOne({ slug: courseSlug }).lean();

  if (!course) {
    return [];
  }

  const reviews = await Review.find({ course: course._id })
    .sort({ createdAt: -1 })
    .skip(skip)
    .select('rating review owner createdAt')
    .populate({
      path: 'owner',
      select: 'name',
    })
    .lean();

  return reviews.splice(0, limit);
};

const getCourseReviewOfUser = async (courseId, userId) => {
  const review = await Review.findOne({
    course: courseId,
    owner: userId,
  })
    .select('rating review')
    .lean();

  return review;
};

const getCompletedLessons = async (courseId, userId) => {
  const enrollment = await Enrollment.findOne({
    course: courseId,
    student: userId,
  }).lean();

  if (!enrollment) {
    return [];
  }

  return enrollment.completedLessons;
};

const completeLesson = async (courseId, userId, lessonId) => {
  await Enrollment.updateOne(
    {
      course: courseId,
      student: userId,
    },
    {
      $addToSet: {
        completedLessons: lessonId,
      },
    }
  );
};

const completeCourse = async (courseId, userId) => {
  await Enrollment.updateOne(
    {
      course: courseId,
      student: userId,
    },
    {
      done: true,
    }
  );
};

export default {
  getCourseDetail,
  isEnrolled,
  isContainLesson,
  getReviews,
  getReviewStats,
  getCourseReviewOfUser,
  getCompletedLessons,
  completeLesson,
  completeCourse,
};
