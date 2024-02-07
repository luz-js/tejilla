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
          <Link href={'/songs'} className="bg-white p-5 rounded-md text-black mr-5 w-full" >Lista de canciones</Link>
          <Link href={'/cronogramas'} className="bg-white p-5 rounded-md text-black mr-5 w-full mt-5">Cronogramas</Link>
          <Link href="/api/cronogramas" className="bg-white p-5 rounded-md text-black mr-5 w-full mt-5">Canciones a ensayar</Link>
          <Link href="/api/songs" className="bg-white p-5 rounded-md text-black w-full mt-5">No se que</Link>  
        </DivButtons>
      </Center>
        
    );
  };