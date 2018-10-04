(function($) {
	const GETAPPFEEDBACK = 'operations/getComplaintsDealPage', //查询
		  ADDREPLY = 'operations/addOrUpdateFeedBackReply', //修改
		  UPDATEREPLY = 'operations/updateReplyIndex',//查看
		  PLATESET = 'operations/plateSettingList'

	var layer = layui.layer;
	var table = layui.table;
	layui.use('form', function() {
		form = layui.form;
	})
	
	
	getPlate();
	//加载板块
    function getPlate(){
    	var vesionIndex = sessionStorage.getItem('vesionIndex');
        var sHtml = "";
        var param = {
            page :1,
            rows :100,
            plateType :vesionIndex
        }
        reqAjaxAsync(PLATESET, JSON.stringify(param)).done(function (res) {
            if (res.code == 1) {
                sHtml += '<option value="">-请选择-</option>';
                for(var i=0;i<res.data.length;i++){
                    var row = res.data[i];
                    sHtml += '<option value="' + row.tableName + '">' + row.plateDesc + '</option>'
                }
                $("#platebox").html(sHtml);
            }else{
                layer.msg(res.msg);
            }
        });
    }

	//日期选择
	$('#datetimepicker1 input').datepicker({
		format: 'yyyy-mm-dd',
		autoclose: true,
		language: "zh-CN"
	}).on('changeDate', function(ev) {
		var startTime = $('#jurisdiction-begin').val();
		$(this).parent().attr('data-time', startTime);
		$("#datetimepicker2 .datepicker").hide();
	});

	$('#datetimepicker2 input').datepicker({
		format: 'yyyy-mm-dd',
		autoclose: true,
		language: "zh-CN"
	}).on('changeDate', function(ev) {
		var startTime = $('#jurisdiction-end').val();
		$(this).parent().attr('data-time', startTime);
		$("#datetimepicker1 .datepicker").hide();
	});

	//搜索
	$('body').on('click','#toolSearch',function(){
		init_obj();
	})
	//重置功能
	$('body').on('click','#toolRelize',function(){
		$("#publisherTitle").val('');
		$("#platebox").val('');
		$("#jurisdiction-begin").datepicker('clearDates');;
		$("#jurisdiction-end").datepicker('clearDates');
		init_obj();
	})


	function init_obj(moreField1) {
		var vesionIndex = sessionStorage.getItem('vesionIndex');
		if(vesionIndex){
			$('.vesion').eq(vesionIndex-1).addClass('act').siblings('').removeClass('act');
		}
		var aVi = $('.vesion.act');
		var aSe = $('.search-li.act');
		var moreField1 = $(aVi).attr('data-morefield');
		var replystatus = $(aSe).attr('data-replystatus');
			var _obj = tableInit('demo', [
				[{
					title: '序号',
					/*sort: true,*/
					align: 'left',
					field: 'eq',
					width: 80
				}, {
					title: '内容分类',
					/*sort: true,*/
					align: 'left',
					field: '_type',
					width: 150
				}, {
					title: '模块名称',
					/*sort: true,*/
					align: 'left',
					field: '_scSysPlateSetting',
					width: 200
				}, {
					title: '标题',
					/*sort: true,*/
					align: 'left',
					field: 'publisherTitle',
					width: 200
				},{
					title: '举报原因',
					/*sort: true,*/
					align: 'left',
					field: 'tipoffReason',
					width: 400
				},{
					title: '举报次数',
					/*sort: true,*/
					align: 'left',
					field: 'tipOffCount',
					width: 200
				},{
					title: '举报时间',
					/*sort: true,*/
					align: 'left',
					field: 'createTime',
					width: 200
				},{
					title: '操作',
					align: 'left',
					toolbar: '#barDemo',
					width: 400
				}]
			],
			pageCallback
		)
	}

	initForAct();

	function initForAct(replystatus) {
		init_obj();
	}

	$('.vesion').on('click', function() {
		$(this).addClass('act').siblings().removeClass('act');
		var vesionIndex = $(this).attr('data-plateType');
		sessionStorage.setItem('vesionIndex',vesionIndex)
		initForAct();
		getPlate()
	})
	
	function setVer(){
		var vesionIndex = $('.vesion.act').attr('data-platetype');
		sessionStorage.setItem('vesionIndex',vesionIndex)
		getPlate();
	}
	setVer()
	//TAB切换
	$('.search-li').on('click', function() {
		var searchLiIndex = $(this).index();
		sessionStorage.setItem('searchLiIndex',searchLiIndex)
		$(this).addClass('act').siblings().removeClass('act');
		initForAct();
	})

	function sessionJump(){
		var vesionIndex = sessionStorage.getItem('vesionIndex');
		var searchLiIndex = sessionStorage.getItem('searchLiIndex');
		if(vesionIndex || searchLiIndex){
			$('.vesion').eq(vesionIndex-1).addClass('act').siblings().removeClass('act');
			$('.search-li').eq(searchLiIndex).addClass('act').siblings().removeClass('act');
		}
		initForAct();
	}
	sessionJump();
	
	
	

	//pageCallback回调
	function pageCallback(index, limit,plateType,tipoffStatus,tableName,publisherTitle,createTimeStart,createTimeEnd) {
		
		var plateType = $('.vesion.act').attr('data-plateType')
		var tipoffStatus  = $('.search-li.act').attr('data-tipoffStatus');
		
		var tableName  = $('#publisherTitle').val();
		tableName=$.trim(tableName)
		var publisherTitle  = $('#platebox').val();
		publisherTitle=$.trim(publisherTitle)

		var createTimeStart = $('#datetimepicker1').attr('data-time');
		var createTimeEnd = $('#datetimepicker2').attr('data-time');
		
		if(tableName == undefined) {
				tableName = ''
		}if(publisherTitle == undefined) {
				publisherTitle = ''
		}
		if(createTimeStart == undefined) {
			createTimeStart = ''
		}
		if(createTimeEnd == undefined) {
			createTimeEnd = ''
		}

		
		return getData(GETAPPFEEDBACK, "{'page':" + index + ",'rows':" + limit + ",'plateType':'" + plateType + "','tipoffStatus':'" + tipoffStatus + "','tableName':'" + publisherTitle + "','publisherTitle':'" + tableName + "','createTimeStart':'" + createTimeStart + "','createTimeEnd':'" + createTimeEnd + "'}");

	}

	table.on('tool(demo)', function(obj) {
		var data = obj.data;
		//查看
		if(obj.event === 'detail') {
			var data =obj.data;
            var oldId = data.id;
            var url = data.reviewUrl;
            var reviewOpinion = data.reviewOpinion || "";
            var reviewStatu = data.status;
            sessionStorage.setItem('reviewUrl',url);
            sessionStorage.setItem('reviewId',oldId);
            sessionStorage.setItem('reviewType',2); //1-审核 2-查看
            sessionStorage.setItem('reviewOpinion',reviewOpinion);//审核意见
            sessionStorage.setItem('reviewStatu',reviewStatu);//是否通过
            //查看
			//$("#pageFrame",window.parent.document).attr("src","handling_detail/handling_detail.html");
			//window.top.admin.current("handling_detail/handling_detail.html");
			window.top.admin.current("handling_detail/handling_detail.html?v=" + new Date().getMilliseconds());

		} else if(obj.event === 'change') {
			
			var data = obj.data;
            var oldId = data.id;
            var url = data.reviewUrl;
            sessionStorage.setItem('reviewType',1); //1-审核 2-查看
            sessionStorage.setItem('reviewUrl',url);
			sessionStorage.setItem('reviewId',oldId);
			sessionStorage.setItem('lockUserId', data.userId);
			// var targetUrl =  window.top.location.href.substr(0, window.top.location.href.lastIndexOf("/"));
			// layer.open({
			// 	type: 2 //此处以iframe举例
			// 	,title: '审核'
			// 	,area: ['1000px', '800px']
			// 	,maxmin: false
			// 	,content: targetUrl + "/handling_detail/handling_detail.html"
			// });
			
			window.top.admin.current("handling_detail/handling_detail.html?v=" + new Date().getMilliseconds());
			//window.top.admin.current("handling_detail/handling_detail.html");
			//$("#pageFrame",window.parent.document).attr("src","handling_detail/handling_detail.html");
		}
	});



	//展开按钮
	var flag = true;
	$('#spread').on('click', spread)

	function spread() {
		var oUl = $('.navList');
		var aLi = oUl.children('li');
		if(flag == true) {
			$(this).html('<i class="layui-icon">&#xe630;</i>收起')
			flag = false;
			treeObj.expandAll(true);

		} else {
			$(this).html('<i class="layui-icon">&#xe630;</i>展开')
			flag = true;
			treeObj.expandAll(false);
		}
	}

	$('#search').on('click', function() {
		$('#search-tool').slideToggle(200)
	})

	//点击变色
	$('#tableBox').on('click', 'tbody tr', function() {
		$(this).addClass('layui-table-click').siblings().removeClass('layui-table-click');

	})

	//刷新
	function refresh() {
		location.reload();
	}
	$('#refresh').click(function() {
		refresh()
	});

	function tableInit(tableId, cols, pageCallback, test) {
		var tableIns, tablePage;
		//1.表格配置
		tableIns = table.render({
			id: tableId,
			elem: '#' + tableId,
			height: 'full-220',
			cols: cols,
			page: false,
			even: true,
			skin: 'row'
		});

		//2.第一次加载
		var res = pageCallback(1, 15);
		//第一页，一页显示15条数据
		if(res) {
			if(res.code == 1) {
				tableIns.reload({
					data: res.data
				})
			} else {
				layer.msg(res.msg)
			}
		}

		//3.left table page
		layui.use('laypage');

		var page_options = {
			elem: 'laypageLeft',
			count: res ? res.total : 0,
			layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
			limits: [15, 30],
			limit: 15
		}
		page_options.jump = function(obj, first) {
			tablePage = obj;

			//首次不执行
			if(!first) {
				var resTwo = pageCallback(obj.curr, obj.limit);
				if(resTwo && resTwo.code == 1)
					tableIns.reload({
						data: resTwo.data
					});
				else
					layer.msg(resTwo.msg);
			}
		}

		layui.laypage.render(page_options);

		return {
			tablePage,
			tableIns
		};
	}

	//数据处理
	function getData(url, parms) {

		var res = reqAjax(url, parms);
		var data = res.data;
		var _type,_scSysPlateSetting;
		$.each(data, function(i, item) {
			$(item).attr('eq', (i + 1))
			if(item.type==1){
				$(item).attr('_type','文字')
			}else if(item.type==2){
				$(item).attr('_type','图片')
			}else{
				$(item).attr('_type','视频')
			}
			if(item.scSysPlateSetting){
				$(item).attr('_scSysPlateSetting', item.scSysPlateSetting.plateDesc)
			}
		});
		
		return res;
	}
	


})(jQuery)