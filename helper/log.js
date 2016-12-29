const colors = require('./colors');
const dateformat = require('./dateformat');


/**
 * 日志输出
 * @type {Object}
 */
const log = {
  error(message) {
    console.log(colors.Reset, colors.fg.Red, `[${dateformat(new Date())}]`, message, colors.Reset);
  },
  info(message) {
    console.log(colors.Reset, colors.fg.Cyan, `[${dateformat(new Date())}]`, message, colors.Reset);
  },
  success(message) {
    console.log(colors.Reset, colors.fg.Green, `[${dateformat(new Date())}]`, message, colors.Reset);
  },
  text(message) {
    console.log(`[${dateformat(new Date())}]`, message);
  },
};


module.exports = log;
