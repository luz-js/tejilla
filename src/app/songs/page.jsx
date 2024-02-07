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
      <div className="p-5">
          <Link href={'/songs/new'} className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2 text-center mt-5"> Agregar cancion </Link>
          <SongTable songs={songs} />  
      </div>
    )
  };