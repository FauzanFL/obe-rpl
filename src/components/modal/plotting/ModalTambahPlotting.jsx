/* eslint-disable react/prop-types */
import { XMarkIcon } from '@heroicons/react/24/solid';
import { useEffect, useState } from 'react';
import { getMataKuliahActiveByTahunId } from '../../../api/matakuliah';
import { getDosen } from '../../../api/dosen';
import { getKelas } from '../../../api/kelas';
import { createPlotting } from '../../../api/plotting';
import { alertFailed, alertSuccess } from '../../../utils/alert';

export default function ModalTambahPlotting({ close, render, tahun }) {
  const [listMk, setListMk] = useState([]);
  const [listDosen, setListDosen] = useState([]);
  const [listKelas, setListKelas] = useState([]);
  const [errStatus, setErrStatus] = useState({});
  const [errors, setErrors] = useState({});
  const dataInput = {
    mk_id: 0,
    dosen_id: 0,
    kelas_id: 0,
  };

  useEffect(() => {
    async function fetchMk() {
      try {
        const res = await getMataKuliahActiveByTahunId(tahun.id);
        if (res) {
          setListMk(res);
        }
      } catch (e) {
        console.error(e);
      }
    }
    async function fetchDosen() {
      try {
        const res = await getDosen();
        if (res) {
          setListDosen(res);
        }
      } catch (e) {
        console.error(e);
      }
    }
    async function fetchKelas() {
      try {
        const res = await getKelas();
        if (res) {
          setListKelas(res);
        }
      } catch (e) {
        console.error(e);
      }
    }

    fetchMk();
    fetchDosen();
    fetchKelas();
  }, [tahun]);

  const handleChange = (target) => {
    if (target.name === 'mk') {
      dataInput.mk_id = parseInt(target.value);
    } else if (target.name === 'dosen') {
      dataInput.dosen_id = parseInt(target.value);
    } else if (target.name === 'kelas') {
      dataInput.kelas_id = parseInt(target.value);
    }
  };

  const validation = () => {
    const error = {};
    const errStat = {};
    let status = true;

    if (dataInput.mk_id === 0) {
      error.mk = 'mata kuliah tidak boleh kosong';
      errStat.mk = true;
      status = false;
    }

    if (dataInput.dosen_id === 0) {
      error.dosen = 'dosen tidak boleh kosong';
      errStat.dosen = true;
      status = false;
    }

    if (dataInput.kelas_id === 0) {
      error.kelas = 'kelas tidak boleh kosong';
      errStat.kelas = true;
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
        const res = await createPlotting(dataInput);
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
        <h5 className="my-2 text-xl font-medium leading-tight text-neutral-800 dark:text-neutral-50">
          Tambah Plotting
        </h5>
        <form action="" onSubmit={handleSubmit} className="overflow-auto">
          <div className="mb-2">
            <label
              htmlFor="mk"
              className="block mb-1 text-sm font-medium text-gray-900"
            >
              Mata Kuliah
            </label>
            <select
              name="mk"
              id="mk"
              onChange={({ target }) => handleChange(target)}
              className={`bg-gray-50 border ${
                errStatus.mk ? 'border-red-500' : 'border-gray-300'
              } text-gray-900 text-sm rounded-lg block w-full p-2.5`}
              defaultValue={''}
            >
              <option value="" disabled>
                Pilih Mata Kuliah
              </option>
              {listMk.map((item, i) => {
                return (
                  <option key={i} value={item.id}>
                    {item.nama}
                  </option>
                );
              })}
            </select>
            {errStatus.mk && (
              <span className="text-red-500 text-sm">{errors.mk}</span>
            )}
          </div>
          <div className="mb-2">
            <label
              htmlFor="dosen"
              className="block mb-1 text-sm font-medium text-gray-900"
            >
              Dosen
            </label>
            <select
              name="dosen"
              id="dosen"
              onChange={({ target }) => handleChange(target)}
              className={`bg-gray-50 border ${
                errStatus.dosen ? 'border-red-500' : 'border-gray-300'
              } text-gray-900 text-sm rounded-lg block w-full p-2.5`}
              defaultValue={''}
            >
              <option value="" disabled>
                Pilih Dosen
              </option>
              {listDosen.map((item, i) => {
                return (
                  <option key={i} value={item.id}>
                    {item.nama}
                  </option>
                );
              })}
            </select>
            {errStatus.dosen && (
              <span className="text-red-500 text-sm">{errors.dosen}</span>
            )}
          </div>
          <div className="mb-2">
            <label
              htmlFor="kelas"
              className="block mb-1 text-sm font-medium text-gray-900"
            >
              Kelas
            </label>
            <select
              name="kelas"
              id="kelas"
              onChange={({ target }) => handleChange(target)}
              className={`bg-gray-50 border ${
                errStatus.kelas ? 'border-red-500' : 'border-gray-300'
              } text-gray-900 text-sm rounded-lg block w-full p-2.5`}
              defaultValue={''}
            >
              <option value="" disabled>
                Pilih Kelas
              </option>
              {listKelas.map((item, i) => {
                return (
                  <option key={i} value={item.id}>
                    {item.kode_kelas}
                  </option>
                );
              })}
            </select>
            {errStatus.kelas && (
              <span className="text-red-500 text-sm">{errors.kelas}</span>
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
