import configs from '../configs/index.js';
import Otp from '../models/otp.model.js';
import generateOtp from '../utils/generateOtp.js';

const deleteOtp = async (email, type) => {
  await Otp.findOneAndDelete({ email, type });
};

const create = async (email, type) => {
  await deleteOtp(email, type);

  const otpDoc = await Otp.create({
    email,
    otp: generateOtp(),
    type,
    expires: new Date(Date.now() + configs.otp.maxAge),
  });

  return otpDoc.otp;
};

const verify = async (email, otp, type) => {
  const otpDoc = await Otp.findOne({ email, otp, type });
  return !!otpDoc && otpDoc.expires > new Date();
};

export default {
  create,
  verify,
  deleteOtp,
};
