import { useState, useEffect, useRef} from 'react';
import { ReactGrid, Column, Row, CellChange, TextCell, NumberCell } from '@silevis/reactgrid';
import '@silevis/reactgrid/styles.css';
import React from 'react';
import Breadcrumb from '../../../components/Breadcrumb';
import Header from '../../../components/Header';
import Sidebar from '../../../components/Sidebar';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserRole } from '../../../api/user';
import Loader from '../../../components/Loader';
import { getMataKuliahById } from '../../../api/matakuliah';
import { getKelasById } from '../../../api/kelas';
import {
  createPenilaian,
  deletePenilaian,
  getDataPenilaian, updatePenilaian,
} from '../../../api/penilaian';
import { ArrowDownTrayIcon, CheckBadgeIcon, CheckCircleIcon, DocumentArrowDownIcon } from '@heroicons/react/24/solid';
import { alertFailed, alertFinalization, alertInfo, alertSuccess } from '../../../utils/alert';
import { createBeritaAcara } from '../../../api/beritaAcara';
import exceljs from 'exceljs';
import { getIndexPenilaian } from '../../../api/indexPenilaian';
import { v4 as uuidv4 } from 'uuid';

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
  const [penilaian, setPenilaian] = useState<Penilaian>({
    id: 0,
    nilai: [],
    status: '',
    mk_id: 0,
    kelas_id: 0,
  });
  const [isFinal, setIsFinal] = useState(false);
  const [listIndex, setListIndex] = useState<any[]>([]);
  const params = useParams();
  const navigate = useNavigate();
  const [initialPenilaian, setInitialPenilaian] = useState<Penilaian>({
    id: 0,
    nilai: [],
    status: '',
    mk_id: 0,
    kelas_id: 0,
  });

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
            setInitialPenilaian(JSON.parse(JSON.stringify(penilaianTemp)));
            if (resData.penilaian.status === 'final') {
              setIsFinal(true);
            }
            setIsLoading(false);
          }
        } catch (e) {
          console.error(e);
        }
    }

    async function fetchIndex() {
      const res = await getIndexPenilaian();
      setListIndex(res)
    }

    fetchUser();
    fetchMk();
    fetchKelas();
    fetchIndex();
    fetch();
  }, [navigate, params]);

  const render = async () => {
    setIsLoading(true)
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
      setIsLoading(false)
    }
  }

  const cloAssessment = dataPenilaian.clo_assessment;
  let lembarAssessments: LembarAssessment[] = []
  let headers: { id: number; name:string; type: string; }[] = []

  const formatFloat = (value: number): number => {
    const num = value.toString().split('.');
    if (num[1] && num[1].length > 2) {
      return parseFloat(value.toFixed(2));
    } else {
      return value;
    }
  }

  const processJsonData = (jsonData: exceljs.RowValues[]): Penilaian => {
    const penilaianData: Penilaian = {
      id: penilaian.id,
      nilai: [],
      status: penilaian.status,
      mk_id: penilaian.mk_id,
      kelas_id: penilaian.kelas_id,
    };
  
    const headerRow = jsonData[1];
    const errors = {isError: false, messages: {}}
  
    for (let i = 2; i < jsonData.length; i++) {
      const row = jsonData[i];
      if (row) {
        let nim = row[1]
        if (typeof nim === 'number') {
          nim = nim.toString()
        }
        const nama = row[2]
        
        const isNimExists = penilaianData.nilai.some((item) => item.nim === nim);
        if (!isNimExists) {
          if (/^\d+$/.test(nim)) {
            const nilai = row?.slice(3, lembarAssessments.length+3)?.map((item) => item) ?? [];
            const nilaiAssessment : NilaiAssessment[] = []
            lembarAssessments.forEach((item, i) => {
              let nilaiFinal = 0
              if (nilai[i] >= 0 && nilai[i] <= 100) {
                nilaiFinal = parseFloat(nilai[i])
              } else {
                errors.isError = true
                errors.messages['invalidNilai'] = 'Nilai tidak valid'
              }
              nilaiAssessment.push({
                assessment_id: item.id,
                nilai: nilaiFinal,
              })
            })
            penilaianData.nilai.push({
              nim,
              nama,
              nilai_assessment: nilaiAssessment,
            });
          } else {
            errors.isError = true
            errors.messages['invalidNim'] = 'NIM tidak valid'
          }
        } else {
          errors.isError = true
          errors.messages['exists'] = 'NIM sudah ada'
        }
      }
    }

    if (errors.isError) {
      alertInfo(`Terdapat kesalahan: ${Object.values(errors.messages).join(', ')}`)
    }
  
    return penilaianData;
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const workbook = new exceljs.Workbook();
    const reader = new FileReader();
  
    reader.onload = async (e) => {
      setIsLoading(true);
      const buffer = (e.target as FileReader).result as ArrayBuffer;
      await workbook.xlsx.load(buffer);
  
      const worksheet = workbook.getWorksheet(kelas.kode_kelas);
      if (worksheet) {
        const jsonData = worksheet.getSheetValues();
        const penilaianData = processJsonData(jsonData);
        setPenilaian(penilaianData);
        setIsLoading(false);
      }
    };
  
    reader.readAsArrayBuffer(file);
    const fileInput = document.getElementById('importFile') as HTMLInputElement;
    fileInput.value = ''
  };

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
      
      data.push([...rowData, ...rowAssessment, ...rowClo, formatFloat(nilaiTotal), getIndexNilai(formatFloat(nilaiTotal))]);
    });

    return data;
  }

  const handleDownload = () => {
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet(kelas.kode_kelas);

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
          setInitialPenilaian(penilaian)
        }
      } catch (e) {
        console.error(e);
        alertFailed("error")
      }
    }
    setInitialPenilaian(JSON.parse(JSON.stringify(penilaian)));
  }

  const isDataReady = (): boolean => {
    const str1 = JSON.stringify(penilaian)
    const str2 = JSON.stringify(initialPenilaian)
    return str1 === str2 ? true : false
  }

  const handleFinal = async (e) => {
    const beritaAcara: BeritaAcara = {
      id: 0,
      mata_kuliah: mk,
      dosen: { id: 0, kode_dosen: '', nama: '', user_id: 0 },
      kelas: kelas,
      nilai: dataPenilaian.penilaian.nilai,
      penilaian_id: dataPenilaian.penilaian.id,
    }
    const check = isDataReady()
    if (penilaian.nilai.length === 0) {
      alertInfo('Data tidak lengkap')
    } else {
      if (check) {
        alertFinalization(async () => {
          try {
            const res = await createBeritaAcara(beritaAcara)
            if (res) {
              alertSuccess('Data berhasil difinalisasi')
              render()
            }
          } catch (e) {
            console.error(e);
            alertFailed("Data gagal difinalisasi")
          }
        })
      } else {
        alertInfo('Data belum disimpan')
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

  const getColumns = (): Column[] => {
    const columns: Column[] = [
      { columnId: "nim", width: 150 },
      { columnId: "nama", width: 150 },
    ];

    let cloColumns: Column[] = [];
    let assessmentColumns: Column[] = [];
    let cloHeaders: { id: number; name:string; type: string; }[] = []
    let assessmentHeaders: { id: number; name:string; type: string; }[] = []

    if (cloAssessment) {
      cloAssessment.forEach((clo) => {
        if (clo.assessments) {
          clo.assessments.forEach((assessment) => {
            lembarAssessments.push(assessment)
            assessmentHeaders.push({ id: assessment.id, name:`${assessment.nama} (${assessment.bobot * 100}%)`, type: "assessment" })
            assessmentColumns.push({
              columnId: `${assessment.nama} (${assessment.bobot * 100}%)`,
              width: 150,
            })
          })
        }
        cloHeaders.push({ id: clo.id, name:`${clo.nama} (${clo.bobot * 100}%)`, type: "clo" })
        cloColumns.push({
          columnId: `${clo.nama} (${clo.bobot * 100}%)`,
          width: 150,
        })
      });
    }

    const col : Column = {
      columnId: "NA",
      width: 150,
    }

    const grade : Column = {
      columnId: "Grade",
      width: 50,
    }

    headers.push({ id: 0, name: 'nim', type: "nim"}, { id: 0, name: 'nama', type: "nama"}, ...assessmentHeaders, ...cloHeaders, { id: 0, name: "NA", type: "NA"}, { id: 0, name: "Grade", type: "Grade"})
    
    return [...columns, ...assessmentColumns, ...cloColumns, col, grade];
  };

  const getIndexNilai = (nilai: number): string => {
    const index = listIndex.find((i) => nilai >= i.batas_awal && nilai <= i.batas_akhir);
    return index ? index.grade : '';
  }
  
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
            if (change.newCell.text !== '') {
              let penilaianSearch : NilaiMahasiswa[] = []
              newPenilaian.nilai.forEach((item) => {
                if (item.nim != change.rowId) {
                  penilaianSearch.push(item)
                }
              })
              const nim = change.newCell.text
              const isNimExists = penilaianSearch.some((item) => item.nim === nim);
              if (!isNimExists) {
                if (/^\d+$/.test(nim)) {
                  found.nim = nim
                } else {
                  alertInfo('NIM harus berupa angka')
                }
              } else {
                alertInfo('NIM sudah ada')
              }
            } else {
              const index = newPenilaian.nilai.findIndex((item) => item.nim === change.rowId)
              newPenilaian.nilai.splice(index, 1)
            }
          } else if (change.columnId === 'nama') {
            found.nama = change.newCell.text
          }
        } else {
          const assessment = headers.find((item) => item.name === change.columnId)
          if (assessment) {
            let invalid = false
            const foundAssessment = found.nilai_assessment.find((item) => item.assessment_id === assessment?.id);
            if (foundAssessment) {
              if (change.newCell.value >= 0 && change.newCell.value <= 100) {
                foundAssessment.nilai = change.newCell.value
              } else {
                invalid = true
                foundAssessment.nilai = NaN
              }
              if (invalid) {
                alertInfo("Nilai harus diantara 0-100")
              }
            } else {
              const listAssessments = lembarAssessments.map((assess) => {
                if (assess.id === assessment.id && change.type == 'number') {
                  if (change.newCell.value >= 0 && change.newCell.value <= 100) {
                    return {
                      assessment_id: assessment.id,
                      nilai: change.newCell.value
                    }
                  } else {
                    invalid = true
                    return {
                      assessment_id: assessment.id,
                      nilai: NaN
                    }
                  }
                } else {
                  return {
                    assessment_id: assess.id,
                    nilai: NaN
                  }
                }
              })
              if (!invalid) {
                found.nilai_assessment.push(...listAssessments)
              } else {
                alertInfo("Nilai harus diantara 0-100")
              }
            }
          }
        }
      } else {
        if (change.columnId === 'nim' && change.newCell.type === "text") {
          let nim:string = ''
          let nama:string = ''
          let assessments:NilaiAssessment[] = []
          nim = change.newCell.text
          if (nim !== null && nim !== '') {
            nim = nim.trim()
            const nimExists = newPenilaian.nilai.some(item => item.nim === nim);
            if (!nimExists) {
              if (/^\d+$/.test(nim)) {
                const listAssessments = lembarAssessments.map((assess) => {
                  return {
                    assessment_id: assess.id,
                    nilai: 0,
                  }
                })
                assessments.push(...listAssessments)
                newPenilaian.nilai.push({
                  nim: nim,
                  nama: nama,
                  nilai_assessment: assessments
                })  
              } else {
                alertInfo('NIM harus berupa angka')
              }
            } else {
              alertInfo("NIM sudah ada");
            }
          }
        } else {
          alertInfo("Isi NIM terlebih dahulu")
        }
      }
    });
    
    return newPenilaian;
  };

  const handleChanges = (changes: CellChange<any>[]) => {
    setPenilaian((prevPenilaian) => applyChangesToPenilaian(changes, prevPenilaian)); 
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
              let count = 0;
              if (clo.assessments) {
                nilai.nilai_assessment.forEach((nilaiAssessment) => {
                  const assessment = clo.assessments.find(
                    (assessment) => assessment.id === nilaiAssessment.assessment_id
                  );
                  if (assessment) {
                    cloNilai += nilaiAssessment.nilai;
                    count++
                  }
                });
              }
              let avgClo = cloNilai / count;
              if (isNaN(avgClo)) {
                avgClo = 0;
              }
              na += avgClo;
              return {
                type: "number" as "number",
                clo_id: clo.id,
                value: formatFloat(avgClo),
                nonEditable: true,
                nanToZero: true,
                style: {
                  background: '#d1d1d1' 
                }
              };
            }),
            { type: "number" as "number", value: formatFloat(na / cloAssessment.length), nonEditable: true, style: {
              background: '#d1d1d1' 
            }},
            { type: "text", text: getIndexNilai(formatFloat(na / cloAssessment.length)), nonEditable: true, style: {
              background: '#d1d1d1' 
            }},
          ]
        }
      }),
      ];
      if (penilaian.nilai.length < numOfRow) {
        rows.push(...Array.from({ length: numOfRow - penilaian.nilai.length }, (_, i) => i).map((i) => ({
          rowId: uuidv4(),
          cells: columns.map((item) => {
              if (item.columnId == 'nim' || item.columnId == 'nama' || item.columnId == 'Grade') {
                return { type: "text" as "text", text: "", nonEditable: (penilaian.status === 'final') ? true: false, }
              } else {
                return { type: "number" as "number", value: NaN, nanToZero: true, nonEditable: (penilaian.status === 'final') ? true: false, }
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
        <div className="fixed top-0 bottom-0 z-50 bg-indigo-500 md:static">
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
              <div className="mt-2 flex flex-col md:flex-row justify-between items-start">
                <div className="flex flex-wrap items-start justify-start md:justify-center">
                <button
                  type="button"
                  onClick={handleSimpan}
                  className="flex justify-center items-center focus:outline-none h-fit text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1.5 me-2 mb-2"
                >
                  Simpan
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="flex justify-center items-center focus:outline-none h-fit text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-3 py-1.5 me-2 mb-2"
                >
                  <ArrowDownTrayIcon className='h-5 w-5 mr-1' />
                  Download
                </button>
                <form action="">
                  <input id='importFile' type="file" onChange={((e) => handleFileUpload(e))} accept='.xlsx, .csv' hidden/>
                  <label htmlFor="importFile" className="flex justify-center items-center focus:outline-none h-fit text-white bg-orange-600 hover:cursor-pointer hover:bg-orange-700 focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm px-3 py-1.5 me-2 mb-2">
                  <DocumentArrowDownIcon className='h-5 w-5 mr-1' />
                    Import
                  </label>
                </form>
                </div>
                <div className="flex flex-col justify-center items-center">
                  <button
                    type="button"
                    onClick={handleFinal}
                    className={`flex justify-center items-center ${
                         isFinal
                        ? 'bg-green-600 pointer-events-none'
                        : 'bg-fuchsia-600 hover:bg-fuchsia-700  focus:ring-fuchsia-300 focus:ring-4'
                    } focus:outline-none h-fit text-white  font-medium rounded-lg text-sm px-3 py-1.5 me-2 mb-2`}
                  >
                    <CheckCircleIcon className="h-5 w-5 mr-1" />
                    Finalisasi
                  </button>
                  {isFinal && (
                    <div className="flex text-green-500 mb-2">
                      <CheckBadgeIcon className="h-5 w-5" />
                      <span className="text-sm font-semibold">
                        Terfinalisasi
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="overflow-auto overflow-y-scroll">
                <ReactGrid rows={rows} columns={columns} onCellsChanged={handleChanges} moveRightOnEnter stickyTopRows={1} enableRangeSelection />
              </div>
            </div>
          </main>
        </div>
      </div>
      {isLoading && <Loader />}
    </>
  );
}
