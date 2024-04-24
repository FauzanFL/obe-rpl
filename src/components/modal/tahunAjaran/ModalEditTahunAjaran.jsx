/* eslint-disable react/prop-types */
import { XMarkIcon } from '@heroicons/react/24/solid';
import { alertFailed, alertSuccess } from '../../../utils/alert';
import { useState } from 'react';
import { updateTahunAjaran } from '../../../api/tahunAjaran';

export default function ModalEditTahunAjaran({ close, render, data }) {
  const [errStatus, setErrStatus] = useState({});
  const [errors, setErrors] = useState({});
  const [dataInput, setDataInput] = useState({
    tahun: data.tahun,
    semester: data.semester,
    bulan_mulai: data.bulan_mulai,
    bulan_selesai: data.bulan_selesai,
  });

  const arrMonth = [
    {
      id: 1,
      name: 'Januari',
    },
    {
      id: 2,
      name: 'Februari',
    },
    {
      id: 3,
      name: 'Maret',
    },
    {
      id: 4,
      name: 'April',
    },
    {
      id: 5,
      name: 'Mei',
    },
    {
      id: 6,
      name: 'Juni',
    },
    {
      id: 7,
      name: 'Juli',
    },
    {
      id: 8,
      name: 'Agustus',
    },
    {
      id: 9,
      name: 'September',
    },
    {
      id: 10,
      name: 'Oktober',
    },
    {
      id: 11,
      name: 'November',
    },
    {
      id: 12,
      name: 'Desember',
    },
  ];

  const handleChange = (target) => {
    const helper = { ...dataInput };
    if (target.name === 'tahun') {
      helper.tahun = target.value;
      setDataInput(helper);
    } else if (target.name === 'semester') {
      helper.semester = target.value;
      setDataInput(helper);
    } else if (target.name === 'bulan_mulai') {
      helper.bulan_mulai = parseInt(target.value);
      setDataInput(helper);
    } else if (target.name === 'bulan_selesai') {
      helper.bulan_selesai = parseInt(target.value);
      setDataInput(helper);
    }
  };

  const validation = () => {
    const error = {};
    const errStat = {};
    let status = true;

    if (dataInput.tahun === '') {
      error.tahun = 'tahun tidak boleh kosong';
      errStat.tahun = true;
      status = false;
    }

    if (dataInput.semester === '') {
      error.semester = 'semester tidak boleh kosong';
      errStat.semester = true;
      status = false;
    }

    if (dataInput.bulan_mulai === 0) {
      error.bulan_mulai = 'bulan mulai tidak boleh kosong';
      errStat.bulan_mulai = true;
      status = false;
    }

    if (dataInput.bulan_selesai === 0) {
      error.bulan_selesai = 'bulan selesai tidak boleh kosong';
      errStat.bulan_selesai = true;
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
        const res = await updateTahunAjaran(dataInput, data.id);
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
      <div className="relative w-1/3 rounded-lg bg-white p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]">
        <div
          onClick={close}
          className="absolute top-2 right-2 hover:cursor-pointer"
        >
          <XMarkIcon className="w-8" />
        </div>
        <h5 className="my-2 text-xl font-medium leading-tight text-neutral-800 dark:text-neutral-50">
          Edit Tahun Ajaran
        </h5>
        <form action="" onSubmit={handleSubmit} className="overflow-auto">
          <div className="mb-2">
            <label
              htmlFor="tahun"
              className="block mb-1 text-sm font-medium text-gray-900"
            >
              Tahun
            </label>
            <input
              onChange={({ target }) => handleChange(target)}
              name="tahun"
              id="tahun"
              type="text"
              className={`bg-gray-50 border ${
                errStatus.tahun ? 'border-red-500' : 'border-gray-300'
              } text-gray-900 text-sm rounded-lg block w-full p-2.5`}
              placeholder="ex: 2020/2021"
              defaultValue={data.tahun}
              required
            />
            {errStatus.tahun && (
              <span className="text-red-500 text-sm">{errors.tahun}</span>
            )}
          </div>
          <div className="mb-2">
            <label
              htmlFor="semster"
              className="block mb-1 text-sm font-medium text-gray-900"
            >
              Semester
            </label>
            <select
              name="semester"
              id="semester"
              onChange={({ target }) => handleChange(target)}
              className={`bg-gray-50 border ${
                errStatus.semester ? 'border-red-500' : 'border-gray-300'
              } text-gray-900 text-sm rounded-lg block w-full p-2.5`}
              defaultValue={data.semester}
            >
              <option value="" disabled>
                Pilih Semester
              </option>
              <option value="Ganjil">Ganjil</option>
              <option value="Genap">Genap</option>
            </select>
            {errStatus.semester && (
              <span className="text-red-500 text-sm">{errors.semester}</span>
            )}
          </div>
          <div className="mb-2">
            <label
              htmlFor="bulan_mulai"
              className="block mb-1 text-sm font-medium text-gray-900"
            >
              Bulan Mulai
            </label>
            <select
              name="bulan_mulai"
              id="bulan_mulai"
              onChange={({ target }) => handleChange(target)}
              className={`bg-gray-50 border ${
                errStatus.bulan_mulai ? 'border-red-500' : 'border-gray-300'
              } text-gray-900 text-sm rounded-lg block w-full p-2.5`}
              defaultValue={data.bulan_mulai}
            >
              <option value="" disabled>
                Pilih Bulan
              </option>
              {arrMonth.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            {errStatus.bulan_mulai && (
              <span className="text-red-500 text-sm">{errors.bulan_mulai}</span>
            )}
          </div>
          <div className="mb-2">
            <label
              htmlFor="bulan_selesai"
              className="block mb-1 text-sm font-medium text-gray-900"
            >
              Bulan Selesai
            </label>
            <select
              name="bulan_selesai"
              id="bulan_selesai"
              onChange={({ target }) => handleChange(target)}
              className={`bg-gray-50 border ${
                errStatus.bulan_selesai ? 'border-red-500' : 'border-gray-300'
              } text-gray-900 text-sm rounded-lg block w-full p-2.5`}
              defaultValue={data.bulan_selesai}
            >
              <option value="" disabled>
                Pilih Bulan
              </option>
              {arrMonth.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            {errStatus.bulan_selesai && (
              <span className="text-red-500 text-sm">
                {errors.bulan_selesai}
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
