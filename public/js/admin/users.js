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
