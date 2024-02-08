import { useState, useEffect } from 'react';
import Breadcrumb from '../../../components/Breadcrumb';
import Header from '../../../components/Header';
import Sidebar from '../../../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import { getUserRole } from '../../../api/user';
import Loader from '../../../components/Loader';
import Spreadsheet from 'react-spreadsheet';

export default function PenilaianKelasDosen() {
  const [isLoading, setIsLoading] = useState(false);
  const [kelas, setKelas] = useState('');
  const firstData = [
    [{ value: 'Vanilla' }, { value: 'Chocolate' }, { value: '' }],
    [{ value: 'Strawberry' }, { value: 'Cookies' }, { value: '' }],
  ];
  const [data, setData] = useState(firstData);

  const colLabel = ['Kolom 1', 'Kolom 2'];
  const rowLabel = ['Baris 1', 'Baris 2'];
  const navigate = useNavigate();
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
    setIsLoading(true);
    fetchUser();
    setKelas('SE04A');
    setIsLoading(false);
  }, [navigate]);

  const listNav = [
    { name: 'Mata Kuliah', link: '/dosen/matakuliah' },
    { name: 'Penilaian', link: '/dosen/matakuliah/penilaian' },
    { name: 'Kelas', link: '/dosen/matakuliah/penilaian/kelas' },
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
            <h2 className="text-semibold text-3xl">Penilaian</h2>
            <div className="block mt-3 p-5 bg-white border border-gray-200 rounded-lg shadow">
              <div className="flex mb-4">
                <button
                  className={`px-3 py-1 ${
                    kelas === 'SE04A'
                      ? 'bg-slate-50 text-gray-400 pointer-events-none'
                      : 'bg-slate-100 hover:bg-slate-50 hover:text-gray-400'
                  }`}
                >
                  SE04A
                </button>
                <button
                  className={`px-3 py-1 bg-slate-100 hover:bg-slate-50 hover:text-gray-400`}
                >
                  SE04B
                </button>
                <button
                  className={`px-3 py-1 bg-slate-100 hover:bg-slate-50 hover:text-gray-400`}
                >
                  SE04C
                </button>
              </div>
              <Spreadsheet
                data={data}
                onChange={setData}
                columnLabels={colLabel}
                rowLabels={rowLabel}
              />
            </div>
          </main>
        </div>
      </div>
      {isLoading && <Loader />}
    </>
  );
}
