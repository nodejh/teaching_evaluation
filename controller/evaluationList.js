const log = require('./../helper/log');
const loginZhjw = require('./../models/loginZhjw');
const getEvaluationList = require('./../models/getEvaluationList');


const evaluationListController = (req, res) => {
  log.info('获取需要评教的老师（助教）列表');
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });
  req.on('end', () => {
    const data = JSON.parse(body);
    loginZhjw(data.number, data.password)
      .then((cookie) => {
        log.info(`cookie: ${cookie}`);
        return getEvaluationList(cookie);
      })
      .then((result) => {
        log.success('获取需要评估的老师（助教）列表成功');
        log.success(result);
        const obj = {
          code: 0,
          message: '获取评教列表成功',
          evaluationList: result.teacherList,
          cookie: result.cookie,
        };
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(obj));
        res.end();
      })
        .catch((exception) => {
          console.log('exception: ', exception);
          console.log('message: ', exception.message);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          const obj = {
            code: 1000,
            message: exception.message,
          };
          res.write(JSON.stringify(obj));
          res.end();
        });
  });
};


module.exports = evaluationListController;
