// 性别数组
var sexArr = [
	{label: '男', value: 1},
	{label: '女', value: 0}
];
// 学历数组
var eduArr = [
	{label: '博士', value: 1},
	{label: '硕士', value: 2},
	{label: '本科', value: 3},
	{label: '大专', value: 4},
	{label: '其他', value: 5}
]
// 所有团队成员
var applyuserInfoList = [];
// 正在编辑的成员顺序
var activeIndex = -1;
// 根据手机号获取的验证码
var randomCode = '';
var pickerTimes = 0;
// 页面返回方法
window.onhashchange = function(){
	// 若已经返回到首页
	if(location.hash == ''){
		document.title = '入驻申请表';
		document.getElementById("memberGroup").classList.remove('hide');
		document.getElementById("memberContent").classList.add('hide');
		// 初始化成员数据
		document.getElementById('memberForm').reset();
		document.getElementById('applyerEducation').textContent= eduArr[2].label;
		document.getElementById('applyerBirthday').textContent= '';
		// 清除成员列表
		var memberList = document.querySelectorAll('#teamMemberContent .teamMember');
		for(var i=1; i<memberList.length; i++){
			document.getElementById("teamMemberContent").removeChild(memberList[i]);
		}
		// 刷新成员列表
		for(var i=0; i<applyuserInfoList.length; i++){
			var memberDom = document.querySelector('#teamMemberContent .teamMember.hide').cloneNode(true);
			memberDom.classList.remove('hide');
			// 赋值
			for(var key in applyuserInfoList[i]){
				memberDom.querySelector('.'+key).textContent = applyuserInfoList[i][key];
			}
			memberDom.querySelector('span.edit').id = i
			document.getElementById("teamMemberContent").appendChild(memberDom);			
		}
		// 显示或隐藏按钮提示语
		document.querySelector(".addTeamMember .subtext").classList.toggle('hide', applyuserInfoList.length > 0);
		// 滚动到最底部
		document.body.scrollTop = document.body.scrollHeight
		activeIndex = -1;
	}
}
// 修改手机号，则验证码置空
function removeRandomCode(){
	document.getElementById("randomCode").value = '';
}

// 获取验证码，获取之前需要校验手机号
function getCaptcha(){
	// 已校验或正在发送数据，不能再次点击
	if(checkLoading()) return;
	
	var errClass = 'weui-cell_warn';
	var phone = document.getElementById("phone");
	var phoneContent = document.getElementById("phoneContent");
	
	if(phone.value.length == 0) {
		phoneContent.classList.add(errClass);
		return weui.topTips(phone.getAttribute('emptytips'));
	}
	var reg = new RegExp(phone.getAttribute('pattern'));
	if(!reg.test(phone.value)) {
		phoneContent.classList.add(errClass);
		return weui.topTips(phone.getAttribute('notMatchTips'));
	}
	phoneContent.classList.remove(errClass);
	
	$.ajax({
		type:"post",
		dataType: 'json',
		url:"/zxcity_restful/ws/rest",
		data:{
			cmd: 'coffee/sendCoffeeMessage',
			data: JSON.stringify({
				phone: phone.value,
			}),
			version: 1
		},
		beforeSend: setLoading,
		success: function(data){
			if(data.code == 1){
				setTimer();
				randomCode = data.data.randomcode;
			} else {
				clearLoading();
				randomCode = ''
			}
			weui.alert(data.msg);
		},
		error: function (){
			clearLoading();
			weui.alert('请求超时，请重试……');
		}
	});
}
// 检测加载样式,true，表示正在加载中，不能使用
function checkLoading(){
	var captchaBtn = document.getElementById("captchaBtn");
	return captchaBtn.classList.contains('weui-btn_loading');
}
// 设置加载样式
function setLoading(){
	var captchaBtn = document.getElementById("captchaBtn");
	captchaBtn.innerHTML = '<i class="weui-loading"></i> 正在发送'
	captchaBtn.classList.add('weui-btn_loading');
}
// 清除加载样式
function clearLoading(){
	var captchaBtn = document.getElementById("captchaBtn");
	captchaBtn.innerHTML = '获取验证码';
	captchaBtn.classList.remove('weui-btn_loading');
}
// 设置定时器样
function setTimer(){
	var time = 60;
	var captchaBtn = document.getElementById("captchaBtn");
	captchaBtn.innerHTML = '重新发送('+ time +'s)';
	var interval = setInterval(function(){
		if(time < 2){
			clearInterval(interval);
			clearLoading();
			return;
		}
		time--;
		captchaBtn.innerHTML = '重新发送('+ time +'s)';
	}, 1000)
	captchaBtn.classList.add('weui-btn_loading');
}

