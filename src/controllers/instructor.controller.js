import path from 'path';

import User from '../models/user.model.js';
import gcsService from '../services/gcs.service.js';
import logger from '../utils/logger.js';

const get = async (req, res, next) => {
  res.render('instructor/courses', {
    title: 'Courses',
  });
};

const getInfo = async (req, res, next) => {
  const { user } = req.session;
  const userDisplay = await User.findById(user._id).lean();
  res.render('instructor/profile', {
    title: 'Profile',
    user: userDisplay,
  });
};

const updateInformation = async (req, res, next) => {
  try {
    const { user } = req.session;
    const userUpdate = await User.findById(user._id);
    const { name, facebook, website, twitter, linkedin, bio, youtube } =
      req.body;
    userUpdate.name = name;
    userUpdate.facebookLink = facebook;
    userUpdate.websiteLink = website;
    userUpdate.twitterLink = twitter;
    userUpdate.linkedinLink = linkedin;
    userUpdate.bio = bio;
    userUpdate.youtubeLink = youtube;

    await userUpdate.save();
    req.session.user = userUpdate;
    req.session.save((err) => {
      res.redirect('/instructor/profile');
    });
  } catch (e) {
    logger.error(e);
  }
};

const uploadImage = async (req, res, next) => {
  const { file } = req;
  const { user } = req.session;
  const userUpdate = await User.findById(user._id);

  if (!file) {
    req.session.error = 'Please upload an image';
    req.session.save((err) => {
      res.redirect('/instructor/profile');
    });
    return;
  }

  const extname = path.extname(file.originalname);

  const slug = `${Date.now()}${extname}`;

  try {
    userUpdate.avatar = slug;
    await userUpdate.save();
    req.session.user = userUpdate;
    await gcsService.uploadImage(file, slug);
    req.session.success = await gcsService.getPublicImageUrl(slug);
  } catch (error) {
    req.session.error = error.message;
  }

  req.session.save((err) => {
    res.redirect('/instructor/profile');
  });
};

export default {
  get,
  getInfo,
  updateInformation,
  uploadImage,
};
