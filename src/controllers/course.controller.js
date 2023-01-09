import hbs from '../configs/hbs.js';
import Category from '../models/category.model.js';
import Course from '../models/course.model.js';
import Enrollment from '../models/enrollment.model.js';
import User from '../models/user.model.js';
import Lesson from '../models/lesson.model.js';
import Media from '../models/media.model.js';
import Review from '../models/review.model.js';
import Section from '../models/section.model.js';
import Subcategory from '../models/subcategory.model.js';
import courseService from '../services/course.service.js';
import gcsService from '../services/gcs.service.js';

const getCourseDetailView = async (req, res, next) => {
  const { slug } = req.params;
  const course = await Course.findOne({ slug });
  course.views += 1;
  await course.save();
  res.render('courses/course-detail', {
    title: course.name,
    data: course,
  });
};

const getCourseDetail = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { user } = req.session;
    const course = await Course.findOne({ slug })
      .populate({
        path: 'instructor',
        populate: {
          path: 'avatar',
          model: 'Media',
        }
      })
      .populate('category');

    const subcategory = await Subcategory.findById(course.category);
    const category = await Category.findOne({ subcategories: subcategory._id });
    const reviews = await Review.find({ course: course._id }).populate({
      path: 'owner',
      populate: {
        path: 'avatar',
        model: 'Media',
      }
    });
    const enrollments = await Enrollment.find({ course: course._id });
    const sections = await Promise.all(
      course.sections.map(async (sectionId) => {
        const section = await Section.findById(sectionId);
        const lessons = await Promise.all(
          section.lessons.map(async (sectionLesson) => {
            const lesson = await Lesson.findById(sectionLesson);
            return lesson;
          })
        );
        return {
          ...section.toObject(),
          lessons,
        };
      })
    );
    const media = course.coverPhoto
      ? await Media.findById(course.coverPhoto)
      : null;
    let thumbnail = null;
    if (media) {
      if (media.type === 'image') {
        thumbnail = {
          type: 'image',
          url: gcsService.getPublicImageUrl(media.filename),
        };
      }
      if (media.type === 'video') {
        thumbnail = {
          type: 'video',
          url: await gcsService.getVideoSignedUrl(media.filename),
        };
      }
    }

    const isEnrolled =
      user && (await courseService.isEnrolled(course._id, user._id));

    const result = {
      ...course.toObject(),
      category,
      subcategory,
      reviews: reviews.map((review) => {
        return {
          ...review.toObject(),
          owner: {
            ...review.owner.toObject(),
            avatar: review.owner?.avatar?.filename ? gcsService.getPublicImageUrl(review.owner.avatar.filename): null,
          }
        };
      }),
      enrollments,
      sections,
      thumbnail,
      isEnrolled,
      instructor : {
        ...course.instructor.toObject(),
        avatar: course.instructor?.avatar?.filename ? gcsService.getPublicImageUrl(course.instructor.avatar.filename): null,
      }
    };
    res.status(200).send(result);
  } catch (error) {
    res.status(500);
  }
};

const getRelatedCourses = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const course = await Course.findOne({ slug });
    const subcategory = await Subcategory.findById(course.category);
    const courses = await Course.find({ category: subcategory._id });
    const relatedCourses = await Promise.all(
      courses.map(async (c) => {
        const media = c.coverPhoto ? await Media.findById(c.coverPhoto) : null;
        let thumbnail = null;
        if (media) {
          if (media.type === 'image') {
            thumbnail = {
              type: 'image',
              url: gcsService.getPublicImageUrl(media.filename),
            };
          }
          if (media.type === 'video') {
            thumbnail = {
              type: 'video',
              url: await gcsService.getVideoSignedUrl(media.filename),
            };
          }
        }
        return {
          ...c.toObject(),
          thumbnail,
        };
      })
    );

    const data = relatedCourses
      .filter((c) => c.slug !== slug)
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);

    res.status(200).send(data);
  } catch (error) {
    res.status(500);
  }
};

