var apikey = sessionStorage.getItem('apikey');
var shopId = sessionStorage.getItem("shopId"), merchantId = sessionStorage.getItem("merchantId");
var dataCustom,dataHeadArr, headData;
var dataAll = [ [], [], [], [] ];

// init
(function() {
	var headArr, dataHeadUl, dataLi, dataLiAll, dataLiLen, dataHeadArr, columnLi, initDataArr, turnBtn;

	getDataHeadArr();

	init = function(i) {
		columnLi = $('.column').find('li');
		columnLi.eq(i).addClass('active');
		initDataArr = getDataHeadArr()[i];
		createdataLi(initDataArr);
		dataHeadPosition();
		turndata();
		turntime();
		createdataBody(i);
		dataLiPosition();
	};

	initfourData();
	init(0);
})();

// 事件
(function() {

	var headArr, dataHeadUl, dataLi, dataLiAll, dataLiLen, dataHeadArr, columnLi, initDataArr, turnBtn, timeLi;

	getDataHeadArr();

	// 4个栏目按钮切换
	var columnLi = $('.column').find('li');
	var dataBodyUl = $('.dataBody').find('ul');
	var dataHeadUl = $('.dataHead').find('ul');
	turnBtn = $('.turnButton').find('p');
	timeLi = $('.timeCircle').find('li');
	columnLi.each(function(i) {
		columnLi.eq(i).on('click', function() {
			var curdata = getDataHeadArr()[i];
			dataBodyUl.children().remove();
			dataHeadUl.children().remove();
			$(this).addClass('active').siblings().removeClass('active');
			createdataLi(curdata);
			dataHeadPosition();
			if (timeLi.eq(0).hasClass('active')) {
				if (turnBtn.eq(0).hasClass('active')) {
					recreateColumnByColumnBtn(i, 1, 1)
				} else {
					recreateColumnByColumnBtn(i, 1, 2)
				}
			} else if (timeLi.eq(1).hasClass('active')) {
				if (turnBtn.eq(0).hasClass('active')) {
					recreateColumnByColumnBtn(i, 2, 1)
				} else {
					recreateColumnByColumnBtn(i, 2, 2)
				}
			} else {
				if (turnBtn.eq(0).hasClass('active')) {
					recreateColumnByColumnBtn(i, 3, 1)
				} else {
					recreateColumnByColumnBtn(i, 3, 2)
				}
			}
			createdataBody(i);
			dataLiPosition();

		})
	})

	// 数据类型按钮切换
	turnBtn.eq(0).on('click', function() {
		if (columnLi.eq(1).hasClass('active')) {
			recreateDataHead('销售金额', 'customer')
			$('.data').find('li.sell').show();
			$('.data').find('li.consume').hide();
			if (timeLi.eq(0).hasClass('active')) {
				recreateCustomByTurnBtn(1, 1);
			} else if (timeLi.eq(1).hasClass('active')) {
				recreateCustomByTurnBtn(2, 1);
			} else {
				recreateCustomByTurnBtn(3, 1);
			}
		} else if (columnLi.eq(0).hasClass('active')) {
			recreateDataHead('销售金额', 'item')
			$('.data').find('li.consume').show();
			$('.data').find('li.sell').hide();
			if (timeLi.eq(0).hasClass('active')) {
				recreateItemByTurnBtn(1, 1);
			} else if (timeLi.eq(1).hasClass('active')) {
				recreateItemByTurnBtn(2, 1);
			} else {
				recreateItemByTurnBtn(3, 1);
			}
		}
	})
	turnBtn.eq(1).on('click', function() {
		if (columnLi.eq(1).hasClass('active')) {
			recreateDataHead('消耗金额', 'customer')
			$('.data').find('li.consume').show();
			$('.data').find('li.sell').hide();
			if (timeLi.eq(0).hasClass('active')) {
				recreateCustomByTurnBtn(1, 2);
			} else if (timeLi.eq(1).hasClass('active')) {
				recreateCustomByTurnBtn(2, 2);
			} else {
				recreateCustomByTurnBtn(3, 2);
			}
		} else if (columnLi.eq(0).hasClass('active')) {
			recreateDataHead('消耗金额', 'item')
			$('.data').find('li.consume').show();
			$('.data').find('li.sell').hide();
			if (timeLi.eq(0).hasClass('active')) {
				recreateItemByTurnBtn(1, 2);
			} else if (timeLi.eq(1).hasClass('active')) {
				recreateItemByTurnBtn(2, 2);
			} else {
				recreateItemByTurnBtn(3, 2);
			}
		}
	})

	// 时间按钮切换
	timeLi.eq(0).on('click', function() {
		if (columnLi.eq(0).hasClass('active')) {
			if (turnBtn.eq(0).hasClass('active')) {
				recreateItemByTimeBtn(1, 1)
			} else {
				recreateItemByTimeBtn(1, 2)
			}
		} else if (columnLi.eq(1).hasClass('active')) {
			if (turnBtn.eq(0).hasClass('active')) {
				recreateCustomByTimeBtn(1, 1)
			} else {
				recreateCustomByTimeBtn(1, 2)
			}
		} else if (columnLi.eq(2).hasClass('active')) {
			recreateMechanicByTimeBtn(1)
		} else {
			recreateCounselorByTimeBtn(1)
		}
	})
	timeLi.eq(1).on('click', function() {
		if (columnLi.eq(0).hasClass('active')) {
			if (turnBtn.eq(0).hasClass('active')) {
				recreateItemByTimeBtn(2, 1)
			} else {
				recreateItemByTimeBtn(2, 2)
			}
		} else if (columnLi.eq(1).hasClass('active')) {
			if (turnBtn.eq(0).hasClass('active')) {
				recreateCustomByTimeBtn(2, 1)
			} else {
				recreateCustomByTimeBtn(2, 2)
			}
		} else if (columnLi.eq(2).hasClass('active')) {
			recreateMechanicByTimeBtn(2)
		} else {
			recreateCounselorByTimeBtn(2)
		}
	})
	timeLi.eq(2).on('click', function() {
		if (columnLi.eq(0).hasClass('active')) {
			if (turnBtn.eq(0).hasClass('active')) {
				recreateItemByTimeBtn(3, 1)
			} else {
				recreateItemByTimeBtn(3, 2)
			}
		} else if (columnLi.eq(1).hasClass('active')) {
			if (turnBtn.eq(0).hasClass('active')) {
				recreateCustomByTimeBtn(3, 1)
			} else {
				recreateCustomByTimeBtn(3, 2)
			}
		} else if (columnLi.eq(2).hasClass('active')) {
			recreateMechanicByTimeBtn(3)
		} else {
			recreateCounselorByTimeBtn(3)
		}
	})

})();

