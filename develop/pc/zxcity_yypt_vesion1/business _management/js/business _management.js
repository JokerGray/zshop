(function($){
    var page = 1;
    var rows = 15;
    var userNo = yyCache.getData("userno");
    var userId = yyCache.getData("userId");
    var updater = yyCache.getData("pcNickname");//登录人名
    var pid = '';
    var USER_URL = {
        RESOURLIST : 'operations/getMerchantTradePageByData', //(查询列表)
        DELETELIST : 'operations/deleteMerchantTradeDict', //(删除)
        ADDLIST : 'operations/addMerchantTradeDict', //(添加)
        UPDATELIST : 'operations/updateMerchantTradeDict', //(修改)
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
                    title: '行业',
                    sort:false,
                    align: 'left',
                    field: 'name',
                    width: 200
                }, {
                    title: '显示名',
                    sort:false,
                    align: 'left',
                    field: 'showname',
                    width: 200
                },{
                	title:'取值',
                	sort:false,
                	align:'left',
                	field:'value',
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
            });

            return res;
        }else{
            layer.msg(res.msg);
        };

    };

    //pageCallback回调
    function pageCallback(index, limit) {
        var name = $.trim($("#name").val());
        var showname = $.trim($("#indication").val());
 
        var param = {
            page :index,
            rows :limit,
            name:name,
            showname:showname
        }
   
         return getData(USER_URL.RESOURLIST , JSON.stringify(param));
    };


    //表格相关操作
    table.on('tool(tableNo)', function(obj) {
        var data = obj.data;
        var oldId = data.id;
        //修改
    	if(obj.event==='change'){
    		layer.open({
	        title: ['修改', 'font-size:12px;background-color:#0678CE;color:#fff'],
	        type: 1,
	        content: $('#changeDemo'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
	        area: ['500px', '500px'],
	        closeBtn: 1,
	        btn:['确定','取消'],
	        shade: [0.1, '#fff'],
	        end: function () {
	            $('#changeDemo').hide();
	        },
	        success: function (layero, index) {
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
	        yes:function(index,layero){
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
		  content:$('#addDemo'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
		  area: ['500px', '500px'],
		  shade: [0.1, '#fff'],
		  end:function(){
		  	$('#addDemo').hide();
		  },
			success:function(layero,index){
				$('#tradeName').val("");
				$('#showName').val("");
				$('#value1').val("");
				$('#value1').removeAttr('disabled');
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
					  }
					reqAjaxAsync(USER_URL.ADDLIST,JSON.stringify(param)).done(function(res){
							  if(res.code == 1){
//								  var name = $.trim($("#tradeName").val());
//								  var showname = $.trim($("#showName").val());
//								  var value = $.trim($("#value1").val());
//								  var iconPath=$("#uploadImg2").attr('src');
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