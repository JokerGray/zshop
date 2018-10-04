(function ($) {
	const GETSITEPAGE = 'operations/queryVersionPage',//分页查询版本列表
		ADDSITE = 'operations/addVersion',//新增版本
		UPDATESITE = 'operations/modifyVersion',//修改版本
		DELETESITE = 'operations/deleteVersion'//删除版本


	var layer = layui.layer;
	var form = layui.form;



	//初始化
	function List(_this) {
		var platform = _this.attr('data-platform');
		var parms = "{'platform':'" + platform + "'}";
		var res = reqAjax(GETSITEPAGE, parms);
		if (res.total == 1) {
			var data = res.data[0];
			$('#version').val(data.version);
			$('#version').attr("data-ver", data.version);
			$('#url').val(data.url);
			$('#forceNew').val(data.forceNew);
			$('#updateLog').val(data.updateLog);
			$('#hasPatch').val(data.hasPatch);
			$('#md5').val(data.md5);
			$('#versionCode').val(data.versionCode);
			$('#showGame').val(data.showGame);
			$('#areaurl').val(data.areaurl);
            $('#newSpecific').val(data.newSpecific);
		} else {
			$('#version').val('');
			$('#url').val('');
			$('#forceNew').val('');
			$('#updateLog').val('');
			$('#hasPatch').val('');
			$('#md5').val('');
			$('#versionCode').val('');
			$('#showGame').val('');
            $('#areaurl').val('');
            $('#newSpecific').val('');
		}
	}

	(function () {
		List($('.search-li').eq(0))
	})();



	$('.search-li').on('click', function () {
		$(this).addClass('act').siblings().removeClass('act');
		var index = $(this).index();
		sessionStorage.setItem('index', index)
		List($(this));
	})

	//保存方法
	function save() {
		$('#save').attr('lay-submit', '');
		$('#save').attr('lay-filter', 'formDemo');
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
				var url = $('#url').val();
				var forceNew = $('#forceNew').val();
				var updateLog = $('#updateLog').val();
				var hasPatch = $('#hasPatch').val();
				var md5 = $('#md5').val();
				var versionCode = $('#versionCode').val();
				var showGame = $('#showGame').val();
                var newSpecific =  $('#newSpecific').val();
				var platform = $('.search-ul>li.act').attr('data-platform');
				var oldVersion = $('#version').attr("data-ver");

				var pam = {
					newVersion: version,
					oldVersion: oldVersion
				}
				var areaurl = $('#areaurl').val();
				//先调接口
                reqAjaxAsync('operations/versionComparing', JSON.stringify(pam)).done(function (res1) {
					if (res1.code == 1) {
						// var parms={
                         //    userNo:userNo,
                         //    version:version,
                         //    logo:'',
                         //    url:url,
                         //    platform:platform,
                         //    forceNew:forceNew,
                         //    updateLog:updateLog,
                         //    hasPatch:hasPatch,
                         //    md5:md5,
                         //    versionCode:versionCode,
                         //    showGame:showGame,
                         //    areaurl:areaurl,
                         //    newSpecific:newSpecific
						// }JSON.stringify(parms)

						var parms = "{'userNo':'" + userNo + "','version':'" + version + "','logo':'','url':'" + url + "','platform':'" + platform + "','forceNew':'" + forceNew + "','updateLog':'" + updateLog + "','hasPatch':'" + hasPatch + "','md5':'" + md5 + "','versionCode':'" + versionCode + "','showGame':'" + showGame + "','areaurl':'"+areaurl+"','newSpecific':'"+newSpecific+"'}"
						var res = reqAjax(UPDATESITE,parms );
						if (res.code == 1) {
							layer.msg(res.msg);
							List(inx);
						} else {
							layer.msg(res.msg);
						}
					} else {
						layer.confirm('新版本号小于旧版本号, 要继续这样设置吗?', {
							btn: ['是', '否'] //按钮
						}, function () {
							var parms = "{'userNo':'" + userNo + "','version':'" + version + "','logo':'','url':'" + url + "','platform':'" + platform + "','forceNew':'" + forceNew + "','updateLog':'" + updateLog + "','hasPatch':'" + hasPatch + "','md5':'" + md5 + "','versionCode':'" + versionCode + "','showGame':'" + showGame + "','areaurl':'"+areaurl+"'}"
							var res = reqAjax(UPDATESITE, parms);
							if (res.code == 1) {
								layer.msg(res.msg);
								List(inx);
							} else {
								layer.msg(res.msg);
							};
						}, function (index) {
							layer.close(index);
							List(inx);
							return false;
						});
					}
				});


				//layer.msg(res.msg)
			}
			return false;
		})
	}

	$('#save').on('click', save)
	//保存方法
	/*function save(){
		$('#save').attr('lay-submit', '');
		$('#save').attr('lay-filter', 'formDemo');
		form.render()
		form.on('submit(formDemo)', function(done) {
			if(done){
				var userNo = sessionStorage.getItem('userno');
				var version = $('#version').val();
				var url = $('#url').val();
				var forceNew = $('#forceNew').val();
				var updateLog = $('#updateLog').val();
				var hasPatch = $('#hasPatch').val();
				var md5 = $('#md5').val();
				var versionCode = $('#versionCode').val();
				var showGame = $('#showGame').val();
				var platform = $('.search-ul>li.act').attr('data-platform');
				var parms ="{'userNo':'"+userNo+"','version':'"+version+"','logo':'','url':'"+url+"','platform':'"+platform+"','forceNew':'"+forceNew+"','updateLog':'"+updateLog+"','hasPatch':'"+hasPatch+"','md5':'"+md5+"','versionCode':'"+versionCode+"','showGame':'"+showGame+"'}"
				var res= reqAjax(UPDATESITE,parms);
				layer.msg(res.msg)
			}

		})
	}

	$('#save').on('click',save)*/


	//查看历史版本
	$('#goHistory').on('click', function () {
		// console.log($(this).frames);
		var url = $(this).attr('data-url');
		var platform = $("#search ul.search-ul li.act").attr("data-platform");
		var name = $(this).attr('data-name');
		if (url != "") {
			var newurl ='page/' +  url.replace(".html", "/") +  url;
			// alert(newurl);
			// addTab(url,name);
			//$("#pageFrame",window.parent.document).attr("src", newurl);

			var onthisid = $(window.parent.document).find(".top_tab li[class*='layui-this']").attr("lay-id");
			$(window.parent.document).find("iframe[data-id='"+onthisid+"']").attr("src",newurl + "?v=" + new Date().getMilliseconds()).attr("id",platform);

			//window.top.admin.current(newurl + "?v=" + new Date().getMilliseconds());
		}
	})



	//点击左侧菜单，顶部会相应增加tab
	function addTab(url, name) {
		openTab(name, url);
		window.top.misc.openTab(name, url);
		
		if (name.length > 5) {
			var newname = name.substr(0, 4) + '...';
		} else {
			var newname = name;
		}
		var str = "";
		str += '<li class="head-add ave">' +
			'<a data-href="' + url + '">' +
			'<span class="head-menus"></span><span class="head-txt">' + newname + '</span>' +
			'</a>' +
			'<i class="nav-close"></i>' +
			'</li>';
		//遍历是否重复存在
		var names = $(".menu-head li", window.parent.document);
		var arr = [];
		for (var i = 0; i < names.length; i++) {
			arr.push(names.eq(i).find("a").attr("title"));
			if (name == names.eq(i).find("a").attr("title")) {
				names.removeClass("ave");
				names.eq(i).addClass("ave");
			}
		}
		if ($.inArray(name, arr) == -1) {
			var num = sessionStorage.getItem("indx");
			$(".menu-nav li", window.parent.document).eq(num).addClass("ave");
			$(".menu-head li", window.parent.document).removeClass("ave");
			$(".menu-head", window.parent.document).append(str);
			moretab();
			topmenu();
		}
	}

	/**
	 * 跳转页面
	 * @param {*} key 
	 * @param {*} url 
	 */
	function openTab(key, url) { 

				if (url && url.indexOf("html") > 0) {
						if (url.indexOf("/") < 0) {
								url = url.replace(".html", "/") + url;
						}
				}

		window.open(key);
	}

	//顶部tab超过8个就关闭倒数第二个
	function moretab() {
		var lengs = $(".menu-head li", window.parent.document).length;
		if (lengs > 8) {
			$(".menu-head li", window.parent.document).eq(7).remove();
		}
	}

	function topmenu() {
		var menulist = $(".menu-head li", window.parent.document);
		for (var i = 1; i < menulist.length; i++) {
			if (i == 1) {
				menulist.eq(i).css("z-index", 98 - i);
				menulist.eq(i).css("left", 200);
			} else {
				var offsetwith = menulist.eq(i - 1).offset().left;
				menulist.eq(i).css("z-index", 98 - i);
				menulist.eq(i).css("left", offsetwith + 148);
			}

		}
	}


})(jQuery)