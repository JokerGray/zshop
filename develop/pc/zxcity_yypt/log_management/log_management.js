(function($) {
		const   NEWMERCHANTLOGS = 'operations/newMerchantLogs',//新增商户错误日志列表
				DEALADDMERCHANTERROR = 'operations/dealAddMerchantError'//处理新增商户错误日志

		
		
				
		//列表
			function commercialDetail(res) {
		        var sHtml = "";
		        var data = res.data;
		        if (res.code == 1) {
		        	$.each(data,function(i,item){
		        		sHtml += `<tr>
                                	<td class="td1">`+(i+1)+`</td>
                                	<td class="td2">`+item.createTime+`</td>
                                	<td class="td3">`+item.log+`</td>
                                	<td class="id" style="display:none">`+item.id+`</td>
                                	<td class='td4'>
                                		<div id='details' class='details'>
                                			处理
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
		   		var res =reqAjax(NEWMERCHANTLOGS,parms);
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
				            var res= reqAjax(NEWMERCHANTLOGS,parms);
				            commercialDetail(res);
				            document.getElementById('paging-box-count').innerHTML = render(res.data, obj.curr);
				            $('#paging-box-count').html('共'+ obj.pages +'页，每页'+rows+'条');
				        }
				        });
			}
			list();


		//处理
		$('#tbodyParameter').on('click','#details',function(){
			var id = $(this).parent().siblings('.id').html(); //id
			var parms ="{'id':'"+id+"'}"
			var res= reqAjax(DEALADDMERCHANTERROR,parms);
			layer.msg(res.msg)
			location.reload();
		})
		
})(jQuery)