// 首次打开页面，ajax加载项目，初始化数据
function initfourData() {
	getItem(3, 1);
	// getCustomer(2,1);
	// getMechanic(2);
	// getCounselor(2);
}

// 根据数据类型按钮，重新生成标题数据--item项目
function recreateDataHead(nameType, sort) {
	var arrType = null;
	headData = getDataHeadArr();
	if (sort == 'item') {
		arrType = headData[0];
		arrType[2] = nameType;
	} else if (sort == 'customer') {
		arrType = headData[1];
		arrType[3] = nameType;
	}
	$('.dataHead').find('li').remove();
	createdataLi(arrType);
	dataHeadPosition();
}

// 获取dataHeadArr
function getDataHeadArr() {
	dataHeadArr = [ [ '序号', '项目', '销售金额' ], [ '序号', '姓名', '电话', '销售金额' ],
			[ '序号', '姓名', '店铺', '消耗业绩' ], [ '序号', '姓名', '店铺', '销售金额' ] ];

	return dataHeadArr;
}

// 点击栏目按钮重新生成每个项目
function recreateColumnByColumnBtn(i, timeCirle, source) {
	if (!source) {
		source = undefined;
	}

	if (i == 0) {
		getItem(timeCirle, source);
		$('.turnButton').show();
		if ($('.turnButton').find('p').eq(0).hasClass('active')) {
			recreateDataHead('销售金额', 'item');
		} else {
			recreateDataHead('消耗金额', 'item');
		}
	} else if (i == 1) {
		getCustomer(timeCirle, source);
		$('.turnButton').show();
		if ($('.turnButton').find('p').eq(0).hasClass('active')) {
			recreateDataHead('销售金额', 'customer');
		} else {
			recreateDataHead('消耗金额', 'customer');
		}
	} else if (i == 2) {
		getMechanic(timeCirle);
		$('.turnButton').hide();
	} else {
		getCounselor(timeCirle);
		$('.turnButton').hide();
	}
}

