// app/config/db.config.js
module.exports = {
  HOST: process.env.DB_HOST || "localhost",
  USER: process.env.DB_USER || "root",
  PASSWORD: process.env.DB_PASSWORD || "",
  DB: process.env.DB_NAME || "testdb", // Aquí pon el nombre de tu db local si gustas
  dialect: "mysql",
  port: process.env.DB_PORT || 3306,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Necesario para Aiven
    }
  }
};