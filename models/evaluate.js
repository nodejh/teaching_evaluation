const http = require('http');
const iconv = require('iconv-lite');
const querystring = require('querystring');


/**
 * 显示教学评估页面
 * @param {string}  cookie       登录后的cookie
 * @param {object}  data         评估数据
 * @return {array}  teacherList  需要评教的老师列表
 */
const show = (cookie, data) => {
  console.log('cookie: ', cookie);
  console.log('data: ', data);
  let postData = '';
  if (data.wjbm === '0000000052') {
    // 助教评价
    postData = querystring.stringify({
      wjbm: data.wjbm,
      bpr: data.bpr,
      pgnr: data.pgnr,
      '0000000028': '10_1',
      '0000000029': '10_1',
      '0000000030': '10_1',
      '0000000031': '10_1',
      '0000000032': '10_1',
      '0000000033': '10_1',
      zgpj: 'Very Good',
    });
  } else if (data.wjbm === '0000000051') {
    // 老师评价
    postData = querystring.stringify({
      wjbm: data.wjbm,
      bpr: data.bpr,
      pgnr: data.pgnr,
      '0000000005': '10_1',
      '0000000006': '10_1',
      '0000000007': '10_1',
      '0000000008': '10_1',
      '0000000009': '10_1',
      '0000000010': '10_1',
      '0000000035': '10_1',
      zgpj: 'Very Good',
    });
  }
  console.log('postData: ', postData);
  const options = {
    hostname: '202.115.47.141',
    port: 80,
    path: '/jxpgXsAction.do?oper=wjShow',
    method: 'POST',
    headers: {
      Cookie: cookie,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData),
    },
  };
  console.log('options: ', options);
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      console.log('STATUS: ', res.statusCode);
      console.log('HEADERS: ', res.headers);
      let body = '';
      res.on('data', (chunk) => {
        body += iconv.decode(chunk, 'GBK');
      });
      res.on('end', () => {
        console.log('no more data in response');
        // console.log('body: ', body);
        const successText = '问卷评估页面';
        if (body.indexOf(successText) !== -1) {
          resolve('ok');
        } else {
          reject({
            message: '教学评估失败',
            teacher: data,
          });
        }
      });
    });
    req.on('error', (error) => {
      console.log('error: ', error);
      // reject(error);
      reject({
        message: '教学评估失败',
        teacher: data,
      });
    });
    req.write(postData);
    req.end();
  });
};


/**
 * 教学评估
 * @param {string}  cookie       登录后的cookie
 * @param {object}  data         评估数据
 * @return {array}  teacherList  需要评教的老师列表
 */
const evaluate = (cookie, data) => {
  console.log('cookie: ', cookie);
  console.log('data: ', data);
  const postData = querystring.stringify({
    wjbm: data.wjbm,
    bpr: data.bpr,
    pgnr: data.pgnr,
    '0000000005': '10_1',
    '0000000006': '10_1',
    '0000000007': '10_1',
    '0000000008': '10_1',
    '0000000009': '10_1',
    '0000000010': '10_1',
    '0000000035': '10_1',
    zgpj: 'Very Good',
  });
  console.log('postData: ', postData);
  const options = {
    hostname: '202.115.47.141',
    port: 80,
    path: '/jxpgXsAction.do?oper=wjpg',
    method: 'POST',
    headers: {
      Cookie: cookie,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData),
    },
  };
  console.log('options: ', options);
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      console.log('STATUS: ', res.statusCode);
      console.log('HEADERS: ', res.headers);
      let body = '';
      res.on('data', (chunk) => {
        body += iconv.decode(chunk, 'GBK');
      });
      res.on('end', () => {
        console.log('no more data in response');
        console.log('body: ', body);
        const successText = '评估成功';
        const errorText = {
          db: '数据库忙请稍候再试',
          failed: '评估失败',
        };
        if (body.indexOf(successText) !== -1) {
          resolve({
            message: '评估成功！',
            teacher: data,
          });
        } else if (body.indexOf(errorText.db) !== -1) {
          // reject(new Error('数据库忙请稍候再试'));
          reject({
            message: '数据库忙请稍候再试',
            teacher: data,
          });
        } else if (body.indexOf(errorText.failed) !== -1) {
          // reject(new Error('评估失败'));
          reject({
            message: '教学评估失败',
            teacher: data,
          });
        } else {
          // reject(new Error('评教失败'));
          reject({
            message: '教学评估失败',
            teacher: data,
          });
        }
      });
    });
    req.on('error', (error) => {
      console.log('error: ', error);
      // reject(error);
      reject({
        message: '教学评估失败',
        teacher: data,
      });
    });
    req.write(postData);
    req.end();
  });
};


module.exports = {
  show,
  evaluate,
};
