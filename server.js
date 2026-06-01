/**
 * Custom Next.js server.
 * Handles HTTP requests (Next.js) and WebSocket upgrades (/api/ws/*) on the same port.
 * WS connections are proxied to FastAPI running on the same machine.
 */

require("dotenv").config();

const http = require("http");
const { parse } = require("url");
const next = require("next");
const WebSocket = require("ws");

const dev = process.env.NODE_ENV !== "production";
const port = parseInt(process.env.PORT ?? "3000", 10);
const fastapiWsBase = (process.env.API_ENDPOINT ?? "http://localhost:8000")
  .replace(/^http/, "ws")
  .replace(/\/$/, "");

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  // In dev mode Next.js needs to handle HMR WebSocket (/_next/webpack-hmr).
  // getUpgradeHandler() returns Next.js's own upgrade handler for those paths.
  const upgradeNext = dev ? app.getUpgradeHandler() : null;

  const server = http.createServer((req, res) => {
    handle(req, res, parse(req.url, true));
  });

  server.on("upgrade", (req, socket, head) => {
    if (!req.url.startsWith("/api/ws/")) {
      // Not our WebSocket — let Next.js handle HMR or destroy if prod
      if (upgradeNext) upgradeNext(req, socket, head);
      else socket.destroy();
      return;
    }

    const targetUrl = `${fastapiWsBase}${req.url}`;
    const targetWs = new WebSocket(targetUrl, {
      headers: { cookie: req.headers.cookie ?? "" },
    });

    targetWs.on("open", () => {
      // complete the upgrade handshake with the browser
      const wss = new WebSocket.Server({ noServer: true });
      wss.handleUpgrade(req, socket, head, (clientWs) => {
        // isBinary (ws v8+) preserves text/binary frame type across the proxy.
        // Without it ws would forward all frames as binary and FastAPI's
        // receive_text() would fail with KeyError: 'text'.
        clientWs.on("message", (data, isBinary) => {
          if (targetWs.readyState === WebSocket.OPEN)
            targetWs.send(data, { binary: isBinary });
        });
        targetWs.on("message", (data, isBinary) => {
          if (clientWs.readyState === WebSocket.OPEN)
            clientWs.send(data, { binary: isBinary });
        });

        clientWs.on("close", () => targetWs.close());
        targetWs.on("close", (code) => {
          if (clientWs.readyState === WebSocket.OPEN) clientWs.close(code);
        });

        clientWs.on("error", () => targetWs.close());
        targetWs.on("error", () => {
          if (clientWs.readyState === WebSocket.OPEN) clientWs.close(1011);
        });
      });
    });

    targetWs.on("error", () => {
      socket.write("HTTP/1.1 502 Bad Gateway\r\n\r\n");
      socket.destroy();
    });
  });

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