const getLessonView = async (req, res, next) => {
  const { courseSlug, lessonSlug } = req.params;
  const { user } = req.session;

  const course = await courseService.getCourseDetail(courseSlug);

  if (!course) {
    res.redirect('/404');
    return;
  }

  if (!(await courseService.isEnrolled(course._id, user._id))) {
    res.redirect('/403');
    return;
  }

  const completedLessons = await courseService.getCompletedLessons(
    course._id,
    user._id
  );

  let firstLesson = null;
  let activeSection = null;

  let count = 0;
  for (let i = 0; i < course.sections.length; i += 1) {
    let completedLessonsCount = 0;
    let totalDuration = 0;

    // eslint-disable-next-line no-loop-func
    course.sections[i].lessons = course.sections[i].lessons.map((ls) => {
      count += 1;
      const completed = completedLessons.some((cl) => cl.equals(ls._id));

      if (!firstLesson) {
        firstLesson = ls;
      }

      if (!activeSection && ls.slug === lessonSlug) {
        activeSection = course.sections[i];
      }

      if (completed) {
        completedLessonsCount += 1;
      }

      if (ls.video) {
        totalDuration += ls.video.duration;
      }

      return {
        ...ls,
        order: count,
        completed,
      };
    });

    course.sections[i].completedLessonsCount = completedLessonsCount;
    course.sections[i].totalDuration = totalDuration;
  }

  if (!activeSection) {
    res.redirect(
      firstLesson
        ? `/courses/${course.slug}/lessons/${firstLesson.slug}`
        : '/404'
    );
    return;
  }

  const activeLesson = activeSection.lessons.find(
    (ls) => ls.slug === lessonSlug
  );

  if (!activeLesson.completed) {
    await courseService.completeLesson(course._id, user._id, activeLesson._id);
    activeLesson.completed = true;
    activeSection.completedLessonsCount += 1;
    completedLessons.push(activeLesson._id);
  }

  if (count === completedLessons.length) {
    courseService.completeCourse(course._id, user._id);
  }

  const reviews = await courseService.getReviews(courseSlug);
  const reviewStats = await courseService.getReviewStats(course._id);
  const myReview = await courseService.getCourseReviewOfUser(
    course._id,
    user._id
  );
  const video = activeLesson.video
    ? await gcsService.getVideoSignedUrl(activeLesson.video.filename)
    : null;

  res.render('students/lesson', {
    title: course.name,
    layout: false,
    activeSection,
    activeLesson,
    course,
    video,
    reviews,
    reviewStats,
    myReview,
    progress: {
      total: count,
      completed: completedLessons.length,
      percentage: (completedLessons.length / count) * 100,
    },
  });
};

const getReviews = async (req, res, next) => {
  const { courseSlug } = req.params;
  const { skip, limit } = req.query;

  const reviews = await courseService.getReviews(courseSlug, skip, limit);

  const html = await hbs.render('src/views/partials/reviewItems.hbs', {
    reviews,
  });

  res.send(html);
};

const cudReview = async (req, res, next) => {
  const { courseSlug } = req.params;
  const { rating, review } = req.body;
  const { user } = req.session;

  const course = await courseService.getCourseDetail(courseSlug);

  if (!course) {
    res.redirect('/404');
    return;
  }

  if (!(await courseService.isEnrolled(course._id, user._id))) {
    res.redirect('/403');
    return;
  }

  const oldReview = await courseService.getCourseReviewOfUser(
    course._id,
    user._id
  );

  if (oldReview) {
    if (+rating === 0) {
      await Review.findByIdAndDelete(oldReview._id);
    } else {
      await Review.findByIdAndUpdate(oldReview._id, {
        rating,
        review,
      });
    }
  } else {
    await Review.create({
      course: course._id,
      owner: user._id,
      rating,
      review,
    });
  }

  res.redirect(req.headers.referer || `/courses/${courseSlug}/lessons`);
};

