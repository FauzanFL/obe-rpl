import { useState, useEffect, useCallback, useRef } from 'react';
import Breadcrumb from '../../../components/Breadcrumb';
import Header from '../../../components/Header';
import Sidebar from '../../../components/Sidebar';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserRole } from '../../../api/user';
import Loader from '../../../components/Loader';
import Spreadsheet from 'react-spreadsheet';
import { getMataKuliahById } from '../../../api/matakuliah';
import { getKelasById } from '../../../api/kelas';
import {
  createPenilaian,
  deletePenilaian,
  getDataPenilaian,
  updatePenilaian,
} from '../../../api/penilaian';
import { alertFailed, alertInfo, alertSuccess } from '../../../utils/alert';

export default function PenilaianKelasDosen() {
  const [dataPenilaian, setDataPenilaian] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAlert, setIsAlert] = useState(false);
  const [mk, setMk] = useState({});
  const [kelas, setKelas] = useState({});
  const [data, setData] = useState([]);
  const params = useParams();
  const navigate = useNavigate();
  let firstData = useRef([]);

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

  // const render = useCallback(async () => {
  //   try {
  //     const resData = await getDataPenilaian(params.mkId, params.kelasId);
  //     if (resData) {
  //       setDataPenilaian(resData);
  //       const listNilai = settingData(resData);
  //       firstData.current = listNilai;
  //       setData(listNilai);
  //       setIsLoading(false);
  //     }
  //   } catch (e) {
  //     console.error(e);
  //   }
  // }, [params, settingData]);

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
        if (resData) {
          setDataPenilaian(resData);
          const listNilai = settingData(resData);
          firstData.current = listNilai;
          setData(listNilai);
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

  const addData = async (data) => {
    try {
      await createPenilaian(data);
      return false;
    } catch (e) {
      console.error(e);
      return true;
    }
  };

  const updateData = async (id, data) => {
    try {
      await updatePenilaian(data, id);
      return false;
    } catch (e) {
      console.error(e);
      return true;
    }
  };

  const deleteData = async (id) => {
    try {
      await deletePenilaian(id);
      return false;
    } catch (e) {
      console.error(e);
      return true;
    }
  };

  const handleSave = () => {
    setIsLoading(true);
    let isError = false;
    let isChange = false;
    data.forEach((item, i) => {
      item.forEach(async (nilai, j) => {
        const nilaiFloat = parseFloat(nilai.value);
        if (nilai.value != firstData.current[i][j].value) {
          isChange = true;
          if (firstData.current[i][j].value == '') {
            // add data
            const dataAdd = {
              nilai: nilaiFloat,
              assessment_id: nilai.assessment_id,
              mhs_id: nilai.mhs_id,
              tahun_ajaran_id: 1,
            };
            isError = await addData(dataAdd);
            if (isError) {
              return;
            }
          } else if (firstData.current[i][j].value != '') {
            if (nilai.value == '' || nilai.value === undefined) {
              // delete data
              isError = await deleteData(nilai.id);
              if (isError) {
                return;
              }
            } else {
              // update data
              const dataUpdate = {
                nilai: nilaiFloat,
                assessment_id: nilai.assessment_id,
                mhs_id: nilai.mhs_id,
                tahun_ajaran_id: nilai.tahun_ajaran_id,
              };
              isError = await updateData(nilai.id, dataUpdate);
              if (isError) {
                return;
              }
            }
          }
        }
      });
    });
    if (!isError) {
      if (isChange) {
        firstData.current = data;
        setIsAlert(true);
        alertSuccess('Berhasil menyimpan data');
      } else {
        alertInfo('Tidak ada data yang berubah');
      }
      setIsLoading(false);
    } else {
      setIsLoading(false);
      alertFailed('Error saat menyimpan data');
    }
  };

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
              {isAlert && (
                <div
                  id="alert-3"
                  className="flex items-center p-3 mb-2 text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-400"
                  role="alert"
                >
                  <svg
                    className="flex-shrink-0 w-4 h-4"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                  </svg>
                  <span className="sr-only">Info</span>
                  <div className="ms-3 text-sm font-medium">
                    Silakan{' '}
                    <span
                      className="underline text-blue-500 cursor-pointer"
                      onClick={() => location.reload()}
                    >
                      refresh
                    </span>{' '}
                    halaman untuk melihat data terbaru
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAlert(false)}
                    className="ms-auto -mx-1.5 -my-1.5 bg-yellow-50 text-yellow-500 rounded-lg focus:ring-2 focus:ring-yellow-400 p-1.5 hover:bg-yellow-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-yellow-400 dark:hover:bg-gray-700"
                    data-dismiss-target="#alert-3"
                    aria-label="Close"
                  >
                    <span className="sr-only">Close</span>
                    <svg
                      className="w-3 h-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 14"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                      />
                    </svg>
                  </button>
                </div>
              )}
              <div className="overflow-auto">
                <Spreadsheet
                  className="font-semibold"
                  data={data}
                  onChange={setData}
                  columnLabels={colLabel}
                  rowLabels={rowLabel}
                />
              </div>
              <div className="">
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex justify-center items-center focus:outline-none text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1.5 me-2 mb-2"
                >
                  Simpan
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
      {isLoading && <Loader />}
    </>
  );
}
