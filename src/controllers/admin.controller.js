const getUsersView = async (req, res, next) => {
  res.render('admin/users-list', {
    title: 'Manage users',
  });
};

const getCoursesView = async (req, res, next) => {
  res.render('admin/managementCourses', {
    title: 'Manage courses',
  });
};

const createUserView = async (req, res, next) => {
  res.render('admin/create-user', {
    title: 'Create user',
  });
};

export default {
  getUsersView,
  getCourses: getCoursesView,
  createUserView,
};
