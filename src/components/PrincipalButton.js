"use client"
import Link from 'next/link';
import styled from "styled-components";
import Center from './Center';

const DivButtons = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
`;

export default function PrincipalsButtons() {
    return(
      <Center>
        <DivButtons>
          <Link href={'/songs'} className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-lg px-5 py-5 text-center me-2 mb-5" >Lista de canciones</Link>
          <Link href={'/cronogramas'} className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-lg px-5 py-5 text-center me-2 mb-5">Cronogramas</Link>
          <Link href="/api/cronogramas" className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-lg px-5 py-5 text-center me-2 mb-5">Canciones a ensayar</Link>
          <Link href="/api/songs" className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-lg px-5 py-5 text-center me-2 mb-5">No se que</Link>  
        </DivButtons>
      </Center>
        
    );
  };