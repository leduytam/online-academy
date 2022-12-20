import mongoose, { Schema, model } from 'mongoose';

const enrollmentSchema = new Schema(
    {
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            require: true
        }, 
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            require: true
        },
        done: {
            type: Boolean,
            default: false
        },
        completedLessons: [
            {
                lessonId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Lesson'
                }
            }
        ]
    }, 
    {
        timestamps: true
    }
)

export default model('Enrollment', enrollmentSchema);
