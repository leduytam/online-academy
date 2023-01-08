import path from 'path';
import uniqueSlug from 'unique-slug';

import EMedia from '../constant/media.js';
import Media from '../models/media.model.js';
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
  const userDisplay = await User.findById(user._id ?? '')
    .populate('avatar')
    .lean();

  res.render('students/profile', {
    title: 'Profile',
    user: userDisplay,
  });
};

const updateInformation = async (req, res, next) => {
  try {
    const { user } = req.session;
    const userUpdate = await User.findById(user._id ?? '');
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
  const userUpdate = await User.findById(user._id ?? '');

  if (!file) {
    req.session.error = 'Please upload an image';
    req.session.save((err) => {
      res.redirect('/profile');
    });
    return;
  }

  const extname = path.extname(file.originalname);

  const filename = `${uniqueSlug()}${Date.now()}${extname}`;

  try {
    const media = await Media.create({
      type: EMedia.Image,
      filename,
    });
    userUpdate.avatar = media._id;
    await userUpdate.save();
    req.session.user = userUpdate;
    await gcsService.uploadImage(file, filename);
  } catch (error) {
    req.session.error = error.message;
  }

  req.session.save((err) => {
    res.redirect('/profile');
  });
};

export default {
  getHomeView,
  getProfileView,
  updateInformation,
  uploadImage,
};
