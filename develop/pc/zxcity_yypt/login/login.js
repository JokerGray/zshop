(function($){
      var user = $("#username");
      var code = $("#password");
      var sendSubmit = $("#sendSubmit");
      var username = localStorage.getItem("username") || "";
      /*var nickname = localStorage.getItem("username") || "";*/
      var password = localStorage.getItem("password") || "";
      var isMonthNew = localStorage.getItem("isMonth") || "";
      ////当前时间戳
      var timestamp = Date.parse(new Date()) / 1000;

      //判断是否保存账户密码
      if (!isNull(username) && !isNull(password)) {
          $("#username").val(username);
          $("#password").val(password);
          $("#radio").attr("checked", "checked");
      }

      //判断是否选中一个月免登录
      $("#radio").click(function() {
          var checked = $(this).attr("checked");
          if (checked == "checked") {
              $("#radio").attr("checked", false);
          } else {
              $("#radio").attr("checked", "checked");
          }
      });

    //点击placeholder变化
    $('#username,#password,#security').on('focus',function(){
            var _thisPlaceholder = $(this).attr('placeholder');
            $(this).attr('placeholder','');
            $('#username,#password,#security').on('blur',function(){
            $(this).attr('placeholder',_thisPlaceholder)
      })
    })
        // 点击显示密码 
        $('#password').hideShowPassword({

          // Creates a wrapper and toggle element with minimal styles.

          innerToggle: true,

          // Makes the toggle functional in touch browsers without

          // the element losing focus.

          touchSupport: Modernizr.touch
        });
        $('.hideShowPassword-toggle-show').css({
                'cursor':'pointer',
                'color':'transparent'
        });

    //点击眼睛变样式
    $('.hideShowPassword-toggle').click(function(){
        var val = $("#view").attr("class");
        if(val == "setIcon-view"){
            $("#view").attr("class","setIcon-openview");
        };
        if(val == "setIcon-openview"){
            $("#view").attr("class","setIcon-view");
        };

    });

    // 点击清除用户名
        $('i.setIcon-x').on('click',function(){
            $('#username').val('')
        })

    //初始化加载登录
      var login = {
          checkInput: function () {
              if($.trim(user.val()) == '' || $.trim(code.val()) == '' ){
                  layer.msg('请输入正确的用户名或者密码！', { icon: 2, shade: [0.1, '#fff'], offset: '50%' }, function() {
                      user.val().trim() == "" ? user.focus() : code.focus();
                  });
                 return false;
              };
              this.sendSubmit();
          },
          sendSubmit:function(){
              layer.load(0, { shade: [0.1, '#fff'] });
              var _this = this;
              var cmd = "operations/login";
              var param = "{'usercode':'"+ user.val() + "','password':'" + code.val() +"'}";
              var res = reqAjax(cmd,param);
              if(res.code == 1){
                  if($("#radio").attr("checked") == "checked"){
                      //是否有一个月
                      var isMonthOld = timestamp + 60 * 60 * 24 * 30;
                      if(isNull(isMonthNew)){
                          //保存一个月后的时间
                          localStorage.setItem("isMonth", isMonthOld);
                      }
                      //保存账户密码
                      localStorage.setItem("username", user.val());
                      localStorage.setItem("password", code.val());
                  }else{
                      //清空cookie
                      localStorage.setItem("isMonth", "");
                      localStorage.setItem("username", "");
                      localStorage.setItem("password", "");
                  }
                  layer.msg('登录成功！');
                  var userData = res.data;
                  var userId = userData.ScSysBackUser.id;
                  var userImg = userData.ScSysBackUser.userImg;
                  var roleId = userData.roleIds[0];
                  sessionStorage.setItem('apikey', userData.apikey);
                  sessionStorage.setItem('userId', userId);
                  sessionStorage.setItem('username', user.val());
                  sessionStorage.setItem('password', code.val());
                  sessionStorage.setItem('userImg', userImg);
                  sessionStorage.setItem('roleIds', roleId);
                  sessionStorage.setItem('userno', userData.ScSysBackUser.userno);
                  sessionStorage.setItem('nimToken', userData.ScSysBackUser.nimToken);
                  location.href = 'login_success.html';
              }else {
                  layer.msg(res.msg);
              }
          }
      };

      //禁止输入空格
      user.keyup(function() {
          $(this).val($(this).val().replace(/\s/g, ""));
      });
      //监听回车事件
      code.keyup(function(e) {
          $(this).val($(this).val().replace(/\s/g, ""));
          if (e && e.keyCode == 13) {
              login.checkInput();
          }
      });
      //提交
      sendSubmit.click(function() {
          login.checkInput();
      });

      $('#username').focus(function(){
        $(this).siblings('.setIcon-amdin').addClass('act');
      }).blur(function(){
      	if($(this).val()==''){
      		$(this).siblings('.setIcon-amdin').removeClass('act');
      	}else{
      		return false;
      	}
        
      })
      $('#password').focus(function(){
        $(this).parent().siblings('.setIcon-key').addClass('act');
      }).blur(function(){
      	if($(this).val()==''){
      		$(this).parent().siblings('.setIcon-key').removeClass('act');
      	}else{
      		return false;
      	}
        
      })
  })(jQuery);
  


    

