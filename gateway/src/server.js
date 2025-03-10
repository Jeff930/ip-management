const express = require("express");
const bodyParser = require("body-parser");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
app.use(bodyParser.json());

app.get("/", (req, res) => {
    console.log("test")
    res.send("Gateway is running!");
});

app.use(
    "/auth",
    createProxyMiddleware({
        target: "http://ip-auth-nginx",
        changeOrigin: true,
    })
);

app.use(
    "/ip",
    createProxyMiddleware({
        target: "http://ip-management-service:3000",
        changeOrigin: true,
    })
);

const PORT = 8080;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Gateway running on port ${PORT}`);
});