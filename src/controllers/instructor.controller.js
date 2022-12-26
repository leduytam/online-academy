const get = async (req, res, next) => {
  res.render('instructor/courses', {
    title: 'Courses',
  });
};

const getInfo = async (req, res, next) => {
  res.render('instructor/profile', {
    title: 'Profile',
  });
};

export default {
  get,
  getInfo,
};
