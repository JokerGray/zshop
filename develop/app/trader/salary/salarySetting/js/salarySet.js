// url获取 merchantId
var merchantId = getQueryString('merchantId');
var shopId = getQueryString('shopId');

$(document).ready(function(){
	tableInit();
});


function tableInit(){
    $('#position').bootstrapTable({
        url: '/zxcity_restful/ws/rest',
        method: 'post',
        ajaxOptions:{
            headers:{
                apikey: 'test'
            }
        },
        contentType: "application/x-www-form-urlencoded",
        queryParams: function(params){
            var p = {
                cmd: 'shop/newsalary/getPositionProjects',
                data: JSON.stringify({
                	merchantId: merchantId,
                    pagination: {
                        page: params.offset/params.limit + 1,
                        rows: params.limit
                    }
                }),
                version: 1
            }
            return p;
        },
        responseHandler: function(res){
            res.rows = res.data
            return res;
        },
        sidePagination: "server",
        pageNumber:1,
        pageSize: 10,
        pageList: [10, 25, 50, 100],
        // striped: true,
        pagination: true,
        sortable: false,
        cardView: false,
        detailView: false,
        columns: [
            { field: 'positionName', title: '职务', width: 150, align: 'center' },
            { field: 'referenceSalary', title: '职务底薪', width: 150, align: 'center', formatter: function (val, row, index) {
               	return '<input type="text" maxlength="11" value="'+val+'" class="baseSalary" onkeyup="moneyCheck(this)" onchange="moneyCheck(this);modifyInfo(this)"><span class="yuan">元</span>';
            }},
            { field: 'fixedSubsidy', title: '固定补助', width: 150, align: 'center',formatter:function(val, row, index){
            	return '<input type="text" maxlength="11" value="'+val+'" class="fixedSubsidy" onkeyup="moneyCheck(this)" onchange="moneyCheck(this);modifyInfo(this)"><span class="yuan">元</span>';
            }},
            { field: 'id', title: '该职务下员工个人底薪', width: 150, align: 'center',formatter: function(val, row, index){
                return '<a href="javascript:;" positionId="'+val+'" class="skyBule" id="searchInfo" onclick="serchInfo(this)">查看详情</a>'
            }},
            {field: 'projectNum', title: '业绩提成', width: 150, align: 'center',formatter:function(val, row, index){
            	if(val > 0){
            		return '<a class="rules" onclick="setting(this)"><span class="counts">'+val+'</span>条规则</a>'
            	}else{
            		return '<a href="javascript:;" class="setting" onclick="setting(this)">设置</a>'
            	}
            }},
            {
                field: 'id', title: '操作', width: 150, align: 'center', formatter: function (val, row, index) {
                    return '<a href="javascript:;" class="delete" onclick="deleteBtn(this)">删除</a> <a href="javascript:;" class="modifyPositionBtn" onclick="modifyPositionBtn(this)">修改</a>'
                }
            }
        ]
    });
}

//设置  按钮点击事件
function setting(self) {
    var dataAll = $('#position').bootstrapTable('getData');
    var index = $(self).parent().parent().index();
    $(self).attr({'href':'salarySetCase.html?merchantId='+merchantId+'&positionId='+dataAll[index].id});

    // if(dataAll[index].projectNum > 0){
    //     $(self).attr({'href':'salarySetCase.html?merchantId='+merchantId+'&positionId='+dataAll[index].id});  // type 为0 原有  stype为1 新增
    // }else{
    //     $(self).attr({'href':'salarySetCase.html?merchantId='+merchantId+'&positionId='+dataAll[index].id});
    // } 
}

// 查看详情
function serchInfo(self){
	var dataAll = $('#position').bootstrapTable('getData');
    var index = $(self).parent().parent().index();
    // console.log(dataAll[index]);
    layer.open({
        type: 2,  
        area: ['800px', '500px'],
        btn: ['关闭'],
        title: '职务员工列表',
        maxmin: true,
        content: 'details.html?merchantId='+merchantId+'&positionId='+dataAll[index].id+'&shopId='+shopId+'&positionName='+dataAll[index].positionName,
        yes: function(index, layero){
            layer.close(index);
        }
    }); 
}

