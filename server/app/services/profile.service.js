const User = require('../models/User');
const bucket = storage.bucket();

const updateProfile = async (userId, data) => {
  await User.updateProfile(userId, data);
};

const uploadCv = async (userId, file) => {
  const fileName = `cvs/${userId}-cv.pdf`;
  const fileUpload = bucket.file(fileName);
  await fileUpload.save(file.buffer, {
    metadata: { contentType: 'application/pdf' },
  });
  await fileUpload.makePublic();
  const url = fileUpload.publicUrl();
  await User.setCvUrl(userId, url);
  return url;
};

const uploadProfilePicture = async (userId, file) => {
  const fileExtension = file.mimetype.split('/')[1];
  const fileName = `profile_pictures/${userId}-profile.${fileExtension}`;
  const fileUpload = bucket.file(fileName);
  await fileUpload.save(file.buffer, {
    metadata: { contentType: file.mimetype },
  });
  await fileUpload.makePublic();
  const url = fileUpload.publicUrl();
  await User.setProfilePictureUrl(userId, url);
  return url;
};

module.exports = {
  updateProfile,
  uploadCv,
  uploadProfilePicture
};