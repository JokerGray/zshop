(function($) {
		const   CHANGESITE = 'operations/versionHistoryModify',//修改版本
				DELVEDIOCATALOG = 'operations/versionHistoryList'//.查询
		
		
		
		var layer = layui.layer;
		var table = layui.table;
  		layui.use('form', function(){
  			 form = layui.form;
  		})
		
		var index = sessionStorage.getItem('index');
		$('.search-li').eq(index).addClass('act');
		
		/* 表格初始化
	 * tableId: 
	 * cols: []
	 * pageCallback: 同步调用接口方法
	 */
	function tableInit(tableId, cols, pageCallback , pageDomName) {
		var tableIns, tablePage;

		//1.表格配置
		tableIns = table.render({
			id: tableId,
			elem: '#' + tableId,
			height:'full-250',
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
			elem:pageDomName,
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
				if(resTwo && resTwo.code == 1){
					tableIns.reload({
						data: resTwo.data
					});
				}
					
				else{
					layer.msg(resTwo.msg);
				}
					
			}
		}
		
		
		layui.laypage.render(page_options);

		
		return {
			tablePage,
			tableIns
		};
	}

	//左侧表格数据处理
	function getData(url, parms) {

		var res = reqAjax(url, parms);

		var data = res.data;

		$.each(data, function(i, item) {
			$(item).attr('eq', (i + 1))
			var _force_new = item.force_new == '1'?'是':'否';
			var _show_game = item.show_game == '1'?'是':'否';
			$(item).attr('_force_new',_force_new)
			$(item).attr('_show_game',_show_game)
	//		$(item).attr('areaurl',areaurl)
		});

		return res;
	}
	
	//pageCallback回调
	function pageCallback(index, limit ,platform) {
		var platform = $('li.act').attr('data-platform');
		return getData(DELVEDIOCATALOG, "{'page':" + index + ",'rows':" + limit + ", 'platform':'"+platform+"','areaurl':'"+areaurl+"'}");
	}
	
	
	
	var _obj = tableInit('demo', [[
		    		 {title:'序号',sort:false,align:'left',field:'eq',width:80}
				    ,{title:'版本号',sort:false,align:'left',field:'new_version',width:150}
				    ,{title:'下载地址',sort:false,align:'left',field:'url',width:200}
				    ,{title:'是否更新',sort:false,align:'left',field:'_force_new',width:100}
					,{title:'修改时间',sort:false,align:'left',field:'update_time',width:200}
				    ,{title:'更新日志',sort:false,align:'left',field:'update_log',width:300}
				    ,{title:'游戏入口',sort:false,align:'left',field:'_show_game',width:100}
				    ,{title:'区域信息下载地址',sort:false,align:'left',field:'areaurl',width:300}
				    ,{title:'操作',fixed: 'right',align:'left', toolbar: '#barDemo',width:200}
			  ]],
		pageCallback,'laypageLeft'
	)

 		 
		  
		  
		  //表格重载
		  $('.search-li').on('click',function(){
				$(this).addClass('act').siblings().removeClass('act');			
				var _obj = tableInit('demo', [[
				    		 {title:'序号',sort:false,align:'left',field:'eq',width:80}
						    ,{title:'版本号',sort:false,align:'left',field:'new_version',width:150}
						    ,{title:'下载地址',sort:false,align:'left',field:'url',width:200}
						    ,{title:'是否更新',sort:false,align:'left',field:'_force_new',width:100}
							,{title:'修改时间',sort:false,align:'left',field:'update_time',width:200}
						    ,{title:'更新日志',sort:false,align:'left',field:'update_log',width:300}
						    ,{title:'游戏入口',sort:false,align:'left',field:'_show_game',width:100}
                        ,{title:'区域信息下载地址',sort:false,align:'left',field:'areaurl',width:300}
						    ,{title:'操作',toolbar: '#barDemo',width:200}
					  ]],
				pageCallback,'laypageLeft'
				)
	 	  })

		
		//监听工具条
		  table.on('tool(demo)', function(obj){
		    var data = obj.data;
		    //查看
		    if(obj.event === 'detail'){
			      layer.open({
				  title: ['详情', 'font-size:12px;background-color:#0678CE;color:#fff'],
				  type: 1,
				  content:$('#con'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
				  area: ['950px', '600px'],
				  cancel:function(index,layero){
				  	  var aaa = $(layero).find('input,textarea,select');
			    	  $.each(aaa, function(i,item) {
			    	  		$(item).attr('disabled',false)
			    	  });
				  	  $('#con').hide();
				  	  $('#addName').val('');
			    	  $('#addValue').val('');
			    	  $('#addContent').val('');
			    	  $('#typeSelect').val('');
				  },
				  success: function(layero, index){
					 var aaa = $(layero).find('input,textarea,select');
			    	  $.each(aaa, function(i,item) {
			    	  		$(item).attr('disabled',true)
			    	  });
			    	    $('#version').val(data.new_version);
			   			$('#url').val(data.url);
			   			$('#forceNew').val(data.force_new);
			   			$('#updateLog').val(data.update_log);
			   			$('#showGame').val(data.show_game);
			   			$('#areaurl').val(data.areaurl);
                      $('#newSpecific').val(data.newSpecific);
				   }
	  			});
	  		
		    }else if(obj.event === 'change'){
	    	   layer.open({
				  title: ['修改', 'font-size:12px;background-color:#0678CE;color:#fff'],
				  type: 1,
				  btn: ['保存', '取消'],
				  content:$('#con'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
				  area: ['950px', '600px'],
				  end:function(){
				  	  $('#con').hide();
				  	  $('#addName').val('');
			    	  $('#addValue').val('');
			    	  $('#addContent').val('');
			    	  $('#typeSelect').val('');
				  },
				  success: function(layero, index){
			    	    $('#version').val(data.new_version).attr('disabled',true);
			   			$('#url').val(data.url).attr('disabled',true);
			   			$('#forceNew').val(data.force_new);
			   			$('#updateLog').val(data.update_log).attr('disabled',true);
			   			$('#showGame').val(data.show_game);
                      $('#areaurl').val(data.areaurl).attr('disabled',true);
                      $('#newSpecific').val(data.newSpecific);
				  },
				  yes:function(index, layero){
				  		var id = data.id;var newSpecific =    $('#newSpecific').val();
				  		var operator = yyCache.get('userno');
				  		var force_new =  $(layero).find('#forceNew').val();
				  		var show_game =  $(layero).find('#showGame').val();
				  		var areaurl = $(layero).find('#areaurl').val();
	                	var parms ="{'id':'"+id+"','operator':"+Number(operator)+",'force_new':'"+force_new+"','show_game':'"+show_game+"','areaurl':'"+areaurl+"','newSpecific':'"+newSpecific+"'}"
	                	var res = reqAjax(CHANGESITE,parms);
	                	if(res.code == 1){
	                		layer.msg(res.msg);
	                		layer.close(index)
	                		var _obj = tableInit('demo',[[
                                    {title:'序号',sort:false,align:'left',field:'eq',width:80}
                                    ,{title:'版本号',sort:false,align:'left',field:'new_version',width:150}
                                    ,{title:'下载地址',sort:false,align:'left',field:'url',width:200}
                                    ,{title:'是否更新',sort:false,align:'left',field:'_force_new',width:100}
                                    ,{title:'修改时间',sort:false,align:'left',field:'update_time',width:200}
                                    ,{title:'更新日志',sort:false,align:'left',field:'update_log',width:300}
                                    ,{title:'游戏入口',sort:false,align:'left',field:'_show_game',width:100}
                                    ,{title:'区域信息下载地址',sort:false,align:'left',field:'areaurl',width:300}
                                    ,{title:'操作',toolbar: '#barDemo',width:200}
                                ]],
							pageCallback,'laypageLeft'
							)
	                	}else{
	                		layer.msg(res.msg);
	                	}
				    }
	  			});
		      }
		  });
		
		
		
	//点击变色
	$('#app-con').on('click', 'tbody tr', function() {
		$(this).addClass('layui-table-click').siblings().removeClass('layui-table-click');
	})	
		
		
		//刷新
    function refresh(){
    	location.reload();
    }
    $('#refresh').click(function(){
    	refresh()
    });
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
})(jQuery)