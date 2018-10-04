var layer = layui.layer,
	laypage = layui.laypage,
	laydate = layui.laydate,
	laytpl = layui.laytpl;

function advertiseFunc() {
	this.rows = 5;
	this.pages = 0;
	this.url = {
		getAdvertSpace: 'selectscCmsAdvStyleName',
		getAdvertiseSource: 'selectAdvType',
		getAdvertiseData: 'selectProprietaryTrading',
		getAdvertiseList: 'selectProprietaryTradingList',
		isPutaway: 'queryAdvstate',
		getAdStyle: 'selectqueryscCmsAdvStyle'
	}
	this.advertList = {
		scCmsAdvStyleName: '', //投放帐号
		scCmsAdvSourceId: '', //广告类型
		scCmsAdvPlaceId: '', //广告位
		scCmsAdvStart: '', //开始时间
		scCmsAdvEnd: '', //结束时间
		scCmsAdvState: '', //广告状态 1 上架  2下架  3过期
		pagination: {
			page: 1,
			rows: this.rows
		}
	}
}
advertiseFunc.prototype = {
	//获取广告数据
	getAdvertiseData: function () {
		var _this = this;
		reqNewAjaxAsync(_this.url.getAdvertiseData, {}).done(function (res) {
			if (res.code != 1) {
				return layer.msg(res.msg)
			};
			if (res.code == 1) {
				var data = res.data || '';
				if (!isNull(data)) {
					$('#advertNum').html(data.advNumber);
					$('#adShowNum').html(data.scCmsAdvShowId);
					$('#adClickNum').html(data.scCmsAdv_click_id);
				}
			}
		});
	},
	//列表
	getAdvertiseList: function (d, flag) {
		var _this = this;
		reqNewAjaxAsync(this.url.getAdvertiseList, d).done(function (res) {
			if (res.code != 1) {
				return layer.msg(res.msg)
			};
			if (res.code == 1) {
				var data = res.data || '';
				var total = res.total;
				if (!isNull(data)) {
					var getTpl = $("#tableList").html();
					_this.pages = Math.ceil(total / _this.rows);
					_this.pages > 1 ? $('#page').addClass('show').removeClass('hide') : $('#page').addClass('hide').removeClass('show');
					laytpl(getTpl).render(data, function (html) {
						$("#advertiseTabBody").html(html);
					});
					return flag ? _this.getPage(_this.pages, d) : false;
				} else {
					$("#advertiseTabBody").html('');
					$('#page').addClass('hide').removeClass('show');
				}
			}
		});
	},
	//获取分页
	getPage: function (pages, d) {
		var _this = this;
		laypage({
			cont: 'page',
			pages: pages,
			skip: true,
			skin: '#2BC6FF',
			groups: 3,
			jump: function (obj) {
				d.pagination.page = obj.curr;
				_this.getAdvertiseList(_this.advertList, false);
			}
		});
	}
}
$(function () {
	//禁止输入空格
	inhibitTrim('#putInTheAccount');
	inhibitTrim('#start');
	inhibitTrim('#end');

	//点击日期获取时间
	layui.use('laydate', function () {
		var laydate = layui.laydate;
		var startDate = {
			// min: laydate.now(),
			max: '2099-06-16 23:59:59',
			istoday: false,
			choose: function (datas) {
				endDate.min = datas; //开始日选好后，重置结束日的最小日期
				endDate.start = datas //将结束日的初始值设定为开始日
				start.startTime = datas;
				start.endTime = $("#end").val();
				if (!isNull($("#end").val())) {
					start.startTime = datas;
					start.endTime = $("#end").val();
				}
			}
		};
		var endDate = {
			// min: laydate.now(),
			max: '2099-06-16 23:59:59',
			istoday: false,
			choose: function (datas) {
				startDate.max = datas; //结束日选好后，重置开始日的最大日期
				start.startTime = $("#start").val();
				start.endTime = datas;
				if (!isNull($("#start").val())) {
					start.startTime = $("#start").val();
					start.endTime = datas;
				}
			}
		};
		$('#start').click(function () {
			startDate.elem = this;
			laydate(startDate);
		});

		$('#end').click(function () {
			endDate.elem = this;
			laydate(endDate);
		});
	});

	var advertise = new advertiseFunc();
	//获取广告位下拉框
	reqNewAjaxAsync(advertise.url.getAdvertSpace, {}).done(function (res) {
		if (res.code == 1) {
			var data = res.data || '';
			if (!isNull(data)) {
				var str = '';
				// 这里是我修改的不等于1001
				for (var i = 0; i < data.length; i++) {
					if (data[i].scCmsAdvPlacePlatForm != "1001") {
						str += '<option value="' + data[i].scCmsAdvPlaceId + '">' + data[i].scCmsAdvPlaceName + '</option>';
					}
				}
				$('#advertisingSpSel').append(str);
			}
		}
	});
	//获取广告来源下拉框
	reqNewAjaxAsync(advertise.url.getAdvertiseSource, {}).done(function (res) {
		if (res.code == 1) {
			var data = res.data || '';
			if (!isNull(data)) {
				// 注意变量名避免重复，严格模式下直接报错
				var str2 = '';
				// 这里是我修改的不等于1001
				for (var i = 0; i < data.length; i++) {
					if (data[i].scCmsAdvSourcePlatForm != "1001") {
						str2 += '<option value="' + data[i].scCmsAdvSourceId + '">' + data[i].scCmsAdvSourceName + '</option>';
					}
				}
				$('#advertisingSoSel').append(str2);
			}
		}
	});

	//获取广告数据
	advertise.getAdvertiseData();
	//获取广告列表数据
	advertise.getAdvertiseList(advertise.advertList, true);

	//切换tab栏
	$('#tabinner').on('click', 'li', function () {
		advertise.advertList.scCmsAdvState = $(this).attr('writerRank');
		advertise.advertList.pagination.page = 1;
		advertise.getAdvertiseList(advertise.advertList, true);
	})

	//点击搜索按钮
	$('#searchIcon').click(function () {
		advertise.advertList = $('#selectForm').serializeObject();
		advertise.advertList.pagination = {
			page: 1,
			rows: advertise.rows
		};
		advertise.advertList.scCmsAdvState = $('#tabinner li.active').attr('writerRank');
		advertise.getAdvertiseList(advertise.advertList, true);
	})

	//切换上架下架
	$("#advertiseTabBody").on('click', '.isPutawayOp', function () {
		var _this = this,
			num = 0;
		var state = $(this).attr('value');
		var scCmsAdvId = $(this).parent().parent().attr('scCmsAdvId');
		if (state == 1) {
			num = 2;
		} else if (state == 2) {
			num = 1;
		}
		reqNewAjaxAsync(advertise.url.isPutaway, {
			scCmsAdvId: scCmsAdvId,
			scCmsAdvState: num
		}).done(function (res) {
			if (res.code != 1) {
				return layer.msg(res.msg)
			};
			if (res.code == 1) {
				advertise.advertList.pagination.page = 1;
				advertise.getAdvertiseList(advertise.advertList, true);
			}
		});
	});
	//点击查看详情
	$('#advertiseTabBody').on('click', '.checkBtn', function () {
		var scCmsAdvStyleResId = $(this).parent().parent().attr('scCmsAdvStyleResId');
		var sccmsadvid = $(this).parent().parent().attr('sccmsadvid');
		var label = $(this).attr('label'),
			labelArr = [],
			labelStr = '';
		var creatTime = ($(this).attr('creatTime')).slice(0, length - 2);
		var btnParent = $(this).parent();
		var isPutawayText = btnParent.siblings('.checkStatus').find('span').html();
		var sourceType = btnParent.siblings('.adType').attr('sourceType');
		var labelArr = label.split(',');
		if (sourceType == '2001') {
			$('.adDConBIconText').html('[' + btnParent.siblings('.adType').html() + ']');
		} else if (sourceType == '2002') {
			$('.adDConBIconText').html('[外部广告]');
		}
		if (!isNull(labelArr)) {
			for (var i = 0; i < labelArr.length; i++) {
				labelStr += '<span class="adDConTag">' + labelArr[i] + '</span>';
			}
		}
		$('#putawayBtn').attr('sccmsadvid', sccmsadvid);
		if (isPutawayText == '已上架') {
			$('#adDConIsPutaway').html(isPutawayText).removeClass('active').removeClass('invalid');
			$('#advertiseDBtnBox').show();
		} else if (isPutawayText == '已下架') {
			$('#adDConIsPutaway').html(isPutawayText).addClass('active').removeClass('invalid');
			$('#advertiseDBtnBox').show();
		} else if (isPutawayText == '已过期') {
			$('#adDConIsPutaway').html(isPutawayText).addClass('invalid').removeClass('active');
			$('#advertiseDBtnBox').hide();
		} else if (isPutawayText == '待审核') {
			$('#adDConIsPutaway').html(isPutawayText).addClass('invalid').removeClass('active');
			$('#advertiseDBtnBox').hide();
		} else if (isPutawayText == '已驳回') {
			$('#adDConIsPutaway').html(isPutawayText).addClass('invalid').removeClass('active');
			$('#advertiseDBtnBox').hide();
		} else if (isPutawayText == '已完成') {
			$('#adDConIsPutaway').html(isPutawayText).addClass('invalid').removeClass('active');
			$('#advertiseDBtnBox').hide();
		}
		if ($(this).siblings().html() == '上架') {
			$('#putawayBtn').html('上架').addClass('active').attr('value', 2);
		} else if ($(this).siblings().html() == '下架') {
			$('#putawayBtn').html('下架').removeClass('active').attr('value', 1);
		} else if ($(this).siblings().html() == '重新发布') {
			$('#putawayBtn').html('重新发布').addClass('active').attr('value', '');
		}
		$('#adDConPosition').html(btnParent.siblings('.adPosition').html());
		$('#adDConShowNum').html(btnParent.siblings('.adShowNum').html());
		$('#adDConClickNum').html(btnParent.siblings('.adClickNum').html());
		$('#adDConSource').html(sourceTypeFunc(btnParent.siblings('.adType').attr('sourcetype')));
		$('#adDConType').html(btnParent.siblings('.adType').html());
		$('#adDConTime').html(btnParent.siblings('.adTime').html());
		$('#adDConTagList').html(labelStr);
		$('#adDConCreateTime').html(creatTime);
		if(btnParent.siblings('.adType').attr('sourceType') == '2002') {
			$('#adDTypeHref').html($(this).parent().attr('ad1') + $(this).parent().attr('ad2'));
			$('#adDTypeHrefBox').show();
		} else {
			$('#adDTypeHrefBox').hide();
		}
		reqNewAjaxAsync(advertise.url.getAdStyle, {
			scCmsAdvStyleResId: scCmsAdvStyleResId
		}).done(function (res) {
			console.log(res);
			if (res.code != 1) {
				return layer.msg(res.msg)
			};
			if (res.code == 1) {
				var data = res.data;
				if (!isNull(data)) {
					var abStyleObj = JSON.parse(data.cmsAdvStyleRes[0].scCmsAdvStyleResJson);
					console.log(abStyleObj);
					if (data.scCmsAdvStyle.scCmsAdvStyleType == 6) {
						$('#adDConRSetImg').addClass('show').removeClass('hide');
						$('#adDConRSetImgList').addClass('hide').removeClass('show');
						$('#adDConRSetVideo').addClass('hide').removeClass('show');
						$('#adDConRType').html('(单图)');

						$('#advStyleResTitle').html(data.cmsAdvStyleRes[0].scCmsAdvStyleResTitle);
						$('#adDConRSetRight').attr('src', abStyleObj[0].resourcesUrl);
					} else if (data.scCmsAdvStyle.scCmsAdvStyleType == 8) {
						$('#adDConRSetImg').addClass('hide').removeClass('show');
						$('#adDConRSetImgList').addClass('hide').removeClass('show');
						$('#adDConRSetVideo').addClass('show').removeClass('hide');
						$('#adDConRType').html('(视频)');

						$('#advStyleVideoTitle').html(data.cmsAdvStyleRes[0].scCmsAdvStyleResTitle);
						var videoUrl = abStyleObj[0].videoUrl;
						var resourcesUrl = abStyleObj[0].resourcesUrl;
						$('#adDConRSetVideoUrl').html('<video src="' + videoUrl + '" poster="' + resourcesUrl + '" controls="controls"></video>');
					} else if (data.scCmsAdvStyle.scCmsAdvStyleType == 7) {
						$('#adDConRSetImg').addClass('hide').removeClass('show');
						$('#adDConRSetImgList').addClass('show').removeClass('hide');
						$('#adDConRSetVideo').addClass('hide').removeClass('show');
						$('#adDConRType').html('(三图)');
						var str = '';
						for (var i = 0; i < abStyleObj.length; i++) {
							str += '<img src="' + abStyleObj[i].resourcesUrl + '" alt="">';
						}
						$('#advStyleImgLTitle').html(data.cmsAdvStyleRes[0].scCmsAdvStyleResTitle);
						$('#adDConRSetImgsBox').html(str);
					}
					for (var i = 0; i < abStyleObj.length; i++) {
						abStyleObj
					}
				}
			}
		});
	})
	//弹窗中的上架下架按钮点击
	$('#putawayBtn').click(function () {
		var _this = this,
			num = 0;
		var state = $(this).attr('value');
		var scCmsAdvId = $(this).attr('scCmsAdvId');
		if (state == 1) {
			num = 2;
		} else if (state == 2) {
			num = 1;
		} else {
			return;
		}
		reqNewAjaxAsync(advertise.url.isPutaway, {
			scCmsAdvId: scCmsAdvId,
			scCmsAdvState: num
		}).done(function (res) {
			if (res.code != 1) {
				return layer.msg(res.msg)
			};
			if (res.code == 1) {
				advertise.advertList.pagination.page = 1;
				advertise.getAdvertiseList(advertise.advertList, true);
			}
		});
	})
	//驳回广告
	$('#advertiseTabBody').on('click', '.reject', function () {
		var _this = this;
		layer.confirm('确认驳回吗？', {
			title: "提示",
			btn: ['确认', '取消'],
			btn1: function (index, layero) {
				var scCmsAdvId = $(_this).parent().parent().attr('scCmsAdvId');
				reqNewAjaxAsync(advertise.url.isPutaway, {
					scCmsAdvId: scCmsAdvId,
					scCmsAdvExamine: 2,
					scCmsAdvState: -1
				}).done(function (res) {
					layer.msg(res.msg);
					if (res.code != 1) {
						return false
					};
					if (res.code == 1) {
						advertise.advertList.pagination.page = 1;
						advertise.getAdvertiseList(advertise.advertList, true);
					}
				});
			}
		});
	})

	//监听弹窗
	$('#advertiseDetail').on('hide.bs.modal', function () {
		//清空模态框内容
		$('#advertiseDetail').find('video').attr('src', '');
	})
})

function sourceTypeFunc(num) {
	var str = '';
	if (num == '2001') {
		str = '内部广告';
	} else if (num == '2002') {
		str = '外部广告';
	}
	return str;
}