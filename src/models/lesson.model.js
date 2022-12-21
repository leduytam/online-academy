import { Schema, model } from 'mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';
import slugify from 'slugify';

const lessonSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  content: {
    type: String,
    require: true,
  },
  slug: {
    type: String,
    lowercase: true,
    unique: true,
  },
  video: {
    type: Schema.Types.ObjectId,
    ref: 'Media',
  },
});

lessonSchema.plugin(mongooseUniqueValidator, {
  message: 'This course is already taken',
});

lessonSchema.pre('validate', function (next) {
  if (!this.slug) {
    this.slugify();
  }

  next();
});

lessonSchema.method.slugify = () => {
  this.slug = `${slugify(this.name)}-${Date.now()}`;
};

export default model('Lesson', lessonSchema);
