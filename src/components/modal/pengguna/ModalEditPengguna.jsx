/* eslint-disable react/prop-types */
import { XMarkIcon } from '@heroicons/react/24/solid';
import { updateUser } from '../../../api/user';

export default function ModalEditPengguna({ close, render, data }) {
  const dataInput = {
    nama: data.nama,
    kode_dosen: data.kode_dosen,
    email: data.email,
  };

  const validation = () => {
    if (dataInput.nama === undefined || dataInput.nama === '') {
      console.log('Nama tidak boleh kosong');
      return false;
    } else if (
      dataInput.kode_dosen === undefined ||
      dataInput.kode_dosen === ''
    ) {
      console.log('Kode dosen tidak boleh kosong');
      return false;
    } else if (dataInput.email === undefined || dataInput.email === '') {
      console.log('Email tidak boleh kosong');
      return false;
    }
    return true;
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validation) {
      return;
    } else {
      try {
        const res = await updateUser(dataInput, data.id);
        if (res) {
          render();
          close();
        }
      } catch (e) {
        console.error(e);
      }
    }
  };
  const handleChange = (target) => {
    if (target.name === 'email') {
      dataInput.email = target.value;
    } else if (target.name === 'password') {
      dataInput.password = target.value;
    } else if (target.name === 'kode_dosen') {
      dataInput.kode_dosen = target.value.toUpperCase();
    } else if (target.name === 'nama') {
      dataInput.nama = target.value;
    }
  };
  return (
    <div className="flex justify-center items-center fixed top-0 bottom-0 left-0 right-0 bg-black/50">
      <div className="relative w-1/3 rounded-lg bg-white p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]">
        <div
          onClick={close}
          className="absolute top-2 right-2 hover:cursor-pointer"
        >
          <XMarkIcon className="w-8" />
        </div>
        <h5 className="my-2 text-xl font-medium leading-tight text-neutral-800 dark:text-neutral-50">
          Edit Pengguna
        </h5>
        <form action="" onSubmit={handleSubmit} className="overflow-auto">
          <div className="mb-2">
            <label
              htmlFor="nama"
              className="block mb-1 text-sm font-medium text-gray-900"
            >
              Nama
            </label>
            <input
              onChange={({ target }) => handleChange(target)}
              name="nama"
              id="nama"
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Masukkan nama"
              defaultValue={data.nama}
              required
            />
          </div>
          <div className="mb-2">
            <label
              htmlFor="kode_dosen"
              className="block mb-1 text-sm font-medium text-gray-900"
            >
              Kode Dosen
            </label>
            <input
              onChange={({ target }) => handleChange(target)}
              name="kode_dosen"
              id="kode_dosen"
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Masukkan kode dosen"
              defaultValue={data.kode_dosen}
              required
            />
          </div>
          <div className="mb-2">
            <label
              htmlFor="email"
              className="block mb-1 text-sm font-medium text-gray-900"
            >
              Email
            </label>
            <input
              onChange={({ target }) => handleChange(target)}
              name="email"
              id="email"
              type="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Masukkan email"
              defaultValue={data.email}
              required
            />
          </div>
          <div className="mb-2">
            <label
              htmlFor="password"
              className="block mb-1 text-sm font-medium text-gray-900"
            >
              Password
            </label>
            <input
              onChange={({ target }) => handleChange(target)}
              name="password"
              id="password"
              type="password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Masukkan password (boleh tidak diisi)"
            />
          </div>
          <div className="flex justify-center mt-3">
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              Buat
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
