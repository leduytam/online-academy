import Category from '../models/category.model.js';
import Course from '../models/course.model.js';
import Enrollment from '../models/enrollment.model.js';
import Lesson from '../models/lesson.model.js';
import Media from '../models/media.model.js';
import Review from '../models/review.model.js';
import Section from '../models/section.model.js';
import Subcategory from '../models/subcategory.model.js';
import GCSService from '../services/gcs.service.js';

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
    // populate the subcategory
    const subcategory = await Subcategory.findById(course.category);
    // get all courses in the subcategory
    const courses = await Course.find({ category: subcategory._id });
    // populate with media
    const relatedCourses = await Promise.all(
      courses.map(async (c) => {
        const media = c.coverPhoto ? await Media.findById(c.coverPhoto) : null;
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
        return {
          ...c.toObject(),
          thumbnail,
        };
      })
    );

    // filter out the current course
    const data = relatedCourses.filter(
      (c) => c._id.toString() !== course._id.toString()
    );
    res.status(200).send(data);
  } catch (error) {
    res.status(500);
  }
};

export default {
  getCourseDetailView,
  getCourseDetail,
  getRelatedCourses,
};
