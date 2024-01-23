import { useEffect } from 'react';
import Breadcrumb from '../../../components/Breadcrumb';
import Header from '../../../components/Header';
import Sidebar from '../../../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import { getUserRole } from '../../../api/user';

export default function PenilaianDosen() {
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
    fetchUser();
  }, [navigate]);
  const listNav = [
    { name: 'Mata Kuliah', link: '/dosen/matakuliah' },
    { name: 'Penilaian', link: '/dosen/matakuliah/penilaian' },
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
          </main>
        </div>
      </div>
    </>
  );
}
