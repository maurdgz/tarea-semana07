// app/config/auth.config.js
export default {
  secret: "mauricio-secret-key",
  jwtExpiration: 20,           
  jwtRefreshExpiration: 86400,    // 24 hours

  /* for test */
  // jwtExpiration: 60,          // 1 minute
  // jwtRefreshExpiration: 120,  // 2 minutes
};
