// components/SongForm.js
"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const SongForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    writer: '',
    urlCancion: ''
  });
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validate = () => {
    let errors = {};

    if (!formData.title) {
      errors.title = "Title es requerido";
    }
    if (!formData.escritor) {
      errors.description = "Escritor es requerido";
    }
    if (!formData.urlCancion) {
        errors.description = "Url es requerido";
      }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errs = validate();

    if (Object.keys(errs).length) {
        return setErrors(errs);
    }
    console.log('Formulario enviado:', formData);
    // Aquí puedes agregar la lógica para enviar los datos a tu backend o hacer lo que desees con los datos del formulario
    try {
        const response = await fetch("/api/songs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });
        if (!response.ok) {
            throw new Error('Error al enviar el formulario')
        }else if(response.ok){
          console.log('Canción agregada correctamente');
          router.push("/songs");
          router.refresh();
        }
        
    } catch (error) {
        console.log("ocurrio un error al intentar ingresar los datos", error)
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-4 p-4 bg-white rounded shadow-md">
      <div className="mb-4">
        <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">Título:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="writer" className="block text-gray-700 text-sm font-bold mb-2">Escritor:</label>
        <input
          type="text"
          id="escritor"
          name="escritor"
          value={formData.escritor}
          onChange={handleInputChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          
        />
      </div>
      <div className="mb-4">
        <label htmlFor="url" className="block text-gray-700 text-sm font-bold mb-2">URL:</label>
        <input
          type="text"
          id="urlCancion"
          name="urlCancion"
          value={formData.urlCancion}
          onChange={handleInputChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          
        />
      </div>
      <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Agregar</button>
    </form>
  );
};

export default SongForm;
