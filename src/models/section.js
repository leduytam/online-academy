import { Schema, model } from 'mongoose';

const sectionSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  lessons: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Lesson',
    },
  ],
});

export default model('Section', sectionSchema);
