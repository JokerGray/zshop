(function($){
    var page = 1;
    var rows = 15;
    var userNo = yyCache.get("userno") || "";
    var statsuNum = sessionStorage.getItem("statsuNum") || ""; //标志某个板块
    var titStatu = sessionStorage.getItem("titStatu") || ""; //标题
    var plateStatu = sessionStorage.getItem("plateStatu") || ""; //板块
    var benginStatu = sessionStorage.getItem("benginStatu") || ""; //创建时间
    var endStatu = sessionStorage.getItem("endStatu") || ""; //结束时间
    var statuTy = sessionStorage.getItem("statuTydf") || "";//审核状态 3-未 4-已
    var statutys = sessionStorage.getItem("passstat") || "";//已审核状态下拒绝或通过
    var urlpag = sessionStorage.getItem("oldreviewPag") || 1;//点击到哪一页
    var arrlist; //整页的数据
    var countsize;//总页数
    var reviewindex;//点击的是哪一个索引
    var pid = '';
    var USER_URL = {
        NORESOURLIST : 'operations/getContentReviewNotAuditedPage', //(未审核查询) 1 是第一个, 2是第二个, 3是第三个 (文字-1 图片-2 视频-3)
        RESOURLIST : 'operations/getContentReviewAuditedPage',  //(审核查询)'审核状态 0-发布即审核 1-审核后发布',
        PLATESET : 'operations/plateSettingList' //板块查询
    };

    
    var table = layui.table;
 
    layui.use(['form','laydate','layer'], function(){
        form = layui.form;
        laydate  = layui.laydate;
        layer = layui.layer;
    })

    laydate.render({
        elem: '#jurisdiction-begin' 
        ,done: function(value, date, endDate){
            //限定 结束日期只可以为 开始日期  以后日期
            laydate.render({
            elem: '#jurisdiction-end'
            ,min: value
            });
        }
    });
    
    //日期选择
    // $('#datetimepicker1 input').datepicker({
    //     format: 'yyyy-mm-dd',
    //     autoclose: true,
    //     language: "zh-CN"
    // }).on('changeDate', function(ev) {
    //     var startTime = ev.date.valueOf();
    //     var endTime =  $('#datetimepicker2').attr('data-time');
    //     $(this).parent().attr('data-time',startTime);
    //     $("#datetimepicker2 .datepicker").hide();
    // });

    // $('#datetimepicker2 input').datepicker({
    //     format: 'yyyy-mm-dd',
    //     autoclose: true,
    //     language: "zh-CN"
    // }).on('changeDate', function(ev) {
    //     var startTime = ev.date.valueOf();
    //     var endTime =  $('#datetimepicker2').attr('data-time');
    //     $(this).parent().attr('data-time',startTime);
    //     $("#datetimepicker1 .datepicker").hide();
    // });

    //加载板块
    function getPlate(plateType){
        var sHtml = "";
        var param = {
            page :page,
            rows :rows,
            plateType :plateType
        }
        reqAjaxAsync(USER_URL.PLATESET, JSON.stringify(param)).done(function (res) {
            if (res.code == 1) {
                sHtml += '<option value="">-请选择-</option>';
                for(var i=0;i<res.data.length;i++){
                    var row = res.data[i];
                    sHtml += '<option value="' + row.tableName + '">' + row.plateDesc + '</option>'
                }
                $("#platebox").html(sHtml);
                form.render();

                var platlists = $("#platebox").find("option");
                for(var i=0;i<platlists.length;i++){
                    if(plateStatu==platlists.eq(i).val()){
                        platlists.eq(i).attr("selected",true);
                    }
                }
            }else{
                layer.msg(res.msg);
            }
        });
    }


    // 批量删除
    $("#batchdeletbtn").on("click",deletAll);
    /*
    * FUN：批量删除
    */
   function deletAll() {
    var inx = $(".tab-title ul li.acti").index();
    var table = "tableNo" + inx;
    var publisherTitle = $.trim($("#merchantName").val());
    var tableName = $.trim($("#platebox").val());
    var createTimeStart = $("#jurisdiction-begin").val();
    var createTimeEnd = $("#jurisdiction-end").val();
    var plateType = inx + 1;
    var sta = $(".auditType select").val();
    // var inxs = $(".tabs-title li.active").index();
    var arr ="";
    $.each(layui.table.checkStatus(table).data, function(i, v){
      arr+=v.id+",";
    });

    if(arr.length=="0"){
      layer.msg("请先选中要删除的行");
    }else if(arr.length>0){
        // console.log('选中');
      var arr1 = arr.substring(0,arr.length-1);

      layer.confirm('确认删除选中的行吗', function(index){
        var d3 = {
          id:arr1,// 多个用户Id用逗号分隔
        };
        reqAjaxAsync('operations/deleteContentReview',JSON.stringify(d3)).done(function(res){
          if(res.code == 1){
            layer.msg(res.msg);
            layer.close(index);
            getTable(inx,4, plateType, publisherTitle, tableName, createTimeStart, createTimeEnd, sta);
          }
        })
        
      });
    }
    return false;
  }

    //tab切换各种app
    $(".tab-title").on("click",'ul li',function(){
        $("#platebox").val("");
        sessionStorage.setItem("plateStatu","");
        var index = $(this).index();
        var num = $(this).attr("data-num");
        $(".tab-title ul li").removeClass("acti");
        $(this).addClass("acti");
        $("#search").attr("data-ty",0);
        var publisherTitle = $.trim($("#merchantName").val());
        var tableName =$("#platebox").val();
        var createTimeStart = $("#jurisdiction-begin").val();
        var createTimeEnd = $("#jurisdiction-end").val();
        var plateType = index + 1;
        //每次点击切换都是未审核状态
        $("#batchdeletbtn").hide();
        $(".tabs-title ul li").removeClass("active");
        $(".tabs-title ul li").eq(0).addClass("active");
        $(".tabs-title ul li").eq(1).attr("data-num",0);
        sessionStorage.setItem("statsuNum",index);
        var inx = $(".tabs-title ul li.active").index();
        if(inx==0){
            $(".auditType").hide();
        }else{
            $(".auditType").show();
        }
        if(num == 0){
            getTbl(index,3,plateType,publisherTitle,tableName,createTimeStart,createTimeEnd);
            $(this).attr("data-num",1);
            changeType();
            getPlate(plateType);
        }else{
            getTable(index,3,plateType,publisherTitle,tableName,createTimeStart,createTimeEnd);
            changeType();
            getPlate(plateType);
        }

    });

     $(function(){
         $("#merchantName").val(titStatu);
         $("#jurisdiction-begin").val(benginStatu);
         $("#jurisdiction-end").val(endStatu);
         $("#platebox").val(plateStatu);
         //初始化加载未审核
         if(statsuNum==""){
             if(statuTy==3 || statuTy==""){// 3-未审核 4-审核
                 getTbl(0,3,1,titStatu,plateStatu,benginStatu,endStatu,"",urlpag);
                 getPlate(1);
                 $(".tabs-title ul li").removeClass("active");
                 $(".tabs-title ul li").eq(0).addClass("active");
                 $(".auditType").hide();
                 $("#search").attr("data-ty",0);

             }
             if(statuTy==4){
                 getTbl(0,4,1,titStatu,plateStatu,benginStatu,endStatu,statutys,urlpag);
                 getPlate(1);
                 $(".tabs-title ul li").removeClass("active");
                 $(".tabs-title ul li").eq(1).addClass("active");
                 $(".auditType").show();
                 $("#batchdeletbtn").show();
                 $("#search").attr("data-ty",1);
                 var options = $("#isPass").find("option");
                 for(var i=0;i<options.length;i++){
                     if(statutys==options.eq(i).val()){
                         options.eq(i).attr("selected",true);
                     }
                 }
             }
             $("#merchantName").val(titStatu);
             $("#jurisdiction-begin").val(benginStatu);
             $("#jurisdiction-end").val(endStatu);
         }else{
             if(statuTy==3 || statuTy==""){// 3-未审核 4-审核
                 getTbl(statsuNum,3,parseInt(statsuNum)+1,titStatu,plateStatu,benginStatu,endStatu,"",urlpag);
                 $(".tab-title ul li").removeClass("acti");
                 $(".tab-title ul li").eq(statsuNum).addClass("acti");
                 $(".tabs-title ul li").removeClass("active");
                 $(".tabs-title ul li").eq(0).addClass("active");
                 getPlate(parseInt(statsuNum)+1);
                 $(".auditType").hide();
                 $("#search").attr("data-ty",0);
              }
             if(statuTy==4){
                 getTbl(statsuNum,4,parseInt(statsuNum)+1,titStatu,plateStatu,benginStatu,endStatu,statutys,urlpag);
                 $(".tab-title ul li").removeClass("acti");
                 $(".tab-title ul li").eq(statsuNum).addClass("acti");
                 $(".tabs-title ul li").removeClass("active");
                 $(".tabs-title ul li").eq(1).addClass("active");
                 getPlate(parseInt(statsuNum)+1);
                 $(".auditType").show();
                 $("#batchdeletbtn").show();
                 $("#search").attr("data-ty",1);
                 var options = $("#isPass").find("option");
                 for(var i=0;i<options.length;i++){
                     if(statutys==options.eq(i).val()){
                         options.eq(i).attr("selected",true);
                     }
                 }
             }
         }
         changeType();
     })


    //待审核已审核切换
    $(".tabs-title").on("click","ul li",function(){
        var index = $(this).index();

        var inx = $(".tab-title li.acti").index();
        var num = $(this).attr("data-num");
        $(".tabs-title ul li").removeClass("active");
        $(this).addClass("active");
        var publisherTitle = $.trim($("#merchantName").val());
        var tableName = $.trim($("#platebox").val());
        var createTimeStart = $("#jurisdiction-begin").val();
        var createTimeEnd = $("#jurisdiction-end").val();
        var ststu=$(".auditType select").val();
        var ty = $(".tabs-title ul li.active").index();
        $("#search").attr("data-ty",ty);
        if(index == 1){
            $("#batchdeletbtn").show();
            $(".auditType").show();
            if(num==0){
                getTbl(inx,4,inx+1,publisherTitle,tableName,createTimeStart,createTimeEnd);
                $(this).attr("data-num",1);
                changeType();
            }else{
                getTable(inx,4,inx+1,publisherTitle,tableName,createTimeStart,createTimeEnd,ststu);
                changeType();
            }
            sessionStorage.setItem("statuTydf",'4');//未审核
        }
        if(index == 0){
            $("#batchdeletbtn").hide();
            $(".auditType").hide();
            if(num==0){
                getTbl(inx,3,inx+1,publisherTitle,tableName,createTimeStart,createTimeEnd);
                $(this).attr("data-num",1);
                changeType();
            }else{
                getTable(inx,3,inx+1,publisherTitle,tableName,createTimeStart,createTimeEnd);
                changeType();
            }
            sessionStorage.setItem("statuTydf",'3');//未审核
        }
    });

    //渲染表单 3-未审核 4 -审核 statustype
    function getTbl(type,statustype,plateType,publisherTitle,tableName,createTimeStart,createTimeEnd,statutys,pagess){
      /*  var tno = $("#noAudit").find("table").attr("id")+type;*/
        var tno = "tableNo"+type;
        $("#noAudit").find("table").attr("id",tno);
        $("#noAudit").find("table").attr("lay-filter",tno);
        if(statustype == 3){
            objs = tableInit(tno, [
                    [{
                        title: '序号',
                        /*sort: true,*/
                        align: 'left',
                        field: 'eq',
                        width: '5%'
                    }, {
                        title: '内容分类',
                        sort: false,
                        align: 'left',
                        field: 'typename',
                        width: '10%'
                    }, {
                        title: '模块名称',
                        sort: false,
                        align: 'left',
                        templet: '#titleTpl',
                        width: '20%'
                    }, {
                        title: '标题',
                        sort: false,
                        align: 'left',
                        field: 'publisherTitle',
                        width: '20%'
                    }, {
                        title: '发布者',
                        sort: false,
                        align: 'left',
                        field: 'publisherUserCode',
                        width: '15%'
                    },
                        /*{
                        title: '用户名称',
                        sort: true,
                        align: 'left',
                        templet: '#titleStatu',
                        width: 100
                    },暂时无此字段 */
                        {
                        title: '创建时间',
                       /* sort: true,*/
                        align: 'left',
                        field: 'createTime',
                        width: '15%'
                    },{
                        title: '操作',
                        fixed: 'right',
                        align: 'left',
                        toolbar: '#barDemo',
                        width: '13%'
                    }]
                ],

                pageCallback,'laypageLeft',statustype,publisherTitle,tableName,plateType,createTimeStart,createTimeEnd,statutys,pagess
            );
        }else if(statustype == 4){
            obja = tableInit(tno, [
                    [{type:'checkbox'},
                    {
                        title: '序号',
                        /*sort: true,*/
                        align: 'left',
                        field: 'eq',
                        width: 80
                    }, {
                        title: '内容分类',
                        sort: false,
                        align: 'left',
                        field: 'typename',
                        width: 100
                    }, {
                        title: '模块名称',
                        sort: false,
                        align: 'left',
                        templet: '#titleTpl',
                        width: 150
                    }, {
                        title: '标题',
                        sort: false,
                        align: 'left',
                        field: 'publisherTitle',
                        width: 200
                    },  {
                        title: '创建时间',
                        /*sort: true,*/
                        align: 'left',
                        field: 'createTime',
                        width: 200
                    }, {
                        title: '发布者',
                        sort: false,
                        align: 'left',
                        field: 'publisherUserCode',
                        width: 200
                    }, {
                        title: '审核状态',
                        sort: false,
                        align: 'left',
                        templet: '#titleTpl1',
                        width: 100
                    },{
                        title: '审核人',
                        sort: false,
                        align: 'left',
                        field: 'operatorName',
                        width: 100
                    }, {
                        title: '审核时间',
                        sort: false,
                        align: 'left',
                        field: 'reviewTime',
                        width: 200
                    }, {
                        title: '审核意见',
                        sort: false,
                        align: 'left',
                        field: 'reviewOpinion',
                        width: 200
                    },  {
                        title: '操作',
                        fixed: 'right',
                        align: 'left',
                        toolbar: '#barDemor',
                        width: 160
                    }]
                ],

                pageCallback,'laypageLeft',statustype,publisherTitle,tableName,plateType,createTimeStart,createTimeEnd,statutys,pagess
            );
        }
    }



    /* 表格初始化
     * tableId:
     * cols: []
     * pageCallback: 同步调用接口方法
     *  3-未审核 4 -审核 statustype == 3
     *  status代表已审核状态下的两种状态 1-已通过 2-未通过
     */
    function tableInit(tableId, cols, pageCallback, test,statustype,publisherTitle,tableName,plateType,createTimeStart,createTimeEnd,status,pages) {
        var tableIns, tablePage;
        //1.表格配置
        tableIns = table.render({
            id: tableId,
            elem: '#' + tableId,
            height:'full-338',
            cols: cols,
            page: false,
            even: true,
            limit: 15,
            skin: 'row'
        });

        //2.第一次加载
        var res = pageCallback(statustype,plateType,pages, rows,publisherTitle,tableName,createTimeStart,createTimeEnd,status);
        //第一页，一页显示15条数据
        if(res) {
            if(res.code == 1) {
                tableIns.reload({
                    data: res.data
                })
                arrlist = res.data;
                countsize = Math.ceil(res.total/rows);
                sessionStorage.setItem('countsize',JSON.stringify(countsize));
                sessionStorage.setItem('reviewData',JSON.stringify(arrlist));
            } else {
                layer.msg(res.msg)
            }
        }

        //3.left table page
        layui.use('laypage');

        var page_options = {
            elem: test,
            count: res ? res.total : 0,
            layout: ['count', 'prev', 'page', 'next', 'skip'],
          //  limits: [15, 30],
            limit: 15,
            curr:pages
        }
        page_options.jump = function(obj, first) {
            tablePage = obj;

            //首次不执行
            if(!first) {
                if(statustype == 3){
                    var resTwo = pageCallback(statustype,plateType,obj.curr, obj.limit,publisherTitle,tableName,createTimeStart,createTimeEnd);
                }else if(statustype == 4){
                    var resTwo = pageCallback(statustype,plateType,obj.curr, obj.limit,publisherTitle,tableName,createTimeStart,createTimeEnd,status);
                }
                if(resTwo && resTwo.code == 1){
                    tableIns.reload({
                        data: resTwo.data
                    });
                    arrlist = resTwo.data;
                    sessionStorage.setItem('reviewData',JSON.stringify(arrlist));
                }
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
            if(item.type == 1){
                $(item).attr('typename', '文字');
            }else if(item.type == 2){
                $(item).attr('typename', '图片');
            }else if(item.type == 3){
                $(item).attr('typename', '视频');
            }else{
                $(item).attr('typename', '-');
            }
        });

        return res;
    }

    //pageCallback回调
    function pageCallback(statustype,plateType,index, limit,publisherTitle,tableName,createTimeStart,createTimeEnd,status) {
        if(publisherTitle == undefined){publisherTitle = ''}
        if(tableName == undefined){tableName = ''}
        if(plateType == undefined){plateType = ''}
        if(createTimeStart == undefined){createTimeStart = ''}
        if(createTimeEnd == undefined){createTimeEnd = ''}
        if(status == undefined){status = ''}
        if(statustype==3){
            var param = {
                page :index,
                rows :limit,
                publisherTitle :publisherTitle,
                tableName : tableName,//板块表名
                plateType :plateType,//板块名称
                createTimeStart:createTimeStart,
                createTimeEnd:createTimeEnd
            }
            return getData(USER_URL.NORESOURLIST,JSON.stringify(param));
        }else if(statustype==4){
            if(status == ""){
                var param = {
                    page :index,
                    rows :limit,
                    publisherTitle :publisherTitle,
                    tableName : tableName,//板块表名
                    plateType :plateType,//板块名称
                    createTimeStart:createTimeStart,
                    createTimeEnd:createTimeEnd
                }
            }else{
                var param = {
                    page :index,
                    rows :limit,
                    publisherTitle :publisherTitle,
                    tableName : tableName,//板块表名
                    plateType :plateType,//板块名称
                    createTimeStart:createTimeStart,
                    createTimeEnd:createTimeEnd,
                    status:status //1-审核已通过 2-审核未通过
                }
            }

            return getData(USER_URL.RESOURLIST,JSON.stringify(param));
        }
    }



    //审核和查看
    function changeType(){
        var tnos = $("#noAudit").find("table").attr("id");
        var tys = $("#search").attr("data-ty");

        if(tys == 0){ //0-待审核1-已审核
            if(tnos=="tableNo0"){
                table.on('tool(tableNo0)', function(obj) {
                    var data = obj.data;
                    var oldId = data.id;
                    var url = data.reviewUrl;
                    var reviewId = data.reviewId; 
                    var tableName = data.tableName;
                    if(obj.event === 'del'){
                        var reviewtitle = $.trim($("#merchantName").val());
                        var reviewplate = $("#platebox").val();
                        var reviewbegin = $("#jurisdiction-begin").val();
                        var reviewend = $("#jurisdiction-end").val();
                        var reviewcity = parseInt($(".tab-title .acti").index())+1;
                        var pag = $("#laypageLeft").find(".layui-laypage-curr em").text();
                        reviewindex = data.eq - 1;
                        sessionStorage.setItem('id',oldId);
                        sessionStorage.setItem('reviewindex',reviewindex);
                        sessionStorage.setItem('reviewPag',pag);
                        sessionStorage.setItem('oldreviewPag',pag);
                        sessionStorage.setItem('reviewUrl',url);
                        sessionStorage.setItem('reviewId',reviewId);
                        sessionStorage.setItem('tableName',tableName);
                        sessionStorage.setItem('reviewType',1);
                        sessionStorage.setItem('reviewtitle',reviewtitle);
                        sessionStorage.setItem('reviewplate',reviewplate);
                        sessionStorage.setItem('reviewbegin',reviewbegin);
                        sessionStorage.setItem('reviewend',reviewend);
                        sessionStorage.setItem('reviewcity',reviewcity);
                        //跳转到审核详情页
                        //$("#pageFrame",window.parent.document).attr("src","audit_detail/audit_detail.html");

                        //var onthisid = $(".top_tab li[class*='layui-this']").attr("lay-id");
                        var onthisid = $(window.parent.document).find(".top_tab li[class*='layui-this']" ).children("i.layui-icon").attr("data-id");
                        $(window.parent.document).find("iframe[data-id='"+onthisid+"']").attr("src","page/audit_detail/audit_detail.html?v=" + new Date().getMilliseconds());//切换后刷新框架
                        // window.top.admin.current("audit_detail/audit_detail.html?v=" + new Date().getMilliseconds());
                    }
                })
            };
            if(tnos=="tableNo1"){
                table.on('tool(tableNo1)', function(obj) {
                    var data = obj.data;
                    var oldId = data.id;
                    var url = data.reviewUrl;
                    var reviewId = data.reviewId;
                    var tableName = data.tableName;
                    if(obj.event === 'del'){
                        var pag = $("#laypageLeft").find(".layui-laypage-curr em").text();
                        reviewindex = data.eq - 1;
                        sessionStorage.setItem('id',oldId);
                        sessionStorage.setItem('reviewindex',reviewindex);
                        sessionStorage.setItem('reviewPag',pag);
                        sessionStorage.setItem('oldreviewPag',pag);
                        sessionStorage.setItem('reviewUrl',url);
                        sessionStorage.setItem('reviewId',reviewId);
                        sessionStorage.setItem('tableName',tableName);
                        sessionStorage.setItem('reviewType',1);
                        var reviewtitle = $.trim($("#merchantName").val());
                        var reviewplate = $("#platebox").val();
                        var reviewbegin = $("#jurisdiction-begin").val();
                        var reviewend = $("#jurisdiction-end").val();
                        var reviewcity = parseInt($(".tab-title .acti").index())+1;
                        sessionStorage.setItem('reviewtitle',reviewtitle);
                        sessionStorage.setItem('reviewplate',reviewplate);
                        sessionStorage.setItem('reviewbegin',reviewbegin);
                        sessionStorage.setItem('reviewend',reviewend);
                        sessionStorage.setItem('reviewcity',reviewcity);
                        //跳转到审核详情页
                        //$("#pageFrame",window.parent.document).attr("src","audit_detail/audit_detail.html");
                        var onthisid = $(window.parent.document).find(".top_tab li[class*='layui-this']").attr("lay-id");
                        $(window.parent.document).find("iframe[data-id='"+onthisid+"']").attr("src","page/audit_detail/audit_detail.html?v=" + new Date().getMilliseconds());
                        //window.top.admin.current("audit_detail/audit_detail.html?v=" + new Date().getMilliseconds());
                    }
                })
            };
            if(tnos=="tableNo2"){
                table.on('tool(tableNo2)', function(obj) {
                    var data = obj.data;
                    var oldId = data.id;
                    var url = data.reviewUrl;
                    var reviewId = data.reviewId;
                    var tableName = data.tableName;
                    if(obj.event === 'del'){
                        var pag = $("#laypageLeft").find(".layui-laypage-curr em").text();
                        reviewindex = data.eq - 1;
                        sessionStorage.setItem('id',oldId);
                        sessionStorage.setItem('reviewindex',reviewindex);
                        sessionStorage.setItem('reviewPag',pag);
                        sessionStorage.setItem('oldreviewPag',pag);
                        sessionStorage.setItem('reviewUrl',url);
                        sessionStorage.setItem('reviewId',reviewId);
                        sessionStorage.setItem('tableName',tableName);
                        sessionStorage.setItem('reviewType',1);
                        var reviewtitle = $.trim($("#merchantName").val());
                        var reviewplate = $("#platebox").val();
                        var reviewbegin = $("#jurisdiction-begin").val();
                        var reviewend = $("#jurisdiction-end").val();
                        var reviewcity = parseInt($(".tab-title .acti").index())+1;
                        sessionStorage.setItem('reviewtitle',reviewtitle);
                        sessionStorage.setItem('reviewplate',reviewplate);
                        sessionStorage.setItem('reviewbegin',reviewbegin);
                        sessionStorage.setItem('reviewend',reviewend);
                        sessionStorage.setItem('reviewcity',reviewcity);
                        //跳转到审核详情页
                        //$("#pageFrame",window.parent.document).attr("src","audit_detail/audit_detail.html");
                        var onthisid = $(window.parent.document).find(".top_tab li[class*='layui-this']").attr("lay-id");
                        $(window.parent.document).find("iframe[data-id='"+onthisid+"']").attr("src","page/audit_detail/audit_detail.html?v=" + new Date().getMilliseconds());
                       
                        // window.top.admin.current("audit_detail/audit_detail.html?v=" + new Date().getMilliseconds());
                    }
                })
            }
        }else if(tys == 1){
            if(tnos=="tableNo0"){
                table.on('tool(tableNo0)', function(obj) {
                    var data =obj.data;
                    var oldId = data.id;
                    var url = data.reviewUrl;
                    var reviewOpinion = data.reviewOpinion || "";
                    var reviewStatu = data.status;
                    var reviewId = data.reviewId;
                    var tableName = data.tableName;
                    if(obj.event === 'detail'){
                        var pag = $("#laypageLeft").find(".layui-laypage-curr em").text();
                        reviewindex = data.eq - 1;
                        sessionStorage.setItem('id',oldId);
                        sessionStorage.setItem('reviewindex',reviewindex);
                        sessionStorage.setItem('reviewPag',pag);
                        sessionStorage.setItem('oldreviewPag',pag);
                        sessionStorage.setItem('reviewUrl',url);
                        sessionStorage.setItem('reviewId',reviewId);
                        sessionStorage.setItem('tableName',tableName);
                        sessionStorage.setItem('reviewType',2); //1-审核 2-查看
                        sessionStorage.setItem('reviewOpinion',reviewOpinion);//审核意见
                        sessionStorage.setItem('reviewStatu',reviewStatu);//是否通过
                        var reviewtitle = $.trim($("#merchantName").val());
                        var reviewplate = $("#platebox").val();
                        var reviewbegin = $("#jurisdiction-begin").val();
                        var reviewend = $("#jurisdiction-end").val();
                        var reviewcity = parseInt($(".tab-title .acti").index())+1;
                        sessionStorage.setItem('reviewtitle',reviewtitle);
                        sessionStorage.setItem('reviewplate',reviewplate);
                        sessionStorage.setItem('reviewbegin',reviewbegin);
                        sessionStorage.setItem('reviewend',reviewend);
                        sessionStorage.setItem('reviewcity',reviewcity);
                        //查看
                        //$("#pageFrame",window.parent.document).attr("src","audit_detail/audit_detail.html");
                        var onthisid = $(window.parent.document).find(".top_tab li[class*='layui-this']").attr("lay-id");
                        $(window.parent.document).find("iframe[data-id='"+onthisid+"']").attr("src","page/audit_detail/audit_detail.html?v=" + new Date().getMilliseconds());
                       
                        // window.top.admin.current("audit_detail/audit_detail.html?v=" + new Date().getMilliseconds());
                    }else if(obj.event === 'dels'){ //复审
                        var pag = $("#laypageLeft").find(".layui-laypage-curr em").text();
                        reviewindex = data.eq - 1;
                        sessionStorage.setItem('id',oldId);
                        sessionStorage.setItem('reviewindex',reviewindex);
                        sessionStorage.setItem('reviewPag',pag);
                        sessionStorage.setItem('oldreviewPag',pag);
                        sessionStorage.setItem('reviewUrl',url);
                        sessionStorage.setItem('reviewId',reviewId);
                        sessionStorage.setItem('tableName',tableName);
                        sessionStorage.setItem('reviewType',3); //1-审核 2-查看3-复审
                        sessionStorage.setItem('reviewOpinion',reviewOpinion);//审核意见
                        sessionStorage.setItem('reviewStatu',reviewStatu);//是否通过
                        //查看
                        //$("#pageFrame",window.parent.document).attr("src","audit_detail/audit_detail.html");
                        var onthisid = $(window.parent.document).find(".top_tab li[class*='layui-this']").attr("lay-id");
                        $(window.parent.document).find("iframe[data-id='"+onthisid+"']").attr("src","page/audit_detail/audit_detail.html?v=" + new Date().getMilliseconds());
                       
                        // window.top.admin.current("audit_detail/audit_detail.html?v=" + new Date().getMilliseconds());
                    }
                });
            };
            if(tnos=="tableNo1"){
                table.on('tool(tableNo1)', function(obj) {
                    var data =obj.data;
                    var oldId = data.id;
                    var url = data.reviewUrl;
                    var reviewOpinion = data.reviewOpinion || "";
                    var reviewStatu = data.status;
                    var reviewId = data.reviewId;
                    var tableName = data.tableName;
                    if(obj.event === 'detail'){
                        var pag = $("#laypageLeft").find(".layui-laypage-curr em").text();
                        reviewindex = data.eq - 1;
                        sessionStorage.setItem('id',oldId);
                        sessionStorage.setItem('reviewindex',reviewindex);
                        sessionStorage.setItem('reviewPag',pag);
                        sessionStorage.setItem('oldreviewPag',pag);
                        sessionStorage.setItem('reviewUrl',url);
                        sessionStorage.setItem('reviewId',reviewId);
                        sessionStorage.setItem('tableName',tableName);
                        sessionStorage.setItem('reviewType',2); //1-审核 2-查看
                        sessionStorage.setItem('reviewOpinion',reviewOpinion);//审核意见
                        sessionStorage.setItem('reviewStatu',reviewStatu);//是否通过
                        //查看
                        //$("#pageFrame",window.parent.document).attr("src","audit_detail/audit_detail.html");
                        var reviewtitle = $.trim($("#merchantName").val());
                        var reviewplate = $("#platebox").val();
                        var reviewbegin = $("#jurisdiction-begin").val();
                        var reviewend = $("#jurisdiction-end").val();
                        var reviewcity = parseInt($(".tab-title .acti").index())+1;
                        sessionStorage.setItem('reviewtitle',reviewtitle);
                        sessionStorage.setItem('reviewplate',reviewplate);
                        sessionStorage.setItem('reviewbegin',reviewbegin);
                        sessionStorage.setItem('reviewend',reviewend);
                        sessionStorage.setItem('reviewcity',reviewcity);
                        var onthisid = $(window.parent.document).find(".top_tab li[class*='layui-this']").attr("lay-id");
                        $(window.parent.document).find("iframe[data-id='"+onthisid+"']").attr("src","page/audit_detail/audit_detail.html?v=" + new Date().getMilliseconds());

                        // window.top.admin.current("audit_detail/audit_detail.html?v=" + new Date().getMilliseconds());
                    }else if(obj.event === 'dels'){ //复审
                        var pag = $("#laypageLeft").find(".layui-laypage-curr em").text();
                        reviewindex = data.eq - 1;
                        sessionStorage.setItem('id',oldId);
                        sessionStorage.setItem('reviewindex',reviewindex);
                        sessionStorage.setItem('reviewPag',pag);
                        sessionStorage.setItem('oldreviewPag',pag);
                        sessionStorage.setItem('reviewUrl',url);
                        sessionStorage.setItem('reviewId',reviewId);
                        sessionStorage.setItem('tableName',tableName);
                        sessionStorage.setItem('reviewType',3); //1-审核 2-查看3-复审
                        sessionStorage.setItem('reviewOpinion',reviewOpinion);//审核意见
                        sessionStorage.setItem('reviewStatu',reviewStatu);//是否通过
                        //$("#pageFrame",window.parent.document).attr("src","audit_detail/audit_detail.html");
                        var onthisid = $(window.parent.document).find(".top_tab li[class*='layui-this']").attr("lay-id");
                        $(window.parent.document).find("iframe[data-id='"+onthisid+"']").attr("src","page/audit_detail/audit_detail.html?v=" + new Date().getMilliseconds());

                        // window.top.admin.current("audit_detail/audit_detail.html?v=" + new Date().getMilliseconds());
                    }
                });
            };
            if(tnos=="tableNo2"){
                table.on('tool(tableNo2)', function(obj) {
                    var data =obj.data;
                    var oldId = data.id;
                    var url = data.reviewUrl;
                    var reviewOpinion = data.reviewOpinion || "";
                    var reviewStatu = data.status;
                    var reviewId = data.reviewId;
                    var tableName = data.tableName;
                    if(obj.event === 'detail'){
                        var pag = $("#laypageLeft").find(".layui-laypage-curr em").text();
                        reviewindex = data.eq - 1;
                        sessionStorage.setItem('id',oldId);
                        sessionStorage.setItem('reviewindex',reviewindex);
                        sessionStorage.setItem('reviewPag',pag);
                        sessionStorage.setItem('oldreviewPag',pag);
                        sessionStorage.setItem('reviewUrl',url);
                        sessionStorage.setItem('reviewId',reviewId);
                        sessionStorage.setItem('tableName',tableName);
                        sessionStorage.setItem('reviewType',2); //1-审核 2-查看
                        sessionStorage.setItem('reviewOpinion',reviewOpinion);//审核意见
                        sessionStorage.setItem('reviewStatu',reviewStatu);//是否通过
                        var reviewtitle = $.trim($("#merchantName").val());
                        var reviewplate = $("#platebox").val();
                        var reviewbegin = $("#jurisdiction-begin").val();
                        var reviewend = $("#jurisdiction-end").val();
                        var reviewcity = parseInt($(".tab-title .acti").index())+1;
                        sessionStorage.setItem('reviewtitle',reviewtitle);
                        sessionStorage.setItem('reviewplate',reviewplate);
                        sessionStorage.setItem('reviewbegin',reviewbegin);
                        sessionStorage.setItem('reviewend',reviewend);
                        sessionStorage.setItem('reviewcity',reviewcity);
                        //查看
                        //$("#pageFrame",window.parent.document).attr("src","audit_detail/audit_detail.html");
                        var onthisid = $(window.parent.document).find(".top_tab li[class*='layui-this']").attr("lay-id");
                        $(window.parent.document).find("iframe[data-id='"+onthisid+"']").attr("src","page/audit_detail/audit_detail.html?v=" + new Date().getMilliseconds());
                        // window.top.admin.current("audit_detail/audit_detail.html?v=" + new Date().getMilliseconds());
                    }else if(obj.event === 'dels'){ //复审
                        var pag = $("#laypageLeft").find(".layui-laypage-curr em").text();
                        reviewindex = data.eq - 1;
                        sessionStorage.setItem('id',oldId);
                        sessionStorage.setItem('reviewindex',reviewindex);
                        sessionStorage.setItem('reviewPag',pag);
                        sessionStorage.setItem('oldreviewPag',pag);
                        sessionStorage.setItem('reviewUrl',url);
                        sessionStorage.setItem('reviewId',reviewId);
                        sessionStorage.setItem('tableName',tableName);
                        sessionStorage.setItem('reviewType',3); //1-审核 2-查看 3-复审
                        sessionStorage.setItem('reviewOpinion',reviewOpinion);//审核意见
                        sessionStorage.setItem('reviewStatu',reviewStatu);//是否通过
                        //$("#pageFrame",window.parent.document).attr("src","audit_detail/audit_detail.html");
                        var onthisid = $(window.parent.document).find(".top_tab li[class*='layui-this']").attr("lay-id");
                        $(window.parent.document).find("iframe[data-id='"+onthisid+"']").attr("src","page/audit_detail/audit_detail.html?v=" + new Date().getMilliseconds());
                        // window.top.admin.current("audit_detail/audit_detail.html?v=" + new Date().getMilliseconds());
                    }
                });
            }
        }
    }


    //加了入参的公用方法
    function getTable(inx,statustype,plateType,publisherTitle,tableName,createTimeStart,createTimeEnd,sta){
        var tno = "tableNo"+inx;
        $("#noAudit").find("table").attr("id",tno);
        $("#noAudit").find("table").attr("lay-filter",tno);
        if(statustype == 3){
            var initPage = objs.tablePage;
            var initTable = objs.tableIns;
        }else if(statustype == 4){
            var initPage = obja.tablePage;
            var initTable = obja.tableIns;
        }
        var res = pageCallback(statustype,plateType,1,15,publisherTitle,tableName,createTimeStart,createTimeEnd,sta);
        initTable.reload({ data : res.data });
        arrlist = res.data;
        sessionStorage.setItem('reviewData',JSON.stringify(arrlist));
        countsize = Math.ceil(res.total/rows);
        sessionStorage.setItem('countsize',JSON.stringify(countsize));
        layui.use('laypage');
        var page_options = {
            elem: 'laypageLeft',
            count: res ? res.total : 0,
            layout: ['count', 'prev', 'page', 'next', 'skip'],
            limits: [15],
            limit: 15
        }
        page_options.jump = function(obj, first) {
            tablePage = obj;

            //首次不执行
            if(!first) {
                var resTwo = pageCallback(statustype,plateType,obj.curr, obj.limit,publisherTitle,tableName,createTimeStart,createTimeEnd,sta);
                if(resTwo && resTwo.code == 1){
                    initTable.reload({
                        data: resTwo.data,
                        limit: obj.limit
                    });
                    arrlist = resTwo.data;
                    sessionStorage.setItem('reviewData',JSON.stringify(arrlist));
                }
                else
                    layer.msg(resTwo.msg);
            }
        }
        layui.laypage.render(page_options);
    }


//点击顶部搜索出现各搜索条件
    $('#search').on('click',function(){
        $('#search-tool').slideToggle(200)
    });

    //搜索条件进行搜索
    $('#toolSearch').on('click',function(){
        var inx = $(".tab-title li.acti").index();
        var publisherTitle = $.trim($("#merchantName").val());
        var tableName = $.trim($("#platebox").val());
        var createTimeStart = $("#jurisdiction-begin").val();
        var createTimeEnd = $("#jurisdiction-end").val();
        var plateType = inx + 1;
        var sta = $(".auditType select").val();
        var inxs = $(".tabs-title li.active").index();

        var begintime = $("#datetimepicker1").attr("data-time");
        var endTime = $("#datetimepicker2").attr("data-time");
        if(begintime!=""&&endTime!=""){
            if(begintime>endTime){
                layer.msg("创建时间不能晚于截至时间哟");
            }else{
                if(inxs == 0){
                    sessionStorage.setItem("statuTydf",'3');//未审核
                    getTable(inx,3,plateType,publisherTitle,tableName,createTimeStart,createTimeEnd,sta);
                }else if(inxs == 1){
                    sessionStorage.setItem("statuTydf",'4');//已审核
                    getTable(inx,4,plateType,publisherTitle,tableName,createTimeStart,createTimeEnd,sta);
                }
            }
        }else{
                if (inxs == 0) {
                    sessionStorage.setItem("statuTydf",'3');//未审核
                    getTable(inx,3, plateType, publisherTitle, tableName, createTimeStart, createTimeEnd, sta);
                } else if (inxs == 1) {
                    sessionStorage.setItem("statuTydf",'4');//已审核
                    getTable(inx,4, plateType, publisherTitle, tableName, createTimeStart, createTimeEnd, sta);
                }
        }
        sessionStorage.setItem("titStatu",publisherTitle); //标题
        sessionStorage.setItem("plateStatu",tableName); //板块
        sessionStorage.setItem("benginStatu",createTimeStart); //创建时间
        sessionStorage.setItem("endStatu",createTimeEnd); //结束时间
        sessionStorage.setItem("passstat",sta);//已审核状态下通过或者拒绝

        return false;
    })

    //刷新
    $("#refrshbtn").click(function(){
        location.reload();
    });

    //重置
    $("#toolRelize").click(function(){
        $("#merchantName").val("");
        $("#platebox").val("");
        $("#isPass").val("");
        $("#jurisdiction-begin").val("");
        $("#jurisdiction-end").val("");
        $("#datetimepicker1").attr("data-time","");
        $("#datetimepicker2").attr("data-time","");

        var inx = $(".tab-title li.acti").index();
        var plateType = inx + 1;
        var inxs = $(".tabs-title li.active").index();
        if (inxs == 0) {
            sessionStorage.setItem("statuTydf",'3');//未审核
            getTable(inx,3);
        } else if (inxs == 1) {
            sessionStorage.setItem("statuTydf",'4');//已审核
            getTable(inx,4);
        }

        return false;
    });

    /*
    * Fun:获取当前日期并转换为字符串形式
    */
   function getNowFormatDate() {
        var date = new Date();
        var seperator1 = "-";
        var seperator2 = ":"
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
        return currentdate;
    }

})(jQuery);