import { Schema, model } from 'mongoose';

const subCategorySchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  description: String,
});

export default model('SubCategory', subCategorySchema);
