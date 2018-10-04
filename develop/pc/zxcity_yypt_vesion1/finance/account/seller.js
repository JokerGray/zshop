var oTable;
$(function () {
  oTable = new TableInit();
  oTable.Init();
  
  // 省市级联加载
  loadProvinceAndCity({'parentcode':0}, 1);
});

//加载省市数据
function loadProvinceAndCity(param, _sort){
  var res = reqAjax('operations/getProvinceList', JSON.stringify(param));
//  debugger;
  if(res.code == 1){
      
      var sHtml = '<option value="">---请选择---</option>';
      for(var i=0, len=res.data.length; i<len; i++){
          sHtml += '<option value="'+res.data[i].code+'">'+res.data[i].areaname+'</option>'
      }
      
      _sort = _sort ? _sort : 1;
      
      if(param['parentcode'] == 0){
          
          proviceArr = res.data;
          $("#selectProvince"+_sort).change(function(){
              
              var _value = $(this).val();
              if(_value == ""){
                  $("#selectCity"+_sort).prop("disabled", true).find("option:eq(0)").prop("selected", true);
              }else{
                  loadProvinceAndCity({'parentcode': _value}, 1);
              }
          }).html(sHtml);

      }else{
          $("#selectCity"+_sort).html(sHtml);
          $("#selectCity"+_sort).prop("disabled", false);
      }
  }
}

