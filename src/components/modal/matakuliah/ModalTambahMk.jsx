/* eslint-disable react/prop-types */
import { XMarkIcon } from '@heroicons/react/24/solid';
import { createMataKuliah } from '../../../api/matakuliah';
import { alertFailed, alertSuccess } from '../../../utils/alert';

export default function ModalTambahMk({ close, render, activeObe }) {
  const dataInput = { obe_id: activeObe.id };
  const validation = () => {
    if (dataInput.kode_mk === undefined || dataInput.kode_mk === '') {
      console.log('Kode tidak boleh kosong');
      return false;
    } else if (dataInput.nama === undefined || dataInput.nama === '') {
      console.log('Nama tidak boleh kosong');
      return false;
    } else if (
      dataInput.deskripsi === undefined ||
      dataInput.deskripsi === ''
    ) {
      console.log('Deskripsi tidak boleh kosong');
      return false;
    } else if (dataInput.sks === undefined || dataInput.sks === 0) {
      console.log('SKS tidak boleh kosong');
      return false;
    } else if (dataInput.semester === undefined || dataInput.semester === 0) {
      console.log('Semester tidak boleh kosong');
      return false;
    } else if (
      dataInput.prasyarat === undefined ||
      dataInput.prasyarat === ''
    ) {
      console.log('Prasyarat tidak boleh kosong');
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
        const res = await createMataKuliah(dataInput);
        if (res) {
          alertSuccess('Berhasil menambah data');
          render();
          close();
        }
      } catch (e) {
        alertFailed('Gagal menambah data');
      }
    }
  };
  const handleChange = (target) => {
    if (target.name === 'nama') {
      dataInput.nama = target.value.toUpperCase();
    } else if (target.name === 'kode_mk') {
      dataInput.kode_mk = target.value;
    } else if (target.name === 'deskripsi') {
      dataInput.deskripsi = target.value;
    } else if (target.name === 'sks') {
      dataInput.sks = parseInt(target.value);
    } else if (target.name === 'semester') {
      dataInput.semester = parseInt(target.value);
    } else if (target.name === 'prasyarat') {
      dataInput.prasyarat = target.value;
    }
  };
  return (
    <div className="flex justify-center items-center fixed top-0 bottom-0 left-0 right-0 bg-black/50">
      <div className="relative block w-1/3 max-h-full rounded-lg bg-white p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]">
        <div
          onClick={close}
          className="absolute top-2 right-2 hover:cursor-pointer"
        >
          <XMarkIcon className="w-8" />
        </div>
        <h5 className="my-2 text-xl font-medium leading-tight text-neutral-800 dark:text-neutral-50">
          Tambah Mata Kuliah
        </h5>
        <form
          action=""
          onSubmit={handleSubmit}
          className="overflow-y-auto max-h-96"
        >
          <div className="mb-2">
            <label
              htmlFor="kode_mk"
              className="block mb-1 text-sm font-medium text-gray-900"
            >
              Kode Mata Kuliah
            </label>
            <input
              onChange={({ target }) => handleChange(target)}
              name="kode_mk"
              id="kode_mk"
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Masukkan kode mata kuliah"
              required
            />
          </div>
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
              placeholder="Masukkan nama mata kuliah"
              required
            />
          </div>
          <div className="mb-2">
            <label
              htmlFor="deskripsi"
              className="block mb-1 text-sm font-medium text-gray-900"
            >
              Deskripsi
            </label>
            <textarea
              name="deskripsi"
              id="deskripsi"
              onChange={({ target }) => handleChange(target)}
              cols="30"
              rows="10"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Masukkan deskripsi mata kuliah"
              required
            ></textarea>
          </div>
          <div className="mb-2">
            <label
              htmlFor="sks"
              className="block mb-1 text-sm font-medium text-gray-900"
            >
              Jumlah SKS
            </label>
            <input
              onChange={({ target }) => handleChange(target)}
              name="sks"
              id="sks"
              type="number"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Masukkan jumlah SKS"
              required
            />
          </div>
          <div className="mb-2">
            <label
              htmlFor="semester"
              className="block mb-1 text-sm font-medium text-gray-900"
            >
              Semester
            </label>
            <input
              onChange={({ target }) => handleChange(target)}
              name="semester"
              id="semester"
              type="number"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Masukkan semester"
              required
            />
          </div>
          <div className="mb-2">
            <label
              htmlFor="prasyarat"
              className="block mb-1 text-sm font-medium text-gray-900"
            >
              Prasyarat
            </label>
            <textarea
              name="prasyarat"
              id="prasyarat"
              onChange={({ target }) => handleChange(target)}
              cols="30"
              rows="10"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Masukkan prasyarat, isikan (-) jika tidak ada"
              required
            ></textarea>
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
