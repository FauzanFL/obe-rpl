import { PlusCircleIcon, TrashIcon } from '@heroicons/react/24/solid';
import Breadcrumb from '../../../components/Breadcrumb';
import Header from '../../../components/Header';
import Pagination from '../../../components/Pagination';
import Sidebar from '../../../components/Sidebar';
import { useEffect, useState } from 'react';
import { deletePlotting, getPlotting } from '../../../api/plotting';
import { useNavigate } from 'react-router-dom';
import { getUserRole } from '../../../api/user';
import { getActivePerancangan } from '../../../api/perancanganObe';
import ModalTambahPlotting from '../../../components/modal/plotting/ModalTambahPlotting';
import { alertDelete, alertFailed, alertSuccess } from '../../../utils/alert';

export default function PlottingDosen() {
  const navigate = useNavigate();
  const [listPlotting, setListPlotting] = useState([]);
  const [activeObe, setActiveObe] = useState({});
  const [isTambahOpen, setIsTambahOpen] = useState(false);
  const listNav = [{ name: 'Plotting Dosen', link: '/prodi/plotting' }];

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
        if (res) {
          setActiveObe(res);
        }
      } catch (e) {
        console.error(e);
      }
    }

    async function fetch() {
      try {
        const res = await getPlotting();
        if (res) {
          setListPlotting(res);
        }
      } catch (e) {
        console.error(e);
      }
    }

    fetchUser();
    fetch();
    fetchActiveObe();
  }, [navigate]);

  const render = async () => {
    try {
      const res = await getPlotting();
      if (res) {
        setListPlotting(res);
      }
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <>
      <div className="flex">
        <div className="">
          <Sidebar typeUser={'prodi'} page={'plotting'} />
        </div>
        <div className="flex-1 h-screen overflow-auto">
          <Header typeUser={'prodi'} />
          <div className="px-7 pt-4">
            <Breadcrumb listNav={listNav} />
          </div>
          <main className="p-7 text-wrap">
            <h2 className="text-semibold text-3xl">Plotting Dosen</h2>
            <div className="block mt-3 p-5 bg-white border border-gray-200 rounded-lg shadow">
              <h3 className="text-semibold text-2xl">Daftar Plotting Dosen</h3>
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
                        Kode Dosen
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Kelas
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Kode Mata Kuliah
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {listPlotting.map((item, i) => {
                      const handleDelete = async () => {
                        try {
                          const res = await deletePlotting(item.id);
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
                          <td className="px-6 py-4">{item.dosen}</td>
                          <td className="px-6 py-4">{item.kelas}</td>
                          <td className="px-6 py-4">{item.mata_kuliah}</td>
                          <td className="flex px-6 py-4">
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
                <Pagination />
              </div>
            </div>
          </main>
        </div>
      </div>
      {isTambahOpen && (
        <ModalTambahPlotting
          close={() => setIsTambahOpen(false)}
          render={render}
          activeObe={activeObe}
        />
      )}
    </>
  );
}
