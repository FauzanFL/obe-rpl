/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Bars3CenterLeftIcon, HomeIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import NavListDosen from './NavListDosen';
import NavListProdi from './NavListProdi';

export default function Sidebar({ typeUser, page }) {
  const [open, setOpen] = useState(true);
  return (
    <>
      <aside
        className={` ${
          open ? 'w-72' : 'w-20'
        } duration-300 min-h-screen bg-indigo-500 relative shadow-inner`}
      >
        <Bars3CenterLeftIcon
          onClick={() => setOpen(!open)}
          className="absolute cursor-pointer bg-indigo-500 z-40 border-t border-b border-r border-indigo-500 rounded-r-md -right-7 top-1.5 w-8 hover:bg-indigo-400 shadow-inner"
        />
        <div className="h-screen p-2 overflow-y-scroll no-scrollbar">
          <div className="text-xl font-bold text-center">
            <img src="/logo.png" alt="" />
            <h1 className={`${!open && 'hidden'} duration-200`}>
              Rekayasa Perangkat Lunak
            </h1>
          </div>
          <ul className="pt-2">
            {typeUser === 'dosen' && <NavListDosen open={open} page={page} />}
            {typeUser === 'prodi' && <NavListProdi open={open} page={page} />}
            {typeUser === 'all' && (
              <li className="font-bold flex items-center gap-x-4 cursor-pointer p-2 px-4 rounded-md bg-indigo-300 hover:bg-indigo-400">
                <HomeIcon className="w-7" />
                <span
                  className={`${!open && 'hidden'} origin-left duration-200`}
                >
                  <Link to={'/'}>Home</Link>
                </span>
              </li>
            )}
          </ul>
        </div>
      </aside>
    </>
  );
}
