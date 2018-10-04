(function($) {
		var USER_URL = {
	        RESOURLIST : 'operations/resourceList', //(查询权限)
	        ADDRESOURCE : 'operations/addResource',//(新增权限)
	        UPDATERESOURCE :'operations/updateResource',//(修改权限)
	        DELRESOURCE :'operations/removeResource',//(删除权限)
	        RESOURCETREE : 'operations/resourceTree', //(权限树)
	        RESOURCESIZE : 'operations/dictItemsGroupByType', //(权限类型)
	        QUERYMYLIST : 'operations/queryMyMenuList',//(权限列表)
	        CUSTOMIZEMYMENU : 'operations/customizeMyMenu',//(重命名)
	        DELETEMYMENU : 'operations/deleteMyMenu',//(删除)
	        ADDMYMENU : 'operations/addMyMenu'//(新增)
    	};
		//左侧导航方法
	    function leftNav(res) {
	        var sHtml = "";
	        if (res.code == 1) {
	            var row = res.data;
	            console.log(row)
	            for(var a=0;a<row.length;a++){
	                var rowA = row[a];
	                sHtml += '<li>' +
	                '<div class="jurisdiction-nav-li addorz" data-id = "' + rowA.id + '"><span class="glyphicon glyphicon-triangle-bottom"></span><a class="system-orztitle">' + rowA.name + '</a></div>' +
	                '<ul class="jurisdiction-info-nav">'
	                for (var i = 0; i < rowA.children.length; i++) {
	                    var rowB = rowA.children[i];
	                    sHtml += '<li>' +
	                    '<div class="jurisdiction-info-nav-li addorz easyui-drappable" data-name="' + rowB.name + '"   data-id="' + rowB.id + '"><span class="glyphicon glyphicon-triangle-bottom"></span><a class="system-orztitle">' + rowB.name + '</a></div>' +
	                    '<ul class="jurisdiction-info-secondnav">'
	                    for (var j = 0; j < rowB.children.length; j++) {
	                        var rowC= rowB.children[j];
	                        sHtml += '<li>' +
	                        '<div class="jurisdiction-info-thirdnav-li easyui-drappable addorz" data-name="' + rowB.name + '" data-id="' + rowC.id + '"><span class="glyphicon glyphicon-circle"></span><a class="system-orztitle">' + rowC.name + '</a></div>' +
	                        '<ul class="jurisdiction-info-thirdnav">'
	                        for (var k = 0; k < rowC.children.length; k++) {
	                            var rowD = rowC.children[k];
	                            sHtml += '<li data-id="' + rowD.id + '"><span class="glyphicon glyphicon-circle"></span>' +rowD.name + '</li>';
	                        };
	                        sHtml += '</ul>' +
	                        '</li>';
	                    };
	                    sHtml += '</ul>' +
	                    '</li>';
	                };
	                sHtml += '</ul>' +
	                '</li>';
	            };
	            $(".navList").html(sHtml);
	        } else {
	            layer.msg(res.msg);
	        }
	    }


	    //加载左侧导航树
	    getNav();
	    function getNav(){
	        var parentId = sessionStorage.getItem("parentId");
	        var roleId = sessionStorage.getItem("roleId");
	        var paramLft = "{'parentId':'" + parentId + "','roleId':'" + roleId + "'}"
	        var res = reqAjax(USER_URL.RESOURCETREE,paramLft);
	        if(res.code == 1){
	            leftNav(res);
	        }else{
	            layer.msg(res.msg);
	        }
	    };
	   
	
	    //左边展开收起功能
	    $(".navList").on('click','.glyphicon',function(){
	        var classNa = $(this).attr('class');
	        if(classNa == 'glyphicon glyphicon-triangle-top' ){
	            $(this).attr('class','glyphicon glyphicon-triangle-bottom');
	            $(this).parent().next('ul').css('display','none');
	        };
	        if(classNa == 'glyphicon glyphicon-triangle-bottom'){
	            $(this).attr('class','glyphicon glyphicon-triangle-top');
	            $(this).parent().next('ul').css('display','block');
	        };
	        if(classNa == 'glyphicon glyphicon-circle'){
	            $(this).attr('class','glyphicon glyphicon-nocircle');
	            $(this).parent().next('ul').css('display','none');
	        };
	        if(classNa == 'glyphicon glyphicon-nocircle'){
	            $(this).attr('class','glyphicon glyphicon-circle');
	            $(this).parent().next('ul').css('display','block');
	        };
	    });

		//点击变色
		selectColor();
		function selectColor(){
			$("#tbodyParameter").on('click','tr',function(){
				$(this).addClass('acve').siblings().removeClass('acve')
			})
		}
		
		
		//右侧菜单渲染
		showList();
		function showList(){
			var userId = sessionStorage.getItem('userId');
			var parms ="{'userId':'"+userId+"'}";
	   		var res =reqAjax(USER_URL.QUERYMYLIST,parms);
	   		console.log(res)
	   		if(res.code == 1){
	   			var list = res.data.list;
	   			var version = res.data.version.version;
	   			var sHtml = ''
	   			console.log(res)
	   			$.each(list,function(i,item){
		   				if(item.customName == null||item.customName == ''||typeof item.customName === 'undefind'){
	   					item.customName = ''
	   				}
	   				sHtml += `<tr class='drappable-tr'>
                                	<td class="td1 eq-num">`+(i+1)+`</td>
                                	<td class="td2 td">`+item.resource.name+`</td>
                                	<td class="td3 td">`+item.customName+`</td>
                                	<td class="version td-none">`+version+`</td>
                                	<td class="resourceId td-none">`+item.resourceId+`</td>
                                	<td class="id td-none">`+item.id+`</td>
                                	<td class="remove-modifier operation">
                                		<div class="operation-div clearfix">
	                                		<div class="operation-btn blue delete-parameter">
	                                			 删除
	                                		</div>
	                                		<div class="details lightGreen operation-btn rename-parameter">
	                                			重命名
	                                		</div>
                                		</div>
                                	</td>
                                </tr>`
	   				})
	   				$('#tbodyParameter').html(sHtml)
	   				$('#tbodyParameter').attr('data-version',version)
   			}else{
   				layer.msg(res.msg)
   			}
		}
		
         
        
        //重命名
        reName();
        function reName(){
        	$('#common-table').on('click','.rename-parameter',function(){
        		var version = $(this).parent().parent().siblings('.version').html();
        		var id = $(this).parent().parent().siblings('.id').html();
        		$('#reName').modal('show',function(){$('#reNameInput').parent().removeClass('has-error')});
        		$('#reNameInput').attr('maxlength',8)
        		
        		$('#reName').on('click','#saveParemeterconfig',function(){
	        		var customName = $('#reNameInput').val();
	        		if(customName==''){
	        			$('#reNameInput').parent().addClass('has-error')
	        			layer.msg('请输入自定义名~')
	        		}else{
	        				var parms ="{'id':'"+id+"','version':'"+version+"','customName':'"+customName+"'}";
			   				var res =reqAjax(USER_URL.CUSTOMIZEMYMENU,parms);
			        		if(res.code == 1){
					   			  layer.msg('修改成功')
					   			  $('#reName').modal('hide');
					   			  location.reload();
				   			}else{
				   				layer.msg(res.msg)
				   			}
			    		}
	        		})
	        		
        	})  
        }
        
        //删除
        deleName();
        function deleName(){
        	$('#common-table').on('click','.delete-parameter',function(){
        		var version = $(this).parent().parent().siblings('.version').html();
        		var id = $(this).parent().parent().siblings('.id').html();//id
	        	layer.confirm(
	            "确认删除?",
	            {icon: 3, title:'提示'},
	            function(index){
	                var paramDel = "{'id':'" + id + "','version':'" + version + "'}";
	                var res = reqAjax(USER_URL.DELETEMYMENU, paramDel);
	                if (res.code == 1) {
	                	layer.msg(res.msg);
						layer.close(index); //如果设定了yes回调，需进行手工关闭
						location.reload();
	                } else {
	                    layer.msg(res.msg);
	                }
	            })
        	})
        }
		
		//展开按钮
		var flag = true;
		$('#spread').on('click',spread)
		function spread(){
			var oUl = $('.navList');
			var aLi = oUl.children('li');
			if(flag == true){
				$(this).html('收起')
				flag = false;
					$.each(aLi,function(i,item){
						$(item).children().children('span').removeClass('glyphicon-triangle-bottom').addClass('glyphicon-triangle-top');
						$(item).children('ul').show(300)
						if($(item).children('ul').children('li')){
							var childrenLi = $(item).children('ul').children('li');
							$.each(childrenLi,function(i,item){
								$(item).children().children('span').removeClass('glyphicon-triangle-bottom').toggleClass('glyphicon-triangle-top');
								$(item).children('ul').show(300)
							})
						}
					})
			}else{
				$(this).html('展开')
				flag = true;
				$.each(aLi,function(i,item){
						$(item).children().children('span').removeClass('glyphicon-triangle-top').addClass('glyphicon-triangle-bottom');
						$(item).children('ul').hide(300)
						if($(item).children('ul').children('li')){
							var childrenLi = $(item).children('ul').children('li');
							$.each(childrenLi,function(i,item){
								$(item).children().children('span').removeClass('glyphicon-triangle-bottom').toggleClass('glyphicon-triangle-top');
								$(item).children('ul').hide(300)
							})
						}
				})
			}
		}
        
        
        	//权限拖拽api
			$('div.easyui-drappable').draggable({
				proxy:'clone',
				revert:true,
				cursor:'pointer',
				onStartDrag:function(target){
					$(this).draggable('options').cursor='not-allowed';
					$('#drag-notice').addClass('act')
					$("#tbodyParameter").hide();
				},
				onStopDrag:function(){
					var id = $(this).attr('data-id');
					var name = $(this).attr('data-name');
					var oTd = $('td.td2');
					var arr = [];
					$.each(oTd,function(i,item){
						var tdName = $(item).html();
						arr.push(tdName)
					})
					if($.inArray(name,arr)!=-1){
						layer.msg('权限已经存在啦~')
						$('#drag-notice').removeClass('act')
						$("#tbodyParameter").show();
					}else{
						layer.msg('拖动成功~')
						var sHtml = `<tr class='drappable-tr'>
                                	<td class="td1 eq-num">1</td>
                                	<td class="td2 td">`+name+`</td>
                                	<td class="td3 td"></td>
                                	<td class="id td-none">`+id+`</td>
                                	<td class="resourceId td-none">`+id+`</td>
                                	<td class="remove-modifier operation">
                                		<div class="operation-div clearfix">
	                                		<div class="operation-btn blue delete-parameter">
	                                			 删除
	                                		</div>
	                                		<div class="details lightGreen operation-btn rename-parameter">
	                                			重命名
	                                		</div>
                                		</div>
                                	</td>
                                </tr>`
                    	$('#tbodyParameter').append(sHtml);
                    	countNumber();
                    	rightDrag();
						$('#drag-notice').removeClass('act')
						$("#tbodyParameter").show();
                    	
					}
				}
			});
			
			//右侧权限拖拽
			rightDrag();
			function rightDrag(){
				var indicator = $('<div class="indicator" style="display:none">>></div>').appendTo($('#tbodyParameter'));
				$('tr.drappable-tr').draggable({
					revert:true,
					deltaX:0,
					deltaY:0,
					onStopDrag:function(){
						countNumber();
					}
				}).droppable({
					onDrop:function(e,source){
						$(source).insertAfter(this);
					}
				});
			}
			
			
			//重置序号
			function countNumber(){
				var allTr = $('#tbodyParameter>tr')
				var tLen = $('#tbodyParameter>tr').length;
				$.each(allTr,function(i,item){
					$(item).children('.td1').html(i+1)
				})
			}
        
        
        	//保存
        	$('#save').on('click',save);
        	function save(){
        		var arr = [];
        		var oTr = $('tr.drappable-tr')
        		$.each(oTr, function(i,item) {
        			var id = $(item).children('.resourceId').html();
        			var name = $(item).children('.td3').html();
        			var no = $(item).children('.td1').html();
        			arr.push(id+'^')
        			arr.push(name+'^')
        			arr.push(no+'|')
        		});
        		var menuContent = arr.join('');
        		var userId = sessionStorage.getItem('userId');
        		var version = $('#tbodyParameter').attr('data-version');
        		var parms ="{'userId':'"+userId+"','version':'"+version+"','menuContent':'"+menuContent+"'}";
	   			var res =reqAjax(USER_URL.ADDMYMENU,parms);
	   			if(res.code == 1){
	   				location.reload()
	   			}else{
	   				layer.msg(res.msg)
	   			}
        	}
        	
        	
        	
    	
})(jQuery)