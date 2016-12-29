const path = require('path');


/**
 * 获取 Content-Type
 * @param  {string} filepath 文件路径
 * @return {string}          文件对应的 Conent-Type
 */
const getContentType = (filepath) => {
  let contentType = '';
  const ext = path.extname(filepath);
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
  return contentType;
};


module.exports = getContentType;
