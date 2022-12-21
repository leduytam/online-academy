const getHomeView = async (req, res, next) => {
  res.render('students/home', {
    title: 'Home page',
  });
};

const getLessonView = async (req, res, next) => {
  res.render('students/lesson', {
    title: 'Lesson',
    layout: false,
  });
};

export default {
  getHomeView,
  getLessonView,
};
