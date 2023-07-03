// layouts/AuthenticatedLayout.js

import React from 'react';
import { useRouter } from 'next/router';
import { store } from '@/redux/store';

const AuthenticatedLayout = ({ children }) => {
  const router = useRouter();
  const token = store?.getState()?.auth?.user?.token?.accessToken
  if (!token) {
    router.push('/');
    return null;
  }

  return (
    <>
      {children}
    </>
  );
};

export default AuthenticatedLayout;