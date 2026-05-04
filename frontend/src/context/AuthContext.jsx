import React, { createContext, useState, useEffect, useContext } from "react";
import AuthService from "../services/auth.service";
import { setAccessToken } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Attempt to recover session on mount
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      // Podríamos llamar a un endpoint /me o simplemente esperar al primer error 401 para activar el refresco.
      // Para esta implementación, asumiremos que es necesario iniciar sesión de nuevo si se pierde el estado,
      // O bien, podemos implementar un refresco silencioso (silent refresh) en este punto.
      // Implementaremos una verificación básica o lo dejaremos para la primera petición. 
    }
    setLoading(false)
  }, []);

  const login = async (username, password) => {
    const data = await AuthService.login(username, password);
    setAccessToken(data.accessToken);
    setUser({
      id: data.id,
      username: data.username,
      email: data.email,
      roles: data.roles,
    });
    return data;
  };

  const logout = async () => {
    await AuthService.logout();
    setAccessToken("");
    setUser(null);
  };

  const register = (username, email, password) => {
    return AuthService.register(username, email, password);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
