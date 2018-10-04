var oTable;

$(function () {
  oTable = new TableInit();
  oTable.Init();

  //layer配置
  layer.config({
	  extend: 'myskin/style.css', //加载您的扩展样式
	  skin: 'layer-ext-myskin'
  });
});

var TableInit = function () {
  var oTableInit = new Object();
  oTableInit.Init = function () {
    $('#table').bootstrapTable('destroy').bootstrapTable({
      url: '/zxcity_restful/ws/rest',
      method: 'POST',           //请求方式（*）
      striped: true,           //是否显示行间隔色
      cache: false,            //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
      search: true,            //是否显示表格搜索，此搜索是客户端搜索，不会进服务端
      strictSearch: true,
      showColumns: true,     //是否显示所有的列
      showRefresh: true,     //是否显示刷新按钮
      minimumCountColumns: 2,    //最少允许的列数
      search: true,
      searchOnEnterKey: true,
      searchText: '',
      pagination: true,          //是否显示分页（*）
      sortable: false,           //是否启用排序
      sortName : "payTime",     //排序的字段
      sortOrder: "desc",          //排序方式
      contentType: "application/x-www-form-urlencoded",//解决POST，后台取不到参数
      queryParams: oTableInit.queryParams,//传递参数（*）
      sidePagination: "server",      //分页方式：client客户端分页，server服务端分页（*）
      pageNumber:1,            //初始化加载第一页，默认第一页
      pageSize: 10,            //每页的记录行数（*）
      pageList: [10], //可供选择的每页的行数（*）
      // strictSearch: true,
      // clickToSelect: true,        //是否启用点击选中行
      // height: 460,            //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
      // uniqueId: "Number",           //每一行的唯一标识，一般为主键列
      cardView: false,          //是否显示详细视图
      detailView: false,          //是否显示父子表
      // singleSelect : true,        //是否只能选中一个
      sortOrder: "desc",
      showPaginationSwitch: true,
      ajaxOptions:{
    	  beforeSend: function(request){
				request.setRequestHeader("apikey", sessionStorage.getItem('apikey') == null ? "test" : sessionStorage.getItem('apikey'));
				}
      },
      responseHandler: function (res) {
        if (res.code == 1) {
        	res.total = res.total;
	        //$('#sum').text(res.data.sum == null ? "0.00" : parseFloat(res.data.sum).toFixed(2));
	        //totalAmount = res.money == null ? "0.00" : parseFloat(res.data.sum).toFixed(2);
	        res.rows = res.data
	        return res;
        }else{
           layer.msg(res.msg);
          return false;
        }
      },
      columns: [
        {
          field: 'Number', title: '序号', align: "center", width: 100,
          formatter: function (value, row, index) {
            return index + 1;
          }
        },
        {field: 'serialNo', title: '流水号', align: "center", width: 150, sortable: true},
        { field: 'businessType', title:'业务类型', width: 150, align : "center",
          formatter: function (res) {
               if(res==1){
                  return '直播佣金';
               }else if (res==2) {
                  return '商户升级';
               }else if (res==3) {
                  return '广告头条';
               }else{
                  return '未定义';
               }
          }
        },
        {field: 'taxpayerName', title: '纳税人名称', sortable: true, width: 200, align: "center"},
        {field: 'identificationNumber', title: '身份证号', sortable: true, width: 200, align: "center"},
        {field: 'phone', title: '手机号', sortable: true, width: 200, align: "center"},
        {field: 'laborCosts', title: '劳务费', sortable: true, width: 200, align: "center",
          formatter: function (res) {
             return '<p style="color:#5fb878;">'+fmoney(res, 2)+'</p>';
          }
        },
        {field: 'laborCostsMonthlyTotal', title: '劳务费月总计', sortable: true, width: 200, align: "center",
          formatter: function (res) {
             return fmoney(res, 2);
          }
        },  
        {field: 'laborTax', title: '劳务税', sortable: true, width: 200, align: "center",
          formatter: function (res) {
             return fmoney(res, 2);
          }
        },
        {field: 'laborTaxMonthlyTotal', title: '劳务税月总计', sortable: true, width: 200, align: "center",
          formatter: function (res) {
             return fmoney(res, 2);
          }
        },
        {field: 'afterTaxAmount', title: '税后金额', sortable: true, width: 200, align: "center",
          formatter: function (res) {
             return '<p style="color:red;">'+fmoney(res, 2)+'</p>';
          }
        },
        {field: 'playingTime', title: '打款时间', width: 300, align: "center"},
        {field: 'extractionState', title: '提取状态', width: 80, align: "center",
          formatter: function (res) {
             if(res==1){
               return '<p style="color:red;">未提取</p>';
             }else if (res==2) {
               return '<p style="color:#5fb878;">已提取</p>';
             }
          }
        }
			],
      onLoadSuccess: function () {
        //layer.msg('加载成功');
      },
      onLoadError: function () {
         layer.msg('系统繁忙');
      }
    });
  };

  //得到查询的参数
  oTableInit.queryParams = function (params) {
    var cmd = "scLaborTaxList/selectList";
    var jsonData = "";
    var pageNo = params.offset / params.limit + 1;
    var pageSize = params.limit;
    var version = "1";
    var startTimes = $('#qBeginTime').val();
    var endTimes = $('#qEndTime').val();
    var serialNo= $('#serialNos').val();
    var taxpayerName= $('#taxpayerNames').val();
    var businessType = $("#selectview2").val();
    var data = {
			pageNo : pageNo,
			pageSize : pageSize,
			startTime : startTimes,
			endTime : endTimes,
      serialNo:serialNo,
      taxpayerName:taxpayerName,
      businessType:businessType
    };
    return {
      cmd: cmd,
      data: JSON.stringify(data),
      version: version
    }
  };
  return oTableInit;
};

