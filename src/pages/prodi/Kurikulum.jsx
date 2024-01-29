import {
  CursorArrowRippleIcon,
  PencilSquareIcon,
  PlusCircleIcon,
  TrashIcon,
} from '@heroicons/react/24/solid';
import Breadcrumb from '../../components/Breadcrumb';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import Pagination from '../../components/Pagination';
import { useEffect, useState } from 'react';
import {
  activatePerancangan,
  deletePerancangan,
  getPerancangan,
} from '../../api/perancanganObe';
import { useNavigate } from 'react-router-dom';
import { getUserRole } from '../../api/user';
import ModalTambahPerancangan from '../../components/modal/perancangan/ModalTambahPerancangan';
import ModalEditPerancangan from '../../components/modal/perancangan/ModalEditPerancangan';
import { alertDelete, alertFailed, alertSuccess } from '../../utils/alert';

export default function Kurikulum() {
  const navigate = useNavigate();
  const [isTambahOpen, setIsTambahOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(0);
  const [listPerancangan, setListPerancangan] = useState([]);
  const listNav = [{ name: 'Kurikulum', link: '/prodi/kurikulum' }];

  useEffect(() => {
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

    async function fetchList() {
      try {
        const res = await getPerancangan();
        if (res) {
          setListPerancangan(res);
        }
      } catch (e) {
        console.error(e);
      }
    }

    fetchUser();
    fetchList();
  }, [navigate]);

  const render = async () => {
    try {
      const res = await getPerancangan();
      if (res) {
        setListPerancangan(res);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const ActiveSign = () => {
    return (
      <>
        <div className="flex justify-center items-center w-5 h-5 mr-1 border rounded-full">
          <div className="w-3 h-3 border rounded-full bg-green-400"></div>
        </div>
        Aktif
      </>
    );
  };

  const InactiveSign = () => {
    return (
      <>
        <div className="flex justify-center items-center w-5 h-5 mr-1 border rounded-full">
          <div className="w-3 h-3 border rounded-full bg-gray-400"></div>
        </div>
        Tidak Aktif
      </>
    );
  };

  return (
    <>
      <div className="flex">
        <div className="">
          <Sidebar typeUser={'prodi'} page={'kurikulum'} />
        </div>
        <div className="flex-1 h-screen overflow-auto">
          <Header typeUser={'prodi'} />
          <div className="px-7 pt-4">
            <Breadcrumb listNav={listNav} />
          </div>
          <main className="p-7 text-wrap">
            <h2 className="text-semibold text-3xl">Kurikulum</h2>
            <div className="block mt-3 p-5 bg-white border border-gray-200 rounded-lg shadow">
              <h3 className="text-semibold text-2xl">Daftar Perancangan OBE</h3>
              <div className="flex justify-end">
                <button
                  onClick={() => setIsTambahOpen(true)}
                  type="button"
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
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Kurikulum
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {listPerancangan.map((item, i) => {
                      const handleEdit = () => {
                        setSelectedId(item.id);
                        setIsEditOpen(true);
                      };
                      const handleDelete = async () => {
                        try {
                          const res = await deletePerancangan(item.id);
                          if (res) {
                            render();
                          }
                        } catch (e) {
                          console.error(e);
                        }
                      };
                      const handleActivate = async () => {
                        try {
                          const res = await activatePerancangan(item.id);
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
                          <td className="flex items-center px-6 py-4">
                            {item.status === 'active' ? (
                              <ActiveSign />
                            ) : (
                              <InactiveSign />
                            )}
                          </td>
                          <td className="px-6 py-4">{item.kurikulum}</td>
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
                            <button
                              type="button"
                              onClick={handleActivate}
                              className="flex justify-center items-center focus:outline-none text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-3 py-1.5 me-2 mb-2"
                            >
                              <CursorArrowRippleIcon className="w-5 mr-1" />
                              Aktivasi
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <Pagination />
              </div>
            </div>
          </main>
        </div>
        {isTambahOpen && (
          <ModalTambahPerancangan
            close={() => setIsTambahOpen(false)}
            render={render}
          />
        )}
        {isEditOpen && (
          <ModalEditPerancangan
            close={() => setIsEditOpen(false)}
            render={render}
            id={selectedId}
          />
        )}
      </div>
    </>
  );
}
