/**
 * 日期时间格式化
 * @param  {Date} date 日期
 * @return {string}     格式化后的时间 yyyy/mm/dd h:m:s
 */
const dateformat = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDay();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const format = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  return format;
};


module.exports = dateformat;
