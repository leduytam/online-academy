import path from 'path';
import uniqueSlug from 'unique-slug';

import EMedia from '../constant/media.js';
import Media from '../models/media.model.js';
import Subcategory from '../models/subcategory.model.js';
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
  const userDisplay = await User.findById(user._id ?? '')
    .populate('avatar')
    .lean();
  res.render('instructor/profile', {
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
      res.redirect('/instructor/profile');
    });
  } catch (e) {
    logger.error(e);
  }
};

const uploadProfileImage = async (req, res, next) => {
  const { file } = req;
  const { user } = req.session;
  const userUpdate = await User.findById(user._id ?? '');

  if (!file) {
    req.session.error = 'Please upload an image';
    req.session.save((err) => {
      res.redirect('/instructor/profile');
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
    res.redirect('/instructor/profile');
  });
};

const createCourse = async (req, res, next) => {
  try {
    const { file } = req;
    const { user } = req.session;
    if (!file) {
      req.session.error = 'Please upload an image';
      req.session.save((err) => {
        res.redirect('/instructor/courses');
      });
      return;
    }
    if (!user) {
      req.session.error = 'Please login to create a course';
      res.redirect('/login');
      return;
    }
    const extname = path.extname(file.originalname);
    const filename = `${uniqueSlug()}${Date.now()}${extname}`;
    await gcsService.uploadImage(file, filename);
    const media = await Media.create({
      filename,
      type: 'image',
    });

    const { name, briefDescription, detailDescription, category, price } =
      req.body;
    const subcategory = await Subcategory.findById(category);

    await Course.create({
      name,
      briefDescription,
      detailDescription,
      category: subcategory._id,
      price,
      coverPhoto: media._id,
      instructor: user._id,
    });
    req.session.success = 'Course created successfully';
    res.redirect('/instructor');
  } catch (e) {
    logger.error(e);
    req.session.error = 'Something went wrong';
    res.redirect('/instructor');
  }
};

export default {
  get,
  getInfo,
  updateInformation,
  uploadProfileImage,
  createCourse,
};
