(function($) {
		const   VALIDATION = 'operations/validationWhiteList',//查询
				ADDVALIDATION = 'operations/addValidationItem',//添加
				DELETEVALIDA = 'operations/deleteValidationItem',//删除
				UPDATEVALIDATION = 'operations/updateValidationItem'//修改

		
		
		var layer = layui.layer;
		var table = layui.table;
  		layui.use('form', function(){
  			 form = layui.form;
  		})
		
		//点击变色
//		$('#app-con').on('click','tr',function(){
//			$(this).addClass('layui-table-click').siblings().removeClass('layui-table-click')
//		})
//		
		//搜索功能
//		$('#search').on('click',function(){
//		  		$('#search-tool').slideToggle(200)
//	    })
		 //点击变色
		  $('#app').on('click','tbody tr',function(){
			  	$(this).addClass('layui-table-click').siblings().removeClass('layui-table-click');
		  })
		  
 		 
 		 
 		 //表格渲染
   		 var tableIns =table.render({
		  	   id:'demo'
			  ,elem: '#demo' //指定原始表格元素选择器（推荐id选择器）
			//   ,width:'100%'
			  ,height: 600 //容器高度
			  ,cols: [[
		    		 {title:'序号',sort:false,align:'left',field:'eq',width:80}
				    ,{title:'CMD',sort:false,align:'left',field:'key',width:500}
				    ,{title:'操作',fixed: 'right',align:'left', toolbar: '#barDemo',width:530}
			  ]]
			  ,loading: true
			  ,data:List($('li.act'))
			  ,page:true
			  ,even: true
			  ,skin: 'row'
			  ,limits: [15,50,100,300,800,1000]
			  ,limit: 15 //默认采用60
		  });
		  
		  
		  //表格重载
		  $('.search-li').on('click',function(){
			$(this).addClass('act').siblings().removeClass('act');
			tableIns.reload({
			  data:List()
			});
	 	  })
		  
		
		//初始方法
		function List(){
			var parms ="{'currentPage':'1','pageSize':'20','sort':'1'}";
			var res =reqAjax(VALIDATION,parms);
			var data = res.data;
			var arr = [];
	   		  $.each(data,function(i,item){
	   		  	  var obj = {};
	   		  	  obj.eq = i+1
	   		  	  obj.key = item
	   		  	  arr.push(obj)
	   		  })
			return arr;
		}
//		
//		
//		
//		//监听工具条
		  table.on('tool(demo)', function(obj){
		    var data = obj.data;
		    //修改
		    if(obj.event === 'change'){
	    	   layer.open({
				   title: ['修改', 'font-size:12px;background-color:#424651;color:#fff'],
				  type: 1,
				  btn: ['保存', '取消'],
				  content:$('#con'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
				  area: ['950px', '600px'],
				  end:function(){
				  	  $('#con').hide();
				  	  $('#version').val('');
				  },
				  success: function(layero, index){
						$('#version').val(data.key);
						form.render();
				  },
				  yes:function(index, layero){
				  		var oldKey =  data.key;
				  		var newKey =  $('#version').val();
	                	var parms ="{'oldKey':'"+oldKey+"','newKey':'"+newKey+"','sortNumber':'1'}"
	                	if(newKey==''){
	                		layer.msg('请输入CMD')
	                	}else{
	                		var res = reqAjax(UPDATEVALIDATION,parms);
		                	if(res.code == 1){
		                		layer.msg(res.msg);
		                		layer.close(index)
		                		tableIns.reload({
								  data:List()
								});
		                	}else{
		                		layer.msg(res.msg);
		                	}
	                	}
	                	
				    }
	  			});
		      }else if(obj.event === 'del'){
		      var key = data.key;
		      layer.confirm('真的删除行么', function(index){
			        obj.del();
			        var d3 = {"key":key};
	                d3 = JSON.stringify(d3);
	                var res = reqAjax(DELETEVALIDA,d3);
	                tableIns.reload({
					  data:List()
					});
			        layer.close(index);
			        layer.msg(res.msg);
		      });
		    }
		  });
		  
		  
		//新增
		$('#commonAdd').on('click',function(){
			layer.open({
				title: ['新增', 'font-size:12px;background-color:#424651;color:#fff'],
				  type: 1,
				  btn: ['保存', '取消'],
				  content:$('#con'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
				  area: ['950px', '600px'],
				  end:function(){
				  	  $('#con').hide();
				  	  $('#version').val('');
				  },
				  success: function(layero, index){
			    	    $('#version').val('');
				  },
				  yes:function(index, layero){
				  		var reg = new RegExp("[\\u4E00-\\u9FFF]+","g")//汉字
				  		
				  		var content = $('#version').val();
				  		if(content==''){
				  			layer.msg('请输入CMD')
				  		}else if(reg.test(content)){
				  			layer.msg('CMD不能为汉字')	
				  		}else{
				  			var parms ="{'content':'"+content+"','sortNumber':'1'}"
		                	var res = reqAjax(ADDVALIDATION,parms);
		                	if(res.code == 1){
		                		layer.msg(res.msg);
		                		layer.close(index)
		                		tableIns.reload({
								  data:List()
								});
		                	}else{
		                		layer.msg(res.msg);
		                	}
				  		}
				    }
	  			});
		})
//		
//		
//		
//		//刷新
    function refresh(){
    	location.reload();
    }
    $('#refresh').click(function(){
    	refresh()
    });
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
})(jQuery)