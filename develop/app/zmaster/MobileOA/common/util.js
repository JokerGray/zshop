//判断是否为空
function isNull(val) {
  if (!val || val == "null") {
    return '无';
  }
  return val;
}

//获取参数
function getUrlParams(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) {
    r[2] = r[2].replace(new RegExp("%", 'g'), "%25");
    return decodeURI(decodeURIComponent(r[2]));
  }
  return "";
}

//同步ajax
function reqAjax(cmd, data) {
  var apikey = getUrlParams('apikey') || 'test';
  var version = getUrlParams('version') || '1';
  var reData;
  $.ajax({
    type: "POST",
    url: "/zxcity_restful/ws/rest",
    dataType: "json",
    async: false,
    data: {
      "cmd": cmd,
      "data": data,
      "version": version
    },
    beforeSend: function (request) {
      // layer.load(0, {time: 10 * 1000});
      request.setRequestHeader("apikey", apikey);
    },
    success: function (re) {
      // layer.closeAll('loading');
      reData = re;
    },
    error: function (re) {
      // layer.closeAll('loading');
      var str1 = JSON.stringify(re);
      re.code = 9;
      re.msg = str1;
      reData = re;
    }
  });
  return reData;
}

//异步ajax
function reqAjaxAsync(cmd, data) {
  var apikey = getUrlParams('apikey') || 'test';
  var version = getUrlParams('version') || '1';
  var defer = $.Deferred();
  $.ajax({
    type: "POST",
    url: "/zxcity_restful/ws/rest",
    dataType: "JSON",
    data: {
      "cmd": cmd,
      "data": data || "",
      "version": version
    },
    beforeSend: function (request) {
      // layer.open({type: 2});
      request.setRequestHeader("apikey", apikey);
    },
    success: function (data) {
      // layer.closeAll();
      /*defer.resolve(JSON.parse(html2Escape(JSON.stringify(data))));*/
      defer.resolve(data);
    },
    error: function (err) {
      // layer.closeAll('loading');
      layerMsg("系统繁忙，请稍后再试!");
      console.log(err.status + ":" + err.statusText);
    }
  });
  return defer.promise();
}

//弹框提示
function layerMsg(a) {
  //提示
  layer.open({
    content: a
    , skin: 'msg'
    , time: 2 //2秒后自动关闭
  });
}


//审批接口
var RESULT_URL = {
  SUBMITPROVAL: "leave/submitLeave",//发起审批
  TOPROVAL: 'leave/selectTodoTaskPage',//分页查询待审批
  PROVALDONE: 'leave/selectDealWithPage',//分页查询已办理请假任务
  NEXTPROVAL: "leave/forward",//下一个审批人
  ORGNATION: "processSet/initOrgByUserId",//查询组织机构
  QUERYUSERLISTBYORGID: 'processSet/queryUserListByOrgId',//根据节点id分页条件查询用户
  HASPROVALED: "leave/selectScLeavePage",//我提交的请假单
  REJECT: "leave/approve",//(/同意/拒绝/撤销) 请假单申请
  FILING: "leave/transferArchive",//提交归档
  DETAILS: "leave/detailScLeave",//请假单详情
  RECORDING: "leave/queryScLeaveProcessList",//查看请假单审批记录
  ROLE: "leave/selectUserTypeById",//查看角色
  GETTREE: "processSet/findOrgTreeAndStaffByUserId",//查询审批人
  DefaultNext:"userDaily/queryApproverDefaultNext"//默认审批人
}



//等级匹配
function levelType(d) {
  var a = "<span></span>"
  if (d == 1) {
    a = '<span class="level-' + d + ' level-item"  >普通</span>'
  } else if (d == 2) {
    a = '<span class="level-' + d + ' level-item" >紧急</span>'
  } else if (d == 3) {
    a = '<span class="level-' + d + ' level-item" >非常紧急</span>'
  }
  return a
}



//contains不区分大小写
jQuery.expr[':'].contains = function (a, i, m) {
  return jQuery(a).text().toUpperCase()
    .indexOf(m[3].toUpperCase()) >= 0;
};

//关闭弹框
$(".rejectBox .deleteBtn ").click(function () {
$(".rejectBox").hide();
})