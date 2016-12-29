const request = require('./../helper/request');
const iconv = require('iconv-lite');
const querystring = require('querystring');
const log = require('./../helper/log');

/**
 * 教学评估
 * @param {object}  data         评估数据
 * @return {array}  teacherList  需要评教的老师列表
 */
const evaluate = (data) => {
  log.info('开始教学评估');
  let postData = '';
  if (data.wjbm === '0000000052') {
    // 助教评价
    postData = querystring.stringify({
      wjbm: data.wjbm,
      bpr: data.bpr,
      pgnr: data.pgnr,
    });
  } else if (data.wjbm === '0000000051') {
    // 老师评价
    postData = querystring.stringify({
      wjbm: data.wjbm,
      bpr: data.bpr,
      pgnr: data.pgnr,
    });
  } else {
    return Promise.reject(new Error('未知教学评估类型'));
  }

  const options = {
    hostname: '202.115.47.141',
    port: 80,
    path: '/jxpgXsAction.do?oper=wjpg',
    method: 'POST',
    headers: {
      Cookie: data.cookie,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData),
    },
  };

  return request(postData, options)
    .then((result) => {
      const successText = '评估成功';
      const errorText = {
        db: '数据库忙请稍候再试',
        failed: '评估失败',
      };
      if (result.body.indexOf(successText) !== -1) {
        log.success('显示教学评估页面成功');
        return Promise.resolve('ok');
      }
      return Promise.reject({
        message: '显示评估页面发生异常',
        teacher: data,
      });
    })
      .catch((exception) => {
        log.error('显示评估页面发生异常');
        log.error(exception);
        return Promise.reject(exception);
      });
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


module.exports = evaluate;
