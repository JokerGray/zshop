(function ($) {
    var USER_URL = {
       	APPVERSION:'operations/queryAppVersionAll',//查询所有列表
		SAVEORUPDATE:'operations/saveOrUpdateAppVersion'
    };
    var layer,form;
    layui.use(['form', 'layer', 'jquery', 'laydate', 'table', 'laypage', 'element'], function () {
        layer = layui.layer;
        form  = layui.form;
	});

    $('.search-li').on('click', function () {
        $(this).addClass('act').siblings().removeClass('act');
        var index = $(this).index();
        // sessionStorage.setItem('index', index)
        List($(this));
    })

	//初始化
	function List(_this) {
		var platform = _this.attr('data-platform');
		var parms = "{'platform':'" + platform + "'}";
		var res = reqAjax(USER_URL.APPVERSION, parms);
		// console.log(res);
		if (res.data.length>0) {
			var data = res.data[0];
			$('#version').val(data.version).attr("data-ver", data.version);
            $("input[name=status][value="+data.status+"]").prop("checked",true);
            $('#remark').val(data.remark);
        } else {
            $("input[name=status]").prop("checked",false)
            $('#version').val('').attr('data-ver','');
            $('#remark').val('');

		}
        $('.layui-btn').attr('platform',platform)
        form.render();

	}

	(function () {
		List($('.search-li').eq(0))
	})();





	//保存方法
	function save() {
		var save = $('#save');
        save.attr('lay-submit', '');
        save.attr('lay-filter', 'formDemo');
		form.render();
		var inx = $('.search-li.act');
		form.on('submit(formDemo)', function (done) {
			if (done) {
				var userNo = yyCache.get('userno');
				var version = $('#version').val();
				//判断是否符合版本号正则
				var regx = /^[0-9]{1,2}(\.[0-9]{1,2}){1,3}$/; //匹配（**.**.**.**）或者（*.*.*.*）小数点前最多2位，最多出现3个小数点
				if (!regx.test(version)) {
					layer.alert("请输入正确的版本号");
					return false;
				}
                var platform = save.attr('platform')
				var remark = $('#remark').val() || '';
				var status = $("input[name=status]:checked").val();
				var pam = {
                    platform:platform,
                    version:version,
                    remark:remark,
                    status:status
				}
				//先调接口
				reqAjaxAsync(USER_URL.SAVEORUPDATE, JSON.stringify(pam)).done(function (res1) {
					if(res1.code == 1){
						layer.msg('操作成功')
                        List($('.search-li').eq(platform));

                    }
				});


				//layer.msg(res.msg)
			}
			return false;
		})
	}

	$('#save').on('click', save)



})(jQuery)