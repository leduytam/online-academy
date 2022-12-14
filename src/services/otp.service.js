import configs from '../configs/index.js';
import Otp from '../models/otp.model.js';
import generateOtp from '../utils/generateOtp.js';

const create = async (email) => {
  await Otp.findOneAndDelete({ email });

  const otpCode = generateOtp();

  const otpDoc = await Otp.create({
    email,
    otp: otpCode,
    expires: new Date(Date.now() + configs.otp.maxAge),
  });

  return otpDoc.otp;
};

const verify = async (email, otp) => {
  const otpDoc = await Otp.findOne({ email, otp });
  return otpDoc && otpDoc.expires > Date.now();
};

const deleteOtp = async (email) => {
  await Otp.findOneAndDelete({ email });
};

export default {
  create,
  verify,
  deleteOtp,
};
