import { useEffect, useRef, useState } from 'react';
import { ReactGrid, Column, Row } from '@silevis/reactgrid';
import '@silevis/reactgrid/styles.css';
import React from 'react';
import Sidebar from '../../../components/Sidebar';
import Header from '../../../components/Header';
import Breadcrumb from '../../../components/Breadcrumb';
import { getUserRole } from '../../../api/user';
import { useNavigate, useParams } from 'react-router-dom';
import { getMataKuliahById } from '../../../api/matakuliah';
import Loader from '../../../components/Loader';
import { getKelasByMkId } from '../../../api/plotting';
import { getDataPenilaian } from '../../../api/penilaian';
import { ArrowDownTrayIcon, CheckBadgeIcon, PrinterIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { deleteBeritaAcara, getBeritaAcaraByPenilaian } from '../../../api/beritaAcara';
import { alertFailed, alertSuccess } from '../../../utils/alert';
import { useReactToPrint } from 'react-to-print';
import BeritaAcaraPdf from '../../../utils/BeritaAcaraPdf';
import exceljs from 'exceljs';

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

interface Dosen {
  id: number;
  kode_dosen: string;
  nama: string;
  user_id: number;
}

interface BeritaAcara {
  id: number;
  mata_kuliah: Matakuliah;
  dosen: Dosen;
  kelas: Kelas;
  nilai: NilaiMahasiswa[];
  penilaian_id: number;
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
  const [kelas, setKelas] = useState<Kelas>({
    id: 0,
    kode_kelas: '',
  });
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
  const [beritaAcara, setBeritaAcara] = useState<BeritaAcara>({
    id: 0,
    mata_kuliah: mk,
    dosen: {
      id: 0,
      kode_dosen: '',
      nama: '',
      user_id: 0,
    },
    kelas: kelas,
    nilai: penilaian.nilai,
    penilaian_id: penilaian.id,
  });
  const navigate = useNavigate();
  const params = useParams();
  const [isFinal, setIsFinal] = useState(false);

  const pdfRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => pdfRef.current || null,
    documentTitle: `BA NA ${mk.kode_mk} ${kelas.kode_kelas}`,
  });

  function isFloat(num) {
    return num % 1 !== 0 && num % 1 > 0;
  }

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
          setKelas(res[0]);
          try {
            const resData = await getDataPenilaian(
              params.mkId,
              res[0].id,
            );
            if (resData) {
              setDataPenilaian(resData);
              setPenilaian(resData.penilaian);
              if (resData.penilaian.status === 'final') {
                setIsFinal(true);
              }
              try {
                const res = await getBeritaAcaraByPenilaian(resData.penilaian.id);
                if (res) {
                  setBeritaAcara(res)
                }
              } catch (e) {
                setIsLoading(false);
              }
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

  const render = async () => {
    try {
      const resData = await getDataPenilaian(mk.id,kelas.id);
      if (resData) {
        setDataPenilaian(resData);
        setPenilaian(resData.penilaian);
        if (resData.penilaian.status === 'final') {
          setIsFinal(true);
        } else {
          setIsFinal(false)
        }
        try {
          const res = await getBeritaAcaraByPenilaian(resData.penilaian.id);
          if (res) {
            setBeritaAcara(res)
          }
        } catch (e) {
          setIsLoading(false);
        }
        setIsLoading(false);
      }
    } catch (e) {
      console.error(e);
    }
  }

  const handleResetFinalisasi = async () => {
    try {
      const res = await getBeritaAcaraByPenilaian(penilaian.id);
      if (res) {
        try {
          const response = await deleteBeritaAcara(res.id);
          if (response) {
            render()
            alertSuccess('Berhasil reset finalisasi')
          }
        } catch (e) {
          console.error(e);
          alertFailed('Gagal reset finalisasi')
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  const formatFloat = (value: number): number => {
    const num = value.toString().split('.');
    if (num[1] && num[1].length > 2) {
      return parseFloat(value.toFixed(2));
    } else {
      return value;
    }
  }

  const getData = (): any[][] => {
    const data: any[][] = [];

    // Add header row
    const headerRow = columns.map((column) => column.columnId.toString());
    data.push(headerRow);

    // Add data rows
    penilaian.nilai.forEach((nilai) => {
      const rowData = [nilai.nim, nilai.nama]
      const rowAssessment = nilai.nilai_assessment.map((item) => {
        return item.nilai;
      });
      let na = 0;
      const rowClo = cloAssessment.map((clo) => {
        let cloNilai = 0;
        let count = 0
        nilai.nilai_assessment.forEach((nilaiAssessment) => {
          const assessment = clo.assessments.find(
            (assessment) => assessment.id === nilaiAssessment.assessment_id
          );
          if (assessment) {
            cloNilai += nilaiAssessment.nilai;
            count++
          }
        }
        );
        cloNilai = cloNilai / count;
        na += cloNilai;
        return formatFloat(cloNilai);
      }
      );
      const nilaiTotal = na / cloAssessment.length;
      
      data.push([...rowData, ...rowAssessment, ...rowClo, formatFloat(nilaiTotal)]);
    });

    return data;
  }

  const handleDownload = () => {
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet(`Penilaian ${mk.kode_mk} ${kelas.kode_kelas}`);

    const data = getData();
    worksheet.addRows(data);

    worksheet.columns.forEach((column) => {
      column.width = column.header ? (column.header.length < 12 ? 12 : column.header.length + 4) : 12;
      column.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    })
    
    // Apply styling to the header row
    worksheet.getRow(1).height = 20;
    worksheet.getRow(1).eachCell((cell) => {
      cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
      };
      
      cell.font = { bold: true };
      cell.alignment = { horizontal: 'center' };
      cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'CCCCCC' },
      };
    });

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Penilaian ${mk.kode_mk} ${kelas.kode_kelas}.xlsx`;
      a.click();
    }
    );
  }

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
  
  const getRows = (penilaian: Penilaian): Row[] => {
    
    const rows: Row[] = [
      headerRow,
      ...penilaian.nilai.map<Row>((nilai: NilaiMahasiswa, idx) => {
          let na: number = 0;

          return {
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
                let count = 0;
                nilai.nilai_assessment.forEach((nilaiAssessment) => {
                  const assessment = clo.assessments.find(
                    (assessment) => assessment.id === nilaiAssessment.assessment_id
                  );
                  if (assessment) {
                    cloNilai += nilaiAssessment.nilai;
                    count++
                  }
                });
                const avgClo = cloNilai / count;
                na += avgClo;
                return {
                  type: "number" as "number",
                  clo_id: clo.id,
                  value: formatFloat(avgClo),
                  nonEditable: true,
                };
              }),
              { type: "number" as "number", value: formatFloat(na / cloAssessment.length), nonEditable: true, },
            ]
          }
        }),
      ];
      return rows;
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
                    setKelas(item);
                    try {
                      const resData = await getDataPenilaian(
                        params.mkId,
                        item.id
                      );
                      if (resData) {
                        setDataPenilaian(resData);
                        setPenilaian(resData.penilaian)
                        if (resData.penilaian.status === 'final') {
                          setIsFinal(true);
                        } else {
                          setIsFinal(false);
                        }
                        try {
                          const res = await getBeritaAcaraByPenilaian(resData.penilaian.id);
                          if (res) {
                            setBeritaAcara(res)
                          }
                        } catch (e) {
                          setIsLoading(false);
                        }
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
                        kelas.kode_kelas === item.kode_kelas
                          ? 'bg-slate-50 text-gray-400 pointer-events-none'
                          : 'bg-slate-100 hover:bg-slate-50 hover:text-gray-400'
                      }`}
                    >
                      {item.kode_kelas}
                    </button>
                  );
                })}
              </div>
              <div className="mt-2 flex justify-between">
                <div className="hidden">
                  <BeritaAcaraPdf
                  ref={pdfRef || null}
                  beritaAcara={beritaAcara}
                  cloAssessment={dataPenilaian.clo_assessment}
                  />
                </div>
                <div className="flex">
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="flex justify-center items-center focus:outline-none h-fit text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-3 py-1.5 me-2 mb-2"
                    >
                    <ArrowDownTrayIcon className='h-5 w-5 mr-1'/>
                    Download
                  </button>
                  {isFinal && (
                    <button
                      type="button"
                      onClick={handlePrint}
                      className="flex justify-center items-center focus:outline-none h-fit text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-3 py-1.5 me-2 mb-2"
                    >
                      <PrinterIcon className='h-5 w-5 mr-1'/>
                      Cetak Berita Acara
                    </button>
                  )}
                </div>
                {isFinal && (
                  <div className="flex flex-col justify-center items-center">
                    <button
                      type="button"
                      onClick={handleResetFinalisasi}
                      className={`flex justify-center items-center bg-red-600 hover:bg-red-700  focus:ring-red-300 focus:ring-4 focus:outline-none h-fit text-white  font-medium rounded-lg text-sm px-3 py-1.5 me-2 mb-2`}
                    >
                      <XCircleIcon className='h-5 w-5 mr-1'/>
                      Batalkan Finalisasi
                    </button>
                      <div className="flex text-green-500 mb-2">
                        <CheckBadgeIcon className="h-5 w-5" />
                        <span className="text-sm font-semibold">
                          Terfinalisasi
                        </span>
                      </div>
                  </div>
                )}
              </div>
              <div className="overflow-auto">
              <ReactGrid rows={rows} columns={columns} stickyTopRows={1} enableRangeSelection />
              </div>
            </div>
          </main>
        </div>
      </div>
      {isLoading && <Loader />}
    </>
  );
}
