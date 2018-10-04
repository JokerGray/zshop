// var userId = 10073;
var userId = getUrlParams("userId") || 10073;
var layer = layui.layer;
(function ($) {
  //获取店铺
  function getshop() {

    var param = {
      "userId": userId
    }
    reqAjaxAsync("processSet/queryShopByBackUserId", JSON.stringify(param)).done(function (res) {
      if (res.code == 1) {
        var data = res.data;
        var html = "<option value=''>请选择店铺</option>";
        $.each(data, function (i, v) {
          html += '<option value="' + v.shopId + '">' + v.orgName + '</option>'

        })
        $(".getshop").html(html);
      }
    });

  }
  getshop();
  //获取流程模板
  $(".getshop").on("change", function () {
    $(".leaders").hide();
    //获取店铺id
    var shopId = $(this).val();
    $(".observe").attr("data-shop", shopId);
    var param = {
      "businessType": "leave ",
      "merchantId": ""
    }
    reqAjaxAsync("processSet/queryProcessTemplate", JSON.stringify(param)).done(function (res) {
      if (res.code == 1) {
        var data = res.data;
        var html = '<option value="">请选择流程模板</option>';
        $.each(data, function (i, v) {
          html += '<option value="' + v.id + '">' + v.templateName + '</option>';
        })
        $(".templation").html(html);
      }
    });

  })

//获取数组
  function getArr(arr) {
    // +(isNull(data[0].id))? "":
    var a = "";
    if (!isNull(arr)) {
      $.each(arr, function (i, v) {
        a += '<a class="approvalemployeer" data-value="' + v.id + '" data-text="' + v.username + '">' + v.username + ' x</a>';
      });
    }
    return a;
  }

  //获取审批人
  $(".templation").on("change", function () {
    $(".leaders").show();

    var tempId = $(this).val();
    $(".observe").attr("data-temp", tempId);

    var shopId = $(".observe").attr("data-shop")
    var tempId = $(".observe").attr("data-temp");
    var param = {
      shopId: shopId,
      processTemplateId: tempId
    }
    reqAjaxAsync("processSet/queryApprover", JSON.stringify(param)).done(function (res) {


      if (res.code == 1) {
        var data = res.data;
        var length = data[0].id || "false";
        $(".content").attr("data-length", length);

        $(".content").attr("data-check", data.length);
        var html = "";
        $.each(data, function (i, v) {
          html += '<div class="repeat">';
          html += '<label data-identifyType="' + (v.identifyType || "") + '"  data-type="' + (v.taskType || "") + '" data-main="' + (v.id || "") + '" data-name="' + v.userTaskName + '" data-id="' + v.userTaskId + '" data-variable="' + v.variableName + '" class="col-sm-2 control-label">' + v.userTaskName + '</label>';
          html += '<div class="col-sm-10 provalprogress">';
          html += '<img src="../images/nextone.png" class="nextone" >';
          html += '<select class="checkperson" data-name="' + v.userTaskName + '">';
          html += '<option value="">指定角色/个人</option>';
          html += '<option data-role="role" value="role">指定角色</option>';
          html += '<option data-role="employeer" value="user" >指定个人</option>';
          html += '</select>';
          html += '<select data-emp class="role" disabled data-role="' + v.identify + '">';
          html += '<option value="">请先指定角色/个人</option>';
          html += '</select>';
          html += '<div class="parentselct">';
          html += '<div class="clickselct">';
          html += '<span>请选择个人</span>';
          html += '<img class="nextlist" src="../images/click.png" alt="">';
          html += '</div>';
          html += '<p class="persontitle">' + getArr(v.backUserList) + '</p>';
          html += '<ul class="employeer">';
          html += '</ul>';
          html += '</div>';
          html += '</div>';
          html += '</div>';
        });
        $(".leaders").html(html);

        //给select框赋值初始化
        //判断审批人类型
        $(".repeat label").each(function () {
          var doms = $(this);
          var identifyType = doms.attr("data-identifyType");

          //给选定角色或者个人赋值
          doms.next().find('.checkperson>option[value="' + identifyType + '"]').attr("selected", true);
          var rolechecked = doms.next().find(".role").attr("data-role");
          //给选定角色赋值
          if (identifyType == "role") {
            var html = getrole();
            doms.next().find(".role").html(html);

            rolechecked = rolechecked.substring(1);

            doms.next().find(".role").attr("disabled", false);
            doms.next().find('.role>option[value="' + rolechecked + '"]').attr("selected", true);
            doms.next().find(".parentselct").hide();

            //为后面选择个人赋值
            doms.next().find(".role").attr("data-hasRole","true");

            //给选定个人赋值
          }
          else if (identifyType == "user") {
            var html = getrole();
            doms.next().find(".role").html(html);
            doms.next().find(".role>option:first").val("请选择角色")

            doms.next().find(".role").prop("disabled", false);
            doms.next().find(".parentselct").show();
          }


          if (doms.attr("data-name") == "调整申请") {
            doms.next().html(" <img src='../images/nextone.png' class='nextone' >审核人为申请人")
          } else if (doms.attr("data-name") == "销假") {
            doms.next().html("<img src='../images/nextone.png' class='nextone' >审核人为申请人")
          }
        });
        //删除最后一个箭头
        var imglenth = $(".repeat .nextone").length - 1;
        $(".repeat .nextone:eq(" + imglenth + ")").css("display", "none");

        hiddenSel();

      } else {
        layer.msg(res.msg);
        console.log(res.msg);
      }
    });

  })

function hiddenSel() {
  //隐藏/出现emplyoeer下拉框
  $(".leaders").on("click", ".clickselct", function (e) {
    var dom = $(this);
    if (dom.parent().find(".employeer").is(":hidden")) {
      dom.parent().find(".employeer").show();
    } else {
      dom.parent().find(".employeer").hide();
    }

    $(document).one("click", function () {
      dom.parent().find(".employeer").hide();
    });

    e.stopPropagation();
  })

  $(".employeer").on("click", function (e) {
    e.stopPropagation();
  });
}


  var lenthg=$(".content").data("length");

  //出现角色选项
  $(".leaders").on("change", ".checkperson", function () {
    // var lenthg = $(".content").attr("data-length");
    //防止抖动
    var dom = $(this);
    var self=this;

    if (lenthg == "false" && dom.val() == "role") {
      dom.next().prop("disabled", false);

      var html = getrole();
      dom.next().html(html);
      dom.next().next().hide();

    } else if (lenthg == "false" && dom.val() == "user") {
      dom.next().prop("disabled", false);
      var html = getrole();
      dom.next().html(html);
      dom.next().next().show();

    } else if (lenthg != "false" && dom.val() == "user") {
      dom.next().prop("disabled", false);
      var hasRole= dom.next().attr("data-hasRole");
      var html = getrole();
      dom.next().html(html);
      dom.next().next().show();

      if(hasRole=="true"){
        var html=getrole();
        dom.next().html(html);

      }

    }
    else if (lenthg != "false" && dom.val() == "role") {
      dom.next().prop("disabled", false);
      dom.next().next().hide();

      var html = getrole();
      dom.next().html(html);
      dom.next().next().hide();

    }
  })


  function getrole() {
    var param = {
      "userId": userId
    }
    var html = " <option value=''>请选择角色</option>";
    var res = reqAjax("processSet/queryRoleByParam", JSON.stringify(param))
    if (res.code == 1) {
      var data = res.data;

      $.each(data, function (i, v) {
        html += '<option name="' + i + '" value="' + v.id + '">' + v.name + '</option>'
      })
    }
    return html

  }

//出现员工选项
  function getRole(d) {
    var _this = d.dom;
    var roleid=_this.val();
    if(isNull(roleid)){
      return layer.msg("请选择角色");
    }
    reqAjaxAsync(d.url, JSON.stringify({"roleId": roleid})).done(function (res) {
      if (res.code == 1) {
        var data = res.data;
        var html = "";
        $.each(data, function (i, v) {
          html += '<li>' +
            '<input type="checkbox" class="usernameInp">' +
            '<a data-text="' + v.username + '" value="' + v.id + '">' + v.username + '</a>' +
            '</li>'
        })
        _this.next().find(".employeer").html(html);

        //点击复选框，出现员工
        _this.next().find(".usernameInp").click(function () {
          getEmployerr({
            dom: $(this)
          })
        });


        //初始化复选框勾选
        var arrVlue = _this.next().find(".persontitle a");

        var employeerValue = _this.siblings('.parentselct').find('.employeer li');

        arrVlue.each(function () {
          var $this = $(this);
          employeerValue.each(function () {

            $(this).find('a[value=' + $this.attr('data-value') + ']').siblings('input').attr('checked', true);
          })
        })

      } else {
        layer.msg(res.msg);
      }
    });
  }

  function getEmployerr(d) {
    var _this = d.dom;
    _this.parent().toggleClass("act");
    var ahtml = _this.siblings("a").data("text");
    var value = _this.siblings("a").attr("value");
    var checked = _this.attr("checked");
    if (checked == "checked") {
      _this.attr("checked", false).parents('.parentselct').find(".persontitle a[data-text=" + ahtml + "]").remove();
    } else {
      _this.attr("checked", "checked");
      var label = _this.parents('.parentselct').find(".persontitle");
      label.append('<a class="approvalemployeer" data-value="' + value + '" data-text="' + ahtml + '">' + ahtml + ' x</a>');

    }
  }

  //删除并取消勾选
  $('.leaders').on('click', '.approvalemployeer', function () {
    var dom = $(this);
    var ahtml = dom.attr("data-value");
    dom.parent().siblings('.employeer').find('li').each(function () {
      $(this).find("a[value=" + ahtml + "]").siblings("input").attr("checked", false);
      $(this).find("a[value=" + ahtml + "]").parent().removeClass("act");
    })
    dom.remove();
  })


//选择个人
  $(".leaders").on("change", ".role", function () {
    getRole({
      dom: $(this),
      url: "processSet/queryBackUserByParam"
    });
  })

  var tips = {
    getshop: '请选择店铺！',
    templation: '请选择流程模板！',
    checkperson: '请指定角色/个人',
    role: '请选择角色'
  }

  //判断必填项
  function showTips(dom) {
    for (var key in tips) {
      if ($(dom).hasClass(key)) return layer.msg(tips[key], {icon: 2});
    }
  }

  function submitArr() {
    //店铺id
    var shopId = $(".observe").attr("data-shop");
    //流程模板id
    var templateId = $(".observe").attr("data-temp");

    var selectVal = "user";

    for (var i = 0; i < $('select').length; i++) {
        if (!$('select').eq(i).val()) {return showTips($('select').eq(i));}

    }

    //获取taskApprover参数
    var taskApprover = [];

    $('.leaders .repeat').each(function () {
      var dom = $(this);
      var arr2 = [];
      dom.find(".persontitle a").each(function () {
        arr2.push($(this).data("value"));
      })
      arr2 = arr2.join(",");

      var identify = arr2;
      var roleval = dom.find('.checkperson').val() || "user";
      if (roleval == "role") {
        identify = dom.find('.role').val();
      }
      //判断是否有id
      var addid = dom.find('label').attr("data-main") || "";
      taskApprover.push({
        "id": addid,
        "userTaskName": dom.find('label').attr("data-name"),
        "variableName": dom.find('label').attr("data-variable"),
        "identify": identify,
        "taskType": dom.find('label').attr("data-type"),

        "userTaskId": dom.find('label').attr("data-id"),
        "identifyType": roleval,
      })
    })

    console.log(taskApprover);
    var datalenth = $(".content").attr("data-check")
    if (taskApprover.length < datalenth || isNull(taskApprover)) {
      layer.msg("审批人为必填项")
      return false
    }

    saveFn({
      templateId: templateId,
      shopId: shopId,
      taskApprover: taskApprover
    });

  }

  //保存按钮添加点击事件
  $(".observe").click(function () {
    // shadeEffect();
    submitArr();
  });

  function saveFn(d) {
    var param = JSON.stringify({
      "templateId": d.templateId,
      "taskApprover": d.taskApprover,
      "shopId": d.shopId
    });
    reqAjaxAsync("processSet/saveTaskApproverEdit", param).done(function (res) {

      if (res.code == 1) {
        layer.msg(res.msg);

        var data=res.data;
        var arr3=[];
        $.each(data,function (i,d) {
          arr3.push(d.id)
        })

        $.each(arr3,function(q,r){
          $(".leaders label").eq(q).attr("data-main",r);
        });

      }
    });
  }

  //判断是否为空
  function isNull(val) {
    if (val == null || val == undefined || val == "") {
      return true;
    }
    return false;
  }

})(jQuery)

//获取角色
function gettRole() {
  var loadingIndex = layer.msg('加载中……', {icon: 16})
  var def = reqAjaxAsync('processSet/queryRoleByParam', JSON.stringify({userId: 10073}));
  def.done(function (res) {
    if (res.code == 1) {
      layer.close(loadingIndex);

      return setData(res.data)
    }
    layer.msg(res.msg, {icon: 2});
  })
  def.fail(function (err) {
    layer.msg('系统错误或网络异常！');
  });
}

function gettingRole() {
  var loadingIndex = layer.msg('加载中……', {icon: 16})
  var def = reqAjaxAsync('processSet/queryRoleByParam', JSON.stringify({userId: userId}));
  //
  var html = "";
  def.done(function (res) {
    if (res.code == 1) {
      layer.close(loadingIndex);
      var data = res.data;

      $.each(data, function (i, v) {
        html += '<option  value="' + v.id + '">' + v.name + '</option>'
        // console.log(html);
      });
      console.log(html);
      return html
    }
  })
}

// 设置数组数据
function setData(arr) {
var html=""
  $.each(arr, function (i, v) {
    html += '<option name="' + i + '" value="' + v.id + '">' + v.name + '</option>'
  })
  console.log(html)
  return html
}