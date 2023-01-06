import Course from '../models/course.model.js';
import gcsService from '../services/gcs.service.js';

const getHomeView = async (req, res, next) => {
  try {
    const mostViewedCourses = await Course.find({})
      .sort({ views: -1 , createdAt: 1 })
      .limit(12)
      .populate('instructor')
      .populate('coverPhoto')
      .lean();
    res.render('students/home', {
      title: 'Home',
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
