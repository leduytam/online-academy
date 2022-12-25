import { Schema, model } from 'mongoose';

const sectionSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  lessons: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Lesson',
      },
    ],
    default: [],
  },
});

export default model('Section', sectionSchema);
