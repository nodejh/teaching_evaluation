const querystring = require('querystring');
const request = require('./../helper/request');
const log = require('./../helper/log');
const config = require('./../config/config');


/**
 * 教学评估
 * @param {object}  data         评估数据
 * @return {array}  teacherList  需要评教的老师列表
 */
const evaluate = (data) => {
  log.info('开始教学评估');
  let postData = '';
  if (data.wjbm === '0000000064') {
    // 老师评价 课堂教学
    postData = querystring.stringify({
      wjbm: data.wjbm,
      bpr: data.bpr,
      pgnr: data.pgnr,
      '0000000036': '10_1',
      '0000000037': '10_1',
      '0000000038': '10_1',
      '0000000039': '10_1',
      '0000000040': '10_1',
      '0000000041': '10_1',
      '0000000042': '10_1',
      zgpj: '非常好!',
    });
  } else if (data.wjbm === '0000000062') {
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
      zgpj: 'Very Good!',
    });
  } else if (data.wjbm === '0000000065') {
    // 实验评估
    postData = querystring.stringify({
      wjbm: data.wjbm,
      bpr: data.bpr,
      pgnr: data.pgnr,
      '0000000082': '10_1',
      '0000000083': '10_1',
      '0000000084': '10_1',
      '0000000085': '10_1',
      '0000000086': '10_1',
      '0000000087': '10_1',
      '0000000088': '10_1',
      zgpj: 'Very Good!',
    });
  } else {
    return Promise.reject(new Error('未知教学评估类型'));
  }
  // return false;
  const options = {
    hostname: config.hostname,
    port: 80,
    path: '/jxpgXsAction.do?oper=wjpg',
    method: 'POST',
    headers: {
      Cookie: data.cookie,
      'Upgrade-Insecure-Requests': 1,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData),
      Referer: 'http://202.115.47.141/jxpgXsAction.do',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36',
    },
  };
  console.log('options: ', options);
  return request(postData, options)
    .then((result) => {
      console.log('result: ', result);
      const successText = '评估成功';
      const errorText = {
        db: '数据库忙请稍候再试',
        failed: '评估失败',
      };
      const body = result.body;
      if (body.indexOf(successText) !== -1) {
        log.success('评估成功');
        log.success(data);
        return Promise.resolve({
          message: '评估成功！',
          teacher: data,
        });
      } else if (body.indexOf(errorText.db) !== -1) {
        return Promise.reject({
          message: '数据库忙请稍候再试',
          teacher: data,
        });
      } else if (body.indexOf(errorText.failed) !== -1) {
        return Promise.reject({
          message: '教学评估失败',
          teacher: data,
        });
      }
      return Promise.reject({
        message: '教学评估失败',
        teacher: data,
      });
    })
      .catch((exception) => {
        log.error('教学评估失败发生异常');
        // log.error(exception);
        return Promise.reject({
          message: '教学评估失败发生异常',
          teacher: data,
          error: exception,
        });
      });
};


module.exports = evaluate;