// 点击数据按钮重新生成Custom项目
function recreateCustomByTurnBtn(timeCircle, source) {
	var dataBodyUl = $('.dataBody').find('ul');
	getCustomer(timeCircle, source)
	dataBodyUl.children().remove();
	createdataBody(1);
	dataLiPosition();
}

// 点击数据按钮重新生成Item项目
function recreateItemByTurnBtn(timeCircle, source) {
	var dataBodyUl = $('.dataBody').find('ul');
	getItem(timeCircle, source)
	dataBodyUl.children().remove();
	createdataBody(0);
	dataLiPosition();
}

// 点击时间按钮重新生成Item项目
function recreateItemByTimeBtn(timeCircle, source) {
	var dataBodyUl = $('.dataBody').find('ul');
	getItem(timeCircle, source)
	dataBodyUl.children().remove();
	createdataBody(0);
	dataLiPosition();
}
// 点击时间按钮重新生成Custom项目
function recreateCustomByTimeBtn(timeCircle, source) {
	var dataBodyUl = $('.dataBody').find('ul');
	getCustomer(timeCircle, source)
	dataBodyUl.children().remove();
	createdataBody(1);
	dataLiPosition();
}
// 点击时间按钮重新生成Mechanic项目
function recreateMechanicByTimeBtn(timeCircle) {
	var dataBodyUl = $('.dataBody').find('ul');
	getMechanic(timeCircle)
	dataBodyUl.children().remove();
	createdataBody(2);
	dataLiPosition();
}
// 点击时间按钮重新生成Counselor项目
function recreateCounselorByTimeBtn(timeCircle) {
	var dataBodyUl = $('.dataBody').find('ul');
	getCounselor(timeCircle)
	dataBodyUl.children().remove();
	createdataBody(3);
	dataLiPosition();
}

// 数据内容的本体
function createdataBody(index) {
	var dataBodyUl = $('.dataBody').find('ul');
	var dataBodyLi = '<li class="data"><ul></ul></li>';
	var childLi = '<li></li>';
	// var dataBodyArr={
	// 0:[['1','洗脚','8899'],['2','洗脚','8899'],['3','洗脚','8899'],['4','洗脚','8899'],['5','洗脚','8899']],
	// 1:[['1','顾客1','13499801231','1540.00','1448.00'],['2','顾客2','13499801231','1540.00','1448.00'],['3','顾客3','13499801231','1540.00','1448.00'],['4','顾客4','13499801231','1540.00','1448.00']],
	// //1:dataCustom,
	// 2:[['1','技师1','傣妹店','1448.00'],['2','技师2','傣妹店','1448.00'],['3','技师3','傣妹店','1448.00'],['4','技师4','傣妹店','1448.00']],
	// 3:[['1','主管1','傣妹店','1448.00'],['2','主管2','傣妹店','1448.00'],['3','主管3','傣妹店','1448.00'],['4','主管4','傣妹店','1448.00']],
	// length:4
	// };
	var dataBodyArr = {
		0 : dataAll[0],
		1 : dataAll[1],
		2 : dataAll[2],
		3 : dataAll[3],
		length : 4
	}
	var childArr = dataBodyArr[index];
	var childArrlength = childArr.length;

	for (i = 0; i < childArrlength; i++) {
		var aLis = parseDom(dataBodyLi);
		dataBodyUl.append(aLis);
	}

	var childUl = $('.data').find('ul');
	var childUllength = $('.data').find('ul').length;
	var objLi = {};

	for (var i = 0; i < childArrlength; i++) {
		objLi[i] = {};
		for (j = 0; j < childArr[i].length; j++) {
			var childLis = parseDom(childLi)[0];
			$(childLis).html('' + childArr[i][j] + '');
			objLi[i][j] = childLis;
		}
	}
	for (var i = 0; i < childUllength; i++) {
		childUl.eq(i).append(objLi[i]);
	}
}

// 根据不同栏目创建不同的数据头部
function createdataLi(dataI) {
	var dataLi;
	var dataHeadUl = $('.dataHead').find('ul');
	for (var i = 0; i < dataI.length; i++) {
		dataLi = document.createElement('li');
		$(dataLi).html('' + dataI[i] + '')
		dataHeadUl.append($(dataLi))
	}
};

