const startNotFilled = `<i class="bi bi-star ms-1"></i>`;
const startFilled = `<i class="bi bi-star-fill ms-1"></i>`;
const startHalfFilled = `<i class="bi bi-star-half ms-1"></i>`;

const RatingStars = (rating) => {

  return (
  `
    ${startFilled.repeat(Math.floor(rating))}${startHalfFilled.repeat(Math.ceil(rating) - Math.floor(rating))}${startNotFilled.repeat(5 - Math.ceil(rating))}
  `)
}

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

const createRating = (reviews, enrollments) => {
  const color = "#f3ca8c"
  const ratings = reviews.map((review) => review.rating);
  const averageRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;

  const roundedAverageRating = Math.round(averageRating * 2) / 2.0;
  
  const averageRatingElement = document.getElementById('course-header-average-rating');
  const ratingStarsElement = document.getElementById('course-header-rating-stars');
  ratingStarsElement.style.color = color;
  const ratingCountElement = document.getElementById('course-header-total-ratings');
  const enrollmentCountElement = document.getElementById('course-header-enrollments');


  averageRatingElement.innerHTML = `
    <span class="fw-bold" style="color: ${color}">${roundedAverageRating}</span>
  `
  ratingStarsElement.innerHTML = RatingStars(roundedAverageRating);
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
  const courseUpdateTimeIconElement = document.getElementById('course-header-updated-at-icon');

  courseUpdateTimeElement.innerHTML = `
    Last updated ${new Date(updatedAt).toLocaleDateString()}
  `
  courseUpdateTimeIconElement.innerHTML = `
    <i class="bi bi-clock-history"></i>
  `
}

const createSectionLesson = (sections) => {
  const titleElement = document.getElementById('course-section-title');
  const descriptionElement = document.getElementById('course-section-description');

  titleElement.innerHTML = `Course content`;
  descriptionElement.innerHTML = `${sections.length} sections &#x2022; ${sections.reduce((a, b) => a + b.lessons.length, 0)} lessons`;

  const sectionsAccordionElement = document.getElementById('course-lessons-accordion');
  sections.forEach((section, index) => {
    const accordionItemElement = document.createElement('div');
    accordionItemElement.classList.add('accordion-item');

    const accordionHeaderElement = document.createElement('h2');
    accordionHeaderElement.classList.add('accordion-header');
    accordionHeaderElement.id = `course-lessons-accordion-header-${index}`;

    const accordionButtonElement = document.createElement('button');
    accordionButtonElement.classList.add('accordion-button');
    accordionButtonElement.type = 'button';
    accordionButtonElement.setAttribute('data-bs-toggle', 'collapse');
    accordionButtonElement.setAttribute('data-bs-target', `#course-lessons-accordion-item-collapse-${index}`);
    accordionButtonElement.setAttribute('aria-expanded', 'true');
    accordionButtonElement.setAttribute('aria-controls', `course-lessons-accordion-item-collapse-${index}`);

    accordionButtonElement.innerHTML = `
      <div class="d-flex justify-content-between w-100">
        <div class="fw-bold">${section.name}</div>
        <div class="fw-bold me-2">${section.lessons.length} lessons</div>
      </div>
    `

    accordionHeaderElement.appendChild(accordionButtonElement);
    accordionItemElement.appendChild(accordionHeaderElement);

    const accordionCollapseElement = document.createElement('div');
    accordionCollapseElement.id = `course-lessons-accordion-item-collapse-${index}`;
    accordionCollapseElement.classList.add('accordion-collapse');
    accordionCollapseElement.classList.add('collapse');
    accordionCollapseElement.setAttribute('aria-labelledby', `course-lessons-accordion-header-${index}`);

    const accordionBodyElement = document.createElement('div');
    accordionBodyElement.classList.add('accordion-body');
    accordionBodyElement.innerHTML = section.lessons.map((lesson, index) => {
      // left is name of lesson and check the preview to show the preview text on the right
      return `
        <div class="d-flex align-items-center my-3">
          <div class="me-2">
            <i class="bi bi-play-circle-fill ms-1"></i>
          </div>
          <div class="d-flex justify-content-between w-100">
            <a href="#" class="text-decoration-none text-dark">${lesson.name}</a>
            ${lesson.preview ? `<a href="#" class="text-muted">Preview</a>` : ''}
          </div>
        </div>
      `
    }).join('');

    accordionCollapseElement.appendChild(accordionBodyElement);
    accordionItemElement.appendChild(accordionCollapseElement);
  
    sectionsAccordionElement.appendChild(accordionItemElement);
  })

}

