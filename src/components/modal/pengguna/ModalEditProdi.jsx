/* eslint-disable react/prop-types */
import { EyeIcon, EyeSlashIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { updateUser } from '../../../api/user';
import { alertFailed, alertSuccess } from '../../../utils/alert';
import { useState } from 'react';

export default function ModalEditProdi({ close, render, data }) {
  const [isPassShow, setIsPassShow] = useState(false);
  const [errStatus, setErrStatus] = useState({});
  const [errors, setErrors] = useState({});
  const [dataInput, setDataInput] = useState({
    email: data.email,
    password: '',
  });

  const validation = () => {
    const error = {};
    const errStat = {};
    let status = true;
    const regex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (dataInput.email === '') {
      error.email = 'email tidak boleh kosong';
      errStat.email = true;
      status = false;
    } else if (!regex.test(dataInput.email)) {
      error.email = 'email harus sesuai format';
      errStat.email = true;
      status = false;
    }

    if (dataInput.password !== '') {
      if (dataInput.password.length < 8) {
        error.password = 'password minimal memiliki 8 karakter';
        errStat.password = true;
        status = false;
      } else if (/[ ]/.test(dataInput.password)) {
        error.password = 'password tidak boleh mengandung spasi';
        errStat.password = true;
        status = false;
      } else if (!/[a-z]/.test(dataInput.password)) {
        error.password = 'password minimal memiliki 1 huruf kecil';
        errStat.password = true;
        status = false;
      } else if (!/[A-Z]/.test(dataInput.password)) {
        error.password = 'password minimal memiliki 1 huruf besar';
        errStat.password = true;
        status = false;
      } else if (!/[0-9]/.test(dataInput.password)) {
        error.password = 'password minimal memiliki 1 angka';
        errStat.password = true;
        status = false;
      } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(dataInput.password)) {
        error.password = 'password minimal memiliki 1 spesial karakter';
        errStat.password = true;
        status = false;
      }
    }

    setErrStatus(errStat);
    setErrors(error);
    return status;
  };
  const handleTogglePass = (e) => {
    e.preventDefault();
    setIsPassShow(!isPassShow);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validation()) {
      try {
        const res = await updateUser(dataInput, data.id);
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
    if (target.name === 'email') {
      helper.email = target.value;
    } else if (target.name === 'password') {
      helper.password = target.value;
    }
    setDataInput(helper);
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
          Edit Pengguna
        </h5>
        <form action="" onSubmit={handleSubmit} className="overflow-auto">
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
              className={`bg-gray-50 border ${
                errStatus.email ? 'border-red-500' : 'border-gray-300'
              } text-gray-900 text-sm rounded-lg block w-full p-2.5`}
              placeholder="Masukkan email"
              defaultValue={data.email}
              required
            />
            {errStatus.email && (
              <span className="text-red-500 text-sm">{errors.email}</span>
            )}
          </div>
          <div className="mb-2">
            <div className="relative">
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
                type={`${isPassShow ? 'text' : 'password'}`}
                className={`bg-gray-50 border ${
                  errStatus.password ? 'border-red-500' : 'border-gray-300'
                } text-gray-900 text-sm rounded-lg block w-full p-2.5 pr-8`}
                placeholder="Masukkan password"
                required
              />
              <button
                onClick={handleTogglePass}
                className="absolute right-2 top-9 w-5"
              >
                {isPassShow ? <EyeSlashIcon /> : <EyeIcon />}
              </button>
            </div>
            {errStatus.password && (
              <span className="text-red-500 text-sm">{errors.password}</span>
            )}
            <ul className="text-xs list-disc ml-4 mt-1">
              <li>Minimal 8 karakter</li>
              <li>Tidak mengandung spasi</li>
              <li>Mengandung huruf kecil</li>
              <li>Mengandung huruf besar</li>
              <li>Mengandung angka</li>
              <li>Mengandung karakter spesial</li>
            </ul>
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
