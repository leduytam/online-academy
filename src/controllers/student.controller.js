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

const getMyCoursesView = async (req, res, next) => {
  res.render('students/myCourses', {
    title: 'My courses',
  });
};

const getWishlistView = async (req, res, next) => {
  res.render('students/wishlist', {
    title: 'Wish list',
  });
};

export default {
  getHomeView,
  getLessonView,
  getMyCoursesView,
  getWishlistView,
};
