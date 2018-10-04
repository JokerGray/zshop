    var page = 1;
    var rows = 10;
    var locked = true;
    var apikey = getUrlParams('apikey') || sessionStorage.getItem("apikey") ||"test";
    var merchantId =getUrlParams('merchantId'); //商户id
    var arr = [];
    var selectArr=[];
    var k=0;
    //接口参数
    var USER_URL = {
        NOBOUND :'scavengingCode/findShopGoodsNothingBarCode', //(查询未绑定编码接口)
        TREELIST : 'scavengingCode/findAllCategory', //(树)
        SAVERESOURCE:'scavengingCode/addBarCode', //(绑定)
        BARCODENO:'scavengingCode/findBarCodeIsNo' //(查询条码是否存在)
    };

    var layer = layui.layer;
    var table = layui.table;
    layui.use('form', function(){
        form = layui.form;
    })

    //初始化
    $(function(){
        //1.初始化Table
        var oTable = new TableInit();
        oTable.Init();
    });

    //搜索
    $("#search").on("click",function(){
        $('#table').bootstrapTable('refresh');
        $(".nodata").show();
        $("#listBound tbody").html("");
        selectArr=[];
    });


    var TableInit = function () {
        var oTableInit = new Object();
        //初始化Table

        oTableInit.Init = function () {
            $('#table').bootstrapTable({
                url: '/zxcity_restful/ws/rest',         //请求后台的URL（*）
                method: 'POST',                      //请求方式（*）
                toolbar: '#toolbar',                //工具按钮用哪个容器
                striped: true,                      //是否显示行间隔色
                cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
                pagination: true,                   //是否显示分页（*）
                sortable: false,                     //是否启用排序
                sortOrder: "asc",                   //排序方式
                contentType: "application/x-www-form-urlencoded",//解决POST，后台取不到参数
                queryParams: oTableInit.queryParams,//传递参数（*）
                sidePagination: "server",      //分页方式：client客户端分页，server服务端分页（*）
                pageNumber:page,            //初始化加载第一页，默认第一页
                pageSize: rows,            //每页的记录行数（*）
                pageList: [rows,20],    //可供选择的每页的行数（*）
                smartDisplay: false,
                strictSearch: true,
                clickToSelect: true,        //是否启用点击选中行
                uniqueId: "id",           //每一行的唯一标识，一般为主键列
                cardView: false,          //是否显示详细视图
                detailView: false,          //是否显示父子表
                singleSelect : false,        //是否只能选中一个
                apikey: apikey,
                ajaxOptions:{
                    headers:{'apikey':apikey}
                },
                responseHandler:function(res){
                    console.log(res)
                    if(res.code == 1){
                        $("#listBound tr .delete").show();
                        for(var i=0;i<selectArr.length;i++){
                            for(var j=0;j<res.data.length;j++){
                                if(selectArr[i]==res.data[j].stockId){
                                    res.data[j].checked=true;
                                }
                            }

                        }
                        return {
                            "total": res.total,//总页数
                            "rows": res.data   //数据
                        };
                    }else{
                        layer.alert(res.msg);
                    }
                },
                columns: [ {
                    field : 'checked',
                    checkbox : true,
                    align: 'center' // 居中显示
                }, {
                    field: 'goodsName',
                    title: '商品名称',
                    align : "center",
                    width:"300px"
                }, {
                    field: 'stockName',
                    title: '商品规格',
                    align : "center",
                    width:"150px"
                }, {
                    field: 'barCode',
                    title: '条形码',
                    align:'center',
                    width:"180px"
                }]
            });
        };


        //得到查询的参数
        oTableInit.queryParams = function (params) {
            var cmd = USER_URL.NOBOUND;
            var pageNo = params.offset/params.limit+1;
            var pageSize = params.limit;
            var goodsName = $.trim($("#searchName").val()) || "";
            var categoryId = $("#searchClass").attr("data-id") || "";

            var jsonData = {
                'merchantId':merchantId, //商户id
                'goodsName':goodsName, //商品名称
                'categoryId':categoryId, //分类id
                'page':pageNo,
                'rows':pageSize
            }

            var version = "1";

            return{
                page: params.offset/params.limit+1,
                rows: params.limit,
                cmd: cmd,
                data: JSON.stringify(jsonData),
                version: version
            }
        };

        return oTableInit;
    };


    //左侧表翻页事件
    $('#table').on('page-change.bs.table', function (e, number, size) {
        $(".nodata").show();
        $("#listBound tbody").html("");
        selectArr=[];
    })

    //点击选择右侧出现
    $("#btnAdd").on("click",function(){
        var a= $("#table").bootstrapTable('getSelections');
        if(a.length>0){
            selectArr=[];
            arr=[];
            rgtTable(a);
            $(".nodata").hide();
        }else{
            layer.msg("请选中一行",{icon: 6})
        }
    });

    //右侧列表加载方法
    function rgtTable(res){
        var sHtml="";
        for(var i=0;i<res.length;i++){
            var row = res[i];
            sHtml += '<tr data-stockId="'+  row.stockId +'" data-id="'+ row.goodsId +'">' +
                        '<td>' + row.goodsName + '</td>' +
                        '<td>' + row.stockName + '</td>' +
                        '<td>' + row.categoryName + '</td>' +
                        '<td>' + '<input lay-verify="number" class="code" maxlength="24" type="text"><span class="clearbtn">清空</span><span class="delete glyphicon glyphicon-remove-sign"></span>' + '</td>' +
                    '</tr>';
            selectArr.push(row.stockId);
        }
        $("#listBound tbody").html(sHtml);
        $("#listBound tbody tr").eq(0).addClass("actv");
        $("#listBound tbody tr").eq(0).find("input").focus();
    }

    //清空
    $("#listBound").on("click","tr .clearbtn",function(){
        var index = $(this).parents("tr").index();
        $("#listBound tbody tr").eq(index).siblings().removeClass("actv");
        $("#listBound tbody tr").eq(index).addClass("actv");
        $("#listBound tbody tr").eq(index).find("input").val("");
        $("#listBound tbody tr").eq(index).find("input").focus();
    });

    //删除数组指定元素
    Array.prototype.indexOf = function(val) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == val) return i;
        }
        return -1;
    };
    Array.prototype.remove = function(val) {
        var index = this.indexOf(val);
        if (index > -1) {
            this.splice(index, 1);
        }
    };

    //删除
    $("#listBound").on("click","tr .delete",function(){
        var id = $(this).parents("tr").attr("data-stockid");
        var a= $("#table").bootstrapTable('getSelections');
        var index = $(this).parents("tr").index();
        selectArr.remove(id);
        $('#table').bootstrapTable('refresh');
        $(this).parents("tr").remove();
        $("#listBound tr .delete").hide();
    });

    //表格分页之前处理多选框数据
    function responseHandler(res) {
        $.each(res.rows, function (i, row) {
            row.checkStatus = $.inArray(row.id, selectionIds) != -1;  //判断当前行的数据id是否存在与选中的数组，存在则将多选框状态变为true
        });
        return res;
    }


    //扫码进入下一个
    $("#listBound").on("keypress","tr .code",function(event){
        var index = $(this).parents("tr").index();
        var length = $("#listBound tbody tr").length;
        k++;
            if (event.keyCode == 13) {
                if(k==14){
                    var val = $(this).val();
                    if(arr.length>0){
                        for(var i=0;i<arr.length;i++){
                            if(val==arr[i]){
                                $(this).val("");
                                k=0;
                                layer.msg("每个商品只能绑定唯一条码",{icon: 6});
                                return false;

                            }
                        }
                    }
                    if(val !=""){
                        findOne(val,index);

                        if(index<length-1){
                            $("#listBound tbody tr").eq(index+1).siblings().removeClass("actv");
                            $("#listBound tbody tr").eq(index+1).addClass("actv");
                            $("#listBound tbody tr").eq(index+1).find("input").focus();
                            arr.push(val);
                        }
                    }
                }
                k=0;

            }

    });

    //查询是否存在重复条码
    function findOne(code,e){
        var param = {
            'barCode':code,
            'merchantId':merchantId
        }
        reqAjaxAsync(USER_URL.BARCODENO,JSON.stringify(param)).done(function(res){
            if(res.code == 1){
                if(res.data.barCodeNum!=0){
                    $("#listBound tr .code").eq(e).val("");
                    layer.msg("重复条码请重新输入");
                    k=0;
                    return false;
                }
            }else{
                layer.msg(res.msg);
            }
        })
    }

    //提交
    $("#btnSum").on("click",function(){
        var list = $("#listBound tbody tr");
        var inputlist =$("#listBound tbody input");
        var flag = true;   //假设不重复

        if(list.length>0){
            for(var b = 0;b < inputlist.length-1;b++){ //循环开始元素
                for(var j =b + 1;j < inputlist.length;j++){ //循环后续所有元素
                    //如果相等，则重复
                    if(inputlist.eq(b).val() == inputlist.eq(j).val()){
                        flag = false; //设置标志变量为重复
                        break;      //结束循环
                    }
                }
            }
            console.log(flag)

            for(var i=0;i<inputlist.length;i++){
                var val = inputlist.eq(i).val();
                if(val==""){
                    layer.msg("请输入商品条码",{icon: 6});
                    return false;
                }
            }

            // for(var b=0;b<list.length;b++){
            //     if(inputlist.eq(b).val().length!=13){
            //         layer.msg("请输入正确的条码",{icon:6});
            //         return false;
            //     }
            // }
            if(flag){
                form.on('submit(sub)', function(data){
                   if(data){
                    //调接口
                       var barCodeArr = []; //数组
                       for(var k=0;k<list.length;k++){
                           barCodeArr.push({
                               'barCode':inputlist.eq(k).val(),
                               'goodsId':list.eq(k).attr("data-id"),
                               'stockId':list.eq(k).attr("data-stockId"),
                               'merchantId':merchantId
                           })
                       }
                      addCode(barCodeArr);
                   }
                    return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
                });

            }else{
                layer.msg("条码重复请重新输入",{icon: 6})
                return false
            }
        }else{
            layer.msg("请选中要绑定的商品",{icon: 6})
            return false
        }
    });

    //绑定调接口
    function addCode(barCode){
        if(locked){
            locked = false;
            reqAjaxAsync(USER_URL.SAVERESOURCE,JSON.stringify(barCode)).done(function(res){
                if(res.code == 1){
                    layer.msg(res.msg);

                    setTimeout(function(){
                        // $('#table').bootstrapTable('refresh');
                        $(".nodata").show();
                        $("#listBound tbody").html("");
                        locked = true;
                    },500);
                }else{
                    layer.msg(res.msg);
                    locked = true;
                }
                setTimeout(function () {
                    window.location.reload()
                },1000)

            });
        }
    }

    //分类树
    //加载右侧导航树
    function getTreess(){
        var setting = {
            check: {
                enable: true,
                chkStyle: "radio",
                radioType: "all",
                nocheckInherit: true,
                chkDisabledInherit: true,
                chkboxType:  { "Y" : "s", "N" : "ps" },
                selectedMulti: true //不允许同时选中多个节点
            },
            data: {
                simpleData: {
                    enable: true,
                    idKey: "id",
                    pIdKey: "pid"
                }
            }


        };
        var param = {
            'category_type':1, //线上或线下标识（0-线上手机版，1-线上PC版，2-线下）
            'merchant_id':merchantId//商户id
        }
        reqAjaxAsync(USER_URL.TREELIST,JSON.stringify(param)).done(function(res){
            if(res.code == 1){
                var treeData = res.data;
                for(var i = 0; i < treeData.length; i++) {
                    treeData[i].name = treeData[i].text;
                }
                treeObjss = $.fn.zTree.init($("#ztree"), setting, treeData);
            }else{
                layer.msg(res.msg);
            }
        })
    }


    //选择分类
    $("#searchClass").on("click",function(){
        layer.open({
            title: ['商品分类', 'font-size:12px;background-color:#353b53;color:#1be0d6'],
            type: 1,
            content: $('#treeBox'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
            area: ['400px', '600px'],
            btn: ['确认', '取消'],
            shade: [0.1, '#fff'],
            end: function () {
                $('#treeBox').hide();
            },
            success: function (layero) {
                getTreess();
            },
            yes: function (index, layero) {
                var nodes = treeObjss.getCheckedNodes(true);
                if(nodes.length>0){
                    var childrens = nodes[0].children;
                    if(childrens.length==0&&nodes.length==1){ //不是父级
                        $("#searchClass").val(nodes[0].text);
                        $("#searchClass").attr("data-id",nodes[0].id);
                        layer.close(index);
                    }else{
                        layer.msg("此分类下仍有子集，请选择子分类！",{icon: 6})
                    }
                }else{
                    $("#searchClass").val("");
                    $("#searchClass").attr("data-id","");
                    layer.close(index);
                }
            }
        })
    });

    //右侧选中某一个效果
    $("#listBound").on("click","tr",function(){
        $(this).addClass("actv");
        $(this).siblings().removeClass("actv");
    });
