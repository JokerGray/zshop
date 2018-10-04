$(function(){
	var today = formatterDate(new Date());
	var lastWeek = formatterDate(new Date().setDate(new Date().getDate() - 7));
	
	//默认获取文章实时数据：
	getArtData(lastWeek, today);

	$('#articleAnaly').click(function(){
		$(this).addClass('active').siblings().removeClass('active');
		//默认获取文章实时数据：
		getArtData(lastWeek, today);
	});
	$('#videoAnaly').click(function(){
		$(this).addClass('active').siblings().removeClass('active');
		$('.currVideoTable').addClass('show').removeClass('hide');
		$('.currArtTable').addClass('hide').removeClass('show');
		var data = {
			'userId': start.userId,
			'begainDate': lastWeek + ' 00:00:00',
			'endDate': today + ' 23:59:59',
			'pagination': {
				'page': start.page,
				'rows': start.rows
			}
		};
		start.getVideoTable({
			url: 'playTimeCollectionByArticle',
			data: data
		});
		start.getVideoPage(start.pages,'playTimeCollectionByArticle',data);
	});
})

var layer = layui.layer;
var laypage = layui.laypage;
var laydate = layui.laydate;
var laytpl = layui.laytpl;
var start = {
	page: 1,
	rows: 5,
	pages: 1,
	userId: localStorage.getItem('userId') || "",
	getArtTable: function(d) {
		var url = d.url || "";
		var data = d.data || "";
	    var res = reqNewAjax(url, data);
	    if(res.code == 1) {
	    	start.pages = Math.ceil(res.total / start.rows);
	    	var data = res.data;
	    	var getTpl = $("#artTable").html();
            if(!isNull(data)) {
            	laytpl(getTpl).render(data, function(html) {
                    $("#currArtTab").html(html);
                });
            } else {
                $("#currArtTab").html('');
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
            if(!isNull(data)) {
            	laytpl(getTpl).render(data, function(html) {
                    $("#currVideoTab").html(html);
                });
            } else {
                $("#currVideoTab").html('');
            }
	    } 
	},
	getArtPage: function(pages, url, data) {
        laypage({
            cont: 'currArtpage', //容器。值支持id名、原生dom对象，jquery对象,
            pages: pages, //总页数
            skip: true, //是否开启跳页
            skin: '#f6623f',
            groups: 3, //连续显示分页数
            jump: function(obj) {
            	data.pagination.page = start.page = obj.curr;
            	start.getArtTable({
            		url: url,
            		data: data
            	})
            }
        });
    },
    getVideoPage: function(pages, url, data) {
        laypage({
            cont: 'currVideopage', //容器。值支持id名、原生dom对象，jquery对象,
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
    }
}

//默认获取文章实时数据：
function getArtData(begainDate, endDate){
	$('.currArtTable').addClass('show').removeClass('hide');
	$('.currVideoTable').addClass('hide').removeClass('show');
	var data = {
		'userId': start.userId,
		'begainDate': begainDate + ' 00:00:00',
		'endDate': endDate + ' 23:59:59',
		'pagination': {
			'page': start.page,
			'rows': start.rows
		}
	};
	start.getArtTable({
		url: 'queryDetailsByArticle',
		data: data
	});
	start.getArtPage(start.pages,'queryDetailsByArticle',data);
}