const getCheckoutPage = async (req, res, next) => {
  const { slug } = req.params;
  const { user } = req.session;
  if (!user) {
    res.redirect('/login');
    return;
  }
  const course = await Course.findOne({ slug });

  if (!course) {
    res.redirect('/404');
    return;
  }

  const isEnrolled = await courseService.isEnrolled(course._id, user._id);

  if (isEnrolled) {
    res.redirect(`/courses/${course.slug}/lessons`);
    return;
  }

  const media = course.coverPhoto
    ? await Media.findById(course.coverPhoto)
    : null;
  let thumbnail = null;
  if (media) {
    if (media.type === 'image') {
      thumbnail = {
        type: 'image',
        url: gcsService.getPublicImageUrl(media.filename),
      };
    }
    if (media.type === 'video') {
      thumbnail = {
        type: 'video',
        url: await gcsService.getVideoSignedUrl(media.filename),
      };
    }
  }
  res.render('courses/checkout', {
    title: `Check out | ${course.name}`,
    data: {
      ...course.toObject(),
      thumbnail,
    },
  });
};

const enrollCourse = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { user } = req.session;
    if (!user) {
      res.redirect('/login');
      return;
    }
    const course = await Course.findOne({ slug });

    if (!course) {
      res.redirect('/404');
      return;
    }

    if (!user) {
      res.redirect('/login');
    }

    const isEnrolled = await courseService.isEnrolled(course._id, user._id);

    if (isEnrolled) {
      res.redirect(`/courses/${course.slug}/lessons`);
      return;
    }

    const enrollment = await Enrollment.create({
      course: course._id,
      student: user._id,
    });

    enrollment.save();

    res.redirect(`/courses/${course.slug}/lessons`);
  } catch (error) {
    console.log(error);
    res.redirect('/500');
  }
};

const getCourseCategoryView = async (req, res, next) => {
  const { categorySlug } = req.params;
  const { sortBy, page, limit } = req.query;

  const getSortBy = (sort) => {
    if (sort === 'highest-rated') return (a, b) => b.avgRating - a.avgRating;
    if (sort === 'newest') return (a, b) => b.createdAt - a.createdAt;
    return (a, b) => b.views - a.views;
  };

  const category = await Category.findOne({ slug: categorySlug }).populate(
    'subcategories'
  );

  const { subcategories } = category;

  const totalCourses = await Course.countDocuments({
    category: { $in: subcategories },
    isDeleted: {
      $ne: true,
    },
  });
  const limitPerPage = +limit || 6;
  const totalPages = Math.ceil(totalCourses / limitPerPage);
  const currentPage = +page || 1;
  const skip = (currentPage - 1) * limitPerPage;

  let courses = await Course.find({
    category: { $in: subcategories },
    isDeleted: {
      $ne: true,
    },
  })
    .populate('category')
    .populate('instructor')
    .populate('coverPhoto')
    .lean();

  const newestCourses = await courseService.getNewestCourses(6);
  const mostPopularCourses = await courseService.getMostPopularCourses(6);
  const highestRatedCourses = await courseService.getHighestRatedCourses(6);

  courses = await Promise.all(
    courses.map(async (course) => {
      const { _id } = course;
      const { avg, total } = await courseService.getReviewStats(_id);

      return {
        ...course,
        avgRating: avg,
        totalRatings: total,
        newest: newestCourses.some((c) => c._id.toString() === _id.toString()),
        mostPopular: mostPopularCourses.some(
          (c) => c._id.toString() === _id.toString()
        ),
        highestRated: highestRatedCourses.some(
          (c) => c._id.toString() === _id.toString()
        ),
      };
    })
  );

  courses = courses.sort(getSortBy(sortBy)).slice(skip, skip + limitPerPage);

  res.render('students/category', {
    title: category.name,
    url: req.originalUrl.split('?').shift(),
    courses,
    sortBy,
    currentPage,
    totalCourses,
    totalPages,
  });
};

