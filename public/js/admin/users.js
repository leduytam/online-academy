$(document).ready(function () {
  // Setup - add a text input to each footer cell
  $('#users-list thead tr')
      .clone(true)
      .addClass('filters')
      .appendTo('#users-list thead');

  var table = $('#users-list').DataTable({
      orderCellsTop: true,
      fixedHeader: true,
      initComplete: function () {
          var api = this.api();
          let cursorPosition;
          // For each column
          api
              .columns()
              .eq(0)
              .each(function (colIdx) {
                  // Set the header cell to contain the input element
                  var cell = $('.filters th').eq(
                      $(api.column(colIdx).header()).index()
                  );
                  var title = $(cell).text();
                  $(cell).html('<input type="text" placeholder="' + title + '" />');

                  // On every keypress in this input
                  $(
                      'input',
                      $('.filters th').eq($(api.column(colIdx).header()).index())
                  )
                      .off('keyup change')
                      .on('change', function (e) {
                          // Get the search value
                          $(this).attr('title', $(this).val());
                          var regexr = '({search})'; //$(this).parents('th').find('select').val();

                          cursorPosition = this.selectionStart;
                          // Search the column for that value
                          api
                              .column(colIdx)
                              .search(
                                  this.value != ''
                                      ? regexr.replace('{search}', '(((' + this.value + ')))')
                                      : '',
                                  this.value != '',
                                  this.value == ''
                              )
                              .draw();
                      })
                      .on('keyup', function (e) {
                          e.stopPropagation();

                          $(this).trigger('change');
                          $(this)
                              .focus()[0]
                              .setSelectionRange(cursorPosition, cursorPosition);
                      });
              });
      },
  });
});

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
