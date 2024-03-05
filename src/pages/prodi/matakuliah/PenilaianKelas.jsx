import { useCallback, useEffect, useRef, useState } from 'react';
import Spreadsheet from 'react-spreadsheet';
import Sidebar from '../../../components/Sidebar';
import Header from '../../../components/Header';
import Breadcrumb from '../../../components/Breadcrumb';
import { getUserRole } from '../../../api/user';
import { useNavigate, useParams } from 'react-router-dom';
import { getMataKuliahById } from '../../../api/matakuliah';
import Loader from '../../../components/Loader';
import { getKelasByMkId } from '../../../api/plotting';
import { getDataPenilaian } from '../../../api/penilaian';
import { getTahunAjaranNow } from '../../../api/tahunAjaran';

export default function PenilaianKelas() {
  const [dataPenilaian, setDataPenilaian] = useState([]);
  const [listKelas, setListKelas] = useState([]);
  const [kelas, setKelas] = useState('SE04A');
  const [mk, setMk] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const params = useParams();
  const tahunAjar = useRef({});

  function isFloat(num) {
    return num % 1 !== 0 && num % 1 > 0;
  }

  const settingData = useCallback((dataToSet) => {
    const mahasiswaNilai = dataToSet.mahasiswa_nilai;
    const cloAssessment = dataToSet.clo_assessment;
    let listAssessments = [];
    if (cloAssessment !== undefined && cloAssessment.length !== 0) {
      cloAssessment.forEach((item) => {
        let assessments = [];
        const assessment = item.assessment;
        if (assessment !== undefined && assessment.length !== 0) {
          assessments = assessment.map((item) => item);
        }
        if (assessments.length !== 0) {
          listAssessments.push(...assessments);
        }
      });
    }
    let listNilai = [];
    if (mahasiswaNilai !== undefined && mahasiswaNilai.length !== 0) {
      mahasiswaNilai.forEach((item1) => {
        let nilai = [];
        listAssessments.forEach((assessment) => {
          if (item1.penilaian.length !== 0) {
            const n = item1.penilaian.find(
              (item2) => assessment.id === item2.assessment_id
            );
            if (n) {
              nilai.push({
                id: n.id,
                value: n.nilai,
                mhs_id: item1.id,
                assessment_id: assessment.id,
                clo_id: assessment.clo_id,
                bobot: assessment.bobot,
                tahun_ajaran_id: n.tahun_ajaran_id,
                readOnly: true,
              });
            } else {
              nilai.push({
                value: '',
                mhs_id: item1.id,
                assessment_id: assessment.id,
                clo_id: assessment.clo_id,
                bobot: assessment.bobot,
              });
            }
          } else {
            nilai.push({
              value: '',
              mhs_id: item1.id,
              bobot: assessment.bobot,
              clo_id: assessment.clo_id,
              assessment_id: assessment.id,
            });
          }
        });
        const clo = cloAssessment.map((value) => {
          let cloNilai = 0;
          nilai.forEach((n) => {
            if (n.clo_id == value.id) {
              const nilaiFloat = n.value * n.bobot;
              cloNilai += nilaiFloat;
            }
          });
          if (isFloat(cloNilai)) {
            cloNilai = cloNilai.toFixed(2);
          }
          return {
            value: cloNilai,
            mhs_id: item1.id,
            bobot: value.bobot,
            clo_id: value.id,
            readOnly: true,
          };
        });
        const na = clo.reduce((acc, current) => {
          return acc + parseFloat(current.value);
        }, 0);
        nilai.push(...clo);
        nilai.push({
          value: na,
          mhs_id: item1.id,
          readOnly: true,
        });
        listNilai.push(nilai);
      });
    }
    return listNilai;
  }, []);

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
        const res = await getKelasByMkId(params.mkId);
        if (res) {
          setListKelas(res);
          setKelas(res[0].kode_kelas);
          try {
            const tahun = await getTahunAjaranNow();
            tahunAjar.current = tahun;
            try {
              const resData = await getDataPenilaian(
                params.mkId,
                res[0].id,
                tahun.id
              );
              if (resData) {
                setDataPenilaian(resData);
                const listNilai = settingData(resData);
                setData(listNilai);
                setIsLoading(false);
              }
            } catch (e) {
              console.error(e);
            }
          } catch (e) {
            console.error(e);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }

    fetchUser();
    fetchMk();
    fetchKelas();
  }, [navigate, params, settingData]);

  const mahasiswaNilai = dataPenilaian.mahasiswa_nilai;
  const cloAssessment = dataPenilaian.clo_assessment;
  let colLabel = [];
  let rowLabel = [];
  if (mahasiswaNilai !== undefined && mahasiswaNilai.length !== 0) {
    rowLabel = mahasiswaNilai.map((item) => item.nama);
  }
  if (cloAssessment !== undefined && cloAssessment.length !== 0) {
    let clo = [];
    cloAssessment.forEach((item) => {
      let assessments = [];
      const assessment = item.assessment;
      if (assessment !== undefined && assessment.length !== 0) {
        assessments = assessment.map(
          (item) => `${item.nama}\n(${item.bobot * 100 + '%'})`
        );
      }
      if (assessments.length !== 0) {
        colLabel.push(...assessments);
      }
      clo.push(`${item.nama}\n(${item.bobot * 100 + '%'})`);
    });
    colLabel.push(...clo);
    colLabel.push('NA');
  }

  const listNav = [
    { name: 'Penilaian', link: '/prodi/penilaian' },
    {
      name: `${mk.kode_mk}`,
      link: `/prodi/penilaian/matakuliah/${mk.id}`,
    },
  ];
  return (
    <>
      <div className="flex">
        <div className="">
          <Sidebar typeUser={'prodi'} page={'penilaian'} />
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
                {listKelas.map((item, i) => {
                  const handleKelasChange = async () => {
                    setIsLoading(true);
                    setKelas(item.kode_kelas);
                    try {
                      const resData = await getDataPenilaian(
                        params.mkId,
                        item.id,
                        tahunAjar.current.id
                      );
                      if (resData) {
                        setDataPenilaian(resData);
                        const listNilai = settingData(resData);
                        setData(listNilai);
                        setIsLoading(false);
                      }
                    } catch (e) {
                      console.error(e);
                    }
                  };
                  return (
                    <button
                      key={i}
                      onClick={handleKelasChange}
                      className={`px-3 py-1 ${
                        kelas === item.kode_kelas
                          ? 'bg-slate-50 text-gray-400 pointer-events-none'
                          : 'bg-slate-100 hover:bg-slate-50 hover:text-gray-400'
                      }`}
                    >
                      {item.kode_kelas}
                    </button>
                  );
                })}
              </div>
              <div className="overflow-auto">
                <Spreadsheet
                  className="font-semibold"
                  data={data}
                  columnLabels={colLabel}
                  rowLabels={rowLabel}
                />
              </div>
            </div>
          </main>
        </div>
      </div>
      {isLoading && <Loader />}
    </>
  );
}
