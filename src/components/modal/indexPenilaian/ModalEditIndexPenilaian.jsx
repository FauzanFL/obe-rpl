/* eslint-disable react/prop-types */
import { XMarkIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import { alertFailed, alertSuccess } from '../../../utils/alert';
import { updateIndexPenilaian } from '../../../api/indexPenilaian';

export default function ModalEditIndexPenilaian({ close, render, data }) {
  const [errStatus, setErrStatus] = useState({});
  const [errors, setErrors] = useState({});
  const [dataInput, setDataInput] = useState({
    grade: data.grade,
    batas_awal: data.batas_awal,
    batas_akhir: data.batas_akhir,
  });

  const handleChange = (target) => {
    const helper = { ...dataInput };
    if (target.name === 'grade') {
      helper.grade = target.value;
      setDataInput(helper);
    } else if (target.name === 'batas_awal') {
      helper.batas_awal = parseFloat(target.value);
      setDataInput(helper);
    } else if (target.name === 'batas_akhir') {
      helper.batas_akhir = parseFloat(target.value);
      setDataInput(helper);
    }
  };

  const validation = () => {
    const error = {};
    const errStat = {};
    let status = true;

    if (dataInput.grade === '') {
      error.grade = 'grade tidak boleh kosong';
      errStat.grade = true;
      status = false;
    }

    if (dataInput.batas_akhir === 0) {
      error.batas_akhir = 'batas akhir tidak boleh kosong';
      errStat.batas_akhir = true;
      status = false;
    } else if (
      dataInput.batas_awal != undefined &&
      dataInput.batas_akhir < dataInput.batas_awal
    ) {
      error.batas_akhir = 'batas akhir tidak boleh kurang dari batas awal';
      errStat.batas_akhir = true;
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
        const res = await updateIndexPenilaian(dataInput, data.id);
        if (res) {
          alertSuccess('Berhasil memperbarui data');
          render();
          close();
        }
      } catch (e) {
        alertFailed('Gagal memperbarui data');
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
        <h5 className="my-2 text-xl font-medium leading-tight text-neutral-800 dark:text-neutral-50">
          Edit Index Penilaian
        </h5>
        <form action="" onSubmit={handleSubmit} className="overflow-auto">
          <div className="mb-2">
            <label
              htmlFor="grade"
              className="block mb-1 text-sm font-medium text-gray-900"
            >
              Grade
            </label>
            <input
              onChange={({ target }) => handleChange(target)}
              name="grade"
              id="grade"
              type="text"
              className={`bg-gray-50 border ${
                errStatus.grade ? 'border-red-500' : 'border-gray-300'
              } text-gray-900 text-sm rounded-lg block w-full p-2.5`}
              placeholder="ex: A"
              defaultValue={data.grade}
              required
            />
            {errStatus.grade && (
              <span className="text-red-500 text-sm">{errors.grade}</span>
            )}
          </div>
          <div className="mb-2">
            <label
              htmlFor="batas_awal"
              className="block mb-1 text-sm font-medium text-gray-900"
            >
              Batas Awal
            </label>
            <input
              onChange={({ target }) => handleChange(target)}
              name="batas_awal"
              id="batas_awal"
              type="number"
              step="0.01"
              className={`bg-gray-50 border ${
                errStatus.batas_awal ? 'border-red-500' : 'border-gray-300'
              } text-gray-900 text-sm rounded-lg block w-full p-2.5`}
              defaultValue={data.batas_awal}
              required
            />
            {errStatus.batas_awal && (
              <span className="text-red-500 text-sm">{errors.batas_awal}</span>
            )}
          </div>
          <div className="mb-2">
            <label
              htmlFor="batas_akhir"
              className="block mb-1 text-sm font-medium text-gray-900"
            >
              Batas Akhir
            </label>
            <input
              onChange={({ target }) => handleChange(target)}
              name="batas_akhir"
              id="batas_akhir"
              type="number"
              step="0.01"
              className={`bg-gray-50 border ${
                errStatus.batas_akhir ? 'border-red-500' : 'border-gray-300'
              } text-gray-900 text-sm rounded-lg block w-full p-2.5`}
              defaultValue={data.batas_akhir}
              required
            />
            {errStatus.batas_akhir && (
              <span className="text-red-500 text-sm">{errors.batas_akhir}</span>
            )}
          </div>
          <div className="flex justify-center mt-3">
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
