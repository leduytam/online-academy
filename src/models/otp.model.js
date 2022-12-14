import { Schema, model } from 'mongoose';

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
