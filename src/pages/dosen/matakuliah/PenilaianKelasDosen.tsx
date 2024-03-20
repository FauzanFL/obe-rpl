import { useState, useEffect, useRef } from 'react';
import { ReactGrid, Column, Row, CellChange, Cell, TextCell, NumberCell } from '@silevis/reactgrid';
import '@silevis/reactgrid/styles.css';
import React from 'react';
import Breadcrumb from '../../../components/Breadcrumb';
import Header from '../../../components/Header';
import Sidebar from '../../../components/Sidebar';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserRole } from '../../../api/user';
import Loader from '../../../components/Loader';
// import Spreadsheet from 'react-spreadsheet';
import { getMataKuliahById } from '../../../api/matakuliah';
import { getKelasById } from '../../../api/kelas';
import {
  createPenilaian,
  deletePenilaian,
  // createPenilaian,
  // deletePenilaian,
  getDataPenilaian, updatePenilaian,
  // updatePenilaian,
} from '../../../api/penilaian';
// import {
//   alertFailed,
//   alertFinalization,
//   alertInfo,
//   alertSuccess,
// } from '../../../utils/alert';
import { getTahunAjaranNow } from '../../../api/tahunAjaran';
// import { createBeritaAcaraBatch } from '../../../api/beritaAcara';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { alertFailed, alertSuccess } from '../../../utils/alert';

interface Matakuliah {
  id: number;
  kode_mk: string;
  nama: string;
  deskripsi: string;
  sks: number;
  semester: number;
  prasyarat: string;
  obe_id:string;
  tahun_ajaran_id:number;
}

interface Kelas {
  id: number;
  kode_kelas: string;
}

interface NilaiAssessment {
  assessment_id: number;
  nilai: number;
}

interface NilaiMahasiswa {
  nim: string;
  nama: string;
  nilai_assessment: NilaiAssessment[];
}

interface Penilaian {
  id: number;
  nilai: NilaiMahasiswa[];
  status: string;
  mk_id: number;
  kelas_id: number;
}

interface LembarAssessment {
  id: number;
  nama: string;
  deskripsi: string;
  bobot: number;
  clo_id: number;
  jenis_id: number;
  jenis: string;
}

interface CloWithAssessment {
  id: number;
  plo_id: number;
  nama: string;
  deskripsi: string;
  bobot: number;
  mk_id: number;
  assessments: LembarAssessment[];
}

interface DataPenilaian {
  clo_assessment: CloWithAssessment[];
  penilaian: Penilaian;
}