const createDetailDescription = (description) => {
  const descriptionElement = document.getElementById('course-detail-description');
  const descriptionTitleElement = document.getElementById('course-detail-description-title');
  descriptionTitleElement.innerHTML='Description';

  const showMoreButtonElement = document.createElement('button');
  showMoreButtonElement.classList.add('btn');
  showMoreButtonElement.classList.add('btn-outline-primary');
  showMoreButtonElement.classList.add('btn-sm');
  showMoreButtonElement.classList.add('mt-2');
  showMoreButtonElement.innerHTML = 'Show more';

  const descriptionContentElement= document.createElement('div');
  descriptionContentElement.innerHTML = description.slice(0, 200);
  descriptionContentElement.classList.add('mt-2');

  
  descriptionElement.appendChild(descriptionContentElement);
  descriptionElement.appendChild(showMoreButtonElement);

  showMoreButtonElement.addEventListener('click', () => {
    if (showMoreButtonElement.innerHTML === 'Show more') {
      descriptionContentElement.innerHTML = description;
      showMoreButtonElement.innerHTML = 'Show less';
    }
    else {
      descriptionContentElement.innerHTML = description.slice(0, 200);
      showMoreButtonElement.innerHTML = 'Show more';
    }
  })
}

const createPrice = (price) => {
  const priceElement = document.getElementById('course-price');
  priceElement.innerHTML = `
    <div class="d-flex align-items-center mt-3">
      <div class="me-2">
        <i class="bi bi-cash" style="font-size: 1.5rem;"></i>
      </div>
        <span class="fs-2 fw-bold">
          $${price}
        </span>
    </div>
  `
}

const createThumbnail = (thumbnail) => {
  const thumbnailElement = document.getElementById('course-thumbnail-video-container');
  if (thumbnail) {
    if (thumbnail.type === 'image') {
      thumbnailElement.innerHTML = `
        <img src="${thumbnail.url}" alt="course thumbnail" class="img-fluid">
      `
    }
    else if (thumbnail.type === 'video') {
      thumbnailElement.innerHTML = `
        <video src="${thumbnail.url}" controls class="img-fluid"></video>
      `
    }
  }
}

const createInstructor = (instructor) => {
  const instructorElement = document.getElementById('course-instructor');
  const instructorAvatarUrl = instructor.avatar ? instructor.avatar : `https://avatars.dicebear.com/api/miniavs/${instructor.email}.png`;
  instructorElement.innerHTML = `
    <div class="d-flex align-items-center">
      <div class="me-2">
        <a href="#">
          <img src="${instructorAvatarUrl}" alt="instructor avatar" class="rounded-circle" style="width: 7rem; height: auto;">
        </a>
      </div>
      <div>
        <div class="fw-bold">${instructor.name}</div>
        <div class="text-muted">${instructor.description || "Instructor's description"}</div>
      </div>
    </div>
  `
}

const createReviews = (reviews) => {
  const color = "#f3ca8c"
  const ratings = reviews.map((review) => review.rating);
  const averageRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
  const roundedAverageRating = Math.round(averageRating * 2) / 2.0;

  const reviewsTitleElement = document.getElementById('course-reviews-title');

  reviewsTitleElement.innerHTML = `
    <div class="d-flex align-items-baseline">
      <span style="color:${color}" class="me-1">
        ${startFilled}
      </span> 
      ${roundedAverageRating} course rating
      &#x2022;
      ${reviews.length} ratings
    </div>
  `

  // reviews element has the row class and show 2 reviews per row
  const reviewsElement = document.getElementById('course-reviews');
  reviewsElement.innerHTML = reviews.map((review) => {
    const reviewAvatarUrl = review.avatar ? review.avatar : `https://avatars.dicebear.com/api/miniavs/${review.owner}.png`;
    return `
      <div class="col-12 col-md-6">
        <div class="card mb-3">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="me-2">
                <img src="${reviewAvatarUrl}" alt="reviewer avatar" class="rounded-circle" style="width: 5rem; height: auto;">
              </div>
              <div>
                <div class="fw-bold">${review.owner}</div>
                <div class="text-muted fs-6">
                  ${review.rating}
                  <span style="color:${color}" class="me-1">
                    ${RatingStars(review.rating)}
                  </span>
                  ${review.createdAt}
                </div>
              </div>
            </div>
            <div class="mt-3">
              ${review.review}
            </div>
          </div>
        </div>
      </div>
    `
  }).join('');

}

$(document).ready(function () {
  $('#course-page-spinner').show();
  $('#course-page').hide();
  const courseId = window.location.pathname.split('/')[2];
  axios.get('/api/v1/courses/' + courseId).then((response) => {
    $('#course-page-spinner').css('display', 'none');
    // set style display to block for display the course page
    $('#course-page').css('display', 'block');

    const { data } = response;
    const { category, 
      subcategory, 
      name, 
      briefDescription, 
      reviews, 
      enrollments, 
      instructor, 
      updatedAt, 
      sections,
      price,
      thumbnail,
      detailDescription
    } = data;

    console.log(data);

    // header
    createBreadcrumb(category, subcategory, name);
    createTitle(name);
    createBriefDescription(briefDescription);
    createRating(reviews, enrollments);
    createCourseInstructor(instructor);
    createUpdateTime(updatedAt);
    createPrice(price);
    createThumbnail(thumbnail);

    // body
    createSectionLesson(sections);
    createDetailDescription(detailDescription)
    createInstructor(instructor);
    createReviews(reviews);
  });
});