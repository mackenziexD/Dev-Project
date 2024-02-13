import React, { useEffect } from 'react';
import { api } from '../utils/api';
import { useRouter } from 'next/navigation';

export default function Logout() {
    const router = useRouter();

    async function logout() {
        const token = localStorage.getItem('refreshToken');
        await api.post('token/blacklist/', { 
            refresh: token 
        });
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        api.defaults.headers['Authorization'] = null;
        router.push('/login');
    }
    
return <div onClick={logout}>logout</div>;
}
