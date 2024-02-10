'use client'
import Image from "next/image";
import {Button} from '@nextui-org/button'; 
import { useAuth } from './authContext';


export default function Home() {
  const { decodedToken } = useAuth();

  return (
    <div>
      <h1>Home</h1>
      <h2>Hello is staff? {decodedToken ? decodedToken.username : 'false'}</h2>
    </div>
  );
}
