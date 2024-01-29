import Swal from 'sweetalert2';
import 'animate.css';

export const alertSuccess = (msg) => {
  Swal.fire({
    title: msg,
    timer: 2000,
    icon: 'success',
    showClass: {
      popup: `
          animate__animated
          animate__zoomIn
          animate__faster
        `,
    },
    hideClass: {
      popup: `
          animate__animated
          animate__zoomOut
          animate__faster
        `,
    },
  });
};

export const alertFailed = (msg) => {
  Swal.fire({
    title: msg,
    icon: 'error',
    showCloseButton: true,
    showClass: {
      popup: `
            animate__animated
            animate__zoomIn
            animate__faster
          `,
    },
    hideClass: {
      popup: `
            animate__animated
            animate__zoomOut
            animate__faster
          `,
    },
  });
};

export const alertDelete = (next) => {
  Swal.fire({
    title: 'Apakah Anda yakin?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#b8b6b0',
    confirmButtonText: 'Ya, hapus!',
  }).then((res) => {
    if (res.isConfirmed) {
      next();
    }
  });
};
