// app/routes/user.routes.js
// Importamos los middlewares de autenticación para proteger las rutas
import { authJwt } from "../middlewares/index.js";

// Importamos el controlador de usuario que contiene las respuestas para cada nivel de acceso
import * as controller from "../controllers/user.controller.js";

export default function(app) {
    // Configuración de encabezados para permitir el paso del token en las solicitudes
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    // Ruta para contenido público: no requiere token
    app.get("/api/test/all", controller.allAccess);

    // Ruta para contenido de usuario: requiere un token JWT válido
    app.get(
        "/api/test/user",
        [authJwt.verifyToken],
        controller.userBoard
    );

    // Ruta para contenido de moderador: requiere token y rol de moderador
    app.get(
        "/api/test/mod",
        [authJwt.verifyToken, authJwt.isModerator],
        controller.moderatorBoard
    );

    // Ruta para contenido de administrador: requiere token y rol de administrador
    app.get(
        "/api/test/admin",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.adminBoard
    );
};