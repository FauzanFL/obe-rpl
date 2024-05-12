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
import Loader from '../components/Loader';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';

export default function Home() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errStatus, setErrStatus] = useState({});
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isPassShow, setIsPassShow] = useState(false);

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
    setIsLoading(true);
    async function fetchUser() {
      const res = await getUserRole();
      roleHandler(res.role);
    }

    const auth = GetCookie('Authorization');
    if (auth) {
      fetchUser();
    }
    setIsLoading(false);
  }, [roleHandler]);

  const validation = () => {
    const error = {};
    const errStat = {};
    let status = true;
    const regex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (email === '') {
      error.email = 'email harus diisi';
      errStat.email = true;
      status = false;
    } else if (!regex.test(email)) {
      error.email = 'email harus sesuai format';
      errStat.email = true;
      status = false;
    }

    if (password === '') {
      error.password = 'password harus diisi';
      errStat.password = true;
      status = false;
    }

    setErrStatus(errStat);
    setErrors(error);
    return status;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const valid = validation();
    if (valid) {
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

  const handleTogglePass = (e) => {
    e.preventDefault();
    setIsPassShow(!isPassShow);
  };

  const handleChange = (e) => {
    const errStat = {};
    if (e.target.name === 'email') {
      errStat.email = false;
      setEmail(e.target.value);
    } else if (e.target.name === 'password') {
      errStat.password = false;
      setPassword(e.target.value);
    }
    setErrStatus(errStat);
  };

  return (
    <>
      <div className="flex">
        <div className="fixed top-0 bottom-0 z-50 bg-indigo-500 md:static">
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
                        onChange={(e) => handleChange(e)}
                        name="email"
                        type="email"
                        className={`bg-gray-50 border ${
                          errStatus.email ? 'border-red-500' : 'border-gray-300'
                        } text-gray-900 text-sm rounded-lg block w-full p-2.5`}
                      />
                      {errStatus.email && (
                        <span className="text-red-500 text-sm">
                          {errors.email}
                        </span>
                      )}
                    </div>
                    <div className="mb-2">
                      <div className="relative">
                        <label
                          htmlFor="password"
                          className="block mb-1 text-sm font-medium text-gray-900"
                        >
                          Password
                        </label>
                        <input
                          onChange={(e) => handleChange(e)}
                          name="password"
                          type={`${isPassShow ? 'text' : 'password'}`}
                          className={`bg-gray-50 border ${
                            errStatus.password
                              ? 'border-red-500'
                              : 'border-gray-300'
                          } text-gray-900 text-sm rounded-lg block w-full p-2.5 pr-8`}
                          required
                        />
                        <button
                          type="button"
                          onClick={handleTogglePass}
                          className="absolute right-2 top-9 w-5"
                        >
                          {isPassShow ? <EyeSlashIcon /> : <EyeIcon />}
                        </button>
                      </div>
                      {errStatus.password && (
                        <span className="text-red-500 text-sm">
                          {errors.password}
                        </span>
                      )}
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
      {isLoading && <Loader />}
    </>
  );
}
