import {
  PencilSquareIcon,
  PlusCircleIcon,
  TrashIcon,
} from '@heroicons/react/24/solid';
import Breadcrumb from '../../../components/Breadcrumb';
import Header from '../../../components/Header';
import Pagination from '../../../components/Pagination';
import Sidebar from '../../../components/Sidebar';
import { useEffect, useState } from 'react';
import { deletePlo, getPloByObeId } from '../../../api/plo';
import { useNavigate } from 'react-router-dom';
import { getUserRole } from '../../../api/user';
import { getActivePerancangan } from '../../../api/perancanganObe';
import ModalTambahPlo from '../../../components/modal/plo/ModalTambahPlo';
import ModalEditPlo from '../../../components/modal/plo/ModalEditPlo';

export default function Plo() {
  const navigate = useNavigate();
  const [listPlo, setListPlo] = useState([]);
  const [isTambahOpen, setIsTambahOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedPlo, setSelectedPlo] = useState({});
  const listNav = [{ name: 'PLO', link: '/prodi/plo' }];

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

    async function fetch() {
      try {
        const obeActive = await getActivePerancangan();
        const res = await getPloByObeId(obeActive.id);
        if (res) {
          setListPlo(res);
        }
      } catch (e) {
        console.error(e);
      }
    }

    fetchUser();
    fetch();
  }, [navigate]);

  const render = async () => {
    try {
      const obeActive = await getActivePerancangan();
      const res = await getPloByObeId(obeActive.id);
      if (res) {
        setListPlo(res);
      }
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <>
      <div className="flex">
        <div className="">
          <Sidebar typeUser={'prodi'} page={'plo'} />
        </div>
        <div className="flex-1 h-screen overflow-auto">
          <Header typeUser={'prodi'} />
          <div className="px-7 pt-4">
            <Breadcrumb listNav={listNav} />
          </div>
          <main className="p-7 text-wrap">
            <h2 className="text-semibold text-3xl">PLO</h2>
            <div className="block mt-3 p-5 bg-white border border-gray-200 rounded-lg shadow">
              <h3 className="text-semibold text-2xl">Daftar PLO</h3>
              <div className="flex justify-end">
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
                        Deskripsi
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {listPlo.map((item, i) => {
                      const handleEdit = () => {
                        setSelectedPlo(item);
                        setIsEditOpen(true);
                      };
                      const handleDelete = async () => {
                        try {
                          const res = await deletePlo(item.id);
                          if (res) {
                            render();
                          }
                        } catch (e) {
                          console.error(e);
                        }
                      };
                      return (
                        <tr
                          key={i}
                          className="odd:bg-white even:bg-gray-50 border-b"
                        >
                          <td className="px-6 py-4">{item.nama}</td>
                          <td className="px-6 py-4">{item.deskripsi}</td>
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
                              onClick={handleDelete}
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
                <Pagination />
              </div>
            </div>
          </main>
        </div>
      </div>
      {isTambahOpen && (
        <ModalTambahPlo close={() => setIsTambahOpen(false)} render={render} />
      )}
      {isEditOpen && (
        <ModalEditPlo
          close={() => setIsEditOpen(false)}
          render={render}
          data={selectedPlo}
        />
      )}
    </>
  );
}