//提取事件
$("#extractId").bind("click", function () {
  var startTimes = $('#qBeginTime').val();
  var endTimes = $('#qEndTime').val();
  if(startTimes==""){
      layer.msg('开始日期不能为空,请选择日期');
      return false;
  }
  if(endTimes==""){
    layer.msg('结束日期不能为空,请选择日期');
    return false;
  }

	var laborFeeExtractionInfo = {
		  startTime:startTimes,
			endTime:endTimes
	}
  var indexs = layer.load(0,{shade: [0.7, '#393D49']}, {shadeClose: true}); //0代表加载的风格，支持0-2
  //根据 开始时间  和 结束时间 查询
	var cmd = 'scLaborTaxList/selectListCount';
	var data = JSON.stringify(laborFeeExtractionInfo);
	var reData = reqAjax(cmd,data);
  var taxpayerPersonCount = 0;
  var laborCostsCount = 0;
  var idCount = 0;
  var laborTaxCount = 0;

	if(reData.code==1){
		if(reData.total>0){
			taxpayerPersonCount=reData.data.taxpayerPersonCount;//劳务纳税人总计
			laborCostsCount=reData.data.laborCostsCount;//劳务费总计
			idCount=reData.data.idCount;//劳务款项总计
			laborTaxCount=reData.data.laborTaxCount;//提取金额
      layer.close(indexs);
		}else{
       layer.msg('未找到匹配数据');
       layer.close(indexs);
		}
	}else{
     layer.msg('数据加载异常......');
     layer.close(indexs);
	}

var index =layer.open({
      type: 1,
      area: ['900px', '450px'],
      fix: false, //不固定
      maxmin: false,
      btn : [ '取消','确认提交'],
      title : "劳务税提取",
      content: showLayerOpenInfo(startTimes,endTimes,taxpayerPersonCount,fmoney(laborCostsCount, 2),idCount,fmoney(laborTaxCount, 2)),
      // 弹窗加载成功的时候
      success : function() {
          // 修改按钮样式
          $(".layui-layer-btn .layui-layer-btn0").css({"width":"120px","height":"35px","text-align":"center","line-height":"35px"});
          $(".layui-layer-btn .layui-layer-btn1").css({"width":"120px","height":"35px","text-align":"center","line-height":"35px"});
          if(reData.code!=1){
            layer.msg('数据加载异常......');
          }else if(reData.code==1&&reData.total==0){
            layer.msg('未找到匹配数据');
          }
      },
      btn1 : function(index) {
          layer.close(index);
      },
      btn2 : function(index) {
        var extractPersonName =$("input[name='extractPersonName']").val();
      	if(!extractPersonName){
      		layer.msg('提取人名称不能为空');
      		return false;
      	}

        if(reData.code==1&&reData.total>0){
            var indexs = layer.load(0,{shade: [0.7, '#393D49']}, {shadeClose: true}); //0代表加载的风格，支持0-2
            var buttonInfo = {
              startTime:startTimes,
              endTime:endTimes,
              taxpayerPersonCount:taxpayerPersonCount,//劳务纳税人总计
              laborCostsCount:laborCostsCount,//劳务费总计
              idCountId:idCount,//劳务款项总计
              laborTaxCount:laborTaxCount,//提取金额
              extractPersonName:extractPersonName
            }
              var cmd = 'scLaborTaxList/updateLaborCostsExtraction';
            	var data = JSON.stringify(buttonInfo);

               $.ajax({
             		type : "POST",
             		url : "/zxcity_restful/ws/rest",
             		dataType : "json",
             	  //async : false,
             		data : {"cmd" : cmd,"data" : data,"version" : version},
             		beforeSend : function(request) {
             			request.setRequestHeader("apikey", apikey);
             		},
             		success : function(re) {
                   if(re.code==1){
                       oTable.Init();
                       layer.close(indexs);
                       layer.msg(re.msg);
                   }else{
                      layer.msg(re.msg);
                      return false;
                   }
             		},
             		error : function(re) {
                     layer.close(indexs);
                     layer.msg('提取失败');
                     return false;
             		}
             	});

        }else{
          layer.msg('暂无-劳务税提取');
      		return false;
        }

      }
   });
});

