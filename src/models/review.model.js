import mongoose, { Schema, model } from 'mongoose';
import { ERating } from '../constant';

const reviewSchema = new Schema(
    {
        review: {
            type: String,
            require: true
        },
        rating: {
            type: Number,
            enum: ERating,
            require: true
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }, 
    {
        timestamps: true
    }
)

export default model('Review', reviewSchema);
