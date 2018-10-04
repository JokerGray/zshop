// 可提取金额
var profitAccountFlag;
// 公式对象
var alipayInfo = {
    afterFee:0,
    alipayInfoHtml:"",
    alipayFee:0
}
$(function() {
  expenditureStatistics();
});

$(".context2 a").click(function(event) {
  var titelName = "";
  var businessTypes = event.target.id;
  if(businessTypes==1){
     titelName = "预支金额";
  }else if (businessTypes==2) {
     titelName = "补充金额";
  }else{
    return false;
  }
  var index = layer.open({
    type: 1,
    area: [
      '550px', '290px'
    ],
    fix: true, //不固定
    // maxmin: true,
    // shade: 0,
    // skin: 'layui-layer-lan',//layer内置的skin有：layui-layer-lan layui-layer-molv
    title: titelName,
    content: getInfoHtml(titelName,businessTypes),
    btn: [
      '立即关闭', '确认保存'
    ], //只是为了演示
    btn1: function() {
      layer.close(index);
    },
    btn2: function() {
      var userId= yyCache.get('userId');
      var money = $("#money").val();
      var types = $(".layui-form input[name=type]:checked").val();
      if(money&&money>0){
        //判断预支金额 最低额度
        if(money<100&&businessTypes==1){
          layer.msg(titelName+"最低100元");
          return false;
        }
        if(money>5000000&&businessTypes==1&&types==1){
          layer.msg(titelName+" , 当日到账最多500W元");
          return false;
        }

        if(businessTypes==1){
          var profitAccounts=$("#profitAccount").text();
          if(profitAccountFlag < money){
            layer.msg("最多可预支："+profitAccounts);
            return false;
          }
          if(types==1||types==2){
            if(types==2){
              // 清空对象信息
              alipayInfo.afterFee=0;
              alipayInfo.alipayInfoHtml="";
              alipayInfo.alipayFee=0;
            }
          } else {
            layer.msg('请选择到账方式');
            return false;
          }
        }else if (businessTypes==2) {
          // 清空对象信息
          alipayInfo.afterFee=0;
          alipayInfo.alipayInfoHtml="";
          alipayInfo.alipayFee=0;
        }
        var queryInfo ={
            userId:userId,
            type:types,
    				businessType:businessTypes,
            money:money,
            alipayFee:alipayInfo.afterFee,
            remarks:alipayInfo.alipayInfoHtml
    		}
    		var cmd = 'mainMenu/expenditureAccountOperation';
    		var data = JSON.stringify(queryInfo);
        $.ajax({
            type : "POST",
            url : "/zxcity_restful/ws/rest",
            dataType : "json",
            //async : false,
            data : {"cmd" : cmd,"data" : data,"version" : "1"},
            beforeSend : function(request) {
              request.setRequestHeader("apikey", "test");
            },
            success : function(res) {
               if(res.code==1){
                  expenditureStatistics();
               }else {
                 layer.msg(res.msg);
                 return false;
               }
            },
            error : function(res) {

            }
        });

      }else{
        layer.msg("金额不能为空");
        return false;
      }
    },
    // 弹窗加载成功的时候
    success: function() {
        var form = layui.form();
        // 给input  id=money 绑定鼠标离开事件
        $("#money").blur(function(){
          var moneys =$("#money").val();
          if(moneys>0){
            var alipayInfo=alipayExtractCount(moneys);
            $("#countMethodsHtml").text(alipayInfo.alipayInfoHtml);
          }
        });
        form.render();
    }
  });
});

// 获取统计数据
function expenditureStatistics() {
    var cmd = 'mainMenu/expenditureStatistics';
    $.ajax({
        type : "POST",
        url : "/zxcity_restful/ws/rest",
        dataType : "json",
        //async : false,
        data : {"cmd" : cmd,"data" : "","version" : "1"},
        beforeSend : function(request) {
          request.setRequestHeader("apikey", "test");
        },
        success : function(res) {
           profitAccountFlag=res.data.profitAccount;
           $("#profitAccount").text(fmoney(res.data.profitAccount));
           $("#sumAccountBalance").text(fmoney(res.data.sumAccountBalance));
        },
        error : function(res) {

        }
    });
}

// 支付宝提取计算方式
function alipayExtractCount(money) {
  if(money<=100000){
    //0< money <= 10w   0.2%  最低2元 ； 最多25元
    var fees = money*0.002;
    // 保留2未小数
    fees = fees.toFixed(2);
    if(fees<=2){
      // 手续费金额 最低2元
      alipayInfo.afterFee=2;
      alipayInfo.alipayInfoHtml = fmoney(money) + " - " + "2.00 = " + (fmoney(money-alipayInfo.afterFee));
    }else if (fees>=25) {
      // 手续费金额 最多 25元
      alipayInfo.afterFee=25;
      alipayInfo.alipayInfoHtml = fmoney(money) + " - " + "25.00 = " + (fmoney(money-alipayInfo.afterFee));
    }else {
      alipayInfo.afterFee=fees;
      alipayInfo.alipayInfoHtml = fmoney(money) + " - " +fees+ " = " + (fmoney(money-alipayInfo.afterFee));
    }
  }else if (money>100000) {
    // 10 < money <500W  0.025%
    alipayInfo.afterFee = money*0.00025;
    alipayInfo.alipayInfoHtml =fmoney(money)+" - ( "+ fmoney(money) + " * " + "0.025% ) = " + (fmoney(money-alipayInfo.afterFee));
  }
  // 税费
  alipayInfo.alipayFee = money - alipayInfo.afterFee;
  return alipayInfo;
}

// 给 radios 绑定监听
layui.use('form', function(){
  var form = layui.form();
  form.on('radio(radios)', function(data){
      if(data.value==1){
        var moneys =$("#money").val();
        if(moneys>0){
          var alipayInfo=alipayExtractCount(moneys);
          $("#countMethodsHtml").text(alipayInfo.alipayInfoHtml);
        }
          $("#countMethods").show();
      }else if (data.value==2) {
        $("#countMethods").hide();
      }
  });
});

// 预支操作记录详情
$("#expenditureLog").click(function(){
	var name = "预支操作记录";
	var url = "finance/mainMenu/expenditureLog.html";
	addTabs(url, name);
});



function getInfoHtml(titelName,businessTypes) {
    var html = "";
    html+='<form class="layui-form" action="" style="margin-top: 40px;">';
      html+='<div class="layui-form-item">';
        html+='<label class="layui-form-label">'+titelName+'</label>';
        html+='<div class="layui-input-block">';
          html+='<input id="money" lay-filter="money" type="text" name="money" onkeyup="clearNoNum(this)" placeholder="请输入'+titelName+'" class="layui-input" style="width: 250px;" maxlength="10" >';
        html+='</div>';
      html+='</div>';
      if(businessTypes==1){
        html+='<div class="layui-form-item">';
          html+='<label class="layui-form-label">到账方式</label>';
          html+='<div class="layui-input-block ">';
            html+='<input type="radio" name="type" value="1" title="当日" lay-filter="radios">';
            html+='<input type="radio" name="type" value="2" title="次日" lay-filter="radios">';
          html+='</div>';
        html+='</div>'; 
        html+='<div class="layui-form-item" style="display: none;" id="countMethods">';
          html+='<label class="layui-form-label">计算公式</label>';
          html+='<div class="layui-input-block">';
            html+='<p style="height: 38px;line-height: 38px;font-size: 18px;" id="countMethodsHtml">0 * 0.2% = 0.00</p>';
          html+='</div>';
        html+='</div>';
      }
    html+='</form>';
    return html;
}
