(function($) {
  var page = 1;
  var rows = 10;
  var userno = yyCache.get("userno") || "";
  var userId = yyCache.get("userId") || "";
  var names = yyCache.get('name') || "";
  var roleids = yyCache.get('roleIds') || "";
  var roleid =roleids[0];
  var locked = true;
//接口参数
  var USER_URL = {
    ALLLIST : 'operations/organizationList',//(查询所有部门)
    ADDRESOURCE : 'operations/addUser',//(新增)1-启用2-锁定
    UPDATERESOUCE : 'operations/updateUser', //(修改)
    DELUSER : 'operations/deleteAUser', //(删除)
    DELLIST : 'operations/deleteUsers', // ( 删除多个)
    RESETPWD : 'operations/resetUserPwd',//(重置密码)
    TREELIST : 'operations/organizationNodes', //(树)
    ROLELIST : 'operations/roleList', //(角色)
    BYORGID :'operations/getUsersByOrgId', //(按部门查用户接口)
    APPUSER:'operations/queryAppUserUnboundedRecommendPage', //(查询未绑定app用户)
    ADDAPP:'operations/addAppUserRecommendRelation', //(添加app)
    QUERYVED:'operations/queryTUserInfo',//(查看)
    SYSUSERLIST : 'operations/getUnBindAgentSysUserPageList'//代理商查看
  };

  var layer = layui.layer;
  var table = layui.table;
  layui.use('form', function(){
    var form = layui.form;
  })


  //上传图片
  uploadOss({
    btn: "uploadImg",
    flag: "img",
    size: "5mb"
  });


  //刷新
  $("#refrshbtn").click(function(){
    location.reload();
  });

//搜索按钮出现搜索框
  $('.searchbutton').on('click',function(){
    $('.searchform').slideToggle(200)
  })

  //折叠展开
  $("#openbtn").click(function(){
    $(this).hide();
    $("#closebtn").show();
    $("#closebtn").css("margin-left",0)
    treeObj.expandAll(true);
  });
  $("#closebtn").click(function(){
    $("#openbtn").show();
    $(this).hide();
    treeObj.expandAll(false);
  });

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
    $(this).hide();
    $(".tabale-list").css("margin-left","315px");
  });


