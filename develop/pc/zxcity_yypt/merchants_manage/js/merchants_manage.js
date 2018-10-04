(function($){
    var userno = sessionStorage.getItem("userno") || "";
    var REQUEST_URL = {
        'list': 'operations/listMerchantUser',//查询商户信息,可根据条件筛选
        'lock': 'operations/lockedMerchant',//锁定商户/启用商户
        'add': 'operations/newMerchant',//新增商户
        'update': 'operations/updateMerchantUser',//修改商户信息
        'getById': 'operations/findMerchantUserById',//根据id获取商户信息
        'config': 'operations/getSysConfigList',//获取系统信息接口(计费类型,行业类型,公众号类型)
        'recomend': 'operations/getTreeChild',//获取推荐人
        'province': 'operations/getProvinceList',//省市接口
        'referenceTree':'operations/getTreeChild',//推荐人
        'yx': 'operations/addYunXin',//同步信息到云信平台
        'upgrade':'operations/merchantUpgrade' //商户升级
    };

    var pageNo = 1, pageSize = 10;
    var referenceObj = {}, yx_usercodeId = null;

    //加载省市数据
    function loadProvinceAndCity(param, _sort){
      var res = reqAjax(REQUEST_URL['province'], JSON.stringify(param));
      if(res.code == 1){
          var sHtml = '<option value="">---请选择---</option>';
          for(var i=0, len=res.data.length; i<len; i++){
              sHtml += '<option value="'+res.data[i].code+'">'+res.data[i].areaname+'</option>'
          }
          _sort = _sort ? _sort : 1;
          if(param['parentcode'] == 0){
              proviceArr = res.data;
              $("#provinceSelector"+_sort).html(sHtml);

          }else{
              $("#citySelector"+_sort).html(sHtml);
              $("#citySelector"+_sort).prop("disabled", false);
          }
      }
    }

    //加载商户类型名称
    /*function loadMerchantType(){
        var param = '{code:"orgtype"}';
        var res = reqAjax('operations/dictItemsGroupByType',param);
        if(res.code == 1){
            var lHtml = "";
            for(var i=0, len=res.data.length; i<len; i++){
                lHtml += '<option data-money="'+res.data[i].note+'" value="'+res.data[i].val+'">'+res.data[i].name+'</option>'
            }

            $("#merchantId").append(lHtml);
        }else{
            layer.msg(res.msg);
        }
    }*/

    //根据省的选择切换对应的市内容
    $("#provinceSelector1").change(function(){
      var _value = $(this).val();
      if(_value == ""){
          $("#citySelector1").prop("disabled", true).find("option:eq(0)").prop("selected", true);
      }else{
          loadProvinceAndCity({'parentcode': _value}, 1);
      }
    });

    //列表显示
    function showList(res){
        var obj = res.data;
        var sHtml = '', len = obj.length;
        if(len > 0){
            for(var i=0; i<len; i++){
                var _sort = (pageNo - 1) * 10 + (i + 1);
                var _type = obj[i].regular == 0 ? '正式' : '测试';
                sHtml += '<tr data-merchantId="'+obj[i].merchantId+'" data-id="' + obj[i].id + '" id="'+obj[i].id+'" data-uid="'+(obj[i].scSysUser==null ? "" : obj[i].scSysUser.id)+'">'
                    + '<td>'+_sort+'</td>'
                    + '<td>'+obj[i].usercode+'</td>'
                    + '<td>'+_type+'</td>'
                    + '<td>'+obj[i].levelType+'</td>'
                    + '<td>'+obj[i].username+'</td>'
                    + '<td>'+(obj[i].scSysUser==null ? "" : obj[i].scSysUser.username)+'</td>'
                    if(obj[i].scSysUser == null){
                        sHtml += '<td>'+ '未注册' +'</td>'
                    }else{
                        if(obj[i].scSysUser.registType == 1){
                            sHtml += '<td>'+ '已注册' +'</td>'
                        }else{
                            sHtml += '<td>'+ '未注册' +'</td>'
                        }
                    }
                sHtml += '<td><div class="lock-use-btn btn-group">'
                if(obj[i].locked == 0){
                    sHtml += '<button class="btn lock-btn" data-val="1" type="button">锁定</button>'
                        + '<button class="btn use-btn active" data-val="0" type="button">启用</button>'
                }else{
                    sHtml += '<button class="btn lock-btn active" data-val="1" type="button">锁定</button>'
                        + '<button class="btn use-btn" data-val="0" type="button">启用</button>'

                }
                sHtml += '</div></td>'
                   /* + '<td>'+obj[i].updateName+'</td>'*/
                    + '<td><a class="handle-btn edit-btn" href="javascript:;"><i class="icon"></i>修改</a><button class="btn btn-info resetBtn">重置密码</button></td>'
                    + '</tr>';
            }
        }else{
            sHtml = '<tr><td colspan="9">暂无数据</td></tr>'
        }

        $("#listTable tbody").html(sHtml);
    }

    //列表数据加载
    function loadListData(){
        var param = {
            page: pageNo,  //页码
            rows: pageSize //显示行数
        };
        //商户名称
        var merchantName = $(".search-box input[name=searchName]").val();
        //商户类型
        var regular = $("#userTypeSelector").val();
        //是否锁定
        var status = $("#statusSelector").val();
        //省市
        var province = $("#provinceSelector1").val();
        var city = $("#citySelector1").val();
        //账号
        var phone = $.trim($("#searchAdmin").val());
        if($.trim(merchantName) != ""){
            param['username'] = $.trim(merchantName);
        }
        if(regular != ""){
            param['regular'] = regular;
        }
        if(status != ""){
            param['locked'] = status;
        }
        if(province != ""){
            param['provinceId'] = province;
        }
        if(city != ""){
            param['cityId'] = city;
        }
        if(phone != ""){
            param['phone'] = $.trim(phone);
        }
        //根据登录人角色查询相关商户数据,从缓存中获取
        param['userno'] = sessionStorage.getItem("userno");

        var res = reqAjax(REQUEST_URL['list'], JSON.stringify(param));
        if(res.code == 1){
            //显示列表
            showList(res);

            //以下代码为分页功能
            var layer = layui.laypage;
            //模拟渲染
            var render = function(data, curr){
            	var arr = []
            		,thisData = res;
            	layui.each(thisData, function(index, item){
            		arr.push('<li>'+ item +'</li>');
            	});
            	return arr.join('');
            };
            //调用分页
            layer({
            	cont: 'paging-box'
                //,groups: 10
            	,first: false
            	,last: false
            	,prev: '<' //若不显示，设置false即可
            	,next: '>'
            	,pages: Math.ceil(res.total/pageSize) //得到总页数
                ,total:res.total
            	,curr: function(){ //通过url获取当前页，也可以同上（pages）方式获取
            		var page = location.search.match(/page=(\d+)/);
            		return page ? page[1] : 1;
            	}()
            	,jump: function(obj,first){

                    pageNo = obj.curr;
                    param['page'] = pageNo;

                    var res = reqAjax(REQUEST_URL['list'], JSON.stringify(param));
                    if(res.code == 1){
                        showList(res);
                        document.getElementById('paging-box-count').innerHTML = render(res.data, obj.curr);
                    }

                    $('#paging-box-count').html('共'+ obj.pages +'页，每页'+pageSize+'条，总数'+obj.total+'条');
            	}
            });

        }
    }

    //查询
    $(".search-box .search-btn").click(function(){
        loadListData();
    });

    $(function(){
        loadProvinceAndCity({'parentcode':0}, 1);
        loadListData();
    });

    //新增保存
    function addFormSave(_index){
        /*var orgLevel = $("#merchantId").find("option:selected").val();//商户类型名称*/
        var userSex = $("#sex").find("option:selected").text();//性别
        var formData = decodeURIComponent($("#addForm").serialize()).split("&");
        var jsonData = {};
        for(var i=0; i<formData.length; i++){
            var tempArr = formData[i].split("=");
            if(tempArr[1] == "" && tempArr[0] != 'reference'){
                var _txt = $("#"+tempArr[0]).parents(".form-group").find("label").text();
                _txt = _txt.replace("＊", "");
                layer.alert(_txt+"不能为空！");
                return;
            }else{
                jsonData[tempArr[0]] = tempArr[1];
            }
        }
            var nameExp = /^[\u4e00-\u9fa5a-zA-Z]+$/; //中文或者英文
            if(!nameExp.test(jsonData['username'])){
                layer.alert("商户管理员昵称必须为中文或者英文");
                return;
            }


        var param = {
            userId: sessionStorage.getItem("userId")
            ,userno: sessionStorage.getItem("userno")
            ,isAdmin:'01' //00 普通后台用户 01商户系统管理员 11超级管理员 【注意这里只传01 不传其他值】
            ,orgName: jsonData['orgName'] //商户名称
            ,priority: jsonData['priority'] //商户优先级 只能取数字
            ,levelTypeId: jsonData['levelTypeId'] //计费等级
            ,trade: jsonData['trade']  //所属行业 1 服务业 2 零售业 3 餐饮业
            ,regular: jsonData['regular'] //商户类型  0 正式  1测试
            ,platusercode: jsonData['platusercode'] //平台用户帐号
            ,usercode: jsonData['platusercode'] //商户管理员帐号
            ,username: jsonData['username'] // 商户管理员昵称
            ,password: jsonData['password'] //商户管理员密码
            ,subscriptionName: jsonData['subscriptionName'] //个人频道名
            ,subscriptionTypeId: jsonData['subscriptionTypeId']//频道类型
            ,subscriptionSynopsis: jsonData['subscriptionSynopsis'] //频道简介
            ,provinceId: jsonData['provinceSelector2'] //省id
            ,provinceName: $("#provinceSelector2").find("option:selected").text() //名称
            ,cityId: jsonData['citySelector2']   //市id
            ,cityName: $("#citySelector2").find("option:selected").text()  //名称
            ,referenceId: referenceObj['referenceId']  //【隐藏域】 推荐人id
            ,referencePId:referenceObj['referencePId'] //【隐藏域】 推荐人父级id
            ,reference:referenceObj['reference'] //推荐人名称
            /*,orgLevel:orgLevel//商户类型名称*/
            ,usersex:userSex
        };

       var res = reqAjax(REQUEST_URL['add'], JSON.stringify(param));
        if(res.code == 1){
            layer.msg("添加成功");
            layer.close(_index);
            loadListData();
        }else{
            if(res.msg == "添加云信ID失败!【其他账户开通行为已执行成功】"){
                layer.close(_index);
                loadListData();
            }else{
                layer.msg(res.msg);
            }
        }
    }


    //打开新增弹框
    function openAddDialog(data){
        layer.config({
          extend: 'myskin/style.css', //加载您的扩展样式
          skin: 'layer-ext-myskin'
        });
        var html = template('addMerchantsTpl', data);
        layer.open({
            type:1,
            title: '新增商户信息',
            area:['1100px', '628px'],
            btn:['保存'],
            bthAlign:'c',
            content:html,
            success: function(){
            	$("#usercode").val("");
            	$("#password").val("");
                loadProvinceAndCity({'parentcode':0}, 2);
                $("#provinceSelector2").change(function(){
                  var _value = $(this).val();
                  if(_value == ""){
                      $("#citySelector2").prop("disabled", true).find("option:eq(0)").prop("selected", true);
                  }else{
                      loadProvinceAndCity({'parentcode': _value}, 2);
                  }

                });

                $("#levelTypeId option").hide();
                $("#levelTypeId option").eq(0).show();

                //限制优先级只能输入正数
                $("#priority").keyup(function(){
                    var reg = /^[1-9]\d*$/;
                    if(!reg.test($(this).val())){
                        $(this).val("");
                        return;
                    }
                });

                $("#platusercode").blur(function(){
                    var mobileExp = /^1[3,5,7-8][0-9]{9}$/i; //手机正则
                    if(!mobileExp.test($(this).val())){
                        $(this).val("");
                        layer.alert("请输入正确的手机号");
                        return;
                    }
                    $("#usercode").val($(this).val());
                });

                //校验密码强度
                $("#password").keyup(function(){
                    var strength = checkPwdStrength($(this).val());
                    switch (strength) {
                        case 1:
                            $(".pwd-strength .level1").addClass("active").siblings().removeClass("active");
                            break;
                        case 2:
                            $(".pwd-strength .level3").removeClass("active").siblings().addClass("active");
                            break;
                        case 3:
                            $(".pwd-strength .s-level").addClass("active");
                            break;
                        default:
                            $(".pwd-strength .s-level").removeClass("active");

                    }
                });


                //选择推荐人
                $("#reference").click(function(){
                    layer.open({
                        type:1,
                        title: '选择推荐人',
                        area:['300px', '450px'],
                        content: '<ul class="ztree" id="referenceTree"></ul>',
                        success: function(index, layero){
                            openReferenceTree();
                        },
                        end: function(){
                            $("#reference").text(referenceObj['reference']);
                        }
                    });
                });
            },
            yes: function(index, layero){
                addFormSave(index);
            }
        });
    }



    //打开推荐人树
    function openReferenceTree(){

        //树-基础设置
        var setting = {
            view: {
                showLine: false,
                selectedMulti: false,
                dblClickExpand: false,
                selectedMulti: false
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            async: {
                enable: true,
                type:'post',
                url: '/zxcity_restful/ws/rest',
                dataType: 'json',
                dataFilter: asyncDataFilter
            },
            callback: {
                beforeExpand: beforeExpand,
                onAsyncSuccess: onAsyncSuccess,
                onAsyncError: onAsyncError,
                onClick: onClick
            }
        };
        var perTime = 100;


        function asyncDataFilter(treeId, parentNode, resData){
            return resData.data;
        }

        function beforeExpand(treeId, treeNode){
            var zTree = $.fn.zTree.getZTreeObj("referenceTree");

            zTree.setting.async.otherParam = {"cmd":REQUEST_URL['referenceTree'], "data":"{'id':"+treeNode.id+"}", "version":1};

            if (!treeNode.isAjaxing) {
                treeNode.times = 1;
                ajaxGetNodes(treeNode, "refresh");
                return true;
            } else {
                alert("zTree 正在下载数据中，请稍后展开节点。。。");
                return false;
            }
        }

        function onAsyncSuccess(event, treeId, treeNode, msg) {
            if (!msg || msg.length == 0) {
                layer.alert(msg);
                return;
            }
            var zTree = $.fn.zTree.getZTreeObj("referenceTree"),
            totalCount = treeNode.count;
            if (treeNode.children.length < totalCount) {
                setTimeout(function() {ajaxGetNodes(treeNode);}, perTime);
            } else {
                treeNode.icon = "";
                zTree.updateNode(treeNode);
                zTree.selectNode(treeNode.children[0]);

            }
        }
        function onAsyncError(event, treeId, treeNode, XMLHttpRequest, textStatus, errorThrown) {
            var zTree = $.fn.zTree.getZTreeObj("referenceTree");
            layer.alert("异步获取数据出现异常。");
            treeNode.icon = "";
            zTree.updateNode(treeNode);
        }
        function ajaxGetNodes(treeNode, reloadType) {
            var zTree = $.fn.zTree.getZTreeObj("referenceTree");

            if (reloadType == "refresh") {
                treeNode.icon = "../../common/assets/zTree_v3/css/zTreeStyle/img/loading.gif";
                zTree.updateNode(treeNode);
            }
            zTree.reAsyncChildNodes(treeNode, reloadType, true);
        }

        //点击节点选择
        function onClick(event, treeId, treeNode){
            var id = treeNode.id;
            referenceObj['referenceId'] = treeNode.id;
            referenceObj['referencePId'] = treeNode.pid;
            referenceObj['reference'] = treeNode.name;
            layer.close(layer.index);
        }


        var res = reqAjax(REQUEST_URL['referenceTree'], "{'id':0}");
        if(res.code == 1){
            $.fn.zTree.init($("#referenceTree"), setting, res.data);
        }

    }


    //打开修改弹框
    function openUpdateDialog(data){
        layer.config({
          extend: 'myskin/style.css', //加载您的扩展样式
          skin: 'layer-ext-myskin'
        });
        var html = template('updateMerchantsTpl', data);
        layer.open({
            type:1,
            title: '修改商户信息',
            area:['600px', '420px'],
            btn:['保存'],
            bthAlign:'c',
            content:html,
            success: function(){
                $("#lockSelector").find("option[value="+data.locked+"]").prop("selected", true);

            },
            yes: function(index, layero){
                var formData = decodeURIComponent($("#updateForm").serialize()).split("&");
                var param = {};

                for(var i=0; i<formData.length; i++){
                    var tempArr = formData[i].split("=");
                    if(tempArr[1] == ""){
                        var _txt = $("#"+tempArr[0]).parents(".form-group").find("label").text();
                        _txt = _txt.replace("＊", "");
                        layer.alert(_txt+"不能为空！");
                        return;
                    }else{
                        param[tempArr[0]] = tempArr[1];
                    }
                }
                param['id'] = data.id;
                param['userId'] = sessionStorage.getItem("userId");
                param['userno'] = sessionStorage.getItem("userno");

                var res = reqAjax(REQUEST_URL['update'], JSON.stringify(param));
                if(res.code == 1){
                    layer.msg("修改成功！");
                    layer.close(index);
                    loadListData();
                }else{
                    layer.msg(res.msg);
                }
            }
        });
    }

    //新增
    $("#addMerchantsBtn").click(function(){
        var _config = loadConfig();
        var data = {
            chargeLevel: _config == [] ? [] : _config.chargeLevel,
            regular:['正式','测试'],
            trade:_config == [] ? [] : _config.merchantTrade,
            channelList:_config == [] ? [] : _config.cmsChannelList
        };
        
        openAddDialog(data);
    });

    //列表选择
    $("#listTable tbody").delegate("tr", "click", function(){
        $(this).toggleClass("selected").siblings().removeClass("selected");
        yx_usercodeId = $(this).attr("data-uid");
        var merchantId = $(this).attr("data-merchantid");
        sessionStorage.setItem('merchantId',merchantId)
    });

    //云信重试
    $("#yxBtn").click(function(){
        if(yx_usercodeId == null){
            layer.msg("请先在列表中选择一条需要云信重试的数据！");
            return;
        }
        var param = {'userCodeId': yx_usercodeId};
        var res = reqAjax(REQUEST_URL['yx'], JSON.stringify(param));
        if(res.code == 1){
            layer.msg("操作成功！");
            yx_usercodeId = null;
        }else{
            layer.alert(res.msg);
        }
    });
	//重置密码
	$("#listTable tbody").on('click','.resetBtn',function(){
		var userId = $(this).parent().parent().attr('data-id');
		var data = "{'id':'"+userId+"'}";
		layer.confirm("确认重置密码？",{icon:0,title:"提示"}, function (index) {
            var a =reqAjax("operations/resetMerchantPassword",data);
            if(a.code == 1){
                layer.alert("已重置，默认密码为123456");
            }else{
                layer.msg(a.msg);
            }
            layer.close(index);
        })
	})
	
    //列表操作事件
    $("#listTable tbody").delegate("tr>td .lock-btn, tr>td .use-btn", "click", function(event){
        //锁定||启用
        event.stopPropagation();
        var _that = this;
        var _id = $(_that).parents("tr").attr("id"),
            _curVal = $(_that).attr("data-val"),
            _btnText = $(_that).html(),
            _isActive = $(_that).hasClass("active");
        if(_isActive){
            layer.msg("该商户已经是"+_btnText+"状态了，不需要再设置了~");
            return;
        }
        var param = {'id':_id, 'locked':_curVal};
        var res = reqAjax(REQUEST_URL['lock'], JSON.stringify(param));
        if(res.code == 1){
            layer.msg("操作成功");
            $(_that).addClass("active").siblings().removeClass("active");
        }else{
            layer.msg(res.msg);
        }

    }).delegate("tr>td .edit-btn", "click", function(event){
        event.stopPropagation();
        //编辑
        var _that = this;
        var _id = $(_that).parents("tr").attr("id");

        var res = reqAjax(REQUEST_URL['getById'], "{'id':"+_id+"}");
        if(res.code == 1){
            var data = {
                id: _id,
                usercode:res.data.usercode,
                password:res.data.password,
                username:res.data.username,
                locked:res.data.locked
            };
            openUpdateDialog(data);
        }else{

        }
    });

   //加载基础信息
   function loadConfig(){
       var res = reqAjax(REQUEST_URL['config'], "");
       if(res.code == 1){
           return res.data;
       }else{
           return [];
       }
   }


   //密码强度校验
   function checkPwdStrength(pwd){
       //判断字符是哪个类型
	    function CharMode(iN){
	        if (iN>=48 && iN <=57) //数字
	            return 1;
	        if (iN>=65 && iN <=90) //大写
	            return 2;
	        if (iN>=97 && iN <=122) //小写
	            return 4;
	        else
	            return 8;
	    }
	    //bitTotal函数
	    //计算密码模式
	    function bitTotal(num){
	        var mode = 0;
	        for (i=0;i<4;i++){
	            if (num & 1) {
	                mode++;
	            }
	            num>>>=1;
	        }
	        return mode;
	    }

	    var modes = 0, strength = 0;
	    if(pwd.length >= 6){
	    	for(var i=0; i<pwd.length; i++){
                //pwd.charCodeAt(i) 返回对应字符的Unicode 编码
                //CharMode(pwd.charCodeAt(i)) 根据字符的Unicode 编码判断字符分别属于数字，大写字母，小写字母
                //modes|= 通过按位或运算，得出密码最终的一个模式
                modes|=CharMode(pwd.charCodeAt(i));
            }
            strength =  bitTotal(modes);
	    }

        return strength;
   }


    //升级商户
    $("#upgradeBtn").click(function(){
    	var merchantId = sessionStorage.getItem('merchantId');
        var indexs = $("#listTable tr.selected").index();
        //加载商户
        var dataList = {
            page: 1,
            rows: 10
        }
        var res = reqAjax("operations/chargeLevelTypeList", JSON.stringify(dataList));
        if(res.code == 1){
            var lHtml = "";
            for(var i=1, len=res.data.length; i<len; i++){
                lHtml += '<option data-money="'+res.data[i].amount+'" value="'+res.data[i].id+'">'+res.data[i].levelName+'</option>'
            }

            $("#changbasic").html(lHtml);
        }else{
            layer.msg(res.msg);
        }

        if(indexs == -1){
            layer.alert("请选中列表中的行");
        }else{
            var ress = reqAjax("operations/previewUpgradingInfo","{'merchantId':'"+merchantId+"'}");
        	var data = ress.data;
        	$('#merName').val(data.merchantName)
        	$('#lowPeople').val(data.merchantName)
        	$('#topPeople').val(data.refTopUserName)
            $(".upgradeModal").attr("id","upgradeModal");

            $("#changbasic").change(function(){
                var val = $("#changbasic").find("option:selected").val();
                var money = $("#changbasic").find("option:selected").attr("data-money");
                $("#upgradeMoney").val(money);
            });

        }

    });

    //升级保存
    $(".upgradeModal").on("click","#add-para",function(){
        var id = $("#listTable tr.selected").attr("data-merchantId");
        var upgradeType = $("#changbasic").find("option:selected").val();
        var money = $("#upgradeMoney").val();
        var param = {
            userNo:userno, //操作人
            merchantId : id, //商户id
            upgradeType : upgradeType, //升级类型
            money : money //金额
        }

        var res = reqAjax(REQUEST_URL['upgrade'],JSON.stringify(param));
        if(res.code == 1){
            layer.msg("保存成功");
            $(".upgradeModal").modal("hide");
            loadListData();
        }else{
            layer.msg(res.msg);
        }
    });
})(jQuery);
