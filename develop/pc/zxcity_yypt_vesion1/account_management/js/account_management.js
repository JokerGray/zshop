(function($){
    var page = 1;
    var rows = 15;
    var userNo = yyCache.get("userno");
    var userId = yyCache.get("userId");
    var updater = yyCache.get("pcNickname");//登录人名
    var pid = '';
    var locked = true;
    var USER_URL = {
        RESOURLIST : 'operations/chargeLevelTypeList' //(查询列表)
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
                    title: '名称',
                    sort:false,
                    align: 'left',
                    field: 'levelName',
                    width: 200
                }, {
                    title: '费用',
                    sort:false,
                    align: 'left',
                    field: 'amount',
                    width: 200
                },{
                	title:'有效天数',
                	sort:false,
                	align:'left',
                	field:'numValidDays',
                	width:100
                	
                },{
                	title:'创建时间',
                	align:'left',
                	field:'createTime',
                	width:200
                },{
                	title:'修改时间',
                	align:'left',
                	field:'modifyTime',
                	width:200
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
            console.log(data)
            $.each(data, function(i, item) {
                $(item).attr('eq', (i + 1));
            });

            return res;
        }else{
            layer.msg(res.msg);
        };

    };

    //pageCallback回调
    function pageCallback(index, limit,levelName) {
        if(levelName == undefined){levelName = ''}
 
        var param = {
            page :index,
            rows :limit
        }
        if(levelName!=""){
            param.levelName=levelName
        }       
         return getData(USER_URL.RESOURLIST , JSON.stringify(param));
    };


    //点击表格变色
    $('#noAudit .layui-table-body').on('click','tr',function(){
        $(this).addClass('layui-table-click').siblings().removeClass('layui-table-click');
    });


    //加了入参的公用方法
    function getTable(levelName){
        var initPage = objs.tablePage;
        var initTable = objs.tableIns;
        var res = pageCallback(1,15,levelName);
        initTable.reload({ data : res.data });
        layui.use('laypage');
        var page_options = {
            elem: 'laypageLeft',
            count: res ? res.total : 0,
            layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
            limits: [15, 30],
            limit: 15
        };
        page_options.jump = function(obj, first) {
            tablePage = obj;

            //首次不执行
            if(!first) {
                var resTwo = pageCallback(obj.curr, obj.limit,levelName);
                if(resTwo && resTwo.code == 1)
                    initTable.reload({
                        data: resTwo.data
                    });
                else
                    layer.msg(resTwo.msg);
            }
        };
        layui.laypage.render(page_options);
    };


    //点击顶部搜索出现各搜索条件
    $('#search').on('click',function(){
        $('#search-tool').slideToggle(200);
    });

    //搜索条件进行搜索
    $('#toolSearch').on('click',function(){
        var levelName = $.trim($("#name").val());
        getTable(levelName);

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
		_tableInit();
    });
})(jQuery);