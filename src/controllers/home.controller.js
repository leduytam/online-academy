const get = async (req, res, next) => {
  res.render('students/home', {
    title: 'Home page',
  });
};

const getMyCourses = async (req, res, next) => {
  res.render('students/myCourses', {
    title: 'My courses',
  });
};

export default {
  get,
  getMyCourses,
};
