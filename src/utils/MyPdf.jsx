/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React from 'react';

export const MyPdf = React.forwardRef(
  ({ rps, listClo, listPlo, dosenPengampu }, ref) => {
    return (
      <>
        <div ref={ref} className="m-5">
          <div className="flex justify-between p-4 border-b-2 border-black">
            <img src="/logo-landscape.png" alt="" width={240} />
            <div className="text-right font-bold">
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
            </div>
          </div>
          <div className="mt-4">
            <table className="border w-full border-black border-collapse">
              <thead className="bg-gray-400">
                <tr>
                  <th
                    colSpan={3}
                    className="border-b border-black uppercase p-1"
                  >
                    Rencana Pembelajaran Semester
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-black">
                  <td className="px-2 py-1">Nama Mata Kuliah</td>
                  <td className="p-1 text-center border-x border-black">:</td>
                  <td className="px-2 py-1">{rps.nama_mk}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="px-2 py-1">Kode Mata Kuliah</td>
                  <td className="p-1 text-center border-x border-black">:</td>
                  <td className="px-2 py-1">{rps.kode_mk}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="px-2 py-1">SKS</td>
                  <td className="p-1 text-center border-x border-black">:</td>
                  <td className="px-2 py-1">{rps.sks}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="px-2 py-1">Prasyarat</td>
                  <td className="p-1 text-center border-x border-black">:</td>
                  <td className="px-2 py-1">{rps.prasyarat}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="px-2 py-1">Sasaran</td>
                  <td className="p-1 text-center border-x border-black">:</td>
                  <td className="px-2 py-1">
                    {'Mahasiswa program studi S1 Rekayasa Perangkat Lunak'}
                  </td>
                </tr>
                <tr className="border-b border-black">
                  <td className="px-2 py-1">Dosen</td>
                  <td className="p-1 text-center border-x border-black">:</td>
                  <td className="px-2 py-1">
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
                  <td className="px-2 py-1">Program Learning Outcomes (PLO)</td>
                  <td className="p-1 text-center border-x border-black">:</td>
                  <td className="px-2 py-1">
                    <ol className="list-decimal">
                      {listPlo.map((item, i) => {
                        return (
                          <li key={i} className="my-2 ml-4">
                            {item.deskripsi}
                          </li>
                        );
                      })}
                    </ol>
                  </td>
                </tr>
                <tr className="border-b border-black">
                  <td className="px-2 py-1">Course Learning Outcomes (CLO)</td>
                  <td className="p-1 text-center border-x border-black">:</td>
                  <td className="px-2 py-1">
                    <ol className="list-decimal">
                      {listClo.map((item, i) => {
                        return (
                          <li key={i} className="my-2 ml-4">
                            {item.deskripsi}
                          </li>
                        );
                      })}
                    </ol>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  }
);

export default MyPdf;
