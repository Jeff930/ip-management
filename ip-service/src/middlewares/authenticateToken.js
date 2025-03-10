const axios = require("axios");

module.exports = async function (req, res, next) {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const response = await axios.get(`http://ip-gateway:8080/auth/validate-token`, {
      headers: {
        Authorization: token, 
      },
    });

    if (response.data.isTokenValid) {
      next();
    } else {
      res.status(401).json({ error: "Invalid token." });
    }
  } catch (error) {
    console.error("Error during token validation:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};