//重置
  $('#resetbtn').on('click',function(){
    $("#username").val('');
    $("#fixdepartment").val('');
    form.render();
    $("#phone").val('');
    
    var username = $("#username").val();
    var phone = $("#phone").val();
    var orgid = sessionStorage.getItem('organizationId');
    
    getTable(orgid,username,phone);
  });

  //搜索条件进行搜索
  $('#searchbtn').on('click',function(){
    var username=$.trim($("#username").val());
    var fixdepartment=$.trim($("#fixdepartment").val());
    console.log(fixdepartment);
    var phone=$.trim($("#phone").val());
    sessionStorage.setItem('organizationId',fixdepartment);
    $(".searchbutton").attr("data-type","1");
    getTable(fixdepartment,username,phone);
  });
  addSearch();

  //下拉菜单里的部门
  function addSearch(){
    var param = {
      page : page ,
      rows : 100 ,
      name : '',
      sort : 'sort',
      order : 'asc'
      // roleid:roleid
    }

    reqAjaxAsync(USER_URL.ALLLIST,JSON.stringify(param)).done(function(res){
      console.log(res.code);
      if(res.code == 1){
        var data = res.data;
        var sHtmldept = '';
        $.each(data, function(i,item) {
          sHtmldept +="<option value='"+item.id+"'>"+item.name+"</option>";
        });
        $('#fixdepartment').append(sHtmldept);

        form.render();
        
      }
    })
  }

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
    var param={
      "roleid":roleid
    }
    reqAjaxAsync(USER_URL.TREELIST,JSON.stringify(param)).done(function(res){
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
          sessionStorage.setItem('organizationId',organizationId);
          sessionStorage.setItem('organizationIdone',organizationId);
          $("#search").attr("data-id",organizationId);
          $("#commonAdd").attr("data-organizationId",organizationId);
        getTbl(organizationId);

      //  getTable(organizationId,username,phone);
      }else{
        layer.msg(res.msg);
      }

    })

  }
  getTree();
  //树点击事件
  function zTreeOnClick(event, treeId, treeNode) {
    var organizationId = treeNode.id ||"";
    var nds = treeObj.getSelectedNodes();
    if(nds.length>0){treeObj.expandNode(nds[0],!nds[0].open,false,true)}
    
    $("#commonAdd").attr("data-organizationId",organizationId);
    var username = $("#username").val();
    var phone = $("#phone").val();
    sessionStorage.setItem('organizationId',organizationId);
    getTable(organizationId,username,phone);
    $(".searchbutton").attr("data-type","2");
  };


  //新修改
  //渲染表单
  function getTbl(orgid){
      obj = tableInit('table', [
            [{checkbox:true},{
              title: '序号',
             /* sort: true,*/
              align: 'left',
              field: 'eq',
              width: 60
            }, {
              title: '登录名',
             /* sort: true,*/
              align: 'left',
              field: 'name',
              width: 100
            }, {
              title: '姓名',
             /* sort: true,*/
              align: 'left',
              field: 'uname',
              width: 100
            },{
              title: '性别',
             /* sort: true,*/
              align: 'left',
              field: 'sex',
              width: 80
            },{
              title: '手机',
             /* sort: true,*/
              align: 'left',
              field: 'phone',
              width: 140
            },{
              title: '是否锁定',
             /* sort: true,*/
              align: 'left',
              field:'status_name',
              width: 100
            },{
            	title:'是否离职',
            	templet:'#_isDimission',
            	width:100
            },{
              title: '归属部门',
             /* sort: true,*/
              align: 'left',
              field: 'orgname',
              width: 100
            }, {
              title: '最后操作时间',
             /* sort: true,*/
              align: 'left',
              field: 'newTime',
              width: 160
            }, {
              title: '操作',
              fixed: 'right',
              align: 'left',
              toolbar: '#barDemo',
              width: 340
            }]
          ],
          pageCallback,'laypageLeft',orgid
      );
    }




  /* 表格初始化
   * tableId:
   * cols: []
   * pageCallback: 同步调用接口方法
   */
  function tableInit(tableId, cols, pageCallback, test,orgid) {
    var tableIns, tablePage;
    //1.表格配置
    tableIns = table.render({
      id: tableId,
      elem: '#' + tableId,
      height:'full-249',
      cols: cols,
      page: false,
      even: true,
      skin: 'row'
    });

    //2.第一次加载
    var res = pageCallback(1, 10,orgid);
    //第一页，一页显示10条数据
    if(res) {
      if(res.code == 1) {
        tableIns.reload({
          data: res.data
        })
      } else {
        layer.msg(res.msg)
      }
    }

    //3.left table page
    layui.use('laypage');

    var page_options = {
      elem: 'laypageLeft',
      count: res ? res.total : 0,
      layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
      limits: [10],
      limit: 10
    }
    page_options.jump = function(obj, first) {
      tablePage = obj;

      //首次不执行
      if(!first) {
        var resTwo = pageCallback(obj.curr, obj.limit,orgid);
        if(resTwo && resTwo.code == 1)
          tableIns.reload({
            data: resTwo.data
          });
        else
          layer.msg(resTwo.msg);
      }
    }


    layui.laypage.render(page_options);

    return {
      tablePage,
      tableIns
    };
  }

  //序号遍历
  function getData(url,parms){
    var res =reqAjax(url,parms);
    var data = res.data;
    $.each(data,function(i,item){
      $(item).attr('eq',(i+1));
      if(item.update_time != null) {
        $(item).attr('newTime', item.update_time);
      }else{
        $(item).attr('newTime', item.create_time);
      }
    })
    return res;
  }

  //第一次带参
  function pageCallback(index, limit , organizationId,username,phone) {
    if(organizationId == undefined){organizationId = ''}
    if(username == undefined){username = ''}
    if(phone == undefined){phone = ''}
    var param = {
      page:index,
      rows:limit,
      organizationId :organizationId,
      uname:username,
      phone:phone
    }
    return getData(USER_URL.BYORGID,JSON.stringify(param));
  }


  //加入入参的回调方法
  function getTable(username,phone,organizationId){
    var initPage = obj.tablePage;
    var initTable = obj.tableIns;
      var res = pageCallback(1, 10,username,phone,organizationId);
    initTable.reload({ data : res.data });
    layui.use('laypage');
    var page_options = {
      elem: 'laypageLeft',
      count: res ? res.total : 0,
      layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
      limits: [10],
      limit: 10
    }
    page_options.jump = function(obj, first) {
      tablePage = obj;

      //首次不执行
      if(!first) {
        var resTwo = pageCallback(obj.curr, obj.limit,username,phone,organizationId);
        if(resTwo && resTwo.code == 1)
          initTable.reload({
            data: resTwo.data
          });
        else
          layer.msg(resTwo.msg);
      }
    }
    layui.laypage.render(page_options);
  }


//批量删除

  function deletAll() {
    var arr ="";
    $.each(layui.table.checkStatus('table').data, function(i, v){
      arr+=v.id+",";
      console.log(arr);

    });

    if(arr.length=="0"){
      layer.msg("请先选中要删除的行");
    }else if(arr.length>0){
      var arr1 = arr.substring(0,arr.length-1);


      layer.confirm('确认删除选中的行吗', function(index){
        var d3 = {
          userIdArray:arr1,// 多个用户Id用逗号分隔
          operatorId: userId,        // 当前登录人Id
          operatorName: names  // 当前登录人名字
        };
        reqAjaxAsync(USER_URL.DELLIST,JSON.stringify(d3)).done(function(res){
          if(res.code == 1){
            layer.msg(res.msg);
            layer.close(index);
            form.render();
            /*var organi = $("#commonAdd").attr("data-organizationId");
            var uname = $("#username").val();
            var phone = $("#phone").val();
            getTable(organi,uname,phone);*/
            var organi = sessionStorage.getItem('organizationId');
            var uname = $("#username").val();
            var phone = $("#phone").val();
            getTable(organi,uname,phone);
          }
        })

      });
    }

  }

