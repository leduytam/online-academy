$(document).ready(function () {
  $('#users-list thead tr')
    .clone(true)
    .addClass('filters')
    .appendTo('#users-list thead');

  $('#users-list').DataTable({
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
          var cell = $('.filters th').eq(
            $(api.column(colIdx).header()).index()
          );
          var title = $(cell).text();
          $(cell).html('<input type="text" placeholder="' + title + '" />');

          $(
            'input',
            $('.filters th').eq($(api.column(colIdx).header()).index())
          )
            .off('keyup change')
            .on('change', function (e) {
              // Get the search value
              $(this).attr('title', $(this).val());
              var regexr = '({search})';

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
    url: `/api/v1/admin/delete-user/${id}`,
    type: 'POST',
    success: function (result) {
      window.location.reload();
    },
  });
});

$(document).on('click', '.restore-user-button', function () {
  const id = $(this).data('id');
  $.ajax({
    url: `/api/v1/admin/delete-user/${id}`,
    type: 'POST',
    success: function (result) {
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
      $('#user-info-id').text(`#${result.data._id}`);
      $('#user-info-email').text(`${result.data.email}`);
      $('#user-info-name').text(`${result.data.name}`);
      $('#user-info-role').text(`${result.data.role}`);
      $('#user-info-isDeleted').empty();
      $('#user-info-isDeleted').append(
        `
          ${
            result.data.isDeleted
              ? `<span class="badge bg-danger">Deleted</span>`
              : `<span class="badge bg-success">Active</span>`
          }
        `
      );
      $('#user-info-updatedAt').text(
        `Updated at: ${new Date(result.data.updatedAt).toLocaleString()}`
      );
      $('#user-info-courses').empty();
      result.data.courses.forEach((course) => {
        $('#user-info-courses').append(
          `<li class="list-group-item">
            <div class="card">
            <div class="card-body">
              <h5 class="card-title">${course.name}</h5>
              <h6 class="card-subtitle mb-2 text-muted">${course.briefDescription}</h6>
              <p class="card-text">${course.slug}</p>
              <a href="#" class="card-link">Visit course</a>
            </div>
        </div>
          
          </li>`
        );
      });
    },
  });
});
