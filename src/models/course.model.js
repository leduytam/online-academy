import { Schema, model } from 'mongoose';

const courseSchema = new Schema({
  name: {
    index: 'text',
    type: String,
    require: true,
  },
  slug: {
    type: String,
    slug: 'name',
    unique: true,
  },
  coverPhoto: {
    type: Schema.Types.ObjectId,
    ref: 'Media',
    require: true,
  },
  briefDescription: {
    type: String,
    require: true,
  },
  detailDescription: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'SubCategory',
    require: true,
  },
  sections: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Section',
      },
    ],
    default: [],
  },
  instructor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    require: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

export default model('Course', courseSchema);
