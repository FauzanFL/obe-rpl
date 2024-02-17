import { useState, useEffect } from 'react';
import Breadcrumb from '../../../components/Breadcrumb';
import Header from '../../../components/Header';
import Sidebar from '../../../components/Sidebar';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserRole } from '../../../api/user';
import Loader from '../../../components/Loader';
import Spreadsheet from 'react-spreadsheet';
import { getMataKuliahById } from '../../../api/matakuliah';
import { getKelasById } from '../../../api/kelas';
import { getDataPenilaian } from '../../../api/penilaian';

export default function PenilaianKelasDosen() {
  const [dataPenilaian, setDataPenilaian] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mk, setMk] = useState({});
  const [kelas, setKelas] = useState({});
  const firstData = [
    [{ value: 'Vanilla' }, { value: 'Chocolate' }, { value: '' }],
    [{ value: 'Strawberry' }, { value: 'Cookies' }, { value: '' }],
  ];
  const [data, setData] = useState(firstData);
  const params = useParams();

  const navigate = useNavigate();
  useEffect(() => {
    setIsLoading(true);
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
        const res = await getKelasById(params.kelasId);
        if (res) {
          setKelas(res);
        }
      } catch (e) {
        console.error(e);
      }
    }

    async function fetch() {
      try {
        const resData = await getDataPenilaian(params.mkId, params.kelasId);
        console.log(resData);
        if (resData) {
          setDataPenilaian(resData);
          setIsLoading(false);
        }
      } catch (e) {
        console.error(e);
      }
    }

    fetchUser();
    fetchMk();
    fetchKelas();
    fetch();
  }, [navigate, params]);

  const mahasiswaNilai = dataPenilaian.mahasiswa_nilai;
  const cloAssessment = dataPenilaian.clo_assessment;
  let colLabel = [];
  let rowLabel = [];
  if (mahasiswaNilai !== undefined && mahasiswaNilai.length !== 0) {
    rowLabel = mahasiswaNilai.map((item) => item.nama);
  }
  if (cloAssessment !== undefined && cloAssessment.length !== 0) {
    cloAssessment.forEach((item) => {
      let assessments = [];
      const assessment = item.assessment;
      if (assessment !== undefined && assessment.length !== 0) {
        assessments = assessment.map((item) => item.nama);
      }
      if (assessments.length !== 0) {
        colLabel.push(assessments);
      }
    });
  }

  const listNav = [
    { name: 'Mata Kuliah', link: '/dosen/matakuliah' },
    {
      name: `Penilaian ${mk.kode_mk}`,
      link: `/dosen/matakuliah/${mk.id}/penilaian`,
    },
    {
      name: `${kelas.kode_kelas}`,
      link: `/dosen/matakuliah/${mk.id}/penilaian/kelas/${kelas.id}`,
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
