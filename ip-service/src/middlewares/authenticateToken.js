const axios = require("axios");

module.exports = async function (req, res, next) {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const response = await axios.get(`${process.env.GATEWAY_URL}/auth/validate-token`, {
      headers: {
        Authorization: token, 
      },
    });
    if (response.data.isTokenValid) {
      req.user = {
        ...response.data.user,
        role: {
          ...response.data.user.role,
          permissions: response.data.user.role.permissions
        }
      };
      console.log("User with permissions:", req.user);
      next();
    } else {
      res.status(401).json({ error: "Invalid token." });
    }
  } catch (error) {
    console.error("Error during token validation:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};
