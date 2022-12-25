import { Schema, model } from 'mongoose';

const categorySchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  slug: {
    type: String,
    unique: true,
    slug: 'name',
  },
  subcategories: [
    {
      type: Schema.Types.ObjectId,
      ref: 'SubCategory',
    },
  ],
});

export default model('Category', categorySchema);
