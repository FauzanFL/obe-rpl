import { useEffect, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumb';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import { getUserRole } from '../../api/user';
import Loader from '../../components/Loader';
import {
  PencilSquareIcon,
  PlusCircleIcon,
  TrashIcon,
} from '@heroicons/react/24/solid';
import { alertDelete, alertFailed, alertSuccess } from '../../utils/alert';
import {
  deleteIndexPenilaian,
  getIndexPenilaian,
} from '../../api/indexPenilaian';
import { useNavigate } from 'react-router-dom';
import ModalTambahIndexPenilaian from '../../components/modal/indexPenilaian/ModalTambahIndexPenilaian';
import ModalEditIndexPenilaian from '../../components/modal/indexPenilaian/ModalEditIndexPenilaian';

export default function IndexPenilaian() {
  const navigate = useNavigate();
  const [isTambahOpen, setIsTambahOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedIndexPenilaian, setSelectedIndexPenilaian] = useState({});
  const [listIndexPenilaian, setListIndexPenilaian] = useState([]);
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
        const res = await getIndexPenilaian();
        if (res) {
          setListIndexPenilaian(res);
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
      const res = await getIndexPenilaian();
      if (res) {
        setListIndexPenilaian(res);
      }
      setIsLoading(false);
    } catch (e) {
      console.error(e);
    }
  };

  const listNav = [{ name: 'Index Penilaian', link: '/prodi/index-penilaian' }];
  return (
    <>
      <div className="flex">
        <div className="fixed top-0 bottom-0 z-50 bg-indigo-500 md:static">
          <Sidebar typeUser={'prodi'} page={'index-penilaian'} />
        </div>
        <div className="flex-1 h-screen overflow-auto">
          <Header typeUser={'prodi'} />
          <div className="px-7 pt-4">
            <Breadcrumb listNav={listNav} />
          </div>
          <main className="p-7 text-wrap">
            <h2 className="text-semibold text-3xl">Index Penilaian</h2>
            <div className="block mt-3 p-5 bg-white border border-gray-200 rounded-lg shadow">
              <h3 className="text-semibold text-2xl">Daftar Index</h3>
              <div className="flex justify-start md:justify-end items-center">
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
                        Grade
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Batas Awal
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Batas Akhir
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {listIndexPenilaian !== null &&
                      listIndexPenilaian.map((item, i) => {
                        const handleEdit = () => {
                          setSelectedIndexPenilaian(item);
                          setIsEditOpen(true);
                        };
                        const handleDelete = async () => {
                          try {
                            const res = await deleteIndexPenilaian(item.id);
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
                            <td className="px-6 py-4">{item.grade}</td>
                            <td className="px-6 py-4">{item.batas_awal}</td>
                            <td className="px-6 py-4">{item.batas_akhir}</td>
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
        <ModalTambahIndexPenilaian
          close={() => setIsTambahOpen(false)}
          render={render}
        />
      )}
      {isEditOpen && (
        <ModalEditIndexPenilaian
          close={() => setIsEditOpen(false)}
          render={render}
          data={selectedIndexPenilaian}
        />
      )}
      {isLoading && <Loader />}
    </>
  );
}
