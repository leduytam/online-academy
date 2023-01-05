import Category from '../models/category.model.js';
import Course from '../models/course.model.js';
import Subcategory from '../models/subcategory.model.js';

const getCourseDetailView = async (req, res, next) => {
  res.render('courses/detail', {
    title: 'Course detail',
  });
};

const getCourseDetailApi = async (req, res, next) => {
  console.log('getCourseDetailApi');
  try {
    const { id } = req.params;
    const course = await Course.findById(id);

    const subcategory = await Subcategory.findById(course.category);
    const category = await Category.findOne({ subcategories: subcategory._id });

    const result = {
      ...course.toObject(),
      category,
      subcategory,
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
