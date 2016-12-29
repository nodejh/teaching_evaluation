const http = require('http');
const querystring = require('querystring');
const evalute = require('./models/evaluate0');
const getTeacherList = require('./models/getTeacherList');
const iconv = require('iconv-lite');
const request = require('request');

// const data = {
//   bpr: "20092135",
//   className: "智能交通",
//   isEvalute: "否",
//   pgnr: "304097020",
//   teacherName: "吕学斌",
//   // token: "JSESSIONID=dca2IUthscBvfeQcb2kLv; path=/",
//   token: 'JSESSIONID=bca07-Y9JDmmh9l2pflLv; path=/',
//   type: "学生评教",
//   wjbm: "0000000051"
// };

const cookie = 'JSESSIONID=cdan6X8JD14lm_f6dzlLv; path=/';
// getTeacherList(cookie)
// .then((result) => {
//   console.log('result: ', result);
// })
// .catch((exception) => {
//   console.log('exception: ', exception);
// });


//
var postData = querystring.stringify({
  // oper: 'wjpg',
  wjbm: '0000000051',
  bpr: '82027866',
  pgnr: '909019020',
  '0000000005': '10_1',
  '0000000006': '10_1',
  '0000000007': '10_1',
  '0000000008': '10_1',
  '0000000009': '10_1',
  '0000000010': '10_1',
  '0000000035': '10_1',
  zgpj: 'Very Good',
  // A141D286: '5515D500B6A4AC653BFB832DCAAA79D8',
});

var options = {
  hostname: '202.115.47.141',
  port: 80,
  path: '/jxpgXsAction.do?oper=wjpg',
  method: 'POST',
  headers: {
    Cookie: cookie,
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(postData)
  }
};

var req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  let body = '';
  res.on('data', (chunk) => {
    body += iconv.decode(chunk, 'GBK');
  });
  res.on('end', () => {
    console.log('No more data in response.');
    console.log('body: ', body);
  });
});

req.on('error', (e) => {
  console.log(`problem with request: ${e.message}`);
});

// write data to request body
req.write(postData);
req.end();

// var data = { wjbm: '0000000051',
//   bpr: '20093326',
//   pgnr: '504299010',
//   '0000000005': '10_1',
//   '0000000006': '10_1',
//   '0000000007': '10_1',
//   '0000000008': '10_1',
//   '0000000009': '10_1',
//   '0000000010': '10_1',
//   '0000000035': '10_1',
//   zgpj: 'Very Good',
//   A141D286: '1B7EDF113632E330DCDB0D19BB50187E',
//  };
//
// req.post({
//    url: 'http://202.115.47.141/jxpgXsAction.do?oper=wjpg',
//    form: data,
//    headers: {
//      'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.110 Safari/537.36',
//       Cookie: 'JSESSIONID=bcaoa2BolPr_b9bMq_cHv; path=/',
//       'Content-Type' : 'application/x-www-form-urlencoded'
//    },
//    method: 'POST'
//   },
//
//   function (e, r, body) {
//
//     console.log('e: ', e);
//     console.log('r: ', r);
//     console.log(body);
//   });
