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
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (dataInput.nama === undefined || dataInput.nama === '') {
      console.log('Nama tidak boleh kosong');
    } else if (
      dataInput.kurikulum_id === undefined ||
      dataInput.kurikulum_id === ''
    ) {
      console.log('Kurikulum tidak boleh kosong');
    } else {
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
    if (target.name === 'nama') {
      dataInput.nama = target.value;
    } else if (target.name === 'kurikulum') {
      dataInput.kurikulum_id = parseInt(target.value);
    }
  };
  return (
    <div className="flex justify-center items-center fixed top-0 bottom-0 left-0 right-0 bg-black/50">
      <div className="relative block rounded-lg bg-white p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]">
        <div
          onClick={close}
          className="absolute top-2 right-2 hover:cursor-pointer"
        >
          <XMarkIcon className="w-8" />
        </div>
        <h5 className="my-2 text-xl font-medium leading-tight text-neutral-800 dark:text-neutral-50">
          Tambah Perancangan OBE
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
              placeholder="Masukkan nama perancangan"
              defaultValue={data.nama}
              required
            />
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
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              value={data.kurikulum_id}
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
