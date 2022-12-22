$(document).ready(function () { $('#users-list').DataTable(); });

$(document).on('click', '.open-delete-modal', function () { 
  const id =$(this).data('id'); 
  const email = $(this).data('email');
  $('#delete-user-id').text(`Id: #${id}`); 
  $('#delete-user-email').text(`Email:${email}`); 
});