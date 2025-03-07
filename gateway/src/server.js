const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

app.use("/auth", createProxyMiddleware({
    target: "http://ip-auth-service:9000",
    changeOrigin: true
}));

app.use("/ip", createProxyMiddleware({
    target: "http://ip-management-service:3000",
    changeOrigin: true
}));

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Gateway running on port ${PORT}`);
});
