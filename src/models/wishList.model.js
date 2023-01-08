import { Schema, model } from 'mongoose';

const wishListSchema = new Schema({
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    require: true,
  },
  student: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    require: true,
  }
});

export default model('WishList', wishListSchema);
