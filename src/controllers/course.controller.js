import Category from '../models/category.model.js';
import Course from '../models/course.model.js';
import Enrollment from '../models/enrollment.model.js';
import Lesson from '../models/lesson.model.js';
import Review from '../models/review.model.js';
import Section from '../models/section.model.js';
import Subcategory from '../models/subcategory.model.js';
import User from '../models/user.model.js';

const getCourseDetailView = async (req, res, next) => {
  const { id } = req.params;
  const course = await Course.findById(id);
  res.render('courses/detail', {
    title: course.name,
    data: course,
  });
};

const getCourseDetailApi = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);

    const subcategory = await Subcategory.findById(course.category);
    const category = await Category.findOne({ subcategories: subcategory._id });
    const reviews = await Review.find({ course: course._id });
    const enrollments = await Enrollment.find({ course: course._id });
    const instructor = await User.findById(course.instructor);
    // query all lessons, sections by course's sessions
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

    const result = {
      ...course.toObject(),
      category,
      subcategory,
      reviews,
      enrollments,
      instructor,
      sections,
    };
    res.status(200).send(result);
  } catch (error) {
    res.status(500);
  }
};

export default {
  getCourseDetailView,
  getCourseDetailApi,
};
