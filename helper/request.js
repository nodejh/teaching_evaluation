const http = require('http');
const iconv = require('iconv-lite');
const log = require('./../helper/log');


// options http请求设置的参数；返回请求结果
const request = (postData, options) => {
  log.info('发送HTTP请求');
  log.info(options);
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      // log.info(`STATUS: ${res.statusCode}`);
      // log.info(`HEADERS: ${JSON.stringify(res.headers)}`);
      let body = '';

      res.on('data', (chunk) => {
        body += iconv.decode(chunk, 'GBK');
      });

      res.on('end', () => {
        // log.info(`BODY: ${body}`);
        resolve({
          headers: res.headers,
          body,
        });
      });
    });

    req.on('error', (error) => {
      log.error(error);
      reject(error);
    });

    req.write(postData);
    req.end();
  });
};


module.exports = request;
