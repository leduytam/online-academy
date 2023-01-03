const get = async (req, res, next) => {
  res.render('instructor/courses', {
    title: 'Courses',
  });
};

const getInfo = async (req, res, next) => {
  const { user } = req.session;
  res.render('instructor/profile', {
    title: 'Profile',
    user,
  });
};

export default {
  get,
  getInfo,
};
