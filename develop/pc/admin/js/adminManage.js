$(function () {
	var addUserId = '', oldUserId = '', modifyUserId = '';
	var form = layui.form();
	//获取权限状态：
	getAuthority();

	//获取nav角色栏
	getRoleNav();

	//获取绑定用户下拉框
	getAllUser({'subscriptionName': ''}, $("#bindInpValue"));
	form.render("select", "test"); //更新全部
	form.on('select(test)', function(data){
		addUserId = data.value;
	});
	
	//获取全部列表：
	getTable('');

	//给所有input设置禁止输入空格
	inhibitTrim('input');

	//点击tab栏切换样式：
	$('.adminTab li').click(function () {
		start.tabSwitch(this);
		var cmsnewUserid = $(this).attr('cmsnewUserid');
		start.getTabData({
			url: 'SelectAdministratorsList',
			data: {
				'cmsnewRoleid': cmsnewUserid,
				"pagination": {
					"page": start.page,
					"rows": start.rows
				}
			}
		});
		start.getPage(start.pages, {
			"cmsnewRoleid": cmsnewUserid,
			"pagination": {
				"page": start.page,
				"rows": start.rows
			}
		})
	})

	//点击添加按钮调用：
	$('#search_icon').click(function () {
		start.tabSwitch('#tabAll');
		var username = delTrim($('#penName_inp').val());
		var usercode = delTrim($('#autherName_inp').val());
		var cmsnewRoleid = $('#inputValue').val();
		var password = delTrim($('#password_inp').val());
		if (username && usercode && cmsnewRoleid && password && addUserId) {
			start.addAdmin({
				url: 'register',
				data: {
					username: username,
					usercode: usercode,
					cmsnewRoleid: cmsnewRoleid,
					password: password,
					bangsubscription: addUserId
				}
			})
			//获取全部列表：
			getTable('');
		} else {
			layer.msg('添加的信息必须填写完整');
		}
	})

	//删除管理员:
	$('#tableCon').on('click', '.tab_cancel', function () {
		var id = $(this).attr('id');
		layer.confirm('确认删除吗？', {
            title: "提示",
            btn: ['确认', '取消'],
            btn1: function (index, layero) {
				var res = reqNewAjax('delectAdministratorsList', {id: id});
				layer.msg(res.msg);
				if (res.code != 1) {return false};
				if (res.code == 1) {
					getTable($('.adminTab li.active').attr('cmsnewUserid'));
				}
            }
        });
	})

	var username, usercode, cmsnewUserid, id;
	//点击修改按钮渲染原始信息：
	$('#tableCon').on('click', '.tabNotice_btn', function () {
		var _this = this;
		oldUserId = $(_this).attr('userId');
		var thisTr = $(this).parent().parent();
		$('#NameInp').val(thisTr.find('.userName').html());
		$('#autherNameInp').val(thisTr.find('.usercode').html());
		$('#postInp').val(thisTr.find('.adminType').attr('cmsnewUserid'));
		$('#passwordInp').val('');
		username = $('#NameInp').val();
		usercode = $('#autherNameInp').val();
		cmsnewUserid = $('#postInp').val();
		id = thisTr.find('.tab_cancel').attr('id');
		//修改弹窗中的绑定用户下拉框
		getAllUser({'subscriptionName': ''}, $("#modifyBindInpValue"));
		form.render("select", "modifyTest"); //更新全部
		inhibitTrim('input');
		$('#modifyBindUserBox input').val($(_this).attr('name'));
		form.on('select(modifyTest)', function(data){
			modifyUserId = data.value;
		});
	})

	//点击确认按钮发送修改数据：
	$('#updateBtn').click(function () {
		var NameInp = delTrim($('#NameInp').val()), autherNameInp = delTrim($('#autherNameInp').val()), passwordInp = delTrim($('#passwordInp').val()), newBindValueInp = delTrim($('#modifyBindUserBox input').val());
		if (username != NameInp || usercode != autherNameInp || cmsnewUserid != $('#postInp').val() || passwordInp != '' || modifyUserId != '') {
			var data = {}, bangsubscription = '';
			modifyUserId == '' ? bangsubscription = oldUserId : bangsubscription = modifyUserId;
			if ($('#passwordInp').val() == '') {
				data = {
					'id': id,
					'username': NameInp,
					'usercode': autherNameInp,
					'cmsnewRoleid': $('#postInp').val(),
					'bangsubscription': bangsubscription
				}
			} else {
				data = {
					'id': id,
					'username': NameInp,
					'usercode': autherNameInp,
					'cmsnewRoleid': $('#postInp').val(),
					'bangsubscription': modifyUserId,
					'password': passwordInp
				}
			}
			start.updateAdmin({
				url: 'updateAdministratorsList',
				data: data
			})
			//获取全部列表：
			getTable($('.adminTab li.active').attr('cmsnewUserid'));
			$('#passwordInp').val('');
			$('#updateBtn').attr('data-dismiss', 'modal');
		} else {
			$('#updateBtn').attr('data-dismiss', '');
			layer.msg('请修改至少一项信息！');
		}
	})
})

