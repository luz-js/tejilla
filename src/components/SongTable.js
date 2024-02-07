import { useRouter } from 'next/navigation';
import styled from 'styled-components';

// Estilos para la tabla
const Table = styled.table`
  width: 90%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const Th = styled.th`
  background-color: black;
  padding: 8px;
  text-align: left;
`;

const Td = styled.td`
  border: 1px solid #ddd;
  padding: 8px;
`;

const SongTable = ({ songs }) => {
  
  const router = useRouter();

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        const response = await fetch(`/api/songs/${id._id}`, {
          method: 'DELETE'
        })
          router.push("/");
          router.refresh();
      } catch (error) {
        console.error('Error al eliminar la canción', error.message);
      }
      console.log(id._id);
    }
    
  }

  return (
    <>
      <Table>
        <thead>
          <tr>
            <Th>Canción</Th>
            <Th>Escritor</Th>
            <Th>URL</Th>
            <Th>Acción</Th>
          </tr>
        </thead>
        <tbody>
          {songs.map((song) => (
            <tr key={song._id}>
              <Td>{song.title}</Td>
              <Td>{song.escritor}</Td>
              <Td>{song.urlCancion}</Td>
              <Td><button onClick={() => handleDelete(song)}>Eliminar</button></Td>
            </tr>
          ))}
        </tbody>
      </Table>
      </>
  );
};

export default SongTable;