// 数据头部定位
function dataHeadPosition() {
	var dataLiAll, dataLiLen, dataHeadUl;
	// 数据头部li定位
	dataHeadUl = $('.dataHead').find('ul');
	dataLiAll = dataHeadUl.find('li');
	dataLiLen = dataHeadUl.find('li').length;
	if (dataLiLen == 5) {
		dataLiAll.eq(0).css('marginLeft', '220px');
		dataLiAll.eq(1).css('marginLeft', '212px');
		dataLiAll.eq(2).css('marginLeft', '306px');
		dataLiAll.eq(3).css('marginLeft', '248px');
		dataLiAll.eq(4).css('marginLeft', '244px');
	} else if (dataLiLen == 4) {
		dataLiAll.eq(0).css('marginLeft', '220px');
		dataLiAll.eq(1).css('marginLeft', '264px');
		dataLiAll.eq(2).css('marginLeft', '338px');
		dataLiAll.eq(3).css('marginLeft', '376px');
	} else if (dataLiLen == 3) {
		dataLiAll.eq(0).css('marginLeft', '220px');
		dataLiAll.eq(1).css('marginLeft', '380px');
		dataLiAll.eq(2).css('marginLeft', '646px');
	}
}

// 数据本身定位
function dataLiPosition() {
	var parentLi = $('.data');
	var childUl = parentLi.find('ul');
	var childUllength = parentLi.find('ul').length;
	var childLislength = childUl.eq(0).find('li').length;
	var childLis = childUl.find('li');

	if (childLislength == 5) {
		for (var i = 0; i < childUllength; i++) {
			childLis.eq(5 * i).css('left', '248px');
			childLis.eq(5 * i + 1).css('left', '510px');
			childLis.eq(5 * i + 2).css('left', '816px');
			childLis.eq(5 * i + 3).css('left', '1228px').addClass('sell');
			childLis.eq(5 * i + 4).css('left', '1628px').addClass('consume');
		}
	} else if (childLislength == 4) {
		for (var i = 0; i < childUllength; i++) {
			childLis.eq(4 * i).css('left', '248px');
			childLis.eq(4 * i + 1).css('left', '560px');
			childLis.eq(4 * i + 2).css('left', '958px');
			childLis.eq(4 * i + 3).css('left', '1436px');
		}
	} else if (childLislength == 3) {
		for (var i = 0; i < childUllength; i++) {
			childLis.eq(3 * i).css('left', '248px');
			childLis.eq(3 * i + 1).css('left', '670px');
			childLis.eq(3 * i + 2).css('left', '1406px');
		}
	}
}

// 切换按钮
function turndata() {
	var turnP = $('.turnButton').find('p');
	for (var i = 0; i < turnP.length; i++) {
		turnP.eq(i).click(function() {
			turnP.removeClass('active');
			$(this).addClass('active');
		})
	}
}

// 日期按钮
function turntime() {
	var timeLi = $('.timeCircle').find('li');
	for (var i = 0; i < timeLi.length; i++) {
		timeLi.eq(i).click(function() {
			timeLi.removeClass('active');
			$(this).addClass('active');
		})
	}
}

// 字符串转换为DOM
function parseDom(arg) {
	var objE = document.createElement("div");
	objE.innerHTML = arg;
	return objE.childNodes;
};

// 栏目：项目
function getItem(dataymd, dataCategory) {
	// ajax动态请求

	var ymd1 = dataymd;
	var category = dataCategory;

	$.ajax({
		type : 'POST',
		url : '/zxcity_restful/ws/rest',
		async : false,
		dataType : 'json',
		data : {
			'cmd' : 'shop/productRank',
			'data' : '{"shopId":'+shopId+',"merchantId":'+merchantId+',"type":1,"ymd":' + ymd1
					+ ',"category":' + category + '}',
			'version' : '1'
		},
		beforeSend : function(request) {
			request.setRequestHeader("apikey", apikey);
		},
		success : function(re) {
			var str1 = re;
			var ItemChildArray;
			var cusData = new Array(str1.data);
			dataItem = cusData[0];

			dataAll[0] = [];
			if (category == 1) {
				for (var i = 0; i < dataItem.length; i++) {
					ItemChildArray = [ i+1, dataItem[i]['item'],
							dataItem[i]['saleAmount'] ];
					dataAll[0].push(ItemChildArray);
				}
			} else if (category == 2) {
				for (var i = 0; i < dataItem.length; i++) {
					ItemChildArray = [ i+1, dataItem[i]['item'],
							dataItem[i]['useAmount'] ];
					dataAll[0].push(ItemChildArray);
				}
			}

		},
		error : function(re) {
			console.log(re)
		}
	})
}

