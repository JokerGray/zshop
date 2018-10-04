(function($) {
  var layer = layui.layer;
  var userId = 10073;
  //获取店铺
  function getshop() {

    var param={
      "userId": userId
    }
    var res=reqAjax("processSet/queryShopByBackUserId", JSON.stringify(param));

    if(res.code==1){
      var data = res.data;
      var html=`<option>请选择店铺</option>`;
      $.each(data,function (i,v) {
        html+=` <option value="${v.shopId}">${v.orgName}</option>`

      })
      $(".getshop").html(html);
    }
  }
  getshop();
  //获取流程模板
  $(".getshop").on("change",function () {
    //获取店铺id
    var shopId=$(this).val();
    $(".observe").attr("data-shop",shopId);
    var param={
      "businessType": "leave",
      "merchantId":''
    }
    var res=reqAjax("processSet/queryProcessTemplate", JSON.stringify(param));
    if(res.code==1){
      var data = res.data;
      var html=`<option value="1">请选择流程模板</option>`;
      $.each(data,function (i,v) {
        html+=` <option value="${v.id}">${v.templateName}</option>`;
      })
      $(".templation").html(html);
    }
  })
  //获取审批人
  $(".templation").on("change",function () {

    var tempId=$(this).val();
    $(".observe").attr("data-temp",tempId);

    var shopId=$(".observe").attr("data-shop")
    var tempId=$(".observe").attr("data-temp");
    var param={
      "shopId": shopId,
      "processTemplateId": tempId
    }
    var res=reqAjax("processSet/queryApprover", JSON.stringify(param), true);
    console.log(res);
    if(res.code==1){
      var data = res.data;
      var html="";
      $.each(data,function (i,v) {
        html+=`<div class="repeat">
<label data-type="${v.taksType}" data-main="${v.id}" data-name="${v.userTaskName}" data-id="${v.userTaskId}" data-variable="${v.variableName}" class="col-sm-2 control-label">${v.userTaskName}：</label>
        <div class="col-sm-10 provalprogress">
         <img src="../images/nextone.png" class="nextone" >
          <select class="checkperson">
          <option value="0">指定角色/个人</optionvalue>
          <option value="role">指定角色</option>
          <option value="user" >指定个人</option>
          </select>
          <select class="role" disabled>
          <option value="0">请先指定角色/个人</optionvalue>
          </select> 
          <select id="employeer" class="employeer"  multiple="multiple" style="display: none;">
        </select>
          </div>
          </div>`
      })
      $(".leaders").html(html);
      //判断审批人类型
      $(".repeat label").each(function (){
        var doms=$(this);
        if(doms.attr("data-name")=="调整申请"){
          doms.next().html(" <img src='../images/nextone.png' class='nextone' >审核人为申请人")
        }else if(doms.attr("data-name")=="销假"){
          doms.next().html("<img src='../images/nextone.png' class='nextone' >审核人为申请人")
        }
      });
      //删除最后一个箭头
      var imglenth=$(".repeat img").length-1;
      $(".repeat img:eq("+imglenth+")").css("display","none");
    }
  })

  //出现角色选项
  $(".leaders").on("click",".checkperson,.role",function(){
    var dom=$(this);
    if(dom.val()=="role"){
      dom.next().prop("disabled",false);
      dom.next().next().hide();
      dom.next().next().next().hide();
      var html=getrole();
      dom.next().html(html);
    }else  if(dom.val()=="user"){
      dom.next().prop("disabled",false);
      var html=getrole();
      dom.next().html(html);
      dom.next().next().show();
      dom.next().next().next().show();
    }
  })
  //获取角色
  function getrole() {
    var param={
      "userId": userId
    }
    var res=reqAjax("processSet/queryRoleByParam", JSON.stringify(param), true);
    if(res.code==1){
      var data = res.data;
      var html=" <option value='0'>请选择角色</option>";
      $.each(data,function (i,v) {
        html+=`<option name="${i}" value='${v.id}'>${v.name}</option>`
      })
    }
    return html
  }

//选择个人
  $(".leaders").on("change",".role",function(){
    var roleId = $(this).val();

    var param={
      "roleId": roleId
    }

    var res=reqAjax("processSet/queryBackUserByParam", JSON.stringify(param));
    if(res.code==1){
      var data = res.data;
      var html="";
      $.each(data,function (i,v) {
        html+=`<option value="${v.id}">${v.username}</option>`
      })
      $(this).next().html(html);
      initMultipleSelect($(this).next());
    }
  })

  //保存按钮添加点击事件
  $(".observe").click(function () {
    //店铺id
    var shopId= $(".observe").attr("data-shop");
    //流程模板id
    var  templateId=$(".observe").attr("data-temp");
    if(!shopId){
      layer.msg("请选择店铺");
      return
    }else if(!templateId){
      layer.msg("请选择流程模板");
      return
    }

    //获取taskApprover参数
    var arr=[];
    $('.leaders .repeat').each(function(){
      var dom = $(this);
      var employeerArr = dom.find('.employeer').val();
      employeerArr = !employeerArr ? '' : employeerArr.join(',');
      var identify= employeerArr;

      var roleval=dom.find('.checkperson').val();
      if(roleval=="role"){
        identify=dom.find('.role').val();
      }
      console.log(roleval);
      //判断有没有值
      if(roleval==0){
        layer.msg(dom.find('label').attr("data-name")+"：请指定角色/个人");
        return
      }else if(dom.find('.role').val()==0){
        layer.msg(dom.find('label').attr("data-name")+"：请指定角色");
        return
      }

      //给调整申请/销假赋identifyType
      if(dom.find('label').attr("data-name")=='调整申请'){
        roleval="user"
      }else if(dom.find('label').attr("data-name")=='销假'){
        roleval="user"
      }

      arr.push({
        "id": dom.find('label').attr("data-main"),
        "userTaskName": dom.find('label').attr("data-name"),
        "variableName":dom.find('label').attr("data-variable"),
        "identify": identify,
        "taskType": dom.find('label').attr("data-type"),
        "userTaskId": dom.find('label').attr("data-id"),
        "identifyType":roleval,
      })
    })
    console.log(arr);
    var param={
      "templateId": templateId,
      "taskApprover": arr,
      "shopId": shopId
    }
    var res=reqAjax("processSet/saveTaskApproverEdit", JSON.stringify(param));
    if(res.code==1){
      layer.msg(res.msg);
      $(this).css("display","none");
      $(".reset").css("display","inline-block");
    }else{
      layer.msg(res.msg);
    }
  })

  //为修改按钮绑定事件

  $(".reset").click(function () {
    //店铺id
    var shopId= $(".observe").attr("data-shop");
    //流程模板id
    var  templateId=$(".observe").attr("data-temp");

    if(!shopId){
      layer.msg("请选择店铺");
      return
    }else if(!templateId){
      layer.msg("请选择流程模板");
      return
    }

    //获取taskApprover参数
    var arr=[];
    $('.leaders .repeat').each(function(){
      var dom = $(this);
      var employeerArr = dom.find('.employeer').val();
      employeerArr = !employeerArr ? '' : employeerArr.join(',');
      var identify= employeerArr;

      var roleval=dom.find('.checkperson').val();
      if(roleval=="role"){
        identify=dom.find('.role').val();
      }
      //判断有没有值
      if(roleval==0){
        layer.msg(dom.find('label').attr("data-name")+"：请指定角色/个人");
        return
      }else if(dom.find('.role').val()==0){
        layer.msg(dom.find('label').attr("data-name")+"：请指定角色");
        return
      }

      //给调整申请/销假赋identifyType
      if(dom.find('label').attr("data-name")=='调整申请'){
        roleval="user"
      }else if(dom.find('label').attr("data-name")=='销假'){
        roleval="user"
      }

      arr.push({
        "id": dom.find('label').attr("data-main"),
        "userTaskName": dom.find('label').attr("data-name"),
        "variableName":dom.find('label').attr("data-variable"),
        "identify": identify,
        "taskType": dom.find('label').attr("data-type"),
        "userTaskId": dom.find('label').attr("data-id"),
        "identifyType":roleval,
      })
    })

    var param={
      "templateId": templateId,
      "taskApprover": arr,
      "shopId": shopId
    }
    var res=reqAjax("processSet/saveTaskApproverEdit", JSON.stringify(param));
    if(res.code==1){
      layer.msg(res.msg);
      $(this).css("display","none");
      $(".observe").css("display","inline-block");
    }
  })
})(jQuery)

function initMultipleSelect(dom){
  //select复选框
  $(dom).multipleSelect({
    // width: 200,
    // height:20,
    multiple: false,
    // multipleWidth: 100,
    filter: true,
    selectAllText: '选择全部',
    placeholder:"请选择个人",
    maxHeight:180
  });
}