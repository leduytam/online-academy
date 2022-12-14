import { Schema, model } from 'mongoose';

const otpSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      ref: 'User',
    },
    otp: {
      type: String,
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

otpSchema.index(
  {
    expires: 1,
  },
  {
    expireAfterSeconds: 0,
  }
);

export default model('Otp', otpSchema);
