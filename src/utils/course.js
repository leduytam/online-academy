import WishList from '../models/wishList.model.js';

export async function checkIsWishListed(courseId, studentId) {
    const wishList = await WishList.findOne({
        course: courseId,
        student: studentId,
    });
    return !!wishList;
}
 