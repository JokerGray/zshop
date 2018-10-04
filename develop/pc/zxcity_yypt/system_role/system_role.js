/* 
 * @Author: Marte
 * @Date:   2017-05-10 13:15:54
 * @Last Modified by:   Marte
 * @Last Modified time: 2017-05-19 18:09:06
 */
$(function() {
  //测试数据
  // 默认刷新第一页

  function reloadFirst(url, firstData) {
    // var dataList={
    //     rolename : '', 
    //     page:1
    //   }
    var dataList = firstData;
    var dataAll = reqAjax(url, JSON.stringify(dataList))
    var data = dataAll.data
    var layer = layui.laypage;
    var nums = 10; //每页出现的数据量

    // 模拟渲染
    var render = function(data, curr) {
      var arr = []
        // ,thisData = data.concat().splice(curr*nums-nums, nums);
        ,
        thisData = data;
      layui.each(thisData, function(index, item) {
        arr.push('<li>' + item + '</li>');
      });
      return arr.join('');
    };

    //调用分页
    layer({
      cont: 'paging-box',
      first: false,
      last: false,
      prev: '<' //若不显示，设置false即可
        ,
      next: '>',
      total: dataAll.total,
      pages: Math.ceil(dataAll.total / nums) //得到总页数
        ,
      curr: function() { //通过url获取当前页，也可以同上（pages）方式获取
        var page = location.search.match(/page=(\d+)/);
        return page ? page[1] : 1;
      }(),
      jump: function(obj, first) {
        var dataList = {
          rolename: '',
          page: obj.curr,
          rows: 10,
        }
        var dataAll = reqAjax(url, JSON.stringify(dataList))
        var data = dataAll.data;
        // console.log(data)
        var user;
        for (var i = 0; i < data.length; i++) {
          // console.log(data[i].id)
          data[i].isAvailable = data[i].isAvailable == "1" ? "可用" : "不可用";
          user += `<tr class="row">
                    <td style="display:none;" role-id=` + data[i].id + `>` + data[i].id + `</td>
                    <td  userId=` + (i + 1) + `>` + (i + 1) + `</td>
                    <td  user-name=` + data[i].name + `>` + data[i].name + `</td>
                    <td  user-isAble=` + data[i].isAvailable + `>` + data[i].isAvailable + `</td>
                    <td style="display:none;" user-note=` + data[i].note + `>` + data[i].note + `</td>
                    <td style="display:none;" user-sort=` + data[i].sort + ` ></td>
                    <td style="display:none;" user-typeCode=` + data[i].typeCode + ` ></td>
                    <td class="row remove-modifier ">
                    <div class="editRole" data-toggle="modal" data-target="#add-newuser">
                    <i class="edicticon"></i>
                    修改
                    </div>
                    <div class="deleteRole">
                    <i class="glyphicon glyphicon-minus-sign m5 red"></i>
                    删除
                    </div>
                    <div>
                    <button type="button"  class="btn resetBtn" data-toggle="modal" data-target="#add-newuser">角色用户</button>
                    </div>
                    </td>
                    </tr>`
        }
        // console.log(data_user)
        $("#tbodyRole").html(user)
        document.getElementById('paging-box-count').innerHTML = render(data, obj.curr);
        $('#paging-box-count').html('共' + obj.pages + '页，每页' + nums + '条，总数' + obj.total + '条');
        if (!first) { //一定要加此判断，否则初始时会无限刷新
          location.href = '?page=' + obj.curr;
        }
      }
    });
  }
  var dataList = {
    rolename: '',
    page: 1
  }
  reloadFirst("operations/roleList", dataList)

  // ===========
  // 角色授权
  var userAllow = `<div class="modal-dialog">
        <div class="modal-content">
        <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×
        </button>
        <h4 class="modal-title" id="myModalLabel">
        角色用户
        </h4>
        </div>
        <div class="modal-body">
        <table class="table table-bordered table-hover">
        <thead>
        <tr class="active">
        <th>账号</th>
        <th>姓名</th>
        <th>授权</th>
        </tr>
        </thead>
        <tbody id="roleControl">
        </tbody>
        </table>
        </div>
        <div class="modal-footer">
        <div class="clearfix pag-tot">
        <div id="paging-box-allow">
        共有<i>19</i>页，每页<i>9</i>条
        </div>
        <div id="paging-box-user" ></div>
        </div>
        </div>
        </div>
        </div>`

  //newUser 新增用户
  var newUser = `<div class="modal-dialog">
        <div class="modal-content">
        <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×
        </button>
        <h4 class="modal-title" id="myModalLabel">
        新增角色
        </h4>
        </div>
        <div class="modal-body">
        <div class="col-lg-12" id="newUser">
        <div class="input-group">
        <span class="input-group-addon" id="sizing-addon1">&nbsp;&nbsp;&nbsp;角色名：&nbsp;&nbsp;&nbsp;</span>
        <input type="text" class="form-control" style="width:700px" placeholder="">
        </div>
        <div class="input-group" style="display:none;" >
        <span class="input-group-addon" id="sizing-addon2">备注：&nbsp;&nbsp;</span>
        <input type="text" class="form-control" style="width:500px;height:34px;">
        </div>
        <div class="input-group" style="display:none;">
        <span class="input-group-addon" id="sizing-addon2">排序：&nbsp;&nbsp;&nbsp;</span>
        <input type="select" class="form-control" style="width:500px;height:34px;">
        </div>
        <div class="input-group">
        <span class="input-group-addon" id="sizing-addon2">是否可用：&nbsp;&nbsp;&nbsp;</span>
        <select style="width:500px;height:34px;" id="selectID">
        <option value="1">可用</option>
        <option value="0">不可用</option>
        </select>
        </div>
        <div class="input-group"></div>
        <div>
        <span style="float:left;margin-top:5px;">角色权限:&nbsp;&nbsp;&nbsp;</span>
        <ul id="treeDemo" class="ztree"></ul>
        </div>
        </div>
        </div>
        <div class="modal-footer">
        <div class="clearfix pag-tot" >
        <button type="button" class="btn btn-primary close-btn" id="saveNew" data-dismiss="modal" aria-hidden="true">保存</button> 
        </div>
        </div>
        </div>
        </div>`

  // 操作 修改
  var editRole = `<div class="modal-dialog">
        <div class="modal-content">
        <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×
        </button>
        <h4 class="modal-title" id="myModalLabel">
        修改角色
        </h4>
        </div>
        <div class="modal-body" id ="editRole">
        <div class="col-lg-12">
        <div class="input-group" >
        <span class="input-group-addon" id="sizing-addon1">角色名：&nbsp;&nbsp;&nbsp;</span>
        <input type="text" class="form-control" style="width:500px;height:34px;">
        </div>
        <div class="input-group" style="display:none;">
        <span class="input-group-addon" id="sizing-addon2">备注：&nbsp;&nbsp;&nbsp;</span>
        <input type="text" class="form-control" style="width:500px;height:34px;">
        </div>
        <div class="input-group">
        <span class="input-group-addon" id="sizing-addon2">是否可用：&nbsp;&nbsp;&nbsp;</span>
        <select style="width:500px;height:34px;" id="selectEdit">
        <option value="1">可用</option>
        <option value="0">不可用</option>
        </select>
        </div>
        <div class="input-group" style="display:none;">
        <span class="input-group-addon" id="sizing-addon3">排序：&nbsp;&nbsp;&nbsp;</span>
        <input type="text" class="form-control" style="width:500px;height:34px;">
        </div>
        <div class="input-group">
        </div>
        <div>
        <span style="float:left;margin-top:5px;">角色权限:&nbsp;&nbsp;&nbsp;</span>
        <ul id="treeDemo" class="ztree"></ul>
        </div>


        </div>
        </div>
        <div class="modal-footer">
        <div class="clearfix pag-tot" >
        <button class="btn btn-primary close-btn" id="edit-role" data-dismiss="modal" aria-hidden="true">保存</button> 
        </div>
        </div>
        </div>
        </div>`

  // 页面角色授权按钮
  $("#tbodyRole button").on("click", function() {
    var roleId = $(this).parent().parent().siblings().eq(0).attr("role-id")
    var roleList = {
        roleId: roleId,
        page: 1,
        rows: 10
      }
      // console.log(roleId) 
      // 获得当前角色的id值
    $("#add-newuser").html(userAllow);
    var dataAll = reqAjax("operations/roleUserList", JSON.stringify(roleList));
    // console.log(dataAll)
    var data = dataAll.data,
      nums = 10;
    var pages = Math.ceil(dataAll.total / nums)
    $("#paging-box-allow i").eq(0).html(pages).end().eq(1).html(nums)
    var jump = "";
    for (var i = 0; i < pages; i++) {
      jump += `
              <span style="
              ">` + (i + 1) + `</span>`
    }
    $("#paging-box-user").html(jump)
      // console.log(data)
    var user, i = 0,
      len = data.length;
    for (; i < len; i++) {
      user += `<tr>
              <td >` + data[i].userAccount + `</td>
              <td >` + data[i].userName + `</td>
              <td class="remove-modifier">
              <button type="button" user-id=` + data[i].userId + ` style="width:100px;" class="btn btn-danger userAble">
              <span class="cancelUser">
              <i class="glyphicon glyphicon-alert"></i> <span>确定取消授权吗？</span> 
              &nbsp;&nbsp;&nbsp;<span class="yes" style="width:30px;display:inline-block;">是</span>
              &nbsp;&nbsp;&nbsp;<span class="no" style="width:30px;display:inline-block;">否</span>
              </span>
              <span>取消授权</span>
              </button>
              </td>
              </tr>
              `
    }

    $("#roleControl").html(user);
    $("#paging-box-user span").eq(0).addClass("visited")
    $("#paging-box-user").on("click", "span", function() {
        $(this).siblings().removeClass("visited")
        $(this).addClass("visited")
          // console.log($(this).html())
        var pages = $(this).html();
        // console.log(roleId)
        var roleList = {
          roleId: roleId,
          page: pages,
          rows: 10
        }
        var dataAll = reqAjax("operations/roleUserList", JSON.stringify(roleList));
        data = dataAll.data;
        var user, i = 0,
          len = data.length;
        for (; i < len; i++) {
          user += `<tr>
                <td >` + data[i].userAccount + `</td>
                <td >` + data[i].userName + `</td>
                <td class="remove-modifier">
                <button type="button" user-id=` + data[i].userId + ` style="width:100px;" class="btn btn-danger userAble">
                <span class="cancelUser">
                <i class="glyphicon glyphicon-alert"></i> <span>确定取消授权吗？</span> 
                &nbsp;&nbsp;&nbsp;<span class="yes" style="width:30px;display:inline-block;">是</span>
                &nbsp;&nbsp;&nbsp;<span class="no" style="width:30px;display:inline-block;">否</span>
                </span>
                <span>取消授权</span>
                </button>
                </td>
                </tr>
                `
        }
        $("#roleControl").html(user);
        // roleControl();
      })
      //内部点击取消授权事件 
    function roleControl() {
      $("#roleControl ").on("click", "button", function() {
        // console.log($(this).attr("user-id"))
        // 1 当弹出框none 时 ，并且当前text 为取消授权时 
        var $this = $(this)
        var flag = $(this).children().eq(0).css("display"),
          cText = $(this).children().eq(1).text();
        if (flag == "none") {
          // console.log("1")
          $(this)
            .css({
              "color": "#c9302c",
              "background-color": "#fff",
              "border-color": "#ac2925",
              "position": "relative",
              "transition": "all .2s ease"
            })
            .children().eq(0)
            .css({
              "display": "block",
              // "transition":"all .1s ease"
            })
            // console.log($this.children(0).children().eq(2))
            // console.log($this.children(0).children().eq(3))
          $this.children(0).children().eq(2).on("click", function(e) {
              if ($this.attr("disabled") == "disabled") {
                return false
              }
              // console.log("2")
              e.stopPropagation();
              // console.log($(this)[0])
              $(this).parent().css({
                  "display": "none",
                  // "transition":"all .2s ease"
                }).siblings().text("已取消授权")
                // ajax 请求数据 取消授权
              var userId = $(this).parent().parent().attr("user-id")
                // console.log($(this).parent().parent().attr("user-id"))
                // console.log(userId)   
              var data = {
                userId: userId
              }
              var userMes = reqAjax("operations/roleUserUnbind", JSON.stringify(data))
                // console.log(data)
                // console.log(userMes)
              $this.attr("disabled", true)
            })
            // no时
          $this.children(0).children().eq(3).on("click", function(e) {
            if ($this.attr("disabled") == "disabled") {
              return false
            }
            // console.log("3")
            e.stopPropagation();
            // console.log("no")
            $this.css({
              "color": "#fff",
              "background-color": "#c9302c",
              "border-color": "#ac2925",
              "transition": "all .3s ease"
            }).children().eq(0).css({
              "display": "none",
              "transition": "all .2s ease"
            }).siblings().text("取消授权")
          })
        }
      })
    }

    roleControl()
  })

  // 创建/新增用户
  $("#newRole").on("click", function() {
    // 打开新增角色模态框    
    $("#add-newuser").html(newUser)

    // 树状图
    var setting = {
      check: {
        enable: true
      },
      data: {
        simpleData: {
          enable: true
        }
      }
    };
    // ======
    var data = {

    }
    var tree = reqAjax("operations/resourceTree", JSON.stringify(data))
      // console.log(data)
    var treeNodes = [],
      i, len = tree.data.length;
    for (i = 0; i < len; i++) {
      treeNodes.push(tree.data[i])
    }
    console.log(treeNodes)
    var treeObj = $.fn.zTree.init($("#treeDemo"), setting, treeNodes);
    $("#saveNew").on("click", function() {

      var name = $("#newUser input").eq(0).val();
      var note = $("#newUser input").eq(1).val();
      var sort = $("#newUser input").eq(2).val();
      var isAble = $("#selectID").val();
      // console.log( isAble);

      //获取选中树形id
      var nodes = treeObj.getCheckedNodes(tree);
      // console.log(nodes)
      var resourceTree = [];
      $.each(nodes, function(i, item) {
        // console.log(item.children)
        // if(item.checked && !item.children.length){
        //     console.log(item);
        //     resourceTree.push(item.id);
        // }
        resourceTree.push(item.id)
      });
      // console.log(resourceTree)
      resourceTree = resourceTree.join(",");
      console.log(resourceTree)
      var data = {
        name: name,
        note: note,
        sort: sort,
        isAvailable: isAble,
        resourceIds: resourceTree
      }
      if (!name) {
        layer.msg("请输入角色名")
        return false
      } else if(name>=8){
      	layer.msg("角色名输入过长")
        return false
      }else if(!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(name)){
      	layer.msg("角色名不能有特殊字符")
        return false
      }else if(/(^\_)|(\__)|(\_+$)/.test(name)){
      	layer.msg("角色名首尾不能出现下划线")
        return false
      }else if (!resourceTree) {
        layer.msg("请选择权限")
        return false
      }
      // console.log(data)
      var data_user = reqAjax("operations/addRole", JSON.stringify(data))
        // console.log(data_user)
           window.location.reload();
        //后台数据更新 页面也要更新
    })
  })

  // 修改用户
  $("#tbodyRole ").on("click", ".editRole", function() {
    var $this = $(this).parent().siblings();
    // console.log($this)
    var roleId = $this.eq(0).attr("role-id"),
      // userId   =$this.eq(1).attr("userId"),
      userAble = $this.eq(3).attr("user-isAble"),
      userName = $this.eq(2).attr("user-name"),
      userNote = $this.eq(4).attr("user-note"),
      userSort = $this.eq(5).attr("user-sort");
    var data = {
        roleId: roleId
      }
      // console.log(data)

    // console.log(msg.data)
    $("#add-newuser").html(editRole)
    var $input = $("#editRole input")
    $input.eq(0).val(userName)
    $input.eq(1).val(userNote)
    $input.eq(2).val(userSort)
      // console.log(roleId)
    userAble = userAble == "可用" ? "1" : "0";
    $("#selectEdit").val(userAble)
      // 获取属性节点的 数据
    var itemId = [];
    var msg = reqAjax("operations/resourceTree", JSON.stringify(data))
      // console.log(msg.data)
      // msg=msg.data
      // 对象递归 拿到获取的id   s : 对象， v:传入数组
    function getId(s, v) {
      if (s instanceof Object) {
        s.forEach(function(item, i) {
          if (item.checked && item.children) {
            v.push(item.id)
            getId(item.children, v)
          } else if (item.checked && !item.children) {
            v.push(item.id)
          }
        })
      }
    }
    getId(msg.data, itemId)
      /* msg.data.forEach(function(item, i) {
         // console.log(item.id+"===checked=="+item.checked)
         // console.log(item)
         // console.log(item.checked)
         // 权限是单一没有子集的   
         // console.log(item)
         // 对象递归    s : 对象， v:传入数组
         // function f(s, v) {
         //   if (s instanceof Object) {
         //     s.forEach(function(item, i) {
         //       if (item.checked && item.children) {
         //         v.push(item.id)
         //         f(item.children, v)
         //       } else if (item.checked && !item.children) {
         //         v.push(item.id)
         //       }
         //     })
         //   }
         // }
         var child = item.children;
         // console.log(item)
         if (item.checked && child) {
           // console.log(item.id)
           // console.log(nodeID)
           itemId.push((item.id));
           // console.log(itemId)
           child.forEach(function(every, k) {
             // console.log(every)
             if (every.checked) {
               itemId.push(every.id)
             }
           })
         } else if (item.checked && !child) {
           itemId.push((item.id))
         }
         // console.log(itemId)

       })*/

    console.log(itemId)
    itemId = itemId.join(",")

    console.log(itemId)
      // console.log(itemId)
      // 权限树渲染
    var setting = {
      check: {
        enable: true
      },
      data: {
        simpleData: {
          enable: true
        }
      }
    };
    var tree = reqAjax("operations/resourceTree", JSON.stringify({}))
      // console.log(tree)
    var treeNodes = [],
      len = tree.data.length;
    console.log(tree.data instanceof Array)
      /* 渲染拿到的 id
       * 
       */

  /*  function setID(tree, nodes, Id) {
      if (tree instanceof Array) {
        var tree.numCheck = 0
        tree.forEach(function(item, i) {
          if (Id.indexOf(item.id) != -1) {
            item.checked = true
            tree.numCheck++;
            if (tree.numCheck == tree.length) {
              tree.checked = true
            } else {
              tree.halfCheck = true;
              tree.checked = true;
            }
            setID(item,nodes,id)
          } else if (Id.indexOf(item.id) == -1) {

          }
          nodes.push(item)
        })
      }
    }
    setID(tree.data,treeNodes,itemId)*/
    for (var i = 0; i < len; i++) {
      // console.log(tree.data[i].children)
      var child = tree.data[i].children
        // console.log(tree.data[i])
      if (itemId.indexOf(tree.data[i].id) != -1) {
        tree.data[i].checked = true;
        // 找的到 ID 并且有子元素
        // console.log(child.length)
        if (child) {
          // alert(1)
          var m = 0;
          child.forEach(function(item, k) {
            if (itemId.indexOf(item.id) != -1) {
              item.checked = true;
              m++;
              if(item.children){
                var n =0;
               item.children.forEach(function(value,x){
                if(itemId.indexOf(value.id) != -1){
                  value.checked =true;
                  n++;
                }
                if(n == item.children.length){
                  child.checked=true
                } else{
                  child.halfCheck = true;
                  child.checked = true;
                }
               })
              }
            }
            // if(m!=child.length){
            //   tree.data[i].halfCheck=true;
            // }else{
            //   tree.data[i].checked=true;  
            // }
            if (m == child.length) {

              tree.data[i].checked = true;
            } else {
              tree.data[i].halfCheck = true;
              tree.data[i].checked = true;
            }
          })
        }
        // else {
        //   alert(2)
        //   console.log(tree.data[i])
        //   tree.data[i].checked=true;
        // }
        // console.log(treeNodes)
      } else if (itemId.indexOf(tree.data[i].id) == -1) {}
      treeNodes.push(tree.data[i])

    }
    // console.log(treeNodes)
    var treeObj = $.fn.zTree.init($("#treeDemo"), setting, treeNodes);
    //====================
    // 修改后保存
    $("#edit-role").on("click", function() {
      // userId= $input.eq(0).val();
      userName = $input.eq(0).val();
      userNote = $input.eq(1).val();
      userSort = $input.eq(2).val();
      userAble = $("#selectEdit").val();
      // 拿到权限
      var nodes = treeObj.getCheckedNodes(true);

      //  console.log(nodes);
      // var itemId = [],idTree=[];
      // $.each(nodes, function(i, item){
      //  console.log(item)
      //     if(item.checked && !item.children.length){
      //         idTree.push(item.id);
      //      }
      //      if(item.halfCheck&&item.children.length){
      //        idTree.push(item.id)
      //      }
      // });

      //idTreei=dTree.join(",");
      //console.log(idTree)
      // console.log(userAble)


      var itemId = [],
        idTree = [];
      var sNodes = treeObj.getCheckedNodes(true);
      // console.log(sNodes);
      $.each(sNodes, function(i, item) {
        idTree.push(item.id);
      });

      idTree = idTree.join(",");
      // alert(userName)
      if (!userName) {
        layer.msg("角色名不能为空")
        return false
      } else if (!idTree) {
        layer.msg("权限不能为空")
        return false
      }

      var dataEdit = {
          roleId: roleId,
          name: userName,
          note: userNote,
          sort: userSort,
          isAvailable: userAble,
          resourceIds: idTree
        }
        // console.log(idTree)
        // 发送数据请求修改数据库
        // console.log(dataEdit)
      dataEdit = JSON.stringify(dataEdit)
      reqAjax("operations/roleUpdate", dataEdit)
      window.location.reload();
      //后台数据更新 页面也要更新
    })
  })

  // 删除用户
  $("#tbodyRole ").on("click", ".deleteRole", function() {
    var $this = $(this).parent().siblings();
    // console.log($this.eq(0)[0])
    var roleId = $this.eq(0).attr("role-id");
    var data = {
        roleId: roleId
      }
      // 将userId 发送数据请求数据库 删除该条用户
      // console.log(roleId)
      // 弹出框

    layer.confirm(
        "确认删除?", { icon: 3, title: '提示' },
        function(index, layero) {
          reqAjax("operations/removeRole", JSON.stringify(data))
          $this.parent().remove()
          if (!$("#tbodyRole").html()) {
            window.location.href = location.href.split("?")[0]
          } else {
            // location.reload(true)
          }
          // location.reload(true)
          layer.close(index);

        })
      // }, function(index, layero){

    // }, function(index){

    // });



    // layer.confirm(
    //       "确认删除?",
    //        {icon: 3, title:'提示'},

    //        function(){
    //               reqAjax("operations/removeRole",JSON.stringify(data))
    //               $this.parent().remove()
    //               if(!$("#tbodyRole").html()){
    //                     window.location.href=location.href.split("?")[0]
    //                 }else{
    //                   // location.reload(true)
    //                 }
    //               // location.reload(true)
    //               layer.close();
    //           })

  })



  // 查询用户
  $("#searchRole").on("click", function() {
    searchRole()
  })

  function searchRole() {
    var name = $("#searchRolename").val()
    var dataSearch = {
      rolename: name
    }
    if (name == '') {
      layer.msg('请输入查询角色名')
      return false
    }
    var o = reqAjax("operations/roleList", JSON.stringify(dataSearch))
    var data = o.data;
    // console.log(o)
    if (!data.length) {
      layer.msg('查询不到该角色')
      return false
    }
    // console.log(page)
    var user;
    for (var i = 0; i < data.length; i++) {
      data[i].isAvailable = data[i].isAvailable == "1" ? "可用" : "不可用";
      user += `<tr class="row">
            <td style="display:none;" role-id=` + data[i].id + `>` + data[i].id + `</td>
            <td  userId=` + (i + 1) + `>` + (i + 1) + `</td>
            <td  user-name=` + data[i].name + `>` + data[i].name + `</td>
            <td  user-isAble=` + data[i].isAvailable + `>` + data[i].isAvailable + `</td>
            <td style="display:none;" user-note=` + data[i].note + `>` + data[i].note + `</td>
            <td style="display:none;" user-sort=` + data[i].sort + ` ></td>
            <td style="display:none;" user-typeCode=` + data[i].typeCode + ` ></td>
            <td class="row remove-modifier ">
            <div class="editRole" data-toggle="modal" data-target="#add-newuser">
            <i class="edicticon"></i>
            修改
            </div>
            <div class=" deleteRole">
            <i class="glyphicon glyphicon-minus-sign m5 red"></i>
            删除
            </div>
            <div>
            <button type="button"  class="btn resetBtn" data-toggle="modal" data-target="#add-newuser">角色用户</button>
            </div>
            </td>
            </tr>`
    }
    $("#tbodyRole").html(user)
      // 页脚
    var nums = 10;
    var page = Math.ceil(o.total / nums)
    $("#paging-box").css({
      "display": "none"
    })
    var count = "共" + page + "页, 每页" + nums + "条,总数" + o.total + "条";
    $("#paging-box-count").html(count)
  }
  // 绑定enter
  $("#searchRolename").bind('keypress', function(event) {
    if (event.keyCode == "13") {
      searchRole()
    }
  })
})