// 根据职务ID修改职务参考薪资以及固定补助
function modifyInfo(self){
	var fixedSubsidy = $(self).parent().parent().find('.fixedSubsidy').val();
	var referenceSalary = $(self).parent().parent().find('.baseSalary').val();
	var positionId = $(self).parent().parent().find('#searchInfo').attr('positionId');

    console.log(fixedSubsidy+'__'+referenceSalary+'__'+positionId);

	if(fixedSubsidy.trim('') == ''){
		layer.msg('固定补助不能为空！',{icon:2});
        return;
	}

	if(referenceSalary.trim('') == ''){
        layer.msg('职务底薪不能为空！',{icon:2});
        return;
	}

	var def = reqAjax('shop/newsalary/updatePosition', {
		fixedSubsidy : fixedSubsidy,
		referenceSalary : referenceSalary,
		positionId : positionId
	});
	def.then(function(data){
		if(data.code == 1){
            layer.msg(data.msg,{icon:1});
        }else{
            layer.msg(data.msg,{icon:2});
        }
	})
}

// 删除 职务
function deleteBtn(self){
    var dataAll = $('#position').bootstrapTable('getData');
    var index = $(self).parent().parent().index();

    var index1 = layer.confirm('确定要删除该职务吗?', function(){
        // 删除 职务 接口联调
        var def = reqAjax('shop/newsalary/deletePosition', {
            positionId : dataAll[index].id
        });
        def.then(function(data){
            if(data.code == 1){
                layer.msg(data.msg,{icon:1});
                layer.close(index1);
                location.reload();
            }else{
                layer.msg(data.msg,{icon:2});
            }
        })
    });
}

// 新增职务
function addPosition(self){ 
    //自定页
    layer.open({
        type: 2,  
        area: ['800px', '400px'],
        btn: ['确定','取消'],
        title: '新增职务',
        maxmin: true,
        content: 'position.html?merchantId='+merchantId+'&type=0',
        yes: function(index, layero){
            //获取到弹框里面的body
            var body = layer.getChildFrame('body', index);
            var iframeWin = layero.find('iframe')[0]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
            var res = iframeWin.contentWindow.modifyPosition();

            if(res.positionName.trim('') == ''){
                layer.msg('职务名称不能为空！',{icon:2});
                return;
            }

            if(res.referenceSalary.trim('') == ''){
                layer.msg('参考薪资不能为空！',{icon:2});
                return;
            }

            if(res.fixedSubsidy.trim('') == ''){
                layer.msg('固定补助不能为空！',{icon:2});
                return;
            }

            // 接口联调
            var def = reqAjax('shop/newsalary/addOrUpdatePosition', {
                "scSysPosition": [//职务对象
                    {
                        "id": res.id,//主键值，修改传，新增不用传
                        "positionName": res.positionName,//职务名称，必传
                        "merchantId": merchantId,//商户主键,必传
                        "referenceSalary": res.referenceSalary,//参考薪资,必传
                        "fixedSubsidy": res.fixedSubsidy,//固定补助,必传
                        "isMessageRemind": res.isMessageRemind//是否设置短信提醒,必传
                    }
                ]
            });
            def.then(function(data){
                if(data.code == 1){
                    layer.close(index);
                    // 初始表格
                    $('#position').bootstrapTable('refresh');
                    layer.msg(data.msg,{icon:1});
                }else{
                    layer.msg(data.msg,{icon:2});
                }
                
            })
        }
    }); 
}

