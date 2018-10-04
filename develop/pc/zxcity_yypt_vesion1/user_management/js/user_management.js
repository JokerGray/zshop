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
  layui.use('form', function(){
    form = layui.form;
  })

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

  //收缩左侧
  $(".user-center").on("click",".user-lft",function(){
    $(".trees-box").hide();
    $(".tabale-list").show();
    $(".tabale-list").css("margin-left",0);
    $(".side-handle-right").show();
  });
  //收缩右侧
  $(".user-center").on("click",".user-rgt",function(){
    $(".trees-box").show();
    $(".tabale-list").show();
    $(".tabale-list").css("margin-left","315px");
  });

  //折叠展开
  $("#openbtn").click(function(){
    $(this).hide();
    $("#closebtn").show();
    treeObj.expandAll(true);
  });
  $("#closebtn").click(function(){
    $("#openbtn").show();
    $(this).hide();
    treeObj.expandAll(false);
  });
//重置
  $('#resetbtn').on('click',function(){
   $("#username").val('');
    $("#fixdepartment").val('');
    $("#phone").val('');
  });

  //搜索条件进行搜索
  $('#searchbtn').on('click',function(){
    var username=$.trim($("#username").val());
    var fixdepartment=$.trim($("#fixdepartment").val());
    var phone=$.trim($("#phone").val());
    getTable(fixdepartment,username,phone);
  });
  //下拉菜单里的部门
  function addSearch(){
    var param = {
      page : page ,
      rows : 10000,
      name : '',
      sort : 'sort',
      order : 'asc'
    }
     reqAjaxAsync(USER_URL.ALLLIST,JSON.stringify(param)).done(function(res){
       if(res.code == 1){
         var data = res.data;
         var sHtmldept = '';
         $.each(data, function(i,item) {
           sHtmldept +="<option value='"+item.id+"'>"+item.name+"</option>";
         });
         $('#fixdepartment').append(sHtmldept);
       }
     })
  }
  addSearch();
  //加载左侧导航树
  function getTree(){
    var setting = {
      check: {
        enable: false,
        chkStyle: "checkbox",
        radioType: "all",
        nocheckInherit: true,
        chkDisabledInherit: true,
        selectedMulti: false //不允许同时选中多个节点
      },
      data: {
        simpleData: {
          enable: true,//使用简单数据格式
          idKey: "id",
          pIdKey: "pid",
          rootPId: 0
        }
      },
      callback: {
        onClick: zTreeOnClick
      }
    };
    reqAjaxAsync(USER_URL.TREELIST,"").done(function(res){
      if(res.code == 1){
        var treeNodes=[],i,len=res.data.nodes.length;
        for(i=0;i<len;i++){
          treeNodes.push(res.data.nodes[i])
        }
        //初始化加载
        treeObj = $.fn.zTree.init($("#tree"), setting, treeNodes);
        //获取当前被选中的节点数据集合
        var selectedNode = treeObj.getSelectedNodes();
        //获取全部节点数据
        var nodes = treeObj.getNodes();
        treeObj.selectNode (nodes[0], true);
        var organizationId = nodes[0].id;
        //初始化加载表单
        var username = $("#username").val();
        var phone = $("#phone").val();
        $("#search").attr("data-id",organizationId);
        getTable(organizationId,username,phone);
      }else{
        layer.msg(res.msg);
      }

    })

  }
  getTree();
  //树点击事件
  function zTreeOnClick(event, treeId, treeNode) {
    var organizationId = treeNode.id;
    var username = $("#username").val();
    var phone = $("#phone").val();
    getTable(organizationId,username,phone);
  };
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
      ,height: 700 //容器高度
      ,cols: [[

        {checkbox:true}
        ,{title:'序号',sort:false,align:'left',field:'eq',width:80}
        ,{title:'登录名',sort:false,align:'left',field:'name',width:150}
        ,{title:'姓名',sort:false,align:'left',field:'uname',width:150}
        ,{title:'性别',sort:false,align:'left',field:'sex',width:100}
        ,{title:'手机',sort:false,align:'left',field:'phone',width:200}
        ,{title:'是否锁定',sort:false,align:'left',field:'status_name',width:100}
        ,{title:'归属部门',sort:false,align:'left',field:'orgname',width:150}
        ,{title:'最后操作时间',sort:false,align:'left',field:'update_time',width:200}
        ,{title:'操作',align:'center', toolbar: '#barDemo',width:430}
      ]]

      ,loading: true
      ,data:getData(USER_URL.BYORGID,JSON.stringify(param))
      ,page:true
      ,even: true
      ,skin: 'row'
      ,limits: [15,50,100,300,800,1000]
      ,limit: 15 //默认采用60
    });
  }
  //选中表单事件
  $('#app').on('click','tr',function(){
    $(this).addClass('layui-table-click').siblings().removeClass('layui-table-click');
  });
  //弹出框里面角色选项
  function departmenthtml(){
    var param = {
      page : page ,
      rows : 50 ,
      // name : '',
      // sort : 'sort',
      // order : 'asc'
    }
    var res =reqAjax(USER_URL.ROLELIST,JSON.stringify(param));
      if(res.code == 1){
        var data = res.data;
        var sHtml = '';
        $.each(data, function(i,item) {
          sHtml+="<option value='"+item.name+"'>"+item.name+"</option>";
        });
        $('#role').append(sHtml);
      }
  }
  //新增
  $('#commonAdd').on('click',function(){
   layer.open({
      title: ['新增', 'font-size:12px;background-color:#0678CE;color:#fff'],
      btn: ['保存', '取消'],
      type: 1,
      content:$('#demo111'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
      area: ['800px', '590px'],
     closeBtn:1,
      end:function(){
        $('#demo111').hide();
        $('#role').val('');
        $('#loginName').val('');
        $('#surname').val('');
        $('#phoneNum').val("")
        $('#loginPwd').val();

      },
      success:function(layero,index){

        $('div.layui-layer-page').addClass('layui-form')
        $('a.layui-layer-btn0').attr('lay-submit','');
        $('a.layui-layer-btn0').attr('lay-filter','formDemo');
        form.render();

        //上传图片
        uploadOss({
          btn: "uploadImg",
          flag: "img",
          size: "5mb"
        });
        //弹出框角色选项
        departmenthtml();
          layui.form.render('select','test');
        //加载右侧导航树
        function getTree(){
          var setting = {
            check: {
              enable: false,
              chkStyle: "checkbox",
              radioType: "all",
              nocheckInherit: true,
              chkDisabledInherit: true,
              selectedMulti: false //不允许同时选中多个节点
            },
            data: {
              simpleData: {
                enable: true,//使用简单数据格式
                idKey: "id",
                pIdKey: "pid",
                rootPId: 0
              }
            },
            callback: {
              onClick: TreeOnClick
            }

          };
          reqAjaxAsync(USER_URL.TREELIST,"").done(function(res){
            if(res.code == 1){
              var treeNodes=[],i,len=res.data.nodes.length;
              for(i=0;i<len;i++){
                treeNodes.push(res.data.nodes[i])
              }
              //初始化加载
              treeObj = $.fn.zTree.init($("#treeRgt"), setting, treeNodes);
              //获取当前被选中的节点数据集合
              var selectedNode = treeObj.getSelectedNodes();

            }else{
              layer.msg(res.msg);
            }
          })

        }
        getTree();
        //右侧树点击事件
        function TreeOnClick(event, treeId, treeNode){
          // alert(treeNode.pid + ", " + treeNode.name);
          orgno=treeNode.id;
        };

      },
      yes:function(index,layero){
        form.on('submit(formDemo)', function(done){
            if(done){

              var loginName = $(layero).find('#loginName').val();
              // var loginPwd= $(layero).find('#loginPwd').val();
              var phoneNum = $(layero).find('#phoneNum').val();
              var surname = $(layero).find('#surname').val();
              var roleIds = $('#role>option:selected').attr('value');
              var status = $('#lockin>:checked').attr('value');
              var sexchoose=$('#sexchoose>:checked').attr('value');
              var uploadUrl=$(layero).find('#uploadImg').attr('src');
              console.log(sexchoose)
              var param ={
                name:loginName,
                uname:surname,
                sex:sexchoose,
                birthday:"2011-11-11",
                phone:phoneNum,
                userpic:uploadUrl,
                roleIds:roleIds,
                orgno:orgno,
                status:status,
                parent_id:"" //当前登录用户ID

              }
              reqAjaxAsync(USER_URL.ADDRESOURCE,JSON.stringify(param)).done(function(res){
                if(res.code == 1){
                  layer.close(index);
                  layer.msg(res.msg);
                }else{
                  layer.msg(res.msg);
                }
              })

            }
        });
      }
    });
  })
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

          //表单验证
          $('div.layui-layer-page').addClass('layui-form')
          $('a.layui-layer-btn0').attr('lay-submit','');
          $('a.layui-layer-btn0').attr('lay-filter','formDemo');
          form.render();
          var code = sessionStorage.getItem('code');
          //上传图片
          uploadOss({
            btn: "uploadImg",
            flag: "img",
            size: "5mb"
          });
          //加载右侧导航树
          function getTree(){
            var setting = {
              check: {
                enable: false,
                chkStyle: "checkbox",
                radioType: "all",
                nocheckInherit: true,
                chkDisabledInherit: true,
                selectedMulti: false //不允许同时选中多个节点
              },
              data: {
                simpleData: {
                  enable: true,//使用简单数据格式
                  idKey: "id",
                  pIdKey: "pid",
                  rootPId: 0
                }
              },
              callback: {
                onClick: TreeOnClick
              }

            };
            reqAjaxAsync(USER_URL.TREELIST,"").done(function(res){
              if(res.code == 1){
                var treeNodes=[],i,len=res.data.nodes.length;
                for(i=0;i<len;i++){
                  treeNodes.push(res.data.nodes[i])
                }
                //初始化加载
                treeObj = $.fn.zTree.init($("#treeRgt"), setting, treeNodes);
                //获取当前被选中的节点数据集合
                var selectedNode = treeObj.getSelectedNodes();

              }else{
                layer.msg(res.msg);
              }
            })

          }
          getTree();
          function TreeOnClick(event, treeId, treeNode){
            orgno=treeNode.pid;
          };
        },
        yes:function(index, layero){

          form.on('submit(formDemo)', function(done) {
            if (done) {
              var loginName = $(layero).find('#loginName').val();
              var loginPwd= $(layero).find('#loginPwd').val();
              var phoneNum = $(layero).find('#phoneNum').val();
              var surname = $(layero).find('#surname').val();
              var roleIds = $('#role>option:selected').attr('value');
              var status = $('#lockin>:checked').attr('value');
              var sexchoose=$('#sexchoose>:checked').attr('value');
              var uploadUrl=$(layero).find('#uploadImg').attr('src');

              var param ={
                name:loginName,
                uname:surname,
                sex:sexchoose,
                birthday:"2011-11-11",
                phone:phoneNum,
                userpic:uploadUrl,
                roleIds:roleIds,
                orgno:orgno,
                status:status,
                parent_id:"" //当前登录用户ID
              }
              reqAjaxAsync(USER_URL.ADDRESOURCE,JSON.stringify(param)).done(function(res){
                if(res.code == 1){
                  layer.close(index);
                  layer.msg(res.msg);
                }else{
                  layer.msg(res.msg);
                }
              })
            }
          })
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
      //重置密码
    }else if(obj.event === 'reset'){
      var id = data.id;
      layer.prompt({
        formType: 2,
        title: '请输入新密码',
        area: ['200px', '100px'] //自定义文本域宽高
      }, function(value, index, elem){
          var parm= {
             "id": id,
               "update_id":value
            }
        reqAjaxAsync(USER_URL. RESETPWD,JSON.stringify(parm)).done(function(res){
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
      var phone=data.phone;
      var sex=data.sex;
      var orgname=data.orgname;
      var status=data.status_name;
      var uname=data.uname;

      layer.open({
        title: ['查看', 'font-size:12px;background-color:#0678CE;color:#fff'],
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
          $(".logovalue>li:nth-child(4)").html(phone);
          $(".logovalue>li:nth-child(5)").html(name);
          $(".logovalue>li:nth-child(6)").html(sex);
          $(".dptvalue>li:first-child").html(orgname);
          $(".dptvalue>li:nth-child(2)").html(status);

        },
        yes:function(index, layero){

        }
      });
    }
  });
})(jQuery)