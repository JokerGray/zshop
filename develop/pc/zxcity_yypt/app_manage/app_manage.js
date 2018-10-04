(function($){
    var page = 1;
    var rows = 10;
    var userno = sessionStorage.getItem("userno") || "";
    var USER_URL = {
        RESOURLIST : 'operations/platformUserList', //(查询状态)
        ADDRESOURCE : 'operations/realNameStatus',//(用户实名认证审核)
        CHANGESTATU :'operations/userStatusToggle',//(状态启用/0 未锁/1 已锁)
        RESOURCESIZE : 'operations/upgradeToMerchant', //(升级为商户)
        INFORMATION : 'operations/sysUserDetails', //(获取App用户详细信息)
        UPDATEUSER : 'operations/updateSysUser' //(修改用户信息)
    };

    layer.config({
        extend: 'myskin/style.css' //同样需要加载新皮肤
    });

    //列表方法
    function payDetail(res){
        var sHtml = "";
        for(var i=0;i<res.data.length;i++) {
            var row = res.data[i];
            sHtml += '<tr data-phone="'+ row.phone +'"  data-id="' + row.id + '">' +
            '<td>' + (i + 1) + '</td>' +
            '<td class="usercode">' + row.usercode + '</td>'
             if(row.username == null || row.username == ""){
                 sHtml += '<td>' + "暂无" + '</td>'
             }else{
                 sHtml += '<td>' + row.username + '</td>'
             }
            if(row.usersex == null || row.usersex == ""){
                sHtml += '<td>' + "-" + '</td>'
            }else{
                sHtml += '<td>' + row.usersex + '</td>'
            }
            if (row.residence == null || row.residence == "") {
                sHtml += '<td><div class="signature">' + "暂无" + '</div></td>'
            } else {
                sHtml += '<td><div class="signature">' + row.residence + '</div></td>'
            }
            if (row.signature == null || row.signature == "") {
                sHtml += '<td><div class="signature">' + "暂无" + '</div></td>'
            } else {
                sHtml += '<td><div class="signature">' + row.signature + '</div></td>'
            }
            sHtml += '<td  class="statu-tr" data-locked="' + row.locked + '">'
            if (row.locked == 0) {
                sHtml += '<a class="statu-control">锁定</a><a class="statu-control acve">启用</a>';
            } else{
                sHtml += '<a class="statu-control acve">锁定</a><a class="statu-control">启用</a>';
            }
            sHtml += '</td>'

            if (row.ismerchant == 0) {
                sHtml += '<td>' + '平台用户' + '</td>'
                
            }else if(row.ismerchant == null || row.ismerchant == ""){
                sHtml += '<td>' + '--' + '</td>'
            }else if(row.ismerchant == 1){
                        sHtml += '<td>' + '商户' + '</td>'
                    }
                    if(row.isrealname == "-1"){
                        sHtml += '<td>' + '审核不通过' + '</td>'
                    }else if(row.isrealname == "0"){
                        sHtml += '<td>' + '未认证' + '</td>'
                    }else if(row.isrealname == "1"){
                        sHtml += '<td>' + '待审核' + '</td>'
                    }else if(row.isrealname == "2"){
                        sHtml += '<td>' + '已认证' + '</td>'
                    }
            if(row.ismerchant == 0){
            	sHtml +=  '<td class="control-tr">' +
                            '<a class="info">详细信息</a><a class="changepwd">重置密码</a><a class="update-buss" data-ismerchant="' + row.ismerchant + '">升级为商户</a><a data-statu = "' + row.isrealname + '" class="user-check">实名认证审核</a><a class="changeinfo"><i class="icon"></i>修改</a>' +
                        '</td>'
                      '</tr>'
            }else{
            	sHtml +=  '<td class="control-tr">' +
                            '<a class="info">详细信息</a><a class="changepwd">重置密码</a><a data-statu = "' + row.isrealname + '" class="user-check">实名认证审核</a><a class="changeinfo"><i class="icon"></i>修改</a>' +
                        '</td>'
                      '</tr>'
            }
            
        }
        $("#system-table tbody").html(sHtml);
    };

    //列表初始化
    function getDetail(){
        var usercode = $.trim($("#jurisdiction-account").val());//获取账号
        var username =  $.trim($("#jurisdiction-name").val());//获取昵称
        var locked = $("#payLocK option:selected").val(); //是否锁定
		var isrealname = $("#isRealName option:selected").val(); //是否锁定
        var remark = $.trim($("#jurisdiction-tag").val());//获取备注
            var param = "{'page':" + page + ",'rows':" + rows + ",'usercode':'" + usercode + "','username':'" + username + "','locked':'" + locked +"','isrealname':'" + isrealname +"'}";
            var res = reqAjax(USER_URL.RESOURLIST,param);
            if(res.code == 1){
                payDetail(res);
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
                            var param = "{'page':" + obj.curr + ",'rows':" + rows + ",'usercode':'" + usercode + "','username':'" + username + "','locked':'" + locked + "','remark':'" + remark +"','isrealname':'" + isrealname +"'}";
                            var res = reqAjax(USER_URL.RESOURLIST,param);
                            payDetail(res);
                        document.getElementById('paging-box-count').innerHTML = render(res, obj.curr);
                        $('#paging-box-count').html('共'+ obj.pages +'页，每页'+rows+'条，总数'+obj.total+'条');
                    }
                });
            }else{
               console.log(res.msg);
            }
    };
    getDetail();
    //搜索
    $("#searchBtn").click(function(){
            getDetail();
    });



    //升级保存
    function updateSub(account,index){
        var body = layer.getChildFrame('body');
        var levelIndex = body.contents().find(".systemLevel").find(".layui-anim-upbit dd.layui-this").index();
        var levelTypeId = body.contents().find(".systemLevel").find(".layui-anim-upbit dd.layui-this").attr("lay-value"); //计费等级
        var orgName = $.trim(body.contents().find('#upgradeName').val()); //商户名
        var priority = $.trim(body.contents().find('#upgradeLevel').val()); //优先级
        var usercode = $.trim(body.contents().find('#upgradeManage').val());//登录名(用户帐号)商户管理员账号4-32位英文
        var username = $.trim(body.contents().find('#upgradeManagename').val());//商户管理员呢称
        var password =  $.trim(body.contents().find('.upgradePassword').val()); //密码
        var subscriptionName = $.trim(body.contents().find('#channelName').val()); //频道名
        var subscriptionIndex = body.contents().find(".channelSize").find(".layui-anim-upbit dd.layui-this").index();
        var subscriptionTypeId = body.contents().find(".channelSize").find(".layui-anim-upbit dd.layui-this").attr("lay-value");//公众号类型
        var subscriptionSynopsis = body.contents().find('#upgradeNote').val(); //公众号简介
        var provinceIndex = body.contents().find(".firstlayui").find(".layui-anim-upbit dd.layui-this").index();
        var provinceId = body.contents().find(".firstlayui").find(".layui-anim-upbit dd.layui-this").attr("lay-value"); //省id
        var cityIndex = body.contents().find(".lastlayui").find(".layui-anim-upbit dd.layui-this").index();
        var cityId = body.contents().find(".lastlayui").find(".layui-anim-upbit dd.layui-this").attr("lay-value"); //市id
        var isenglish =/^[a-z]{4,32}$/;
        if(levelIndex == "-1" || orgName == "" || priority == "" || usercode == "" || username == "" || password == "" || subscriptionName == "" || subscriptionIndex == "-1" || subscriptionSynopsis == "" ||cityIndex == "-1" ||provinceIndex == "-1"){
            layer.msg("必填项不能为空哟");
        }else if(password.length < 6 || password.length > 12){
            layer.msg("请输入长度为6-12位的密码");
            return;
        }else{
            var param = {
                password : password,
                usercode : usercode,
                username : username,
                parentId : userno,
                platformuserId : account,
                orgName : orgName,
                isAdmin :'01',
                priority : priority,
                userNo : userno,
                subscriptionName : subscriptionName,
                subscriptionTypeId : subscriptionTypeId,
                subscriptionSynopsis : subscriptionSynopsis,
                levelTypeId : levelTypeId,
                cityId:cityId,//市id
                provinceId:provinceId//省id
            };
            var res = reqAjax(USER_URL.RESOURCESIZE, JSON.stringify(param));
            if(res.code == 1){
                //layer.msg("升级成功");
                /*location.reload();*/
                /*var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
                parent.layer.close(index);*/
                layer.close(index);
                getDetail();
            }else{
                layer.msg(res.msg);
            }
        }
    }

    //修改保存
    function sub(index){
        var body = layer.getChildFrame('body');
        var username = $.trim(body.contents().find('#changeName').val());
        var password =  $.trim(body.contents().find('.changepassword').val());
        var id = body.contents().find('#changeAccount').parent().attr("date-id");
        var locked =body.contents().find(".systemSize").find(".layui-anim-upbit dd.layui-this").attr("lay-value");
        if(username == "" || password == ""){
            layer.msg("必填项不能为空哟");
        }else{
            var paramSave = "{'id':'" + id + "','locked':'" + locked + "','password':'" + password + "','username':'" + username +"'}";
            var res = reqAjax(USER_URL.UPDATEUSER,paramSave);
            if(res.code == 1){
                //layer.msg("修改成功");
                //location.reload();
                //var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
                layer.close(index);
                getDetail();
            }else{
                layer.msg(res.msg);
            }
        }

    }


    //认证是否通过
    function authentication(id,type,index){
        var paramReal = "{'userId':" + id + ",'isrealname':" + type + "}";
        var res = reqAjax(USER_URL.ADDRESOURCE,paramReal);
        if(res.code == 1){
           // location.reload();
            /*var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
            parent.layer.close(index);*/
            layer.alert("审核成功")
            layer.close(index);
            getDetail();
        }else{
            layer.msg(res.msg);
        }
    }

    //升级为商户
    $("#system-table").on("click",".update-buss",function(){
        var id = $(this).parents("tr").attr("data-id");//获取选中id
        var code = $(this).parents("tr").find(".usercode").text();//平台账号
        var phone = $(this).parents("tr").attr("data-phone"); //获取手机号
        var ismerchant = $(this).attr("data-ismerchant");//是否为商户
        if(ismerchant == "1"){
            layer.msg("该用户已经成为了商户");
        }else if(ismerchant == "0"){
            layer.open({
                type: 2,
                title: ['升级为商户', 'background:#303030;color:#fff;'],
                skin: 'layer-ext-myskin',
                area: ['1024px', '600px'],
                shade: 0.5,
                closeBtn: 1,
                shadeClose: false,
                content: 'upgrade_merchant.html',
                btn: ['保存'],
                btnAlign: 'c',
                success: function (layero, index) {
                    var body = layer.getChildFrame('body', index);
                    body.contents().find("#upgradeAccount").val(code);
                    body.contents().find("#upgradeManage").val(phone);
                },
                yes: function (index) {
                    updateSub(id,index);
                }
            });
        }else{
            layer.msg("不能升级为商户");
        }
    });

    //实名认证
    $("#system-table").on("click",".user-check",function(){
        var id =$(this).parents("tr").attr("data-id");//获取选中id
        var isrealname = $(this).attr("data-statu");
        if(isrealname == "-1"){
            layer.msg("审核不通过!");
        }else if(isrealname == "0" ){
            layer.msg("该用户还没有提交实名认证资料!");
        }else if(isrealname == "2"){
            layer.msg("该用户已经审核通过了!");
        }else if(isrealname == "1"){
            layer.open({
                type: 2,
                title: ['实名认证审核', 'background:#303030;color:#fff;'],
                skin: 'layer-real-myskin',
                area: ['900px', '600px'],
                shade: 0.5,
                closeBtn: 1,
                shadeClose: false,
                content: 'real_authentication.html',
                btn: ['认证不通过','认证通过'],
                success: function (layero, index) {
                    var paramInfo = "{'userId':" + id + "}";
                    var res =reqAjax(USER_URL.INFORMATION,paramInfo);
                    if(res.code == 1){
                        var row = res.data;
                        var phone = (row.user.phone == null ? "":row.user.phone);
                        var username = (row.user.username == null ? "":row.user.username);
                        var adress = (row.address == null ? "":row.address);
                        var name = (adress.name == null ? "":adress.name);
                        var identificationno = (adress.identificationno == null ? "":adress.identificationno);
                        var cardFrontPhoto =  (adress.cardFrontPhoto == null ? "":adress.cardFrontPhoto);
                        var cardHoldPhoto = (adress.cardHoldPhoto == null ? "":adress.cardHoldPhoto);
                        var cardBackPhoto =  (adress.cardBackPhoto == null ? "":adress.cardBackPhoto);
                        var body = layer.getChildFrame('body', index);
                        body.contents().find("#realAccount").val(phone);
                        body.contents().find("#realName").val(username);
                        body.contents().find("#realtrueName").val(name);
                        body.contents().find("#realNumber").val(identificationno);
                        body.contents().find(".realIDz").attr("src",cardFrontPhoto);
                        body.contents().find(".realIDhand").attr("src",cardHoldPhoto);
                        body.contents().find(".realIDf").attr("src",cardBackPhoto);
                    }else{
                        layer.msg(res.msg);
                    }
                },
                yes: function (index) {
                    authentication(id,-1,index);
                },btn2:function (index) {
                    authentication(id,2,index);
                }
            });
        }
    });

    //详细信息
    $("#system-table").on("click",".info",function(){
        var id =$(this).parents("tr").attr("data-id");//获取选中id
        layer.open({
            type: 2,
            title: ['详细信息', 'background:#303030;color:#fff;'],
            skin: 'layer-real-myskin',
            area: ['900px', '640px'],
            shade: 0.5,
            closeBtn: 1,
            shadeClose: false,
            content: 'app_information.html',
            success: function (layero, index) {
                var paramInfo = "{'userId':" + id + "}";
                var res =reqAjax(USER_URL.INFORMATION,paramInfo);
                if(res.code == 1){
                    var row = res.data;
                    var body = layer.getChildFrame('body', index);
                    var phone = (row.user.phone == null ? "":row.user.phone);
                    var username = (row.user.username == null ? "":row.user.username);
                    var residence = (row.user.residence == null ? "":row.user.residence);
                    var userbirth = (row.user.userbirth == null ? "":row.user.userbirth);
                    var usersex = (row.user.usersex == null ? "":row.user.usersex);
                    var remark = (row.user.remark == null ? "":row.user.remark);
                    var adress = (row.address == null ? "":row.address);
                    var name = (adress.name == null ? "":adress.name);
                    var mail = (adress.mail == null ? "":adress.mail);
                    var identificationno = (adress.identificationno == null ? "":adress.identificationno);
                    var cardFrontPhoto =  (adress.cardFrontPhoto == null ? "":adress.cardFrontPhoto);
                    var cardHoldPhoto = (adress.cardHoldPhoto == null ? "":adress.cardHoldPhoto);
                    var cardBackPhoto =  (adress.cardBackPhoto == null ? "":adress.cardBackPhoto);
                    body.contents().find("#infoAccount").val(phone);
                    body.contents().find("#infoName").val(username);
                    body.contents().find("#infoCity").val(residence);
                    body.contents().find("#infoBirthday").val(userbirth);
                    body.contents().find("#infoSex").val(usersex);
                    body.contents().find("#infoTag").val(remark);
                    body.contents().find("#infotrueName").val(name);
                    body.contents().find("#infoEmail").val(mail);
                    body.contents().find("#infoNumber").val(identificationno);
                    body.contents().find("#infoIDz").attr("src",cardFrontPhoto);
                    body.contents().find("#infoIDhand").attr("src",cardHoldPhoto);
                    body.contents().find("#infoIDf").attr("src",cardBackPhoto);
                }else{
                    layer.msg(res.msg);
                }
            }
        });
    });

    //修改信息
    $("#system-table").on("click",".changeinfo",function(){
        var id =$(this).parents("tr").attr("data-id");//获取选中id
        layer.open({
            type: 2,
            title: ['修改信息', 'background:#303030;color:#fff;'],
            skin: 'layer-ext-myskin',
            area: ['900px', '640px'],
            shade: 0.5,
            closeBtn: 1,
            shadeClose: false,
            content: 'app_changeinfo.html',
            btn: ['保存'],
            btnAlign: 'c',
            success: function (layero, index) {
                var paramInfo = "{'userId':" + id + "}";
                var res =reqAjax(USER_URL.INFORMATION,paramInfo);
                if(res.code==1){
                    var row = res.data;
                    var body = layer.getChildFrame('body', index);
                    body.contents().find("#changeAccount").parent().attr("date-id",id);
                    var phone = (row.user.phone == null ? "":row.user.phone);
                    var username = (row.user.username == null ? "":row.user.username);
                    var password = (row.user.password == null ? "":row.user.password);
                    body.contents().find("#changeAccount").val(phone);
                    body.contents().find("#changeName").val(username);
                    body.contents().find(".changepassword").val(password);
                    if (row.user.locked == 0) {
                        body.contents().find(".systemSize").find(".layui-anim-upbit dd").removeClass("layui-this");
                        body.contents().find(".systemSize").find(".layui-anim-upbit dd").eq(0).addClass("layui-this");
                        body.contents().find(".systemSize").find(".layui-unselect").val("启用");
                    } else if (row.user.locked == 1) {
                        body.contents().find(".systemSize").find(".layui-anim-upbit dd").removeClass("layui-this");
                        body.contents().find(".systemSize").find(".layui-anim-upbit dd").eq(1).addClass("layui-this");
                        body.contents().find(".systemSize").find(".layui-unselect").val("锁定");
                    }

                }

            },
            yes: function (index) {
                sub(index);
            }
        });
    });


    //锁定/启用
    $("#system-table").on("click",".statu-tr .statu-control",function(){
        var userId = $(this).parents("tr").attr("data-id");
        var acve = $(this).attr("class");
        var val = $(this).text();
        if(acve != "statu-control acve"){
            var paramLock = "{'userId':" + userId + "}";
            var res = reqAjax(USER_URL.CHANGESTATU,paramLock);
            if(res.code == 1){
                $(this).prev().removeClass("acve");
                $(this).next().removeClass("acve");
                $(this).addClass("acve");
            }else{
                layer.msg(res.msg);
            }
        }else{
            layer.msg('当前状态为:【' + val + '】哟~');
        }
    });

    //重置密码
    $("#system-table tbody").on('click','.changepwd',function(){
        var userId = $(this).parents("tr").attr('data-id');
        var data = "{'userId':'"+userId+"'}"
        layer.confirm("确认重置密码？",{icon:0,title:"提示"}, function (index) {
            var a =reqAjax("operations/appUserPasswordReset",data);
            if(a.code == 1){
                layer.alert("已重置，默认密码为123456")
            }else{
                layer.msg(a.msg);
            }
            layer.close(index);
        })
    })

})(jQuery);