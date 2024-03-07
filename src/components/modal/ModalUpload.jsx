/* eslint-disable react/prop-types */
import { XMarkIcon } from '@heroicons/react/24/solid';
import { useEffect, useState } from 'react';
import { getAssessmentByMkId } from '../../api/lembarAssessment';
import { uploadEvidnce } from '../../api/penilaian';
import { alertFailed, alertSuccess } from '../../utils/alert';

export default function ModalUpload({
  close,
  kelas,
  matakuliah,
  loadingOpen,
  loadingClose,
}) {
  const [listAssessment, setListAssessment] = useState([]);
  const [assessment, setAssessment] = useState('');
  const [file, setFile] = useState(null);
  const [fileErr, setFileErr] = useState(false);
  const [errStatus, setErrStatus] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    async function fetchAssessment() {
      try {
        const res = await getAssessmentByMkId(matakuliah.id);
        setListAssessment(res);
      } catch (e) {
        console.error(e);
      }
    }

    fetchAssessment();
  }, [matakuliah]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (
      file.type === 'application/zip' ||
      file.type === 'application/x-zip-compressed'
    ) {
      setFile(file);
      setFileErr(false);
    } else {
      setFileErr(true);
      e.target.value = '';
    }
  };

  const validation = () => {
    const error = {};
    const errStat = {};
    let status = true;

    if (assessment === '') {
      error.assessment = 'assessment tidak boleh kosong';
      errStat.assessment = true;
      status = false;
    }

    if (file === null) {
      error.file = 'file tidak boleh kosong';
      errStat.file = true;
      status = false;
    }

    setErrStatus(errStat);
    setErrors(error);
    return status;
  };

  const handleUpload = async (e) => {
    loadingOpen();
    e.preventDefault();
    const newName = `evidence_${matakuliah.kode_mk}_${assessment.replace(
      /\s+/g,
      ''
    )}_${kelas.kode_kelas}.zip`;
    const newFile = new File([file], newName, {
      type: file.type,
      lastModified: file.lastModified,
    });

    if (validation()) {
      try {
        const res = await uploadEvidnce(newFile);
        if (res) {
          alertSuccess('Berhasil mengupload file');
          close();
          loadingClose();
        }
      } catch (e) {
        alertFailed('Gagal mengupload file');
        loadingClose();
      }
    }
  };
  return (
    <>
      <div className="flex justify-center items-center z-30 fixed top-0 bottom-0 left-0 right-0 bg-black/50">
        <div className="relative w-1/3 rounded-lg bg-white p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]">
          <div
            onClick={close}
            className="absolute top-2 right-2 hover:cursor-pointer"
          >
            <XMarkIcon className="w-8" />
          </div>
          <h5 className="my-2 text-xl font-medium leading-tight text-neutral-800 dark:text-neutral-50">
            Tambah PLO
          </h5>
          <form action="" onSubmit={handleUpload} className="overflow-auto">
            <div className="mb-2">
              <label
                htmlFor="assessment"
                className="block mb-1 text-sm font-medium text-gray-900"
              >
                Assessment
              </label>
              <select
                name="assessment"
                id="assessment"
                onChange={({ target }) => setAssessment(target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                defaultValue={''}
              >
                <option value="" disabled>
                  Pilih Assessment
                </option>
                {listAssessment.map((item, i) => {
                  return (
                    <option key={i} value={item.nama}>
                      {item.nama}
                    </option>
                  );
                })}
              </select>
              {errStatus.assessment && (
                <span className="text-red-500 text-sm">
                  {errors.assessment}
                </span>
              )}
            </div>
            <div className="mb-2">
              <label
                htmlFor="file"
                className="block mb-1 text-sm font-medium text-gray-900"
              >
                Pilih File
              </label>
              <input
                id="file"
                type="file"
                accept=".zip"
                className="block w-full p-1 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                onChange={handleFileChange}
              />
              <div
                className="mt-1 text-sm text-gray-500 dark:text-gray-300"
                id="user_avatar_help"
              >
                Format file: zip
              </div>
              {errStatus.file && (
                <span className="text-red-500 text-sm">{errors.file}</span>
              )}
              {fileErr && (
                <span className="text-red-500 text-sm">
                  Format file harus zip
                </span>
              )}
            </div>
            <div className="flex justify-center mt-3">
              <button
                type="submit"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                Upload
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
