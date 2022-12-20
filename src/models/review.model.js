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
            enum: [ERating.ONE_START, ERating.TWO_START, ERating.THREE_START, ERating.FOUR_START, ERating.FIVE_START],
            require: true
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            require: true
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            require: true
        }
    }, 
    {
        timestamps: true
    }
)

export default model('Review', reviewSchema);
