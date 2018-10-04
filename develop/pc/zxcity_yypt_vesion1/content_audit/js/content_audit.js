(function($) {
	const  SYSTEMLIST = 'operations/reviewList' //查询


	var layer = layui.layer;
	var table = layui.table;
	layui.use('form', function() {
		form = layui.form;
	})

	//搜索
	$('#toolSearch').on('click', function() {
		init_obj();
	})
	//重置功能
	$('#toolRelize').on('click', function() {
		$("#inquireInput").val('');
		$("#isTipoff").val('');
		init_obj();
	})

	function init_obj() {
		var _obj = tableInit('demo', [
				[{
					title: '序号',
					sort: true,
					align: 'left',
					field: 'eq',
					width: 80
				}, {
					title: '审核类型',
					sort: true,
					align: 'left',
					field: '_type',
					width: 100
				}, {
					title: '标题',
					sort: true,
					align: 'left',
					field: 'publisherTitle',
					width: 200
				}, {
					title: '审核对象',
					sort: true,
					align: 'left',
					field: 'tableName',
					width: 200
				}, {
					title: '举报状态',
					sort: true,
					align: 'left',
					field: '_isTipoff',
					width: 100
				}, {
					title: '平台ID',
					sort: true,
					align: 'left',
					field: 'userId',
					width: 100
				}, {
					title: '审核人',
					sort: true,
					align: 'left',
					field: 'operatorName',
					width: 100
				}, {
					title: '审核时间',
					sort: true,
					align: 'left',
					field: 'createTime',
					width: 200
				}, {
					title: '操作',
					align: 'left',
					toolbar: '#barDemo',
					width: 300
				}]
			],
			pageCallback
		)
	}

	initForAct();

	function initForAct(replystatus) {
		init_obj();
	}

	//TAB切换
	$('.search-li').on('click', function() {
		$(this).addClass('act').siblings().removeClass('act');
		initForAct();
	})

	//pageCallback回调
	function pageCallback(index, limit, publisherTitle, isTipoff, status) {
		var aLi = $('.search-li.act')
		var status = $(aLi).attr('data-status');
		var publisherTitle = $('#inquireInput').val();
		var isTipoff = $('#isTipoff').val();
		if(status == undefined) {
			status = ''
		}
		if(publisherTitle == undefined) {
			publisherTitle = ''
		}
		if(isTipoff == undefined) {
			isTipoff = ''
		}
		return getData(SYSTEMLIST, "{'page':" + index + ",'rows':" + limit + ",'publisherTitle':'" + publisherTitle + "','isTipoff':'" + isTipoff + "','status':'" + status + "'}");
	}
table.on('tool(demo)', function(obj) {
		var data = obj.data;
		//查看
		if(obj.event === 'detail') {
			layer.open({
				title: ['详情', 'font-size:12px;background-color:#0678CE;color:#fff'],
				type: 1,
				content: $('#demo111'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
				area: ['800px', '560px'],
				end: function() {
					$('#demo111').hide();
					$('#problemsSuggestion').val('').attr('disabled',false)
					$('#replyStatus').val('').attr('disabled',false)
					$('#reply').val('').attr('disabled',false)
					$('#layImg').attr('url','');
					$("div.holder").show();
				},
				success: function(layero, index) {
					$("div.holder").hide();
					$('#problemsSuggestion').val(data.problemsSuggestion).attr('disabled','')
					$('#reply').attr('disabled','')
					if(data.replyStatus==null){
						data.replyStatus=0;
					}
					$('#replyStatus').val(data.replyStatus).attr('disabled','')
					$('#layImg').attr('url',data.problemsImgurl);
					form.render()
				},
				yes: function(index, layero) {

				}
			});
			//删除
		} else if(obj.event === 'del') {
			var id = data.id;
			layer.confirm('真的删除行么', function(index) {
				var d3 = {
					"id": id
				};
				d3 = JSON.stringify(d3);
				var res = reqAjax(DELETEREPLY, d3);
				if(res.code == 1) {
					obj.del();
				}
				layer.close(index);
				init_obj();
				layer.msg(res.msg);
			});
		} else if(obj.event === 'change') {
			layer.open({
				title: ['修改', 'font-size:12px;background-color:#0678CE;color:#fff'],
				type: 1,
				btn: ['保存', '取消'],
				content: $('#demo111'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
				area: ['800px', '560px'],
				end: function() {
					$('#demo111').hide();
					$('#reply').val('');
					$('#replyStatus').val('');

				},
				success: function(layero, index) {
					$('#problemsSuggestion').val(data.problemsSuggestion).attr('disabled','')
					$('#replyStatus').val(data.replyStatus);
					$('div.layui-layer-page').addClass('layui-form')
					$('a.layui-layer-btn0').attr('lay-submit', '');
					$('a.layui-layer-btn0').attr('lay-filter', 'formDemo');
					form.render()
				},
				yes: function(index, layero) {
					form.on('submit(formDemo)', function(done) {
						if(done) {
							console.log(data)
							var questionId = data.id;
							var userId = yyCache.get('userno');
							var userName = yyCache.get('username');
							var reply =  $('#reply').val();
							var replyStatus = $('#replyStatus').val();
							var e2 = {
								questionId: Number(questionId),
								reply: reply,
								replyStatus: Number(replyStatus),
								userId: Number(userId),
								userName: userName
							}
							e2 = JSON.stringify(e2);
							var res = reqAjax(ADDREPLY, e2);
							if(res.code == 1) {
								layer.msg(res.msg);
								layer.close(index)
								init_obj();
							} else {
								layer.msg(res.msg);
							}
						}
					})

				}
			});
		}
	});

	//数据处理
	function addEq(data) {
		$.each(data, function(i, item) {
			$(item).attr('eq', (i + 1))
		});
		return data;
	}

	//展开按钮
	var flag = true;
	$('#spread').on('click', spread)

	function spread() {
		var oUl = $('.navList');
		var aLi = oUl.children('li');
		if(flag == true) {
			$(this).html('<i class="layui-icon">&#xe630;</i>收起')
			flag = false;
			treeObj.expandAll(true);

		} else {
			$(this).html('<i class="layui-icon">&#xe630;</i>展开')
			flag = true;
			treeObj.expandAll(false);
		}
	}

	$('#search').on('click', function() {
		$('#search-tool').slideToggle(200)
	})
	
	//板块设置
	$('#setting').on('click',function(){
		layer.open({
				title: ['板块设置', 'font-size:12px;background-color:#0678CE;color:#fff'],
				type: 1,
				btn:['保存','取消'],
				content: $('#demo222'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
				area: ['800px', '560px'],
				end: function() {
					$('#demo222').hide();
				},
				success: function(layero, index) {
					$('div.layui-layer-page').addClass('layui-form')
					$('a.layui-layer-btn0').attr('lay-submit', '');
					$('a.layui-layer-btn0').attr('lay-filter', 'formDemo');
					form.render()
					
					var data ={};
			        var res =reqAjax("operations/reviewindex",JSON.stringify(data));
			        var data = res.data;
			        console.log(data);
			        var str;
			        for(var i=0;i<data.length;i++){
			            str+="<tr>" +
			                "<td style='display:none;'>"+data[i].id+"</td>" +
			                "<td>"+data[i].plateDesc+"</td>" +
			                "<td>"+data[i].tableName+"</td>" +
			                "<td><select name='' data-sel="+data[i].reviewStatus+" class='tdNum'><option value='0'>发布即审核</option><option value='1'>审核后发布</option></select></td>" +
			                "<td><button class='delBut layui-btn layui-btn-small layui-btn-danger'> <i class='layui-icon'></i> 删除 </button></td>" +
			                "</tr>"
			                $("#board").html(str);
			        }
			        var  sel =$("#board tr td select[data-sel]");
			        for(var i=0;i<sel.length;i++){
			            if(sel.eq(i).attr("data-sel")==0){
			                sel.eq(i).val("0")
			            }else{
			                sel.eq(i).val("1");
			            }
			        }
			        $("#board").on("click","tr td .delBut",function () {
			            var $this =$(this);
			            layer.confirm("确认删除？",{icon:3,title:"提示"}, function () {
			                $this.parent().parent().remove();
			                layer.closeAll('dialog');
			            })
			        })
				},
				yes: function(index, layero) {
					var trs=$("#board tr")
		            var datas =[];
		            for(var i=0;i<trs.length;i++){
		                var tds=trs.eq(i).children();
		                var id=tds.eq(0).html();
		                var tableName=tds.eq(2);
		                if(tableName.find("input").length==0){
		                    tableName=tableName.html();
		                }else{
		                    tableName=tableName.find("input").val();
		                }
		                var plateDesc=tds.eq(1);
		                if(plateDesc.find("input").length==0){
		                    plateDesc=plateDesc.html();
		                }else{
		                    plateDesc=plateDesc.find("input").val();
		                }
		                var reviewStatus=tds.eq(3).children().val();
		                if(tds.eq(1).children('input').val()!='' && tds.eq(2).children('input').val()!=''){
		                    var da={
		                        id:id,      //主键id
		                        tableName:tableName, //板块对应的表名
		                        plateDesc:plateDesc, //板块描述
		                        reviewStatus:reviewStatus //审核状态 0-发布即审核 1-发布后审核
		                    }
		                    datas.push(da);
		                }
		
		            }
		            var trs=$("#board tr")
		            var tr0 = trs.eq(0)
		            console.log($(tr0).find('td').eq(2).children('input').val())
		 			if($(tr0).find('td').eq(1).children('input').val()==''){
		 				layer.msg('版块名称不能为空~')
		 			}else if($(tr0).find('td').eq(2).children('input').val()==''){
		 				layer.msg('版块表名不能为空~')
		 			}else{
		 				var data ={data:datas};
			            var aa =reqAjax("operations/plateset",JSON.stringify(data));
			            layer.close(index);
						init_obj();
		 			}
				}
			});
	})
	
	 $("#addNew").on("click", function () {
            var a="<tr>" +
                "<td style='display:none;'>0</td>" +
                "<td><input type='text'/></td>" +
                "<td><input type='text'/></td>" +
                "<td><select name='' style='display:block;height:25px'><option value='0'>发布即审核</option><option value='1'>发布后审核</option></select></td>" +
                "<td><button class='delBut layui-btn layui-btn-small layui-btn-danger'> <i class='layui-icon'></i> 删除 </button></td>" +
                "</tr>"
            $("#board").prepend(a);
        })
	 
	 
	 //用户封号
	$('#ban').on('click',function(){
		var userId = sessionStorage.getItem('_userId');
		if(userId){
			var data ={
            userId:userId
        	}
	        layer.confirm("确认封号？",{icon:0,title:"提示"}, function () {
	            var a =reqAjax("operations/kick",JSON.stringify(data));
	            if(a.code==9){
	                layer.msg(a.msg,{time:1000});
	            }else{
	                layer.msg(a.msg,{time:1000});
					init_obj();
	                
	            }
	
	        })
		}else{
            layer.msg("请选择用户进行封号",{time:1000});
		}
	})



	//点击变色
	$('#tableBox').on('click', 'tbody tr', function() {
		$(this).addClass('layui-table-click').siblings().removeClass('layui-table-click');
		var userId = $(this).children('td').eq(5).children().html();
		sessionStorage.setItem('_userId',userId);
	})

	//刷新
	function refresh() {
		location.reload();
	}
	$('#refresh').click(function() {
		refresh()
	});

	function tableInit(tableId, cols, pageCallback, test) {
		var tableIns, tablePage;
		//1.表格配置
		tableIns = table.render({
			id: tableId,
			elem: '#' + tableId,
			height: 'full-220',
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
			elem: 'laypageLeft',
			count: res ? res.total : 0,
			layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
			limits: [15, 50, 100, 300, 800, 1000],
			limit: 15
		}
		page_options.jump = function(obj, first) {
			tablePage = obj;

			//首次不执行
			if(!first) {
				var resTwo = pageCallback(obj.curr, obj.limit);
				if(resTwo && resTwo.code == 1)
					tableIns.reload({
						data: resTwo.data
					});
				else
					layer.msg(resTwo.msg);
			}
		}

		layui.laypage.render(page_options);

		return {
			tablePage,
			tableIns
		};
	}

	//数据处理
	function getData(url, parms) {

		var res = reqAjax(url, parms);

		var data = res.data;
		var _type, _isTipoff;
		$.each(data, function(i, item) {
			$(item).attr('eq', (i + 1));
			if(item.type == 1) {
				_type = '文字'
			} else if(item.type == 1) {
				_type = '图片'
			} else {
				_type = '视频'
			}
			if(item.isTipoff == 1) {
				_isTipoff = '举报'
			} else {
				_isTipoff = '正常'
			}
			$(item).attr('_type', _type)
			$(item).attr('_isTipoff', _isTipoff)
		});

		return res;
	}

})(jQuery)