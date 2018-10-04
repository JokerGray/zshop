var getinfo = function() {
	//获取数据
	var browers = function() {
		var u = navigator.userAgent;
		var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
		var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
		isSmartCity = u.indexOf('SmartCity') > -1; //是否在APP内部
		if(isAndroid)
			return "android" + (isSmartCity ? ".sc" : "");
		if(isiOS)
			return "ios" + (isSmartCity ? ".sc" : "");

		return "else";
	};

	//日期小于10补0
	var getDay1 = function(m) {
		var self = this;
		if(m < 10)
			return "0" + m.toString();
		return m.toString();
	}
	//计算星期的时候去掉0
	var removeZero = function(num) {
		if(num < 10) {
		return	num.split("0")[1];
		}
	}

	//获取当前时间作为比较的参数
	var nowTime = new Date();
	var nowYear = nowTime.getFullYear();
	var nowMonth = getDay1(nowTime.getMonth() + 1);
	var nowDay = getDay1(nowTime.getDate());

	//数据加载函数
	var getAjax = function(url, datas, callback, me) {
		$.ajax({
			type: 'get',
			url: url,
			dataType: 'json',
			data: datas,
			dataType: "json",
			success: function(data) {
				callback(data);
			},
			error: function(xhr, type) {
				if(browers == "android.sc") {
					window.jsObj.htmlError("personinfo:ajax error is " + xhr.status + " / " + xhr.statusText);
				} else if(browers == "ios.sc") {
					htmlError("personinfo:ajax error is " + xhr.status + " / " + xhr.statusText);
				}
				console.log('请求失败！请检查网络连接');
				if(me) {
					me.resetload();
				}

			}
		});
	}
	//时间分割存入数组
	var getTime = function(arr) {
		var dataArrs = arr[0].split("-");
		var dataHours = arr[1];
		dataArrs.push(dataHours);
		return dataArrs;
	}

	var weekDay = ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];

	var getTitle = function(month, year_month) {
		var otitle = ['<li>',
			'<ul class="mlist' + year_month + '">',
			'<h4>' + month + '</h4>',
			'</ul>',
			'</li>'
		].join('');
		$("#bill_info").append(otitle);
	}
	
	var getElement = function(day, hours, price, title, elsments) {
		var oli = [
			'<li>',
			'<span class="time">',
			'<p>' + day + '</p>',
			'<p>' + hours + '</p>',
			'</span>',
			'<span class="title_price">',
			'<p class="price"><span>+</span>' + price + '</p>',
			'<p class="title"><span></span>需要"' + title + '"</p>',
			'</span>',
			'</li>'
		].join('');
		$(".mlist" + elsments).append(oli);
	}

	//排序
	function sortBy(num){
		if(num&&num.length){
			//排序
			var arr=[];
			for(var m=0;m<num.length;m++){
				var dataTime = num[m].time;
				var dataArr = dataTime.split(" ");
				var dataArrs = getTime(dataArr);
				arr.push([(new Date(dataArrs[0], dataArrs[1] * 1 - 1, dataArrs[2])).getTime(),dataArrs[3]]);
			}
			var temp=null;
			for(var m=0;m<arr.length-1;m++){
				for(var j=m+1;j<arr.length;j++){
					if(arr[m][0]<arr[j][0]||arr[m][0]==arr[j][0]&&arr[m][1]<arr[j][1]){
						temp=arr[j];
						arr[j]=arr[m];
						arr[m]=temp;
						temp=num[j];
						num[j]=num[m];
						num[m]=temp;
					}
				}
			}
			
			return num;
		}
	}
	//data数据
	var data=Mock.mock("json/bill1.json",{
				"data|1-20":[{
					"time":"@DATETIME('yyyy-MM-dd HH:mm:ss')",
					"price":/^\d{6}$/,
					"title":"@cword(2,6)",

				}]
			});
	
	/*
	 * 数据上拉加载
	 * counts,$base控制每次加载的数量
	 * count 本月只加载一次
	 * $i,每次加载的起始
	 */
	var counts = 0,
		count = 1,
	    $base = 10;
	var handleDropload = function() {
		dropload = $("section").dropload({
			scrollArea: window, //滑屏范围
			distance: 50, //拉动距离
			domDown: {
				domClass: 'dropload-down',
				domRefresh: '<div class="dropload-refresh">↑上拉加载更多</div>',
				domLoad: '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
				domNoData: '<div class="dropload-noData">暂无数据</div>'
			},
			loadDownFn: function(me) { //上拉函数
				getAjax("json/bill1.json", "", function(res) {
					if(res.data&&res.data.length){
						var dataArrAll = sortBy(res.data);
						var month, day, hours, title, max, $i;
						var datalength = dataArrAll.length;
						counts++;
						$i = $base * (counts - 1);
						if(datalength >= $base * counts) {
							max = $base * counts;
						} else {
							max = datalength;
						}
						for(var i = $i; i < max; i++) {
							var dataTime = dataArrAll[i].time;
							var dataArr = dataTime.split(" ");
							var dataArrs = getTime(dataArr);
							var year_month = dataArrs[0] + "" + dataArrs[1];
							if(dataArrs[0] == nowYear) {
								if(dataArrs[1] == nowMonth) {
									if(count == 1) {
										month = "本月";
										getTitle(month, year_month);
									}
									count++;
									if(dataArrs[2] == nowDay) {
										day = "今天";
										hours = dataArrs[3];
									} else {
										hours = dataArrs[1] + "-" + dataArrs[2];
										removeZero(dataArrs[1]);
										removeZero(dataArrs[2]);
										day = weekDay[(new Date(dataArrs[0], dataArrs[1] * 1 - 1, dataArrs[2])).getDay()];
									}
	
									title = dataArrAll[i].title;
									price = dataArrAll[i].price;
									getElement(day, hours, price, title, year_month);
								} else {
									if(!i) {
										month = removeZero(dataArrs[1]) + "月";
										getTitle(month, year_month);
									}
									if(i && dataArrAll[i].time.split(" ")[0].split("-")[1] != dataArrAll[i - 1].time.split(" ")[0].split("-")[1]) {
										month = removeZero(dataArrs[1]) + "月";
										getTitle(month, year_month);
									}
									hours = dataArrs[1] + "-" + dataArrs[2];
									removeZero(dataArrs[1]);
									removeZero(dataArrs[2]);
									day = weekDay[(new Date(dataArrs[0], dataArrs[1] * 1 - 1, dataArrs[2])).getDay()];
									title = dataArrAll[i].title;
									price = dataArrAll[i].price;
									getElement(day, hours, price, title, year_month);
								}
							} else {
								if(!i) {
									month = dataArrs[0] + "-" + dataArrs[1];
									getTitle(month, year_month);
								}
								if(i && dataArrAll[i].time.split(" ")[0].split("-")[1] != dataArrAll[i - 1].time.split(" ")[0].split("-")[1]) {
									month = dataArrs[0] + "-" + dataArrs[1];
									getTitle(month, year_month);
								}
								hours = dataArrs[1] + "-" + dataArrs[2];
								removeZero(dataArrs[1]);
								removeZero(dataArrs[2]);
								day = weekDay[(new Date(dataArrs[0], dataArrs[1] * 1 - 1, dataArrs[2])).getDay()];
								title = dataArrAll[i].title;
								price = dataArrAll[i].price;
								getElement(day, hours, price, title, year_month);
							}
						}
						if(max == datalength) {
							$(".dropload-down div").html("已加载全部数据");
							return false;
						}
					}else{
						me.noData(true);
					}
					me.resetload();
				}, me)
			}
		});
	}
	handleDropload();
}
getinfo();


