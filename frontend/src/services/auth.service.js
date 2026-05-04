import api from "./api";

const register = (username, email, password) => {
  return api.post("/auth/signup", {
    username,
    email,
    password,
  });
};

const login = (username, password) => {
  return api
    .post("/auth/signin", {
      username,
      password,
    })
    .then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem("refreshToken", response.data.refreshToken);
      }

      return response.data;
    });
};

const logout = () => {
  return api.post("/auth/signout").then(() => {
    localStorage.removeItem("refreshToken");
  });
};

const getCurrentUser = () => {
  // This might need to be handled via context or a dedicated endpoint
  // For now, we return null as user state is in Context
  return null;
};

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
};

export default AuthService;
