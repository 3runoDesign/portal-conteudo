'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation'
import { useAppSelector } from '../lib/store';

const useAuth = () => {
  const router = useRouter();
  const token = useAppSelector((state) => state.auth.token);

  useEffect(() => {
    if (!token) {
      router.push('/login');
    }
  }, [token, router]);
};

export default useAuth;
