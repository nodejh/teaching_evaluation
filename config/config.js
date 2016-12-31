const config = {
  // 教务系统的 IP 地址
  // 全国很多大学都使用的同一个教务系统，运气好的情况下可通过修改该 IP 支持不同学校
  // 运气不好的情况，可能就是因为评教表单设置的不一样，所以发送 HTTP 请求的时候参数存在问题
  // 具体的评教表单参数在 models/evaluate.js 文件里面的 postData 对象
  hostname: '202.115.47.141',
};


module.exports = config;
