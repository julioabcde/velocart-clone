'use client';

import Spinner from '@/components/spinner/Spinner';
import { useAuth } from '@/context/AuthContext';
import { LoginDTO } from '@/models/Staff';
import { LoginService } from '@/services/api/LoginService';
import { AuthService } from '@/services/AuthService';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Login() {
  const router = useRouter();

  const [staffId, setStaffId] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);
  const { isLoggedIn, setLoggedIn, isLoggingIn, setLoggingIn } = useAuth();

  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof LoginDTO, string>>>({});

  const loginParam: LoginDTO = {
    staffId: staffId,
    password: password,
  };

  useEffect(() => {
    if (!AuthService.isTokenExpired()) {
      setLoading(true);
      setLoggedIn(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    }
  }, [router]);

  const validateLogin = () => {
    const errors: Partial<Record<keyof LoginDTO, string>> = {};

    if (!staffId.trim()) {
      errors.staffId = 'Staff ID is required!';
    }

    if (!password.trim()) {
      errors.password = 'Password is required!';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length > 0;
  };

  const login = async () => {
    try {
      setLoading(true);
      setLoggingIn(true);

      const response = await LoginService.login(loginParam);
      if (response.responseCode != '00') {
        //must be removed once error pop up is finished
        console.log('responseDate: ', response.responseDate);
        console.log('responseCode: ', response.responseCode);
        console.log('responseDesc: ', response.responseDesc);
        console.log('message: ', response.message);

        setError(true);
        return;
      }
      const staffId = response.data.staffId;
      const role = response.data.role;
      const token = response.data.token;
      const ttl = response.data.ttl;

      console.log(response.data);
      if (!staffId || !role || !token || !ttl) {
        setError(true);
        return;
      }

      const expiresIn = Date.now() + ttl * 60000;
      localStorage.setItem('staffId', staffId);
      localStorage.setItem('role', role);
      localStorage.setItem('token', token);
      localStorage.setItem('ttl', expiresIn.toString());

      setTimeout(() => {
        setLoggedIn(true);
        router.push('/dashboard');
      }, 1500);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(true);
    } finally {
      setLoading(false);
      setLoggingIn(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const hasError = validateLogin();

    if (!hasError) {
      await login();
    }
    return;
  };

  return (
    <div className='flex justify-center items-center min-h-full bg-slate-50 p-6'>
      <div className='w-full max-w-md rounded-2xl bg-white p-6 shadow'>
        <h1 className='mb-6 text-center text-2xl font-bold'>Login</h1>
        <form onSubmit={handleLogin} className='space-y-4' noValidate>
          <div>
            <label htmlFor='staffId' className='mb-1 block text-sm font-medium'>
              Staff ID <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              id='staffId'
              name='staffId'
              value={staffId}
              onChange={(e) => {
                setStaffId(e.target.value);
                if (fieldErrors.staffId) {
                  setFieldErrors((prev) => ({ ...prev, staffId: undefined }));
                }
              }}
              placeholder='Enter Staff ID'
              className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring ${fieldErrors.staffId ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
            />
            {fieldErrors.staffId && <p className='text-sm text-red-600'>{fieldErrors.staffId}</p>}
          </div>

          <div className='relative'>
            <label htmlFor='password' className='mb-1 block text-sm font-medium'>
              Password <span className='text-red-500'>*</span>
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id='password'
              name='password'
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (fieldErrors.password) {
                  setFieldErrors((prev) => ({ ...prev, password: undefined }));
                }
              }}
              placeholder='Enter Password'
              className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring ${fieldErrors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
            />
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute inset-y-[43px] right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 ${password === '' ? 'hidden' : 'flex items-center'}`}
            >
              {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
            </button>
            {fieldErrors.password && <p className='text-sm text-red-600'>{fieldErrors.password}</p>}
          </div>

          <div className='flex items-center justify-center gap-5 pt-4'>
            <button
              type='submit'
              disabled={isLoading}
              className='rounded-xl bg-green-600 px-3.5 py-2.5 text-[15px] font-semibold text-white hover:bg-green-700 disabled:opacity-50'
            >
              Login
            </button>
          </div>
        </form>

        {isLoggingIn && <Spinner message='Logging in... Please wait.' />}
        {isLoading && isLoggedIn && <Spinner message='Logged in! Redirecting...' />}
      </div>
    </div>
  );
}
