layui.use(['form', 'layer', 'jquery', 'laydate', 'table', 'laypage'], function() {
	var form = layui.form,
		layer = layui.layer,
		$ = layui.jquery,
		laydate = layui.laydate,
		table = layui.table,
		laypage = layui.laypage,
		userno = sessionStorage.getItem('userno') || ""
	//接口
    var USER_URL = {
        RESOURLIST : 'operations/getMerchantTradePageByData', //(查询列表)
        DELETELIST : 'operations/deleteMerchantTradeDict', //(删除)
        ADDLIST : 'operations/addMerchantTradeDict', //(添加)
        UPDATELIST : 'operations/updateMerchantTradeDict', //(修改)
    };

	//搜索
	$('#searchBtn').on('click', function() {
		tableInit();
	})
	//重置
	$('#resetBtn').on('click', function() {
		$('.tool-box-ul').find('input,select').val('');
        tableInit();
		// location.reload();
	})


	//layer展开
	$('body').on('click', '.layui-layer .layui-layer-content .package-some', function() {
		if($(this).children('i.description').html() == '展开') {
			$(this).children('i.description').html('收起')
			$(this).children('i.icon').addClass('deg');
			$(this).parent().siblings('.app-layer-content').children('ul').hide();
			$(this).parent().siblings('.app-layer-content').children('.layer-place').show();
		} else {
			$(this).children('i.description').html('展开')
			$(this).children('i.icon').removeClass('deg');
			$(this).parent().siblings('.app-layer-content').children('ul').show();
			$(this).parent().siblings('.app-layer-content').children('.layer-place').hide();
		}
	})
	$('body').on('click', '.layui-layer .layui-layer-content .layer-place', function() {
		$(this).hide();
		$(this).siblings('ul').show();
		$(this).parent().siblings().children('.package-some').children('.description').html('展开');
		$(this).parent().siblings().children('.package-some').children('.icon').removeClass('deg');
	})
	
	
	//表格操作
	table.on('tool(merchantTable)', function(obj) {
		var data = obj.data;
		var oldId=data.id;
		//查看
		if(obj.event === 'change') {
				layer.open({
				title: ['修改', 'font-size:12px;background-color:#424651;color:#fff'],
				btn: ['确定','取消'],
				type: 1,
				anim: 5,
				content: $('#changeDemo'),
				area: ['1400px', '700px'],
				end: function() {
					$('#changeDemo').hide();
				},
				success: function(index,layero) {
		        	//给保存按钮添加form属性
					$("div.layui-layer-page").addClass("layui-form");
					$("a.layui-layer-btn0").attr("lay-submit","");
					$("a.layui-layer-btn0").attr("lay-filter","formDemo");
		            var name = data.name;//行业
		            var showname = data.showname;//显示名
		            var value = data.value; //取值
		            var parth=data.iconPath//图标地址
		            $('#tradeName1').val(name);
		            $('#showName1').val(showname);
		            $('#value').val(value);
		            var http = "http";
		            if(parth.indexOf(http) == -1){
		            	parth = 'img/upload.png'
		            }
		            $("#uploadImg1").attr('src',parth);
		            $('#value').attr('disabled','true');
		            form.render();
				},
				yes: function(index,layero) {
					form.on('submit(formDemo)', function(done) {
		        		if(done){
		        			var id = data.id;
			        		var name = $('#tradeName1').val();
			        		var showname = $('#showName1').val();
			        		var value = $('#value').val(); 
			        		var iconPath=$('#uploadImg1').attr('src')
		
			        		var parm = {
			        			'id':id,
			        			'name':name,
			        			'showname':showname,
			        			'value':value,
			        			'iconPath':iconPath
			        		}
			        		
			        		parm = JSON.stringify(parm);      		
			        		reqAjaxAsync(USER_URL.UPDATELIST,parm).done(function(res){
				        		if(res.code == 1){
				        			layer.msg('修改成功')
				        			layer.close(index)
				        			tableInit();
				        		}else{
				        			layer.msg(res.msg);	        			
				        		};	        			
			        		});
		        		}
	        	})
	        		
				}
			});
		}else if(obj.event==='del'){
            //删除
            layer.confirm("确认删除？",{icon:0,title:"提示"}, function (index) {
                var parms = {
                    id:oldId
                };
                reqAjaxAsync(USER_URL.DELETELIST,JSON.stringify(parms)).done(function(res) {
                    if (res.code == 1) {
                        layer.close(index);
                        layer.msg("已删除");
                        tableInit();
                    }else {
                        layer.msg(res.msg);
                    };
                });
            })
		};
	});
	
	//添加

	 $('#addButton').on('click',function(){
		layer.open({
				title: ['添加', 'font-size:12px;background-color:#424651;color:#fff'],
				btn: ['确定','取消'],
				type: 1,
				anim: 5,
				content: $('#addDemo'),
				area: ['1400px', '700px'],
				end: function() {
					$('#addDemo').hide();
				},
			success:function(layero,index){
				$('#tradeName').val("");
				$('#showName').val("");
				$('#value1').val("");
				$('#uploadImg2').attr('src','img/upload.png');
				//给保存按钮添加form属性
				$("div.layui-layer-page").addClass("layui-form");
				$("a.layui-layer-btn0").attr("lay-submit","");
				$("a.layui-layer-btn0").attr("lay-filter","formDemo");
				form.render();
			},
		  yes:function(index, layero){
			  //form监听事件
			  form.on('submit(formDemo)',function(data){
				  if(data){
					  var name = $('#tradeName').val();
					  var showname = $('#showName').val();
					  var value= $('#value1').val();
				
					var path=$('#uploadImg2').attr('src');
					  var param ={
						  name : name,
						  showname : showname,
						  value:value,
						  iconPath:path
					  };
					reqAjaxAsync(USER_URL.ADDLIST,JSON.stringify(param)).done(function(res){
							  if(res.code == 1){						  	
								  layer.close(index);
								  layer.msg("添加成功");
								 tableInit();
							  }else{
								  layer.msg(res.msg);
							  }
						  });
					   
				  }
			  });
			
		  }
		});
	 })
		 



	//pageCallback
	function pageCallback(index, limit, callback) {
		var parms = {
			rows: limit,
			page: index,
			name:$.trim($('#name').val()) || "",
			showname:$.trim($('#indication').val()) || ""

		};
		reqAjaxAsync(USER_URL.RESOURLIST, JSON.stringify(parms)).then(function(res) {
			if(res.code != 1) {
				return layer.msg(res.msg);
			}
			var data = res.data;
			$.each(data, function(i, item) {
				$(item).attr('eq', (i + 1));

			});
			return callback(res);
		})
	}

	//当前表格渲染
	function tableInit() {
		var _obj = _tableInit('merchantTable',[
				[{
						title: '序号',
						align: 'left',
						field: 'eq'
					}, {
						title: '行业',
						align: 'left',
						field: 'name'
					}, {
						title: '显示名',
						align: 'left',
						field: 'showname'
					},
					{
						title: '取值',
						align: 'left',
						field: 'value'
					},{
						title: '操作',
						fixed: 'right',
						align: 'left',
						toolbar: '#barDemo'
					}
				]
			],
			pageCallback, 'layTablePage'
		)
	}
	tableInit();

	//表格方法
	/* 表格初始化
	 * tableId: 表格容器ID
	 * cols:table配置
	 * pageCallback回调(异步)
	 * pageDomName:分页容器ID
	 */
	function _tableInit(tableId, cols, pageCallback, pageDomName) {
		var tableIns, tablePage;
		//1.表格配置
		tableIns = table.render({
			id: tableId,
			elem: '#' + tableId,
			height: 'full-250',
			cols: cols,
			page: false,
			even: true,
			limit: 15,
			cellMinWidth:80,
			done: function(res, curr, count) {
				// do something
				$('body').on('click', '.layui-table-body table tr', function() {
					$(this).addClass('layui-table-click').siblings().removeClass('layui-table-click')
				})
			}
		});

		//2.第一次加载
		pageCallback(1, 15, function(res) {
			tableIns.reload({
				data: res.data
			})
			//第一页，一页显示15条数据
			layui.use('laypage');
			var page_options = {
				elem: pageDomName,
				count: res ? res.total : 0,
				layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
				limits: [15],
				limit: 15
			}
			page_options.jump = function(obj, first) {
				tablePage = obj;
				//首次不执行
				if(!first) {
					pageCallback(obj.curr, obj.limit, function(resTwo) {
						tableIns.reload({
							data: resTwo.data
						});
					});
				}
			}
			layui.laypage.render(page_options);
			return {
				tablePage,
				tableIns
			};
		});
	};
	
	
    uploadOss({
    btn: "uploadImg1",
    flag: "img",
    size: "5mb"
    });
    
    
    uploadOss({
    btn: "uploadImg2",
    flag: "img",
    size: "5mb"
    });

})