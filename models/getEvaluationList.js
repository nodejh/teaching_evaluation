const cheerio = require('cheerio');
const request = require('./../helper/request');
const log = require('./../helper/log');
const config = require('./../config/config');


/**
 * 获取需要评价的教师（助教列表）
 * @param  {string} cookie 登录后的 cookie
 * @return {object}        需要评价的教师（助教列表）
 */
const getEvaluationList = (cookie) => {
  const options = {
    host: config.hostname,
    method: 'GET',
    // 这里pageSize=100主要是为了列出所有需要评估的老师（助教）
    path: '/jxpgXsAction.do?oper=listWj&pageSize=100',
    headers: {
      Cookie: cookie,
    },
  };
  return request('', options)
    .then((result) => {
      const successText = '学生评估问卷列表';
      const errorText = {
        db: '数据库忙请稍候再试',
      };
      const body = result.body;
      if (body.indexOf(successText) !== -1) {
        // 开始分析页面html，找出需要评估的老师列表
        const $ = cheerio.load(body, {
          ignoreWhitespace: true,
          xmlMode: false,
          lowerCaseTags: false,
        });
        const $list = $('#user').find('tr.odd');
        log.info(`$list.length: ${$list.length}`);
        const teacherList = [];
        $list.each((index, item) => {
          const params = $(item).find('td').eq(4).find('img')
            .attr('name')
            .split('#@');
          const data = {
            // 问卷名称 学生评估/研究生助教评价
            type: $(item).find('td').eq(0).text()
              .replace(/\s+/g, ''),
            // 被评人
            teacherName: $(item).find('td').eq(1).text()
              .replace(/\s+/g, ''),
            // 评估内容
            className: $(item).find('td').eq(2).text()
              .replace(/\s+/g, ''),
            // 是否已评估 否/是
            isEvalute: $(item).find('td').eq(3).text()
              .replace(/\s+/g, ''),
            wjbm: params[0],
            bpr: params[1],
            pgnr: params[5],
          };
          teacherList.push(data);
        });
        return Promise.resolve({
          teacherList,
          cookie,
        });
      } else if (body.indexOf(errorText.db) !== -1) {
        return Promise.reject(new Error('数据库忙请稍候再试'));
      }
      return Promise.reject(new Error('获取需要评估的教师列表出错，请稍后重试'));
    })
      .catch((exception) => {
        log.error('获取需要评估的教师列表出错，请稍后重试');
        log.error(exception);
        return Promise.reject(exception);
      });
};


module.exports = getEvaluationList;
