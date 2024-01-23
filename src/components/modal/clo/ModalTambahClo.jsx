/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { getPloByObeId } from '../../../api/plo';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { createClo } from '../../../api/clo';

export default function ModalTambahClo({
  close,
  render,
  listClo,
  mkId,
  activeObe,
}) {
  const [listPlo, setListPlo] = useState([]);
  const dataInput = {
    mk_id: mkId,
  };

  useEffect(() => {
    async function fetchPlo() {
      try {
        const res = await getPloByObeId(activeObe.id);
        if (res) {
          setListPlo(res);
        }
      } catch (e) {
        console.error(e);
      }
    }

    fetchPlo();
  }, [activeObe]);

  const bobotMax = () => {
    const sum = listClo.reduce((acc, item) => acc + item.bobot, 0);
    return 100 - sum * 100;
  };

  const formatBobot = (bobot) => {
    return parseInt(bobot) / 100;
  };

  const handleChange = (target) => {
    if (target.name === 'nama') {
      dataInput.nama = target.value;
    } else if (target.name === 'deskripsi') {
      dataInput.deskripsi = target.value;
    } else if (target.name === 'bobot') {
      dataInput.bobot = formatBobot(target.value);
    } else if (target.name === 'plo') {
      dataInput.plo_id = parseInt(target.value);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (dataInput.nama === undefined || dataInput.nama === '') {
      console.log('Nama tidak boleh kosong');
    } else if (
      dataInput.deskripsi === undefined ||
      dataInput.deskripsi === ''
    ) {
      console.log('Deskripsi tidak boleh kosong');
    } else if (dataInput.bobot === undefined || dataInput.bobot === 0) {
      console.log('Bobot tidak boleh kosong');
    } else if (dataInput.plo_id === undefined || dataInput.plo_id === 0) {
      console.log('PLO tidak boleh kosong');
    } else if (dataInput.bobot > bobotMax()) {
      console.log(`Bobot tidak boleh lebih dari ${bobotMax()}`);
    } else {
      try {
        const res = await createClo(dataInput);
        if (res) {
          render();
          close();
        }
      } catch (e) {
        console.error(e);
      }
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
          Tambah CLO
        </h5>
        <form
          action=""
          onSubmit={handleSubmit}
          className="overflow-y-auto h-96"
        >
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
              placeholder="Masukkan nama clo"
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
              placeholder="Masukkan deskripsi clo"
              required
            ></textarea>
          </div>
          <div className="mb-2">
            <label
              htmlFor="bobot"
              className="block mb-1 text-sm font-medium text-gray-900"
            >
              Bobot
            </label>
            <div className="flex items-center">
              <input
                onChange={({ target }) => handleChange(target)}
                name="bobot"
                id="bobot"
                type="number"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Masukkan bobot"
                max={bobotMax()}
                required
              />
              <div className="font-semibold text-xl mx-2">%</div>
            </div>
          </div>
          <div className="mb-2">
            <label
              htmlFor="plo"
              className="block mb-1 text-sm font-medium text-gray-900"
            >
              PLO
            </label>
            <select
              name="plo"
              id="plo"
              onChange={({ target }) => handleChange(target)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              defaultValue={''}
            >
              <option value="" disabled>
                Pilih PLO
              </option>
              {listPlo.map((item, i) => {
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
              Buat
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
