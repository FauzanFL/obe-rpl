import { useState } from 'react';
import Spreadsheet from 'react-spreadsheet';

export default function PenilaianKelas() {
  const firstData = [
    [{ value: 'Vanilla' }, { value: 'Chocolate' }, { value: '' }],
    [{ value: 'Strawberry' }, { value: 'Cookies' }, { value: '' }],
  ];
  const [data, setData] = useState(firstData);

  const colLabel = ['Kolom 1', 'Kolom 2'];
  const rowLabel = ['Baris 1', 'Baris 2'];
  return (
    <div className="block mt-3 p-5 bg-white border border-gray-200 rounded-lg shadow">
      <Spreadsheet
        data={data}
        onChange={setData}
        columnLabels={colLabel}
        rowLabels={rowLabel}
      />
    </div>
  );
}
