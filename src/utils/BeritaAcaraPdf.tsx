/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React, { useEffect, useRef, useState } from 'react';
import { getTahunAjaranById } from '../api/tahunAjaran';
import { getIndexPenilaian, getIndexPenilaianByNilai } from '../api/indexPenilaian';

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

interface Dosen {
  id: number;
  kode_dosen: string;
  nama: string;
  user_id: number;
}

interface BeritaAcaraProps {
  id: number;
  mata_kuliah: Matakuliah;
  dosen: Dosen;
  kelas: Kelas;
  nilai: NilaiMahasiswa[];
  penilaian_id: number;
}

interface TahunAjaran {
  id: number;
  tahun: string;
  semester: string;
  bulan_mulai: number;
  bulan_selesai: number;
}

interface BeritaAcaraPdfProps {
    beritaAcara: BeritaAcaraProps;
    cloAssessment: CloWithAssessment[];
    ref: React.RefObject<HTMLDivElement>;
}
export const BeritaAcaraPdf = React.forwardRef<HTMLDivElement, BeritaAcaraPdfProps>(({ beritaAcara, cloAssessment }, ref) => {
  const [tahunAjaran, setTahunAjaran] = useState<TahunAjaran>({
    id: 0,
    tahun: '',
    semester: '',
    bulan_mulai: 0,
    bulan_selesai: 0,
  });
  const [listIndex, setListIndex] = useState<any[]>([]);

  useEffect(() => {
    async function fetchTahun() {
      const response = await getTahunAjaranById(beritaAcara.mata_kuliah.tahun_ajaran_id);
      setTahunAjaran(response);
    }

    async function fetchIndex() {
      const res = await getIndexPenilaian();
      setListIndex(res)
    }

    fetchTahun()
    fetchIndex()
  }, [beritaAcara])

  const formatNilai = (nilai: number): number => {
    const n = nilai.toString().split('.');
    if (n[1] && n[1].length > 2){
      return parseFloat(nilai.toFixed(2));
    } else {
      return nilai;
    }
  };

  const indexNilaiTotal = listIndex.map((index) => {
    return {
      grade: index.grade,
      total: 0,
    }
  })


  const getIndexNilai = (nilai: number): string => {
    const index = listIndex.find((i) => nilai >= i.batas_awal && nilai <= i.batas_akhir);
    if (index) {
      const foundIndex = indexNilaiTotal.find((i) => i.grade === index.grade);
      if (foundIndex) {
        foundIndex.total += 1;
      }
    }
    return index ? index.grade : '';
  }

  const cloNames = cloAssessment.map((clo) => `${clo.nama} (${clo.bobot*100}%)`);
  
  const avgClos = new Array(cloAssessment.length).fill(0);
  let avgTotal = 0
  let totalNilaiTertinggi = {nilai: 0, nim: ''};
  let totalNilaiTerendah = {nilai: 1000, nim: ''};
  
  return (
    <>
      <div ref={ref} className="p-10">
        <div className="flex items-start border-b-2 border-black py-5">
          <img src="/logo-vertikal.png" alt="" className='mr-4' width={100} />
          <div className="leading-none">
            <h1 className="font-bold">INSTITUT TEKNOLOGI TELKOM PURWOKERTO</h1>
            <p className="">Jl. DI Panjaitan No. 128</p>
            <p className="">Purwokerto 53147</p>
            <p className="">Indoneisa</p>
          </div>
        </div>
        <div className="py-3">
          <h1 className="text-center uppercase font-semibold mb-2">
            Daftar nilai yang telah diinputkan
          </h1>
          <div className="grid grid-cols-2 leading-none">
            <table>
              <tbody>
                <tr>
                  <td className="font-semibold">Dosen</td>
                  <td>:</td>
                  <td className="px-1.5">{beritaAcara.dosen.nama}</td>
                </tr>
                <tr>
                  <td className="font-semibold">Mata Kuliah</td>
                  <td>:</td>
                  <td className="px-1.5">{beritaAcara.mata_kuliah.kode_mk}</td>
                </tr>
                <tr>
                  <td className="font-semibold">Thn Ajaran/Semester</td>
                  <td>:</td>
                  <td className="px-1.5">
                    {`${tahunAjaran.tahun} ${tahunAjaran.semester}`}
                  </td>
                </tr>
              </tbody>
            </table>
            <table>
              <tbody>
                <tr>
                  <td className="font-semibold">Prodi</td>
                  <td>:</td>
                  <td className="px-1.5 uppercase">
                    S1 Rekayasa Perangkat Lunak
                  </td>
                </tr>
                <tr>
                  <td className="font-semibold">Kelas</td>
                  <td>:</td>
                  <td className="px-1.5">{beritaAcara.kelas.kode_kelas}</td>
                </tr>
                <tr>
                  <td className="font-semibold"></td>
                  <td></td>
                  <td className="px-1.5"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <table className='w-full'>
          <thead>
            <tr className='border-y-4 border-black py-4'>
              <th className="p-2 font-normal">No</th>
              <th className="p-2 font-normal">NIM</th>
              <th className="p-2 font-normal">NIM Lama</th>
              <th className="p-2 font-normal">Nama</th>
              {cloNames.map((cloName, i) => (
                <th key={i} className="p-2 font-normal">{cloName}</th>
              ))}
              <th className="p-2 font-normal">Nilai Total</th>
              <th className="p-2 font-normal">Nilai Indeks</th>
            </tr>
          </thead>
          <tbody>
            {beritaAcara.nilai.map((nilai, index) => {
              let total = 0;
              const clos =  cloAssessment.map((clo, i) => {
                const nilais: number[] = []
                nilai.nilai_assessment.forEach((na) => {
                  const cloAssessment = clo.assessments.find((a) => a.id === na.assessment_id);
                  if (cloAssessment) {
                    nilais.push(na.nilai);
                  }
                });
                const result = nilais.reduce((a, b) => a + b, 0) / nilais.length;
                total += result;
                avgClos[i] += result;
                return formatNilai(result);
              });
              const nilaiTotal = total / cloAssessment.length;
              avgTotal += nilaiTotal;

              if (nilaiTotal > totalNilaiTertinggi.nilai) {
                totalNilaiTertinggi = {nilai: nilaiTotal, nim: nilai.nim};
              }
              if (nilaiTotal < totalNilaiTerendah.nilai) {
                totalNilaiTerendah = {nilai: nilaiTotal, nim: nilai.nim};
              }
              return (
              <tr key={index} className='border-y-2 border-black py-4'>
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{nilai.nim}</td>
                <td className="p-2"></td>
                <td className="p-2">{nilai.nama}</td>
                {clos.map((clo, i) => {
                  return (
                    <td key={i} className="p-2">
                      {clo}
                    </td>
                  );
                })}
                <td className="p-2">{formatNilai(nilaiTotal)}</td>
                <td className="p-2">{getIndexNilai(nilaiTotal)}</td>
              </tr>
              )
            })}
          </tbody>
        </table>
        <div className="leading-none mt-3">
          <table>
            <tbody>
              <tr>
                <td className="font-semibold">Standar Indeks</td>
                <td>:</td>
                <td className="px-1.5">
                  {listIndex.map((index, i) => {
                    return (
                      <span key={i}>
                        {`${index.grade} = ${index.batas_awal} - ${index.batas_akhir}${(i === listIndex.length - 1) ? '' : ', '}`}
                      </span>
                    );
                  })}
                </td>
              </tr>
              <tr>
                <td className="font-semibold">Nilai Rata-rata Kelas</td>
                <td>:</td>
                <td className="px-1.5">
                  {cloAssessment.map((item, i) => {
                    return (
                      <span key={i}>
                        {`${item.nama} = ${formatNilai(avgClos[i] / beritaAcara.nilai.length)}${(i === cloAssessment.length - 1) ? `, TOTAL = ${formatNilai(avgTotal/ beritaAcara.nilai.length)}` : ', '}`}
                      </span>
                    );
                  })}
                </td>
              </tr>
              <tr>
                <td className="font-semibold">Total Nilai Tertinggi</td>
                <td>:</td>
                <td className="px-1.5">{`NIM ${totalNilaiTertinggi.nim} = ${formatNilai(totalNilaiTertinggi.nilai)}`}</td>
              </tr>
              <tr>
                <td className="font-semibold">Total Nilai Terendah</td>
                <td>:</td>
                <td className="px-1.5">{`NIM ${totalNilaiTerendah.nim} = ${formatNilai(totalNilaiTerendah.nilai)}`}</td>
              </tr>
              <tr>
                <td className="font-semibold">Jumlah Indeks</td>
                <td>:</td>
                <td className="px-1.5">
                  {indexNilaiTotal.map((index, i) => {
                    return (
                      <span key={i}>
                        {`${index.grade} = ${index.total}${(i === indexNilaiTotal.length - 1) ? '' : ', '}`}
                      </span>
                    );
                  })}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
});

export default BeritaAcaraPdf;
