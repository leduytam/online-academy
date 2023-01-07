import bcrypt from 'bcryptjs';
import { Schema, model } from 'mongoose';

import { ERole } from '../constant/index.js';

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    slug: 'name',
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  role: {
    type: String,
    enum: [ERole.ADMIN, ERole.INSTRUCTOR, ERole.STUDENT],
    default: ERole.STUDENT,
  },
  avatar: {
    type: Schema.Types.ObjectId,
    ref: 'Media',
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  bio: {
    type: String,
  },
  facebookLink: {
    type: String,
  },
  websiteLink: {
    type: String,
  },
  twitterLink: {
    type: String,
  },
  linkedinLink: {
    type: String,
  },
  youtubeLink: {
    type: String,
  },
});

userSchema.pre('save', async function (req, res, next) {
  if (this.isNew || this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  next();
});

userSchema.methods.verifyPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.statics.isEmailTaken = async function (email) {
  return !!(await this.findOne({ email }));
};

export default model('User', userSchema);
