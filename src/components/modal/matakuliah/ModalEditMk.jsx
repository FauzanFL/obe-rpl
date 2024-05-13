/* eslint-disable react/prop-types */
import { XMarkIcon } from '@heroicons/react/24/solid';
import { updateMataKuliah } from '../../../api/matakuliah';
import { alertFailed, alertSuccess } from '../../../utils/alert';
import { useState } from 'react';

export default function ModalEditMk({ close, render, listTahunAjaran, data }) {
  const [errStatus, setErrStatus] = useState({});
  const [errors, setErrors] = useState({});
  const [dataInput, setDataInput] = useState({
    kode_mk: data.kode_mk,
    nama: data.nama,
    deskripsi: data.deskripsi,
    sks: data.sks,
    semester: data.semester,
    prasyarat: data.prasyarat,
    tahun_ajaran_id: data.tahun_ajaran_id,
  });

  const validation = () => {
    const error = {};
    const errStat = {};
    let status = true;

    if (dataInput.nama === '') {
      error.nama = 'nama tidak boleh kosong';
      errStat.nama = true;
      status = false;
    }

    if (dataInput.kode_mk === '') {
      error.kode_mk = 'kode mata kuliah tidak boleh kosong';
      errStat.kode_mk = true;
      status = false;
    }

    if (dataInput.deskripsi === '') {
      error.deskripsi = 'deskripsi tidak boleh kosong';
      errStat.deskripsi = true;
      status = false;
    }

    if (dataInput.sks === 0) {
      error.sks = 'sks tidak boleh kosong';
      errStat.sks = true;
      status = false;
    } else if (dataInput.sks < 1) {
      error.sks = 'sks tidak boleh kurang dari 1';
      errStat.sks = true;
      status = false;
    }

    if (dataInput.semester === 0) {
      error.semester = 'semester tidak boleh kosong';
      errStat.semester = true;
      status = false;
    } else if (dataInput.semester < 1) {
      error.semester = 'semester tidak boleh kurang dari 1';
      errStat.semester = true;
      status = false;
    }

    if (dataInput.prasyarat === '') {
      error.prasyarat = 'prasyarat tidak boleh kosong';
      errStat.prasyarat = true;
      status = false;
    }

    if (dataInput.tahun_ajaran_id === 0) {
      error.tahun_ajaran = 'tahun ajaran tidak boleh kosong';
      errStat.tahun_ajaran = true;
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
        const res = await updateMataKuliah(dataInput, data.id);
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
  const handleChange = (target) => {
    const helper = { ...dataInput };
    if (target.name === 'nama') {
      helper.nama = target.value.toUpperCase();
    } else if (target.name === 'kode_mk') {
      helper.kode_mk = target.value;
    } else if (target.name === 'deskripsi') {
      helper.deskripsi = target.value;
    } else if (target.name === 'sks') {
      helper.sks = parseInt(target.value);
    } else if (target.name === 'semester') {
      helper.semester = parseInt(target.value);
    } else if (target.name === 'prasyarat') {
      helper.prasyarat = target.value;
    } else if (target.name === 'tahun_ajaran') {
      helper.tahun_ajaran_id = parseInt(target.value);
    }
    setDataInput(helper);
  };
  return (
    <div className="flex justify-center items-center z-50 fixed top-0 bottom-0 left-0 right-0 bg-black/50">
      <div className="relative block w-full md:w-1/2 lg:w-1/3 m-4 rounded-lg bg-white p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]">
        <div
          onClick={close}
          className="absolute top-2 right-2 hover:cursor-pointer"
        >
          <XMarkIcon className="w-8" />
        </div>
        <h5 className="my-2 text-xl font-medium leading-tight text-neutral-800 dark:text-neutral-50">
          Edit Mata Kuliah
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
              className={`bg-gray-50 border ${
                errStatus.kode_mk ? 'border-red-500' : 'border-gray-300'
              } text-gray-900 text-sm rounded-lg block w-full p-2.5`}
              placeholder="Masukkan kode mata kuliah"
              defaultValue={data.kode_mk}
              required
            />
            {errStatus.kode_mk && (
              <span className="text-red-500 text-sm">{errors.kode_mk}</span>
            )}
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
              className={`bg-gray-50 border ${
                errStatus.nama ? 'border-red-500' : 'border-gray-300'
              } text-gray-900 text-sm rounded-lg block w-full p-2.5`}
              placeholder="Masukkan nama mata kuliah"
              defaultValue={data.nama}
              required
            />
            {errStatus.nama && (
              <span className="text-red-500 text-sm">{errors.nama}</span>
            )}
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
              className={`bg-gray-50 border ${
                errStatus.deskripsi ? 'border-red-500' : 'border-gray-300'
              } text-gray-900 text-sm rounded-lg block w-full p-2.5`}
              placeholder="Masukkan deskripsi mata kuliah"
              defaultValue={data.deskripsi}
              required
            ></textarea>
            {errStatus.deskripsi && (
              <span className="text-red-500 text-sm">{errors.deskripsi}</span>
            )}
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
              className={`bg-gray-50 border ${
                errStatus.sks ? 'border-red-500' : 'border-gray-300'
              } text-gray-900 text-sm rounded-lg block w-full p-2.5`}
              placeholder="Masukkan jumlah SKS"
              defaultValue={data.sks}
              required
            />
            {errStatus.sks && (
              <span className="text-red-500 text-sm">{errors.sks}</span>
            )}
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
              className={`bg-gray-50 border ${
                errStatus.semester ? 'border-red-500' : 'border-gray-300'
              } text-gray-900 text-sm rounded-lg block w-full p-2.5`}
              placeholder="Masukkan semester"
              defaultValue={data.semester}
              required
            />
            {errStatus.semester && (
              <span className="text-red-500 text-sm">{errors.semester}</span>
            )}
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
              className={`bg-gray-50 border ${
                errStatus.prasyarat ? 'border-red-500' : 'border-gray-300'
              } text-gray-900 text-sm rounded-lg block w-full p-2.5`}
              placeholder="Masukkan prasyarat, isikan (-) jika tidak ada"
              defaultValue={data.prasyarat}
              required
            ></textarea>
            {errStatus.prasyarat && (
              <span className="text-red-500 text-sm">{errors.prasyarat}</span>
            )}
          </div>
          <div className="mb-2">
            <label
              htmlFor="tahun_ajaran"
              className="block mb-1 text-sm font-medium text-gray-900"
            >
              Tahun Ajaran
            </label>
            <select
              name="tahun_ajaran"
              id="tahun_ajaran"
              onChange={({ target }) => handleChange(target)}
              className={`bg-gray-50 border ${
                errStatus.tahun_ajaran ? 'border-red-500' : 'border-gray-300'
              } text-gray-900 text-sm rounded-lg block w-full p-2.5`}
              defaultValue={data.tahun_ajaran_id}
              required
            >
              <option value="0" disabled>
                Pilih Tahun Ajaran
              </option>
              {listTahunAjaran.map((item, i) => {
                return (
                  <option key={i} value={item.id}>
                    {`${item.tahun} ${item.semester}`}
                  </option>
                );
              })}
            </select>
            {errStatus.tahun_ajaran && (
              <span className="text-red-500 text-sm">
                {errors.tahun_ajaran}
              </span>
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