// 修改职务
function modifyPositionBtn(self){
    var dataAll = $('#position').bootstrapTable('getData');
    var index = $(self).parent().parent().index();
    var positionId = dataAll[index].id;

    //自定页
    layer.open({
        type: 2,  
        area: ['800px', '400px'],
        btn: ['确定','取消'],
        title: '修改职务',
        maxmin: true,
        content: 'position.html?merchantId='+merchantId+'&type=1'+'&positionId='+positionId,
        yes: function(index, layero){
            //获取到弹框里面的body
            var body = layer.getChildFrame('body', index);
            var iframeWin = layero.find('iframe')[0]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
            var res = iframeWin.contentWindow.modifyPosition();

            if(res.positionName.trim('') == ''){
                layer.msg('职务名称不能为空！',{icon:2});
                return;
            }

            if(res.referenceSalary.trim('') == ''){
                layer.msg('参考薪资不能为空！',{icon:2});
                return;
            }

            if(res.fixedSubsidy.trim('') == ''){
                layer.msg('固定补助不能为空！',{icon:2});
                return;
            }

            // 接口联调
            var def = reqAjax('shop/newsalary/addOrUpdatePosition', {
                "scSysPosition": [//职务对象
                    {
                        "id": res.id,//主键值，修改传，新增不用传
                        "positionName": res.positionName,//职务名称，必传
                        "merchantId": merchantId,//商户主键,必传
                        "referenceSalary": res.referenceSalary,//参考薪资,必传
                        "fixedSubsidy": res.fixedSubsidy,//固定补助,必传
                        "isMessageRemind": res.isMessageRemind//是否设置短信提醒,必传
                    }
                ]
            });
            def.then(function(data){
                if(data.code == 1){
                    layer.close(index);
                    // 初始表格
                    $('#position').bootstrapTable('refresh');
                    layer.msg(data.msg,{icon:1});
                }else{
                    layer.msg(data.msg,{icon:2});
                }
                
            })
        }
    }); 
}


// 金额 校验
function moneyCheck(self){
    if($(self).val().length <= 8){
        if($(self).val().length==1){
            $(self).val($(self).val().replace(/[^0-9]/g,''));
        } else {
            $(self).val($(self).val().replace(/[^0-9.]/g,''));
            $(self).val($(self).val().replace(/\.{2,}/g,"."));
            $(self).val($(self).val().replace(".","$#$").replace(/\./g,"").replace("$#$","."));

            if($(self).val().split('.')[1] != undefined && $(self).val().split('.')[1].length > 2){
                $(self).val($(self).val().split('.')[0] +'.'+ $(self).val().split('.')[1].substring(0,2));
            }
        }
    }else{
        $(self).val($(self).val().replace(/[^0-9.]/g,''));
        $(self).val($(self).val().replace(/\.{2,}/g,"."));
        $(self).val($(self).val().replace(".","$#$").replace(/\./g,"").replace("$#$","."));

        // 整数 金额超过 8 位
        if($(self).val() > 99999999.99){
            $(self).val($(self).val().substring(0,8));
        }

        if($(self).val().split('.')[1] != undefined && $(self).val().split('.')[1].length > 2){
            $(self).val($(self).val().split('.')[0] +'.'+ $(self).val().split('.')[1].substring(0,2));
        }
    }
} 


// 优秀 员工奖 模块

inint();
// 新增按钮
function addBtn(self){
    var number = 0;
    $(self).parent().parent().find('.content .items').each(function(index, el) {
        if(index == $(self).parent().parent().find('.content .items').length-1){
            number += parseFloat($(el).find('.nums').text());
        }
    });
    number += 1;

    if(number > 5){
        layer.msg('奖励名次已上限!',{icon:2});
        return;
    }

    var content = $($('#tp1').html()).first().clone();
    content.find('.nums').text(number);

    content.find('.rewardValue').show();
    content.find('.rewardValueText').hide();
    content.find('.submitBtn').show();
    content.find('.modifyBtn').hide();

    $(self).parent().parent().find('.content').append(content);
}

