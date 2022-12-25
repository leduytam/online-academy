import { Schema, model } from 'mongoose';

const enrollmentSchema = new Schema({
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    require: true,
  },
  student: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    require: true,
  },
  done: {
    type: Boolean,
    default: false,
  },
  completedLessons: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Lesson',
      },
    ],
    default: [],
  },
});

enrollmentSchema.index({ course: 1, student: 1 }, { unique: true });

export default model('Enrollment', enrollmentSchema);
