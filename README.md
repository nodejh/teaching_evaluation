# 一键评教

问题反馈：[issues](https://github.com/nodejh/teaching_evaluation/issues)

网址: 
  - [http://pj.nodejh.com](http://pj.nodejh.com)
  - [http://pj.fyscu.com](http://pj.fyscu.com)
  
XX大学教务系统的一键评教程序。你懂的。

## Usage

```
$ git clone https://github.com/nodejh/teaching_evaluation
```

然后修改 `config/config.js` 中的 `hostname` 为你的学校的 IP，默认为四川大学。

四川大学可完美评教，其他学校没有测试过呢。

接下来运行：

```
$ cd teaching_evaluation
$ npm i
$ npm start
```

启动成功后，在浏览器访问 `localhost:5000` 即可。


更多：[一键评教软件架构及代码分析](https://zhuanlan.zhihu.com/p/24651022)

## License

[MIT](https://github.com/nodejh/teaching_evaluation/blob/master/LICENSE.md)
