(function($){
    var page = 1;
    var rows = 15;
    var userNo = yyCache.get("userno");
    var userId = yyCache.get("userId");
    var updater = yyCache.get("pcNickname");//登录人名
    var pid = '';
    var locked = true;
    var USER_URL = {
        RESOURLIST : 'operations/queryNationalShops', //(查询列表)
        DELETELIST : 'operations/deleteNationalShop', //(删除)
        ADDLIST : 'operations/newNationalShop', //(添加)
        UPDATELIST : 'operations/updateNationalShop', //(修改)
        PROVINCE: 'operations/getProvinceList',//省市接口
        SHOPNAME:'shop/listShopByMerchantId', //店铺名称
        MERCHANTNAME : 'cms_new/selectAllMerchant' //商户名称
    };

    var layer = layui.layer;
    var table = layui.table;
    var laydate = layui.date;
    layui.use(['form','laydate'], function(){
        form = layui.form;
        loadProvinceAndCity(0);//省
        form.render();
        laydate = layui.laydate;
        laydate.render({
            elem: '#jurisdiction-begin' //指定元素
        });
        laydate.render({
            elem: '#jurisdiction-end' //指定元素
        });
    })
    //加载省市数据
    function loadProvinceAndCity(parentcode, _sort){
        var param = {
            'parentcode':parentcode
        }
        var res = reqAjax(USER_URL.PROVINCE, JSON.stringify(param));
        if(res.code == 1){
            var sHtml = '<option value="">请选择</option>';
            for(var i=0, len=res.data.length; i<len; i++){
                sHtml += '<option value="'+res.data[i].code+'">'+res.data[i].areaname+'</option>'
            }
            if(parentcode == 0){
                proviceArr = res.data;
                $("#provinceSelector").html(sHtml);
            }else{

                if(_sort==1){
                    $("#provinceSelector1").html(sHtml);
                    $("#provinceSelector1").prop("disabled", false);
                    $("#provinceSelector2").prop("disabled", true);
                }else if(_sort==2){
                    $("#provinceSelector2").html(sHtml);
                    $("#provinceSelector2").prop("disabled", false);
                }

            }
        }
    }


    //渲染表单
         var objs = tableInit('tableNo', [
                    [{
                        title: '序号',
                        sort:false,
                        align: 'left',
                        field: 'eq',
                        width: 80
                    }, {
                        title: '商户名称',
                        sort:false,
                        align: 'left',
                        field: 'merchantName',
                        width: 200
                    }, {
                        title: '店铺名称',
                        sort:false,
                        align: 'left',
                        field: 'shopName',
                        width: 200
                    }, {
                        title: '是否启用',
                        sort:false,
                        align: 'left',
                       templet: '#titleTpl',
                        width: 100
                    }, {
                        title: '省',
                        sort:false,
                        align: 'left',
                        field: 'province',
                        width: 120
                    },{
                        title: '市',
                        sort:false,
                        align: 'left',
                        field: 'city',
                        width: 120
                    }, {
                        title: '区',
                        sort:false,
                        align: 'left',
                        field: 'area',
                        width: 120
                    }, {
                        title: '创建时间',
                        sort:false,
                        align: 'left',
                        field: 'createTime',
                        width: 200
                    },{
                        title: '操作',
                        fixed: 'right',
                        align: 'left',
                        toolbar: '#barDemo',
                        width: 280
                        // style: 'min-width: 300px;'
                    }]
                ],

                pageCallback,'laypageLeft',0
            );

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
            limit: 15,
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
                        data: resTwo.data,
                        limit: obj.limit
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
        if(res.code==1){
            var data = res.data;
            $.each(data, function(i, item) {
                $(item).attr('eq', (i + 1));
            });

            return res;
        }else{
            layer.msg(res.msg);
        }

    }

    //pageCallback回调
    function pageCallback(index, limit,shopName,merchantName,createTime,endTime) {
        if(merchantName == undefined){merchantName = ''}
        if(shopName == undefined){shopName = ''}
        if(createTime == undefined){createTime = ''}
        if(endTime == undefined){endTime = ''}
        var param = {
            page :index,
            rows :limit,
            sort :"updateTime",
            order:"desc"
        }
        if(shopName!=""){
            param.shopName=shopName
        }
        if(merchantName!=""){
            param.merchantName=merchantName
        }
        if(createTime!=""){
            param.beginTime=createTime
        }
        if(endTime!=""){
            param.endTime=endTime
        }
        return getData(USER_URL.RESOURLIST , JSON.stringify(param));
    }

    //省切换
    form.on('select(provinceSelector)', function(data){
        var parentcode = data.value;
        loadProvinceAndCity(parentcode,1);
        $("#provinceSelector2").html("");
        $("#provinceSelector2").prop("disabled", true);
        form.render('select');
    });

    //市切换
    form.on('select(provinceSelector1)', function(data){
        var parentcode = data.value;
        loadProvinceAndCity(parentcode,2);
        form.render('select');
    });

    //新增或者修改商户名称列表方法
    function nameDetail(res){ //type-1商户
        var sHtml = "";
        for(var i=0;i<res.data.length;i++){
            var row = res.data[i];
            if(row.orgName.length>7){
                    var ogna = row.orgName.substr(0,7);
                    var ognas = row.orgName.substr(7);
                    var orgnam = ogna + '<br>' + ognas;
                    sHtml += '<li data-merchantname="' + row.orgName + '" data-merchantId="' + row.merchantId + '">' + orgnam + '</li>';
            }else{
                    sHtml += '<li class="lgt" data-merchantname="' + row.orgName + '" data-merchantId="' + row.merchantId + '">' + row.orgName + '</li>';
            }

        }
        $("#recommendTip .namelist ul").html(sHtml);
    }

    //新增或者修改店铺名称列表方法
    function shopNamelist(res){
        var sHtml = "";
        if(res.data.shopList.length>0){
            for(var i=0;i<res.data.shopList.length;i++){
                var row = res.data.shopList[i];
                if(row.shopName.length>7){
                    var shopa = row.shopName.substr(0,7);
                    var shops = row.shopName.substr(7);
                    var shopnam = shopa + '<br>' + shops;
                    sHtml += '<li data-shopname="' + row.shopName + '" data-shopid="' + row.id + '">' + shopnam + '</li>';
                }else{
                    sHtml += '<li class="lgt" data-shopname="' + row.shopName + '" data-shopid="' + row.id + '">' + row.shopName + '</li>';
                }
            }
            $(".namehid").hide();
            $("#recommendTip1 .namelist ul").html(sHtml);
        }else if(res.data.shopList.length==0){
            $(".namehid").show();
            $("#recommendTip1 .namelist ul").html("");
        }

    }

    //商户名称初始化
    function getMerchant(orgName){
        var param = {
            "orgName" : orgName
        }
        reqAjaxAsync(USER_URL.MERCHANTNAME, JSON.stringify(param)).done(function (res) {
            if (res.code == 1) {
                nameDetail(res);
            } else {
                layer.msg(res.msg);
            }
        })

    }

    //店铺名称初始化
    function getShop(id){
        var param = {
            "merchantId" : id
        }
        reqAjaxAsync(USER_URL.SHOPNAME, JSON.stringify(param)).done(function (res) {
            if (res.code == 1) {
                shopNamelist(res);
            } else {
                layer.msg(res.msg);
            }
        })
    }

    //商户或者店铺选择效果
    $(".namelist").on("click","ul li",function(){
        $(".namelist ul li").removeClass("ave");
        $(this).addClass("ave");
    });

    //表格相关操作
    table.on('tool(tableNo)', function(obj) {
        var data = obj.data;
        var oldId = data.id;
        //查看
        if (obj.event === 'detail') {
            layer.open({
                title: ['查看详情', 'font-size:12px;background-color:#424651;color:#fff'],
                type: 1,
                content: $('#lookDemo'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                area: ['650px', '400px'],
                closeBtn: 1,
                shade: [0.1, '#fff'],
                end: function () {
                    $('#lookDemo').hide();
                },
                success: function (layero, index) {
                    $("#sysName").val(data.merchantName || "");
                    $("#lookStoreName").val(data.shopName || "");
                    if(data.enableNational == 0){
                        $("#isUserful").val("未启用");
                    }else{
                        $("#isUserful").val("启用");
                    }
                    var province = data.province || "";
                    var city = data.city ||"";
                    var arae = data.area ||"";
                    $("#areName").val(province+ city + arae);
                }
            })
        }else if(obj.event === 'change'){
            //修改
            layer.open({
                title: ['修改', 'font-size:12px;background-color:#424651;color:#fff'],
                type: 1,
                content: $('#changeDemo'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                area: ['850px', '660px'],
                closeBtn: 1,
                shade: [0.1, '#fff'],
                btn:['确定','取消'],
                end: function () {
                    $('#changeDemo').hide();
                },
                success: function (layero, index) {
                    //清空相关
                    $("#changeMerName").val("");
                    $("#changeStorName").val("");
                    $("#changeMerName").attr("data-merchantId","");
                    $("#changeStorName").attr("data-shopId","");
                    //给保存按钮添加form属性
                    $("div.layui-layer-page").addClass("layui-form");
                    $("a.layui-layer-btn0").attr("lay-submit","");
                    $("a.layui-layer-btn0").attr("lay-filter","formdemo1");
                    $("#changeMerName").val(data.merchantName);
                    $("#changeMerName").attr("data-merchantId",data.merchantId);
                    $("#changeStorName").val(data.shopName);
                    $("#changeStorName").attr("data-shopId",data.shopId);
                   /* var enables = data.enableNational;//是否启用
                    var provinceId = data.provinceId;
                    var province = data.province || "";
                    var cityId = data.cityId;
                    var city = data.city || "";
                    var areaId = data.areaId;
                    var area = data.area || "";
*/
                    var enables = data.enableNational;//是否启用
                    var provinceId = data.provinceId;
                    var province = data.province || "";
                    var cityId = data.cityId ||"";
                    var city = data.city || "";
                    var areaId = data.areaId ||"";
                    var area = data.area || "";
                    layui.use('form', function(){
                        form = layui.form;
                        $("#usingtype").val(enables);
                        loadProvinceAndCity(0);
                        loadProvinceAndCity(provinceId,1);
                        loadProvinceAndCity(cityId,2);
                        $("#provinceSelector").val(provinceId);
                        $("#provinceSelector1").val(cityId);
                        $("#provinceSelector2").val(areaId);
                        form.render();
                    })

                    //选择商户名称
                    $("#changeMerName").click(function(){
                        layer.open({
                            title: ['商户名称', 'font-size:12px;background-color:#0678CE;color:#fff'],
                            type: 1,
                            content: $('#recommendTip'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                            area: ['850px', '550px'],
                            closeBtn: 1,
                            shade: 0,
                            btn: ['保存','取消'],
                            end: function () {
                                $('#recommendTip').hide();
                            },
                            success: function (layero, index) {
                                $("#selectMerchant").val("");
                                getMerchant();
                                $("#toolSearch1").click(function(){
                                    var orgName = $.trim($("#selectMerchant").val());
                                    getMerchant(orgName);
                                });
                            },
                            yes: function (index, layero) {
                                var merchantid = $(".namelist ul li.ave").attr("data-merchantid");
                                var merchantname = $(".namelist ul li.ave").attr("data-merchantname");
                                if(merchantname==""){
                                    layer.msg("请选择商户名称");
                                }else{
                                    layer.close(index);
                                    $("#changeMerName").val(merchantname);
                                    $("#changeMerName").attr("data-merchantId",merchantid);
                                    $("#changeStorName").val(" ");
                                    $("#changeStorName").attr("data-shopid","");
                                }
                            }
                        })
                    });

                    //选择店铺名称
                    $("#changeStorName").click(function(){
                        var merchasnid = $("#changeMerName").attr("data-merchantId");
                        if(merchasnid!=""){
                            layer.open({
                                title: ['店铺名称', 'font-size:12px;background-color:#0678CE;color:#fff'],
                                type: 1,
                                shade: 0,
                                content: $('#recommendTip1'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                                area: ['850px', '550px'],
                                closeBtn: 1,
                                btn: ['保存','取消'],
                                end: function () {
                                    $('#recommendTip1').hide();
                                },
                                success: function (layero, index) {
                                    getShop(merchasnid);
                                },
                                yes: function (index, layero) {
                                    var shopid = $(".namelist ul li.ave").attr("data-shopid");
                                    var shopname = $(".namelist ul li.ave").attr("data-shopname");
                                    if(shopname==""){
                                        layer.msg("请选择店铺名称");
                                    }else{
                                        layer.close(index);
                                        $("#changeStorName").val(shopname);
                                        $("#changeStorName").attr("data-shopid",shopid);
                                    }
                                }
                            })
                        }else{
                            layer.msg("请先选择商户名称");
                        }
                    });

                },
                yes:function(index,layero){
                    form.on('submit(formdemo1)',function(data) {
                        if (data) {
                            var merchantId =$("#changeMerName").attr("data-merchantid");
                            var shopId = $("#changeStorName").attr("data-shopid") || "";
                            var enable = $("#using").find("dl dd.layui-this").attr("lay-value");
                            var provinceId = $("#upProvice").find("dl dd.layui-this").attr("lay-value")||"";
                            var province = $("#upProvice").find("dl dd.layui-this").text();
                            var cityId = $("#uCitid").find("dl dd.layui-this").attr("lay-value")||"";
                            var city = $("#uCitid").find("dl dd.layui-this").text();
                            var areaId = $("#uArea").find("dl dd.layui-this").attr("lay-value")||"";
                            var area = $("#uArea").find("dl dd.layui-this").text();
                            var parm = {
                                id:oldId,
                                shopId:shopId,
                                cityId:cityId,
                                city:city,
                                areaId:areaId,
                                area:area,
                                merchantId:merchantId,
                                enable:enable,
                                provinceId:provinceId,
                                province:province,
                                updater:updater //当前登录人名字
                            }
                            if(locked) {
                                locked = false;
                                reqAjaxAsync(USER_URL.UPDATELIST, JSON.stringify(parm)).done(function (res) {
                                    if (res.code == 1) {
                                        layer.msg(res.msg);
                                        layer.close(index);
                                        layer.closeAll();
                                        parent.layer.closeAll();
                                        setTimeout(function(){
                                            var shopName1 = $.trim($("#merchantName").val());
                                            var merchantName1 = $.trim($("#storeName").val());
                                            var createTime = $("#jurisdiction-begin").val();
                                            var endTime = $("#jurisdiction-end").val();
                                            getTable(shopName1,merchantName1,createTime,endTime);
                                            locked = true;
                                        },500);
                                    } else {
                                        layer.msg(res.msg);
                                        locked = true;
                                    }
                                })
                            }
                        }
                        return false;//禁止刷新
                    });
                },
                btn1: function(index, layero){
                    layer.close(index);
                }
            })
        }else if(obj.event === 'del'){
            //删除
            layer.confirm("确认删除？",{icon:0,title:"提示"}, function (index) {
                var parms = {
                    id:oldId
                }
                reqAjaxAsync(USER_URL.DELETELIST,JSON.stringify(parms)).done(function(res) {
                    if (res.code == 1) {
                        layer.close(index);
                        layer.msg("已删除");
                        var shopName = $.trim($("#merchantName").val());
                        var merchantName = $.trim($("#storeName").val());
                        var createTime = $("#jurisdiction-begin").val();
                        var endTime = $("#jurisdiction-end").val();
                        getTable(shopName,merchantName,createTime,endTime);
                    } else {
                        layer.msg(res.msg);
                    }
                })
            })
        }
    });

    //点击表格变色
    $('#noAudit .layui-table-body').on('click','tr',function(){
        $(this).addClass('layui-table-click').siblings().removeClass('layui-table-click');
    });


    //加了入参的公用方法
    function getTable(shopName,merchantName,createTime,endTime){
            var initPage = objs.tablePage;
            var initTable = objs.tableIns;
            var res = pageCallback(1,15,shopName,merchantName,createTime,endTime);
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
                    var resTwo = pageCallback(obj.curr, obj.limit,shopName,merchantName,createTime,endTime);
                if(resTwo && resTwo.code == 1)
                    initTable.reload({
                        data: resTwo.data,
                        limit: obj.limit
                    });
                else
                    layer.msg(resTwo.msg);
            }
        }
        layui.laypage.render(page_options);
    }

    //添加
    $("#commonAdd").on("click",function(){
        layer.open({
            title: ['添加', 'font-size:12px;background-color:#424651;color:#fff'],
            type: 1,
            content: $('#changeDemo'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
            area: ['850px', '550px'],
            closeBtn: 1,
            shade: [0.1, '#fff'],
            btn:['保存'],
            end: function () {
                $('#changeDemo').hide();
            },
            success: function (layero, index) {
                //省市相关
                layui.use('form', function(){
                    form = layui.form;
                    loadProvinceAndCity(0);//省
                    $("#provinceSelector1").html("");
                    $("#provinceSelector2").html("");
                    $("#provinceSelector1").prop("disabled", true);
                    $("#provinceSelector2").prop("disabled", true);
                    form.render();
                })
                $("#changeMerName").val("");
                $("#changeStorName").val("");
                $("#changeMerName").attr("data-merchantId","");
                $("#changeStorName").attr("data-shopId","");
                //给保存按钮添加form属性
                $("div.layui-layer-page").addClass("layui-form");
                $("a.layui-layer-btn0").attr("lay-submit","");
                $("a.layui-layer-btn0").attr("lay-filter","formdemo2");

                //选择商户名称
                $("#changeMerName").click(function(){
                    layer.open({
                        title: ['商户名称', 'font-size:12px;background-color:#424651;color:#fff'],
                        type: 1,
                        content: $('#recommendTip'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                        area: ['850px', '560px'],
                        closeBtn: 1,
                        shade: 0,
                        btn: ['保存','取消'],
                        end: function () {
                            $('#recommendTip').hide();
                        },
                        success: function (layero, index) {
                            $("#selectMerchant").val("");
                            getMerchant();
                            $("#toolSearch1").click(function(){
                                var orgName = $.trim($("#selectMerchant").val());
                                getMerchant(orgName);
                            });
                        },
                        yes: function (index, layero) {
                            var merchantid = $(".namelist ul li.ave").attr("data-merchantid");
                            var merchantname = $(".namelist ul li.ave").attr("data-merchantname");
                            if(merchantname==""){
                                layer.msg("请选择商户名称");
                            }else{
                                layer.close(index);
                                $("#changeMerName").val(merchantname);
                                $("#changeMerName").attr("data-merchantId",merchantid);
                                $("#changeStorName").val(" ");
                                $("#changeStorName").attr("data-shopid","");
                            }
                        }
                    })
                });

                //选择店铺名称
                $("#changeStorName").click(function(){
                    var merchasnid = $("#changeMerName").attr("data-merchantId");
                    if(merchasnid!=""){
                        layer.open({
                            title: ['店铺名称', 'font-size:12px;background-color:#424651;color:#fff'],
                            type: 1,
                            shade: 0,
                            content: $('#recommendTip1'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                            area: ['850px', '550px'],
                            closeBtn: 1,
                            btn: ['保存','取消'],
                            end: function () {
                                $('#recommendTip1').hide();
                            },
                            success: function (layero, index) {
                                getShop(merchasnid);
                            },
                            yes: function (index, layero) {
                                var shopid = $(".namelist ul li.ave").attr("data-shopid");
                                var shopname = $(".namelist ul li.ave").attr("data-shopname");
                                if(shopname==""){
                                    layer.msg("请选择店铺名称");
                                }else{
                                    layer.close(index);
                                    $("#changeStorName").val(shopname);
                                    $("#changeStorName").attr("data-shopid",shopid);
                                }
                            }
                        })
                    }else{
                        layer.msg("请先选择商户名称");
                    }
                });

            },
            yes:function(index,layero){
                form.on('submit(formdemo2)',function(data) {
                    if (data) {
                        var merchantId =$("#changeMerName").attr("data-merchantId");
                        var shopId = $("#changeStorName").attr("data-shopid");
                        var enable = $("#using").find("dl dd.layui-this").attr("lay-value");
                        var provinceId = $("#upProvice").find("dl dd.layui-this").attr("lay-value")||"";
                        var province = $("#upProvice").find("dl dd.layui-this").text();
                        var cityId = $("#uCitid").find("dl dd.layui-this").attr("lay-value")||"";
                        var city = $("#uCitid").find("dl dd.layui-this").text();
                        var areaId = $("#uArea").find("dl dd.layui-this").attr("lay-value")||"";
                        var area = $("#uArea").find("dl dd.layui-this").text();
                        var parm = {
                            merchantId:merchantId,
                            enable:enable,
                            provinceId:provinceId,
                            shopId:shopId,
                            cityId:cityId,
                            city:city,
                            areaId:areaId,
                            area:area,
                            province:province,
                            creater:updater //当前登录人名字
                        }
                        if(locked) {
                            locked = false;
                            reqAjaxAsync(USER_URL.ADDLIST, JSON.stringify(parm)).done(function (res) {
                                if (res.code == 1) {
                                    layer.msg(res.msg);
                                    layer.close(index);
                                    layer.closeAll();
                                    parent.layer.closeAll();
                                    setTimeout(function(){
                                        var merchantName1 = $.trim($("#merchantName").val());
                                        var shopName1= $.trim($("#storeName").val());
                                        var createTime = $("#jurisdiction-begin").val();
                                        var endTime = $("#jurisdiction-end").val();
                                        getTable(shopName1,merchantName1,createTime,endTime);
                                        locked = true;
                                    },500);
                                } else {
                                    layer.msg(res.msg);
                                    locked = true;
                                }
                            })
                        }
                    }
                    return false;//禁止刷新
                });
            }
        })
    });



    //点击顶部搜索出现各搜索条件
    $('#search').on('click',function(){
        $('#search-tool').slideToggle(200);
    });

    //搜索条件进行搜索
    $('#toolSearch').on('click',function(){
        var merchantName = $.trim($("#merchantName").val());
        var shopName = $.trim($("#storeName").val());
        var createTime = $("#jurisdiction-begin").val();
        var endTime = $("#jurisdiction-end").val();
        var begtm = $("#jurisdiction-begin").parent().attr("data-time");
        var endtme = $("#jurisdiction-end").parent().attr("data-time");
        if(createTime!="" && endTime==""){
            layer.msg("请选择截止时间");
            return;
        }
        if(createTime=="" && endTime!=""){
            layer.msg("请选择开始时间");
            return;
        }
        if(createTime !="" && endTime !=""){
            if(begtm>endtme){
                layer.msg("开始时间必须早于截止时间哟");
            }else{
                getTable(shopName,merchantName,createTime,endTime);
            }
        }


        getTable(shopName,merchantName,createTime,endTime);

    })



    //重置
    $("#toolRelize").click(function(){
        $("#merchantName").val("");
        $("#storeName").val("");
        $("#jurisdiction-begin").val("");
        $("#jurisdiction-end").val("");
        $("#jurisdiction-begin").parent().attr("data-time","");
        $("#jurisdiction-end").parent().attr("data-time","");
    });
})(jQuery);