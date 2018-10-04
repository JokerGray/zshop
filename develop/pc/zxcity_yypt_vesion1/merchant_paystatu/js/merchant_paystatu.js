(function($){
    var page = 1;
    var rows = 15;
    var userNo = yyCache.get("userno");
    var userId = yyCache.get("userId");
    var pid = '';
    var merchantStatus = true;
    var USER_URL = {
        RESOURLIST : 'operations/chargeMerchantStatusList', //(查询状态)
        CHARGELEVE: 'operations/chargeLevelTypeList', //（商户类型）
    };
    var layer = layui.layer;
    var table = layui.table;
    layui.use('form', function(){
        form = layui.form;
    })

    // CHARGELEVE 加载商户等级
    reqAjaxAsync(USER_URL.CHARGELEVE, JSON.stringify({page:1,rows:10})).done(function(res) {
        console.log(res);
        if(res.code ==1){
            var bHtml = "<option value=''>--请选择--</option>";
            var datas = res.data;
            $.map(datas, function(n, index) {
                bHtml += '<option value="' + n.id + '">' + n.levelName + '</option>'
            })
            $("#chargeType").html(bHtml);
        }else{
            layer.msg('加载计费类型失败')
        }

        // form.render();
    });

    function _tabInit(){
    	//渲染表单
        objs = tableInit('tableNo', [
                    [{
                        title: '序号',
                        /*sort: true,*/
                        align: 'left',
                        field: 'eq',
                        width: 80
                    }, {
                        title: '商户名称',
                       /* sort: true,*/
                        align: 'left',
                        field: 'merchantName',
                        width: 100
                    }, {
                        title: '计费类型',
                       /* sort: true,*/
                        align: 'left',
                        field: 'levelName',
                        width: 100
                    },
                        {
                        title: '开始时间',
                       /* sort: true,*/
                        align: 'left',
                        field: 'startTime',
                        width: 200
                    },{
                        title: '到期时间',
/*                        sort: true,*/
                        align: 'left',
                        field: 'endTime',
                        width: 200
                    }, {
                        title: '商户状态',
                       /* sort: true,*/
                        align: 'left',
                        field:'status',
                        width: 100
                    }]
                ],

            pageCallback,'laypageLeft',0
        );
    };
    _tabInit();
    

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
        }

        //3.left table page
        layui.use('laypage');

        var page_options = {
            elem: test,
            count: res ? res.total : 0,
            layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
            limits: [15, 30],
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


    //左侧表格数据处理
    function getData(url, parms) {
        var res = reqAjax(url, parms);
        var data = res.data;
        $.each(data, function(i, item) {
            $(item).attr('eq', (i + 1));
            if(item.merchantStatus==0){
            	$(item).attr('status','锁定');
            };
            if(item.merchantStatus==1){
            	$(item).attr('status','启用');
            };     
        });

        return res;
    }

    //pageCallback回调
    function pageCallback(index, limit,merchantName,levelTypeId,merchantStatus) {
		var operationUserNo = yyCache.get('userno');
        if(merchantName == undefined){merchantName = ''}
        if(levelTypeId == undefined){levelTypeId = ''}
        if(merchantStatus == undefined){merchantStatus = ''}
//      if(startTime == undefined){startTime = ''}
//      if(endTime == undefined){endTime = ''}
        var param = {
            page :index,
            rows :limit,
            operationUserNo:operationUserNo,
            merchantName:merchantName,
            levelTypeId:levelTypeId,
            status:merchantStatus
//          startTime:startTime,
//          endTime:endTime
        }
        return getData(USER_URL.RESOURLIST , JSON.stringify(param));
    }

//日期选择
//  $('#datetimepicker1 input').datepicker({
//      format: 'yyyy-mm-dd',
//      autoclose: true,
//      language: "zh-CN"
//  }).on('changeDate', function(ev) {
//      var startTime = ev.date.valueOf();
//      var endTime =  $('#datetimepicker2').attr('data-time');
//      $(this).parent().attr('data-time',startTime);
//      $("#datetimepicker2 .datepicker").hide();
//  });
//
//  $('#datetimepicker2 input').datepicker({
//      format: 'yyyy-mm-dd',
//      autoclose: true,
//      language: "zh-CN"
//  }).on('changeDate', function(ev) {
//      var startTime = ev.date.valueOf();
//      var endTime =  $('#datetimepicker2').attr('data-time');
//      $(this).parent().attr('data-time',startTime);
//      $("#datetimepicker1 .datepicker").hide();
//  });

    //点击表格变色
    $('#noAudit .layui-table-body').on('click','tr',function(){
        $(this).addClass('layui-table-click').siblings().removeClass('layui-table-click');
    });


    //加了入参的公用方法
    function getTable(merchantName,levelTypeId,merchantStatus){
        var initPage = objs.tablePage;
        var initTable = objs.tableIns;
        var res = pageCallback(1,15,merchantName,levelTypeId,merchantStatus);
        initTable.reload({ data : res.data });
        layui.use('laypage');
        var page_options = {
            elem: 'laypageLeft',
            count: res ? res.total : 0,
            layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
            limits: [15, 30],
            limit: 15
        }
        page_options.jump = function(obj, first) {
            tablePage = obj;

            //首次不执行
            if(!first) {
                    var resTwo = pageCallback(obj.curr, obj.limit,merchantName,levelTypeId,merchantStatus);
                if(resTwo && resTwo.code == 1)
                    initTable.reload({
                        data: resTwo.data
                    });
                else
                    layer.msg(resTwo.msg);
            }
        }
        layui.laypage.render(page_options);
    }
  

    //点击顶部搜索出现各搜索条件
    $('#search').on('click',function(){
        $('#search-tool').slideToggle(200);
    });

    //搜索条件进行搜索
    $('#toolSearch').on('click',function(){
    	//debugger
        var merchantName = $.trim($("#name").val());
        var levelTypeId =$("#chargeType").val();
        var merchantStatus =$("#locked").val();
//      var startTime = $("#jurisdiction-begin").val();
//      var endTime = $("#jurisdiction-end").val();
//      var begtm = $("#jurisdiction-begin").parent().attr("data-time");
//      var endtme = $("#jurisdiction-end").parent().attr("data-time");
//      if(startTime!="" && endTime==""){
//          layer.msg("请选择截止时间");
//          return;
//      }
//      if(startTime=="" && endTime!=""){
//          layer.msg("请选择开始时间");
//          return;
//      }
//      if(startTime !="" && endTime !=""){
//          if(begtm>endtme){
//              layer.msg("开始时间必须早于截止时间哟");
//          }else{
//              getTable(merchantName,levelTypeId,merchantStatus);
//          }
//      }


        getTable(merchantName,levelTypeId,merchantStatus);
    })


    //重置
    $("#toolRelize").click(function(){
        $("#name").val("");
        $("#chargeType").val("");
        $("#locked").val("");
//      $("#jurisdiction-begin").val("");
//      $('#jurisdiction-end').val("");
//      $("#jurisdiction-begin").parent().attr("data-time","");
//      $("#jurisdiction-end").parent().attr("data-time","");
        _tabInit();
    });

})(jQuery);