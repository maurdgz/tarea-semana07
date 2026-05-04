// app/config/db.config.js
export default {
  HOST: "localhost",
  USER: "root",
  PASSWORD: "", // Pon aquí tu contraseña de MySQL si tienes una
  DB: "testdb", // Asegúrate de que este nombre coincida con tu BD en MySQL
  PORT: 3306,
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};