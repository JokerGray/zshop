(function($){
	  var form = layui.form;
	  form.render('checkbox')
      var user = $("#username");
      var code = $(".passwordpass");
      var sendSubmit = $("#sendSubmit");
      var username = localStorage.getItem("username") || "";
      var password = localStorage.getItem("password") || "";
      var isMonthNew = localStorage.getItem("isMonth") || "";
      var btn = localStorage.getItem('btn');
      
      ////当前时间戳
      var timestamp = Date.parse(new Date()) / 1000;
      
      //判断是否保存账户密码
      if (btn == 'true') {
          $("#username").val(username);
          $(".passwordpass").val(password);
          $("#radio").attr("checked", "checked");
          form.render('checkbox');
      }else{
      	  $("#username").val('');
	      $(".passwordpass").val('');
	      $("#radio").attr("checked", false);
	      form.render('checkbox');
      }



		form.on('checkbox(test)', function(data){
		  	localStorage.setItem('btn',data.elem.checked)
		}); 

    //点击placeholder变化
    $('#username,.passwordpass,#security').on('focus',function(){
            var _thisPlaceholder = $(this).attr('placeholder');
            $(this).attr('placeholder','');
            $('#username,.passwordpass,#security').on('blur',function(){
            $(this).attr('placeholder',_thisPlaceholder)
      })
    })
        // 点击显示密码 
        $('.setIcon-view').click(function(e){
            $(this).toggleClass('setIcon-openview')
            if($(this).hasClass('setIcon-openview')){
                $("#passwordpass").prop('type','text')
            }else{
                $("#passwordpass").prop('type','password')
            }
           
        })
        $('.passwordpass').hideShowPassword({
          innerToggle: true,
          top:'50%'
        });
        $('.hideShowPassword-toggle-show').css({
                'cursor':'pointer',
                'color':'transparent',
                'right':'10px'
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
              reqAjaxAsync(cmd,param).then(function(res){
              	if(res.code == 1){
	                  if(form.on('checkbox(test)', function(data){
					  		data.elem.checked = true
						}))
	                  {
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
	                  sessionStorage.setItem('phone', userData.ScSysBackUser.phone);
	                  sessionStorage.setItem('name', userData.ScSysBackUser.name);
	                  sessionStorage.setItem('userId', userId);
	                  sessionStorage.setItem('username', user.val());
	                  sessionStorage.setItem('password', code.val());
	                  sessionStorage.setItem('userImg', userImg);
	                  sessionStorage.setItem('roleIds', roleId);
	                  sessionStorage.setItem('userno', userData.ScSysBackUser.userno);
	                  sessionStorage.setItem('nimToken', userData.ScSysBackUser.nimToken);
                     sessionStorage.setItem('pcNickname', userData.ScSysBackUser.name); //用户昵称

                    yyCache.set("apikey", userData.apikey);
                    yyCache.set("phone", userData.ScSysBackUser.phone);
                    yyCache.set("name", userData.ScSysBackUser.name);
                    yyCache.set("username", user.val());
                    yyCache.set("password", code.val());
                    yyCache.set("userImg", userImg);
                    yyCache.set("roleIds", roleId);
                    yyCache.set("roleName", userData.roleNames);
                    yyCache.set("nimToken", userData.ScSysBackUser.nimToken);
                    yyCache.set("pcNickname", userData.ScSysBackUser.name); //用户昵称
                    yyCache.set("userId", userId);
                    yyCache.set("userno", userData.ScSysBackUser.userno);
                    yyCache.set("organizationId", userData.ScSysBackUser.orgno); //所属组织机构id

	                  location.href = 'index.html';
	              }else {
	                  layer.msg(res.msg);
	              }
              })
          }
      };

      //禁止输入空格
      user.keyup(function() {
          $(this).val($(this).val().replace(/\s/g, ""));
      });
      //监听回车事件
      $(document).keyup(function(e) {
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
      $('.passwordpass').focus(function(){
        $(this).parent().siblings('.setIcon-key').addClass('act');
      }).blur(function(){
      	if($(this).val()==''){
      		$(this).parent().siblings('.setIcon-key').removeClass('act');
      	}else{
      		return false;
      	}
        
      })
  })(jQuery);
  


    