//查询搜索事件
$("#searchbtn").bind("click", function () {
	oTable.Init();
	accountDynamicColumn.initCookie();
});

// 导出excel
$("#excelbtn").bind("click", function downloadFile() {
  //定义要下载的excel文件路径名
  var excelFilePathName = "";
  // var params="{'dataTable':{'merchantType':'0'}}";
  try {
    //1. 发送下载请求 , 业务不同，向server请求的地址不同
     var jsonData = "";
     var version = "1";
     var startTimes = $('#qBeginTime').val();
     var endTimes = $('#qEndTime').val();
     var serialNo= $('#serialNos').val();
     var taxpayerName= $('#taxpayerNames').val();
     var businessType = $("#selectview2").val();
     var data = {
       startTime : startTimes,
       endTime : endTimes,
       serialNo:serialNo,
       taxpayerName:taxpayerName,
       businessType:businessType
    };
    jsonData = JSON.stringify(data);
    var excelUrl = reqAjax('scLaborTaxList/exportScLaborTaxList', jsonData);
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

//拼接信息
function showLayerOpenInfo(startTimes,endTimes,taxpayerPersonCount,laborCostsCount,idCount,laborTaxCount){
    var infoHtml = "";
      infoHtml += '<div class="container-fluid">';
      infoHtml += '<form class="form-horizontal" style="padding-bottom: 15px;font-size: 15px;">';
      infoHtml += '<div class="row-fluid" style="border-bottom: 2px solid #ddd;margin-bottom: 15px;">';
      infoHtml += '<h1 class="text-center dialog-title">劳务税提取</h1>';
      infoHtml += '</div>';
      infoHtml += '<div class="row" style="height: 210px;">';
      <!-- 数据加载 -->
      infoHtml += '<p id="dataLoadingId" style="text-align: center;line-height: 210px;font-size: 25px;display: none;">正在努力地加载数据中，请稍候……</p>';
      infoHtml += '<div id="infoId">';
      <!-- 数据内容  -->
      infoHtml += '<div class="form-group">';
      infoHtml += '<label class="col-md-2 col-sm-2 control-label"><b class="required-icon"></b>提取时间范围：</label>';
      infoHtml += '<div class="col-md-7 col-sm-7" style="padding-top: 10px;">';
      infoHtml += '<span id="startTimeId">'+startTimes+'</span><span>&nbsp ——— &nbsp</span><span id="endTimeId">'+endTimes+'</span>';
      infoHtml += '</div>';
      infoHtml += '</div>';
      infoHtml += '<div class="pull-left w-half">';
      infoHtml += '<div class="form-group">';
      infoHtml += '<label class="col-md-4 col-sm-4 control-label"><b class="required-icon"></b>纳税人总计：</label>';
      infoHtml += '<div class="col-md-7 col-sm-7  div-border-bottom">';
      infoHtml += '<span id="taxpayerPersonCountId">'+taxpayerPersonCount+'</span>';
      infoHtml += '</div>';
      infoHtml += '</div>';
      infoHtml += '<div class="form-group">';
      infoHtml += '<label class="col-md-4 col-sm-4 control-label"><b class="required-icon"></b>劳务费总计：</label>';
      infoHtml += '<div class="col-md-7 col-sm-7 div-border-bottom">';
      infoHtml += '<span id="laborCostsCountId" style="color:red;">'+laborCostsCount+'</span>';
      infoHtml += '</div>';
      infoHtml += '</div>';
      infoHtml += '<div class="form-group">';
      infoHtml += '<label class="col-md-4 col-sm-4 control-label"><b class="required-icon"></b>提取人：</label>';
      infoHtml += '<div class="col-md-7 col-sm-7" style="padding-right: 0px;padding-left: 0px;padding-top: 3px;">';
      infoHtml += '<input class="form-control" id="extractPersonNameId" type="text" name="extractPersonName" placeholder="必填....输入名称"  maxlength="6">';
      infoHtml += '</div>';
      infoHtml += '</div>';
      infoHtml += '</div>';
      infoHtml += '<div class="pull-right w-half">';
      infoHtml += '<div class="form-group">';
      infoHtml += '<label class="col-md-4 col-sm-4 control-label"><b class="required-icon"></b>劳务款项总计：</label>';
      infoHtml += '<div class="col-md-7 col-sm-7 div-border-bottom">';
      infoHtml += '<span id="idCountId">'+idCount+'</span>';
      infoHtml += '</div>';
      infoHtml += '</div>';
      infoHtml += '<div class="form-group">';
      infoHtml += '<label class="col-md-4 col-sm-4 control-label"><b class="required-icon"></b>劳务税总计：</label>';
      infoHtml += '<div class="col-md-7 col-sm-7 div-border-bottom">';
      infoHtml += '<span id="laborTaxCountId">'+laborTaxCount+'</span>';
      infoHtml += '</div>';
      infoHtml += '</div>';
      infoHtml += '</div>';
      infoHtml += '</div>';
      infoHtml += '</div>';
      infoHtml += '</form>';
      infoHtml += '</div>';
    return infoHtml;
}
