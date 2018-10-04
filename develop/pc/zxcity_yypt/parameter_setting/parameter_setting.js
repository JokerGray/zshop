(function($) {
               var d1='{"page":"1","rows":"10"}';
               var o= reqAjax("operations/dictList",d1);
               var data = o.data;
               var i = data.length;
               var tbodyParameter = $('#tbody-parameter');
               var parameterType;
               var DICTYPELIST = 'operations/dicTypeList'//运营参数类型列表
               
              
            //新增模态框类型
			$('#add-newuser').on('show.bs.modal', function () {
				var parms ="{'page':1,'rows':10000}"
		   		var res =reqAjax(DICTYPELIST,parms);
		   		var data = res.data;
		   		var sHtml = ''
		   		$.each(data, function(i,item) {
		   			sHtml += `<option data-code=`+item.code+`>`+item.name+`</option>`
		   		});
		   		$('#addBasic').html(sHtml)	
    		})
			
			
            // 添加参数
            $('#add-parameters').on('click',addParameter)
            function addParameter(){
            	
                var newNameVal = $('#add-newuser').find('.newname').val();//新参数名称
                var parameterType = $('#addBasic').val()
     			var $option  = $('#addBasic>option:selected').eq(0)
     			var code = $option.attr('data-code')
                var parameterVal = $('#parameter-val').val();//参数值
                var remarks= $('#add-newuser').find('textarea').val();//备注
                var oTr = ''
                if(newNameVal==''){
                    layer.msg('请输入参数名称')
                }else if(parameterVal==''){
                    layer.msg('请输入参数值')
                }else if(parameterType==''){
                    layer.msg('请选择参数类型')
                }else if(newNameVal!=''&&parameterVal!=''){
                    i++
                    var d2 = {
                        "name":newNameVal,"value":parameterVal,"note":remarks,"typeCode":code
                    }
                    d2 = JSON.stringify(d2)
                    var data = reqAjax("operations/addDict",d2);
                    oTr +=  "<tr class='row'><td class='col-md-1'>"+i+"</td><td id='id' style='display:none'></td><td class='col-md-4'>"+newNameVal+"</td><td class='col-md-1'>"+parameterVal+"</td><td class='col-md-4'>"+remarks+"</td><td id='id' style='display:none'>"+parameterType+"</td><td class='row remove-modifier col-md-2'><div id='change-parameter' data-toggle='modal' data-target='#add-newuser'><i class='edicticon'></i>修改</div><div class='delete-parameter'><i class='glyphicon glyphicon-minus-sign m5 red'></i> 删除</div></td></tr>"
                    $(oTr).prependTo(tbodyParameter)
                    $("#add-parameters").attr('data-dismiss','modal')
                    location.reload(true)
                    }
                }

                //修改参数
                $('#tbodyParameter').on('click','.change-parameter',changeParameter);
                $('#saveParemeterconfig').on('click',saveParameter);
                function changeParameter(){
                         oTr = $(this).parent().parent('tr')
                         type = $(this).parent().siblings('#type').html();
                         id = $(this).parent().siblings('td').eq(1).html();
                         name = $(this).parent().siblings('td').eq(2).html();
                         value = $(this).parent().siblings('td').eq(3).html();
                         note = $(this).parent().siblings('td').eq(4).html();
                         
                    $('#changeform').find('.input-group').children('.newname').val(name);
                    $('#changeform').find('.input-group').children('.parameter-val').val(value); 
                    $('#changeform').find('.input-group').children('.remarks').val(note); 
                    $('#change-newuser').on('show.bs.modal', function () {
                    	var parms ="{'page':1,'rows':10000}"
				   		var res =reqAjax(DICTYPELIST,parms);
				   		var data = res.data;
				   		var sHtml = ''
				   		$.each(data, function(i,item) {
				   			sHtml +=`<option data-code=`+item.code+`>`+item.name+`</option>`
				   		});
				   		$('#changeBasic').html(sHtml)
				   		var thisItem = '';
				   		var $option = $('#changeBasic>option')
				   		$.each($option,function(i,item){
				   			if($(item).attr('data-code') == type){
				   				thisItem = item
				   			}
				   		})
				   		var itemType = thisItem.innerHTML
				   		$('#changeBasic').val(itemType)
                    })
                   
                }
                function saveParameter(){
                	var $option  = $('#changeBasic>option:selected').eq(0)
     				var code = $option.attr('data-code')
                    var newName = $('#changeform').find('.input-group').children('.newname').val();
                    var newType = $('#changeBasic').val()
                    var newValue= $('#changeform').find('.input-group').children('.parameter-val').val();
                    var newNote= $('#changeform').find('.input-group').children('.remarks').val();
                    if(newName==""){
                        layer.msg('请输入参数名称')
                    }else if(newValue==''){
                        layer.msg('请输入参数值')
                    }else{
                    var d3 = {
                            id: id,//参数的编号
                            name: newName,//参数的名称
                            value: newValue,//参数的值
                            note: newNote,//备注      
                            typeCode:code,//类型编码
                            url:'',//url地址
                            sequence:'',//序号
                            status:'',//状态
                    }
                    d3 = JSON.stringify(d3)
                    var o = reqAjax("operations/updateDict",d3);
                    $(this).attr('data-dismiss','modal')
                    location.reload(true)
                    }
                }

                //删除参数
                $('#tbodyParameter').on('click','.delete-parameter',deleteParameter)
                    function deleteParameter(){
                            var id = $(this).parent().siblings('td').eq(1).html();
                            var _thistr = $(this).parent().parent('tr');     
                            layer.confirm("确认删除?", {icon: 3, title:'提示'}, function(){
                                var d3 = {
                                    "id":id
                                }
                                d3 = JSON.stringify(d3)
                                var ans=reqAjax("operations/removeDict",d3);
                                _thistr.remove();
                                 location.reload(true)
                        layer.close()})                     
                    }
                    

                //查询参数
                $('#inquire').on('click',inquireParameter)
                function inquireParameter(){
                    var inquire=$('#inquireInput').val();
                    var nums =10;
                    //模拟渲染
			        var render = function(data, curr){
			        var arr = []
			          	,thisData = data;
		            layui.each(thisData, function(index, item){
			             arr.push('<li>'+ item +'</li>');
			         	});
			            return arr.join('');
			        };
			        var d4 = {
	                        "page":"1",
	                        "rows":"10",
	                        "dictName":inquire
				            }
	                var dataAll=reqAjax("operations/dictList",JSON.stringify(d4))
                    var data=dataAll.data;
                    var layer = layui.laypage;
                    var layerMsg = layui.layer
			        layer({
				            cont: 'paging-box'
				            ,first: false
				            ,last: false
				            ,prev: '<' //若不显示，设置false即可
				            ,next: '>'
				            ,pages: Math.ceil(dataAll.total/nums) //得到总页数
				            ,curr: function(){ //通过url获取当前页，也可以同上（pages）方式获取
				                         var page = location.search.match(/page=(\d+)/);
				                         return page ? page[1] : 1;
				                     }()
				            ,jump: function(obj,first){
			                        var d4 = {
				                        "page":"1",
				                        "rows":"10000",
				                        "dictName":inquire
				                    }
				                    var dataAll=reqAjax("operations/dictList",JSON.stringify(d4))
				                    var data=dataAll.data;
				                    var str;
				                    for(var i = 0; i<data.length;i++){
				                      str += "<tr class='row'><td class='col-md-1'>"+(i+1)+"</td><td id='id' style='display:none'>"+data[i].id+"</td><td class='col-md-4'>"+data[i].name+"</td><td class='col-md-1'>"+data[i].val+"</td><td class='col-md-4'>"+data[i].note+"</td><td id='type' style='display:none'>"+data[i].typeCode+"</td><td class='row remove-modifier col-md-2'><div class='change-parameter' data-toggle='modal'  data-target='#change-newuser'><i class='edicticon'></i>修改</div><div class='delete-parameter'><i class='glyphicon glyphicon-minus-sign m5 red'></i> 删除</div></td></tr>"
				                     }
				                    if(!str){
				                        layerMsg.msg('查询不到该参数')
				                    }else{
				                        $('#tbodyParameter').html(str)
				                    }
				              document.getElementById('paging-box-count').innerHTML = render(data, obj.curr);
				                $('#paging-box-count').html('共' + obj.pages + '页，每页' + nums + '条，共'+dataAll.total+'条');
				                if(!first){ //一定要加此判断，否则初始时会无限刷新
				                    location.href = '?page='+obj.curr;
				                }
				             }
				          });          
                }
                // 
})(jQuery)