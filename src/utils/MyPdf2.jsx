/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React from 'react';

export const MyPdf2 = React.forwardRef(
  ({ rps, listClo, listPlo, dosenPengampu }, ref) => {
    return (
      <>
        <div ref={ref} className="m-5">
          <table className="border w-full border-black border-collapse">
            <thead className="bg-gray-300 text-center font-bold">
              <tr className="border-b border-black">
                <th className="border-r border-black flex justify-center">
                  <img src="/logo-ittp.png" width={100} alt="" />
                </th>
                <th colSpan={3}>
                  <p className="uppercase">
                    Program Studi S1 Rekayasa Perangkat Lunak
                  </p>
                  <p>Alamat : Jl. DI Panjaitan No. 128 Purwokerto</p>
                  <p>Telp. (0281) 641629 | Fax. 0281 641630</p>
                  <p>
                    Email :
                    <span className="text-blue-600 underline hover:cursor-pointer">
                      <a
                        href="mailto:info@ittelkom-pwt.ac.id"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {' info@ittelkom-pwt.ac.id '}
                      </a>
                    </span>
                    | Page :
                    <span className="text-blue-600 underline hover:cursor-pointer">
                      <a
                        href="https://www.ittelkom-pwt.ac.id"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {' www.ittelkom-pwt.ac.id'}
                      </a>
                    </span>
                  </p>
                </th>
              </tr>
              <tr className="border-b border-black">
                <th colSpan={4}>Rencana Pembelajaran Semester</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-black font-bold">
                <td className="px-1 border-r border-black">Mata Kuliah</td>
                <td className="px-1 border-r border-black">Kode</td>
                <td className="px-1 border-r border-black">Bobot (sks)</td>
                <td className="px-1 ">Semester</td>
              </tr>
              <tr className="border-b border-black">
                <td className="px-1 border-r border-black">{rps.nama_mk}</td>
                <td className="px-1 border-r border-black">{rps.kode_mk}</td>
                <td className="px-1 border-r border-black">{rps.sks}</td>
                <td className="px-1 ">{rps.semester}</td>
              </tr>
              <tr className="border-b border-black">
                <td className="px-1 border-r border-black font-bold">
                  Dosen Pengampu
                </td>
                <td colSpan={3} className="px-1 border-r border-black">
                  {dosenPengampu.length !== 1 ? (
                    <ol className="list-decimal">
                      {dosenPengampu.map((item, i) => {
                        return (
                          <li key={i} className="my-2 ml-4">
                            {item.nama}
                          </li>
                        );
                      })}
                    </ol>
                  ) : (
                    dosenPengampu[0].nama
                  )}
                </td>
              </tr>
              <tr className="border-b border-black">
                <td className="px-1 border-r border-black font-bold">
                  Sasaran
                </td>
                <td colSpan={3} className="px-1 border-r border-black">
                  {'Mahasiswa program studi S1 Rekayasa Perangkat Lunak'}
                </td>
              </tr>
              <tr className="border-b border-black">
                <td className="px-1 border-r border-black font-bold">
                  Prasyarat
                </td>
                <td colSpan={3} className="px-1 border-r border-black">
                  {rps.prasyarat}
                </td>
              </tr>
              <tr className="border-b border-black">
                <td
                  rowSpan={listPlo.length + listClo.length + 2}
                  className="px-1 border-r border-black font-bold"
                >
                  Capaian pembelajaran / Learning Outcomes
                </td>
                <td colSpan={2} className="px-1 border-black font-bold">
                  <span>Program Learning Outcomes (PLO)</span>
                </td>
              </tr>
              {listPlo.map((item, i) => {
                return (
                  <tr key={i} className="px-1 border-b border-black">
                    <td className="px-1 border-r border-black">{item.nama}</td>
                    <td className="px-1">{item.deskripsi}</td>
                  </tr>
                );
              })}
              <tr className="px-1 border-b border-black font-bold">
                <td colSpan={2}>
                  <span>Course Learning Outcomes (CLO)</span>
                </td>
              </tr>
              {listClo.map((item, i) => {
                return (
                  <tr key={i} className="px-1 border-b border-black">
                    <td className="px-1 border-r border-black">{item.nama}</td>
                    <td className="px-1">{item.deskripsi}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </>
    );
  }
);

export default MyPdf2;
