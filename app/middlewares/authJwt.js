// app/middlewares/authJwt.js
// Importamos el módulo 'jsonwebtoken' para trabajar con tokens JWT
import jwt from "jsonwebtoken";

// Importamos el objeto 'db' que contiene los modelos y constantes de la aplicación
import db from "../models/index.js";

// Importamos la configuración de autenticación, que incluye la clave secreta
import authConfig from "../config/auth.config.js";

// Extraemos los modelos 'User' y 'Role' del objeto 'db'
const { user: User, role: Role } = db;

/**
 * Middleware para verificar la validez del token JWT en las solicitudes entrantes.
 */
export const verifyToken = async (req, res, next) => {
  // Obtenemos el token del encabezado 'x-access-token' o 'authorization'
  const token = req.headers["x-access-token"] || req.headers["authorization"];

  // Si no se proporciona un token, respondemos con un error 403 (Prohibido)
  if (!token) {
    return res.status(403).json({ message: "¡No se proporcionó un token!" });
  }

  try {
    // Verificamos y decodificamos el token, eliminando el prefijo 'Bearer ' si existe
    const decoded = jwt.verify(token.replace("Bearer ", ""), authConfig.secret);

    // Almacenamos el ID del usuario decodificado en el objeto de la solicitud para su uso posterior
    req.userId = decoded.id;

    // Buscamos al usuario en la base de datos utilizando el ID obtenido del token
    const user = await User.findByPk(req.userId);

    // Si no se encuentra el usuario, respondemos con un error 401 (No autorizado)
    if (!user) {
      return res.status(401).json({ message: "¡No autorizado!" });
    }

    // Si el token es válido y el usuario existe, pasamos al siguiente middleware o controlador
    next();
  } catch (err) {
    // En caso de que el token sea inválido o haya expirado, respondemos con un error 401
    return res.status(401).json({ message: "¡No autorizado!" });
  }
};

/**
 * Middleware para verificar si el usuario tiene el rol de administrador ('admin').
 */
export const isAdmin = async (req, res, next) => {
  try {
    // Buscamos al usuario en la base de datos utilizando el ID almacenado en la solicitud
    const user = await User.findByPk(req.userId);

    // Obtenemos todos los roles asociados al usuario
    const roles = await user.getRoles();

    // Verificamos si alguno de los roles asignados al usuario es 'admin'
    const adminRole = roles.find((role) => role.name === "admin");

    // Si el usuario tiene el rol de administrador, permitimos el acceso
    if (adminRole) {
      next();
      return;
    }

    // Si el usuario no tiene el rol de administrador, respondemos con un error 403
    res.status(403).json({ message: "¡Se requiere el rol de administrador!" });
  } catch (error) {
    // En caso de error en la consulta o el servidor, enviamos una respuesta de error 500
    res.status(500).json({ message: error.message });
  }
};

/**
 * Middleware para verificar si el usuario tiene el rol de moderador ('moderator').
 */
export const isModerator = async (req, res, next) => {
  try {
    // Buscamos al usuario en la base de datos utilizando el ID almacenado en la solicitud
    const user = await User.findByPk(req.userId);

    // Obtenemos los roles del usuario
    const roles = await user.getRoles();

    // Verificamos si alguno de los roles es 'moderator'
    const modRole = roles.find((role) => role.name === "moderator");

    // Si tiene el rol de moderador, pasamos al siguiente middleware
    if (modRole) {
      next();
      return;
    }

    // Si no tiene el rol de moderador, denegamos el acceso con un error 403
    res.status(403).json({ message: "¡Se requiere el rol de moderador!" });
  } catch (error) {
    // Manejo de errores del servidor
    res.status(500).json({ message: error.message });
  }
};

/**
 * Middleware para verificar si el usuario es moderador o administrador.
 */
export const isModeratorOrAdmin = async (req, res, next) => {
  try {
    // Buscamos al usuario en la base de datos
    const user = await User.findByPk(req.userId);

    // Obtenemos los roles del usuario
    const roles = await user.getRoles();

    // Verificamos si el usuario posee al menos uno de los roles requeridos ('admin' o 'moderator')
    const hasRole = roles.some((role) =>
      ["admin", "moderator"].includes(role.name)
    );

    // Si el usuario cumple con alguno de los roles, permitimos el paso
    if (hasRole) {
      next();
      return;
    }

    // Si no cuenta con ninguno de los roles requeridos, respondemos con un error 403
    res.status(403).json({
      message: "¡Se requiere el rol de moderador o administrador!",
    });
  } catch (error) {
    // Si ocurre un fallo en el proceso, enviamos el mensaje de error correspondiente
    res.status(500).json({ message: error.message });
  }
};