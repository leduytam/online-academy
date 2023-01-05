const createBreadcrumb = (category, subcategory, name) => {
  const breadcrumb = document.getElementById('course-header-breadcrumb');
  const color = "#cec0fc";
  // make the background transparent
  breadcrumb.style.background = 'transparent';
  // no underline for all links
  breadcrumb.innerHTML = `
    <li class="breadcrumb-item">
      <a class="text-decoration-none fw-bold" style="color: ${color}" href="/courses/${category.slug}">${category.name}</a>
    </li>
    <li class="breadcrumb-item">
      <a class="text-decoration-none fw-bold" style="color: ${color}" href="/courses/${category.slug}/${subcategory.slug}">${subcategory.name}</a>
    </li>
    <li class="breadcrumb-item active" aria-current="page">
      <span class="fw-bold" style="color: ${color}">${name}</span>
    </li>
  `;
  
}

const createTitle = (title) => {
  const courseTitle = document.getElementById('course-header-title');
  courseTitle.innerHTML = title;
}

const createBriefDescription = (briefDescription) => {
  const briefDescriptionElement = document.getElementById('course-header-brief-description');
  briefDescriptionElement.innerHTML = briefDescription;
}

const createReviews = (reviews, enrollments) => {
  const color = "#f3ca8c"
  const ratings = reviews.map((review) => review.rating);
  const averageRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
  const startNotFilled = `<i class="bi bi-star ms-1"></i>`;
  const startFilled = `<i class="bi bi-star-fill ms-1"></i>`;
  const startHalfFilled = `<i class="bi bi-star-half ms-1"></i>`;
  const roundedAverageRating = Math.round(averageRating * 2) / 2.0;
  
  const averageRatingElement = document.getElementById('course-header-average-rating');
  const ratingStarsElement = document.getElementById('course-header-rating-stars');
  ratingStarsElement.style.color = color;
  const ratingCountElement = document.getElementById('course-header-total-ratings');
  const enrollmentCountElement = document.getElementById('course-header-enrollments');


  averageRatingElement.innerHTML = `
    <span class="fw-bold" style="color: ${color}">${roundedAverageRating}</span>
  `
  ratingStarsElement.innerHTML = `
    ${startFilled.repeat(Math.floor(roundedAverageRating))}${startHalfFilled.repeat(Math.ceil(roundedAverageRating) - Math.floor(roundedAverageRating))}${startNotFilled.repeat(5 - Math.ceil(roundedAverageRating))}
  `
  ratingCountElement.innerHTML = `
    (${reviews.length} ratings)
  `
  enrollmentCountElement.innerHTML = `
    ${enrollments.length} students
  `
  
}

const createCourseInstructor = (instructor) => {
  const courseInstructorElement = document.getElementById('course-header-instructor');
  const color = "#cec0fc";
  courseInstructorElement.innerHTML = `
    Created by <a href="#" class="text-decoration-none fw-bold" style="color: ${color}">${instructor.name}</a>
  `
}

const createUpdateTime = (updatedAt) => {
  const courseUpdateTimeElement = document.getElementById('course-header-updated-at');
  courseUpdateTimeElement.innerHTML = `
    Last updated ${new Date(updatedAt).toLocaleDateString()}
  `
}


$(document).ready(function () {
  const courseId = window.location.pathname.split('/')[2];
  axios.get('/api/v1/courses/' + courseId).then((response) => {
    const { data } = response;
    const { category, subcategory, name, briefDescription, reviews, enrollments, instructor, updatedAt } = data;
    // console.log(data)
    createBreadcrumb(category, subcategory, name);
    createTitle(name);
    createBriefDescription(briefDescription);
    createReviews(reviews, enrollments);
    createCourseInstructor(instructor);
    createUpdateTime(updatedAt);
  });
});