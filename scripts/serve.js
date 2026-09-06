#!/usr/bin/env node
/**
 * serve.js — Minimal static file server for the public/ directory.
 * No framework, no build step needed.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const DATA_DIR   = path.join(__dirname, '..', 'data');
const PORT = process.env.PORT || 3000;

const MIME = {
  '.html': 'text/html',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.json': 'application/json',
  '.png':  'image/png',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
};

const server = http.createServer((req, res) => {
  let urlPath = req.url.split('?')[0];
  if (urlPath === '/') urlPath = '/index.html';

  // Serve JSON data files from data/
  if (urlPath === '/architecture-graph.json' || urlPath === '/atlas-reference-architectures.json') {
    const file = path.join(DATA_DIR, urlPath.slice(1));
    if (!fs.existsSync(file)) {
      res.writeHead(404); res.end(`Not found. Run: npm run build`);
      return;
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    fs.createReadStream(file).pipe(res);
    return;
  }

  const filePath = path.join(PUBLIC_DIR, urlPath);
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404); res.end('Not found');
    return;
  }

  const ext = path.extname(filePath);
  res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, () => {
  console.log(`\n  Architecture Atlas for SAP Architecture Center`);
  console.log(`  → http://localhost:${PORT}/\n`);
});