export default function PenilaianKelasDosen() {
  const [dataPenilaian, setDataPenilaian] = useState<DataPenilaian>({
    clo_assessment: [],
    penilaian: {
      id: 0,
      nilai: [],
      status: '',
      mk_id: 0,
      kelas_id: 0,
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isAlertWarning, setIsAlertWarning] = useState(false);
  const [isAlertDanger, setIsAlertDanger] = useState(false);
  const [mk, setMk] = useState<Matakuliah>({
    id: 0,
    kode_mk: '',
    nama: '',
    deskripsi: '',
    sks: 0,
    semester: 0,
    prasyarat: '',
    obe_id:'',
    tahun_ajaran_id:0,
  });
  const [kelas, setKelas] = useState<Kelas>({
    id: 0,
    kode_kelas: '',
  });
  // const [data, setData] = useState([]);
  const [penilaian, setPenilaian] = useState<Penilaian>({
    id: 0,
    nilai: [],
    status: '',
    mk_id: 0,
    kelas_id: 0,
  });
  const [isFinal, setIsFinal] = useState(false);
  const params = useParams();
  const navigate = useNavigate();
  let sumDataNilai = useRef(0);

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
          const resData = await getDataPenilaian(
            params.mkId,
            params.kelasId,
          );
          if (resData) {
            setDataPenilaian(resData);
            const penilaianTemp: Penilaian = resData.penilaian
            penilaianTemp.mk_id = Number(params.mkId)
            penilaianTemp.kelas_id = Number(params.kelasId)
            setPenilaian(penilaianTemp)
            if (resData.penilaian.status === 'final') {
              setIsFinal(true);
            }
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

  const handleSimpan = async (e) => {
    e.preventDefault()
    if (penilaian.id != 0) {
      if (penilaian.nilai.length === 0) {
        // deletePenilaian
        try {
          const res = await deletePenilaian(penilaian.id)
          if (res) {
            alertSuccess('Data berhasil dihapus')
          }
        } catch (e) {
          console.error(e);
          alertFailed("error")
        }
      } else {
        // updatePenilaian
        try {
          const res = await updatePenilaian(penilaian, penilaian.id)
          if (res) {
            alertSuccess('Data berhasil disimpan')
          }
        } catch (e) {
          console.error(e);
          alertFailed("error")
        }
      }
    } else {
      // createPenilaian(penilaian)
      if (penilaian.nilai.length === 0) {
        alertFailed('Data tidak lengkap')
        return
      }
      try {
        const res = await createPenilaian(penilaian)
        if (res) {
          alertSuccess('Data berhasil disimpan')
        }
      } catch (e) {
        console.error(e);
        alertFailed("error")
      }
    }
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

  const cloAssessment = dataPenilaian.clo_assessment;
  let lembarAssessments: LembarAssessment[] = []
  let headers: { id: number; name:string; type: string; }[] = []

  const getColumns = (): Column[] => {
    const columns: Column[] = [
      { columnId: "nim", width: 150 },
      { columnId: "nama", width: 150 },
    ];

    let cloColumns: Column[] = [];
    let assessmentColumns: Column[] = [];
    let cloHeaders: { id: number; name:string; type: string; }[] = []
    let assessmentHeaders: { id: number; name:string; type: string; }[] = []

    cloAssessment.forEach((clo) => {
      clo.assessments.forEach((assessment) => {
        lembarAssessments.push(assessment)
        assessmentHeaders.push({ id: assessment.id, name:`${assessment.nama} (${assessment.bobot * 100}%)`, type: "assessment" })
        assessmentColumns.push({
          columnId: `${assessment.nama} (${assessment.bobot * 100}%)`,
          width: 150,
        })
      })
      cloHeaders.push({ id: clo.id, name:`${clo.nama} (${clo.bobot * 100}%)`, type: "clo" })
      cloColumns.push({
        columnId: `${clo.nama} (${clo.bobot * 100}%)`,
        width: 150,
      })
    });

    const col : Column = {
      columnId: "NA",
      width: 150,
    }

    headers.push({ id: 0, name: 'nim', type: "nim"}, { id: 0, name: 'nama', type: "nama"}, ...assessmentHeaders, ...cloHeaders, { id: 0, name: "NA", type: "NA" })
    
    return [...columns, ...assessmentColumns, ...cloColumns, col];
  };
  
  const columns = getColumns()

  const headerRow: Row = {
    rowId: "header",
    cells: columns.map((column) => ({
      type: "header",
      text: column.columnId.toString(),
    value: null,
    })),
  };

  const numOfRow: number = 70;

  const applyChangesToPenilaian = (
    changes: CellChange<TextCell | NumberCell>[],
    prevPenilaian: Penilaian
  ): Penilaian => {
    let newPenilaian = { ...prevPenilaian };
    changes.forEach((change) => {
      const found = newPenilaian.nilai.find((item) => item.nim === change.rowId);
      if (found) {
        if (change.newCell.type === "text") {
          if (change.columnId === 'nim') {
            found.nim = change.newCell.text
          } else if (change.columnId === 'nama') {
            found.nama = change.newCell.text
          }
        } else {
          const assessment = headers.find((item) => item.name === change.columnId)
          if (assessment) {
            const foundAssessment = found.nilai_assessment.find((item) => item.assessment_id === assessment?.id);
            if (foundAssessment) {
              foundAssessment.nilai = change.newCell.value
            } else {
              const listAssessments = lembarAssessments.map((assess) => {
                if (assess.id === assessment.id && change.type == 'number') {
                  return {
                    assessment_id: assessment.id,
                    nilai: change.newCell.value
                  }
                } else {
                  return {
                    assessment_id: assess.id,
                    nilai: NaN
                  }
                }
              })
              found.nilai_assessment.push(...listAssessments)
            }
          }
        }
      } else {
        let nim:string = ''
        let nama:string = ''
        let assessments:NilaiAssessment[] = []
        if (change.newCell.type === "text") {
          if (change.columnId === 'nim') {
            nim = change.newCell.text
          } else if (change.columnId === 'nama') {
            nama = change.newCell.text
          }
        } else {
          const assessment = headers.find((item) => item.name === change.columnId)
          if (assessment) {
            const listAssessments = lembarAssessments.map((assess) => {
              if (assess.id === assessment.id && change.type == 'number') {
                return {
                  assessment_id: assessment.id,
                  nilai: change.newCell.value
                }
              } else {
                return {
                  assessment_id: assess.id,
                  nilai: NaN
                }
              }
            })
            assessments.push(...listAssessments)
          }
        }
        newPenilaian.nilai.push({
          nim: nim,
          nama: nama,
          nilai_assessment: assessments
        })
      }
    });
    console.log(newPenilaian);
    
    return newPenilaian;
  };

  const handleChanges = (changes: CellChange<any>[]) => { 
    setPenilaian((prevPeople) => applyChangesToPenilaian(changes, prevPeople)); 
  }; 
  
  const getRows = (penilaian: Penilaian): Row[] => {
    if (penilaian.nilai.length === 0) {
      const emptyRow: Row[] = [
        headerRow,
        ...Array.from({ length: numOfRow }, (_, i) => i).map((i) => ({
          rowId: i,
          cells: columns.map((item) => {
            if (item.columnId == 'nim' || item.columnId == 'nama') {
              return { type: "text" as "text", text: "", id: 1 }
            } else if (item.columnId == 'NA') {
              return { type: "number" as "number", value: NaN, nanToZero: true, nonEditable: true }
            } else {
              return { type: "number" as "number", value: NaN, nanToZero: true }
            }
          }),
        })),
      ];
      return emptyRow;
    } else {
      const rows: Row[] = [
        headerRow,
        ...penilaian.nilai.map<Row>((nilai: NilaiMahasiswa, idx) => {
          let na: number = 0;
          return {
          rowId: nilai.nim,
          cells: [
            { type: "text", text: nilai.nim, nonEditable: (penilaian.status === 'final') ? true: false,  },
            { type: "text", text: nilai.nama, nonEditable: (penilaian.status === 'final') ? true: false, },
            ...(nilai.nilai_assessment.length > 0 ? nilai.nilai_assessment.map((nilaiAssessment: NilaiAssessment) => ({
              type: "number" as "number",
              assessment_id: nilaiAssessment.assessment_id,
              value: nilaiAssessment.nilai,
              nanToZero: true,
              nonEditable: (penilaian.status === 'final') ? true: false,
            })) : 
            lembarAssessments.map((assessment) => ({
              type: "number" as "number",
              assessment_id: assessment.id,
              value: NaN,
              nanToZero: true,
              nonEditable: (penilaian.status === 'final') ? true: false,
            }))
            ),
            ...cloAssessment.map((clo) => {
              let cloNilai = 0;
              let cloNilaiArr: number[] = []
              nilai.nilai_assessment.forEach((nilaiAssessment) => {
                const assessment = clo.assessments.find(
                  (assessment) => assessment.id === nilaiAssessment.assessment_id
                );
                if (assessment) {
                  cloNilai += nilaiAssessment.nilai * assessment.bobot;
                  cloNilaiArr.push(nilaiAssessment.nilai)
                }
              });
              na += cloNilai
              const avgClo = cloNilaiArr.reduce((a, b) => a + b, 0) / cloNilaiArr.length
              return {
                type: "number" as "number",
                clo_id: clo.id,
                value: avgClo,
                nonEditable: true,
                nanToZero: true,
                style: {
                  background: '#d1d1d1' 
                }
              };
            }),
            { type: "number" as "number", value: na, nonEditable: true, style: {
              background: '#d1d1d1' 
            } },
          ]
        }
      }),
      ];
      if (penilaian.nilai.length < numOfRow) {
        rows.push(...Array.from({ length: numOfRow - penilaian.nilai.length }, (_, i) => i).map((i) => ({
          rowId: i,
          cells: columns.map((item) => {
            if (item.columnId == 'nim' || item.columnId == 'nama') {
              return { type: "text" as "text", text: "", id: 1 }
              } else {
              return { type: "number" as "number", value: NaN, nanToZero: true }
              }
            }),
          })));
        }
      return rows;
    }
  }

  const rows = getRows(penilaian);

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
              {isAlertWarning && (
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
                    onClick={() => setIsAlertWarning(false)}
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
              {isAlertDanger && (
                <div
                  id="alert-3"
                  className="flex items-center p-3 mb-2 text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
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
                    Data tidak lengkap / data belum terbaca dengan baik silakan{' '}
                    <span
                      className="underline text-blue-500 cursor-pointer"
                      onClick={() => location.reload()}
                    >
                      refresh
                    </span>{' '}
                    halaman terlebih dahulu
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAlertDanger(false)}
                    className="ms-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700"
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
              <div className="mt-2 flex justify-between">
                <button
                  type="button"
                  onClick={handleSimpan}
                  className="flex justify-center items-center focus:outline-none h-fit text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1.5 me-2 mb-2"
                >
                  Simpan
                </button>
                <div className="flex flex-col justify-center items-center">
                  <button
                    type="button"
                    // onClick={handleFinal}
                    className={`flex justify-center items-center ${
                         isFinal
                        ? 'bg-green-600 pointer-events-none'
                        : 'bg-fuchsia-600 hover:bg-fuchsia-700  focus:ring-fuchsia-300 focus:ring-4'
                    } focus:outline-none h-fit text-white  font-medium rounded-lg text-sm px-3 py-1.5 me-2 mb-2`}
                  >
                    Finalisasi
                  </button>
                  {isFinal && (
                    <div className="flex text-green-500">
                      <CheckCircleIcon className="h-5 w-5" />
                      <span className="text-sm font-semibold">
                        Terfinalisasi
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="overflow-auto">
                <ReactGrid rows={rows} columns={columns} onCellsChanged={handleChanges} stickyTopRows={1} enableRangeSelection />
                {/* <Spreadsheet
                  className="font-semibold"
                  data={data}
                  onChange={handleChange}
                  columnLabels={colLabel}
                  rowLabels={rowLabel}
                /> */}
              </div>
            </div>
          </main>
        </div>
      </div>
      {isLoading && <Loader />}
    </>
  );
}
