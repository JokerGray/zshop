//(function($){
    var REQUEST_URL = {
        'getList':'leave/selectTaskPage',//审批列表
        'getDetail':'leave/detailScLeaveN'//查看审批详情
    };
    var pageNo = 1, pageSize = 8;
    var merchantId = getUrlParams('merchantId');
    var userId = getUrlParams('userId');
    //审批类型
    var oEventType = {1:"请假",2:"销假", 3:"补卡", 4:"通用", 6:"报销"};
    //审批状态 operateType
    var opTypeArr =[{1:"发起申请"},{2:"审批中"},{3:"已同意"},{4:"已拒绝"},{5:"已转交"},{6:"已撤销"},{7:"已提交归档人"},{8:"日报审批完成"},{9:"待审批中"}];
    var oLeaveType = {1:"事假", 2:"病假", 3:"调休", 4:"婚假", 5:"丧假", 6:"工伤假", 7:"上班卡", 8:"下班卡"};
    var oPriorityLevel = {1:"普通",2:"紧急",3:"非常紧急"};
    var oStatus = {1:"草稿",2:"审批中",3:"已同意",4:"已撤销",5:"已拒绝",6:"已归档"};

    //抄送类型 informType
    var oInfoTips = {
        1:"审批发起时通知抄送人",
        2:"审批完成后通知抄送人"
    };
    //审批类型 processType
    var oProcessTips = {
        1:"审批人依次审批",
        2:"必须所有审批人同意",
        3:"一名审批人同意"
    };

    //获取本月所有日期
