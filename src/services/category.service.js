import Category from '../models/category.model.js';
import '../models/subcategory.model.js';

const getAll = async () => {
  const categories = await Category.find({}).populate('subcategories').lean();

  return categories;
};

export default {
  getAll,
};
