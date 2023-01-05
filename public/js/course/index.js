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

$(document).ready(function () {
  const courseId = window.location.pathname.split('/')[2];
  axios.get('/api/v1/courses/' + courseId).then((response) => {
    const { data } = response;
    const { category, subcategory, name, briefDescription, reviews, enrollments, instructor, updatedAt, sections } = data;

    console.log(data);

    // header
    createBreadcrumb(category, subcategory, name);
    createTitle(name);
    createBriefDescription(briefDescription);
    createReviews(reviews, enrollments);
    createCourseInstructor(instructor);
    createUpdateTime(updatedAt);

    // body
    createSectionLesson(sections);
  });
});