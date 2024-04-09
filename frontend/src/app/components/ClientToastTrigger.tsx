'use client';
import { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Cookies from 'js-cookie'; 

const ClientToastTrigger = () => {

  useEffect(() => {
    const toastValue = Cookies.get('showToast');

    if (toastValue) {
      const { type, message } = JSON.parse(toastValue);

      switch(type) {

        case 'success':
          toast.success(message, {
            position: "top-right",
            theme: "dark",
          });
          break;

        case 'warning':
          toast.warning(message, {
            position: "top-right",
            theme: "dark",
          });
          break;

        case 'error':
          toast.error(message, {
            position: "top-right",
            theme: "dark",
          });
          break;

        default:
          console.error('Unknown toast type');
      }

      Cookies.remove('showToast');

    }

  }, []);

  return null; 
  
};


export default ClientToastTrigger;