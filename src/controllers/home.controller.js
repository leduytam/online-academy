import Course from '../models/course.model.js';
import Enrollment from '../models/enrollment.model.js';
import courseService from '../services/course.service.js';
import gcsService from '../services/gcs.service.js';
import { getTopCoursePipeline, getMostEnrolledCategoriesPipeline } from '../utils/aggreration/home.js';

const getHomeView = async (req, res, next) => {
  try {
    const userId = req.session.user ? req.session.user._id : null;
    const topCoursePipeline = getTopCoursePipeline();
    const topCourses = await Enrollment.aggregate(topCoursePipeline);
    const mostEnrolledSubCategoriesPipeline = getMostEnrolledCategoriesPipeline();
    const mostEnrolledSubCategories = await Enrollment.aggregate(mostEnrolledSubCategoriesPipeline);
    
    let latestCourses = await Course.find({})
      .sort({ createdAt: -1 })
      .limit(12)
      .populate('instructor')
      .populate('coverPhoto')
      .lean();
    let mostViewedCourses = await Course.find({})
      .sort({ views: -1 , createdAt: 1 })
      .limit(12)
      .populate('instructor')
      .populate('coverPhoto')
      .lean();
    latestCourses = await Promise.all(
      latestCourses.map(async (course) => {
        const { avg, total} = await courseService.getReviewStats(course._id);
        const isEnrolled = userId ? await courseService.isEnrolled(course._id, userId) : false;
        const isWishListed = userId ? await courseService.isWishListed(course._id, userId) : false;
        return {
          ...course,
          isWishListed,
          isEnrolled,
          avgRating: avg,
          totalRatings: total,
          coverPhoto: gcsService.getPublicImageUrl(course.coverPhoto.filename),
        };
      }),
    )
    mostViewedCourses = await Promise.all(
      mostViewedCourses.map(async (course) => {
        const { avg, total} = await courseService.getReviewStats(course._id);
        const isEnrolled = userId ? await courseService.isEnrolled(course._id, userId) : false;
        const isWishListed = userId ? await courseService.isWishListed(course._id, userId) : false;
        return {
          ...course,
          isWishListed,
          isEnrolled,
          avgRating: avg,
          totalRatings: total,
          coverPhoto: gcsService.getPublicImageUrl(course.coverPhoto.filename),
        };
      }),
    )
    res.render('students/home', {
      title: 'Home',
      topCourses: topCourses.map((course) => {
        return {
          ...course,
          coverPhoto: gcsService.getPublicImageUrl(course.coverPhoto),
        };
      }),
      mostViewedCourses,
      latestCourses,
      mostEnrolledSubCategories,
    });
  } catch (e) {
    console.error(e);
    req.flash('error_msg', e.message);
    res.redirect('/');
  }
};

export default {
  getHomeView,
};
