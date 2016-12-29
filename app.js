const http = require('http');
const url = require('url');
// const fs = require('fs');
// const path = require('path');

const port = require('./config/config').port;
const ajax = require('./ajax');
const evaluationList = require('./controller/evaluationList');
const evaluate = require('./controller/evaluate');

const server = http.createServer((req, res) => {
  const method = req.method.toLocaleLowerCase();
  const pathname = url.parse(req.url).pathname;
  console.log('method: ', method);
  console.log('pathname: ', pathname);

  if (method === 'post' && pathname === '/api/getEvaluationList') {
    // 模拟登录，获取需要评教的老师列表
    return evaluationList(req, res);
  }

  if (method === 'post' && pathname === '/api/evaluate') {
    // 评教
    return evaluate(req, res);
  }

  if (method === 'get') {
    // 处理 GET 请求
    return ajax.get(req, res);
  }

  // 未知请求，返回 400
  res.writeHead(400, { 'Content-Type': 'text/html' });
  res.write('<h1>Bad Request</h1>');
  res.end();
});

server.listen(port, () => {
  console.log(`Server is running at port ${port}!`);
});
