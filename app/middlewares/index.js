// app/middlewares/index.js
// Importamos los middlewares de autenticación y verificación de registro
import * as authJwt from "./authJwt.js";
import * as verifySignUp from "./verifySignUp.js";

// Exportamos un objeto que contiene ambos middlewares para facilitar su importación en otros archivos
export {
    authJwt,
    verifySignUp
};