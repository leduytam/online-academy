import { Schema, model } from 'mongoose';

const categorySchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  description: String,
  subCategories: [
    {
      type: Schema.Types.ObjectId,
      ref: 'SubCategory',
    },
  ],
});

export default model('Category', categorySchema);
