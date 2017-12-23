const request = require('./../helper/request');
const querystring = require('querystring');
const log = require('./../helper/log');
const config = require('./../config/config');


/**
 * 显示教学评估页面
 * @param {object}  data         评估数据
 * @return {array}  teacherList  需要评教的老师列表
 */
const showEvalutePage = (data) => {
  log.info('显示评估页面');
  let postData = '';
  console.log('data: ', data);
  if (data.wjbm === '0000000064') {
    // 老师评价
    postData = querystring.stringify({
      wjbm: data.wjbm,
      bpr: data.bpr,
      pgnr: data.pgnr,
      wjmc: data.type,
      bprm: data.teacherName,
      pgnrm: data.className,
    });
  } else if (data.wjbm === '0000000062') {
    // 助教评价
    postData = querystring.stringify({
      oper: 'wjShow',
      wjbm: data.wjbm,
      bpr: data.bpr,
      pgnr: data.pgnr,
      wjmc: data.type,
      bprm: data.teacherName,
      pgnrm: data.className,
    });
  } else if (data.wjbm === '0000000065') {
    // 实验评估
    postData = querystring.stringify({
      oper: 'wjShow',
      wjbm: data.wjbm,
      bpr: data.bpr,
      pgnr: data.pgnr,
      wjmc: data.type,
      bprm: data.teacherName,
      pgnrm: data.className,
    });
  } else {
    return Promise.reject(new Error('未知教学评估类型'));
  }
  const options = {
    hostname: config.hostname,
    port: 80,
    path: '/jxpgXsAction.do?oper=wjShow',
    method: 'POST',
    headers: {
      Cookie: data.cookie,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData),
    },
  };
  return request(postData, options)
    .then((result) => {
      const successText = '问卷评估页面';
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
        // log.error(exception);
        return Promise.reject({
          message: '显示评估页面发生异常',
          teacher: data,
          error: exception,
        });
      });
};


module.exports = showEvalutePage;
