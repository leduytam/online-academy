import  { Schema, model } from 'mongoose';

const sectionSchema = new Schema(
    {
        name: {
            type: String,
            require: true
        },
        lessons: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Lesson'
            }
        ]
    },
    {
        timestamps: true
    }
)

export default model('Section', sectionSchema);

        