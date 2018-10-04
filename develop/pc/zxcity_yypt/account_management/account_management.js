/**
 * Created by Administrator on 2017/5/24.
 */
$(function () {
    // 默认刷新第一页
    function reload() {
        var dataList = {
            page: 1,
            rows: 10
        }
        var dataAll = reqAjax("operations/chargeLevelTypeList", JSON.stringify(dataList));
        var data = dataAll.data;
        var layer = layui.laypage;
        var nums = 10; //每页出现的数据量
        //console.log(data);
        //模拟渲染
        var render = function (data, curr) {
            var arr = []
            // ,thisData = data.concat().splice(curr*nums-nums, nums);
                , thisData = data;
            layui.each(thisData, function (index, item) {
                arr.push('<li>' + item + '</li>');
            });
            return arr.join('');
        };
        //调用分页
        layer({
            cont: 'paging-box',
            first: false,
            last: false,
            prev: '<', //若不显示，设置false即可
            next: '>',
            pages: Math.ceil(dataAll.total / nums), //得到总页数
            curr: function () { //通过url获取当前页，也可以同上（pages）方式获取
                var page = location.search.match(/page=(\d+)/);
                return page ? page[1] : 1;
            }(),
            jump: function (obj, first) {
                var dataList = {
                    page: obj.curr,
                    rows: 10,
                }
                //console.log(obj.curr)
                var dataAll = reqAjax("operations/chargeLevelTypeList", JSON.stringify(dataList));
                var data = dataAll.data;
                console.log(data)
                var str;
                for(var i=0;i<data.length;i++){
                    data[i].levelStatus=0?"可用":"删除";
                    str+="<tr>" +
                    "<td style='display:none'>"+data[i].id+"</td>" +
                    "<td>"+(i+1)+"</td>" +
                    "<td class='levelName' data-level='"+ data[i].org_level +"' >"+data[i].levelName+"</td>" +
                    "<td>"+data[i].amount+"</td>" +
                    "<td>"+data[i].numValidDays+"</td>"+
                    /*if(data[i].numShop == 1){
                        str+=  "<td>"+data[i].numShop+"</td>";
                    }else{
                        str+=  "<td>"+"无限制"+"</td>";
                    }*/
                    "<td style='display:none'>"+"无限制"+"</td>"+
                    "<td data-goods='"+ data[i].numGoods  +"' style='display:none'>"+"无限制"+"</td>" +
                        "<td>"+data[i].createUserName+"</td>" +
                        "<td>"+data[i].createTime+"</td>" +
                        "<td>"+data[i].modifyUserName+"</td>"
                        if(data[i].modifyTime == null){
                            str+= "<td>"+ "--" +"</td>"
                        }else{
                            str+= "<td>"+ data[i].modifyTime +"</td>"
                        }
                    str+=     "<td class='row'><div class='col-xs-6'><button class='btn-md editUser' data-toggle='modal' data-target='#edit'><i class='edicticon'></i><span>修改</span></button></div>" +
                        "<div class='col-xs-6'><button class='btn-md delBut'><i class='glyphicon glyphicon-minus-sign'></i><span>&nbsp;删除</span></button></div></td>" +
                        "</tr>"
                }
                $("#countBody").html(str);
                document.getElementById('paging-box-count').innerHTML = render(data, obj.curr);
                $('#paging-box-count').html('共'+ obj.pages +'页，每页'+nums+'条，共'+ dataAll.total +'条');
                if(!first){ //一定要加此判断，否则初始时会无限刷新
                    location.href = '?page='+obj.curr;
                }
            }
        })
    }
    reload();

    //查询
    $("#searchCount").on("click", function () {
        var levelName =$.trim($("#searchName").val());

        var layers = layui.laypage;
        var nums = 10; //每页出现的数据量

        //模拟渲染
        var render = function (data, curr) {
            var arr = []
                // ,thisData = data.concat().splice(curr*nums-nums, nums);
                , thisData = data;
            layui.each(thisData, function (index, item) {
                arr.push('<li>' + item + '</li>');
            });
            return arr.join('');
        };
        var data ={
            levelName:levelName
        }
        var a =reqAjax("operations/chargeLevelTypeList",JSON.stringify(data))
        console.log(a);
        // var data = a.data;
        var  str;
        layers({
            cont: 'paging-box',
            first: false,
            last: false,
            prev: '<', //若不显示，设置false即可
            next: '>',
            pages: Math.ceil(a.total / nums), //得到总页数
            curr: function () { //通过url获取当前页，也可以同上（pages）方式获取
                var page = location.search.match(/page=(\d+)/);
                return page ? page[1] : 1;
            }(),
            jump: function (obj, first) {
                var data ={
                    page: obj.curr,
                    rows: 10,
                    levelName:levelName
                }
                var a =reqAjax("operations/chargeLevelTypeList",JSON.stringify(data))
                var data =a.data;
                for(var i=0;i<data.length;i++){
                    data[i].levelStatus=0?"可用":"删除";
                    str+="<tr>" +
                        "<td style='display:none'>"+data[i].id+"</td>" +
                        "<td>"+(i+1)+"</td>" +
                        "<td class='levelName' data-level='"+ data[i].org_level +"' >"+data[i].levelName+"</td>" +
                        "<td>"+data[i].amount+"</td>" +
                        "<td>"+data[i].numValidDays+"</td>"+
                        /*if(data[i].numShop == 1){
                         str+=  "<td>"+data[i].numShop+"</td>";
                         }else{
                         str+=  "<td>"+"无限制"+"</td>";
                         }*/
                    "<td style='display:none'>"+"无限制"+"</td>"+
                    "<td data-goods='"+ data[i].numGoods  +"' style='display:none'>"+"无限制"+"</td>" +
                        "<td>"+data[i].createUserName+"</td>" +
                        "<td>"+data[i].createTime+"</td>" +
                        "<td>"+data[i].modifyUserName+"</td>"
                    if(data[i].modifyTime == null){
                        str+= "<td>"+ "--" +"</td>"
                    }else{
                        str+= "<td>"+ data[i].modifyTime +"</td>"
                    }
                    str+=    "<td class='row'><div class='col-xs-6'><button class='btn-md editUser' data-toggle='modal' data-target='#edit'><i class='edicticon'></i><span>修改</span></button></div>" +
                        "<div class='col-xs-6'><button class='btn-md delBut'><i class='glyphicon glyphicon-minus-sign'></i><span>&nbsp;删除</span></button></div></td>" +
                        "</tr>"
                }
                if(!str){
                    layer.msg('查询不到该用户',{time:1000})
                }
                $('#countBody').html(str)
               // console.log(a.total);
                document.getElementById('paging-box-count').innerHTML = render(data, obj.curr);
                $('#paging-box-count').html('共'+ obj.pages +'页，每页'+nums+'条，共'+ a.total +'条');
            }
        })


    })

    //加载商户等级
    function loadMerchantType(){
        var param = '{code:"orgtype"}';
        var res = reqAjax('operations/dictItemsGroupByType',param);
        if(res.code == 1){
            var lHtml = "";
            for(var i=0, len=res.data.length; i<len; i++){
                lHtml += '<option data-money="'+res.data[i].note+'" value="'+res.data[i].val+'">'+res.data[i].name+'</option>'
            }

            $("#merchantId").html(lHtml);
            $("#merchantIds").html(lHtml);
        }else{
            layer.msg(res.msg);
        }
    }
    loadMerchantType();

    //新增时商户等级修改
    /*$("#merchantIds").change(function(){
        var vl = $("#merchantIds").find("option:selected").val();
        if(vl == 1){
            $("#addNew").find(".stores").val("1");
        }else{
            $("#addNew").find(".stores").val("无限制");
        }

    });*/

    //修改时商户等级修改
    /*$("#merchantId").change(function(){
        var vl = $("#merchantId").find("option:selected").val();
        if(vl == 1){
            $("#edit").find(".stores").val("1");
        }else{
            $("#edit").find(".stores").val("无限制");
        }

    });*/

    //点击新增时
    $("#newRole").click(function(){
        var lists = $("#merchantIds").find("option");
        for(var i =0;i<lists.length;i++){
            if(1 == lists.eq(i).val()){
                lists.eq(i).attr("selected",true);
            }
        }
    });

    //新增
    $("#saveNew").on("click", function () {
        var levelName = $.trim($("#addNew").find(".name").val());/*名称*/
        var amount = $("#addNew").find(".counts").val();/*费用*/
        var numValidDays = $("#addNew").find(".days").val();/*天数*/
        /*var numShop = $("#addNew").find(".stores").val();*//*开店数量*//*
        var numGoods = $("#addNew").find(".goods").val();*//*上架商品数量*/
        var orgLevel = $("#merchantIds").find("option:selected").val();//商户等级
        var userNo =sessionStorage.getItem("userno");
        var userName=sessionStorage.getItem("username");
        if(levelName.length<1||amount.length<1||numValidDays.length<1){
            layer.msg("请填写完整相关信息",{time:1000});
            return false
        }
        if(orgLevel == 1){
            var numShop = 1;
        }else{
            var numShop = 999;
        }

        var data={
            amount : amount,              //费用
            userNo: userNo,                 //当前用户编号(数字)
            userName: userName,          //当前用户名
            levelName: levelName,           //缴费类型名称
            numGoods: 999,                //上架商品数量限制
            numShop: 999,                    //开店数量限制
            numValidDays:numValidDays,              //有效天数
            orgLevel:orgLevel                  //商户等级
        }
        var a =reqAjax("operations/chargeLevelTypeAdding",JSON.stringify(data))
        //console.log(a);
        location.reload(true);
    })

    //修改用户
    $("#countBody").on("click",".editUser", function () {
        var name=$(this).parent().parent().siblings().eq(2).html();
        var count=$(this).parent().parent().siblings().eq(3).html();
        var days=$(this).parent().parent().siblings().eq(4).html();
        var stores=$(this).parent().parent().siblings().eq(5).html();
        var goods=$(this).parent().parent().siblings().eq(6).html();
        var id=$(this).parent().parent().siblings().eq(0).html();
        var level = $(this).parent().parent().siblings().eq(2).attr("data-level");
        var lists = $("#merchantId").find("option");
        for(var i=0;i<lists.length;i++){
            if(level == lists.eq(i).val()){
                lists.eq(i).attr("selected",true);
            }
        }
        $("#edit").find(".name").val(name);
        $("#edit").find(".counts").val(count);
        $("#edit").find(".days").val(days);
       $("#edit").find(".stores").val(stores);
        $("#edit").find(".goods").val(goods);
        $("#saveEdit").on("click", function () {
            var levelName = $.trim($("#edit").find(".name").val());/*名称*/
            var amount = $("#edit").find(".counts").val();/*费用*/
            var numValidDays = $("#edit").find(".days").val();/*天数*/
            var numShop = $("#edit").find(".stores").val();//*开店数量*/
           /* var numGoods = $("#edit").find(".goods").val();*//*上架商品数量*/
            var orgLevel = $("#merchantId").find("option:selected").val();//商户等级
            var userNo =sessionStorage.getItem("userno");
            var userName=sessionStorage.getItem("username");
            if(levelName.length<1||amount.length<1||numValidDays.length<1){
                layer.msg("请填写完整相关信息",{time:1000});
                return false
            }
            if(numShop == 1){
                var numShops = 1;
            }else{
                var numShops = 999;
            }
            var data={
                id: id,                        //缴费类型id
                amount : amount,              //费用
                userNo: userNo,                 //当前用户编号(数字)
                userName: userName,          //当前用户名
                levelName: levelName,           //缴费类型名称
                numGoods: 999,                //上架商品数量限制
                numShop: 999,                    //开店数量限制
                numValidDays:numValidDays,               //有效天数
                orgLevel:orgLevel                  //商户等级
            }
            var a = reqAjax("operations/chargeLevelTypeUpdating",JSON.stringify(data));
            //console.log(a);
            location.reload(true);
        })
    })

    //删除用户
    $("#countBody").on("click",'.delBut',function () {
        var $this=$(this).parent().parent();
        var levelTypeId=$this.siblings().eq(0).html();
        //console.log(levelTypeId);
        var data = {
            levelTypeId: levelTypeId
        }
        layer.confirm("确认删除？",{icon:3,title:"提示"}, function () {
            reqAjax("operations/chargeLevelTypeDeletion",JSON.stringify(data));;
            $this.parent().remove();
            location.reload(true);
        })
    })

    //新增模态框 input限制输数字
    $(".modal-body .input-group:nth-last-of-type(3) input").keyup(function () {
        $(this).val($(this).val().replace(/[^0-9.]/g,''));
    })

})