var layer = layui.layer;
var laypage = layui.laypage;
var laydate = layui.laydate;
var laytpl = layui.laytpl;
var start = {
	rows: 5,
	page: 1,
	pages: 1,
	tabSwitch: function (html) {
		$('.adminTab li').removeClass('active');    //tab栏切换
		$(html).addClass('active');
	},
	getTabData: function (d) {               //刷新页面时显示所有列表数据
		var url = d.url || "";
		var data = d.data || "";
		var res = reqNewAjax(url, data);
		if (res.code == 1) {
			var total = res.total;
			var data = res.data;
			var getTpl = $("#tableList").html();

			start.pages = Math.ceil(total / start.rows);
			if (!isNull(data)) {
				laytpl(getTpl).render(data, function (html) {
					$("#tableCon").html(html);
				});
				//表格内对添加的时间做处理：
				switchTime();
			} else {
				$("#tableCon").html('');
			}
		} else if (res.code == 9) {
			layer.msg(res.msg);
		}
	},
	addAdmin: function (d) {
		var url = d.url || "";
		var data = d.data || "";
		var res = reqNewAjax(url, data);
		if (res.code == 1) {
			var data = res.data;
			$('#penName_inp').val('');
			$('#autherName_inp').val('');
			$('#inputValue').val('');
			$('#password_inp').val('');
			$('#bindUser_box input').val('');
		} else if (res.code == 9) {
			layer.msg(res.msg);
		}
	},
	updateAdmin: function (d) {
		var url = d.url || "";
		var data = d.data || "";
		var res = reqNewAjax(url, data);
		if (res.code == 1) {
			if (!isNull(data)) {
				console.log('修改成功');
			} else {
				console.log('修改失败');
			}
		} else if (res.code == 9) {
			layer.msg(res.msg);
		}
	},
	getPage: function (pages, d) {         //获取分页
		laypage({
			cont: 'page', //容器。值支持id名、原生dom对象，jquery对象,
			pages: pages, //总页数
			skip: true, //是否开启跳页
			skin: '#2BC6FF',
			groups: 3, //连续显示分页数
			jump: function (obj) {
				start.page = obj.curr;
				d.pagination.page = obj.curr;
				start.getTabData({
					url: "SelectAdministratorsList",
					data: d
				})
			}
		});
	}
}

function switchTime() {
	$('.createtime').each(function (i, e) {
		var date = Number($(this).html());
		var hours = new Date(date).getHours() >= 10 ? new Date(date).getHours() : '0' + new Date(date).getHours();
		var minutes = new Date(date).getMinutes() >= 10 ? new Date(date).getMinutes() : '0' + new Date(date).getMinutes();
		var seconds = new Date(date).getSeconds() >= 10 ? new Date(date).getSeconds() : '0' + new Date(date).getSeconds();
		var getTime = hours + ':' + minutes + ':' + seconds;
		date = format(new Date(date));
		$(this).html(date + ' ' + getTime);
	})
}

//获取全部列表：
function getTable(cmsnewUserid) {
	start.getTabData({
		url: 'SelectAdministratorsList',
		data: {
			"cmsnewRoleid": cmsnewUserid,
			"pagination": {
				"page": start.page,
				"rows": start.rows
			}
		}
	});
	start.getPage(start.pages, {
		"cmsnewRoleid": cmsnewUserid,
		"pagination": {
			"page": start.page,
			"rows": start.rows
		}
	})
}

//获取nav角色栏
function getRoleNav() {
	var res = reqNewAjax('SelectAdministrators', {available: 1});
	if(res.code != 1) {return layer.msg(res.msg)};
	if(res.code == 1) {
		var getRoleL = res.data || [];
		if (getRoleL.length > 0) {
		    var str = '';
		    for (i = 0; i < getRoleL.length; i++) {
		        str += '<li class="fl" cmsnewUserid="' + getRoleL[i].uId + '">';
		        str += getRoleL[i].name;
		        str += '</li>';
		    }
		    $('#adminTab').append(str);
		}
	}
}