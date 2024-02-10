import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const useRequireAuth = (redirectUrl = '/login') => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken && pathname !== '/' && pathname !== '/login') {
      router.push(redirectUrl);
    }
  }, [router, redirectUrl, pathname]);
};

export default useRequireAuth;
