import * as gcs from '@google-cloud/storage';

import configs from '../configs/index.js';

const storage = new gcs.Storage(configs.gcs.storage);

const publicBucket = storage.bucket(configs.gcs.publicBucket);
const privateBucket = storage.bucket(configs.gcs.privateBucket);

const uploadImage = async (file, slug) => {
  return new Promise((resolve, reject) => {
    const blob = publicBucket.file(slug);

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

const deleteImage = async (slug) => {
  await publicBucket.file(slug).delete();
};

const uploadVideo = async (file, slug) => {
  return new Promise((resolve, reject) => {
    const blob = privateBucket.file(slug);

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

const deleteVideo = async (slug) => {
  privateBucket.file(slug).delete();
};

const getPublicImageUrl = (slug) => {
  return `https://storage.googleapis.com/${publicBucket.name}/${slug}`;
};

const getVideoSignedUrl = async (slug) => {
  const options = {
    version: 'v4',
    action: 'read',
    expires: Date.now() + configs.gcs.signedUrlExpiresIn,
  };

  const [url] = await privateBucket.file(slug).getSignedUrl(options);

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
