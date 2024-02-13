import React, { useEffect } from 'react';
import { api } from '../utils/api';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
    const navigate = useNavigate();
    
    useEffect(() => {
        api.post('/auth/logout/', {
            refresh_token: localStorage.getItem('refresh_token'),
        });
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        api.defaults.headers['Authorization'] = null;
        navigate('/login');
    });
    
return <div>logout</div>;
}
