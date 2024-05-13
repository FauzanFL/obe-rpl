/* eslint-disable react/prop-types */
import { XMarkIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import { alertFailed, alertSuccess } from '../../../utils/alert';
import { createKelas } from '../../../api/kelas';

export default function ModalTambahKelas({ close, render }) {
  const [errStatus, setErrStatus] = useState({});
  const [errors, setErrors] = useState({});
  const [dataInput, setDataInput] = useState({
    kode_kelas: '',
  });

  const handleChange = (target) => {
    const helper = { ...dataInput };
    if (target.name === 'kode_kelas') {
      helper.kode_kelas = target.value;
      setDataInput(helper);
    }
  };

  const validation = () => {
    const error = {};
    const errStat = {};
    let status = true;

    if (dataInput.kode_kelas === '') {
      error.kode_kelas = 'kode kelas tidak boleh kosong';
      errStat.kode_kelas = true;
      status = false;
    }

    setErrStatus(errStat);
    setErrors(error);
    return status;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validation()) {
      try {
        const res = await createKelas(dataInput);
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
  return (
    <div className="flex justify-center items-center z-50 fixed top-0 bottom-0 left-0 right-0 bg-black/50">
      <div className="relative w-full md:w-1/2 lg:w-1/3 m-4 rounded-lg bg-white p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]">
        <div
          onClick={close}
          className="absolute top-2 right-2 hover:cursor-pointer"
        >
          <XMarkIcon className="w-8" />
        </div>
        <h5 className="my-2 text-xl font-medium leading-tight text-neutral-800">
          Tambah Kelas
        </h5>
        <form action="" onSubmit={handleSubmit} className="overflow-auto">
          <div className="mb-2">
            <label
              htmlFor="kode_kelas"
              className="block mb-1 text-sm font-medium text-gray-900"
            >
              Kode Kelas
            </label>
            <input
              onChange={({ target }) => handleChange(target)}
              name="kode_kelas"
              id="kode_kelas"
              type="text"
              className={`bg-gray-50 border ${
                errStatus.kode_kelas ? 'border-red-500' : 'border-gray-300'
              } text-gray-900 text-sm rounded-lg block w-full p-2.5`}
              placeholder="Masukkan kode kelas"
              required
            />
            {errStatus.kode_kelas && (
              <span className="text-red-500 text-sm">{errors.kode_kelas}</span>
            )}
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
