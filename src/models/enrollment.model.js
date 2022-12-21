import { Schema, model } from 'mongoose';

const enrollmentSchema = new Schema({
  courseId: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    require: true,
  },
  studentId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    require: true,
  },
  done: {
    type: Boolean,
    default: false,
  },
  completedLessons: [
    {
      lessonId: {
        type: Schema.Types.ObjectId,
        ref: 'Lesson',
      },
    },
  ],
});

export default model('Enrollment', enrollmentSchema);
