const loginZhjw = require('./../models/loginZhjw');
const getTeacherList = require('./../models/getTeacherList');


const evaluationList = (req, res) => {
  console.log('login...');
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });
  req.on('end', () => {
    const data = JSON.parse(body);
    loginZhjw(data.number, data.password)
      .then((cookie) => {
        console.log('cookie: ', cookie);
        // console.log('typeof cookie: ', typeof cookie);
        return getTeacherList(cookie);
      })
      .then((result) => {
        console.log('getTeacherList: ', result);
        const obj = {
          code: 0,
          message: '获取评教列表成功',
          evaluationList: result.teacherList,
          token: result.token,
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


module.exports = evaluationList;
