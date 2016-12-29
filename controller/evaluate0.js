const showEvalutePage = require('./../models/showEvaluatePage');


const evaluateController = (req, res) => {
  console.log('login...');
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });
  req.on('end', () => {
    const data = JSON.parse(body);
    showEvalutePage(data)
    .then(() => {
      console.log('show evaluate page...');
      return evaluate.evaluate(data.token, data);
    })
      .then((result) => {
        console.log('评教结果: ', result);
        const obj = {
          code: 0,
          message: '评教成功',
          teacher: result.teacher,
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
          teacher: exception.teacher,
        };
        res.write(JSON.stringify(obj));
        res.end();
      });
  });
};


module.exports = evaluateController;
