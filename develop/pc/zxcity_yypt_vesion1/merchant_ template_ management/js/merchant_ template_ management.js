(function($){
    var page = 1;
    var rows = 15;
    var userNo = yyCache.get("userno");
    var userId = yyCache.get("userId");
    var updater = yyCache.get("pcNickname");//登录人名
    var pid = '';
    var USER_URL = {
        RESOURLIST : 'operations/getMerchantTradeTemplatePageListByData', //(查询列表)
        UPDATELIST : 'operations/updateMerchantTradeTemplate',//(修改)       
        DELETELIST : 'operations/deleteMerchantTradeTemplate', //(删除)
        ADDLIST : 'operations/addMerchantTradeTemplate'//(添加)

    };

    var layer = layui.layer;
    var table = layui.table;
    layui.use('form', function(){
        form = layui.form;
        form.render();
    });
    
    //加载表格	
	function _tableInit(){
	        objs = tableInit('tableNo', [
                [{
                    title: '序号',
                    sort:false,
                    align: 'left',
                    field: 'eq',
                    width: 80
                }, {
                    title: '行业模板名',
                    sort:false,
                    align: 'left',
                    field: 'templateName',
                    width: 200
                }, {
                    title: '销售开单是否必须选择可占用设备',
                    sort:false,
                    align: 'left',
                    field: 'isallowSaler',
                    width: 250
                },{
                	title:'是否启用可占用设备',
                	sort:false,
                	align:'left',
                	field:'occupiedDeviceEnabled',
                	width:200
                	
                },{
                	title:'可占用设备类别',
                	sort:false,
                	align:'left',
                	field:'occupyDeviceCategory',
                	width:200
                	
                },{
                	title:'默认是否',
                	sort:false,
                	align:'left',
                	field:'defaultWhether',
                	width:100
                	
                },{
                    title: '操作',
                    fixed: 'right',
                    align: 'left',
                    toolbar: '#barDemo',
                    width: 250
                }]
            ],

            pageCallback,'laypageLeft'
        );
	};
	_tableInit();
	
    /* 表格初始化
     * tableId:
     * cols: []
     * pageCallback: 同步调用接口方法
     */
    function tableInit(tableId, cols, pageCallback, test) {
        var tableIns, tablePage;
        //1.表格配置
        tableIns = table.render({
            id: tableId,
            elem: '#' + tableId,
            height:'full-249',
            cols: cols,
            page: false,
            even: true,
            skin: 'row'
        });

        //2.第一次加载
        var res = pageCallback(page, rows);
        //第一页，一页显示15条数据
        if(res) {
            if(res.code == 1) {
                tableIns.reload({
                    data: res.data
                })
            } else {
                layer.msg(res.msg)
            }
        };

        //3.left table page
        layui.use('laypage');

        var page_options = {
            elem: test,
            count: res ? res.total : 0,
            layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
            limits: [15, 30],
            limit: 15
        };
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
        };


        layui.laypage.render(page_options);

        return {
            tablePage,
            tableIns
        };
    };




    //左侧表格数据处理
    function getData(url, parms) {
        var res = reqAjax(url, parms);
        if(res.code==1){
            var data = res.data;
            $.each(data, function(i, item) {
                $(item).attr('eq', (i + 1));
                
                
                if(item.isallowSaler==0){
                	$(item).attr('isallowSaler','否');
                }else if(item.isallowSaler==1){
                	$(item).attr('isallowSaler','是')
                };
                if(item.occupiedDeviceEnabled==0){
                	$(item).attr('occupiedDeviceEnabled','停用');
                }else if(item.occupiedDeviceEnabled==1){
                	$(item).attr('occupiedDeviceEnabled','启用');
                }
                if(item.defaultWhether==0){
                	$(item).attr('defaultWhether','否');
                }else if(item.defaultWhether==1){
                	$(item).attr('defaultWhether','是');
                }                
            });

            return res;
        }else{
            layer.msg(res.msg);
        };

    };

    //pageCallback回调
    function pageCallback(index, limit,templateName) {
        var templateName = $.trim($("#name").val());
 
        var param = {
            page :index,
            rows :limit,
            templateName:templateName
        }
   
         return getData(USER_URL.RESOURLIST , JSON.stringify(param));
    };


    //表格相关操作
    table.on('tool(tableNo)', function(obj) {
        var data = obj.data;
        var oldId = data.id;     
        if(obj.event === 'nodetail') {  //查看
			layer.open({
				title: ['查看详情', 'font-size:12px;background-color:#0678CE;color:#fff'],
				type: 1,
				content: $('#changeDemo'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
				area: ['500px', '500px'],
				closeBtn: 1,
				shade: [0.1, '#fff'],
				end: function() {
					empty();
					$('#changeDemo').hide();
				},
				success: function(layero, index) {
					$('#tradeName').attr('disabled',true);
					$('#type').attr('disabled',true);
					$('#choice').attr('disabled',true);
					$('#enabled').attr('disabled',true);
					$('#default').attr('disabled',true);
					
					$('#tradeName').val(data.templateName);
					$('#type').val(data.occupyDeviceCategory);
					if(data.isallowSaler=='否'){
						$('#choice').val(0);
					}else if(data.isallowSaler=='是'){
						$('#choice').val(1);
					};
					
					if(data.occupiedDeviceEnabled=='停用'){
						$('#enabled').val(0);
					}else if(data.occupiedDeviceEnabled=='启用'){
						$('#enabled').val(1);
					};
					
					if(data.defaultWhether=='否'){
						$('#default').val(0);
					}else if(data.defaultWhether=='是'){
						$('#default').val(1);
					}
					
					form.render()
				}
			})
		}else if(obj.event==='change'){    //修改
    		layer.open({
	        title: ['修改', 'font-size:12px;background-color:#0678CE;color:#fff'],
	        type: 1,
	        content: $('#changeDemo'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
	        area: ['500px', '500px'],
	        closeBtn: 1,
	        btn:['确定','取消'],
	        shade: [0.1, '#fff'],
	        end: function () {
	        	empty();
	            $('#changeDemo').hide();	            
	        },
	        success: function (layero, index) {
	        	abled();
	        	//给保存按钮添加form属性
				$("div.layui-layer-page").addClass("layui-form");
				$("a.layui-layer-btn0").attr("lay-submit","");
				$("a.layui-layer-btn0").attr("lay-filter","formDemo");
				$('#tradeName').val(data.templateName);
				$('#type').val(data.occupyDeviceCategory);
				if(data.isallowSaler=='否'){
					$('#choice').val(0);
				}else if(data.isallowSaler=='是'){
					$('#choice').val(1);
				};
				
				if(data.occupiedDeviceEnabled=='停用'){
					$('#enabled').val(0);
				}else if(data.occupiedDeviceEnabled=='启用'){
					$('#enabled').val(1);
				};
				
				if(data.defaultWhether=='否'){
					$('#default').val(0);
				}else if(data.defaultWhether=='是'){
					$('#default').val(1);
				}
	            form.render();
	        },
	        yes:function(index,layero){
	        	form.on('submit(formDemo)', function(done) {
	        		if(done){
	        			var id = data.id;
		        		var templateName = $('#tradeName').val();
		        		var occupyDeviceCategory = $('#type').val();
		        		var isallowSaler = $('#choice').val(); 
		        		var occupiedDeviceEnabled = $('#enabled').val(); 
		        		var defaultWhether = $('#default').val(); 
		        		var parm = {
		        			'id':id,
		        			'templateName':templateName,
		        			'occupyDeviceCategory':occupyDeviceCategory,
		        			'isallowSaler':isallowSaler,
		        			'occupiedDeviceEnabled':occupiedDeviceEnabled,
		        			'defaultWhether':defaultWhether
		        		}
		        		
		        		parm = JSON.stringify(parm);      		
		        		reqAjaxAsync(USER_URL.UPDATELIST,parm).done(function(res){
			        		if(res.code == 1){
			        			layer.msg('修改成功')
			        			layer.close(index)
			        			_tableInit();
			        		}else{
			        			layer.msg(res.msg);	        			
			        		};	        			
		        		});
	        		}
	        	})
	        		

	        }
    	});
    		
    	}else if(obj.event === 'del'){
            //删除
            layer.confirm("确认删除？",{icon:0,title:"提示"}, function (index) {
                var parms = {
                    id:oldId
                };
                reqAjaxAsync(USER_URL.DELETELIST,JSON.stringify(parms)).done(function(res) {
                    if (res.code == 1) {
                        layer.close(index);
                        layer.msg("已删除");
                        _tableInit();
                    }else {
                        layer.msg(res.msg);
                    };
                });
            })
        }
    });

	//添加
	 $('#commonAdd').on('click',function(){
		layer.open({
		  title: ['添加', 'font-size:12px;background-color:#0678CE;color:#fff'],
		  btn: ['保存', '取消'],
		  type: 1,
		  content:$('#changeDemo'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
		  area: ['500px', '500px'],
		  shade: [0.1, '#fff'],
		  end:function(){
		  	empty()
		  	$('#changeDemo').hide();
		  },
			success:function(layero,index){
				abled();
				$('#tradeName').val("");
				$('#type').val("");
				$('#choice').val("");
				$('#enabled').val("");
				$('#default').val("");

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
		        		var templateName = $('#tradeName').val();
		        		var occupyDeviceCategory = $('#type').val();
		        		var isallowSaler = $('#choice').val(); 
		        		var occupiedDeviceEnabled = $('#enabled').val(); 
		        		var defaultWhether = $('#default').val(); 
				
					var path=$('#uploadImg2').attr('src');
					  var param ={
						  templateName : templateName,
						  occupyDeviceCategory : occupyDeviceCategory,
						  isallowSaler:isallowSaler,
						  occupiedDeviceEnabled:occupiedDeviceEnabled,
						  defaultWhether:defaultWhether
						  
					  }
					reqAjaxAsync(USER_URL.ADDLIST,JSON.stringify(param)).done(function(res){
							  if(res.code == 1){

								  layer.close(index);
								  layer.msg("添加成功");
								  _tableInit();
							  }else{
								  layer.msg(res.msg);
							  }
						  });
					   
				  }
			  });
			
		  }
		});
	 })
	//弹框可操作
	function abled(){
		$('#tradeName').attr('disabled',false);
		$('#type').attr('disabled',false);
		$('#choice').attr('disabled',false);
		$('#enabled').attr('disabled',false);
		$('#default').attr('disabled',false);
	};
	//弹框数据清空
	function empty(){
		$('#tradeName').val('');
		$('#type').val('');
		$('#choice').val('');
		$('#enabled').val('');
		$('#default').val('');
	};

    //点击表格变色
    $('#noAudit .layui-table-body').on('click','tr',function(){
        $(this).addClass('layui-table-click').siblings().removeClass('layui-table-click');
    });

    //点击顶部搜索出现各搜索条件
    $('#search').on('click',function(){
        $('#search-tool').slideToggle(200);
    });

    //搜索条件进行搜索
    $('#toolSearch').on('click',function(){
        _tableInit();
    });
    
    
	//刷新
	function refresh() {
		location.reload();
	};
	$('#refresh').click(function() {
		refresh()
	});

    //重置
    $("#toolRelize").click(function(){
        $("#name").val("");
        $("#indication").val("");
		_tableInit();
    });
})(jQuery);