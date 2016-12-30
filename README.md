##


## 系统设计

所有 GET 请求，都当作是对静态文件的请求。

然后对其他方式的请求，单独进行处理。主要是 POST

登录人数已满的时候，密码错误会提示登录人数已满
教务系统评教页面，它为了防止恶意提交，必须先访问页面，再提交数据


http://stackoverflow.com/questions/4389932/how-do-you-disable-viewport-zooming-on-mobile-safari

To improve accessibility on websites in Safari, users can now pinch-to-zoom even when a website sets user-scalable=no in the viewport.
