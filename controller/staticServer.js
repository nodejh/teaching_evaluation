const url = require('url');
const fs = require('fs');
const path = require('path');
const getContentType = require('./../helper/getContentType');


/**
 * 静态服务器
 * @param  {object} req request
 * @param  {object} res response
 * @return {null}   null
 */
const staticServerController = (req, res) => {
  let pathname = url.parse(req.url).pathname;
  if (path.extname(pathname) === '') {
    // 没有扩展名，则指定访问目录
    pathname += '/';
  }

  if (pathname.charAt(pathname.length - 1) === '/') {
    // 如果访问的是目录，则添加默认文件 index.html
    pathname += 'index.html';
  }
  // 拼接实际文件路径
  const filepath = path.join(__dirname, './../public', pathname);
  fs.access(filepath, fs.F_OK, (error) => {
    if (error) {
      res.writeHead(404);
      res.end('<h1>404 Not Found</h1>');
      return false;
    }
    const contentType = getContentType(filepath);
    res.writeHead(200, { 'Content-Type': contentType });
    // 读取文件流并使用管道将文件流传输到HTTP流返回给页面
    fs.createReadStream(filepath)
      .pipe(res);
  });
};


module.exports = staticServerController;
