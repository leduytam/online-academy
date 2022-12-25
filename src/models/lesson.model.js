import { Schema, model } from 'mongoose';
import uniqueSlug from 'unique-slug';

const lessonSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  slug: {
    type: String,
    unique: true,
  },
  video: {
    type: Schema.Types.ObjectId,
    ref: 'Media',
  },
  preview: {
    type: Boolean,
    default: false,
  },
});

lessonSchema.pre('save', function (next) {
  if (this.isNew) {
    this.slug = uniqueSlug();
  }

  next();
});

export default model('Lesson', lessonSchema);
