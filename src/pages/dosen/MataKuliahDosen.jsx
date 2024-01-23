import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import Breadcrumb from '../../components/Breadcrumb';
import Pagination from '../../components/Pagination';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getDosenMataKuliah } from '../../api/dosen';
import { ClipboardDocumentCheckIcon } from '@heroicons/react/24/solid';
import { getUserRole } from '../../api/user';

export default function MataKuliahDosen() {
  const [listMk, setListMk] = useState([]);
  const navigate = useNavigate();
  const listNav = [{ name: 'Mata Kuliah', link: '/dosen/matakuliah' }];

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await getUserRole();
        if (res.role !== 'dosen') {
          navigate('/');
        }
      } catch (e) {
        navigate('/');
      }
    }

    async function fetch() {
      try {
        const res = await getDosenMataKuliah();
        if (res) {
          setListMk(res);
        }
      } catch (e) {
        console.error(e);
      }
    }

    fetchUser();
    fetch();
  }, [navigate]);
  return (
    <>
      <div className="flex">
        <div className="">
          <Sidebar typeUser={'dosen'} page={'matakuliah'} />
        </div>
        <div className="flex-1 h-screen overflow-auto">
          <Header typeUser={'dosen'} />
          <div className="px-7 pt-4">
            <Breadcrumb listNav={listNav} />
          </div>
          <main className="p-7 text-wrap">
            <h2 className="text-semibold text-3xl">Mata Kuliah</h2>
            <div className="block mt-3 p-5 bg-white border border-gray-200 rounded-lg shadow">
              <h3 className="text-semibold text-2xl">Daftar Mata Kuliah</h3>
              <div className="relative mt-2 overflow-x-auto shadow-sm sm:rounded-lg">
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
                        Semester
                      </th>
                      <th scope="col" className="px-6 py-3">
                        SKS
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {listMk.map((item, i) => {
                      return (
                        <tr
                          key={i}
                          className="odd:bg-white even:bg-gray-50 border-b"
                        >
                          <td className="px-6 py-4">{item.kode_mk}</td>
                          <td className="px-6 py-4">{item.nama}</td>
                          <td className="px-6 py-4">{item.semester}</td>
                          <td className="px-6 py-4">{item.sks}</td>
                          <td className="px-6 py-4">
                            <Link
                              to={'/dosen/matakuliah/penilaian'}
                              className="flex justify-center items-center focus:outline-none text-white bg-purple-500 hover:bg-purple-600 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-3 py-1.5 me-2 mb-2"
                            >
                              <ClipboardDocumentCheckIcon className="w-5 mr-1" />
                              Penilaian
                            </Link>
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
    </>
  );
}
