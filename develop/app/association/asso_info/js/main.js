$(document).ready(function(){
	var maxNum, txt;
	var txt = $('#art_con').text();
	if(txt.length > 83) {
		$('#art_con').html(txt.substr(0,83) + '...<a class="art_look" href="#">查看详情</a>');
	} else {
		$('#art_con').html(txt);
	}

	var id, param;
	id = action.GetParameter('id');
	param = {'id': id, 'userId':'1058'};
	
	action.getJson('association/getOrgById', param, function(obj){
		// 分享
		if(obj.code == 1){
			share(obj.data.name, obj.data.instruction, obj.data.logo)
		} else {
			return layer.open({ content: obj.msg, skin: 'msg', time: 3});
		}

		var html = template('icon_box',obj);
		$('#jd_detail_img').html(html);
		var data = obj.data;
		
		if(!data['requirement']) {
			$('#jr_con').html('无');
		} else {
			$('#jr_con').html(data['requirement']);
		}
		
		$('#foll_name').html(data['name']);
		$('#foll_instruc').html(data['instruction']);
		$('#founder').html(data['userName']);
		$('#foundDate').html(data['createTime']);
		$('#follow_img').attr('src',data['logo']+"?x-oss-process=image/resize,m_fill,w_"+$('#follow_img').width()+",h_"+$('#follow_img').height()+",limit_0");
		$('#joinedGroup_Num').html(data['circleList'].length);
		
		// var src = $('.jd_detail_icon').attr('src') + "?x-oss-process=image/resize,m_fill,w_"+$('.jd_detail_icon').width()+",h_"+$('.jd_detail_icon').height()+",limit_0/circle,r_100/format,png";
		// $('.jd_detail_icon').attr('src', src);
		
		// 社群管理员，当前最多5个
		var managerList = data.managerList;
		for(var i=0; i<managerList.length && i<5; i++){
			var img = $('<img class="ad_detail_icon">');
			$('#founderList').append(img);
			img.attr('src', managerList[i]['userPic'] + "?x-oss-process=image/resize,m_fill,w_"+img.width()+",h_"+img.height()+",limit_0/circle,r_100/format,png")
		}
		// 社群公告
		if(!data.hasOwnProperty('notice') || !data.notice){
			$('.publicNotice').hide();
		} else {
			$('.art_title span').text(!!data.notice ? data.notice.title: '');
			$('#art_con').text(data.notice.context);
		}
		
		var date = new Date(data.notice.publishDate);
		if(date != 'Invalid Date') $('.art_date').text(date.Format('MM-dd hh:mm'));
		$('.art_num span').text(data.notice.personNumber + '/' +data.notice.totalNumber);
	})

	// 处理下载链接
	var sn = getQueryString('sn');
	// var download = document.querySelector('.download');
	// download.href = '/24hours/share24/getPackage.html?sn='+ sn +'&yw=association&cp=1';

	//分享礼包跳转APP
	//跳转app商品详情页地址
	var jumpParams = getQueryString("jumpParams") || "";
	console.log(jumpParams);
	var $ios_app = "smartcity://iOS/gateway?jumpParams=" + jumpParams;
	var $android_app = "smartcity://android/gateway?jumpParams=" + jumpParams;
	var getPackLink = '/24hours/share24/getPackage.html?sn='+ sn +'&yw=association&cp=1';
	//页面跳转app or商店
	$(".download").on('click', function() {
		//判断为android
		if (navigator.userAgent.match(/android/i)) {
			//android非微信
			if (navigator.userAgent.match(/MicroMessenger/i) != 'MicroMessenger') {
				var last = Date.now();
				var doc = window.document;
				var ifr = doc.createElement('iframe');
				ifr.src = $android_app;
				ifr.style.cssText = 'display:none;border:0;width:0;height:0;';
				doc.body.appendChild(ifr);
				setTimeout(function () {
					doc.body.removeChild(ifr);
					//setTimeout回小于2000一般为唤起失败
					if (Date.now() - last < 4000) {
						window.location.href = getPackLink;
					}
				}, 3000);
			} else {
				//android微信
				$('#weixin_pageto').show();
				$('#commodityShare').hide();
			}
		//判断为IOS
		} else if (navigator.userAgent.match(/iPhone|iPod|iPad/i)) {
			//微信
			if (navigator.userAgent.match(/MicroMessenger/i) == 'MicroMessenger') {
				$('#weixin_pageto').show();
				$('#commodityShare').hide();
			//QQ内置浏览器
			} else if (navigator.userAgent.indexOf(' QQ') > -1) {
				$('#weixin_pageto').show();
				$('#commodityShare').hide();
			} else {
				window.location.href = $ios_app;
				setTimeout(function () {
					window.location.href = getPackLink;
				}, 3000);
				// setTimeout(function () {
				//     window.location.reload();
				// }, 1000);
			}
		} else {
			//判断为pc
			window.location.href = getPackLink;
		}
	});

})

var action = {
	GetParameter: function (name){  
       	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");  
       	var r = window.location.search.substr(1).match(reg);  
       	if(r!=null)return  unescape(r[2]); return null;  
   	},
   	getJson: function (cmd,param,callback){
		$.ajax({
			type:'POST',
			url:'/zxcity_restful/ws/rest',
			data:{
				'cmd': cmd,
				'data':JSON.stringify(param),
				version:2
			},
			dataType:'json',
			success: callback
		})
	}
}
Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

// 获取url参数，没有就''
function getQueryString(name) {
	var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
	var r = window.location.search.substr(1).match(reg)
	return r !== null ? decodeURI(r[2]) : ''
}
// 分享
function share(title, introduce, imgUrl){
    $.ajax({
        type: "post",
        url: "/zxcity_restful/ws/rest",
        dataType: 'json',
        headers: {
            apikey: sessionStorage.getItem('apikey') || 'test'
        },
        data: {
            cmd: 'game/getSign',
            data: JSON.stringify({
                url: location.href
            }),
            version: 1
        },
        success: function(res) {
            wx.config({
                debug: false,
                appId: 'wxe50dd59beab1e644',
                timestamp: res.data.timestamp,
                nonceStr: res.data.nonceStr,
                signature: res.data.signature,
                jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareWeibo', 'onMenuShareQZone', 'onMenuShareQZone']
            });
            var options = {
                title: title,
                desc: introduce,
                link: location.href,
                imgUrl: imgUrl
            }
            wx.ready(function(){
                wx.onMenuShareTimeline({
                    title: introduce,
                    link: location.href,
                    imgUrl: imgUrl
                });
                wx.onMenuShareAppMessage($.extend({
                    type: '',
                    dataUrl: ''
                }, options));
                wx.onMenuShareQQ(options);
                wx.onMenuShareWeibo(options);
                wx.onMenuShareQZone(options);
                wx.onMenuShareQZone(options);
            })
        }
    });
  }