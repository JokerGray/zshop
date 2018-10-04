(function($){

    var page = 1;
    var rows = 10;
    var locked = true;
    var USER_URL = {
        RESOURLIST : 'operations/queryPacksList', //(查询)
        ADDRESOURCE : 'operations/addPacks',//(新增)1是优惠券,2是智币,3是现金(1-礼包ID;1-礼包id;2-数量;3-数量)
        UPDATERESOURCE :'operations/modifyPacks',//(修改)
        DELRESOURCE :'operations/modifyPacks',//(禁用)0禁用。1启用
        COUPON : 'operations/selectAllScCoupon', //(优惠券)
        PACKINFO : 'operations/getPacksDetail' //(详情)
    };

    var layer = layui.layer;
    var table = layui.table;
    layui.use('form', function(){
        form = layui.form;
    })

//渲染表单
    var obj = tableInit('table', [
            [{
                title: '序号',
               /* sort: true,*/
                align: 'left',
                field: 'eq',
                width: 80
            }, {
                title: '礼包名称',
                /*sort: true,*/
                align: 'left',
                field: 'packsName',
                width: 200
            }, {
                title: '产品名称',
               /* sort: true,*/
                align: 'left',
                field: 'markName',
                width: 200
            }, {
                title: '产品描述',
               /* sort: true,*/
                align: 'left',
                field: 'packsDescription',
                width: 250
            }, {
                title: '操作',
                fixed: 'right',
                align:'left',
                toolbar: '#barDemor',
                width: 250
            }]
        ],
        pageCallback
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
            height:'full-248',
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

    //序号遍历用户类型和用户等级重新编译
    function getData(url,parms){
        var res =reqAjax(url,parms);
        var data = res.data;
        $.each(data,function(i,item){
            $(item).attr('eq',(i+1));
            if(item.productMark == 1){
                $(item).attr('markName','APP');
            }else if(item.productMark == 2){
                $(item).attr('markName','商品后台');
            }else if(item.productMark == 3){
                $(item).attr('markName','展示端');
            }else if(item.productMark == 4){
                $(item).attr('markName','智大师');
            };
        })
        return res;
    }

    //pageCallback回调

    function pageCallback(index, limit ,packsName,productMark) {
        if(packsName == undefined){packsName = ''}
        if(productMark == undefined){productMark = ''}
        var param = {
            page:index,
            rows:limit,
            packsName:packsName, //礼包名称
            productMark:productMark //所属产品
        }
        return getData(USER_URL.RESOURLIST,JSON.stringify(param));
    }


    //加了入参的公用方法
    function getTable(packsName,productMark){
        var initPage = obj.tablePage;
        var initTable = obj.tableIns;
        var res = pageCallback(1, 15,packsName,productMark);
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
                var resTwo = pageCallback(obj.curr, obj.limit,packsName,productMark);
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

    //表内操作
    table.on('tool(table)', function(obj){
        var data = obj.data;
        //查看
        if(obj.event === 'detail'){
            layer.open({
                title: ['查看详情', 'font-size:12px;background-color:#0678CE;color:#fff'],
                type: 1,
                content: $('#details'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                area: ['700px', '400px'],
                shade: [0.1, '#fff'],
                resize:false,
                end:function(){
                    $('#details').hide();
                },
                success: function (layero, index) {
                    getInfo(data.id);
                }
            })
        }else if(obj.event === 'change'){
            layer.open({
                title: ['修改', 'font-size:12px;background-color:#0678CE;color:#fff'],
                type: 1,
                content: $('#changeDetail'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                area: ['800px', '600px'],
                shade: [0.1, '#fff'],
                btn:['保存','取消'],
                resize:false,
                end:function(){
                    $('#changeDetail').hide();
                },
                success: function (layero, index) {
                    getChange(data.id);
                    //新增模态框 input限制输数字
                    /*$("#select-boxs").on("keyup",".packagemoney input",function(){
                        $(this).val($(this).val().replace(/[^0-9.]/g,''));
                    });*/

                    //删除
                    $("#select-boxs").on("click",".deletebtn i",function(){
                        $(this).parents(".packagelist").remove();
                    });

                    $("#select-boxs").on("keyup",".packagecoin input",function(){
                        $(this).val($(this).val().replace(/\D/g,''));
                    });

                    $("#select-boxs").find(".packagelist").eq(0).find(".deletebtn").hide();
                },
                yes:function(index,layero){
                    var amountExp = /^([1-9]{1}[0-9]{0,7}|0){1}(.[0-9]{1,2}){0,1}$/;//金额
                    var lost = $("#select-boxs").find(".packagemoney input");
                    for(var k=0;k<lost.length;k++){
                        if(lost.eq(k).val()!=""){
                            if(!amountExp.test(lost.eq(k).val())){
                                lost.eq(k).val("");
                                layer.msg("请输入正确的金额");
                                return;
                            }
                        }
                    }
                    sub2(data.id,index);
                }
            })
        }else if(obj.event === 'del'){
            var isAvailable = data.isAvailable;
            if(isAvailable == 1){
                layer.confirm(
                    "弃用后将不能修改和启用",
                    {icon: 3, title:'提示'},
                    function(index){
                        var paramDel = {
                            id : data.id,
                            isAvailable : 0
                        };
                        reqAjaxAsync(USER_URL.DELRESOURCE, JSON.stringify(paramDel)).done(function(res){
                            if (res.code == 1) {
                                layer.msg(res.msg);
                                layer.close(index);
                                var productMark = $("#payLocK").find("option:selected").val(); //所属产品
                                var packsName = $("#merchantName").val(); //礼包名称
                                getTable(packsName,productMark);
                            } else {
                                layer.msg(res.msg);
                            }
                        });
                    });
            }
        }
    });

    //添加
    $("#commonAdd").click(function(){
        layer.open({
            title: ['添加', 'font-size:12px;background-color:#0678CE;color:#fff'],
            type: 1,
            content: $('#addDetail'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
            area: ['800px', '600px'],
            shade: [0.1, '#fff'],
            btn:['保存','取消'],
            resize:false,
            end:function(){
                $('#addDetail').hide();
                $("#addDetail").find("input").val("");
                $("#addDetail").find("textarea").val("");
                $("#select-box").html("");
            },
            success: function (layero, index) {
                $("#select-box").append(packagecont);
                $("#select-box").find(".packagelist").eq(0).find(".deletebtn").hide();
                couponType($("#select-box"));
                //新增模态框 input限制输数字
                $("#select-box").on("keyup",".packagecoin input",function(){
                    $(this).val($(this).val().replace(/\D/g,''));
                });
                $('#systemName').blur(function(){
                    $('#systemName').css("border","1px solid #e6e6e6");
                });
                $('#systemNote').blur(function(){
                    $('#systemNote').css("border","1px solid #e6e6e6");
                });

                //删除
                $("#select-box").on("click",".deletebtn i",function(){
                    $(this).parents(".packagelist").remove();
                });
            },
            yes:function(index,layero){
                var amountExp = /^([1-9]{1}[0-9]{0,7}|0){1}(.[0-9]{1,2}){0,1}$/;//金额
                var lost = $("#select-box").find(".packagemoney input");
                for(var k=0;k<lost.length;k++){
                 if(lost.eq(k).val()!=""){
                 if(!amountExp.test(lost.eq(k).val())){
                 lost.eq(k).val("");
                 layer.msg("请输入正确的金额");
                 return;
                        }
                    }
                 }
                sub(index);
            }
        })
    });


    //优惠券类型
    function couponType(event){
            var opHtml = "";
            var res = reqAjax(USER_URL.COUPON,"");
            if(res.code == 1){
                for(var i = 0;i<res.data.length;i++){
                    var row = res.data[i];
                    opHtml += "<option value='" + row.id + "'>" + row.name + "</option>";
                }
                event.find(".packagecard .selectcoupon").append(opHtml);
            }else{
                layer.msg(res.msg);
            }
    };
    couponType($("#select-box"));


    //下拉选中方法
    function changSele(e){
        var val = e.children('option:selected').val();
        if(val == 1){
            e.next().show();
            e.parent().find(".packagecoin").hide();
            e.parent().find(".packagemoney").hide();
            couponType($("#select-boxs"));
        }else if(val == 2){
            e.next().hide();
            e.parent().find(".packagecoin").show();
            e.parent().find(".packagemoney").hide();
        }else if(val == 3){
            e.next().hide();
            e.parent().find(".packagecoin").hide();
            e.parent().find(".packagemoney").show();
        }
    }

    //新增下拉选中
    $("#select-box").on("change",".packagelist .show-tick",function(){
        changSele($(this));
    });
    $("#select-boxs").on("change",".packagelist .show-tick",function(){
        changSele($(this));
    });

    //添加
    var packagecont = '<div class="packagelist">'+
        '<select class="selectpicker show-tick form-control">' +
            '<option value="1">优惠券</option>' +
            '<option value="2">智币</option>'+
            '<option value="3">现金</option>'+
        '</select>'+
        '<div class="layui-input-inline packagecard" >'+
            '<select  name="coupon" class="selectcoupon form-control">' +
                '<option value="">请选择</option>' +
            '</select>'+
        '</div>' +
        '<div class="layui-input-inline packagecoin select-text">' +
            '<input placeholder="数量" name="coin"  autocomplete="off"  class="layui-input" type="text" value=""  maxlength="5">' +
        '</div>' +
        '<div class="layui-input-inline packagemoney select-text">' +
            '<input placeholder="RMB" name="money"  autocomplete="off"  class="layui-input" type="text" value="" maxlength="5">' +
        '</div>'+
        '<div class="deletebtn"><i title="删除" class="layui-icon">&#x1007;</i></div>'+
    '</div>';

    $("#addPackage").click(function(){
        $("#select-box").append(packagecont);
        $("#select-box").find(".packagelist").eq(0).find(".deletebtn").hide();
        couponType($("#select-box"));
    });

    //修改（添加）
    var packageconts = '<div class="packagelist">'+
        '<select class="selectpicker show-tick form-control">' +
        '<option value="1">优惠券</option>' +
        '<option value="2">智币</option>'+
        '<option value="3">现金</option>'+
        '</select>'+
        '<div class="layui-input-inline packagecard" >'+
        '<select  name="coupon" class="selectcoupon form-control">' +
        '<option value="">请选择</option>' +
        '</select>'+
        '</div>' +
        '<div class="layui-input-inline packagecoin select-text">' +
        '<input placeholder="数量" name="coin"  autocomplete="off"  class="layui-input" type="text" value=""  maxlength="5">' +
        '</div>' +
        '<div class="layui-input-inline packagemoney select-text">' +
        '<input placeholder="RMB" name="money"  autocomplete="off"  class="layui-input" type="text" value="" maxlength="5">' +
        '</div>'+
            '<div class="deletebtn"><i title="删除" class="layui-icon">&#x1007;</i></div>'+
        '</div>';

    $("#addPackages").click(function(){
        $("#select-boxs").append(packageconts);
        $("#select-boxs").find(".packagelist").eq(0).find(".deletebtn").hide();
        couponType($("#select-boxs"));
    });
    //二级下拉不能重复方法
    function repeat(e){
        var eval = e.children('option:selected').val();
        var couponss = $(".packagecard select").children('option:selected');//优惠券的类型
        var srr=[];
        for(var i=0;i<couponss.length;i++){
            if(couponss.eq(i).val() != "" && couponss.eq(i).val() != " "){
                srr.push(couponss.eq(i).val());
            }
        }
        console.log(srr);
        var nary=srr.sort();
        for(var q=0;q<srr.length;q++){
            if(nary[q] == nary[q+1]){
                e.children('option').attr("selected", false);
                e.children('option').eq(0).attr("selected");
                layer.msg("您已选择了此优惠券，请重新选择");
            };
        }
    }

    //二级优惠券选择
    $("#select-box").on("change",".packagecard select",function(){
        repeat($(this));
    });
    $("#select-boxs").on("change",".packagecard select",function(){
      repeat($(this));
    });

    //保存方法
    function sub(index) {//则添加保存
        var systemName = $.trim($('#systemName').val()); //礼包名称
        var systemType = $("#addBasic").children('option:selected').val();//产品标识
        var systemSort = $.trim($('#systemNote').val()) ; //礼包描述
        var packagetype =$("#select-box").find(".packagelist .show-tick").children('option:selected');
        var coupon = $("#select-box").find(".packagecard select").children('option:selected');//优惠券的类型
        var packagecoin = $("#select-box").find(".packagelist .packagecoin").find("input");//智币
        var packagemoney = $("#select-box").find(".packagelist .packagemoney").find("input");//现金
        var arr = [];//优惠券
        var brr = [];//智币
        var crr = [];//现金
        if(systemName==""){
            $('#systemName').css("border","1px solid red");
            layer.msg('礼包名称不能为空', {time: 5000, icon:6});
            return;
        }
        $('#systemName').blur(function(){
            $('#systemName').css("border","1px solid #e6e6e6");
        });
        if(systemSort==""){
            $('#systemNote').css("border","1px solid red");
            layer.msg('礼包描述不能为空', {time: 5000, icon:6});
            return;
        }
        $('#systemNote').blur(function(){
            $('#systemNote').css("border","1px solid #e6e6e6");
        });
        for(var i=0;i<packagetype.length;i++){
            if(packagetype.eq(i).val() == 1){
                if( coupon.eq(i).val() == "" || coupon.eq(i).val() == " "){
                    layer.msg('请选择优惠券类型', {time: 5000, icon:6});
                    return;
                }else{
                    arr.push("1-" + coupon.eq(i).val());
                }
             };
             if(packagetype.eq(i).val() == 2){
                 if(packagecoin.eq(i).val() == ""){
                     layer.msg('请填写智币数量', {time: 5000, icon:6});
                     return;
                 }else{
                     brr.push("2-" + packagecoin.eq(i).val());
                 }
             };
             if(packagetype.eq(i).val() == 3){
                 if(packagemoney.eq(i).val() == ""){
                     layer.msg('请填写现金', {time: 5000, icon:6});
                     return;
                 }else{
                     crr.push("3-" + packagemoney.eq(i).val());
                 }
             }
        }
        var drr = $.merge(arr, brr);
        var newarr = $.merge(drr, crr);
        var stringrr = newarr.join(";");
        var couponval = coupon.text();
        var coinval = packagecoin.val();
        var moneyval = packagemoney.val();
        var paramInfod = {
            packsName : systemName,
            productMark : systemType,
            packsDescription : systemSort,
            packsContent : stringrr
        };
        if(locked){
            locked = false;
            reqAjaxAsync(USER_URL.ADDRESOURCE, JSON.stringify(paramInfod)).done(function(res){
                if (res.code == 1) {
                    layer.msg(res.msg);
                    layer.close(index);
                    $("#select-box").html("");
                    setTimeout(function(){
                        var productMark = $("#payLocK").find("option:selected").val(); //所属产品
                        var packsName = $("#merchantName").val(); //礼包名称
                        getTable(packsName,productMark);
                        locked = true;
                    },500);
                } else {
                    layer.msg(res.msg);
                    locked = true;
                }
            });
        }
    }

   //修改保存
    function sub2(id,index) {//
        var systemName = $.trim($('#changname').val()); //礼包名称
        var systemType = $("#changbasic").children('option:selected').val();//产品标识
        var systemSort = $.trim($('#packageinfoNote').val()) ; //礼包描述
        var packagetype =$("#select-boxs").find(".packagelist .show-tick").children('option:selected');
        var coupon =$("#select-boxs").find(".packagecard select").children('option:selected');//优惠券的类型
        var packagecoin =$("#select-boxs").find(".packagelist .packagecoin").find("input");//智币
        var packagemoney =$("#select-boxs").find(".packagelist .packagemoney").find("input");//现金
        var arr = [];//优惠券
        var brr = [];//智币
        var crr = [];//现金
        if(systemName==""){
            $('#changname').css("border","1px solid red");
            layer.msg('礼包名称不能为空', {time: 5000, icon:6});
            return;
        }
        $('#changname').blur(function(){
            $('#changname').css("border","1px solid #e6e6e6");
        });
        if(systemSort==""){
            $('#changcont').css("border","1px solid red");
            layer.msg('礼包描述不能为空', {time: 5000, icon:6});
            return;
        }
        $('#changcont').blur(function(){
            $('#changcont').css("border","1px solid #e6e6e6");
        });
        for(var i=0;i<packagetype.length;i++){
            if(packagetype.eq(i).val() == 1){
                if(coupon.eq(i).val() != "" && coupon.eq(i).val() != " "){
                    arr.push("1-" + coupon.eq(i).val());
                }else{
                    layer.msg('请选择优惠券类型', {time: 5000, icon:6});
                    return;
                }
            };

            if(packagetype.eq(i).val() == 2){
                if(packagecoin.eq(i).val() != ""){
                    brr.push("2-" + packagecoin.eq(i).val());
                }else{
                    layer.msg('请填写智币数量', {time: 5000, icon:6});
                    return;
                }
            };
            if(packagetype.eq(i).val() == 3){
                if(packagemoney.eq(i).val() != ""){
                    crr.push("3-" + packagemoney.eq(i).val());
                }else{
                    layer.msg('请填写现金', {time: 5000, icon:6});
                    return;
                }
            }
        }


        var drr = $.merge(arr, brr);
        var newarr = $.merge(drr, crr);
        var stringrr = newarr.join(";");
        var couponval = coupon.text();
        var coinval = packagecoin.val();
        var moneyval = packagemoney.val();

            var paramInfod = {
                id :id,
                packsName : systemName,
                productMark : systemType,
                packsDescription : systemSort,
                packsContent : stringrr
            };
        if(locked){
            locked = false;
            reqAjaxAsync(USER_URL.UPDATERESOURCE, JSON.stringify(paramInfod)).done(function(res){
                if (res.code == 1) {
                    layer.msg(res.msg);
                    layer.close(index);
                    setTimeout(function(){
                        var productMark = $("#payLocK").find("option:selected").val(); //所属产品
                        var packsName = $("#merchantName").val(); //礼包名称
                        getTable(packsName,productMark);
                        locked = true;
                    },500);
                } else {
                    layer.msg(res.msg);
                    locked = true;
                }
            });
        }
    }


    //调用详情接口
    function getInfo(e){
        var param = {
            id : e
        };
        var res = reqAjax(USER_URL.PACKINFO, JSON.stringify(param));
        if(res.code == 1){
            var row = res.data;
            var packsName = row.packsName; //礼包名称
            var productMark = row.productMark;//产品标识
            var packsDescription = row.packsDescription;//礼包描述
            var isAvailable = row.isAvailable;//是否可用
            var packarr = row.couponContent; //优惠券
            var coinarr = row.otherContent; //现金或者智币
            var goodinfo = $(".goodinfo").find("option");
           $("#detailsName").val(packsName);
           $("#detailsLevel").val(packsDescription);
            if(isAvailable == 0){
                $("#detailsValueType").val("不可用");
            };
            if(isAvailable == 1){
                $("#detailsValueType").val("可用");
            }
           if(productMark==1){
               $("#detailsType").val("APP");
           }else if(productMark==2){
               $("#detailsType").val("商品后台");
           }else if(productMark==3){
               $("#detailsType").val("展示端");
           }else if(productMark==4){
               $("#detailsType").val("智大师");
           }
        }
        //判断优惠券
        var str = packarr;
        console.log("str"+str);
        var packcon = [];//优惠券名称
        var packconId = [];//优惠券id

if(str != null){
        var obj1 = str.split(";");
        var obj2=[];
        for(var a=0;a<obj1.length;a++){
            obj2.push(obj1[a].replace("1-",""));
        }
        var rea = reqAjax(USER_URL.COUPON,"");
        for(var i=0;i<obj2.length;i++){
            for(var j=0;j<rea.data.length;j++){
                if(obj2[i] == rea.data[j].id){
                    packcon.push(rea.data[j].name);
                    packconId.push(rea.data[j].id);
                }
            }
        };
}
        //判断现金或者智币
        var str1=coinarr;
        console.log("str1"+str1);
        var coinsarr = [];//智币
        var moneyarr = [];//现金

if(str1 != null){
        var obj3 = str1.split(";");
        for(var b=0;b<obj3.length;b++){
            if(obj3[b].indexOf("2-")>-1){
                coinsarr.push(obj3[b].replace("2-",""));
            };
            if(obj3[b].indexOf("3-")>-1){
                moneyarr.push(obj3[b].replace("3-",""));
            }
        }
}
        //详情
        var coininfoarr = [];
        var moneyinfoarr = [];
        if(coinsarr.length >0) {
            for (var c = 0; c < coinsarr.length; c++) {
                coininfoarr.push("智币：" + coinsarr[c]);
            }
        }
        if(moneyarr.length >0){
            for(var c = 0;c<moneyarr.length;c++){
                moneyinfoarr.push("现金："+ moneyarr[c]);
            }
        }

        var arrs = $.merge(coininfoarr, moneyinfoarr);
        var brrs = $.merge(arrs, packcon);
        var crrs = brrs.join("；");
        $("#detailsCode").val(crrs);
    }


    //调用详情接口(修改专用)
    function getChange(e){
        $("#select-boxs").html("");
        var param = {
            id : e
        };
       var res = reqAjax(USER_URL.PACKINFO, JSON.stringify(param));
        if(res.code == 1){
            var row = res.data;
            var packsName = row.packsName; //礼包名称
            var productMark = row.productMark;//所属产品
            var packsDescription = row.packsDescription;//礼包描述
            var isAvailable = row.isAvailable;//是否可用
            var packarr = row.couponContent; //优惠券
            var coinarr = row.otherContent; //现金或者智币
            var goodinfo = $(".goodinfo").find("option");
            $("#changname").val(packsName);
            $("#packageinfoNote").val(packsDescription);
            for(var i =0;i<goodinfo.length;i++){
                if(productMark == goodinfo.eq(i).val()){
                    goodinfo.eq(i).attr("selected","selected");
                }
            }
        }
        //判断优惠券
        var str = packarr;
        var obj1 = str.split(";");
        var obj2=[];
        for(var a=0;a<obj1.length;a++){
            obj2.push(obj1[a].replace("1-",""));
        }
        var rea = reqAjax(USER_URL.COUPON,"");
        var packcon = [];//优惠券名称
        var packconId = [];//优惠券id
        for(var i=0;i<obj2.length;i++){
            for(var j=0;j<rea.data.length;j++){
                if(obj2[i] == rea.data[j].id){
                    packcon.push(rea.data[j].name);
                    packconId.push(rea.data[j].id);
                }
            }
        };
        //判断现金或者智币
        var str1 = coinarr;
        var obj3 = str1.split(";");
        var coinsarr = [];//智币
        var moneyarr = [];//现金
        for(var b=0;b<obj3.length;b++){
            if(obj3[b].indexOf("2-")>-1){
                coinsarr.push(obj3[b].replace("2-",""));
            };
            if(obj3[b].indexOf("3-")>-1){
                moneyarr.push(obj3[b].replace("3-",""));
            }
        }

        //修改礼包内容
            //优惠券
       if(packarr.length != null || packarr.length >0 || packarr.length !=""){
            for(var s=0;s<packconId.length;s++){
                $("#select-boxs").append(packageconts);
            }
            couponType($("#select-boxs"));
            var selsecs = $("#select-boxs .selectcoupon");
            var options = selsecs.find("option");
            for(var h=0;h<packconId.length;h++){
                for(var hh=0;hh<=rea.data.length;hh++){
                    if(packconId[h]==selsecs.eq(h).find("option").eq(hh).val()){
                        selsecs.eq(h).find("option").eq(hh).attr("selected","selected");
                    }
                }
            }
        }



        if(coinarr.length != null || coinarr.length >0 || coinarr.length !=""){
        //智币
        if(coinsarr.length>0){
               for(var h=0;h<coinsarr.length;h++){
                   $("#select-boxs").append(packageconts);
                   $("#select-boxs .selectpicker").eq(packconId.length+h).find("option").eq(1).attr("selected","selected");
                   $("#select-boxs .packagelist").eq(packconId.length+h).find(".layui-input-inline").eq(0).hide();
                   $("#select-boxs .packagelist").eq(packconId.length+h).find(".layui-input-inline").eq(1).show();
                   $("#select-boxs .packagelist").eq(packconId.length+h).find(".layui-input-inline").eq(1).find("input").val(coinsarr[h]);
               }
           }
        //现金
        if(moneyarr.length>0){
            for(var hs=0;hs<moneyarr.length;hs++){
                $("#select-boxs").append(packageconts);
                $("#select-boxs .selectpicker").eq(packconId.length+coinsarr.length+hs).find("option").eq(2).attr("selected","selected");
                $("#select-boxs .packagelist").eq(packconId.length+coinsarr.length+hs).find(".layui-input-inline").eq(0).hide();
                $("#select-boxs .packagelist").eq(packconId.length+coinsarr.length+hs).find(".layui-input-inline").eq(1).hide();
                $("#select-boxs .packagelist").eq(packconId.length+coinsarr.length+hs).find(".layui-input-inline").eq(2).show();
                $("#select-boxs .packagelist").eq(packconId.length+coinsarr.length+hs).find(".layui-input-inline").eq(2).find("input").val(moneyarr[hs]);
            }
        }
      }

    }


    //验证数量
    $(".select-body").on("keyup",".packagecoin input",function(){
        $(this).val($(this).val().replace(/^0/,''));
    });
    /*$(".select-body").on("keyup",".packagemoney input",function(){
        $(this).val($(this).val().replace(/^0/,''));
    });*/

    //点击顶部搜索出现各搜索条件
    $('#search').on('click',function(){
        $('#search-tool').slideToggle(200)
    });

    //搜索条件进行搜索
    $('#toolSearch').on('click',function(){
        var productMark = $("#payLocK").find("option:selected").val(); //所属产品
        var packsName = $("#merchantName").val(); //礼包名称
        getTable(packsName,productMark);
    });

    //重置
    $("#toolRelize").on('click',function(){
        $("#merchantName").val("");
        $("#payLocK").val("");
    });
})(jQuery);