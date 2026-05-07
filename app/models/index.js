// app/models/index.js
import Sequelize from "sequelize";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Importamos la configuración y modelos usando require para mantener compatibilidad con tus archivos .js
const dbConfig = require("../config/db.config.js");
const userModel = require("./user.model.js");
const roleModel = require("./role.model.js");
const refreshTokenModel = require("./refreshToken.model.js");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    pool: dbConfig.pool,
    port: dbConfig.port || dbConfig.PORT, // Aseguramos que use el puerto correcto
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = userModel(sequelize, Sequelize);
db.role = roleModel(sequelize, Sequelize);
db.refreshToken = refreshTokenModel(sequelize, Sequelize);

// Relaciones
db.refreshToken.belongsTo(db.user, { foreignKey: 'userId', targetKey: 'id' });
db.user.hasOne(db.refreshToken, { foreignKey: 'userId', targetKey: 'id' });

db.role.belongsToMany(db.user, {
    through: "user_roles",
    foreignKey: "roleId",
    otherKey: "userId",
});

db.user.belongsToMany(db.role, {
    through: "user_roles",
    foreignKey: "userId",
    otherKey: "roleId",
    as: "roles",
});

db.ROLES = ["user", "admin", "moderator"];

export default db;