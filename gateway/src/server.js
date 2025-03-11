require("dotenv").config();
const express = require("express");

const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

app.get("/", (res) => {
    res.send("Gateway is running!");
});

app.use(
    "/auth",
    createProxyMiddleware({
        target: process.env.AUTH_SERVICE,
        changeOrigin: true,
    })
);

app.use(
    "/ip",
    createProxyMiddleware({
        target: process.env.IP_MANAGEMENT_SERVICE,
        changeOrigin: true,
    })
);

const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Gateway running on port ${PORT}`);
});
