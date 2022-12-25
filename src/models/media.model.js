import { Schema, model } from 'mongoose';

import EMedia from '../constant/media.js';

const mediaSchema = new Schema({
  type: {
    type: String,
    require: true,
    enum: [EMedia.Image, EMedia.Video],
  },
  filename: {
    type: String,
    unique: true,
  },
  duration: {
    type: Number,
  },
});

export default model('Media', mediaSchema);
