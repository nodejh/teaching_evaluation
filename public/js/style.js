(function() {
  var $btn = document.getElementById('btn');
  var $number = document.getElementById('number');
  var $password = document.getElementById('password');
  var $message = document.getElementById('message');

  // 给按钮绑定点击事件
  $btn.addEventListener('click', function(event) {
    console.log('$btn click');
    // 阻止元素的默认行为
    if (event.defaultPrevented) {
      event.defaultPrevented();
    } else {
      window.event.returnValue = false;
    }
    var number = $number.value;
    var password = $password.value;
    if (!number) {
      return alert('请输入学号');
    }
    if (!password) {
      return alert('请输入密码');
    }
    // 获取需要评教的列表
    var url = '/api/evaluationList';
    // var data = 'zjh='+number+'&mm='+password;
    var data = {
      number: number,
      password: password
    };
    console.log('data: ', data);
    // 禁止按钮点击
    setBtnLoading();
    $message.innerHTML = '';
    $message.innerHTML += '<div class="text-info">获取需要评估的老师列表...</div>';
    post(url, data, function(err, res) {
      const parsed = JSON.parse(res);
      console.log('err: ', err);
      console.log('res: ', res);
      console.log('parsed: ', parsed);
      if (err) {
        // HTTP 请求出错 停止运行
        setBtnInit();
        alert('服务器错误，请重试');
        window.location.reload();
        return false;
      }

      // HTTP 请求正确 判断处理结果是否正确
      if (parsed.code === 0) {
        // 进行评教
        var evaluationList = parsed.evaluationList;
        $message.innerHTML += '<div class="text-success">[成功] 共 ' + evaluationList.length + ' 名需要评估的老师 </div>';
        var cookie = parsed.cookie;
        var list = evaluationList.filter(function(item) {
          if (item.isEvalute === '否') {
            return item;
          } else {
            return false;
          }
        });
        console.log('list: ', list);

        // 如果所有老师都已评估完成，则提示“所有老师都已评估完成”
        if (list.length === 0) {
          // 全部都已经评估过
          $message.innerHTML += '<div class="text-info">[提示] 所有老师都已评估完成</div>';
        }

        // 显示已完成评教的教师信息
        evaluationList.forEach(function(item) {
          if (item.isEvalute === '是') {
            console.log('item: ', item);
            $message.innerHTML += '<div class="text-info">[已完成] ' + item.teacherName + ' ' +  item.className + '</div>';
            scrollBottom();
          }
        });

        // 如果所有老师都已完成评估，则停止程序执行
        if (list.length === 0) {
          // 如果所有老师都已完成评估，则停止程序执行
          return false;
        }
        // return false;
        $message.innerHTML += '<div class="text-info">[提示] 开始教学评估...</div>';
        list.map(function(item) {
          console.log('item: ', item);
          // 到这里所有的 item 应该已经都是未评估的了
          if (item.isEvalute === '否') {
            // 进行评教
            var urlEvaluate = '/api/evaluate';
            var dataEvaluate = {
              wjbm: item.wjbm,
              bpr: item.bpr,
              pgnr: item.pgnr,
              cookie: cookie,
              teacherName: item.teacherName,
              className: item.className,
              isEvalute: item.isEvalute,
              type: item.type,
            };
            post(urlEvaluate, dataEvaluate, function(errEvaluate, resEvaluate) {
              if (err) {
                // 评教 HTTP 请求出错
                $message.innerHTML += '<div class="text-failed">[失败] ' + item.teacherName + ' ' +  item.className + ' 评估失败</div>';
                scrollBottom();
                return false;
              }
              var parsedEvaluate = JSON.parse(resEvaluate);
              console.log('parsedEvaluate: ', parsedEvaluate);
              if (parsedEvaluate.code === 0) {
                $message.innerHTML += '<div class="text-success">[成功]  ' + parsedEvaluate.teacher.teacherName + ' ' +  parsedEvaluate.teacher.className + ' 评估成功</div>';
                scrollBottom();
              } else {
                $message.innerHTML += '<div class="text-failed">[失败] ' + parsedEvaluate.teacher.teacherName +' ' + parsedEvaluate.teacher.className + '</div>';
                scrollBottom();
              }
            });
          }
        });
      } else {
        // 失败
        // 取消按钮禁止状态
        setBtnInit();
        $message.innerHTML += '<div>[失败] ' + parsed.message + '</div>';
      }
    });
  });

  function post(url, data, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      console.log('xhr.readyState: ', xhr.readyState);
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          // console.log('xhr.responseText: ', xhr.responseText);
          callback(null, xhr.responseText);
        } else {
          console.log('There was a problem with the request');
          callback(new Error('There was a problem with the request'));
        }
      } else {
        console.log('still not ready...');
      }
    }
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
  }

  function onReadyStateChange(callback) {
    console.log('xhr.readyState: ', xhr.readyState);
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        console.log('xhr.responseText: ', xhr.responseText);
        callback(null, xhr.responseText);
      } else {
        console.log('There was a problem with the request');
        callback(new Error('There was a problem with the request'));
      }
    } else {
      console.log('still not ready...');
    }
  }


  /**
   * 将 message 滚动到底部
   */
  function scrollBottom() {
    console.log('$message.scrollHeight: ', $message.scrollHeight);
    $message.scrollTop = $message.scrollHeight;
  }


  /**
   * 设置按钮的加载状态 禁止使用
   */
  function setBtnLoading() {
    $btn.innerText = '评教中...';
    $btn.setAttribute('disabled', true);
  }


  /**
   * 设置按钮的初始状态
   */
  function setBtnInit() {
    $btn.innerText = '评教';
    $btn.removeAttribute('disabled');
  }

})();
