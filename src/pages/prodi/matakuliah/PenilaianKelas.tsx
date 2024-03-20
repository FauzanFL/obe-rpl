import { useCallback, useEffect, useRef, useState } from 'react';
import { ReactGrid, Column, Row } from '@silevis/reactgrid';
import '@silevis/reactgrid/styles.css';
import React from 'react';
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

export default function PenilaianKelas() {
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
  const [listKelas, setListKelas] = useState<Kelas[]>([]);
  const [kelas, setKelas] = useState('');
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
  const [isLoading, setIsLoading] = useState(false);
  const [penilaian, setPenilaian] = useState<Penilaian>({
    id: 0,
    nilai: [],
    status: '',
    mk_id: 0,
    kelas_id: 0,
  })
  // const [data, setData] = useState([]);
  const navigate = useNavigate();
  const params = useParams();
  // const tahunAjar = useRef({});

  function isFloat(num) {
    return num % 1 !== 0 && num % 1 > 0;
  }

  // const settingData = useCallback((dataToSet) => {
  //   const mahasiswaNilai = dataToSet.mahasiswa_nilai;
  //   const cloAssessment = dataToSet.clo_assessment;
  //   let listAssessments = [];
  //   if (cloAssessment !== undefined && cloAssessment.length !== 0) {
  //     cloAssessment.forEach((item) => {
  //       let assessments = [];
  //       const assessment = item.assessment;
  //       if (assessment !== undefined && assessment.length !== 0) {
  //         assessments = assessment.map((item) => item);
  //       }
  //       if (assessments.length !== 0) {
  //         listAssessments.push(...assessments);
  //       }
  //     });
  //   }
  //   let listNilai = [];
  //   if (mahasiswaNilai !== undefined && mahasiswaNilai.length !== 0) {
  //     mahasiswaNilai.forEach((item1) => {
  //       let nilai = [];
  //       listAssessments.forEach((assessment) => {
  //         if (item1.penilaian.length !== 0) {
  //           const n = item1.penilaian.find(
  //             (item2) => assessment.id === item2.assessment_id
  //           );
  //           if (n) {
  //             nilai.push({
  //               id: n.id,
  //               value: n.nilai,
  //               mhs_id: item1.id,
  //               assessment_id: assessment.id,
  //               clo_id: assessment.clo_id,
  //               bobot: assessment.bobot,
  //               tahun_ajaran_id: n.tahun_ajaran_id,
  //               readOnly: true,
  //             });
  //           } else {
  //             nilai.push({
  //               value: '',
  //               mhs_id: item1.id,
  //               assessment_id: assessment.id,
  //               clo_id: assessment.clo_id,
  //               bobot: assessment.bobot,
  //             });
  //           }
  //         } else {
  //           nilai.push({
  //             value: '',
  //             mhs_id: item1.id,
  //             bobot: assessment.bobot,
  //             clo_id: assessment.clo_id,
  //             assessment_id: assessment.id,
  //           });
  //         }
  //       });
  //       const clo = cloAssessment.map((value) => {
  //         let cloNilai = 0;
  //         nilai.forEach((n) => {
  //           if (n.clo_id == value.id) {
  //             const nilaiFloat = n.value * n.bobot;
  //             cloNilai += nilaiFloat;
  //           }
  //         });
  //         if (isFloat(cloNilai)) {
  //           cloNilai = cloNilai.toFixed(2);
  //         }
  //         return {
  //           value: cloNilai,
  //           mhs_id: item1.id,
  //           bobot: value.bobot,
  //           clo_id: value.id,
  //           readOnly: true,
  //         };
  //       });
  //       const na = clo.reduce((acc, current) => {
  //         return acc + parseFloat(current.value);
  //       }, 0);
  //       nilai.push(...clo);
  //       nilai.push({
  //         value: na,
  //         mhs_id: item1.id,
  //         readOnly: true,
  //       });
  //       listNilai.push(nilai);
  //     });
  //   }
  //   return listNilai;
  // }, []);

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
            const resData = await getDataPenilaian(
              params.mkId,
              res[0].id,
            );
            if (resData) {
              setDataPenilaian(resData);
              setPenilaian(resData.penilaian);
              // const listNilai = settingData(resData);
              // setData(listNilai);
              setIsLoading(false);
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
  }, [navigate, params]);

  // const mahasiswaNilai = dataPenilaian.mahasiswa_nilai;
  // const cloAssessment = dataPenilaian.clo_assessment;
  // let colLabel = [];
  // let rowLabel = [];
  // if (mahasiswaNilai !== undefined && mahasiswaNilai.length !== 0) {
  //   rowLabel = mahasiswaNilai.map((item) => item.nama);
  // }
  // if (cloAssessment !== undefined && cloAssessment.length !== 0) {
  //   let clo = [];
  //   cloAssessment.forEach((item) => {
  //     let assessments = [];
  //     const assessment = item.assessment;
  //     if (assessment !== undefined && assessment.length !== 0) {
  //       assessments = assessment.map(
  //         (item) => `${item.nama}\n(${item.bobot * 100 + '%'})`
  //       );
  //     }
  //     if (assessments.length !== 0) {
  //       colLabel.push(...assessments);
  //     }
  //     clo.push(`${item.nama}\n(${item.bobot * 100 + '%'})`);
  //   });
  //   colLabel.push(...clo);
  //   colLabel.push('NA');
  // }

  const listNav = [
    { name: 'Penilaian', link: '/prodi/penilaian' },
    {
      name: `${mk.kode_mk}`,
      link: `/prodi/penilaian/matakuliah/${mk.id}`,
    },
  ];

  const cloAssessment = dataPenilaian.clo_assessment;
  let headers: { id: number; type: string; }[] = []

  const getColumns = (): Column[] => {
    const columns: Column[] = [
      { columnId: "nim", width: 150 },
      { columnId: "nama", width: 150 },
    ];

    let cloColumns: Column[] = [];
    let assessmentColumns: Column[] = [];
    let cloHeaders: { id: number; type: string; }[] = []
    let assessmentHeaders: { id: number; type: string; }[] = []

    cloAssessment.forEach((clo) => {
      clo.assessments.forEach((assessment) => {
        assessmentHeaders.push({ id: assessment.id, type: "assessment" })
        assessmentColumns.push({
          columnId: `${assessment.nama} (${assessment.bobot * 100}%)`,
          width: 150,
        })
      })
      cloHeaders.push({ id: clo.id, type: "clo" })
      cloColumns.push({
        columnId: `${clo.nama} (${clo.bobot * 100}%)`,
        width: 150,
      })
    });

    const col : Column = {
      columnId: "NA",
      width: 150,
    }

    headers.push({ id: 0, type: "nim"}, { id: 0, type: "nama"}, ...assessmentHeaders, ...cloHeaders, { id: 0, type: "NA" })
    
    return [...columns, ...assessmentColumns, ...cloColumns, col];
  };
  
  const columns = getColumns()

  const headerRow: Row = {
    rowId: "header",
    cells: columns.map((column) => ({
      type: "header",
      text: column.columnId.toString(),
    })),
  };

  const numOfRow: number = 10;
  
  const getRows = (penilaian: Penilaian): Row[] => {
    if (penilaian.nilai.length === 0) {
      const emptyRow: Row[] = [
        headerRow,
        ...Array.from({ length: numOfRow }, (_, i) => i).map((i) => ({
          rowId: i,
          cells: columns.map((item) => {
            if (item.columnId == 'nim' || item.columnId == 'nama') {
              return { type: "text" as "text", text: "", id: 1, nonEditable: true, }
            } else {
              return { type: "number" as "number", value: NaN, nanToZero: true, nonEditable: true, }
            }
          }),
        })),
      ];
      return emptyRow;
    } else {
      let na: number = 0;
      const rows: Row[] = [
        headerRow,
        ...penilaian.nilai.map<Row>((nilai: NilaiMahasiswa, idx) => ({
          rowId: nilai.nim,
          cells: [
            { type: "text", text: nilai.nim, nonEditable: true, },
            { type: "text", text: nilai.nama, nonEditable: true, },
            ...nilai.nilai_assessment.map((nilaiAssessment: NilaiAssessment) => ({
              type: "number" as "number",
              assessment_id: nilaiAssessment.assessment_id,
              value: nilaiAssessment.nilai,
              nonEditable: true,
            })),
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
              };
            }),
            { type: "number" as "number", value: na, nonEditable: true, },
          ]
        })),
      ];
      return rows;
    }
  }

  const rows = getRows(penilaian);
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
                        item.id
                      );
                      if (resData) {
                        setDataPenilaian(resData);
                        setPenilaian(resData.penilaian)
                        // const listNilai = settingData(resData);
                        // setData(listNilai);
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
              <ReactGrid rows={rows} columns={columns} stickyTopRows={1} enableRangeSelection />
                {/* <Spreadsheet
                  className="font-semibold"
                  data={data}
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
