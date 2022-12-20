import User from '../models/user.model.js';

// getSellerList: async (req, res, next) => {
//   try {
//     let { limit, page } = req.query
//     limit = Number(limit)
//     page = Number(page)
//     let skip = (page - 1) * limit

//     let condition = {}
//     const seller = await Seller.find(condition).sort({ createdAt: -1 }).limit(limit).skip(skip)

//     let number_order = await Seller.countDocuments(condition)

//     let totalPages = Math.ceil(number_order / limit)

//     let currentPage = Number(page)
//     totalPages === 0 ? (totalPages = 1) : totalPages

//     res.send({ status: true, code: 200, currentPage, totalPages, data: seller, sum: 0 })
//   } catch (e) {
//     res.send({ status: false, message: e.message })
//   }
// },

const getUsersList = async (req, res, next) => {
  console.log('>>>>>>>>>>>>>>>>>>>>>');
  try {
    let { limit, page } = req.query;
    limit = Number(limit);
    page = Number(page);
    const skip = (page - 1) * limit;
    const condition = {};
    const users = await User.find(condition, '-password')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);
    const numberOrder = await User.countDocuments(condition);
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
