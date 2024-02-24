import { useState, useEffect } from 'react';
import Breadcrumb from '../../../components/Breadcrumb';
import Header from '../../../components/Header';
import Sidebar from '../../../components/Sidebar';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getUserRole } from '../../../api/user';
import Loader from '../../../components/Loader';
import { ClipboardDocumentIcon, DocumentIcon } from '@heroicons/react/24/solid';
import { getMataKuliahById } from '../../../api/matakuliah';
import { getKelasDosenByMkId } from '../../../api/plotting';

export default function PenilaianDosen() {
  const [isLoading, setIsLoading] = useState(false);
  const [mk, setMk] = useState({});
  const [listKelas, setListKelas] = useState([]);
  const navigate = useNavigate();
  const params = useParams();
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
    async function fetchMk() {
      try {
        const res = await getMataKuliahById(params.mkId);
        if (res) {
          setMk(res);
        }
      } catch (e) {
        console.error(e);
      }
    }
    async function fetchKelas() {
      try {
        const res = await getKelasDosenByMkId(params.mkId);
        if (res) {
          setListKelas(res);
        }
      } catch (e) {
        console.error(e);
      }
    }
    setIsLoading(true);
    fetchUser();
    fetchMk();
    fetchKelas();
    setIsLoading(false);
  }, [navigate, params]);

  const listNav = [
    { name: 'Mata Kuliah', link: '/dosen/matakuliah' },
    {
      name: `Penilaian ${mk.kode_mk}`,
      link: `/dosen/matakuliah/${mk.id}/penilaian`,
    },
  ];
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
            <h2 className="text-semibold text-3xl">Penilaian {mk.nama}</h2>
            <div className="block mt-3 p-5 bg-white border border-gray-200 rounded-lg shadow">
              <h3 className="text-semibold text-2xl">Daftar Kelas</h3>
              <div className="relative mt-2 overflow-x-auto shadow-sm sm:rounded-lg">
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
                    {listKelas.map((item, i) => {
                      return (
                        <tr
                          key={i}
                          className="odd:bg-white even:bg-gray-50 border-b"
                        >
                          <td className="px-6 py-4">{item.kode_kelas}</td>
                          <td className="px-6 py-4">
                            <Link
                              to={`/dosen/matakuliah/${mk.id}/penilaian/kelas/${item.id}`}
                              className="flex justify-center items-center focus:outline-none max-w-60 text-white bg-indigo-500 hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-3 py-1.5 me-2 mb-2"
                            >
                              <ClipboardDocumentIcon className="w-5 mr-1" />
                              Nilai
                            </Link>
                            <Link
                              to={``}
                              className="flex justify-center items-center focus:outline-none max-w-60 text-white bg-fuchsia-500 hover:bg-fuchsia-600 focus:ring-4 focus:ring-fuchsia-300 font-medium rounded-lg text-sm px-3 py-1.5 me-2 mb-2"
                            >
                              <DocumentIcon className="w-5 mr-1" />
                              File Assessment
                            </Link>
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
      {isLoading && <Loader />}
    </>
  );
}