var TableInit = function () {
  var oTableInit = new Object();

  oTableInit.Init = function () {
    $('#table').bootstrapTable('destroy').bootstrapTable({
      url: '/zxcity_restful/ws/rest',
      method: 'POST',           //请求方式（*）
      striped: true,           //是否显示行间隔色
      cache: false,            //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
      search: true,      //是否显示表格搜索，此搜索是客户端搜索，不会进服务端
      strictSearch: true,
      showColumns: true,     //是否显示所有的列
      showRefresh: true,     //是否显示刷新按钮
      minimumCountColumns: 2,    //最少允许的列数
      searchOnEnterKey: true,
//      toolbar:'#toolbar',
//      searchText: '',
      pagination: true,          //是否显示分页（*）
      sortable: false,           //是否启用排序
      sortName: "createTime",     //排序的字段
      sortOrder: "desc",          //排序方式
      contentType: "application/x-www-form-urlencoded",//解决POST，后台取不到参数
      queryParams: oTableInit.queryParams,//传递参数（*）
      sidePagination: "server",      //分页方式：client客户端分页，server服务端分页（*）
      pageNumber: 1,            //初始化加载第一页，默认第一页
      pageSize: 10,            //每页的记录行数（*）
      pageList: [10], //可供选择的每页的行数（*）
      // strictSearch: true,
      // clickToSelect: true,        //是否启用点击选中行
      // height: 460,            //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
      uniqueId: "createTime",           //每一行的唯一标识，一般为主键列
      cardView: false,          //是否显示详细视图
      detailView: false,          //是否显示父子表
      showPaginationSwitch: true,
      ajaxOptions:{
          beforeSend: function(request){
                request.setRequestHeader("apikey", yyCache.get("apikey") == null ? "test" : yyCache.get("apikey"));
            }
      },
      responseHandler: function (res) {
        if (res.code == 1) {
            res.rows = res.data;
          return res;
        }
      },
      columns: [
        {
          field: 'Number', title: '序号', align: "center", width: 100,
          formatter: function (value, row, index) {
            return index + 1;
          }
        },
        {field: 'merchantId', title: '商户编码', align: "center", width: 150, sortable: true},
        {field: 'merchantType', title: '商户类型', width: 150, align: "center",
            formatter: function (res) {
                if (res == 1) {
                    return '试用商户';
                } else if (res == 0) {
                    return '正式商户';
                }
            }
        },
        {field: 'accountName', title: '用户姓名', width: 150, align: "center",
                    formatter: function(res,data){
              if(res==null){
                return res='-';
              }else{
                return '<button type="button" class="btn btn-xs btn-link" onclick="openInfoView(1,'+data.merchantId+')">'+res+'</button>';
              }
            }
          },
        {field: 'phoneNum', title: '电话号码', width: 150, align: "center",
          formatter: function (res) {
            if (res == "暂无信息") {
              return '-';
            } else {
              return res;
            }
          }
        },
        {field: 'createTime', title: '注册时间', sortable: true, width: 330, align: "center",
          formatter: function (value, row, index) {
              if (value) {
                  return getYMDHmm(value);
                } else {
                    return '-';
                }
          }
        },
        {field: 'a', title: '开发人', width: 150, align: "center",
          formatter: function(res,data){
              if(res == null){
                return '-';
              }else{
                return '<button type="button" class="btn btn-xs btn-link" onclick="openInfoView(1,'+data.merchantId+')">'+res+'</button>';
              }
            }
        },
        {field: 'b', title: '开发人联系方式', width: 150, align: "center",
//          formatter: function (res) {
//            if (res == null) {
//              return '-';
//            } else {
//              return res;
//            }
//          }
        },
        {field: 'c', title: '开发时间', width: 150, align: "center" },
        {
            field: 'd', title: '开发子公司', width: 150, align: 'center'
        },
        {
            field: 'provinceName', title: '省', width: 150, align: 'center'
        },
        {
            field: 'cityName', title: '市', width: 150, align: 'center'
        },
        {
            field: 'tradeName', title: '行业', width: 150, align: 'center'
        },
//        {
//          field: 'merchantName', title: '商户名称', width: 150, align: 'center'
//        },
        {field: 'remark', title: '备注', width: 300, align: "center",
          formatter: function (remark) {
            if (remark == "暂无信息") {
              return '-';
            } else {
              var note = '<div class="note" title="'+remark+'">' + newStrByNum(remark, 20) + '</div>'
              return note;
            }
          }
        }],
      onLoadSuccess: function () {
        //layer.msg('加载成功');
      },
      onLoadError: function () {
        // layer.msg('未检索到**信息');
      }
    });
  };
  

  //得到查询的参数
  oTableInit.queryParams = function (params) {
    var cmd = "payStatistics/selectAllMerchantInfo";
    var version = "1";
    
    var pageNo = params.offset / params.limit + 1;
    var pageSize = params.limit;

    return {
      cmd: cmd,
      data: getSearchParam(pageNo, pageSize),
      version: version
    }
  };
  return oTableInit;
};
// 拼接参数
function getSearchParam(pageNo, pageSize){
    var jsonData = {};
    var station = $('#accountnamer').val();
    var selectplate = $("#merchantType").val();
    var startTimes = $('#qBeginTime').val();
    var endTimes = $('#qEndTime').val();
    
    var selectDevCo = $('#selectDevCo').val();
    var selectTrade = $('#selectTrade').val();
    var selectProvince = $('#selectProvince1').val();
    var selectCity = $('#selectCity1').val();

    if(startTimes&&startTimes){
        startTimes += ' 00:00:00';
    }
    if(endTimes&&endTimes){
        endTimes += ' 23:59:59';
    }
    jsonData = {
            dataTable:{
                merchantType: selectplate,
                accountName: station,
                createTimeStart: startTimes,
                createTimeEnd: endTimes,
                devCo: selectDevCo,
                trade: selectTrade,
                proviceCode: selectProvince,
                cityCode: selectCity
            }
    };
    jsonData.merchantTest = 0;
    if(pageNo && pageNo){
        jsonData.dataTable.pageNo = pageNo;
        jsonData.dataTable.pageSize = pageSize;
    }
    return JSON.stringify(jsonData);
}

//查询搜索事件
$("#searchbtn").bind("click", function () {
    oTable.Init();
    accountDynamicColumn.initCookie();
});

// 导出excel
$("#excelbtn").bind("click", function downloadFile() {
  //定义要下载的excel文件路径名
  var excelFilePathName = "";
  try {
    //1. 发送下载请求 , 业务不同，向server请求的地址不同
    var excelUrl = reqAjax('payExcel/exportAllMerchantInfo', getSearchParam());
    //2.获取下载URL
    excelFilePathName = excelUrl.data;
    //3.下载 (可以定义1个名字，创建前先做删除；以下代码不动也可以用)
    if(excelUrl.code != 1){
        layer.msg(excelUrl.msg);
    } else {
        //2.获取下载URL
        excelFilePathName = excelUrl.data;
        //3.下载 (可以定义1个名字，创建前先做删除；以下代码不动也可以用)
        if ("" != excelFilePathName) {
          var aIframe = document.createElement("iframe");
          aIframe.src = excelFilePathName;
          aIframe.style.display = "none";
          document.body.appendChild(aIframe);
        }
    }
  } catch (e) {
    alert("异常：" + e);
  }
});


