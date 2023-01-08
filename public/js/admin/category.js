const editCategory = (id) => {
  $.ajax({
    url: `/api/v1/admin/categories/${id}/update-category`,
    type: 'POST',
    data: {
      name: $('#category-name-' + id).val(),
    },
    success: (res) => {
      if (res.status) {
        location.reload();
      } else {
        alert(res.message);
      }
    },
    error: (err) => {
      alert(err.message);
    }
  });
};

const removeCategory = (id) => {
  $.ajax({
    url: `/api/v1/admin/categories/${id}/delete-category`,
    type: 'POST',
    success: (res) => {
      if (res.status) {
        location.reload();
      } else {
        alert(res.message);
      }
    },
    error: (err) => {
      console.error(err);
      alert(err.message);
    }
  });
}