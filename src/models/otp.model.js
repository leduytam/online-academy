import { model, Schema } from 'mongoose';

const otpSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
    type: {
      type: String,
      enum: ['verify', 'reset-password', 'change-email'],
      required: true,
    },
  },
  {
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
