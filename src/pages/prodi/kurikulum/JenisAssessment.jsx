import { useEffect, useState } from 'react';
import {
  PencilSquareIcon,
  PlusCircleIcon,
  TrashIcon,
} from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
import {
  deleteJenisAssessment,
  getJenisAssessment,
} from '../../../api/jenisAssessment';
import ModalTambahJenisAssessment from '../../../components/modal/jenisAssessment/ModalTambahJenisAssessment';
import ModalEditJenisAssessment from '../../../components/modal/jenisAssessment/ModalEditJenisAssessment';
import { getUserRole } from '../../../api/user';
import Sidebar from '../../../components/Sidebar';
import Header from '../../../components/Header';
import Breadcrumb from '../../../components/Breadcrumb';
import { alertDelete, alertFailed, alertSuccess } from '../../../utils/alert';
import Loader from '../../../components/Loader';

export default function JenisAssessment() {
  const navigate = useNavigate();
  const [isTambahOpen, setIsTambahOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedJenisAssessment, setSelectedJenisAssessment] = useState({});
  const [listJenisAssessment, setListJenisAssessment] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    async function fetchUser() {
      try {
        const res = await getUserRole();
        if (res.role !== 'prodi') {
          navigate('/');
        }
      } catch (e) {
        navigate('/');
      }
    }

    async function fetch() {
      try {
        const res = await getJenisAssessment();
        if (res) {
          setListJenisAssessment(res);
        }
        setIsLoading(false);
      } catch (e) {
        console.error(e);
      }
    }

    fetchUser();
    fetch();
  }, [navigate]);

  const render = async () => {
    try {
      const res = await getJenisAssessment();
      if (res) {
        setListJenisAssessment(res);
      }
      setIsLoading(false);
    } catch (e) {
      console.error(e);
    }
  };

  const listNav = [
    { name: 'Jenis Assessment', link: '/prodi/jenis-assessment' },
  ];
  return (
    <>
      <div className="flex">
        <div className="">
          <Sidebar typeUser={'prodi'} page={'jenis-assessment'} />
        </div>
        <div className="flex-1 h-screen overflow-auto">
          <Header typeUser={'prodi'} />
          <div className="px-7 pt-4">
            <Breadcrumb listNav={listNav} />
          </div>
          <main className="p-7 text-wrap">
            <h2 className="text-semibold text-3xl">Jenis Assessment</h2>
            <div className="block mt-3 p-5 bg-white border border-gray-200 rounded-lg shadow">
              <h3 className="text-semibold text-2xl">
                Daftar Jenis Assessment
              </h3>
              <div className="flex justify-end items-center">
                <button
                  type="button"
                  onClick={() => setIsTambahOpen(true)}
                  className="flex justify-center items-center focus:outline-none text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-3 py-1.5 me-2 mb-2"
                >
                  Tambah
                  <PlusCircleIcon className="w-6 ml-1" />
                </button>
              </div>
              <div className="relative overflow-x-auto shadow-sm sm:rounded-lg">
                <table className="w-full text-left rtl:text-right">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        Nama
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {listJenisAssessment !== null &&
                      listJenisAssessment.map((item, i) => {
                        const handleEdit = () => {
                          setSelectedJenisAssessment(item);
                          setIsEditOpen(true);
                        };
                        const handleDelete = async () => {
                          try {
                            const res = await deleteJenisAssessment(item.id);
                            if (res) {
                              alertSuccess('Berhasil menghapus data');
                              render();
                            }
                          } catch (e) {
                            alertFailed('Gagal menghapus data');
                          }
                        };
                        return (
                          <tr
                            key={i}
                            className="odd:bg-white even:bg-gray-50 border-b"
                          >
                            <td className="px-6 py-4">{item.nama}</td>
                            <td className="flex px-6 py-4">
                              <button
                                type="button"
                                onClick={handleEdit}
                                className="flex justify-center items-center focus:outline-none text-white bg-orange-600 hover:bg-orange-700 focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm px-3 py-1.5 me-2 mb-2"
                              >
                                <PencilSquareIcon className="w-5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => alertDelete(handleDelete)}
                                className="flex justify-center items-center focus:outline-none text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-1.5 me-2 mb-2"
                              >
                                <TrashIcon className="w-5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>
      {isTambahOpen && (
        <ModalTambahJenisAssessment
          close={() => setIsTambahOpen(false)}
          render={render}
        />
      )}
      {isEditOpen && (
        <ModalEditJenisAssessment
          close={() => setIsEditOpen(false)}
          render={render}
          data={selectedJenisAssessment}
        />
      )}
      {isLoading && <Loader />}
    </>
  );
}
