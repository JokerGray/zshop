(function($) {
		const   DICTYPELIST = 'operations/dicTypeList',//运营参数类型列表
				ADDDICTYPE = 'operations/addDicType',//新增运营参数类型
				MODIFYDICTYPE = 'operations/modifyDicType'//修改运营参数类型
		
		
		//验证是否为汉字
		  function CheckChinese(val){     
		　　var reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
		　　if(reg.test(val)){     
		       return true     
		　　}else{
			return false
		}
	 }
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
                                	<td class="td2">`+item.name+`</td>
                                	<td class="td3">`+item.code+`</td>
                                	<td class="id" style="display: none;">`+item.id+`</td>
                                	<td class="status" style="display: none;">`+item.status+`</td>
                                	<td class='row remove-modifier td4'>
                                		<div class='change-parameter' data-toggle='modal'  data-target='#change-newuser'>
                                			<i class='edicticon'></i>修改
                                		</div>
                                	</td>
                                </tr>`
		           })
			            $("#tbodyParameter").html(sHtml) 			
			        } else {
			            layer.msg(res.msg);
			        }
			}
			
			
			//下拉
			function select(children){
				var parms ="{'page':1,'rows':10}";
		   		var res =reqAjax(DICTYPELIST,parms);
				var data = res.data;
				var sHtml = '';
				$(children).html("<option data-id=''>--全部--</option>")
				if (res.code == 1) {
		        	$.each(data,function(i,item){
		        		sHtml += `<option data-id=`+item.id+`>`+item.name+`</option>`
	        		})
			            $(children).append(sHtml)
			        } else {
			            layer.msg(res.msg);
			        }	
			}
			select('#addBasic');
			
			
			
			function list(){
				var rows = 10;
		   		var layer = layui.laypage;
		   		var parms ="{'page':1,'rows':10}"
		   		var res =reqAjax(DICTYPELIST,parms);
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
				            var res= reqAjax(DICTYPELIST,parms);
				            commercialDetail(res);
				            document.getElementById('paging-box-count').innerHTML = render(res.data, obj.curr);
				            $('#paging-box-count').html('共'+ obj.pages +'页，每页'+rows+'条');
				        }
				        });
			}
			list();
			
             //新增
				$('#add-newuser').on('click','#add-parameters',function(){
					var name = $('#addTit').val();
					var code = $('#addSouce').val();
					var pid = $('#addBasic>option:checked').attr('data-id');
					if(!name){
						layer.msg('请输入类型名称~')
					}else if(name.length>=8){
						layer.msg('类型名称太长~')
					}else if(!code){
						layer.msg('请输入编码~')
					}else if(CheckChinese(code)){
						layer.msg('编码格式不对~')
					}else{
						var parms ="{'name':'"+name+"','code':'"+code+"','pid':'"+pid+"'}"
						var res= reqAjax(ADDDICTYPE,parms);
						if(res.code == 1){
							layer.msg(res.msg)
							location.reload();
						}else{
							layer.msg(res.msg)
						}	
					}
					
					
				})
			
			
			
			//修改
			$('#tbodyParameter').on('click','.change-parameter',function(){
					var name = $(this).parent().siblings('.td2').html(); //名称
					var code = $(this).parent().siblings('.td3').html(); //code
					var id = $(this).parent().siblings('.id').html();//id
				$('#chaTit').val(name);
				$('#chaSouce').val(code);
				select('#chaBasic');
				$('#chaBasic').val(name)
					$('#change-newuser').on('click','#saveParemeterconfig',function(){
						var name = $('#chaTit').val();
						var pid = $('#chaBasic>option:checked').attr('data-id')
						var parms ="{'id':'"+id+"','name':'"+name+"','pid':'"+pid+"'}"
						var res= reqAjax(MODIFYDICTYPE,parms);
						if(res.code == 1){
							layer.msg(res.msg)
							location.reload();
						}else{
							layer.msg(res.msg)
						}
					});
				
			});	
			
			

			
						
		//查询
		$('#inquire').on('click',function(){
			var layer = layui.laypage;
			var rows = 10;
			var val = $('#inquireInput').val();
			var parms ="{'page':'1','rows':'10','name':'"+val+"'}"
			var res= reqAjax(DICTYPELIST,parms);
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
		        	var parms ="{'page':'"+obj.curr+"','rows':'10','name':'"+val+"'}"
					var res= reqAjax(DICTYPELIST,parms);
		            commercialDetail(res);
		            document.getElementById('paging-box-count').innerHTML = render(res.data, obj.curr);
		            $('#paging-box-count').html('共'+ obj.pages +'页，每页'+rows+'条');
		        }
		        });
		})
				

					
				
				
				
	
		
})(jQuery)