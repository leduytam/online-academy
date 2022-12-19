const get = async (req, res, next) => {
  res.render('admin/dashboard', {
    title: 'Admin page',
  });
};

const getUsers = async (req, res, next) => {
  res.render('admin/managementUsers', {
    title: 'Manage users',
  });
};

const getCourses = async (req, res, next) => {
  res.render('admin/managementCourses', {
    title: 'Manage courses',
  });
};

export default {
  get,
  getUsers,
  getCourses,
};
