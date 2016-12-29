const http = require('http');
const iconv = require('iconv-lite');
const cheerio = require('cheerio');


/**
 * 获取需要评教的老师列表
 * @param {string}  cookie       登录后的cookie
 * @return {arrya}  teacherList  需要评教的老师列表
 */
const getTeacherList = (cookie) => {
  const options = {
    host: '202.115.47.141',
    method: 'GET',
    // 这里pageSize=100主要是为了列出所有需要评教的老师（助教）
    path: '/jxpgXsAction.do?oper=listWj&pageSize=14',
    headers: {
      Cookie: cookie,
    },
  };
  console.log('options: ', options);
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
        // console.log('body: ', body);
        const successText = '学生评估问卷列表';
        const errorText = {
          db: '数据库忙请稍候再试',
        };
        if (body.indexOf(successText) !== -1) {
          // 开始分析页面html，找出需要评教的老师列表
          const $ = cheerio.load(body, {
            ignoreWhitespace: true,
            xmlMode: false,
            lowerCaseTags: false,
          });
          const $list = $('#user').find('tr.odd');
          console.log('$list.length: ', $list.length);
          const teacherList = [];
          $list.each((index, item) => {
            console.log('index: ', index);
            // console.log('item: ', item);
            const params = $(item).find('td').eq(4).find('img')
              .attr('name')
              .split('#@');
            const data = {
              // 问卷名称 学生评教/研究生助教评价
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
          // console.log('teacherList: ', teacherList);
          // console.log('new cookie: ', res.headers['set-cookie']);
          resolve({
            teacherList,
            token: cookie,
          });
        } else if (body.indexOf(errorText.db) !== -1) {
          reject(new Error('数据库忙请稍候再试'));
        } else {
          reject(new Error('获取需要评教的教师列表出错，请稍后重试'));
        }
      });
    });
    req.on('error', (error) => {
      console.log('error: ', error);
      reject(error);
    });
    req.write('');
    req.end();
  });
};


module.exports = getTeacherList;