const getCourseSubcategoryView = async (req, res, next) => {
  const { subcategorySlug } = req.params;
  const { sortBy, page, limit } = req.query;

  const getSortBy = (sort) => {
    if (sort === 'highest-rated') return (a, b) => b.avgRating - a.avgRating;
    if (sort === 'newest') return (a, b) => b.createdAt - a.createdAt;
    return (a, b) => b.views - a.views;
  };

  const subcategory = await Subcategory.findOne({ slug: subcategorySlug });

  const totalCourses = await Course.countDocuments({
    category: subcategory,
  });
  const limitPerPage = +limit || 6;
  const totalPages = Math.ceil(totalCourses / limitPerPage);
  const currentPage = +page || 1;
  const skip = (currentPage - 1) * limitPerPage;

  let courses = await Course.find({
    category: subcategory,
    isDeleted: {
      $ne: true,
    },
  })
    .populate('category')
    .populate('instructor')
    .populate('coverPhoto')
    .lean();

  const newestCourses = await courseService.getNewestCourses(6);
  const mostPopularCourses = await courseService.getMostPopularCourses(6);
  const highestRatedCourses = await courseService.getHighestRatedCourses(6);

  courses = await Promise.all(
    courses.map(async (course) => {
      const { _id } = course;
      const { avg, total } = await courseService.getReviewStats(_id);

      return {
        ...course,
        avgRating: avg,
        totalRatings: total,
        newest: newestCourses.some((c) => c._id.toString() === _id.toString()),
        mostPopular: mostPopularCourses.some(
          (c) => c._id.toString() === _id.toString()
        ),
        highestRated: highestRatedCourses.some(
          (c) => c._id.toString() === _id.toString()
        ),
      };
    })
  );

  courses = courses.sort(getSortBy(sortBy)).slice(skip, skip + limitPerPage);

  res.render('students/category', {
    title: subcategory.name,
    url: req.originalUrl.split('?').shift(),
    courses,
    sortBy,
    currentPage,
    totalCourses,
    totalPages,
  });
};

const getSearchCourseView = async (req, res, next) => {
  const { q, sortBy, page, limit } = req.query;

  if (q === undefined) {
    res.redirect('/search?q=');
    return;
  }

  let courses = await Course.find({
    $text: { $search: q, $caseSensitive: false },
    isDeleted: {
      $ne: true,
    },
  })
    .populate(['instructor', 'coverPhoto'])
    .lean();

  const totalCourses = courses.length;
  const limitPerPage = +limit || 6;
  const totalPages = Math.ceil(totalCourses / limitPerPage);
  const currentPage = +page || 1;
  const skip = (currentPage - 1) * limitPerPage;

  const getSortBy = (sort) => {
    if (sort === 'highest-rated') return (a, b) => b.avgRating - a.avgRating;
    if (sort === 'newest') return (a, b) => b.createdAt - a.createdAt;
    if (sort === 'most-popular') return (a, b) => b.views - a.views;

    // eslint-disable-next-line no-unused-vars
    return (a, b) => 0;
  };

  const newestCourses = await courseService.getNewestCourses(6);
  const mostPopularCourses = await courseService.getMostPopularCourses(6);
  const highestRatedCourses = await courseService.getHighestRatedCourses(6);

  courses = await Promise.all(
    courses.map(async (course) => {
      const { _id } = course;
      const { avg, total } = await courseService.getReviewStats(_id);

      return {
        ...course,
        avgRating: avg,
        totalRatings: total,
        newest: newestCourses.some((c) => c._id.toString() === _id.toString()),
        mostPopular: mostPopularCourses.some(
          (c) => c._id.toString() === _id.toString()
        ),
        highestRated: highestRatedCourses.some(
          (c) => c._id.toString() === _id.toString()
        ),
      };
    })
  );

  courses = courses.sort(getSortBy(sortBy)).slice(skip, skip + limitPerPage);

  const originalUrl = req.originalUrl.split('?').shift();

  res.render('students/search', {
    title: `Search results for "${q}"`,
    url: `${originalUrl}?q=${encodeURIComponent(q)}`,
    courses,
    sortBy,
    currentPage,
    totalCourses,
    totalPages,
    q,
  });
};

export default {
  getCourseDetailView,
  getCourseDetail,
  getRelatedCourses,
  getLessonView,
  getReviews,
  cudReview,
  getCheckoutPage,
  enrollCourse,
  getCourseCategoryView,
  getCourseSubcategoryView,
  getSearchCourseView,
};
