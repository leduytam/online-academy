import { Schema, model } from 'mongoose';

const subCategorySchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  slug: {
    type: String,
    unique: true,
    slug: 'name',
  },
});

export default model('SubCategory', subCategorySchema);
