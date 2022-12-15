const get = async (req, res, next) => {
  res.render('admin/dashboard', {
    title: 'Admin page',
  });
};

export default {
  get,
};
