import {
  PencilSquareIcon,
  PlusCircleIcon,
  TrashIcon,
} from '@heroicons/react/24/solid';
import Breadcrumb from '../../components/Breadcrumb';
import Header from '../../components/Header';
import Pagination from '../../components/Pagination';
import Sidebar from '../../components/Sidebar';
import { useEffect, useState } from 'react';
import { deleteMataKuliah, getMataKuliahByObeId } from '../../api/matakuliah';
import { useNavigate } from 'react-router-dom';
import { getUserRole } from '../../api/user';
import { getActivePerancangan } from '../../api/perancanganObe';
import ModalTambahMk from '../../components/modal/matakuliah/ModalTambahMk';
import ModalEditMk from '../../components/modal/matakuliah/ModalEditMk';

export default function MataKuliah() {
  const navigate = useNavigate();
  const [listMk, setListMk] = useState([]);
  const [activeObe, setActiveObe] = useState({});
  const [isTambahOpen, setIsTambahOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedMk, setSelectedMk] = useState({});
  const listNav = [{ name: 'Mata Kuliah', link: '/prodi/matakuliah' }];

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

    async function fetchActiveObe() {
      try {
        const res = await getActivePerancangan();
        setActiveObe(res);
      } catch (e) {
        console.error(e);
      }
    }

    async function fetch() {
      try {
        const obe = await getActivePerancangan();
        const res = await getMataKuliahByObeId(obe.id);
        if (res) {
          setListMk(res);
        }
      } catch (e) {
        console.error(e);
      }
    }

    fetchUser();
    fetchActiveObe();
    fetch();
  }, [navigate]);

  const render = async () => {
    try {
      const obe = await getActivePerancangan();
      const res = await getMataKuliahByObeId(obe.id);
      if (res) {
        setListMk(res);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <div className="flex">
        <div className="">
          <Sidebar typeUser={'prodi'} page={'matakuliah'} />
        </div>
        <div className="flex-1 h-screen overflow-auto">
          <Header typeUser={'prodi'} />
          <div className="px-7 pt-4">
            <Breadcrumb listNav={listNav} />
          </div>
          <main className="p-7 text-wrap">
            <h2 className="text-semibold text-3xl">Mata Kuliah</h2>
            <div className="block mt-3 p-5 bg-white border border-gray-200 rounded-lg shadow">
              <h3 className="text-semibold text-2xl">Daftar Mata Kuliah</h3>
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
                        Kode
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Nama
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Deskripsi
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Semester
                      </th>
                      <th scope="col" className="px-6 py-3">
                        SKS
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Prasyarat
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {listMk.map((item, i) => {
                      const handleEdit = () => {
                        setSelectedMk(item);
                        setIsEditOpen(true);
                      };
                      const handleDelete = async () => {
                        try {
                          const res = await deleteMataKuliah(item.id);
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
                          <td className="px-6 py-4">{item.kode_mk}</td>
                          <td className="px-6 py-4">{item.nama}</td>
                          <td className="px-6 py-4">{item.deskripsi}</td>
                          <td className="px-6 py-4">{item.semester}</td>
                          <td className="px-6 py-4">{item.sks}</td>
                          <td className="px-6 py-4">{item.prasyarat}</td>
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
        <ModalTambahMk
          close={() => setIsTambahOpen(false)}
          render={render}
          activeObe={activeObe}
        />
      )}
      {isEditOpen && (
        <ModalEditMk
          close={() => setIsEditOpen(false)}
          render={render}
          activeObe={activeObe}
          data={selectedMk}
        />
      )}
    </>
  );
}
