import { Schema, model } from 'mongoose';

import { ERating } from '../constant/index.js';

const reviewSchema = new Schema({
  review: {
    type: String,
    require: true,
  },
  rating: {
    type: Number,
    enum: [
      ERating.ONE_START,
      ERating.TWO_START,
      ERating.THREE_START,
      ERating.FOUR_START,
      ERating.FIVE_START,
    ],
    require: true,
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    require: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    require: true,
  },
});

export default model('Review', reviewSchema);
