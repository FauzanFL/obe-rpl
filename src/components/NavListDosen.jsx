/* eslint-disable react/prop-types */
import {
  BookOpenIcon,
  DocumentTextIcon,
  PresentationChartLineIcon,
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

export default function NavListDosen({ open, page }) {
  return (
    <>
      <li
        className={`font-bold cursor-pointer my-1 p-2 px-4 rounded-md ${
          page === 'dashboard' ? 'bg-indigo-200' : 'bg-indigo-300'
        } hover:bg-indigo-200`}
      >
        <Link to={'/dosen/dashboard'} className="flex items-center gap-x-4">
          <PresentationChartLineIcon className="w-7" />
          <span className={`${!open && 'hidden'} origin-left duration-200`}>
            Bashboard
          </span>
        </Link>
      </li>
      <li
        className={`font-bold cursor-pointer my-1 p-2 px-4 rounded-md ${
          page === 'matakuliah' ? 'bg-indigo-200' : 'bg-indigo-300'
        } hover:bg-indigo-200`}
      >
        <Link to={'/dosen/matakuliah'} className="flex items-center gap-x-4">
          <BookOpenIcon className="w-7" />
          <span className={`${!open && 'hidden'} origin-left duration-200`}>
            Mata Kuliah
          </span>
        </Link>
      </li>
      <li
        className={`font-bold cursor-pointer my-1 p-2 px-4 rounded-md ${
          page === 'rps' ? 'bg-indigo-200' : 'bg-indigo-300'
        } hover:bg-indigo-200`}
      >
        <Link to={'/dosen/rps'} className="flex items-center gap-x-4">
          <DocumentTextIcon className="w-7" />
          <span className={`${!open && 'hidden'} origin-left duration-200`}>
            RPS
          </span>
        </Link>
      </li>
    </>
  );
}
