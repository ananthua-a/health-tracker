import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const API_TARGET = process.env.API_TARGET || "http://localhost:8000";
const PORT = process.env.PORT || 3000;

// Serve static files from the React build
app.use(express.static(path.join(__dirname, "dist")));

// Proxy API requests
app.use(
  "/api",
  createProxyMiddleware({
    target: API_TARGET,
    changeOrigin: true,
    pathRewrite: { "^/api": "" },
    onProxyReq: (proxyReq, req) => {
      if (req.body) {
        proxyReq.setHeader("Content-Type", req.headers["content-type"] || "application/json");
      }
    },
  })
);

// Fallback to index.html for React Router
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Frontend server running at http://localhost:${PORT}`);
  console.log(`API proxy target is ${API_TARGET}`);
});
