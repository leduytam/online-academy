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
        data: '_id',
        name: '_id',
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
      {
        data: '_id',
        render(data, type, row) {
          return (
            `
            <a
              type='button'
              class='btn btn-warning btn-rounded btn-sm fw-bold'
              data-mdb-ripple-color='dark'
            >
            Edit
          </a>
            <button
            type='button'
            class='btn btn-danger btn-rounded btn-sm fw-bold'
            data-mdb-ripple-color='dark'
          >
            Delete
          </button>
          <button
            type='button'
            class='btn btn-link btn-rounded btn-sm fw-bold'
            data-mdb-ripple-color='dark'
          >
            Review
          </button>`
          )
        }
      }
    ],
  });
});