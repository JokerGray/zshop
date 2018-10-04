(function($) {
		const   FINDANNOUNCEMNETS = 'operations/findAnnouncements',//查询公告
				CREATEANNOUNCEMENT = 'operations/createAnnouncement',//创建公告
				UPDATEANNOUNCEMENT = 'operations/updateAnnouncement',//修改公告
				DELETEANNOUNCEMENT = 'operations/deleteAnnouncement'//删除公告
				
		
		
		//列表
			function commercialDetail(res) {
		        var sHtml = "";
		        var data = res.data;
		        if (res.code == 1) {
		           $.each(data,function(i,item){
		                var row = res.data[i];
		                if(item.status == 1){
		                	item.status = '是'
		                }else{
		                	item.status = '否'
		                }
		      
		                sHtml += `<tr>
                                	<td class="td1">`+(i+1)+`</td>
                                	<td class="td2">`+item.caption+`</td>
                                	<td class="td3">`+item.source+`</td>
                                	<td class="td4">`+item.status+`</td>
                                	<td class="td5">`+item.publisher+`</td>
                                	<td class="td6">`+item.type+`</td>
                                	<td class="td7">`+item.createTime.substring(0,16)+`</td>
                                	<td class="id" style="display: none;">`+item.id+`</td>
                                	<td class="notice" style="display: none;">`+item.content+`</td>
                                	<td class="publisherId" style="display: none;">`+item.publisherId+`</td>
                                	<td class='row remove-modifier td8'>
                                		<div class='details' data-toggle='modal'  data-target='#showNotice'>
                                			公告详情
                                		</div>
                                		<div class='change-parameter' data-toggle='modal'  data-target='#change-newuser'>
                                			<i class='edicticon'></i>修改
                                		</div>
                                		<div class='delete-parameter'>
                                			<i class='glyphicon glyphicon-minus-sign m5 red delete'></i> 删除
                                		</div>
                                	</td>
                                </tr>`
		           })
			            $("#tbodyParameter").html(sHtml) 			
			        } else {
			            layer.msg(res.msg);
			        }
			}	
			
			function list(){
				var rows = 10;
		   		var layer = layui.laypage;
		   		var parms ="{'page':1,'rows':10}"
		   		var res =reqAjax(FINDANNOUNCEMNETS,parms);
				//模拟渲染
				    var render = function(data, curr){
				        var arr = []
				            ,thisData = res;
				        layui.each(thisData, function(index, item){
				            arr.push('<li>'+ item +'</li>');
				        });
				        return arr.join('');
				    };
		   		  //调用分页
		        	layer({
				        cont: 'paging-box'
				        ,first: false
				        ,last: false
				        ,prev: '<' //若不显示，设置false即可
				        ,next: '>'
				        ,pages: Math.ceil(res.total/rows) //得到总页数
				        ,curr: function(){ //通过url获取当前页，也可以同上（pages）方式获取
				            var page = location.search.match(/page=(\d+)/);
				            return page ? page[1] : 1;
				        }()
				        ,jump: function(obj,first){
				        	var parms ="{'page':"+obj.curr+",'rows':10}"
				            var res= reqAjax(FINDANNOUNCEMNETS,parms);
				            commercialDetail(res);
				            document.getElementById('paging-box-count').innerHTML = render(res.data, obj.curr);
				            $('#paging-box-count').html('共'+ obj.pages +'页，每页'+rows+'条');
				        }
				        });
			}
			list();
			
            //富文本-新增
                layui.use('layedit', function(){
				  var layedit = layui.layedit;
				  var index = layedit.build('demo', {
					  tool: ['strong' //加粗
							  ,'italic' //斜体
							  ,'underline' //下划线
							  ,'del' //删除线
							  
							  ,'|' //分割线
							  
							  ,'left' //左对齐
							  ,'center' //居中对齐
							  ,'right' //右对齐
							  ,'unlink' //清除链接
							  ,'face' //表情
							  ,'help' //帮助
							],
					  height:200,
					});
				$('.layui-layedit').width(700)
				$('#add-newuser').on('click','#add-parameters',function(){
					var content = layedit.getContent(index)
					var caption = $('#addTit').val();
					var source = $('#addSouce').val();
					var type = $('#addType').val();
					var status = ($('#addinfo').val()=='是')?1:0 ;
					var publisher = sessionStorage.getItem('username');
					var publisherId = sessionStorage.getItem('userno');
					if(caption==''){
						layer.msg('请输入标题')
					}else if(source==''){
						layer.msg('请输入来源')
					}else if(content==''){
						layer.msg('请输入内容')
					}else{
						var parms ="{'caption':'"+caption+"','content':'"+content+"','publisher':'"+publisher+"','publisherId':'"+publisherId+"','source':'"+source+"','type':'"+type+"','status':'"+status+"',}"
						var res= reqAjax(CREATEANNOUNCEMENT,parms);
						if(res.code == 1){
							layer.msg(res.msg)
							location.reload();
						}else{
							layer.msg(res.msg)
						}
					}
					
				})
			});
			
			
			
			//富文本-修改
			$('#tbodyParameter').on('click','.change-parameter',function(){
					var caption = $(this).parent().siblings('.td2').html(); //标题
					var content = $(this).parent().siblings('.notice').html(); //内容(html)
					var source = $(this).parent().siblings('.td3').html();//来源
					var status = $(this).parent().siblings('.td4').html();//是否发布
					var type = $(this).parent().siblings('.td6').html();//类型
					var id = $(this).parent().siblings('.id').html();//id
					var layedit = layui.layedit;
					layui.use('layedit',function() {
				    $("#change").html(content)
				    //构建一个默认的编辑器
				    changeIndex = layedit.build('change', {
					  tool: ['strong' //加粗
							  ,'italic' //斜体
							  ,'underline' //下划线
							  ,'del' //删除线
							  
							  ,'|' //分割线
							  
							  ,'left' //左对齐
							  ,'center' //居中对齐
							  ,'right' //右对齐
							  ,'unlink' //清除链接
							  ,'face' //表情
							  ,'help' //帮助
							],
					  height:200,
					});
				   $('.layui-layedit').width(700)
				});
				$('#chaTit').val(caption);
				$('#chaSouce').val(source);
				$('#chaType').val(type);
				$('#chainfo').val(status)
					$('#change-newuser').on('click','#saveParemeterconfig',function(){
						var content = layedit.getContent(changeIndex)
						var caption = $('#chaTit').val();
						var source = $('#chaSouce').val();
						var type = $('#chaType').val();
						var status = ($('#chainfo').val()=='是')?1:0;
						var publisher = sessionStorage.getItem('username');
						var publisherId = sessionStorage.getItem('userno');
						var parms ="{'id':'"+id+"','caption':'"+caption+"','content':'"+content+"','publisher':'"+publisher+"','publisherId':'"+publisherId+"','source':'"+source+"','type':'"+type+"','status':'"+status+"',}"
						var res= reqAjax(UPDATEANNOUNCEMENT,parms);
						if(res.code == 1){
							layer.msg(res.msg)
							location.reload();
						}else{
							layer.msg(res.msg)
						}
					});
				
			});	
			
			
			//删除
		  $("#tbodyParameter").on("click", ".delete-parameter", function () {
		  	var id = $(this).parent().siblings('.id').html();//id
	        layer.confirm(
	            "确认删除?",
	            {icon: 3, title:'提示'},
	            function(index){
	                var paramDel = "{'id':'" + id + "'}";
	                var res = reqAjax(DELETEANNOUNCEMENT, paramDel);
	                if (res.code == 1) {
	                	layer.msg(res.msg);
						layer.close(index); //如果设定了yes回调，需进行手工关闭
						location.reload();
	                } else {
	                    layer.msg(res.msg);
	                }
	            })
		  });

			
						
		//查询
		$('#inquire').on('click',function(){
			var layer = layui.laypage;
			var rows = 10;
			var val = $('#inquireInput').val();
			var parms ="{'id':'','caption':'"+val+"','publisher':'','beginTime':'','endTime':'','page':'1','rows':'10'}"
			var res= reqAjax(FINDANNOUNCEMNETS,parms);
			//模拟渲染
		    var render = function(data, curr){
		        var arr = []
		            ,thisData = res;
		        layui.each(thisData, function(index, item){
		            arr.push('<li>'+ item +'</li>');
		        });
		        return arr.join('');
		    };
   		  	//调用分页
        	layer({
		        cont: 'paging-box'
		        ,first: false
		        ,last: false
		        ,prev: '<' //若不显示，设置false即可
		        ,next: '>'
		        ,pages: Math.ceil(res.total/rows) //得到总页数
		        ,curr: function(){ //通过url获取当前页，也可以同上（pages）方式获取
		            var page = location.search.match(/page=(\d+)/);
		            return page ? page[1] : 1;
		        }()
		        ,jump: function(obj,first){
		        	var parms ="{'id':'','caption':'"+val+"','publisher':'','beginTime':'','endTime':'','page':'"+obj.curr+"','rows':'10'}"
					var res= reqAjax(FINDANNOUNCEMNETS,parms);
		            commercialDetail(res);
		            document.getElementById('paging-box-count').innerHTML = render(res.data, obj.curr);
		            $('#paging-box-count').html('共'+ obj.pages +'页，每页'+rows+'条');
		        }
		        });
		})
				

					
				
				
				
				
				
		//显示详情
		$('#common-table').on('click','.details',function(){
			var notice = $(this).parent().siblings('.notice').html();
			var noticeFrom = $(this).parent().siblings('.td3').html();
			var noticeTime = $(this).parent().siblings('.td7').html();
			var noticeTitle = $(this).parent().siblings('.td2').html();
			var sHtml = `<h2 id="noticeTitle">`+noticeTitle+`</h2>
					<div class="noticeFrom">
						<div class="iBox">
							<span class="first">来源:<span id="from">`+noticeFrom+`</span></span>
							<span>`+noticeTime.substring(0,16)+`</span>
						</div>
					</div>
					<div id="noticeContent">
						`+notice+`
					</div>`
			$('#showNotice').on('show.bs.modal', function () {
						$('#showNotice .modal-body').html(sHtml)
        })

		})
		
})(jQuery)