// 栏目：顾客
function getCustomer(dataymd, dataCategory) {
	var ymd2 = dataymd;
	var category = dataCategory;

	$
			.ajax({
				type : 'POST',
				url : '/zxcity_restful/ws/rest',
				async : false,
				dataType : 'json',
				data : {
					'cmd' : 'shop/productRank',
					'data' : '{"shopId":'+shopId+',"merchantId":'+merchantId+',"type":2,"ymd":'
							+ ymd2 + ',"category":' + category + '}',
					'version' : '1'
				},
				beforeSend : function(request) {
					request.setRequestHeader("apikey", apikey);
				},
				success : function(re) {
					var str1 = re;
					var customChildArray;
					var cusData = new Array(str1.data);
					dataCustom = cusData[0];

					dataAll[1] = [];
					if (category == 1) {
						for (var i = 0; i < dataCustom.length; i++) {
							customChildArray = [ i+1, dataCustom[i]['name'],
									dataCustom[i]['phone'],
									dataCustom[i]['saleAmount'] ];
							dataAll[1].push(customChildArray);
						}
					} else if (category == 2) {
						for (var i = 0; i < dataCustom.length; i++) {
							customChildArray = [ i+1, dataCustom[i]['name'],
									dataCustom[i]['phone'],
									dataCustom[i]['useAmount'] ];
							dataAll[1].push(customChildArray);
						}
					}
				},
				error : function(re) {
					console.log(re)
				}
			})

}

// 栏目：技师
function getMechanic(dataymd) {
	var ymd3 = dataymd;

	$.ajax({
		type : 'POST',
		url : '/zxcity_restful/ws/rest',
		async : false,
		dataType : 'json',
		data : {
			'cmd' : 'shop/productRank',
			'data' : '{"shopId":'+shopId+',"merchantId":'+merchantId+',"type":3,"ymd":' + ymd3
					+ ',"category":1}',
			'version' : '1'
		},
		beforeSend : function(request) {
			request.setRequestHeader("apikey", apikey);
		},
		success : function(re) {
			var str1 = re;
			var mechanicChildArray;
			var cusData = new Array(str1.data);
			dataItem = cusData[0];

			dataAll[2] = [];
			for (var i = 0; i < dataItem.length; i++) {
				mechanicChildArray = [ i+1, dataItem[i]['name'],
						dataItem[i]['shopName'], dataItem[i]['useAmount'] ];
				dataAll[2].push(mechanicChildArray);
			}

		},
		error : function(re) {
			console.log(re)
		}
	})
}

// 栏目:主管
function getCounselor(dataymd) {
	var ymd4 = dataymd;

	$.ajax({
		type : 'POST',
		url : '/zxcity_restful/ws/rest',
		async : false,
		dataType : 'json',
		data : {
			'cmd' : 'shop/productRank',
			'data' : '{"shopId":'+shopId+',"merchantId":'+merchantId+',"type":4,"ymd":' + ymd4
					+ ',"category":1}',
			'version' : '1'
		},
		beforeSend : function(request) {
			request.setRequestHeader("apikey", apikey);
		},
		success : function(re) {
			var str1 = re;
			var counselorChildArray;
			var cusData = new Array(str1.data);
			dataItem = cusData[0];

			dataAll[3] = [];
			for (var i = 0; i < dataItem.length; i++) {
				counselorChildArray = [ i+1, dataItem[i]['name'],
						dataItem[i]['shopName'], dataItem[i]['saleAmount'] ];
				dataAll[3].push(counselorChildArray);
			}
		},
		error : function(re) {
			console.log(re)
		}
	})
}
//返回
$(".return-icon").click(function(){
	sessionStorage.setItem("prevPage", 10);
	$(this).attr("href", '../../common/html/main/main.html');
});
