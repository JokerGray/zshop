(function($) {
	var page = 1;
	var rows = 10;
	var pid = ""; //父级id
	sessionStorage.removeItem('type');
	const AGENT_URL = {
			COMAGENTREE: 'operations/comagenstructureindex', //(查询代理结构树的接口)
			COMAGESTRU: 'operations/comAgeStructureTree', //(根据父ID查询下面的组织)
			QUERYCOMAGE: 'operations/queryComAgeStructureList', //(通过父ID以及条件查询列表并分页)
			COMADDL:'operations/comAgeStructureAdd',//(新增)
			COMUPDATE:'operations/comAgeStructureUpdate',//
			STRUCTUREDEL:'operations/comAgeStructureDel'//通过ID删除代理结构
	};
	var layer = layui.layer;
	var laypage = layui.laypage;
	layer.config({
		extend: 'myskin/style.css' //同样需要加载新皮肤
	});
	//当前页面获取json属性长度
	function getJsonLength(jsonData) {
		var jsonLength = 0;
		for(var item in jsonData) {
			jsonLength++
		}
		return jsonLength;
	}
	//处理日期
	function doDate(date) {
		var getDate = ''
		var year = date.slice(0, 4) + '年';
		var month = date.slice(5, 7) + '月';
		var day = date.slice(8, 10) + '日&nbsp;';
		var hour = date.slice(11, 13) + '时';
		var minute = date.slice(14, 16) + '分';
		var second = date.slice(17, 29) + '秒'
		getDate += year;
		getDate += month;
		getDate += day
		getDate += hour;
		getDate += minute;
		getDate += second;
		return getDate;
	}
	//验证手机号
	function checkMobile(phone){ 
	   return (/^1[3|4|5|8][0-9]\d{4,8}$/.test(phone))
	} 
	
		
	  	
	//左侧导航方法
	function leftNav(res) {
		var sHtml = "";
		if(res.code == 1) {
			var row = res.data;
			for(var a = 0; a < row.length; a++) {
				var rowA = row[a]
				sHtml += '<li>' +
					'<div class="jurisdiction-nav-li addorz" type-id="'+rowA.type+'" data-id = "' + rowA.id + '"><span class="glyphicon glyphicon-triangle-top"></span><a class="system-orztitle">'+ rowA.name + '</a></div>' +
					'<ul class="jurisdiction-info-nav">'
				for(var i = 0; i < rowA.children.length; i++) {
					var rowB = rowA.children[i];
					sHtml += '<li>' +
						'<div class="jurisdiction-info-nav-li addorz" type-id="'+rowB.type+'" data-id="' + rowB.id + '"><span class="glyphicon glyphicon-triangle-top"></span><a class="system-orztitle">' + rowB.name + '</a></div>' +
						'<ul class="jurisdiction-info-secondnav">'
					for(var j = 0; j < rowB.children.length; j++) {
						var rowC = rowB.children[j];
						sHtml += '<li>' +
							'<div class="jurisdiction-info-thirdnav-li addorz" type-id="'+rowC.type+'" data-id="' + rowC.id + '"><span class="glyphicon glyphicon-circle"></span><a class="system-orztitle">' + rowC.name + '</a></div>' +
							'<ul class="jurisdiction-info-thirdnav">'
						for(var k = 0; k < rowC.children.length; k++) {
							var rowD = rowC.children[k];
							sHtml += '<li type-id="'+rowD.type+'" data-id="' + rowD.type + '"><span class="glyphicon glyphicon-circle"></span>' + rowD.name + '</li>';
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
	function getNav() {
		var res = reqAjax(AGENT_URL.COMAGENTREE);
		if(res.code == 1) {
			leftNav(res);
		} else {
			layer.msg(res.msg);
		}
	};
	getNav();

	//左边展开收起功能
	$(".navList").on('click', '.glyphicon', function() {
		var classNa = $(this).attr('class');
		if(classNa == 'glyphicon glyphicon-triangle-top') {
			$(this).attr('class', 'glyphicon glyphicon-triangle-bottom');
			$(this).parent().next('ul').css('display', 'block');
		};
		if(classNa == 'glyphicon glyphicon-triangle-bottom') {
			$(this).attr('class', 'glyphicon glyphicon-triangle-top');
			$(this).parent().next('ul').css('display', 'none');
		};
		if(classNa == 'glyphicon glyphicon-circle') {
			$(this).attr('class', 'glyphicon glyphicon-nocircle');
			$(this).parent().next('ul').css('display', 'block');
		};
		if(classNa == 'glyphicon glyphicon-nocircle') {
			$(this).attr('class', 'glyphicon glyphicon-circle');
			$(this).parent().next('ul').css('display', 'none');
		};
	});

	//点击左侧导航树添加
	$(".navList").on('click', '.system-orztitle', function() {
		var pid = $(this).parent().attr('data-id');
		var type = $(this).parent().attr('type-id');
		$(".navList .addorz").removeClass("acve");
		$(this).parent().addClass("acve");
		getSystem();
		sessionStorage.setItem('padpid', pid);
		sessionStorage.setItem('typeid',type)
	});

	var pod = sessionStorage.getItem("padpid");
	var $dd = $(".navList li .addorz");
	$dd.each(function(i, item) {
		item = $(item);
		item.removeClass("acve");
		var href = item.attr("data-id");
		if(pod != null) {
			if(pod==href) {
				item.addClass("acve");
				item.parent().parent().css('display', 'block')
			}
		}
	})

	//点击查询按钮

	//查询方法
	function getSystem() {
		var layer = layui.layer;
		var laypage = layui.laypage;
		var $dd = $(".navList li .addorz");
		var val = $("#jurisdiction-name").val(); //获取组织名称
		var pid = $(".navList .addorz.acve").attr("data-id"); //pid
		var phone = $('#jurisdiction-phone').val(); //获取手机号
		var feedbacktType = '';
		if($('#feedbacktType').val() == '--全部--') {
			feedbacktType = -1
		} else if($('#feedbacktType').val() == '组织') {
			feedbacktType = 1
		} else if($('#feedbacktType').val() == '系统用户') {
			feedbacktType = 2
		} else if($('#feedbacktType').val() == '商户代理人') {
			feedbacktType = 3
		} else if($('#feedbacktType').val() == '商户用户') {
			feedbacktType = 4
		}
		if(pid == undefined || pid == '' || pid === 'null' || pid === null) {
			var paramDetail = "{'page':" + page + ",'rows':" + rows + ",'phone':'" + phone + "','type':'" + feedbacktType + "','name':'" + val + "'}" //查询权限列表
		} else {
			var paramDetail = "{'page':" + page + ",'rows':" + rows + ",'pid':" + pid + ",'phone':'" + phone + "','type':'" + feedbacktType + "','name':'" + val + "'}"; //查询权限列表
		}
		var res = reqAjax(AGENT_URL.QUERYCOMAGE, paramDetail);

		//模拟渲染
		var render = function(data, curr) {
			var arr = [],
				thisData = res;
			layui.each(thisData, function(index, item) {
				arr.push('<li>' + item + '</li>');
			});
			return arr.join('');
		};

		var sHtml = '';

		//调用分页
		laypage({
			cont: 'paging-box', 
			first: false,
			last: false,
			prev: '<' //若不显示，设置false即可
				,
			next: '>',
			pages: Math.ceil(res.total / rows) //得到总页数
				,
			curr: function() { //通过url获取当前页，也可以同上（pages）方式获取
				var page = location.search.match(/page=(\d+)/);
				return page ? page[1] : 1;
			}(),
			jump: function(obj, first) {
					if(pid == undefined || pid == '' || pid === 'null' || pid === null) {
						var paramDetail = "{'page':" + obj.curr + ",'rows':" + rows + ",'phone':'" + phone + "','type':'" + feedbacktType + "','name':'" + val + "'}" //查询权限列表
					} else {
						var paramDetail = "{'page':" + obj.curr + ",'rows':" + rows + ",'pid':" + pid + ",'phone':'" + phone + "','type':'" + feedbacktType + "','name':'" + val + "'}"; //查询权限列表
					}
					var jumpres = reqAjax(AGENT_URL.QUERYCOMAGE, paramDetail);
					if(jumpres.code == 1){
						for(var i = 0; i < jumpres.data.length; i++) {
							var row = jumpres.data[i];
							sHtml += '<tr class="system-tr" data-type="' + row.type + '" data-pid="' + row.pid + '" data-id= "' + row.id + '">' +
								'<td>' + (i + 1) + '</td>' +
								'<td>' + row.name + '</td>'
							if(!row.phone) {
								sHtml += '<td>' + '' + '</td>'
							} else {
								sHtml += '<td>' + row.phone + '</td>'
							}
							if(row.type == 1) {
								sHtml += '<td>' + '组织' + '</td>';
							} else if(row.type == 2) {
								sHtml += '<td>' + '系统用户' + '</td>';
							} else if(row.type == 3) {
								sHtml += '<td>' + '商户代理人' + '</td>';
							} else if(row.type == 4) {
								sHtml += '<td>' + '商户用户' + '</td>';
							}
							sHtml += '<td>' + doDate(row.createDate) + '</td>' +
								'<td class="row remove-modifier" width="12%">' +
								'<a class="changeBtn" style="width:50%"><i class="glyphicon glyphicon-pencil m5 green"></i><i class="ichange">修改</i></a>'+
								'<a class="deleteBtn" style="width:50%"><i class="glyphicon glyphicon-minus-sign m5 red"></i><i class="idelete">删除</i></a>'+
							'</td>'+
							'</tr>';
							$("#system-table tbody").html(sHtml);
							document.getElementById('paging-box-count').innerHTML = render(res.data, obj.curr);
							$('#paging-box-count').html('共' + obj.pages + '页，每页' + rows + '条,总数'+res.total+'条');
							if(!first) { //一定要加此判断，否则初始时会无限刷新
								location.href = '?page=' + obj.curr;
							}
						}
						
					}else{
						layer.msg(jumpres)
					}
					
				
			}
		});
	}
	getSystem();
	$("#searchBtn").click(function() {
		$("#system-table tbody").html("");
		getSystem();
	});
	  
	  //保存方法
	  function sub(type,pid) {//type 为3则添加保存，2为修改保存
	  	var pid = $(".navList .addorz.acve").attr("data-id"); //pid
	  	var typeid = sessionStorage.getItem('typeid')
	  	var state = sessionStorage.getItem('state')
	    var formData = layer.getChildFrame('body');
	    var selectType = sessionStorage.getItem('type')
	    var dataType =  sessionStorage.getItem('dataType')
	    var padpid = sessionStorage.getItem('padpid')
	    var dataType = sessionStorage.getItem('dataType')
	    var allForm = formData.contents().find("form");
	    var changeId = sessionStorage.getItem('changeId')
	    var giveRoleId = sessionStorage.getItem('giveRoleId');
	      if (type == 2) {
	          if(dataType == 1){
	          		name = allForm.eq(0).find("#systemName").val()			
	          }else if(dataType == 2){
	          		name = allForm.eq(1).find("#systemName").val()
	          }else if(dataType == 3){
	          		name = allForm.eq(2).find("#systemName").val()
	          }else if(dataType == 4){
	          		name = allForm.eq(3).find("#systemName").val()
	          }
	         
        	var paramUpdate = "{'id':'" + changeId + "','type':'" + dataType + "','name':'" + name + "','pid':'" + padpid + "'}"
	        if (name != '') {
	              var res = reqAjax(AGENT_URL.COMUPDATE, paramUpdate);
	              if (res.code == 1) {
	                  layer.msg("修改成功");
	                  location.reload();
	                  var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
	                  parent.layer.close(index);
	              }
	              else {
	                  layer.msg(res.msg);
	              }
	          } else {
	              layer.msg("请输入名称");
	          }
	      };
	      if (type == 3) {
	      	  if(selectType == 1){
	      	  		var systemName = formData.find('form').eq(0).find('#systemName').val();
			        var sysPhone = formData.find('form').eq(0).find('#systemPhone').val();
	      	  		if(pid == undefined || pid == '' || pid=== 'null' || pid=== null){
			              var paramInfod = "{'name':'" + systemName + "','type':'" + selectType + "','pid':0}";
			          }else{
		            	if(state==1){
		            		var paramInfod = "{'name':'" + systemName + "','type':'" + selectType + "','pid':" + padpid + "}";
		            	}else if(state==2){
		            		var paramInfod = "{'name':'" + systemName + "','type':'" + selectType + "','pid':" + padpid + ",'phone':"+sysPhone+"}";
		            	}
		            }
			        if(state == 1){
			         	if(systemName == ''){
				        	layer.msg("请输入名称")
			        	}else{
			        		var res = reqAjax(AGENT_URL.COMADDL, paramInfod);
				              if (res.code == 1) {
				                  layer.msg("保存成功");
				                  location.reload();
				                  var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
				                  parent.layer.close(index);
				              } else {
				                  layer.msg(res.msg);
				              }
			        	}
			        }else{
			        	if(systemName == ''){
				        	layer.msg("请输入名称")
				        }else if(sysPhone == ''){
				        	layer.msg("请输入手机号")
				        }else if(!checkMobile(sysPhone)){
				        	layer.msg("手机号格式不正确")
				        }else{
				        	var res = reqAjax(AGENT_URL.COMADDL, paramInfod);
				              if (res.code == 1) {
				                  layer.msg("保存成功");
				                  location.reload();
				                  var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
				                  parent.layer.close(index);
				              } else {
				                  layer.msg(res.msg);
				              }
				        }
			        }
	      	  }else if(selectType ==2){
	      	  	var systemName = formData.find('form').eq(0).find('#systemName').val();
			        var sysPhone = formData.find('form').eq(0).find('#systemPhone').val();
		      	  	if(pid == undefined || pid == '' || pid=== 'null' || pid=== null){
				            var paramInfod = "{'name':'" + systemName + "','type':'" + selectType + "'}";
				    }else{
			            	var paramInfod = "{'name':'" + systemName + "','type':'" + selectType + "','pid':'" + padpid + "','phone':"+sysPhone+"}";	
			        }
		      	  	if(systemName == ''){
			        	layer.msg("请输入名称")
				    }else if(sysPhone == ''){
				    	layer.msg("请输入手机号")
				    }else if(!checkMobile(sysPhone)){
				        	layer.msg("手机号格式不正确")
					}else{
				    	var res = reqAjax(AGENT_URL.COMADDL, paramInfod);
					              if (res.code == 1) {
					                  layer.msg("保存成功");
					                  location.reload();
					                  var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
					                  parent.layer.close(index);
					              } else {
					                  layer.msg(res.msg);
					    }
				     }
	      	  }else if(selectType ==4){
	      	  		var systemName = formData.find('form').eq(1).find('#systemName').val();
			        var sysPhone = formData.find('form').eq(1).find('#systemPhone').val();
		      	  	if(pid == undefined || pid == '' || pid=== 'null' || pid=== null){
				            var paramInfod = "{'name':'" + systemName + "','type':'" + selectType + "'}";
				    }else{
			            	var paramInfod = "{'name':'" + systemName + "','type':'" + selectType + "','pid':'" + padpid + "','phone':"+sysPhone+"}";	
			        }
		      	  	if(systemName == ''){
			        	layer.msg("请输入名称")
				    }else if(sysPhone == ''){
				    	layer.msg("请输入手机号")
				    }else if(!checkMobile(sysPhone)){
				        	layer.msg("手机号格式不正确")
					}else{
				    	var res = reqAjax(AGENT_URL.COMADDL, paramInfod);
					              if (res.code == 1) {
					                  layer.msg("保存成功");
					                  location.reload();
					                  var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
					                  parent.layer.close(index);
					              } else {
					                  layer.msg(res.msg);
					    }
				     }
	      	  }else if(selectType == 3){
	      	  	var systemName = formData.find('form').eq(1).find('#systemName').val();
		        var sysPhone = formData.find('form').eq(1).find('#systemPhone').val();
	      	  	if(pid == undefined || pid == '' || pid=== 'null' || pid=== null){
			            var paramInfod = "{'name':'" + systemName + "','type':'" + selectType + "'}";
			    }else{
		            	var paramInfod = "{'name':'" + systemName + "','type':'" + selectType + "','pid':'" + padpid + "','roleid':'"+giveRoleId+"','phone':"+sysPhone+"}";	
		       }
	      	  	if(systemName == ''){
		        	layer.msg("请输入名称")
			    }else if(sysPhone == ''){
			    	layer.msg("请输入手机号")
			    }else if(!checkMobile(sysPhone)){
			        	layer.msg("手机号格式不正确")
				}else{
			    	var res = reqAjax(AGENT_URL.COMADDL, paramInfod);
				              if (res.code == 1) {
				                  layer.msg("保存成功");
				                  location.reload();
				                  var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
				                  parent.layer.close(index);
				              } else {
				                  layer.msg(res.msg);
				    }
			     }
	      	 }
	          
	     }
	  }
	  
	   //修改
	 $("#system-table").on("click", ".changeBtn", function () {
	      var changeId = $(this).parents(".system-tr").attr("data-id");
	      var pid = $(this).parents(".system-tr").attr("data-pid");
	      var dataType = $(this).parents(".system-tr").attr("data-type");
	      var name = $(this).parent().siblings().eq(1).html();
	      var phone = $(this).parent().siblings().eq(2).html()
	      sessionStorage.setItem('dataType',dataType)
	      sessionStorage.setItem('changeId',changeId)
	      layer.open({
	          type: 2,
	          title: ['修改', 'background:#303030;color:#fff;'],
	          skin: 'layer-ext-myskin',
	          area: ['1024px', '768px'],
	          shade: 0.5,
	          closeBtn: 1,
	          shadeClose: false,
	          content: 'changeagent_construction.html',
	          btn: ['保存'],
	          btnAlign: 'c',
	          success:function(layero, index){
	          	var body = layer.getChildFrame('body', index);
	          	var allForm = body.contents().find("form");
	          	body.contents().find("form").hide();
	          	if(dataType == 1){
	          		allForm.eq(0).find("#systemName").val(name)
	          	}else if(dataType == 2){
	          		allForm.eq(1).find("#systemName").val(name)
	          		allForm.eq(1).find("#systemPhone").val(phone)
	          	}else if(dataType == 3){
	          		allForm.eq(2).find("#systemName").val(name)
	          		allForm.eq(2).find("#systemPhone").val(phone)
	          	}else if(dataType == 4){
	          		allForm.eq(3).find("#systemName").val(name)
	          		allForm.eq(3).find("#systemPhone").val(phone)
	          	}
	          	allForm.eq(dataType-1).css('display','block');	          	
	         },
	          yes: function () {
	              sub(2,pid);
	          }
	      });
	  });
	  
	  
	  //删除
	  $("#system-table").on("click", ".deleteBtn", function () {
	  	 var delId = $(this).parents(".system-tr").attr("data-id");
	  	 var a = $(this)
        layer.confirm(
            "确认删除?",
            {icon: 3, title:'提示'},
            function(index){
                var paramDel = "{'id':'" + delId + "'}";
                var res = reqAjax(AGENT_URL.STRUCTUREDEL, paramDel);
                if (res.code == 1) {
                    a.parent().parent().remove();
                    layer.close(index);
                } else {
                    layer.msg(res.msg);
                }
            })
	  	
	  	
	  });
	  //点击新增系统组织弹窗
	  $(".add-users").click(function () {
	      var index = $(".navList .addorz.acve").index();
	      var pid = $(".navList .addorz.acve").attr("data-id")  ;
	          layer.open({
	              type: 2,
	              title: ['新增', 'background:#303030;color:#fff;'],
	              skin: 'layer-ext-myskin',
	              area: ['1024px', '768px'],
	              shade: 0.5,
	              closeBtn: 1,
	              shadeClose: false,
	              content: 'addagent_construction.html',
	              btn: ['保存'],
	              btnAlign: 'c',
	              yes: function () {
	                  sub(3,pid);
	              }
	          });
	
	  });
	
	  $(".system-nav h4").click(function(){
	      $(".navList .addorz").removeClass("acve");
	      sessionStorage.removeItem('padpid');
	      getSystem();
	  });
})(jQuery);