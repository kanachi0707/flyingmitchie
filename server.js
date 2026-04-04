const http = require("http");
const fs = require("fs");
const path = require("path");

const host = process.env.HOST || "127.0.0.1";
const initialPort = Number.parseInt(process.env.PORT || "4200", 10);
const rootDir = __dirname;

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

function send(res, statusCode, body, contentType) {
  res.writeHead(statusCode, {
    "Cache-Control": "no-store",
    "Content-Type": contentType
  });
  res.end(body);
}

function resolvePath(urlPath) {
  const cleanPath = decodeURIComponent(urlPath.split("?")[0]);
  const requestedPath = cleanPath === "/" ? "/index.html" : cleanPath;
  const fullPath = path.normalize(path.join(rootDir, requestedPath));

  if (!fullPath.startsWith(rootDir)) {
    return null;
  }

  return fullPath;
}

const server = http.createServer((req, res) => {
  const fullPath = resolvePath(req.url || "/");

  if (!fullPath) {
    send(res, 403, "Forbidden", "text/plain; charset=utf-8");
    return;
  }

  fs.readFile(fullPath, (error, data) => {
    if (error) {
      if (error.code === "ENOENT") {
        send(res, 404, "Not Found", "text/plain; charset=utf-8");
        return;
      }

      send(res, 500, "Server Error", "text/plain; charset=utf-8");
      return;
    }

    const extension = path.extname(fullPath).toLowerCase();
    send(res, 200, data, mimeTypes[extension] || "application/octet-stream");
  });
});

function listen(preferredPort) {
  server.listen(preferredPort, host, () => {
    const address = server.address();
    const activePort = typeof address === "object" && address ? address.port : preferredPort;
    console.log(`Flying Mitchie server: http://${host}:${activePort}`);
  });
}

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    const nextPort = Number(server._requestedPort || initialPort) + 1;
    if (nextPort > initialPort + 20) {
      console.error("No open port found between", initialPort, "and", initialPort + 20);
      process.exit(1);
    }
    console.log(`Port ${server._requestedPort} is busy. Retrying on ${nextPort}...`);
    server._requestedPort = nextPort;
    setTimeout(() => listen(nextPort), 50);
    return;
  }

  console.error(error);
  process.exit(1);
});

server._requestedPort = initialPort;
listen(initialPort);
