$(function () {
    var merchantId = getUrlParams('merchantId');
    var backUserId = getUrlParams('userId');
    var REQUIRE_URL = {
        quireApprovalRule:'leave/selectScProcessRule',//查询审批设置
        saveSetting:'leave/saveScProcessRule',//保存设置
        approvalPeople:'processSet/findOrgTreeAndStaffByUserId'//审批人员
    };
    var selectPeople = [];//所有审批人
    var selectedApprovalPeople = [];//已选择审批人
    var selectedCopyPeople = [];//已选择抄送人
    //查询审批设置
    function getApprovalRule(){
        var params = {
            merchantId:merchantId
        };
        reqAjaxAsync(REQUIRE_URL['quireApprovalRule'],JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5})
            }else{
                // 初始化默认审批任何默认抄送人
                var approvalHtml = template('listApprovalTpl',res.data!==null?res.data.listApproval:[]);
                var copyHtml = template('listAdjunctTpl',res.data!==null?res.data.listAdjunct:[]);
                $('.approvalPeopleBox').html(approvalHtml);
                $('.copyPeopleBox').html(copyHtml);
                selectedApprovalPeople = res.data !== null?res.data.listApproval:[];
                selectedCopyPeople = res.data !== null?res.data.listAdjunct:[];
                if(res.data !== null){
                    //初始化审批方式
                    $('.approvalType ul li:eq('+(res.data.processType-1)+')').addClass('active').siblings('li').removeClass('active');
                    //初始化抄送方式
                    $('.noticeType ul li:eq('+(res.data.informType-1)+')').addClass('active').siblings('li').removeClass('active');
                }
                if($('.approvalType ul .active').attr('data-processType') == 1){
                    $('.approvalPeopleBox li .arrowIcon').css('visibility','visible')
                }else{
                    $('.approvalPeopleBox li .arrowIcon').css('visibility','hidden')
                }
            }
        })
    }
    //获取所有店铺下可审批人员
    function allPeople(){
        var defer = $.Deferred();
        var params = {
            "userId": backUserId
        };
        reqAjaxAsync(REQUIRE_URL['approvalPeople'],JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5})
            }else{
                defer.resolve(res);
				var subOrgList = res.data.subOrgList;
				for(var i=0; i<subOrgList.length; i++){
					if(subOrgList[i].userList.length > 0){
						selectPeople.push(subOrgList[i]);
					}
					
				}
				if(res.data.userList.length > 0){
					var temp = {
						orgName: "管理员", 
						userList: res.data.userList
					};
					selectPeople.push(temp);
				}
                //selectPeople = res.data.subOrgList;
				//otherSelector = res.data.userList;
            }
        });
        return defer.promise()
    }
    //保存设置
    $('.saveBtn').click(function () {
        var processType = $('.approvalType ul .active').attr('data-processType');
        var informType = $('.noticeType ul .active').attr('data-informType');
        var approvalUserid = [];
        var adjunctUserid = [];
        $('.approvalPeopleBox li').each(function (index, item) {
            if($(item).attr('data-userId')){
                approvalUserid.push($(item).attr('data-userId'))
            }
        });
        $('.copyPeopleBox li').each(function (index, item) {
            if($(item).attr('data-userId')){
                adjunctUserid.push($(item).attr('data-userId'))
            }
        });
        if(approvalUserid.length === 0){
            layer.msg('请选择默认审批人',{icon:2});
            return
        }
        approvalUserid = approvalUserid.join(',');
        adjunctUserid = adjunctUserid.join(',');
        var params = {
            "processType": processType,
            "approvalUserid": approvalUserid,
            "adjunctUserid": adjunctUserid,
            "merchantId": merchantId,
            "informType": informType,
            "createId": backUserId
        };
        reqAjaxAsync(REQUIRE_URL['saveSetting'],JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5})
            }else{
                layer.msg('保存成功！',{icon:1,time:2000});
                getApprovalRule()
            }
        })
    });
    // 选择审批人员和通知人员弹窗
    function peopleSelector(selectedArr, popTitle){
        var defer = $.Deferred();
        var obj = {};//储存弹窗需要的渲染数据
        var selected = [];//已选择的人
        var list = [];//所有待选人列表，不分店铺
        var selectList = JSON.parse(JSON.stringify(selectPeople));//可操作的多有待选人数据
        selectList.forEach(function (item, index) {
            item.userList.forEach(function (v,i) {
                list.push(v)
            })
        });
        // 通过已选择人的id从所有人中筛选出数据列表
        selectedArr.forEach(function (item, index) {
            list.forEach(function (v, i) {
                if(item.userId == v.id){
                    selected.push(v);
                }
            });
        });
        //去重
        selected = distinct(selected,'id');
        selected.forEach(function (item, index) {
            selectList.forEach(function (v , i) {
                v.userList.forEach(function (value, INDEX) {
                    if(item.id == value.id){
                        value.select = true
                    }
                })
            })
        });
		obj.title = popTitle;
        obj.select = selectList;
        obj.selected = selected;
        var html = template('selectPeopleTpl',obj);
        layer.open({
            type:1,
            title:'',
            area:['840px','90%'],
            closeBtn:0,
            shade:0.5,
            shadeClose:true,
            skin:'selectPeople',
            content:html,
            success:function (layeror,index) {
                $('.mainContent').outerHeight($(layeror).height()-$('.title').height()-$('.btnBox').outerHeight(true));
                $('.mainContent>div>div').outerHeight($('.mainContent').height()-$('.mainContent>div>p').outerHeight(true));
                $('.selectContent').on('click','.item h4',function () {
                    $(this).siblings('ul').slideToggle(100)
                });
                //选择审批人员或者通知人员
                $(layeror).on('click','.items li',function () {
                    var html = '';
                    var id = $(this).attr('data-id');
                    $(this).toggleClass('active');
                    if($(this).hasClass('active')){
                        $('.items li').each(function (index, item) {
                            if($(this).attr('data-id') == id){
                                $(this).addClass('active')
                            }
                        });
                        // 将选中的数据追加到已选中的数据中
                        selectPeople.forEach(function (item, index) {
                            item.userList.forEach(function (v,i) {
                                if(v.id == id){
                                    selected.push(v)
                                }
                            })
                        });
                        //去重
                        selected = distinct(selected,'id');
                        //在所有可选数据中标记是否选中状态
                        selected.forEach(function (item, index) {
                            selectList.forEach(function (v , i) {
                                v.userList.forEach(function (value, INDEX) {
                                    if(item.id == value.id){
                                        value.select = true
                                    }
                                })
                            })
                        });
                        selected.forEach(function (item,index) {
                            html+='<li data-id="'+item.id+'">'
                                +'<div class="name">'
                                +'<i class="No">'+(index*1+1)+'</i>'
                                +'<span>'+item.username+'</span>'
                                +'</div>'
                                +'<div class="phoneNum">'
                                +'<i class="pIcon"></i>'
                                +'<span>'+item.phone+'</span>'
                                +'</div>'
                                +'</li>'
                        });
                        $('.selectedBox ul').html(html)
                    }else{
                        $('.items li').each(function (index, item) {
                            if($(this).attr('data-id') == id){
                                $(this).removeClass('active')
                            }
                        });
                        //在已选中的数据中删除未选中的数据
                        selected.forEach(function (item, index) {
                            if(id == item.id){
                                selected.splice(index, 1)
                            }
                        });
                        //在所有可选数据中标记是否选中状态
                        selectList.forEach(function (v , i) {
                            v.userList.forEach(function (value, INDEX) {
                                if(id == value.id){
                                    value.select = false
                                }
                            })
                        });
                        selected.forEach(function (item,index) {
                            html+='<li data-id="'+item.id+'">'
                                +'<div class="name">'
                                +'<i class="No">'+(index*1+1)+'</i>'
                                +'<span>'+item.username+'</span>'
                                +'</div>'
                                +'<div class="phoneNum">'
                                +'<i class="pIcon"></i>'
                                +'<span>'+item.phone+'</span>'
                                +'</div>'
                                +'</li>'
                        });
                        $('.selectedBox ul').html(html)
                    }
                });
                $('.cancel').click(function () {
                    layer.close(index)
                });
                $('.sure').click(function () {
                    var selectedArr = [];
                    $('.selectedContent li').each(function (index, item) {
                        selectedArr.push({
                            userId:$(this).attr('data-id'),
                            userName:$(this).find('.name span').text()
                        })
                    });
                    defer.resolve(selectedArr);
                    layer.close(index)
                });
                //搜索
                $(layeror).on('submit','form',function () {
                    var keyword = $(this).find('input').val().trim();
                    var searchArr = [];
                    selectPeople.forEach(function (item, index) {
                        var userList = [];
                        item.userList.forEach(function (v,i) {
                            if(v.username.indexOf(keyword)!==-1||v.phone.indexOf(keyword)!==-1){
                                userList.push(v)
                            }
                        });
                        if(userList.length > 0){
                            var value = JSON.parse(JSON.stringify(item));
                            value.userList = userList;
                            searchArr.push(value)
                        }
                    });
                    selected.forEach(function (item, index) {
                        searchArr.forEach(function (v , i) {
                            v.userList.forEach(function (value, INDEX) {
                                if(item.id == value.id){
                                    value.select = true
                                }
                            })
                        })
                    });
                    var html = template('searchTpl',searchArr);
                    $('.items').html(html)
                });
                $(layeror).on('keyup','form input',function () {
                    if($(this).val().trim() === ''){
                        var html = template('searchTpl',selectList);
                        $('.items').html(html)
                    }
                })
            }
        });
        return defer.promise()
    }
    $('.approvalPeopleBox').on('click','.approvalAddBtn',function () {
        peopleSelector(selectedApprovalPeople, "选择审批人").done(function (data) {
            var html = template('listApprovalTpl',data);
            $('.approvalPeopleBox').html(html);
            selectedApprovalPeople = data;
        })
    });
    $('.copyPeopleBox').on('click','.copyAddBtn',function () {
        peopleSelector(selectedCopyPeople, "选择抄送人").done(function (data) {
            var html = template('listAdjunctTpl',data);
            $('.copyPeopleBox').html(html);
            selectedCopyPeople = data;
        })
    });
    //初始化页面
    init();
    function init(){
        // 查询审批设置
        getApprovalRule();
        //获取可审批人员
        allPeople();
        //设置审批方式
        $('.approvalType').on('click','li',function () {
            $(this).addClass('active').siblings('li').removeClass('active');
            if($(this).attr('data-processType') == 1){
                $('.approvalPeopleBox li .arrowIcon').css('visibility','visible')
            }else{
                $('.approvalPeopleBox li .arrowIcon').css('visibility','hidden')
            }
        });
        //设置通知方式
        $('.noticeType').on('click','li',function () {
            $(this).addClass('active').siblings('li').removeClass('active');
        });
        //删除审批人
        $('.approvalPeopleBox').on('click','li',function (e) {
            var id = $(this).attr('data-userId');
            if(id){
                $(this).remove();
                selectedApprovalPeople.forEach(function (item, index) {
                    if(item.userId == id){
                        selectedApprovalPeople.splice(index,1)
                    }
                })
            }
        });
        //删除抄送人
        $('.copyPeopleBox').on('click','li',function () {
            var id = $(this).attr('data-userId');
            if(id){
                $(this).remove();
                selectedCopyPeople.forEach(function (item, index) {
                    if(item.userId == id){
                        selectedCopyPeople.splice(index,1)
                    }
                })
            }
        })
    }
    //已选择人员去重
     function distinct(arr,type){
        var result = [],
            i,
            j,
            len = arr.length;
        for(i = 0; i < len; i++){
            for(j = i + 1; j < len; j++){
                if(arr[i][type] === arr[j][type]){
                    j = ++i;
                }
            }
            result.push(arr[i]);
        }
        return result;
    }
});