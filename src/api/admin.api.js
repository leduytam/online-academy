import User from '../models/user.model.js';

const getUsersList = async (req, res, next) => {
  try {
    let { limit, page } = req.query;
    limit = Number(limit);
    page = Number(page);
    const skip = (page - 1) * limit;
    const users = await User.find({}, '-password +createdAt +updatedAt')
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

export default {
  getUsersList,
};
