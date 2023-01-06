import path from 'path';
import uniqueSlug from 'unique-slug';

import User from '../models/user.model.js';
import gcsService from '../services/gcs.service.js';
import logger from '../utils/logger.js';

const getHomeView = async (req, res, next) => {
  res.render('students/home', {
    title: 'Home page',
  });
};

const getProfileView = async (req, res, next) => {
  const { user } = req.session;
  const userDisplay = await User.findById(user._id).lean();
  res.render('students/profile', {
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
      res.redirect('/profile');
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

  const slug = `${uniqueSlug()}${Date.now()}${extname}`;

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
    res.redirect('/profile');
  });
};

export default {
  getHomeView,
  getLessonView,
  getProfile,
  updateInformation,
  uploadImage,
};