//单个删除
  $("#deletbtn").click(function () {
    deletAll();
  });










  //弹出框里面角色选项
  function departmenthtml(){
    var param = {
      page : page ,
      rows : 100
      // name : '',
      // sort : 'sort',
      // order : 'asc'
    }
    var res =reqAjax(USER_URL.ROLELIST,JSON.stringify(param));
      $('#role').empty();
      if(res.code == 1){
        var data = res.data;
        var sHtml = '';
        $.each(data, function(i,item) {
          sHtml+="<option value='"+item.id+"'>"+item.name+"</option>";
        });
        $('#role').append(sHtml);
      }
  }


  //新增
  $('#commonAdd').on('click',function(){
   layer.open({
      title: ['新增',  'font-size:12px;background-color:rgb(66, 70, 81);color:#fff'],
      btn: ['保存', '取消'],
      type: 1,
     resize:false,
     shade: [0.1, '#fff'],
      content:$('#demo111'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
      area: ['1000px', '745px'],
     closeBtn:1,
     offset: '20px',
      end:function(){
        $('#demo111').hide();
        $('#role').val('');
        $('.loginName').val('');
        $("#loginPwd").val('123456');
        $('#surname').val('');
        $('#phoneNum').val("")
        $("#uploadImg").attr("src","images/user.png");
        $(".webbox").remove();
      },
      success:function(layero,index){
        var sHtml='<div class="layui-form-item webbox">' +
                      '<label class="layui-form-label">云信注册：</label>' +
                      '<div class="layui-input-block">'+
                        '<input type="checkbox" name=""  lay-skin="primary">'+
                      '</div>'+
                '</div>';
        $(".isleave").after(sHtml);
        $('#role').val('');
        $('.loginName').val('');
        $("#loginPwd").val('123456');
        $('#surname').val('');
        $('#phoneNum').val("");
        $('input>:checked').eq(0).attr('checked','checked');
        $('div.layui-layer-page').addClass('layui-form')
        $('a.layui-layer-btn0').attr('lay-submit','');
        $('a.layui-layer-btn0').attr('lay-filter','formDemo');
        $("#uploadImg").attr("src","images/user.png");
        $(".upwd").css("display","block");
        $("#phoneNum").blur(function(){
          var mobileExp = /^1[3,5,7-8][0-9]{9}$/i; //手机正则
          if(!mobileExp.test($(this).val())){
            $(this).val("");
            layer.alert("请输入正确的手机号");
            return;
          }
        });


        form.render();

        //弹出框角色选项
        departmenthtml();
          layui.form.render('select','test');
        //加载右侧导航树
        function getTrees(){
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
          var param={
            "roleid":roleid
          }
          reqAjaxAsync(USER_URL.TREELIST,JSON.stringify(param)).done(function(res){
            if(res.code == 1){
              var treeNodes=[],i,len=res.data.nodes.length;
              for(i=0;i<len;i++){
                treeNodes.push(res.data.nodes[i])
              }
              //初始化加载
              treeObjs = $.fn.zTree.init($("#treeRgt"), setting, treeNodes);
              //获取当前被选中的节点数据集合
              var selectedNode = treeObjs.getSelectedNodes();

            }else{
              layer.msg(res.msg);
            }
          })

        }
        getTrees();
        //右侧树点击事件
        function TreeOnClick(event, treeId, treeNode){
          // alert(treeNode.pid + ", " + treeNode.name);
          orgno=treeNode.id;
          
          $(".loginName").attr("data-id",orgno);

          //判断选中的是否为子节点
          //若为父节点flag = true
          /*if(nds.length > 0){
            var flag = nds[0].isParent;
          }
          $("#loginPwd").attr("data-flag",flag);*/
        };

       var org= $(layero).find('.loginName').attr("data-id");

        // if(!org){
        //     layer.msg("请先选择所属部门");
        //   }

      },
      yes:function(index,layero){
        form.on('submit(formDemo)', function(done){
            if(done){
              var loginName = $(layero).find('.loginName').val();
              var phoneNum = $(layero).find('#phoneNum').val();
              var surname = $(layero).find('#surname').val();
              var roleIds = $('#role>option:selected').attr('value');
              var status = $('#lockin>:checked').attr('value');
              var sexchoose=$('#sexchoose>:checked').attr('value');
              var leave=$('#leave>:checked').attr('value');
              var uploadUrl=$(layero).find('#uploadImg').attr('src');
              var isAdmin = $('#type').val();
              var radioval = $(".webbox .layui-unselect").attr("class");
              if(radioval.indexOf("layui-form-checked")!=-1){
                var registerNIM = "1";
              }else{
                var registerNIM = "0";
              }
              
             var orgs= $('.loginName').attr("data-id");
              /*var flgs = $("#loginPwd").attr("data-flag");*/ //判断是否为父节点
             // debugger
              if(loginName.length<4){
                layer.alert("登录名请输入最少4位数");
                return false
              };

              //父节点不能添加
              /*if(flgs == "true"){
                layer.alert("请选择子节点");
                return;
              };*/

              if(!orgs || orgs == ""){
                layer.msg("请先选择所属部门");

              }else {
                if(uploadUrl == "images/user.png"){
                  newUploadUrl = ""
                }else{
                  newUploadUrl = uploadUrl;
                }
                var param ={
                  name:loginName,
                  uname:surname,
                  sex:sexchoose,
                  birthday:"2011-11-11",
                  phone:phoneNum,
                  userpic:newUploadUrl,
                  roleIds:roleIds,
                  orgno:orgs,
                  status:status,
                  isDimission:leave,
                  parent_id:userId, //当前登录用户ID
                  operatorName:names, //当前登录人的名字
                  isAdmin:isAdmin,
                  registerNIM:registerNIM //是否注册云信
                }
                if(locked) {
                  locked = false;
                  reqAjaxAsync(USER_URL.ADDRESOURCE, JSON.stringify(param)).done(function (res) {
                    if (res.code == 1) {
                      var organi = sessionStorage.getItem('organizationId');
                      var uname = $("#username").val();
                      var phone = $("#phone").val();

                      $('.loginName').attr("data-id", "");
                      $("#loginPwd").attr("data-flag", "");
                      layer.close(index);
                      layer.msg(res.msg);
                      setTimeout(function(){
                        getTable(organi, uname, phone);
                        locked = true;
                      },500);

                    } else {
                      layer.msg(res.msg);
                      locked = true;
                    }
                  })
                }
             }
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
        title: ['修改', 'font-size:12px;background-color:rgb(66, 70, 81);color:#fff'],
        type: 1,
        btn: ['保存', '取消'],
        shade: [0.1, '#fff'],
        content:$('#demo111'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
        area: ['1000px', '745px'],
        resize:false,
        offset: '20px',
        end:function(){
          $("#surname").attr("data-orgno","");
          $("#demo111").hide();
          $(".loginName").attr("disabled",false);
        },
        success: function(layero, index){
        /* $(".upwd").css("display","none");*/
          var userpic=data.userpic;
          var name=data.name;
          var pwd=data.pwd;
          var phone=data.phone;
          var sex=data.sex;
          var orgname=data.orgname;
          var status=data.status_name;
       
          var uname=data.uname;
          var role=data.role_id;
          var type=data.operatorName;
          var isAdmin=data.is_admin;
          var leave=data.isDimission;
          if(userpic==""){
            userpic = "images/user.png"
          }
          $("#uploadImg").attr("src",userpic);
          $(".loginName").val(name);
          $(".loginName").attr("disabled",true);
          $("#loginPwd").val("******");
          $("#phoneNum").val(phone);
          $("#surname").val( uname);
          // $("#role>option:first-child").html(role);
          $("input[name='sex']").attr("checked","");
          
          $('#type').val(isAdmin);

					if(sex=="男"){
					  $("input[name='sex']").eq(0).prop("checked","checked");
					}else if(sex=="女"){
					  $("input[name='sex']").eq(1).prop("checked","checked");
					}

          $("input[name='lock']").prop("checked","");
          if(status=="是"){
            $("input[name='lock']").eq(0).prop("checked","checked");
          }else if(status=="否"){
            $("input[name='lock']").eq(1).prop("checked","checked");
          }
          
          $("input[name='lea']").prop("checked","");
          if(leave==0){
          	$("input[name='lea']").eq(0).prop("checked","checked");
          }else if(leave==1){
          	$("input[name='lea']").eq(1).prop("checked","checked");
          }



          //表单验证
          $('div.layui-layer-page').addClass('layui-form')
          $('a.layui-layer-btn0').attr('lay-submit','');
          $('a.layui-layer-btn0').attr('lay-filter','formDemo');
          $("#phoneNum").blur(function(){
            var mobileExp = /^1[3,5,7-8][0-9]{9}$/i; //手机正则
            if(!mobileExp.test($(this).val())){
              $(this).val("");
              layer.alert("请输入正确的手机号");
              return;
            }
          });
          form.render();
          var code = sessionStorage.getItem('code');

          //弹出框角色选项
          departmenthtml();
          layui.form.render('select','test');

          /*$("#role").val(role);*/
          $("#roles").find(".layui-anim-upbit dd").removeClass("layui-this");
          var lis = $("#roles").find(".layui-anim-upbit dd");
          for(var i=0;i<lis.length;i++){
            var bal = lis.eq(i).attr("lay-value");
            if(bal == role){
              lis.eq(i).addClass('layui-this');
              var addtye = lis.eq(i).text();
              $("#roles").find(".layui-unselect").val(addtye);
            }
          }
          //加载右侧导航树
          function getTreess(){
            var setting = {
              check: {
                enable: true,
                chkStyle: "radio",
                radioType: "all"
              },
              data: {
                simpleData: {
                  enable: true
                }
              },
              callback: {
                onCheck: zTreeOnCheck,
                onClick: zTreeOnClick
              }

            };
            var param={
              "roleid":roleid
            }
            reqAjaxAsync(USER_URL.TREELIST,JSON.stringify(param)).done(function(res){
              if(res.code == 1){
                var treeNodes=[],i,len=res.data.nodes.length;
                for(i=0;i<len;i++){
                  treeNodes.push(res.data.nodes[i])
                }
                //初始化加载
                treeObjss = $.fn.zTree.init($("#treeRgt"), setting, treeNodes);
                // ============获取选中树形（部门）=================
                var nodes = treeObjss.getCheckedNodes(false);
                var resourceTree ;
                var orgno = data.orgno;
                $.each(nodes, function(i, item){
                  // 这是单选 后期要复选再改
                  // console.log(item.id)
                  // resourceTree=item.id
                  if(orgno==item.id){

                    //item.checked=true
                    treeObjss.checkNode(item, true, false);
                  }
                  // if(item.checked && !item.children){
                  //     console.log(item);
                  //     resourceTree.push(item.id);
                  //     resourceTree.push(item.children.id)
                  // }
                });

              }else{
                layer.msg(res.msg);
              }
            })
          }
          getTreess();
          function zTreeOnCheck(event, treeId, treeNode){
            var orgno=treeNode.pid;
            $("#surname").attr("data-orgno",orgno);
            var nds = treeObjss.getSelectedNodes();
            for (var i=0, l=nds.length; i < l; i++) {
              treeObjss.checkNode(nds[i], true, true);
            }
            //判断选中的是否为子节点
            //若为父节点flag = true
           /* if(nds.length > 0){
              var flag = nds[0].isParent;
            }
            $("#surname").attr("data-flag",flag);*/
          };

          //点击选中
          function zTreeOnClick(event, treeId, treeNode) {
            zTreeOnCheck(event, treeId, treeNode);
          };

        },
        yes:function(index, layero){

          form.on('submit(formDemo)', function(done) {
            if (done) {
              var loginName = $(layero).find('.loginName').val();
              // var loginPwd= $(layero).find('#loginPwd').val();
              var phoneNum = $(layero).find('#phoneNum').val();
              var surname = $(layero).find('#surname').val();
              var roleIds =  $("#roles dl").find("dd.layui-this").attr("lay-value");
              // var roleIds = $('#role>option:selected').attr('value');
              var status = $('#lockin>:checked').attr('value');
              var sexchoose=$('#sexchoose>:checked').attr('value');
              var leave=$('#leave>:checked').attr('value');
              
              var uploadUrl=$(layero).find('#uploadImg').attr('src');
              var isAdmin=$('#type').val();
             /* var flgs = $("#surname").attr("data-flag");*/ //判断是否为父节点
              // debugger
              if(loginName.length<4){
                layer.alert("登录名请输入最少4位数");
                return false
              };

              //父节点不能添加
              /*if(flgs == "true"){
                layer.alert("请选择子节点");
                return;
              };*/
              //获取选中树形id
              var nodes = treeObjss.getCheckedNodes(true);
              console.log(nodes)
              var resourceTree ;
              $.each(nodes, function(i, item){
                // 这是单选 后期要复选再改
                  resourceTree=item.id;
                  resourceTreep = item.isParent;

              });
              /*if(resourceTreep == true){
                layer.alert("请选择子节点");
                return;
              }else*/
              if(uploadUrl == "images/user.png"){
                newUploadUrl = ""
              }else{
                newUploadUrl = uploadUrl;
              }
              var param ={
                id: data.id,
                name:loginName,
                uname:surname,
                orgno:resourceTree, //组织id
                sex:sexchoose,
                isDimission:leave,
                birthday:"2011-11-11",
                phone:phoneNum,
                userpic:newUploadUrl,
                roleIds:roleIds,
                status:status,
                note:"",
                update_id:userId, //当前登录用户ID
                operatorName:names, //当前登录人的名字
                isAdmin:isAdmin
              }
              if(locked) {
                locked = false;
                reqAjaxAsync(USER_URL.UPDATERESOUCE, JSON.stringify(param)).done(function (res) {
                  if (res.code == 1) {
                    layer.close(index);
                    layer.msg(res.msg);
                    $("#surname").attr("data-orgno", "");
                    $("#surname").attr("data-flag", "");
                    $(".loginName").attr("disabled", false);
                    var organi = sessionStorage.getItem('organizationId');
                    var uname = $("#username").val();
                    var phone = $("#phone").val();
                    setTimeout(function(){
                      getTable(organi, uname, phone);
                      locked = true;
                    },500);
                  } else {
                    layer.msg(res.msg);
                    locked = true;
                  }
                })
              }
            }
          })
        }
      });
      //删除
    }
    //删除
    else if(obj.event === 'del'){
      var id = data.id;
      layer.confirm(
          "确认删除?",
          {icon: 3, title:'提示'},
          function(index){
            var paramDel = {
              userId: id, // 用户Id
              operatorId: userId,        // 当前登录人Id
              operatorName:names  // 当前登录人名字
            };
            reqAjaxAsync(USER_URL.DELUSER,JSON.stringify(paramDel)).done(function(res){
              if (res.code == 1) {
                layer.msg("删除成功");
                layer.close(index);
                var typ = $(".searchbutton").attr("data-type");
                var organi = sessionStorage.getItem('organizationId');
                var uname = $("#username").val();
                var phone = $("#phone").val();
                getTable(organi,uname,phone);
              } else {
                layer.msg(res.msg);
              }
            });
          })
    }
    //重置密码
    else if(obj.event === 'reset'){
      var id = data.id;
      layer.prompt({
        formType: 2,
        title: '请输入新密码',
        area: ['200px', '100px'] //自定义文本域宽高
      }, function(value, index, elem){
          var parm= {
             "id": id,
             "update_id":value,
             "operatorName":names //当前登录人的名字
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
    	console.log(data)
      if(data.userpic==""){
        var userpic= "../mine_index/img/default_icon.png"
      }else{
        var userpic=data.userpic;
      }
      var id = data.id;
      var name=data.name;
      var pwd=data.pwd;
      var sex=data.sex;
      var phone = data.phone;
      var orgname=data.orgname;
      var status=data.status_name;
      var uname=data.uname;
      var rolename = data.role_name;
			var parms ="{'tUserId':'"+id+"'}";
   		var res =reqAjax(USER_URL.QUERYVED,parms);
   		var resData = res.data;
   		console.log(resData)
			if(JSON.stringify(resData)=='{}'){
	 			 $('#t4').css('display','none')
   			 $('#t2').css('display','none')
			}
			if(resData.type == 'T4' && resData.user != null){
   			 var user = resData.user;
   			 if(user.isrealname == 2){
   			 		user.isrealname = '已实名'
   			 }else{
   			 		user.isrealname = '未实名'
   			 }
   			 if(user.lasttime == null){
   			 		user.lasttime = '未知'
   			 }
   			 $('#t4').css('display','block')
   			 $('#t2').css('display','none')

   			 $('#t4 .logovalue>li:nth-child(1)').html(user.phone);
   			 $('#t4 .logovalue>li:nth-child(2)').html(user.username);
   			 $('#t4 .logovalue>li.sex').html(sex);
   			 console.log(user.createtime)
   			 $('#t4 .dptvalue>li:nth-child(1)').html(user.lasttime);
   			 $('#t4 .dptvalue>li:nth-child(2)').html(user.isrealname);
   		}else if(resData.type == 'T2' && resData.backUser != null){
   			 var backUser = resData.backUser;
   			 var scSysOrg = backUser.scSysOrg;
   			 var userOrg = resData.userOrg;
   			 if(userOrg.trade == 1){
   			 		userOrg.trade = '服务业'
   			 }else if(userOrg.trade == 2){
   			 		userOrg.trade = '零售业'
   			 }else if(userOrg.trade == 3){
   			 		userOrg.trade = '餐饮业'
   			 }
   			 $('#t2').css('display','block');
   			 $('#t4').css('display','none');
   			 $('#t2 .logovalue>li:nth-child(1)').html(backUser.phone);
   			 $('#t2 .logovalue>li:nth-child(2)').html(scSysOrg.orgName);
   			 $('#t2 .logovalue>li.sex').html(sex);
   			 $('#t2 .dptvalue>li:nth-child(1)').html(backUser.createDatetime);
   			 $('#t2 .dptvalue>li:nth-child(2)').html(userOrg.trade);
   			 $('#t2 .dptvalue>li:nth-child(3)').html('');
   		}
   		
      layer.open({
        title: ['查看',  'font-size:12px;background-color:rgb(66, 70, 81);color:#fff'],
        type: 1,
        content:$('#demo222'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
        area: ['800px', '650px'],
        shade: [0.1, '#fff'],
        end:function(){
          $('#demo222').hide();
        },
        success: function(layero, index){
          // 左
          $("#logovalue>li>img").attr("src",userpic);
          $("#logovalue>li:nth-child(2)").html(name);
          $("#logovalue>li:nth-child(4)").html(phone);
          $("#logovalue>li:nth-child(5)").html(uname);
          $("#logovalue>li:nth-child(6)").html(sex);
          
          // 右
          $("#dptvalue>li:first-child").html(orgname);
          if(status=="锁定"){
            $("#dptvalue>li:nth-child(2)").html("是");
          }else{
            $("#dptvalue>li:nth-child(2)").html("否");
          }
          $("#dptvalue>li:nth-child(3)").html(rolename);

        }

      });
    }else if(obj.event === 'ununbind'){
      layer.open({
        title: ['绑定代理商用户',  'font-size:12px;background-color:rgb(66, 70, 81);color:#fff'],
        type: 1,
        content:$('#blindApp'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
        area: ['800px', '650px'],
        btn:['绑定','取消'],
        shade: [0.1, '#fff'],
        end:function(){
          $('#blindApp').hide();
        },
        success: function(layero, index){
        	console.log(data)
          var appobj = tableInitApp('tableApp', [
                [{
                  title: '序号',
                  sort: true,
                  align: 'left',
                  field: 'eq',
                  width: 50,
                  event: 'changetable'
                }, {
                  title: '用户名',
                  sort: true,
                  align: 'left',
                  field: 'username',
                  width: 100,
                  event: 'changetable'
                }, {
                  title: '手机号',
                  sort: true,
                  align: 'left',
                  field: 'phone',
                  width: 100,
                  event: 'changetable'
                },{
                  title: '商户名',
                  sort: true,
                  align: 'left',
                  field: 'orgName',
                  width: 100,
                  event: 'changetable'
                }, {
                  title: '性别',
                  sort: true,
                  align: 'left',
                  field: 'usersex',
                  width: 100,
                  event: 'changetable'
                }, {
                  title: '是否实名',
                  sort: true,
                  align: 'left',
                  field: 'realName',
                  width: 100,
                  event: 'changetable'
                }, {
                  title: '创建时间',
                  sort: true,
                  tid:'id',
                  fixed: 'right',
                  align: 'left',
                  field: 'createtime',
                  width: 110,
                  event: 'changetable'
                }]
              ],
              pageCallbackAppUser
          );
            /* 表格初始化
           * tableId:
           * cols: []
           * pageCallback: 同步调用接口方法
           */
          function tableInitApp(tableId, cols, pageCallback, test) {
            var tableIns, tablePage;
            //1.表格配置
            tableIns = table.render({
              id: tableId,
              elem: '#' + tableId,
              height:'420',
              width:'750',
              cols: cols,
              page: false,
              even: true,
              skin: 'row'
            });

            //2.第一次加载
            var res = pageCallbackAppUser(1, 10);
            //第一页，一页显示10条数据
            if(res) {
              if(res.code == 1) {
                tableIns.reload({
                  data: res.data
                })
              } else {
                layer.msg(res.msg)
              }
            }

            //3.left table page
            layui.use('laypage');

            var page_options = {
              elem: 'laypageLefts',
              count: res ? res.total : 0,
              layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
              limit: 10
            }
            page_options.jump = function(obj, first) {
              tablePage = obj;

              //首次不执行
              if(!first) {
                var resTwo = pageCallbackAppUser(obj.curr, obj.limit);
                if(resTwo && resTwo.code == 1)
                  tableIns.reload({
                    data: resTwo.data
                  });
                else
                  layer.msg(resTwo.msg);
              }
            }


            layui.laypage.render(page_options);

            return {
              tablePage,
              tableIns
            };
          }

          //左侧表格数据处理
          function getDataApp(url, parms) {

            var res = reqAjax(url, parms);

            var data = res.data;

            $.each(data, function(i, item) {
              $(item).attr('eq', (i + 1));
							if(item.isrealname == 2){
                $(item).attr('realName', '已认证');
              }else{
              	$(item).attr('realName', '未认证');
              }
            });

            return res;
          }
          
          //pageCallback代理商回调
          function pageCallbackAppUser(index, limit , phone, orgName) {
            if(phone == undefined){phone = ''}
            if(orgName == undefined){orgName = ''}
            return getDataApp(USER_URL.SYSUSERLIST , "{'page':" + index + ",'rows':" + limit + ",'phone':'" + phone + "','orgName':'" + orgName + "'}");
          }

          //pageCallback回调
          function pageCallbackApp(index, limit , phone) {
            if(phone == undefined){phone = ''}
            return getDataApp(USER_URL.APPUSER , "{'page':" + index + ",'rows':" + limit + ",'phone':'" + phone + "'}");
          }

          //点击表格变色
          $('#apptable').on('click','tr',function(){
            $(this).addClass('layui-table-click').siblings().removeClass('layui-table-click');
          });

          //搜索
          $("#appSearch").click(function(){
              var phonename = $.trim($("#appname").val());
              var initPage = appobj.tablePage;
              var initTable = appobj.tableIns;
              var res = pageCallbackApp(initPage.curr, initPage.limit,phonename);
              initTable.reload({ data : res.data });
              layui.use('laypage');
              var page_options = {
                elem: 'laypageLefts',
                count: res ? res.total : 0,
                layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
                limits: [10],
                limit: 10
              }
              page_options.jump = function(obj, first) {
                tablePage = obj;

                //首次不执行
                if(!first) {
                  var resTwo = pageCallbackApp(obj.curr, obj.limit);
                  if(resTwo && resTwo.code == 1)
                    tableIns.reload({
                      data: resTwo.data
                    });
                  else
                    layer.msg(resTwo.msg);
                }
              }
              layui.laypage.render(page_options);
          });


          table.on('tool(tableApp)', function(objs) {
            var datas = objs.data;
            var tr = objs.tr; //获得当前行 tr 的DOM对象
            console.log(objs);
            if(objs.event === 'changetable'){
              var userId = datas.id;
              tr.attr('data-id',userId);
            }
          })
        },
        yes:function(index, layero){
              var acv = $("#apptable .layui-table").find('.layui-table-click').attr("data-id") || "";
              var userId = acv; //app用户ID
              var tUserId = data.id ||""; //运营平台用户ID
              var addUserId = yyCache.get("userId","");  //操作人ID
              var addUserName = yyCache.get('username',""); //操作人名称
              if(userId == ""){
               layer.alert("请选择列表中的用户");
               }else{
               var param = {
                 code : 'T2',
                 userId :userId,
                 tUserId:tUserId,
                 addUserId:addUserId,
                 addUserName:addUserName
               }
                if(locked) {
                  locked = false;
                  reqAjaxAsync(USER_URL.ADDAPP, JSON.stringify(param)).done(function (resq) {
                    if (resq.code == 1) {
                      layer.msg("绑定代理商成功");
                      layer.close(index);
                      $("#app").find(".layui-table").find(".layui-table-click #bindApp").hide();
                      var organi = sessionStorage.getItem('organizationId');
                      var uname = $("#username").val();
                      var phone = $("#phone").val();
                      setTimeout(function(){
                        getTable(organi, uname, phone);
                        locked = true;
                      },500);
                      /*未加入页面刷新，若稍后接口有修改，返回是否绑定的出参，方可加入刷新并制作解除绑定*/
                    } else {
                      layer.msg(resq.msg);
                      locked = true;
                    }
                  });
                }
          }
        }

      });
    }else if(obj.event === 'unbind'){
      //绑定app
      layer.open({
        title: ['绑定App用户',  'font-size:12px;background-color:rgb(66, 70, 81);color:#fff'],
        type: 1,
        content:$('#blindApp'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
        area: ['800px', '650px'],
        btn:['绑定','取消'],
        shade: [0.1, '#fff'],
        end:function(){
          $('#blindApp').hide();

        },
        success: function(layero, index){
          //绑定app用户相关
          var appobj = tableInitApp('tableApp', [
                [{
                  title: '序号',
                /*  sort: true,*/
                  align: 'left',
                  field: 'eq',
                  width: 90,
                  event: 'changetable'
                }, {
                  title: '用户名',
                 /* sort: true,*/
                  align: 'left',
                  field: 'username',
                  width: 100,
                  event: 'changetable'
                }, {
                  title: '手机号',
                /*  sort: true,*/
                  align: 'left',
                  field: 'phone',
                  width: 100,
                  event: 'changetable'
                }, {
                  title: '性别',
                /*  sort: true,*/
                  align: 'left',
                  field: 'usersex',
                  width: 100,
                  event: 'changetable'
                }, {
                  title: '是否实名',
                /*  sort: true,*/
                  align: 'left',
                  field: 'realName',
                  width: 100,
                  event: 'changetable'
                }, {
                  title: '创建时间',
                /*  sort: true,*/
                  tid:'id',
                  fixed: 'right',
                  align: 'left',
                  field: 'createtime',
                  width: 220,
                  event: 'changetable'
                }]
              ],
              pageCallback
          );

          /* 表格初始化
           * tableId:
           * cols: []
           * pageCallback: 同步调用接口方法
           */
          function tableInitApp(tableId, cols, pageCallback, test) {
            var tableIns, tablePage;
            //1.表格配置
            tableIns = table.render({
              id: tableId,
              elem: '#' + tableId,
              height:'420',
              width:'750',
              cols: cols,
              page: false,
              even: true,
              skin: 'row'
            });

            //2.第一次加载
            var res = pageCallbackApp(1, 10);
            //第一页，一页显示10条数据
            if(res) {
              if(res.code == 1) {
                tableIns.reload({
                  data: res.data
                })
              } else {
                layer.msg(res.msg)
              }
            }

            //3.left table page
            layui.use('laypage');

            var page_options = {
              elem: 'laypageLefts',
              count: res ? res.total : 0,
              layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
              limit: 10
            }
            page_options.jump = function(obj, first) {
              tablePage = obj;

              //首次不执行
              if(!first) {
                var resTwo = pageCallbackApp(obj.curr, obj.limit);
                if(resTwo && resTwo.code == 1)
                  tableIns.reload({
                    data: resTwo.data
                  });
                else
                  layer.msg(resTwo.msg);
              }
            }


            layui.laypage.render(page_options);

            return {
              tablePage,
              tableIns
            };
          }

          //左侧表格数据处理
          function getDataApp(url, parms) {

            var res = reqAjax(url, parms);

            var data = res.data;

            $.each(data, function(i, item) {
              $(item).attr('eq', (i + 1));
              if(item.isrealname == -1){
                $(item).attr('realName', '审核不通过');
              }else if(item.isrealname == 0){
                $(item).attr('realName', '未认证');
              }else if(item.isrealname == 1){
                $(item).attr('realName', '待审核');
              }else if(item.isrealname == 2){
                $(item).attr('realName', '已认证');
              }
            });

            return res;
          }

          //pageCallback回调
          function pageCallbackApp(index, limit , phone) {
            if(phone == undefined){phone = ''}
            return getDataApp(USER_URL.APPUSER , "{'page':" + index + ",'rows':" + limit + ",'phone':'" + phone + "'}");
          }

          //点击表格变色
          $('#apptable').on('click','tr',function(){
            $(this).addClass('layui-table-click').siblings().removeClass('layui-table-click');
          });

          //搜索
          $("#appSearch").click(function(){
              var phonename = $.trim($("#appname").val());
              var initPage = appobj.tablePage;
              var initTable = appobj.tableIns;
              var res = pageCallbackApp(initPage.curr, initPage.limit,phonename);
              initTable.reload({ data : res.data });
              layui.use('laypage');
              var page_options = {
                elem: 'laypageLefts',
                count: res ? res.total : 0,
                layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
                limits: [10],
                limit: 10
              }
              page_options.jump = function(obj, first) {
                tablePage = obj;

                //首次不执行
                if(!first) {
                  var resTwo = pageCallbackApp(obj.curr, obj.limit);
                  if(resTwo && resTwo.code == 1)
                    tableIns.reload({
                      data: resTwo.data
                    });
                  else
                    layer.msg(resTwo.msg);
                }
              }
              layui.laypage.render(page_options);
          });


          table.on('tool(tableApp)', function(objs) {
            var datas = objs.data;
            var tr = objs.tr; //获得当前行 tr 的DOM对象
            console.log(objs);
            if(objs.event === 'changetable'){
              var userId = datas.id;
              tr.attr('data-id',userId);
            }
          })
        },
        yes:function(index, layero){
              var acv = $("#apptable .layui-table").find('.layui-table-click').attr("data-id") || "";
              var userId = acv; //app用户ID
              var tUserId = data.id ||""; //运营平台用户ID
              var addUserId = yyCache.get("userId", "");  //操作人ID
              var addUserName = yyCache.get('username',""); //操作人名称
              if(userId == ""){
               layer.alert("请选择列表中的用户");
               }else{
               var param = {
                 code : 'T4',
                 userId :userId,
                 tUserId:tUserId,
                 addUserId:addUserId,
                 addUserName:addUserName
               }
                if(locked) {
                  locked = false;
                  reqAjaxAsync(USER_URL.ADDAPP, JSON.stringify(param)).done(function (resq) {
                    if (resq.code == 1) {
                      layer.msg(resq.msg);
                      layer.close(index);
                      $("#app").find(".layui-table").find(".layui-table-click #bindApp").hide();
                      var organi = sessionStorage.getItem('organizationId');
                      var uname = $("#username").val();
                      var phone = $("#phone").val();
                      setTimeout(function(){
                        getTable(organi, uname, phone);
                        locked = true;
                      },500);
                      /*未加入页面刷新，若稍后接口有修改，返回是否绑定的出参，方可加入刷新并制作解除绑定*/
                    } else {
                      layer.msg(resq.msg);
                      locked = true;
                    }
                  });
                }
          }
        }

      });
    }


  });

  //选中表单事件
  $('#app').on('click','tr',function(){
    $(this).addClass('layui-table-click').siblings().removeClass('layui-table-click');
  });

  //刷新
  window.onbeforeunload = function(){
    var id = sessionStorage.getItem("organizationIdone");
    sessionStorage.setItem('organizationId',id);
  }


})(jQuery)