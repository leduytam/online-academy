const get = async (req, res, next) => {
  res.render('students/home', {
    title: 'Home page',
  });
};

export default {
  get,
};
