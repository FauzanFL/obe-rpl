/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { getPloByObeId } from '../../../api/plo';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { updateClo } from '../../../api/clo';
import { alertFailed, alertSuccess } from '../../../utils/alert';

export default function ModalEditClo({
  close,
  render,
  listClo,
  data,
  activeObe,
}) {
  const [listPlo, setListPlo] = useState([]);
  const [errStatus, setErrStatus] = useState({});
  const [errors, setErrors] = useState({});
  const [dataInput, setDataInput] = useState({
    nama: data.nama,
    deskripsi: data.deskripsi,
    bobot: data.bobot,
    plo_id: data.plo_id,
    mk_id: data.mk_id,
  });

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
    const dataBobot = data.bobot * 100;
    const sum = listClo.reduce((acc, item) => acc + item.bobot, 0);
    return 100 - sum * 100 + dataBobot;
  };

  const formatBobot = (bobot) => {
    return bobot / 100;
  };

  const dataBobot = () => {
    return data.bobot * 100;
  };

  const handleChange = (target) => {
    let helper = { ...dataInput };
    if (target.name === 'nama') {
      helper.nama = target.value;
      setDataInput(helper);
    } else if (target.name === 'deskripsi') {
      helper.deskripsi = target.value;
      setDataInput(helper);
    } else if (target.name === 'bobot') {
      helper.bobot = parseInt(target.value);
      setDataInput(helper);
    } else if (target.name === 'plo') {
      helper.plo_id = parseInt(target.value);
      setDataInput(helper);
    }
  };

  const validation = () => {
    const error = {};
    const errStat = {};
    let status = true;

    if (dataInput.nama === '') {
      error.nama = 'nama tidak boleh kosong';
      errStat.nama = true;
      status = false;
    }

    if (dataInput.deskripsi === '') {
      error.deskripsi = 'deskripsi tidak boleh kosong';
      errStat.deskripsi = true;
      status = false;
    }

    if (dataInput.bobot === 0) {
      error.bobot = 'bobot tidak boleh kosong';
      errStat.bobot = true;
      status = false;
    } else if (dataInput.bobot > bobotMax()) {
      error.bobot = `bobot tidak boleh lebih dari ${bobotMax()}`;
      errStat.bobot = true;
      status = false;
    } else if (dataInput.bobot < 1) {
      error.bobot = 'bobot tidak boleh kurang dari 1';
      errStat.bobot = true;
      status = false;
    }

    if (dataInput.plo_id === 0) {
      error.plo_id = 'PLO tidak boleh kosong';
      errStat.plo_id = true;
      status = false;
    }
    setErrStatus(errStat);
    setErrors(error);
    return status;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validation()) {
      dataInput.bobot = formatBobot(dataInput.bobot);
      try {
        const res = await updateClo(dataInput, data.id);
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
    <div className="flex justify-center items-center fixed top-0 bottom-0 left-0 right-0 bg-black/50">
      <div className="relative w-1/3 rounded-lg bg-white p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]">
        <div
          onClick={close}
          className="absolute top-2 right-2 hover:cursor-pointer"
        >
          <XMarkIcon className="w-8" />
        </div>
        <h5 className="my-2 text-xl font-medium leading-tight text-neutral-800 dark:text-neutral-50">
          Edit CLO
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
              className={`bg-gray-50 border ${
                errStatus.nama ? 'border-red-500' : 'border-gray-300'
              } text-gray-900 text-sm rounded-lg block w-full p-2.5`}
              placeholder="Masukkan nama clo"
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
              placeholder="Masukkan deskripsi clo"
              defaultValue={data.deskripsi}
              required
            ></textarea>
            {errStatus.deskripsi && (
              <span className="text-red-500 text-sm">{errors.deskripsi}</span>
            )}
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
                className={`bg-gray-50 border ${
                  errStatus.bobot ? 'border-red-500' : 'border-gray-300'
                } text-gray-900 text-sm rounded-lg block w-full p-2.5`}
                placeholder="Masukkan bobot"
                defaultValue={dataBobot()}
                max={bobotMax()}
                required
              />
              <div className="font-semibold text-xl mx-2">%</div>
            </div>
            {errStatus.bobot && (
              <span className="text-red-500 text-sm">{errors.bobot}</span>
            )}
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
              className={`bg-gray-50 border ${
                errStatus.plo_id ? 'border-red-500' : 'border-gray-300'
              } text-gray-900 text-sm rounded-lg block w-full p-2.5`}
              defaultValue={data.plo_id}
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
            {errStatus.plo_id && (
              <span className="text-red-500 text-sm">{errors.plo_id}</span>
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