// 点击打开性别选择
function selectSex(dom){
	var label = dom.textContent;
	var value = 0;
	for(var i=0; i<sexArr.length; i++){
		if(sexArr[i].label == label) value = sexArr[i].value
	}
	weui.picker(sexArr, {
		defaultValue: [value],
		onConfirm: function(result){
			dom.textContent = result[0].label;
		}
	})
}

// 点击打开学历选项
function selectEduction (dom){
	pickerTimes++;
	var label = dom.textContent;
	var value = 0;
	for(var i=0; i<eduArr.length; i++){
		if(eduArr[i].label == label) value = eduArr[i].value
	}
	weui.picker(eduArr, {
		defaultValue: [value],
		onConfirm: function(result){
			dom.textContent = result[0].label;
		},
		id: dom.id + pickerTimes
	})
}

// 点击打开生日选项
function selectBirthday(dom){
	pickerTimes++;
	var label = dom.textContent;
	var defaultValue;
	defaultValue = !label ? ['1990', '01', '01'] : label.split('-');
	var start = new Date();
	start.setFullYear(start.getFullYear()-70);
	var end = new Date();
	end.setFullYear(end.getFullYear()-10);
	weui.datePicker({
		id: dom.id + pickerTimes,
		start: start,
		end: end,
		defaultValue: defaultValue,
		onConfirm: function(result){
			var year = result[0].value + '-';
			var month = (result[1].value < 10 ? ('0' + result[1].value) : result[1].value) + '-';
			var day = result[2].value < 10 ? ('0' + result[2].value) : result[2].value;
			dom.textContent = year + month + day;
		}
	});
}


// 跳转到添加界面
function toAddMember(){
	window.location.hash= '#addMember';
	document.title = '入驻申请 - 添加团队成员';
	document.getElementById("memberGroup").classList.add('hide');
	document.getElementById("editBtn").classList.add('hide');
	document.getElementById("memberContent").classList.remove('hide');
	document.getElementById("addBtn").classList.remove('hide');
}

// 添加成员后，回到原始界面
function addMember(){
	// 校验
	var validate = false;
	weui.form.validate('#memberForm', function (result) {
		var warnClass = 'weui-cell_warn';
		var warnList = document.querySelectorAll('#memberForm .'+warnClass);
		for(var i=0;i<warnList.length; i++){
			warnList[i].classList.remove(warnClass);
		}
		if(result) result.ele.classList.add(warnClass)
		validate = !result;
	});
	if(!validate) return;
	// 生日校验
	if($('#applyerBirthday').text().length == 0){
		$('#applyerBirthday').parent().addClass('weui-cell_warn');
		weui.topTips('请点击选择生日！');
		return;
	}
	// 校验成功，添加成员
	applyuserInfoList.push({
		applyerName: document.getElementById('applyerName').value,
		applyerDuty: document.getElementById('applyerDuty').value,
		applyerEducation: document.getElementById('applyerEducation').textContent,
		applyerBirthday: document.getElementById('applyerBirthday').textContent,
		applyerPhone: document.getElementById('applyerPhone').value
	});
	// 返回上一步
	window.history.go(-1);
}

