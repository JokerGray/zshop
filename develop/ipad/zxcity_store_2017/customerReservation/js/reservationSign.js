
var customerObj = null,  //用于存放顾客列表
    roomObj = null, //用于存放房间列表
    technicianObj = null;//用于存放服务人员列表
var employeeId = sessionStorage.getItem('backUserId');
var shopId = sessionStorage.getItem('shopId'),merchantId = sessionStorage.getItem("merchantId");
var pageNo = 1,pageSize = 100;

//日期选择
$("#selDate").jeDate({
    isinitVal:true,
    skinCell:"mystyle",
    format:"YYYY-MM-DD",
    isClear:true,
    isok:false,
    zIndex:3000,
    choosefun:function (elem, _date) {}
});

//渲染客户下拉框
function showCustomerSelector(data){
    var sHtml = '';
    sHtml += '<li data-id="-1"><a href="javascript:;">选择客户</a></li>'
    for(var i=0; i<data.length; i++){
        sHtml += '<li data-id="'+data[i].id+'"><a href="javascript:;">'+data[i].accountName+'</a></li>'
    }
    $("#customerSelector").html(sHtml);
}

// 客户列表
function loadCustomerList(){
    ////预约ID, [{0,"取消预约"},{1,"客户签到"}]
    var jsonData = "{'merchantId': "+merchantId+",'shopId':"+shopId+",'pageNo': "+pageNo+", 'pageSize':100}";
    var res = reqAjax("shopDisplayTerminal/queryShopAccountList", jsonData);
    if(res.code == 1){
        customerObj = res.data;
        showCustomerSelector(res.data);
    }else{
        layer.alert(res.msg);
    }
}
$("#selCustomer").click(function(){
    if(customerObj == null){
        loadCustomerList();
    }else{
        showCustomerSelector(customerObj);
    }
});

//渲染服务人员下拉框
function showTechSelector(data){
    var sHtml = '';
    sHtml += '<li data-id="-1"><a href="javascript:;">选择服务人员</a></li>'
    for(var i=0; i<data.length; i++){
        sHtml += '<li data-id="'+data[i].id+'"><a href="javascript:;">'+data[i].username+'</a></li>'
    }
    $("#techSelector").html(sHtml);
}

//服务人员列表初始化
function loadTechnicianList(){
    var jsonData = "{'shopId': "+shopId+"}";
    var res = reqAjax("shop/waitersPersonInShop", jsonData);
    if(res.code == 1){
        technicianObj = res.data;
        showTechSelector(res.data);
    }else{
        layer.alert(res.msg);
    }
}
$("#selTechnician").click(function(){
    if(technicianObj == null){
        loadTechnicianList();
    }else{
        showTechSelector(technicianObj);
    }
});

$("#techSelector").delegate("li", "click", function(){
    $("#selTechnician span").attr("data-id", $(this).attr("data-id")).text($(this).find("a").text());
});

$("#customerSelector").delegate("li", "click", function(){
    $("#selCustomer span").attr("data-id", $(this).attr("data-id")).text($(this).find("a").text());
});

//客户预约初始化
function loadReservationList(){
    var bookDate = $("#selDate").val();
    var searchCustomerId = $("#selCustomer span").attr("data-id"),
        searchTechnicianId = $("#selTechnician span").attr("data-id");
    //var pageNo = 1, pageSize = 100;
    var jsonData = "{'shopId': " + shopId + ", 'bookDate': '" + bookDate +"'";
    if(searchCustomerId && searchCustomerId != -1){
        jsonData += ", 'customerId':" + searchCustomerId
    }
    if(searchTechnicianId && searchTechnicianId != -1){
        jsonData += ", 'waiterId':" + searchTechnicianId;
    }

    jsonData += ", 'pageNo': " + pageNo + ", 'pageSize': " + pageSize + "}";

    var res = reqAjax("shop/shopBookingList", jsonData);
    var sHtml = '';
    if(res.code == 1){
        var obj = res.data;
        for(var i=0; i<obj.length; i++){
            var status = "";
            if(obj[i].status == -1) {
                status = "已取消";
            } else if (obj[i].status == 0) {
                status = "预约中";
            } else if (obj[i].status == 1) {
                status = "已签到";
            } else if (obj[i].status == 2){
                status = "待确认";
            }
            sHtml += '<li class="list-item">'
                + '<div class="item-inner">'
            if(obj[i].status == 0){
                sHtml += '<div class="title todo">'+obj[i].bookDate+'</div>'
            }else{
                sHtml += '<div class="title"><b class="status">'+status+'</b>'+obj[i].bookDate+'</div>'
            }

            sHtml += '<div class="detail"><dl>'
                + '<dd><lable class="item-label">预约客户：</lable><span class="item-desc">'+obj[i].customerName+'</span></dd>'
                + '<dd><lable class="item-label">客户电话：</lable><span class="item-desc">'+obj[i].mobile+'</span></dd>'
                + '<dd><lable class="item-label">预约项目：</lable><span class="item-desc">'+obj[i].serviceName+'</span></dd>'
                + '<dd><lable class="item-label">预约时间：</lable><span class="item-desc">'+obj[i].bookTime+'</span></dd>'
                + '<dd><lable class="item-label">预约服务人员：</lable><span class="item-desc">'+obj[i].waiterName+'</span></dd>'
                + '<dd><lable class="item-label">预约房间：</lable><span class="item-desc">'+(obj[i].roomName?obj[i].roomName:"")+'</span></dd>'
                + '<dd><lable class="item-label">预约情况：</lable><span class="item-desc">'+status+'</span></dd>'
                + '<dd><lable class="item-label">预约备注：</lable><span class="item-desc">'+obj[i].summary+'</span></dd>'
                + '</dl></div>'

            if(obj[i].status == 2){
                sHtml += '<div class="handle-btn"><button data-id="'+obj[i].id+'" class="btn ok-btn">预约确认</button><button data-id="'+obj[i].id+'" class="btn cancel-btn">取消预约</button></div>';
            }else if(obj[i].status == 0){
                sHtml += '<div class="handle-btn"><button data-id="'+obj[i].id+'" class="btn complete-btn">签到完成</button><button data-id="'+obj[i].id+'" class="btn cancel-btn">取消预约</button></div>';
            }
            sHtml  += '</div></li>'
        }
    }else{
        layer.msg(res.msg);
    }
    $("#signInList").html(sHtml);
}

//查询
$("#searchBtn").click(function(){
    loadReservationList()
});

$("#signInList").delegate(".ok-btn", "click", function(){
    //确认预约
    bookingStatusChange($(this).attr('data-id'), 2);
}).delegate(".complete-btn", "click", function(){
    //签到完成
    bookingStatusChange($(this).attr('data-id'), 1);
}).delegate(".cancel-btn", "click", function(){
    //取消预约
    bookingStatusChange($(this).attr('data-id'),0);
});

//客户预约签到、取消
function bookingStatusChange(id, status){
    ////预约ID, [{0,"取消预约"},{1,"客户签到"}]
    var jsonData = "{'id': "+id+", 'change': "+status+"}"
    var res = reqAjax("shop/bookingStatusChange", jsonData);
    if(res.code == 1){
        if(status == 0){
            layer.msg("预约取消成功！");
        }else if(status == 1){
            layer.msg("预约签到成功！");
        }else if(status == 2){
            layer.msg("预约确认成功！");
        }
    }else{
        layer.msg(res.msg);
    }
    //操作结束后，刷新数据列表
    loadReservationList();
}

$(function(){
    $(document).foundation();
    loadReservationList();
});
