import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import Breadcrumb from '../../components/Breadcrumb';
import Pagination from '../../components/Pagination';
import {
  ClipboardDocumentListIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/solid';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getDosenMataKuliah } from '../../api/dosen';
import { getUserRole } from '../../api/user';

export default function Rps() {
  const [listMk, setListMk] = useState([]);
  const navigate = useNavigate();
  const listNav = [{ name: 'RPS', link: '/dosen/rps' }];

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
          <Sidebar typeUser={'dosen'} page={'rps'} />
        </div>
        <div className="flex-1 h-screen overflow-auto">
          <Header typeUser={'dosen'} />
          <div className="px-7 pt-4">
            <Breadcrumb listNav={listNav} />
          </div>
          <main className="p-7 text-wrap">
            <h2 className="text-semibold text-3xl">RPS</h2>
            <div className="block mt-3 p-5 bg-white border border-gray-200 rounded-lg shadow">
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
                          <td className="px-6 py-4">
                            <Link
                              to={`/dosen/rps/${item.id}/clo`}
                              className="flex justify-center items-center focus:outline-none text-white bg-lime-500 hover:bg-lime-600 focus:ring-4 focus:ring-lime-300 font-medium rounded-lg text-sm px-3 py-1.5 me-2 mb-2"
                            >
                              <ClipboardDocumentListIcon className="w-5 mr-1" />
                              CLO
                            </Link>
                            <Link
                              to={`/dosen/rps/detail/${item.id}`}
                              className="flex justify-center items-center focus:outline-none text-white bg-orange-500 hover:bg-orange-600 focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm px-3 py-1.5 me-2 mb-2"
                            >
                              <DocumentTextIcon className="w-5 mr-1" />
                              Lihat RPS
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
