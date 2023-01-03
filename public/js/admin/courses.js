$(document).ready(function () {
  $('#courses-list thead tr')
      .clone(true)
      .addClass('filters')
      .appendTo('#courses-list thead');

  $('#courses-list').DataTable({
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

$(document).on('click', '.open-course-info-modal', function () {
    const id = $(this).data('id');
    $.ajax({
      url: `/api/v1/admin/courses/${id}`,
      type: 'GET',
      success: function (result) {
        $('#course-info-id').text(`#${result.data._id}`);
        $('#course-info-name').text(`${result.data.name}`);
        $('#course-info-instructor').text(`${result.data.instructor.name}`);
        $('#course-info-instructor').attr('href', `/users/${result.data.instructor._id}`);
        $('#course-info-slug').text(`${result.data.slug}`);
        $('#course-info-views').text(`${result.data.views}`);
        $('#course-info-brief-description').text(`${result.data.briefDescirption}`);
        $('#course-info-detail-description').html(`${result.data.detailDescription}`).contents();
        $('#course-info-price').text(`${result.data.price}`);
        $('#course-info-category').text(`${result.data.subCategory.name}`);
        $('#course-info-updatedAt').text(`Updated at: ${new Date(result.data.updatedAt).toLocaleString()}`);

      },
    });
  });
  