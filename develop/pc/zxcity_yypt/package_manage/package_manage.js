(function($){

    var page = 1;
    var rows = 10;
    var USER_URL = {
        RESOURLIST : 'operations/queryPacksList', //(查询)
        ADDRESOURCE : 'operations/addPacks',//(新增)1是优惠券,2是智币,3是现金(1-礼包ID;1-礼包id;2-数量;3-数量)
        UPDATERESOURCE :'operations/modifyPacks',//(修改)
        DELRESOURCE :'operations/modifyPacks',//(禁用)0禁用。1启用
        COUPON : 'operations/selectAllScCoupon', //(优惠券)
        PACKINFO : 'operations/getPacksDetail' //(详情)
    };

    //列表方法
    function tableDetail(res){
        var sHtml = "";
        if (res.code == 1) {
            for (var i = 0; i < res.data.length; i++) {
                var row = res.data[i];
                sHtml += '<tr class="system-tr" data-id= "' + row.id + '">' +
                '<td>' + (i + 1) + '</td>' +
                '<td class="packagename">' + row.packsName + '</td>'
                if(row.productMark == 1){
                    sHtml += '<td class="goodsname">' + 'APP' + '</td>';
                }else if(row.productMark == 2){
                    sHtml += '<td class="goodsname">' + '商品后台' + '</td>';
                }else if(row.productMark == 3){
                    sHtml += '<td class="goodsname">' + '展示端' + '</td>';
                }else if(row.productMark == 4){
                    sHtml += '<td class="goodsname">' + '智大师' + '</td>';
                }
                sHtml += '<td class="goodsnote"><div class="notetext">' + row.packsDescription + '</div></td>' +
                '<td class="goodscontent">' + row.packsContent + '</div></td>' +
                '<td class="remove-modifier" width="216px">'
                if(row.isAvailable == 0){
                    sHtml += '<button class="deletebtn axv" data-statu="'+row.isAvailable+' disabled="disabled" ">' + '弃用' + '</button>'
                }else if(row.isAvailable == 1){
                    sHtml += '<div class="controlbtn cagbtn" data-toggle="modal" data-target="#myModalchange">' +
                                '<i class="changeBtn edicticon"></i>修改' +
                        '</div>'+
                    '<button class="deletebtn" data-statu="'+row.isAvailable+'">' + '弃用' + '</button>'
                }
                sHtml += '<div class="infobtn" data-toggle="modal" data-target="#myModalinfo">' +
                '详情' +
                '</div>' +
                '</td>' +
                '</tr>';
            }
            $("#jurisdiction-table tbody").html(sHtml);
        } else {
            layer.msg(res.msg);
        }
    };



    //初始化列表
    function getDetail(){
        var val = $.trim($("#searchName").val());//获取输入框值
        var productMark = $("#ascription").find("option:selected").val();
        var param = {
            page : page,
            rows : rows,
            packsName : val,
            productMark : productMark
        };
        var res = reqAjax(USER_URL.RESOURLIST, JSON.stringify(param));
        tableDetail(res);
        var layer = layui.laypage;
        //模拟渲染
        var render = function(data, curr){
            var arr = []
                ,thisData = res.data;
            layui.each(thisData, function(index, item){
                arr.push('<li>'+ item +'</li>');
            });
            return arr.join('');
        };
        //调用分页
        layer({
            cont: 'paging-box'
            ,first: false
            ,last: false
            ,prev: '<' //若不显示，设置false即可
            ,next: '>'
            ,pages: Math.ceil(res.total/rows) //得到总页数
            ,total:res.total
            ,curr: function(){ //通过url获取当前页，也可以同上（pages）方式获取
                var page = location.search.match(/page=(\d+)/);
                return page ? page[1] : 1;
            }()
            ,jump: function(obj,first){
                var param = {
                    page : obj.curr,
                    rows : rows,
                    packsName : val,
                    productMark : productMark
                };
                var res = reqAjax(USER_URL.RESOURLIST, JSON.stringify(param));
                tableDetail(res);

                document.getElementById('paging-box-count').innerHTML = render(res, obj.curr);
                $('#paging-box-count').html('共'+ obj.pages +'页，每页'+rows+'条，总数'+obj.total+'条');
            }
        });
    }

    getDetail();

    //点击查询按钮
    $("#searchCount").click(function () {
            getDetail();
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

    //禁用
    $("#jurisdiction-table").on("click", ".deletebtn", function () {
        var delId = $(this).parents(".system-tr").attr("data-id");
        var isAvailable = $(this).attr("data-statu");
        if(isAvailable == 1){
            layer.confirm(
                "弃用后将不能修改和启用",
            {icon: 3, title:'提示'},
                function(index){
                var paramDel = {
                    id : delId,
                    isAvailable : 0
                };
                var res = reqAjax(USER_URL.DELRESOURCE, JSON.stringify(paramDel));
                if (res.code == 1) {
                    $(this).attr("data-statu","0");
                    $(this).addClass("axv");
                    $(this).attr("disabled","disabled");
                    $(this).prev().hide();
                } else {
                    layer.msg(res.msg);
                }
               // location.reload(true);
                layer.close(index);
                getDetail();
            });
        }
    });

    //新增模态框 input限制输数字
    $(".packagemoney input").keyup(function () {
        $(this).val($(this).val().replace(/[^0-9.]/g,''));
    })

    $(".packagecoin input").keyup(function () {
        $(this).val($(this).val().replace(/\D/g,''));
    });

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
    '</div>';

    $("#addPackage").click(function(){
        $("#select-box").append(packagecont);
        couponType($("#select-box"));
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
    function sub() {//则添加保存
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
        for(var i=0;i<packagetype.length;i++){
            if(packagetype.eq(i).val() == 1){
                if( coupon.eq(i).val() == "" || coupon.eq(i).val() == " "){
                    layer.alert("请选择优惠券类型");
                    return;
                }else{
                    arr.push("1-" + coupon.eq(i).val());
                }
             };
             if(packagetype.eq(i).val() == 2){
                 if(packagecoin.eq(i).val() == ""){
                     layer.alert("请填写智币数量");
                     return;
                 }else{
                     brr.push("2-" + packagecoin.eq(i).val());
                 }
             };
             if(packagetype.eq(i).val() == 3){
                 if(packagemoney.eq(i).val() == ""){
                     layer.alert("请填写现金");
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
        if (systemName != '' && systemSort != '' ) {

                if(coinval != "" || couponval != "请选择" || moneyval != ""){
                    var paramInfod = {
                        packsName : systemName,
                        productMark : systemType,
                        packsDescription : systemSort,
                        packsContent : stringrr
                    };
                    var res = reqAjax(USER_URL.ADDRESOURCE, JSON.stringify(paramInfod));
                    if (res.code == 1) {
                        layer.msg("保存成功");
                        /*$("#myModal").modal("hide");
                        getDetail();*/
                        location.reload();
                    } else {
                        layer.msg(res.msg);
                    }
                }else {
                    layer.msg("必填项不能为空哟")
                }
         } else {
         layer.msg("必填项不能为空哟")
         }
    }

   //修改保存
    function sub2(id) {//
        var systemName = $.trim($('#changname').val()); //礼包名称
        var systemType = $("#changbasic").children('option:selected').val();//产品标识
        var systemSort = $.trim($('#changcont').val()) ; //礼包描述
        var packagetype =$("#select-boxs").find(".packagelist .show-tick").children('option:selected');
        var coupon =$("#select-boxs").find(".packagecard select").children('option:selected');//优惠券的类型
        var packagecoin =$("#select-boxs").find(".packagelist .packagecoin").find("input");//智币
        var packagemoney =$("#select-boxs").find(".packagelist .packagemoney").find("input");//现金
        var arr = [];//优惠券
        var brr = [];//智币
        var crr = [];//现金
        for(var i=0;i<packagetype.length;i++){
            if(packagetype.eq(i).val() == 1){
                if(coupon.eq(i).val() != "" && coupon.eq(i).val() != " "){
                    arr.push("1-" + coupon.eq(i).val());
                }else{
                    layer.alert("请选择优惠券类型");
                    return;
                }
            };

            if(packagetype.eq(i).val() == 2){
                if(packagecoin.eq(i).val() != ""){
                    brr.push("2-" + packagecoin.eq(i).val());
                }else{
                    layer.alert("请填写智币数量");
                    return;
                }
            };
            if(packagetype.eq(i).val() == 3){
                if(packagemoney.eq(i).val() != ""){
                    crr.push("3-" + packagemoney.eq(i).val());
                }else{
                    layer.alert("请填写现金");
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
        if (systemName != '' && systemSort != '' ) {

                var paramInfod = {
                    id :id,
                    packsName : systemName,
                    productMark : systemType,
                    packsDescription : systemSort,
                    packsContent : stringrr
                };
                var res = reqAjax(USER_URL.UPDATERESOURCE, JSON.stringify(paramInfod));
                if (res.code == 1) {
                   // layer.msg("保存成功");
                    $("#myModalchange").modal("hide");
                    getDetail();
                    //location.reload();
                } else {
                    layer.msg(res.msg);
                }
            }else {
                layer.msg("必填项不能为空哟")
            }

    }

    //新增保存点击
    $("#add-parameters").click(function(){
        sub();
    });

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
           $(".packageName").val(packsName);
           $(".packageinfoNote").val(packsDescription);
            if(isAvailable == 0){
                $(".packageisal").val("不可用");
            };
            if(isAvailable == 1){
                $(".packageisal").val("可用");
            }
           for(var i =0;i<goodinfo.length;i++){
               if(productMark == goodinfo.eq(i).val()){
                   goodinfo.eq(i).attr("selected","selected");
               }
           }
        }
        //判断优惠券
        var str = packarr;
        console.log("str"+str);
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
        var str1=coinarr;
        console.log("str1"+str1);
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
        $("#packageinfomsg").val(crrs);
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
            var productMark = row.productMark;//产品标识
            var packsDescription = row.packsDescription;//礼包描述
            var isAvailable = row.isAvailable;//是否可用
            var packarr = row.couponContent; //优惠券
            var coinarr = row.otherContent; //现金或者智币
            var goodinfo = $(".goodinfo").find("option");
            $(".packageName").val(packsName);
            $(".packageinfoNote").val(packsDescription);
            for(var i =0;i<goodinfo.length;i++){
                if(productMark == goodinfo.eq(i).val()){
                    goodinfo.eq(i).attr("selected","selected");
                }
            }
            if(isAvailable == 0){
                $("#packageisal").val("不可用");
            };
            if(isAvailable == 1){
                $("#packageisal").val("可用");
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
                $("#select-boxs").append(packagecont);
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
                   $("#select-boxs").append(packagecont);
                   $("#select-boxs .selectpicker").eq(packconId.length+h).find("option").eq(1).attr("selected","selected");
                   $("#select-boxs .packagelist").eq(packconId.length+h).find(".layui-input-inline").eq(0).hide();
                   $("#select-boxs .packagelist").eq(packconId.length+h).find(".layui-input-inline").eq(1).show();
                   $("#select-boxs .packagelist").eq(packconId.length+h).find(".layui-input-inline").eq(1).find("input").val(coinsarr[h]);
               }
           }
        //现金
        if(moneyarr.length>0){
            for(var hs=0;hs<moneyarr.length;hs++){
                $("#select-boxs").append(packagecont);
                $("#select-boxs .selectpicker").eq(packconId.length+coinsarr.length+hs).find("option").eq(2).attr("selected","selected");
                $("#select-boxs .packagelist").eq(packconId.length+coinsarr.length+hs).find(".layui-input-inline").eq(0).hide();
                $("#select-boxs .packagelist").eq(packconId.length+coinsarr.length+hs).find(".layui-input-inline").eq(1).hide();
                $("#select-boxs .packagelist").eq(packconId.length+coinsarr.length+hs).find(".layui-input-inline").eq(2).show();
                $("#select-boxs .packagelist").eq(packconId.length+coinsarr.length+hs).find(".layui-input-inline").eq(2).find("input").val(moneyarr[hs]);
            }
        }
      }

    }

    //点击详情
    $("#jurisdiction-table").on("click",".remove-modifier .infobtn",function(){
        var id= $(this).parents(".system-tr").attr("data-id");
        getInfo(id);
    });

    $("#addPackages").click(function(){
        $("#select-boxs").append(packagecont);
        couponType($("#select-boxs"));
    });

    //点击修改
    $("#jurisdiction-table").on("click",".remove-modifier .cagbtn",function(){
        var id= $(this).parents(".system-tr").attr("data-id");
        $("#myModalchange").attr("data-id",id);
        getChange(id);
    });
    //修改保存
    $("#add-para").click(function(){
          var id =  $("#myModalchange").attr("data-id");
            sub2(id);
        }
    );


    //验证数量
    $(".select-body").on("keyup",".packagecoin input",function(){
        $(this).val($(this).val().replace(/^0/,''));
    });
    $(".select-body").on("keyup",".packagemoney input",function(){
        $(this).val($(this).val().replace(/^0/,''));
    });
$("#myModal").on("click",".close",function(){
    location.reload();
});
})(jQuery);