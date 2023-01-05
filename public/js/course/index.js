$(document).ready(function () {
  // get course id from url
  const courseId = window.location.pathname.split('/')[2];
  // send axios request to get course info
  axios.get('/api/v1/courses/' + courseId).then((response) => {
    console.log(response.data);
  });
});