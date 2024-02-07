import { useRouter } from 'next/navigation';
import styled from 'styled-components';

// Estilos para la tabla
const Table = styled.table`
  width: 98%;
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
      <div class="relative overflow-x-auto shadow-md sm:rounded-lg mt-5">
          <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead class="text-xs text-gray-700 uppercase  bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                      <th scope="col" class="px-6 py-3">
                          Cancion
                      </th>
                      <th scope="col" class="px-6 py-3">
                          Escritor
                      </th>
                      <th scope="col" class="px-6 py-3">
                          Url
                      </th>
                      <th scope="col" class="px-6 py-3">
                          Accion
                      </th>
                  </tr>
              </thead>
              <tbody>
                {songs.map((song) => (
                    <tr key={song._id} class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{song.title}</th>
                      <td className='px-6 py-4'>{song.escritor}</td>
                      <td className='px-6 py-4'>{song.urlCancion}</td>
                      <td className='px-6 py-4'>
                        <button onClick={() => handleDelete(song)}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#6f1d1b" className="w-6 h-6 ">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
          </table>
      </div>

      </>
  );
};

export default SongTable;
