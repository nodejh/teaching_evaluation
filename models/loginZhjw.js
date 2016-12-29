const querystring = require('querystring');
const request = require('./../helper/request');
const log = require('./../helper/log');


/**
 * 登录教务系统
 * @param  {string} number   学号
 * @param  {string} password 密码
 * @return {Promise}          cookie
 */
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
  return request(postData, options)
    .then((result) => {
      // 判断是否登录成功
      const successText = '<title>学分制综合教务</title>';
      const errorText = {
        number: '你输入的证件号不存在，请您重新输入！',
        password: '您的密码不正确，请您重新输入！',
        database: '数据库忙请稍候再试',
        notLogin: '请您登录后再使用',
      };
      console.log(result.body.indexOf(successText));
      if (result.body.indexOf(successText) !== -1) {
        // 登录成功
        const cookie = result.headers['set-cookie'].join().split(';')[0];
        log.success('登录教务系统成功');
        log.success(cookie);
        return Promise.resolve(cookie);
      } else if (result.body.indexOf(errorText.number) !== -1) {
        return Promise.reject(new Error('你输入的证件号不存在，请您重新输入！'));
      } else if (result.body.indexOf(errorText.password) !== -1) {
        return Promise.reject(new Error('您的密码不正确，请您重新输入！'));
      } else if (result.body.indexOf(errorText.database) !== -1) {
        return Promise.reject(new Error('您的密码不正确，请您重新输入！'));
      } else if (result.body.indexOf(errorText.notLogin) !== -1) {
        return Promise.reject(new Error('请您登录后再使用'));
      }
      return Promise.reject(new Error('登录教务系统失败，请重试！'));
    })
      .catch((exception) => {
        log.error('登录教务系统失败');
        log.error(exception);
        return Promise.reject(exception);
      });
};

module.exports = loginZhjw;