function getNowDays() {
    var YYYY = formatAllDate(new Date(), "yyyy");
    var MM = formatAllDate(new Date(), "MM");
    var DD = formatAllDate(new Date(), "dd");
    // 获取今日日期
    var now = YYYY + "-" + MM + "-" + DD;
    //获取本月第一天日期
    var firstDay = YYYY + "-" + MM + "-" + "01";
    return [firstDay, now]
}
//时间控件初始化
laydate.render({
    elem: '#dateRange',
    range: "~",
    max: new Date().getTime(),
    value: getNowDays()[0] + " ~ " + getNowDays()[1],
    done: function (value, date, endDate) {
        var st1 = $.trim(value.split('~')[0]);
        var st2 = $.trim(value.split('~')[1]);
        getList('', st1, st2);
    }
});

    //查询详情
    function detailShow(leaveId){
        var param = {
            'leaveId':leaveId,//'422',
            'userId':userId
        }
        reqAjaxAsync(REQUEST_URL['getDetail'], JSON.stringify(param)).done(function(res){
            if(res.code == 1){
                if(res.data && res.data.processMap){
                    var obj = res.data;
                    var oProcessMap = obj.processMap;
                    var tempArr = oProcessMap.recordList1.concat(oProcessMap.recordList2);
                    var undoArr = oProcessMap.recordList3.concat(oProcessMap.recordList4);
                    var pics = [];
                    if(obj.scLeave.picUrl){
                        pics = JSON.parse(obj.scLeave.picUrl);
                    }
                    var expenseCount = 0;
                    if (obj.scLeave.listExpense && obj.scLeave.listExpense.length > 0){
                        obj.scLeave.listExpense.forEach(function(ele) {
                            expenseCount += Number(ele.expense)
                        }, this);
                    }
                    console.log(expenseCount);
                    var resData = {
                        'statusDes':oStatus[obj.scLeave.approvalStatus],
                        'eTypeName':oEventType[obj.scLeave.eventType],
                        'opTypeArr':opTypeArr,
                        'rList':tempArr,
                        'undoList':undoArr,
                        'scLeave':obj.scLeave,
                        'priorityLevel':oPriorityLevel[obj.scLeave.priorityLevel],
                        'pics':pics,
                        'infoTips':"" || (obj.scLeave.scProcessRule && oInfoTips[obj.scLeave.scProcessRule.informType]),
                        'processTips':"" || (obj.scLeave.scProcessRule && oProcessTips[obj.scLeave.scProcessRule.processType]),
                        'expenseCount': expenseCount
                    };

                    var sHtml = template('approvalDetailTpl'+obj.scLeave.eventType, resData);

                    layer.open({
                        type: 1,
                        title: "审批详情",
                        content: sHtml,
                        area: ["700px", "85%"],
                        scrollbar: false,
                        closeBtn: 1,
                        shade: 0.5,
                        shadeClose:true,
                        btn: '',
                        success: function(layero, index){
                            layer.photos({
                                photos: '.pic-box',
                                anim: 5
                            });

                            $(".record-title .unfold-icon, .unfold-link ").click(function(){
                                $(".unfold-link").slideToggle();
                                $(".unfold-link").siblings("table").slideToggle("slow");
                            });
                        }
                    })

                }
            }else{
                layer.msg(res.msg);
            }
        });
    }

    //列表页面渲染
    function listDataShow(obj){
        var sHtml = "";
        for(var i=0; i<obj.length; i++){
            sHtml += '<li class="list-item">'
            sHtml += '<div class="icon">'+obj[i].createByName.substring(0,1)+'</div>'
            sHtml += '<div class="info">'
            sHtml += '<div class="title">'
            sHtml += '<div>'
            sHtml += '<span class="name">'+obj[i].createByName+'的'+oEventType[obj[i].eventType]+'</span>'
            if (obj[i].eventType == 1){
                sHtml += '<span class="badge badge-' + obj[i].priorityLevel + '">' + oPriorityLevel[obj[i].priorityLevel] + '</span>'
            }
           
            sHtml += '</div>'
            sHtml += '<span class="time">'+obj[i].applyTime.substring(0, 16)+'</span>'
            sHtml += '</div>'
            if(obj[i].eventType == 3){
                sHtml += '<div class="info-item">补卡时间：'+obj[i].startTime.substring(0,10)+'</div>'
                    + '<div class="info-item">补卡类型：'+oLeaveType[obj[i].leaveType]+'</div>'
                    + '<div class="info-item">缺卡原因：'+obj[i].reason+'</div>'
            } else if (obj[i].eventType == 4){
                sHtml += '<div class="info-item">申请内容：' + obj[i].attachmentName + '</div>'
                    + '<div class="info-item">审批详情：' + obj[i].reason + '</div>'
            } else if (obj[i].eventType == 6){
                if (obj[i].listExpense.length > 0){
                    sHtml += '<div class="info-item">报销金额（元）：' + obj[i].listExpense[0].expense + '</div>'
                        + '<div class="info-item">报销类型：' + obj[i].listExpense[0].claimType + '</div>'
                        + '<div class="info-item">时间：' + obj[i].listExpense[0].claimTime + '</div>'
                }
               
            } else { 
                sHtml += '<div class="info-item">请假类型：'+oLeaveType[obj[i].leaveType]+'</div>'
                    + '<div class="info-item">开始时间：'+obj[i].startTime+'</div>'
                    + '<div class="info-item">结束时间：'+obj[i].endTime+'</div>'
            }


            sHtml += '</div>'
                + '<div class="handle-box">'
                + '<div class="status"><i class="status-icon status-'+obj[i].approvalStatus+'"></i>'+oStatus[obj[i].approvalStatus]+'</div>'
                + '<a id="'+obj[i].id+'" href="javascript:;" class="detail-link" onclick="detailShow('+obj[i].id+')">查看详情</a>'
                + '</div>'
                + '</li>'
        }
        $(".list").html(sHtml);
    }

    //查询审批列表
    function getList(keyWords, st1, st2){

        var startTime = st1 || $.trim($('#dateRange').val().split('~')[0]);
        var endTime = st2 || $.trim($('#dateRange').val().split('~')[1]);
        var param = {
            "page": pageNo,
            "merchantId": merchantId,
            "rows": pageSize,
            "info": keyWords||"",
            "startTime": startTime,
            "endTime": endTime
        }
        reqAjaxAsync(REQUEST_URL['getList'], JSON.stringify(param)).done(function(res){
            if(res.code == 1){
                listDataShow(res.data);
                pagingInit('#listPage', res.total, pageSize, function (page) {
                    param['page'] = page
                    reqAjaxAsync(REQUEST_URL['getList'], JSON.stringify(param)).done(function(res){
                        listDataShow(res.data);
                    });
                })
            }
        });
    }
    getList();


    //搜索
    $("#searchBtn").click(function(){
        var keyWords = $.trim($(".search-input").val());
        getList(keyWords);
    });



    //detailShow();

//});
