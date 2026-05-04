// app/routes/auth.routes.js
// Importamos los middlewares de validación de registro y autenticación
import { verifySignUp, authJwt } from "../middlewares/index.js";

// Importamos el controlador de autenticación que contiene la lógica de signup y signin
import * as controller from "../controllers/auth.controller.js";

export default function(app) {
    // Configuración de encabezados para permitir CORS
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    // Ruta para el registro de usuarios (signup)
    // Primero ejecuta las validaciones de duplicados y existencia de roles
    app.post(
        "/api/auth/signup",
        [
            verifySignUp.checkDuplicateUsernameOrEmail,
            verifySignUp.checkRolesExisted
        ],
        controller.signup
    );

    // Ruta para el inicio de sesión (signin)
    app.post("/api/auth/signin", controller.signin);

    // Ruta para refrescar el token
    app.post("/api/auth/refreshtoken", controller.refreshToken);

    // Ruta para cerrar sesión
    app.post("/api/auth/signout", [authJwt.verifyToken], controller.signout);
};