// server.js
import express from "express";
import cors from "cors";
import db from "./app/models/index.js";
import authRoutes from "./app/routes/auth.routes.js";
import userRoutes from "./app/routes/user.routes.js";

const app = express();

// Configuración de CORS
var corsOptions = {
    origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// Parseo de solicitudes de tipo application/json
app.use(express.json());

// Parseo de solicitudes de tipo application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const Role = db.role;

// Sincronización de la base de datos
// force: true eliminará las tablas existentes y las volverá a crear
db.sequelize.sync({ force: true }).then(() => {
    console.log('Resync con { force: true }');
    initial(); // Llamada para crear los roles iniciales
});

// Ruta simple de bienvenida
app.get("/", (req, res) => {
    res.json({ message: "Bienvenido a la aplicación de Mauricio." });
});

// Registro de las rutas de la aplicación
authRoutes(app);
userRoutes(app);

// Configuración del puerto y puesta en marcha del servidor
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}.`);
});

/**
 * Función para inicializar los roles en la base de datos
 */
function initial() {
    Role.create({
        id: 1,
        name: "user"
    });

    Role.create({
        id: 2,
        name: "moderator"
    });

    Role.create({
        id: 3,
        name: "admin"
    });
}