$(document).ready(function(){
	          var dataList={
	              rows:10, 
	              page:1
	          }
	          var dataAll=reqAjax("operations/dictList",JSON.stringify(dataList))
	          var data = dataAll.data
	          var layer = layui.laypage;
	          var nums = 10; //每页出现的数据量
	          //模拟渲染
	          var render = function(data, curr){
	          var arr = []
	          		,thisData = data;
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
	            ,pages: Math.ceil(dataAll.total/nums) //得到总页数
	            ,curr: function(){ //通过url获取当前页，也可以同上（pages）方式获取
	                         var page = location.search.match(/page=(\d+)/);
	                         return page ? page[1] : 1;
	                     }()
	            ,jump: function(obj,first){
	                       var dataList={
	                        page:obj.curr,
	                        rows:10
	                      }
	                      var dataAll=reqAjax("operations/dictList",JSON.stringify(dataList))
	                      var data=dataAll.data;
	                      var str;
			                  for(var i = 0; i<data.length;i++){
			                      str += "<tr class='row'><td class='col-md-1'>"+(i+1)+"</td><td id='id' style='display:none'>"+data[i].id+"</td><td class='col-md-4'>"+data[i].name+"</td><td class='col-md-1'>"+data[i].val+"</td><td class='col-md-4'>"+data[i].note+"</td><td id='type' style='display:none'>"+data[i].typeCode+"</td><td class='row remove-modifier col-md-2'><div class='change-parameter' data-toggle='modal'  data-target='#change-newuser'><i class='edicticon'></i>修改</div><div class='delete-parameter'><i class='glyphicon glyphicon-minus-sign m5 red'></i> 删除</div></td></tr>"
			                      }
	              $(tbodyParameter).html(str)
	              document.getElementById('paging-box-count').innerHTML = render(data, obj.curr);
	                $('#paging-box-count').html('共' + obj.pages + '页，每页' + nums + '条，共'+dataAll.total+'条');
	                if(!first){ //一定要加此判断，否则初始时会无限刷新
	                    location.href = '?page='+obj.curr;
	                }
	             }
	          });
});