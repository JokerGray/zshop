(function($) {
		const   GETSITEPAGE = 'operations/queryVersionPage',//分页查询版本列表
				ADDSITE = 'operations/addVersion',//新增版本
				UPDATESITE = 'operations/modifyVersion',//修改版本
				DELETESITE = 'operations/deleteVersion'//删除版本
			//整数
			function isNum(num){
				if(num%1==0){
					return true
				}else{
					return false
				}
			}
			//是否强制更新
			function isUpload(Upload){
				return Upload = Upload==0?'否':'是'
			}
			//是否有补丁
			function isPatch(patch){
				return patch = patch==0?'无补丁':'有补丁'
			}
			function tNan(t){
				if(Number(t)==0){
					return 0
				}else{
					return t
				}
			}
			
			
			
			//列表
			function commercialDetail(res) {
		        var sHtml = "";
		        var data = res.data;
		        if (res.code == 1) {
		        	$.each(data,function(i,item){
		        		sHtml += `<tr>
                                	<td class="td1">`+(i+1)+`</td>
                                	<td class="td2">`+item.version+`</td>
                                	<td class="td3">`+item.url+`</td>
                                	<td class="td4">`+item.platform+`</td>
                                	<td class="td7">`+tNan(item.versionCode)+`</td>
                                	<td class="td5" data-forcenew=`+item.forceNew+`>`+isUpload(item.forceNew)+`</td>
                                	<td class="td6" data-haspatch=`+item.hasPatch+`>`+isPatch(item.hasPatch)+`</td>
                                	<td class='row remove-modifier td7'>
                                		<div class='change-parameter w50' data-toggle='modal'  data-target='#change-newuser'>
                                			<i class='edicticon'></i>修改
                                		</div>
                                		<div class='delete-parameter w50'>
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
		   		var version = $("#inquireInput").val();
		   		var platform = $("#inquireInputDb").val();
		   		var parms ="{'page':1,'rows':10,'version':'"+version+"','platform':'"+platform+"'}";
		   		var res =reqAjax(GETSITEPAGE,parms);
	   			var total = res.total;
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
				        	var parms ="{'page':'"+obj.curr+"','rows':10,'version':'"+version+"','platform':'"+platform+"'}";
				            var res= reqAjax(GETSITEPAGE,parms);
				            commercialDetail(res);
				            document.getElementById('paging-box-count').innerHTML = render(res.data, obj.curr);
				            $('#paging-box-count').html('共'+ obj.pages +'页，每页'+rows+'条，总数'+total+'条');
				        }
				        });
			}
			list();

			
            //新增
				$('#add-newuser').on('click','#add-parameters',function(){
					var version = $('#addName').val();
					var url = $('#addIp').val()
					var platform = $('#addSrc').val();
					var forceNew = $('#addGx').val();
					var hasPatch = $('#addBd').val();
					var versionCode = $('#addNum').val();
					if(version==''){
						layer.msg('请输入版本号~')
					}else if(url==''){
						layer.msg('请输入版本地址~')
					}else if(platform==''){
						layer.msg('请输入版本平台~')
					}else if(versionCode==''){
						layer.msg('请输入版本号代码~')
					}else if(isNaN(versionCode)){
						layer.msg('版本号代码必须为整数~')
					}else{
						var parms ="{'version':'"+version+"','logo':'','url':'"+url+"','platform':'"+platform+"','forceNew':'"+forceNew+"','updateLog':'','hasPatch':'"+hasPatch+"','md5':'','versionCode':'"+versionCode+"'}"
						var res= reqAjax(ADDSITE,parms);
						if(res.code == 1){
							layer.msg(res.msg)
							location.reload();
						}else{
							layer.msg(res.msg)
						}
					}
				})
			
			
			//修改。。。
			$('#tbodyParameter').on('click','.change-parameter',function(){
					var version = $(this).parent().siblings('.td2').html();
					var url = $(this).parent().siblings('.td3').html();
					var platform = $(this).parent().siblings('.td4').html();
					var forceNew = $(this).parent().siblings('.td5').attr('data-forcenew');
					var hasPatch = $(this).parent().siblings('.td6').attr('data-haspatch');
					var versionCode = $(this).parent().siblings('.td7').html();
					$('#chaName').val(version);
					$('#chaIp').val(url);
					$('#chaSrc').val(platform);
					$('#chaNum').val(versionCode);
					$('#chaGx').val(forceNew);
					$('#chaBd').val(hasPatch);
					$('#change-newuser').on('click','#saveParemeterconfig',function(){
						var version = $('#chaName').val();
						var url = $('#chaIp').val()
						var platform = $('#chaSrc').val();
						var forceNew = $('#chaGx').val();
						var hasPatch = $('#chaBd').val();
						var versionCode = $('#chaNum').val();
						if(version==''){
							layer.msg('请输入版本号~')
						}else if(url==''){
							layer.msg('请输入版本地址~')
						}else if(platform==''){
							layer.msg('请输入版本平台~')
						}else if(versionCode==''){
							layer.msg('请输入版本号代码~')
						}else if(isNaN(versionCode)){
							layer.msg('版本号代码必须为整数~')
						}else{
							var parms ="{'version':'"+version+"','logo':'','url':'"+url+"','platform':'"+platform+"','forceNew':'"+forceNew+"','updateLog':'','hasPatch':'"+hasPatch+"','md5':'','versionCode':'"+versionCode+"'}"
							var res= reqAjax(UPDATESITE,parms);
							if(res.code == 1){
								layer.msg(res.msg)
								location.reload();
							}else{
								layer.msg(res.msg)
							}
						}
					})
					
			});	
			
			
			//删除
		  $("#tbodyParameter").on("click", ".delete-parameter", function () {
		  	var platform = $(this).parent().siblings('.td4').html();//id
	        layer.confirm(
	            "确认删除?",
	            {icon: 3, title:'提示'},
	            function(index){
	                var paramDel = "{'platform':'" + platform + "'}";
	                var res = reqAjax(DELETESITE, paramDel);
	                if (res.code == 1) {
	                	layer.msg(res.msg);
						layer.close(index); //如果设定了yes回调，需进行手工关闭
						location.reload();
	                } else {
	                    layer.msg(res.msg);
	                }
	            })
		  });

})(jQuery)