import { Schema, model } from 'mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';
import slugify from 'slugify';

const courseSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    slug: {
      tyle: String,
      lowercase: true,
      unique: true,
    },
    coverPhoto: {
      type: Schema.Types.ObjectId,
      ref: 'Media',
      require: true,
    },
    briefDescirption: {
      type: String,
      require: true,
    },
    detailDescription: {
      type: String,
      require: true,
    },
    done: {
      type: Boolean,
      default: false,
    },
    price: {
      type: Number,
      require: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'SubCategory',
      require: true,
    },
    sections: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Section',
      },
    ],
    instructor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

courseSchema.plugin(mongooseUniqueValidator, {
  message: 'This course is already taken',
});

courseSchema.pre('validate', function (next) {
  if (!this.slug) {
    this.slugify();
  }

  next();
});

courseSchema.method.slugify = () => {
  this.slug = `${slugify(this.name)}-${Date.now()}`;
};

export default model('Course', courseSchema);