// 初始化优秀员工奖奖项信息
function inint(){
    var def = reqAjax('shop/newsalary/getMerchantRewardEmployees', {
        merchantId : merchantId
    });
    def.then(function(data){
        if(data.code == 1){
        $('.goodsEmployeesSetting').show();
        $('.lottery').hide();
        // 天奖
            // 主键id
            $('.dayAward').attr({'keyId':data.data[0].id});

            // 当天服务业绩最高
            $('.dayResults').attr({'dayResultsId': data.data[0].scSalaryRewardProjects[0].id});
            // 初始化
            $('.dayResults .content').text('');
            if(data.data[0].scSalaryRewardProjects[0].scSalaryRewardLevelList.length > 0){
                for(var i = 0;i<data.data[0].scSalaryRewardProjects[0].scSalaryRewardLevelList.length;i++){
                    var content = $($('#tp1').html()).first().clone();
                    content.attr({'dayResultsItemId':data.data[0].scSalaryRewardProjects[0].scSalaryRewardLevelList[i].projectId});
                    content.find('.nums').text(data.data[0].scSalaryRewardProjects[0].scSalaryRewardLevelList[i].ranking);
                    content.find('.rewardValue').val(data.data[0].scSalaryRewardProjects[0].scSalaryRewardLevelList[i].rewardValue);
                    content.find('.rewardValueText').text(data.data[0].scSalaryRewardProjects[0].scSalaryRewardLevelList[i].rewardValue);
                    $('.dayResults .content').append(content);
                }
            }
            // console.log(data.data[0].scSalaryRewardProjects[1]);
            // 当天服务业绩最高
            $('.dayService').attr({'dayResultsId': data.data[0].scSalaryRewardProjects[1].id});
            // 初始化
            $('.dayService .content').text('');
            if(data.data[0].scSalaryRewardProjects[1].scSalaryRewardLevelList.length > 0){
                for(var i = 0;i<data.data[0].scSalaryRewardProjects[1].scSalaryRewardLevelList.length;i++){
                    var content = $($('#tp1').html()).first().clone();
                    content.attr({'dayResultsItemId':data.data[0].scSalaryRewardProjects[1].scSalaryRewardLevelList[i].projectId});
                    content.find('.nums').text(data.data[0].scSalaryRewardProjects[1].scSalaryRewardLevelList[i].ranking);
                    content.find('.rewardValue').val(data.data[0].scSalaryRewardProjects[1].scSalaryRewardLevelList[i].rewardValue);
                    content.find('.rewardValueText').text(data.data[0].scSalaryRewardProjects[1].scSalaryRewardLevelList[i].rewardValue);
                    $('.dayService .content').append(content);
                }
            }

            // console.log(data.data[0].scSalaryRewardProjects[2]);
            // 当天现金收入最高
            $('.dayCash').attr({'dayResultsId': data.data[0].scSalaryRewardProjects[2].id});
            // 初始化
            $('.dayCash .content').text('');
            if(data.data[0].scSalaryRewardProjects[2].scSalaryRewardLevelList.length > 0){
                for(var i = 0;i<data.data[0].scSalaryRewardProjects[2].scSalaryRewardLevelList.length;i++){
                    var content = $($('#tp1').html()).first().clone();
                    content.attr({'dayResultsItemId':data.data[0].scSalaryRewardProjects[2].scSalaryRewardLevelList[i].projectId});
                    content.find('.nums').text(data.data[0].scSalaryRewardProjects[2].scSalaryRewardLevelList[i].ranking);
                    content.find('.rewardValue').val(data.data[0].scSalaryRewardProjects[2].scSalaryRewardLevelList[i].rewardValue);
                    content.find('.rewardValueText').text(data.data[0].scSalaryRewardProjects[2].scSalaryRewardLevelList[i].rewardValue);
                    $('.dayCash .content').append(content);
                }
            }
        // 月奖
            // 主键id
            $('.monthAward').attr({'keyId':data.data[1].id});

            // 当天服务业绩最高
            $('.monthResults').attr({'dayResultsId': data.data[1].scSalaryRewardProjects[0].id});
            // 初始化
            $('.monthResults .content').text('');
            if(data.data[1].scSalaryRewardProjects[0].scSalaryRewardLevelList.length > 0){
                for(var i = 0;i<data.data[1].scSalaryRewardProjects[0].scSalaryRewardLevelList.length;i++){
                    var content = $($('#tp1').html()).first().clone();
                    content.attr({'dayResultsItemId':data.data[1].scSalaryRewardProjects[0].scSalaryRewardLevelList[i].projectId});
                    content.find('.nums').text(data.data[1].scSalaryRewardProjects[0].scSalaryRewardLevelList[i].ranking);
                    content.find('.rewardValue').val(data.data[1].scSalaryRewardProjects[0].scSalaryRewardLevelList[i].rewardValue);
                    content.find('.rewardValueText').text(data.data[1].scSalaryRewardProjects[0].scSalaryRewardLevelList[i].rewardValue);
                    $('.monthResults .content').append(content);


                }
            }
            // console.log(data.data[1].scSalaryRewardProjects[1]);
            // 当天服务业绩最高
            $('.monthService').attr({'dayResultsId': data.data[1].scSalaryRewardProjects[1].id});
            // 初始化
            $('.monthService .content').text('');
            if(data.data[1].scSalaryRewardProjects[1].scSalaryRewardLevelList.length > 0){
                for(var i = 0;i<data.data[1].scSalaryRewardProjects[1].scSalaryRewardLevelList.length;i++){
                    var content = $($('#tp1').html()).first().clone();
                    content.attr({'dayResultsItemId':data.data[1].scSalaryRewardProjects[1].scSalaryRewardLevelList[i].projectId});
                    content.find('.nums').text(data.data[1].scSalaryRewardProjects[1].scSalaryRewardLevelList[i].ranking);
                    content.find('.rewardValue').val(data.data[1].scSalaryRewardProjects[1].scSalaryRewardLevelList[i].rewardValue);
                    content.find('.rewardValueText').text(data.data[1].scSalaryRewardProjects[1].scSalaryRewardLevelList[i].rewardValue);
                    $('.monthService .content').append(content);
                }
            }

            // console.log(data.data[1].scSalaryRewardProjects[2]);
            // 当天现金收入最高
            $('.monthCash').attr({'dayResultsId': data.data[1].scSalaryRewardProjects[2].id});
            // 初始化
            $('.monthCash .content').text('');
            if(data.data[1].scSalaryRewardProjects[2].scSalaryRewardLevelList.length > 0){
                for(var i = 0;i<data.data[1].scSalaryRewardProjects[2].scSalaryRewardLevelList.length;i++){
                    var content = $($('#tp1').html()).first().clone();
                    content.attr({'dayResultsItemId':data.data[1].scSalaryRewardProjects[2].scSalaryRewardLevelList[i].projectId});
                    content.find('.nums').text(data.data[1].scSalaryRewardProjects[2].scSalaryRewardLevelList[i].ranking);
                    content.find('.rewardValue').val(data.data[1].scSalaryRewardProjects[2].scSalaryRewardLevelList[i].rewardValue);
                    content.find('.rewardValueText').text(data.data[1].scSalaryRewardProjects[2].scSalaryRewardLevelList[i].rewardValue);
                    $('.monthCash .content').append(content);
                }
            }

        // 季奖
            // 主键id
            $('.quarterAward').attr({'keyId':data.data[2].id});

            // 当天服务业绩最高
            $('.quarterResults').attr({'dayResultsId': data.data[2].scSalaryRewardProjects[0].id});
            // 初始化
            $('.quarterResults .content').text('');
            if(data.data[2].scSalaryRewardProjects[0].scSalaryRewardLevelList.length > 0){
                for(var i = 0;i<data.data[2].scSalaryRewardProjects[0].scSalaryRewardLevelList.length;i++){
                    var content = $($('#tp1').html()).first().clone();
                    content.attr({'dayResultsItemId':data.data[2].scSalaryRewardProjects[0].scSalaryRewardLevelList[i].projectId});
                    content.find('.nums').text(data.data[2].scSalaryRewardProjects[0].scSalaryRewardLevelList[i].ranking);
                    content.find('.rewardValue').val(data.data[2].scSalaryRewardProjects[0].scSalaryRewardLevelList[i].rewardValue);
                    content.find('.rewardValueText').text(data.data[2].scSalaryRewardProjects[0].scSalaryRewardLevelList[i].rewardValue);
                    $('.quarterResults .content').append(content);


                }
            }
            // console.log(data.data[2].scSalaryRewardProjects[1]);
            // 当天服务业绩最高
            $('.quarterService').attr({'dayResultsId': data.data[2].scSalaryRewardProjects[1].id});
            // 初始化
            $('.quarterService .content').text('');
            if(data.data[2].scSalaryRewardProjects[1].scSalaryRewardLevelList.length > 0){
                for(var i = 0;i<data.data[2].scSalaryRewardProjects[1].scSalaryRewardLevelList.length;i++){
                    var content = $($('#tp1').html()).first().clone();
                    content.attr({'dayResultsItemId':data.data[2].scSalaryRewardProjects[1].scSalaryRewardLevelList[i].projectId});
                    content.find('.nums').text(data.data[2].scSalaryRewardProjects[1].scSalaryRewardLevelList[i].ranking);
                    content.find('.rewardValue').val(data.data[2].scSalaryRewardProjects[1].scSalaryRewardLevelList[i].rewardValue);
                    content.find('.rewardValueText').text(data.data[2].scSalaryRewardProjects[1].scSalaryRewardLevelList[i].rewardValue);
                    $('.quarterService .content').append(content);
                }
            }

            // console.log(data.data[2].scSalaryRewardProjects[2]);
            // 当天现金收入最高
            $('.quarterCash').attr({'dayResultsId': data.data[2].scSalaryRewardProjects[2].id});
            // 初始化
            $('.quarterCash .content').text('');
            if(data.data[2].scSalaryRewardProjects[2].scSalaryRewardLevelList.length > 0){
                for(var i = 0;i<data.data[2].scSalaryRewardProjects[2].scSalaryRewardLevelList.length;i++){
                    var content = $($('#tp1').html()).first().clone();
                    content.attr({'dayResultsItemId':data.data[2].scSalaryRewardProjects[2].scSalaryRewardLevelList[i].projectId});
                    content.find('.nums').text(data.data[2].scSalaryRewardProjects[2].scSalaryRewardLevelList[i].ranking);
                    content.find('.rewardValue').val(data.data[2].scSalaryRewardProjects[2].scSalaryRewardLevelList[i].rewardValue);
                    content.find('.rewardValueText').text(data.data[2].scSalaryRewardProjects[2].scSalaryRewardLevelList[i].rewardValue);
                    $('.quarterCash .content').append(content);
                }
            }

        // 年奖
            // 主键id
            $('.yearAward').attr({'keyId':data.data[3].id});

            // 当天服务业绩最高
            $('.yearResults').attr({'dayResultsId': data.data[3].scSalaryRewardProjects[0].id});
            // 初始化
            $('.yearResults .content').text('');
            if(data.data[3].scSalaryRewardProjects[0].scSalaryRewardLevelList.length > 0){
                for(var i = 0;i<data.data[3].scSalaryRewardProjects[0].scSalaryRewardLevelList.length;i++){
                    var content = $($('#tp1').html()).first().clone();
                    content.attr({'dayResultsItemId':data.data[3].scSalaryRewardProjects[0].scSalaryRewardLevelList[i].projectId});
                    content.find('.nums').text(data.data[3].scSalaryRewardProjects[0].scSalaryRewardLevelList[i].ranking);
                    content.find('.rewardValue').val(data.data[3].scSalaryRewardProjects[0].scSalaryRewardLevelList[i].rewardValue);
                    content.find('.rewardValueText').text(data.data[3].scSalaryRewardProjects[0].scSalaryRewardLevelList[i].rewardValue);
                    $('.yearResults .content').append(content);


                }
            }
            // console.log(data.data[3].scSalaryRewardProjects[1]);
            // 当天服务业绩最高
            $('.yearService').attr({'dayResultsId': data.data[3].scSalaryRewardProjects[1].id});
            // 初始化
            $('.yearService .content').text(''); 
            if(data.data[3].scSalaryRewardProjects[1].scSalaryRewardLevelList.length > 0){
                for(var i = 0;i<data.data[3].scSalaryRewardProjects[1].scSalaryRewardLevelList.length;i++){
                    var content = $($('#tp1').html()).first().clone();
                    content.attr({'dayResultsItemId':data.data[3].scSalaryRewardProjects[1].scSalaryRewardLevelList[i].projectId});
                    content.find('.nums').text(data.data[3].scSalaryRewardProjects[1].scSalaryRewardLevelList[i].ranking);
                    content.find('.rewardValue').val(data.data[3].scSalaryRewardProjects[1].scSalaryRewardLevelList[i].rewardValue);
                    content.find('.rewardValueText').text(data.data[3].scSalaryRewardProjects[1].scSalaryRewardLevelList[i].rewardValue);
                    $('.yearService .content').append(content);
                }
            }

            // console.log(data.data[1].scSalaryRewardProjects[2]);
            // 当天现金收入最高
            $('.yearCash').attr({'dayResultsId': data.data[3].scSalaryRewardProjects[2].id});
            // 初始化
            $('.yearCash .content').text(''); 
            if(data.data[3].scSalaryRewardProjects[2].scSalaryRewardLevelList.length > 0){
                for(var i = 0;i<data.data[3].scSalaryRewardProjects[2].scSalaryRewardLevelList.length;i++){
                    var content = $($('#tp1').html()).first().clone();
                    content.attr({'dayResultsItemId':data.data[3].scSalaryRewardProjects[2].scSalaryRewardLevelList[i].projectId});
                    content.find('.nums').text(data.data[3].scSalaryRewardProjects[2].scSalaryRewardLevelList[i].ranking);
                    content.find('.rewardValue').val(data.data[3].scSalaryRewardProjects[2].scSalaryRewardLevelList[i].rewardValue);
                    content.find('.rewardValueText').text(data.data[3].scSalaryRewardProjects[2].scSalaryRewardLevelList[i].rewardValue);
                    $('.yearCash .content').append(content);
                }
            }


        }else if(data.code == 8){
            $('.goodsEmployeesSetting').hide();
            $('.lottery').show();
        }else{
            layer.msg(data.msg,{icon:2});
        }
    })
}


