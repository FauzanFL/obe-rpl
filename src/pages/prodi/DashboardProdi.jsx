import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumb';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import { useState, useEffect } from 'react';
import { getUserRole } from '../../api/user';
import Loader from '../../components/Loader';
import { Bar, BarChart, Legend, Tooltip, XAxis, YAxis } from 'recharts';
import { getDataPenilaianPlo } from '../../api/penilaian';

export default function DashboardProdi() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const navigate = useNavigate();
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
        const res = await getDataPenilaianPlo();
        if (res) {
          setData(res);
        }
        setIsLoading(false);
      } catch (e) {
        console.error(e);
      }
    }

    fetchUser();
    fetch();
  }, [navigate]);

  const renderCustomBarLabel = ({ x, y, width, value }) => {
    return (
      <text
        x={x + width / 2}
        y={y}
        fill="#666"
        textAnchor="middle"
        dy={-6}
      >{`${value}`}</text>
    );
  };

  const listNav = [{ name: 'Dashboard', link: '/prodi/dashboard' }];
  return (
    <>
      <div className="flex">
        <div className="">
          <Sidebar typeUser={'prodi'} page={'dashboard'} />
        </div>
        <div className="flex-1 h-screen overflow-auto">
          <Header typeUser={'prodi'} />
          <div className="px-7 pt-4">
            <Breadcrumb listNav={listNav} />
          </div>
          <main className="p-7 text-wrap">
            <h2 className="text-semibold text-3xl mb-3">Dashboard</h2>
            <div className="block p-5 bg-white border border-gray-200 rounded-lg shadow overflow-auto">
              <h3 className="font-semibold text-center text-xl">
                Total Capaian PLO
              </h3>
              <BarChart width={800} height={300} data={data}>
                <XAxis dataKey={'nama'} />
                <YAxis />
                <Tooltip
                  wrapperStyle={{ width: 100, backgroundColor: '#ccc' }}
                />
                <Bar
                  dataKey={'nilai'}
                  barSize={40}
                  label={renderCustomBarLabel}
                  fill="#337cf2"
                />
                <Legend />
              </BarChart>
            </div>
          </main>
        </div>
      </div>
      {isLoading && <Loader />}
    </>
  );
}
