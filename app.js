const http = require('http');
const url = require('url');
const log = require('./helper/log');

const staticServerController = require('./controller/staticServer');
const evaluationListController = require('./controller/evaluationList');
const evaluateController = require('./controller/evaluate');

// HTTP 服务端口
const port = process.env.PORT || 5000;


const server = http.createServer((req, res) => {
  const reqUrl = req.url;
  // HTTP 请求统一为大写
  const method = req.method.toLocaleUpperCase();
  log.info(`${method} ${reqUrl}`);
  const pathname = url.parse(reqUrl).pathname;
  if (method === 'POST' && pathname === '/api/evaluationList') {
    // 模拟登录，获取需要评教的老师列表
    return evaluationListController(req, res);
  }

  if (method === 'POST' && pathname === '/api/evaluate') {
    // 评教
    return evaluateController(req, res);
  }

  if (method === 'GET') {
    // 所有 GET 请求都当作是请求静态资源
    return staticServerController(req, res);
  }

  // 未知请求，返回 400
  res.writeHead(400);
  res.end('<h1>Bad Request</h1>');
});

server.listen(port, () => {
  log.info(`Server is running at port ${port}!`);
});
