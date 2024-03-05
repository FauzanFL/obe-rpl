import Swal from 'sweetalert2';
import 'animate.css';

export const alertSuccess = (msg) => {
  Swal.fire({
    title: msg,
    timer: 1000,
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

export const alertInfo = (msg) => {
  Swal.fire({
    title: msg,
    timer: 1500,
    icon: 'info',
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

export const alertActivate = (next) => {
  Swal.fire({
    title: 'Apakah Anda yakin?',
    text: 'Ini akan mempengaruhi keseluruhan OBE',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#16a34a',
    cancelButtonColor: '#b8b6b0',
    confirmButtonText: 'Ya, aktifkan!',
  }).then((res) => {
    if (res.isConfirmed) {
      next();
    }
  });
};

export const alertFinalization = (next) => {
  Swal.fire({
    title: 'Apakah Anda yakin?',
    text: 'Data yang telah difinalisasi tidak dapat diubah',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#1a5dc9',
    cancelButtonColor: '#b8b6b0',
    confirmButtonText: 'Ya, finalisasi!',
  }).then((res) => {
    if (res.isConfirmed) {
      next();
    }
  });
};
