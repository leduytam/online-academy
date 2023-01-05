import * as gcs from '@google-cloud/storage';

import configs from '../configs/index.js';

const storage = new gcs.Storage(configs.gcs.storage);

const publicBucket = storage.bucket(configs.gcs.publicBucket);
const privateBucket = storage.bucket(configs.gcs.privateBucket);

const uploadImage = async (file, filename) => {
  return new Promise((resolve, reject) => {
    const blob = publicBucket.file(filename);

    const blobStream = blob.createWriteStream({
      resumable: false,
    });

    blobStream.on('error', (error) => {
      reject(error);
    });

    blobStream.on('finish', () => {
      resolve();
    });

    blobStream.end(file.buffer);
  });
};

const deleteImage = async (filename) => {
  await publicBucket.file(filename).delete();
};

const uploadVideo = async (file, filename) => {
  return new Promise((resolve, reject) => {
    const blob = privateBucket.file(filename);

    const blobStream = blob.createWriteStream({
      resumable: true,
    });

    blobStream.on('error', (error) => {
      reject(error);
    });

    blobStream.on('finish', () => {
      resolve();
    });

    blobStream.end(file.buffer);
  });
};

const deleteVideo = async (filename) => {
  privateBucket.file(filename).delete();
};

const getPublicImageUrl = (filename) => {
  return `https://storage.googleapis.com/${publicBucket.name}/${filename}`;
};

const getVideoSignedUrl = async (filename) => {
  const options = {
    version: 'v4',
    action: 'read',
    expires: Date.now() + configs.gcs.signedUrlExpiresIn,
  };

  const [url] = await privateBucket.file(filename).getSignedUrl(options);

  return url;
};

export default {
  uploadImage,
  deleteImage,
  uploadVideo,
  deleteVideo,
  getPublicImageUrl,
  getVideoSignedUrl,
};
