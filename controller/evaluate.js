const log = require('./../helper/log');
const showEvalutePage = require('./../models/showEvaluatePage');
const evaluate = require('./../models/evaluate');


const evaluateController = (req, res) => {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });
  req.on('end', () => {
    const data = JSON.parse(body);
    showEvalutePage(data)
    .then(() => {
      log.info('显示页面成功，开始教学评估');
      console.log('data: ', data);
      return evaluate(data);
    })
    .then((result) => {
      const obj = {
        code: 0,
        message: '评估成功',
        teacher: result.teacher,
      };
      res.write(JSON.stringify(obj));
      res.end();
    })
      .catch((exception) => {
        log.error('exception: ', exception);
        // console.log('exception: ', exception);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        const obj = {
          code: 1000,
          message: exception.message,
          teacher: exception.teacher,
        };
        res.write(JSON.stringify(obj));
        res.end();
      });
  });
};


module.exports = evaluateController;
