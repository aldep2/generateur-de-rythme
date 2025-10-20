const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json({limit: '5mb'}));

// Serve static files from project root (so entraineur-rythme.html is available)
// Add a permissive Content-Security-Policy header for local development
// IMPORTANT: this middleware MUST run before express.static so static files
// (including the main HTML) receive the header.
app.use((req, res, next) => {
  const csp = "default-src 'self' data: https:; " +
    "script-src 'self' 'unsafe-inline' https:; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://www.gstatic.com https:; " +
    "style-src-elem 'self' 'unsafe-inline' https://www.gstatic.com https://fonts.googleapis.com https:; " +
    "font-src 'self' https: data:; " +
    "img-src 'self' data: https:; " +
    "connect-src 'self' http: https: ws:; " +
    "worker-src 'self' blob: data:;";

  res.setHeader('Content-Security-Policy', csp);
  next();
});

// Serve static files from project root (so entraineur-rythme.html is available)
app.use(express.static(path.join(__dirname)));

const exportsDir = path.join(__dirname, 'exports');
if (!fs.existsSync(exportsDir)) fs.mkdirSync(exportsDir);

app.post('/save-export', (req, res) => {
  const { filename, data } = req.body;
  if (!filename || !data) return res.status(400).send('filename and data required');
  const safe = path.basename(filename);
  const dest = path.join(exportsDir, safe);
  fs.writeFile(dest, data, (err) => {
    if (err) return res.status(500).send(err.message);
    res.send('ok');
  });
});

// List exports (filename and mtime)
app.get('/exports/list', (req, res) => {
  fs.readdir(exportsDir, (err, files) => {
    if (err) return res.status(500).send(err.message);
    const infos = files.filter(f => !f.startsWith('.')).map(f => {
      const stat = fs.statSync(path.join(exportsDir, f));
      return { name: f, size: stat.size, mtime: stat.mtimeMs };
    });
    res.json(infos);
  });
});

// Download an exported file (safe basename)
app.get('/exports/download', (req, res) => {
  const file = req.query.file;
  if (!file) return res.status(400).send('file query required');
  const safe = path.basename(file);
  const dest = path.join(exportsDir, safe);
  if (!fs.existsSync(dest)) return res.status(404).send('not found');
  res.download(dest, safe, (err) => {
    if (err) console.error('download error', err);
  });
});

// Debug route: show response headers (useful to check CSP)
app.get('/_debug_headers', (req, res) => {
  // Return both request headers (what the browser sent) and response headers
  // (what the server will send). This helps debug proxies/extensions.
  res.json({ reqHeaders: req.headers, resHeaders: res.getHeaders() });
});

const PORT = process.env.PORT || 50056;
console.log('CSP header template configured. Starting server...');
app.listen(PORT, () => console.log(`Export server running on http://localhost:${PORT}`));
