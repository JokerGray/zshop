$(function(){
	var artInput = '0';
	//点击日期获取时间
	analysisDate();

	//视频分析tab栏-------获取全部视频
	//默认获取昨天数据：
	var yesterday = formatterDate(new Date().setDate(new Date().getDate() - 1));
	$('#artInput').val('0');
	$('#TimeValue').val('0');
	$('#start').val(yesterday);
	$('#end').val(yesterday);

	//点击日期下拉框改变时间戳input：
	inpChangeDate(yesterday);

	//获取所有视频数据：
	getVideoData();

	//搜索按钮点击以后搜索视频：
	$('#search_icon').click(function(){
		if($('#artInput').val() === '0' && $('#start').val() && $('#end').val()) {
			artInput = '0';
			$('#allVideoBox').addClass('show').removeClass('hide');
			$('#singleVideoTable').addClass('hide').removeClass('show');
			//获取所有视频数据：
			getVideoData();
		} else if($('#artInput').val() == 1 && $('#start').val() && $('#end').val()) {
			artInput = '1';
			$('#allVideoBox').addClass('hide').removeClass('show');
			$('#singleVideoTable').addClass('show').removeClass('hide');
			var data = param = {
				'userId': start.userId,
				'begainDate': isNull($('#start').val()) ? '' : $('#start').val() + ' 00:00:00',
				'endDate': isNull($('#end').val()) ? '' : $('#end').val() + ' 23:59:59',
				'pagination': {
					'page': start.page,
					'rows': start.rows
				}
			};
			start.getsingleVideoTable({
				url: 'playTimeCollectionByArticle',
				data: data
			});
			start.getSinglePage(start.pages,'playTimeCollectionByArticle',data);
		}
	})
	//视频导出到excel
	$('#exportExc').click(function(){
		if(artInput === '0') {
			exportExcelData('playTimeCollectionExl', param);
		} else if(artInput === '1') {
			exportExcelData('playTimeCollectionByArticleExl', param);
		}
	})
})


var layer = layui.layer;
var laypage = layui.laypage;
var laydate = layui.laydate;
var laytpl = layui.laytpl;
var start = {
	page: 1,
	rows: 5,
	userId: localStorage.getItem('userId') || "",
	getAllVideo: function(d) {
		var url = d.url || "";
		var data = d.data || "";
	    var res = reqNewAjax(url, data);
	    if(res.code == 1) {
	    	var data = res.data;
            if(!isNull(data)) {
               	$('#playNumber').html(data)
            } else {
                $('#playNumber').html('0')
            }
	    } 
	},
	getVideoTable: function(d) {
		var url = d.url || "";
		var data = d.data || "";
	    var res = reqNewAjax(url, data);
	    if(res.code == 1) {
	    	start.pages = Math.ceil(res.total / start.rows);
	    	var data = res.data;
	    	var getTpl = $("#videoTable").html();
            if(!isNull(data) && !isNull(data.list)) {
            	laytpl(getTpl).render(data.list, function(html) {
                    $("#videoTabCon").html(html);
                });
            } else {
                $("#videoTabCon").html('');
            }
	    } 
	},
	getsingleVideoTable: function(d){
		var url = d.url || "";
		var data = d.data || "";
	    var res = reqNewAjax(url, data);
	    if(res.code == 1) {
	    	start.pages = Math.ceil(res.total / start.rows);
	    	var data = res.data;
	    	var getTpl = $("#singleTable").html();
            if(!isNull(data)) {
            	laytpl(getTpl).render(data, function(html) {
                    $("#sinArtTabCon").html(html);
                });
            } else {
                $("#sinArtTabCon").html('');
            }
	    } 
	},
	getAllPage: function(pages, url, data) {
        laypage({
            cont: 'allVideoPage', //容器。值支持id名、原生dom对象，jquery对象,
            pages: pages, //总页数
            skip: true, //是否开启跳页
            skin: '#f6623f',
            groups: 3, //连续显示分页数
            jump: function(obj) {
            	data.pagination.page = start.page = obj.curr;
                start.getVideoTable({
					url: url,
					data: data
				})
            }
        });
    },
    getSinglePage: function(pages, url, data) {
        laypage({
            cont: 'singleVideoPage', //容器。值支持id名、原生dom对象，jquery对象,
            pages: pages, //总页数
            skip: true, //是否开启跳页
            skin: '#f6623f',
            groups: 3, //连续显示分页数
            jump: function(obj) {
            	data.pagination.page = start.page = obj.curr;
                start.getsingleVideoTable({
					url: url,
					data: data
				})
            }
        });
    }
}

//获取所有视频数据：
function getVideoData(){
	var data = param = {
		'userId': start.userId,
		'startTime': isNull($('#start').val()) ? '' : $('#start').val() + ' 00:00:00',
		'endTime': isNull($('#end').val()) ? '' : $('#end').val() + ' 23:59:59',
		'pagination': {
			'page': start.page,
			'rows': start.rows
		}
	};
	start.getAllVideo({
		url: 'playYesterdayCollection',
		data: data
	});
	start.getVideoTable({
		url: 'playTimeCollection',
		data: data
	})
	start.getAllPage(start.pages, 'playTimeCollection', data)
}
