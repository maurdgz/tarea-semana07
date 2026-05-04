// app/controllers/auth.controller.js
// Importa el objeto de modelos (User, Role, etc.) desde la carpeta models
import db from "../models/index.js";

// Importa la librería jsonwebtoken para generar tokens JWT
import jwt from "jsonwebtoken";

// Importa bcryptjs para encriptar y comparar contraseñas
import bcrypt from "bcryptjs";

// Importa la configuración del secreto JWT desde un archivo de configuración
import authConfig from "../config/auth.config.js";

// Extrae los modelos User, Role y RefreshToken desde el objeto db
const { user: User, role: Role, refreshToken: RefreshToken } = db;

// Controlador para el registro de usuarios
export const signup = async (req, res) => {
    try {
        // Extrae los datos enviados en el cuerpo de la solicitud
        const { username, email, password, roles } = req.body;

        // Encripta la contraseña antes de guardarla en la base de datos
        const hashedPassword = await bcrypt.hash(password, 8);

        // Busca el rol "user" en la base de datos para asignarlo por defecto
        const userRole = await Role.findOne({ where: { name: "user" } });

        // Crea un nuevo usuario con los datos proporcionados y la contraseña encriptada
        const user = await User.create({
            username,
            email,
            password: hashedPassword
        });

        // Asocia el rol encontrado al usuario (relación muchos a muchos)
        await user.setRoles([userRole]);

        // Devuelve respuesta exitosa
        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        // En caso de error, responde con código 500 y el mensaje del error
        res.status(500).json({ message: error.message });
    }
};

// Controlador para el inicio de sesión
export const signin = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Busca el usuario por su nombre de usuario, incluyendo sus roles
        const user = await User.findOne({
            where: { username },
            include: { model: Role, as: "roles" }
        });

        // Si no se encuentra el usuario, responde con error 404
        if (!user) {
            return res.status(404).json({ message: "User Not found." });
        }

        // Compara la contraseña proporcionada con la almacenada (ya encriptada)
        const passwordIsValid = await bcrypt.compare(password, user.password);

        // Si la contraseña no es válida, responde con error 401
        if (!passwordIsValid) {
            return res.status(401).json({
                accessToken: null,
                message: "Invalid Password!"
            });
        }

        // Si la contraseña es válida, genera un token JWT
        const token = jwt.sign({ id: user.id }, authConfig.secret, {
            expiresIn: authConfig.jwtExpiration
        });

        let refreshToken = await RefreshToken.createToken(user);

        // Crea un array con los roles del usuario en el formato 'ROLE_ADMIN', 'ROLE_USER', etc.
        const authorities = user.roles.map((role) => `ROLE_${role.name.toUpperCase()}`);

        // Responde con la información del usuario y el token de acceso
        res.status(200).json({
            id: user.id,
            username: user.username,
            email: user.email,
            roles: authorities,
            accessToken: token,
            refreshToken: refreshToken,
        });
    } catch (error) {
        // Si ocurre un error en el proceso, responde con código 500 y el mensaje del error
        res.status(500).json({ message: error.message });
    }
};

export const refreshToken = async (req, res) => {
  const { refreshToken: requestToken } = req.body;

  if (requestToken == null) {
    return res.status(403).json({ message: "Refresh Token is required!" });
  }

  try {
    let refreshToken = await RefreshToken.findOne({ where: { token: requestToken } });

    if (!refreshToken) {
      res.status(403).json({ message: "Refresh token is not in database!" });
      return;
    }

    if (RefreshToken.verifyExpiration(refreshToken)) {
      RefreshToken.destroy({ where: { id: refreshToken.id } });
      res.status(403).json({
        message: "Refresh token was expired. Please make a new signin request",
      });
      return;
    }

    const user = await refreshToken.getUser();
    let newAccessToken = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: authConfig.jwtExpiration,
    });

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: refreshToken.token,
    });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};

export const signout = async (req, res) => {
  try {
    await RefreshToken.destroy({ where: { userId: req.userId } });
    res.status(200).send({ message: "You've been signed out!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};