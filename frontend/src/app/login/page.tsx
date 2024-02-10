'use client'
import { FormEvent, useState } from 'react';
import { api } from '../utils/api';
import { AxiosError } from 'axios';
import { useAuth } from '../authContext';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const { setTokens } = useAuth();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = event.target as typeof event.target & {
      username: { value: string };
      password: { value: string };
    };
    const username = target.username.value;
    const password = target.password.value;

    try {
      const response = await api.post('auth/login', {
        username,
        password,
      });
      const { access, refresh } = response.data;
      setTokens(access, refresh);
      setError(null);
      router.push('/dashboard');
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 401) {
        setError('Invalid username or password');
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  return (
        <div className="h-screen flex flex-col items-center justify-center">
            
          {error && <p className="text-red-500 mb-2">{error}</p>}

          <form onSubmit={handleSubmit} className="w-full max-w-sm">
              <div className="md:flex md:items-center mb-6">
                  <div className="md:w-1/3">
                  <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="inline-full-name">
                      Username
                  </label>
                  </div>
                  <div className="md:w-2/3">
                  <input name='username' className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" id="inline-full-name" type="text" />
                  </div>
              </div>
              <div className="md:flex md:items-center mb-6">
                  <div className="md:w-1/3">
                  <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="inline-password">
                      Password
                  </label>
                  </div>
                  <div className="md:w-2/3">
                  <input name='password' className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" id="inline-password" type="password" />
                  </div>
              </div>
              <div className="md:flex md:items-center">
                  <div className="md:w-1/3"></div>
                  <div className="md:w-2/3">
                  <button className="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="submit">
                      Sign Up
                  </button>
                  </div>
              </div>
          </form>

        </div>
    );
}
