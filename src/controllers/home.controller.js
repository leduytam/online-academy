import Course from '../models/course.model.js';
import Enrollment from '../models/enrollment.model.js';
import gcsService from '../services/gcs.service.js';
import { getTopCoursePipeline } from '../utils/aggreration/home.js';

const getHomeView = async (req, res, next) => {
  try {
    const topCoursePipeline = getTopCoursePipeline();
    const topCourses = await Enrollment.aggregate(topCoursePipeline);
    console.log("🚀 ~ file: home.controller.js:10 ~ getHomeView ~ topCourses", topCourses)
    const mostViewedCourses = await Course.find({})
      .sort({ views: -1 , createdAt: 1 })
      .limit(12)
      .populate('instructor')
      .populate('coverPhoto')
      .lean();
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
