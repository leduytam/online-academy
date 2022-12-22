import User from '../models/user.model.js';

const getUsersList = async (req, res, next) => {
  try {
    let { limit, page } = req.query;
    limit = Number(limit);
    page = Number(page);
    const skip = (page - 1) * limit;
    const users = await User.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);
    const numberOrder = await User.countDocuments({});
    const totalPages = Math.ceil(numberOrder / limit) ?? 1;
    const currentPage = Number(page);
    res.send({
      status: true,
      code: 200,
      currentPage,
      totalPages,
      data: users,
      sum: 0,
    });
  } catch (e) {
    res.send({ status: false, message: e.message });
  }
};

const createUser = async (req, res, next) => {
  try {
    const { email, name, password, role } = req.body;
    const user = await User.create({
      email,
      name,
      password,
      role,
    });
    res.send({ status: true, code: 200, data: user });
  } catch (e) {
    res.send({ status: false, message: e.message });
  }
};

export default {
  getUsersList,
  createUser,
};