// 优秀员工 新增 和 修改
function subBtn(self){
    var type =  $(self).parent().parent().attr('dayResultsItemId') == undefined ? 0 : 1;
    var projectId = $(self).parent().parent().attr('dayResultsItemId') == undefined ? $(self).parent().parent().parent().parent().attr('dayResultsId') : $(self).parent().parent().attr('dayResultsItemId');
    var ranking = $(self).parent().parent().find('.nums').text();
    var rewardValue = $(self).parent().parent().find('.rewardValue').val();

    if(rewardValue.trim('') == ''){
        layer.msg('奖金金额不能为空！',{icon:2});
        return;
    }

    // 接口联调
    var def = reqAjax('shop/newsalary/addOrUpdateRewardEmployee', {
        "scSalaryRewardLevel": [//奖项名次列表
            {
                "projectId": projectId,//奖项主键
                "ranking": ranking,//排名名次
                "rewardValue": rewardValue//奖励值
            }
        ],
        "type": type//操作类型0-新增；1-修改
    });

    def.then(function(data){
        if(data.code == 1){
            $(self).parent().parent().attr({'dayResultsItemId':projectId})
            $(self).hide();
            $(self).parent().find('.modifyBtn').show();
            $(self).parent().parent().find('.rewardValueText').show().text(rewardValue);
            $(self).parent().parent().find('.rewardValue').hide();
            layer.msg(data.msg,{icon:1});
        }else{
            layer.msg(data.msg,{icon:2});
        }
        
    })
}

