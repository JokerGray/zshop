(function($) {
  var page = 1;
  var rows = 10;
  var userno = yyCache.get("userno") || "";

  //接口参数
  var USER_URL = {
    ALLLIST : 'operations/organizationList',//(查询所有部门)
    ADDRESOURCE : 'operations/addUser',//(新增)
    UPDATERESOUCE : 'operations/updateUser', //(修改)
    DELUSER : 'operations/delUser', //(删除)
    RESETPWD : 'operations/resetUserPwd',//(重置密码)
    TREELIST : 'operations/organizationNodes', //(树)
    ROLELIST : 'operations/roleList', //(角色)
    BYORGID :'operations/getUsersByOrgId' //(按部门查用户接口)
  };

  var layer = layui.layer;
  var table = layui.table;

  //刷新
  $("#refrshbtn").click(function(){
    location.reload();
  });

  //搜索按钮点击弹出搜索条件
  $(".searchbutton").click(function(){
    $(".searchform").css("display","block")
  });
  //收缩搜索框
  $(".inputhidden").click(function () {
    $(".searchform").hide();
  })

  //重置
  $('#resetbtn').on('click',function(){
    $("#username").val('');
    $("#fixdepartment").val('');
    $("#phone").val('');
  });
  //序号遍历
  function getData(url,parms){
    var res =reqAjax(url,parms);
    var data = res.data;
    $.each(data,function(i,item){
      $(item).attr('eq',(i+1))
    })
    return data;
  }

  //渲染表单
  function getTable(organizationId,username,phone){
    var param ={
      page:page,
      rows:rows,
      organizationId:organizationId,
      username:username,
      phone:phone
    }
    var table = layui.table;
    table.render({
      id:'table'
      ,elem: '#table' //指定原始表格元素选择器（推荐id选择器）
      ,height: 900 //容器高度
      ,cols: [[

        {checkbox:true}
        ,{title:'序号',sort:true,align:'left',field:'eq',width:80}
        ,{title:'群名称',sort:true,align:'left',field:'uname',width:150}
        ,{title:'群头像',sort:true,align:'left',field:'sex',width:100}
        ,{title:'群号',sort:true,align:'left',field:'phone',width:200}
        ,{title:'群成员人数',sort:true,align:'left',field:'status_name',width:150}

        ,{title:'创建时间',sort:true,align:'left',field:'update_time',width:200}
        ,{title:'操作',align:'center', toolbar: '#barDemo',width:430}
      ]]

      ,loading: true
      ,data:getData(USER_URL.BYORGID,JSON.stringify(param))
      ,page:true
      ,even: true
      ,skin: 'row'
      ,limits: [15,20,30]
      ,limit: 15 //默认采用60
    });
  }

  getTable();
  //选中表单事件
  $('#app').on('click','tr',function(){
    $(this).addClass('layui-table-click').siblings().removeClass('layui-table-click');
  });

//监听工具条,右侧表格
  table.on('tool(table)', function(obj){
    var data = obj.data;
    //修改
    if(obj.event === 'change'){
      layer.open({
        title: ['修改', 'font-size:12px;background-color:#0678CE;color:#fff'],
        type: 1,
        btn: ['保存', '取消'],
        content:$('#demo111'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
        area: ['800px', '590px'],
        end:function(){
          $('#demo111').hide();
          $('#role').val('');
          $('#loginName').val('');
          $('#surname').val('');
          $('#phoneNum').val("")
          $('#loginPwd').val();
        },
        success: function(layero, index){

        },
        yes:function(index, layero){


        }
      });
      //删除
    } else if(obj.event === 'del'){
      var id = data.id;

      layer.confirm('真的删除行么', function(index){
        obj.del();
        var d3 = {"id":id};
        reqAjaxAsync(USER_URL.DELUSER,JSON.stringify(d3)).done(function(res){
          if(res.code == 1){
            layer.msg(res.msg);
            layer.close(index);
          }
        })

      });
    }
    //查看
    else if(obj.event === 'check'){
      var userpic=data.userpic;
      var name=data.name;
      var pwd=data.pwd;

      layer.open({
        title: ['查看群资料', 'font-size:12px;background-color:#0678CE;color:#fff'],
        type: 1,
        btn: ['保存', '取消'],
        content:$('#demo222'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
        area: ['800px', '650px'],
        end:function(){
          $('#demo222').hide();

        },
        success: function(layero, index){

          $(".logovalue>li>img").attr("src",userpic);
          $(".logovalue>li:nth-child(2)").html(uname);
          $(".logovalue>li:nth-child(3)").html(pwd);


        },

      });
    }
  });
})(jQuery)