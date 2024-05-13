/* eslint-disable react/prop-types */
import { XMarkIcon } from '@heroicons/react/24/solid';
import { useEffect, useState } from 'react';
import { getKurikulum } from '../../../api/kurikulum';
import {
  getPerancanganById,
  updatePerancangan,
} from '../../../api/perancanganObe';
import { alertFailed, alertSuccess } from '../../../utils/alert';

export default function ModalEditPerancangan({ close, render, id }) {
  const [data, setData] = useState({});
  const [listKurikulum, setListKurikulum] = useState([]);
  const [errStatus, setErrStatus] = useState({});
  const [errors, setErrors] = useState({});
  const [dataInput, setDataInput] = useState({});

  useEffect(() => {
    async function fetchKurikulum() {
      const res = await getKurikulum();
      setListKurikulum(res);
    }

    async function fetchPerancangan() {
      const res = await getPerancanganById(id);
      setData(res);
      setDataInput({ nama: res.nama, kurikulum_id: res.kurikulum_id });
    }

    fetchPerancangan();
    fetchKurikulum();
  }, [id]);

  const validation = () => {
    const error = {};
    const errStat = {};
    let status = true;

    if (dataInput.nama === '') {
      error.nama = 'nama tidak boleh kosong';
      errStat.nama = true;
      status = false;
    }

    if (dataInput.kurikulum_id === 0) {
      error.kurikulum_id = 'kurikulum tidak boleh kosong';
      errStat.kurikulum_id = true;
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
        const res = await updatePerancangan(dataInput, id);
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
      helper.nama = target.value;
      setDataInput(helper);
    } else if (target.name === 'kurikulum') {
      helper.kurikulum_id = parseInt(target.value);
      setDataInput(helper);
    }
  };
  return (
    <div className="flex justify-center items-center z-50 fixed top-0 bottom-0 left-0 right-0 bg-black/50">
      <div className="relative w-full md:w-1/2 lg:w-1/3 m-4 block rounded-lg bg-white p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]">
        <div
          onClick={close}
          className="absolute top-2 right-2 hover:cursor-pointer"
        >
          <XMarkIcon className="w-8" />
        </div>
        <h5 className="my-2 text-xl font-medium leading-tight text-neutral-800">
          Edit Perancangan OBE
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
              className={`bg-gray-50 border ${
                errStatus.nama ? 'border-red-500' : 'border-gray-300'
              } text-gray-900 text-sm rounded-lg block w-full p-2.5`}
              placeholder="Masukkan nama perancangan"
              defaultValue={data.nama}
              required
            />
            {errStatus.nama && (
              <span className="text-red-500 text-sm">{errors.nama}</span>
            )}
          </div>
          <div className="mb-2">
            <label
              htmlFor="kurikulum"
              className="block mb-1 text-sm font-medium text-gray-900"
            >
              Kurikulum
            </label>
            <select
              name="kurikulum"
              id="kurikulum"
              onChange={({ target }) => handleChange(target)}
              className={`bg-gray-50 border ${
                errStatus.kurikulum_id ? 'border-red-500' : 'border-gray-300'
              } text-gray-900 text-sm rounded-lg block w-full p-2.5`}
              defaultValue={data.kurikulum_id}
            >
              <option value="" disabled>
                Pilih Kurikulum
              </option>
              {listKurikulum.map((item, i) => {
                return (
                  <option key={i} value={item.id}>
                    {item.nama}
                  </option>
                );
              })}
            </select>
            {errStatus.kurikulum_id && (
              <span className="text-red-500 text-sm">
                {errors.kurikulum_id}
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