// 优秀员工 删除
function delBtn(self){
    var projectId = $(self).parent().parent().attr('dayResultsItemId');
    var ranking = $(self).parent().parent().find('.nums').text();
    if(projectId == undefined){
        $(self).parent().parent().remove();
    }else{
        var index = layer.confirm('确定要删除吗？', {
            btn: ['确定','取消'] //按钮
        }, function(){
            // 删除
            var def = reqAjax('shop/newsalary/deleteRewardEmployee', {
                "scSalaryRewardLevel": [//奖项档次
                    {
                        "projectId": projectId,//奖项主键
                        "ranking": ranking//排名
                    }
                ]
            });
            def.then(function(data){
                if(data.code == 1){
                    layer.msg(data.msg,{icon:1});
                    inint();
                }else{
                    layer.msg(data.msg,{icon:2});
                }
            })
            
        });
    }
    
}

// 优秀员工 修改
function modifyBtn(self){
    $(self).hide();
    $(self).parent().find('.submitBtn').show();
    $(self).parent().parent().find('.rewardValueText').hide();
    $(self).parent().parent().find('.rewardValue').show();
}



// 开通优秀员工奖相关设置信息
function openAward(){
    var def = reqAjax('shop/newsalary/initRewardEmployee', {
        "merchantId": merchantId//商户主键
    });
    def.then(function(data){
        if(data.code == 1){
            location.reload();
            layer.msg(data.msg,{icon:1});
        }else{
            layer.msg(data.msg,{icon:2});
        }
    })
}