// 跳转到编辑界面
function toEditMember(dom){
	// 切换显隐
	window.location.hash= '#editMember';
	document.title = '入驻申请 - 编辑团队成员';
	document.getElementById("memberGroup").classList.add('hide');
	document.getElementById("memberContent").classList.remove('hide');
	document.getElementById("editBtn").classList.remove('hide');
	document.getElementById("addBtn").classList.add('hide');
	// 获取和设置数据位置，加载数据
	activeIndex = parseInt(dom.id);
	var userInfo = applyuserInfoList[activeIndex];
	for (var key in userInfo) {
		var dom = document.querySelector("#memberContent #"+key)
		dom.value = userInfo[key];
		dom.textContent = userInfo[key];
	}
}

// 编辑成员后，回到原始界面
function editMember(){
	// 校验
	var validate = false;
	weui.form.validate('#memberForm', function (result) {
		var warnClass = 'weui-cell_warn';
		var warnList = document.querySelectorAll('#memberForm .'+warnClass);
		for(var i=0;i<warnList.length; i++){
			warnList[i].classList.remove(warnClass);
		}
		if(result) result.ele.classList.add(warnClass)
		validate = !result;
	});
	if(!validate) return;
	applyuserInfoList[activeIndex] = {
		applyerName: document.getElementById('applyerName').value,
		applyerDuty: document.getElementById('applyerDuty').value,
		applyerEducation: document.getElementById('applyerEducation').textContent,
		applyerBirthday: document.getElementById('applyerBirthday').textContent,
		applyerPhone: document.getElementById('applyerPhone').value
	};
	window.history.go(-1);
}

// 删除成员，回到原始界面
function delMember(){
	// 删除成员
	applyuserInfoList.splice(activeIndex, 1);
	window.history.go(-1);
}

// 只有在已获得验证码的时候，才需要检测验证码
function checkRandomCode(flag){
	var str = randomCode + '';
	// 若检测时还没有获得验证码，则提示获取验证码
	if(flag && str.length == 0) {
		weui.topTips('请点击按钮获取验证码！');
		return false;
	}
	// 未检测时，没有验证码，则忽略
	if(str.length == 0) return false;
	// 校验
	if(document.getElementById("randomCode").value != str){
		weui.topTips('验证码不正确！');
		return false;
	}
	return true;
}

// 提交表单
function submitForm(){
	// 防止重复提交
	if($('.btn-submit').hasClass('loading')) return;
	
	// 校验
	var validate = false;
	weui.form.validate('#form', function (result) {
		var warnClass = 'weui-cell_warn';
		var warnList = document.querySelectorAll('#form .'+warnClass);
		for(var i=0;i<warnList.length; i++){
			warnList[i].classList.remove(warnClass);
		}
		if(result) result.ele.classList.add(warnClass)
		validate = !result;
	});
	if(!validate) return;
	// 校验生日
	if($('#leaderBirthday').text().length == 0){
		$('#leaderBirthday').parent().addClass('weui-cell_warn');
		weui.topTips('请点击选择生日！');
		return;
	}
	// 校验验证码
	if(!checkRandomCode(true)) return;
	// 校验团队成员
	if(applyuserInfoList.length == 0) return weui.topTips('请添加至少一位团队成员！');
	
	var domArr = document.querySelectorAll('#form [name]');
	var data = {}
	for(var i=0; i<domArr.length; i++){
		data[domArr[i].getAttribute('name')] = domArr[i].value || domArr[i].textContent
	}
	data['applyuserInfoList'] = applyuserInfoList;
	
	var loading;
	$.ajax({
		type:"post",
		dataType: 'json',
		url:"/zxcity_restful/ws/rest",
		data:{
			cmd: 'coffee/addSettleteamInfo',
			data: JSON.stringify(data),
			version: 1
		},
		beforeSend: function () {
			$('.btn-submit').addClass('loading');
			loading = weui.loading('提交中……');
		},
		complete: function () {
			loading.hide();
			$('.btn-submit').removeClass('loading');
		},
		success: function (data) {
			if(data.code == 1){
				weui.toast('提交成功', function () {
					location.replace('application_success.html');
				});
			} else {
				weui.alert(data.msg);
			}
		},
		error: function (err) {
			weui.alert('请求超时，请重试……');
		}
	});
}

