const request = require('./../helper/request');
const querystring = require('querystring');
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
  if (data.wjbm === '0000000051') {
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
      zgpj: 'Very Good!',
    });
  } else if (data.wjbm === '0000000052') {
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
  } else {
    return Promise.reject(new Error('未知教学评估类型'));
  }

  const options = {
    hostname: config.hostname,
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
        log.error(exception);
        return Promise.reject({
          message: '教学评估失败发生异常',
          teacher: data,
          error: exception,
        });
      });
};


module.exports = evaluate;
