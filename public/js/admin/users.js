$(document).ready(function () {
  $('#users_table').DataTable({
    ajax: function(data, callback, settings) {
      const currentPage =
        Math.ceil(settings._iDisplayStart / settings._iDisplayLength) + 1;
      axios
        .get(`/admin/api/v1/admin/users?limit=20&page=${currentPage}`)
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
    serverSide: true,
    processing: true,
    columns: [
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
        data: 'role',
        render(data, type, row) {
          return data;
        },
      },
      {
        data: 'createdAt',
        render(data, type, row) {
          return data;
        }
      },
      {
        data: 'updatedAt',
        render(data, type, row) {
          return data;
        }
      },
    ],
  });
});