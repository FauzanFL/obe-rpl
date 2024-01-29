/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from 'react';
import Breadcrumb from '../components/Breadcrumb';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { getUserRole, loginUser } from '../api/user';
import RemoveCookie from '../hooks/RemoveCookie';
import SetCookie from '../hooks/SetCookie';
import { useNavigate } from 'react-router-dom';
import GetCookie from '../hooks/GetCookie';
import { alertFailed, alertSuccess } from '../utils/alert';

export default function Home() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const roleHandler = useCallback((role) => {
    if (role == 'prodi') {
      navigate('/prodi/dashboard');
    } else if (role == 'dosen') {
      navigate('/dosen/dashboard');
    } else {
      alert("Don't have role");
    }
  });

  useEffect(() => {
    async function fetchUser() {
      const res = await getUserRole();
      roleHandler(res.role);
    }

    const auth = GetCookie('Authorization');
    if (auth) {
      fetchUser();
    }
  }, [roleHandler]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (email == '' || password == '') {
      console.log('email dan password harus diisi');
    } else {
      try {
        const res = await loginUser({
          email,
          password,
        });
        if (res) {
          RemoveCookie('Authorization');
          SetCookie('Authorization', res.token);
          alertSuccess('Login Success');
          try {
            const res = await getUserRole();
            roleHandler(res.role);
          } catch (e) {
            console.error(e);
          }
        }
      } catch (e) {
        alertFailed(e.response.data.error);
      }
    }
  };

  return (
    <>
      <div className="flex">
        <div className="">
          <Sidebar typeUser={'all'} />
        </div>
        <div className="flex-1 h-screen">
          <Header typeUser={'all'} />
          <div className="px-7 pt-4">
            <Breadcrumb />
          </div>
          <main className="p-7 text-wrap">
            <h2 className="text-semibold text-3xl">
              Selamat Datang di Website OBE RPL
            </h2>
            <div className="flex justify-center align-center mt-5">
              <div className="flex flex-col mt-5 p-3 text-gray-700 bg-slate-200 shadow-md w-96 rounded-xl bg-clip-border">
                <h3 className="text-2xl mx-3 font-semibold">Sign In</h3>
                <div className="flex flex-col gap-3 p-5">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-2">
                      <label
                        htmlFor="email"
                        className="block mb-1 text-sm font-medium text-gray-900"
                      >
                        Email
                      </label>
                      <input
                        onChange={({ target }) => setEmail(target.value)}
                        name="email"
                        type="email"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                        required
                      />
                    </div>
                    <div className="mb-2">
                      <label
                        htmlFor="password"
                        className="block mb-1 text-sm font-medium text-gray-900"
                      >
                        Password
                      </label>
                      <input
                        onChange={({ target }) => setPassword(target.value)}
                        name="password"
                        type="password"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                        required
                      />
                    </div>
                    <div className="flex justify-center mt-3">
                      <button
                        type="submit"
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                      >
                        Masuk
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
