"use client"
import { useState, useEffect } from "react";
import SongTable from "../../components/SongTable";
import styled from "styled-components";
import Link from "next/link";
      
const Centrado = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export default function Songs() {
    //const data = await getSongs();
    const [songs, setSongs] = useState([])
  
    const fetchSongs = async () => {
        try {
            const response = await fetch('/api/songs');
            const data = await response.json();
            setSongs(data);
            data.map(song => {
              console.log(song.title)
            })
        } catch (error) {
            console.error("Error al obtener las canciones", error)
        } 
    }

    useEffect( () => {
      fetchSongs();
    }, [])
    
    return (
      <>
        <Centrado>
          <h1>Lista de Canciones</h1>
          <Link href={'/songs/new'} className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 mt-4 rounded shadow"> Agregar cancion </Link>
          <SongTable songs={songs} />
        </Centrado>
          
      </>
    )
  };