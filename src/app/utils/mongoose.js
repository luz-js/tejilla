import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('La variable de entorno MONGODB_URI no está configurada.');
}

const connectDb = async () => {
  try {
    const db = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Conexión a MongoDB establecida en la base de datos: ${db.connection.name}`);
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error.message);
    process.exit(1); // Salir del proceso en caso de error de conexión
  }
};

export default connectDb;
