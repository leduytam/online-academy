import axios from 'axios';

$(document).ready(function () {
  console.log('ready >>>>>>>>>>>');
  $('#users-table').DataTable({
    ajax(data, callback, settings) {
      const currentPage =
        Math.ceil(settings._iDisplayStart / settings._iDisplayLength) + 1;
      axios
        .get(`/api/v1/admin/users?limit=20&page=${currentPage}`)
        .then((res) => {
          const tmpJson = {
            recordsTotal: res.data.totalPages * 20,
            recordsFiltered: res.data.totalPages * 20,
            data: res.data.data,
            currentPage: res.data.currentPage,
          };
          callback(tmpJson);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    dom: 'Bfrtip',
    displayStart: 0,
    serverSide: true,
    pageLength: 20,
    processing: true,
    bLengthChange: false,
    columns: [
      {
        data: '_id',
        render(data, type, row) {
          return data;
        },
      },
      {
        data: 'name',
        render(data, type, row) {
          return data;
        },
      },
      {
        data: 'email',
        render(data, type, row) {
          return data;
        },
      },
      {
        data: 'mobile',
        render(data, type, row) {
          return data;
        },
      },
      {
        data: '_id',
        render(data, type, row) {
          return `<a class="btn btn-primary btn-sm"
                href="/edit_seller/${data}">Edit</a> <a class="btn btn-danger btn-sm"
                href="/delete_seller/${data}">Delete</a>
                `;
        },
      },
    ],
  });
});
