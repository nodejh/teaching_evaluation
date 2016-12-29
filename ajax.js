const fs = require('fs');
const url = require('url');
const path = require('path');

const publicDir = './public';

const get = (req, res) => {
  let pathname = url.parse(req.url).pathname;
  if (pathname === '/') {
    pathname = '/index.html';
  }
  const filepath = path.join(__dirname, publicDir, pathname);
  console.log('filepath: ', filepath);
  fs.access(filepath, fs.F_OK, (error) => {
    if (error) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.write('<h1>File Not Found</h1>');
      res.end();
      return false;
    }
    const ext = path.extname(filepath);
    let contentType = 'text/html';
    switch (ext) {
      case '.html':
        contentType = 'text/html';
        break;
      case '.js':
        contentType = 'text/javascript';
        break;
      case '.css':
        contentType = 'text/css';
        break;
      case '.gif':
        contentType = 'image/gif';
        break;
      case '.jpg':
        contentType = 'image/jpeg';
        break;
      case '.png':
        contentType = 'image/png';
        break;
      case '.ico':
        contentType = 'image/icon';
        break;
      case '.manifest':
        contentType = 'text/cache-manifest';
        break;
      default:
        contentType = 'application/octet-stream';
    }
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filepath).pipe(res);
  });
};

// const json = (req, res) => {
//   let body = '';
//   req.on('data', (chunk) => {
//     body += chunk;
//   });
//
//   req.on('end', () => {
//     res.writeHead(200, { 'Content-Type': 'application/json' });
//     res.write(JSON.stringify(body));
//     res.end();
//   });
// };

module.exports = {
  get,
  // json,
};
