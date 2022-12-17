import mongoose, { Schema, model } from 'mongoose';

const enrollmentSchema = new Schema(
    {
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        }, 
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        done: Boolean,
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
