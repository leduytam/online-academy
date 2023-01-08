import Course from '../models/course.model.js';
import Enrollment from '../models/enrollment.model.js';
import gcsService from '../services/gcs.service.js';
import { getTopCoursePipeline, getMostEnrolledCategoriesPipeline } from '../utils/aggreration/home.js';
import { checkIsWishListed } from '../utils/course.js';

const getHomeView = async (req, res, next) => {
  try {
    const topCoursePipeline = getTopCoursePipeline();
    const topCourses = await Enrollment.aggregate(topCoursePipeline);
    const mostEnrolledSubCategoriesPipeline = getMostEnrolledCategoriesPipeline();
    const mostEnrolledSubCategories = await Enrollment.aggregate(mostEnrolledSubCategoriesPipeline);
    console.log("🚀 ~ file: home.controller.js:21 ~ getHomeView ~ mostEnrolledSubCategories", mostEnrolledSubCategories)
    
    const latestCourses = await Course.find({})
      .sort({ createdAt: -1 })
      .limit(12)
      .populate('instructor')
      .populate('coverPhoto')
      .lean();
    latestCourses.forEach(async (course) => {
      course.isWishListed = await checkIsWishListed(course._id, req.session.user._id);
    });
    const mostViewedCourses = await Course.find({})
      .sort({ views: -1 , createdAt: 1 })
      .limit(12)
      .populate('instructor')
      .populate('coverPhoto')
      .lean();
    mostViewedCourses.forEach(async (course) => {
      course.isWishListed = await checkIsWishListed(course._id, req.session.user._id);
    });
    res.render('students/home', {
      title: 'Home',
      topCourses: topCourses.map((course) => {
        return {
          ...course,
          coverPhoto: gcsService.getPublicImageUrl(course.coverPhoto),
        };
      }),
      mostViewedCourses: mostViewedCourses.map((course) => {
        return {
          ...course,
          coverPhoto: gcsService.getPublicImageUrl(course.coverPhoto.filename),
        };
      }),
      latestCourses: latestCourses.map((course) => {
        return {
          ...course,
          coverPhoto: gcsService.getPublicImageUrl(course.coverPhoto.filename),
        };
      }),
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
