const http = require('http');
const querystring = require('querystring');
const iconv = require('iconv-lite');

const loginZhjw = (number, password) => {
  const postData = querystring.stringify({
    zjh: number,
    mm: password,
  });
  const options = {
    host: '202.115.47.141',
    method: 'POST',
    path: '/loginAction.do',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData),
    },
  };
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      console.log('STATUS: ', res.statusCode);
      console.log('HEADERS: ', res.headers);
      // res.setEncoding('utf8');
      let body = '';
      res.on('data', (chunk) => {
        body += iconv.decode(chunk, 'GBK');
      });
      res.on('end', () => {
        console.log('no more data in response');
        console.log('body: ', body);
        // resolve(body);
        // 判断是否登录成功
        const successText = '<title>学分制综合教务</title>';
        const errorText = {
          number: '你输入的证件号不存在，请您重新输入！',
          password: '您的密码不正确，请您重新输入！',
          database: '数据库忙请稍候再试',
          notLogin: '请您登录后再使用',
        };
        console.log(body.indexOf(successText));
        if (body.indexOf(successText) !== -1) {
          // 登录成功
          console.log('res.headers: ', res.headers);
          const cookie = res.headers['set-cookie'].join();
          resolve(cookie.split(';')[0]);
        } else if (body.indexOf(errorText.number) !== -1) {
          reject(new Error('你输入的证件号不存在，请您重新输入！'));
        } else if (body.indexOf(errorText.password) !== -1) {
          reject(new Error('您的密码不正确，请您重新输入！'));
        } else if (body.indexOf(errorText.database) !== -1) {
          reject(new Error('您的密码不正确，请您重新输入！'));
        } else if (body.indexOf(errorText.notLogin) !== -1) {
          reject(new Error('请您登录后再使用'));
        } else {
          reject(new Error('登录教务系统失败，请重试！'));
        }
      });
    });
    req.on('error', (error) => {
      console.log('error: ', error);
      reject(error);
    });
    req.write(postData);
    req.end();
  });
};

module.exports = loginZhjw;
