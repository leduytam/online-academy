$(document).ready(function () { $('#users-list').DataTable(); });

$(document).on('click', '.open-delete-modal', function () { 
  const id = $(this).data('id'); 
  const email = $(this).data('email'); 

  $('#delete-user-id').text(`Id: #${id}`); 
  $('#delete-user-email').text(`Email:${email}`); 
}); 

$(document).on('click', '#delete-user-confirm', function () {
  const id = $('#delete-user-id').text().split('#')[1]; 
  $.ajax({ 
    url:`/api/v1/admin/delete-user/${id}`, 
    type: 'POST', 
    success: function (result) {
      window.location.reload(); 
    }, 
  }); 
}); 

$(document).on('click','.restore-user-button', function () { 
  const id = $(this).data('id'); 
  $.ajax({
    url: `/api/v1/admin/delete-user/${id}`, 
    type: 'POST', 
    success: function(result) { 
      window.location.reload(); 
    }, 
  }); 
});

$(document).on('click', '.open-user-info-modal', function () {
  const id = $(this).data('id');
  $.ajax({
    url: `/api/v1/admin/users/${id}`,
    type: 'GET',
    success: function (result) {
      $('#user-info-id').text(`Id: #${result.data._id}`);
      $('#user-info-email').text(`Email: ${result.data.email}`);
      $('#user-info-name').text(`Name: ${result.data.name}`);
      $('#user-info-role').text(`Role: ${result.data.role}`);
      $('#user-info-isDeleted').text(`Is deleted: ${result.data.isDeleted}`);
      $('#user-info-updatedAt').text(`Updated at: ${result.data.updatedAt}`);
    },
  });
});
