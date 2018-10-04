(function ($) {
  var RESULT_URL={
    getAssetHomesList:"shopLife/getAssetHomesList",//获取楼栋号列表接口
    addAssetHomes:"shopLife/addAssetHomes",//添加楼栋号接口
    getOneAssetHomes:" shopLife/getOneAssetHomes",//获取单个楼栋号接口
    updateAssetHomes:"  shopLife/updateAssetHomes",// 修改楼栋号接口
    delAssetHomes:"shopLife/delAssetHomes",//删除楼栋号接口
    getAssetUnitList:" shopLife/getAssetUnitList",//获取单元号列表接口
    addAssetUnit:" shopLife/addAssetUnit",//添加单元号接口
    getOneAssetUnit:"shopLife/getOneAssetUnit",//获取单个单元号接口
    updateAssetUnit:" shopLife/updateAssetUnit",//修改单元号接口
    delAssetUnit:"shopLife/delAssetUnit",//删除单元号接口
    addAssetRoom:" shopLife/addAssetRoom",//添加门牌号接口
    addAssetRoomOwner:"shopLife/addAssetRoomOwner",//门牌号绑定业主接口
    delAssetRoomOwner:" shopLife/delAssetRoomOwner",//门牌号解绑接口
    updateAssetRoom:" shopLife/updateAssetRoom",//修改门牌号接口
    getOneAssetRoom:"shopLife/getOneAssetRoom",//获取单个门牌号接口
    delAssetRoom:" shopLife/delAssetRoom",//删除门牌号接口
    getAssetRoomList:" shopLife/getAssetRoomList",//门牌列表接口
    addAssetCar:"  shopLife/addAssetCar",//添加车辆接口
    updateAssetCar:" shopLife/updateAssetCar",// /修改车辆接口
    delAssetCar:" shopLife/delAssetCar",//删除车辆接口
    getAssetCarList:"  shopLife/getAssetCarList",//车辆列表接口
    getOneAssetCar:"shopLife/getOneAssetCar"//获取单个车辆接口
  }
  var page = 1;
  var pageSize = 6;
  var shopId =getUrlParams("shopId");
  // var shopId =getUrlParams("shopId")|| 49;
  var merchantId=getUrlParams("merchantId");
  // var merchantId=getUrlParams("merchantId")||1070;
  var userId = getUrlParams("userId");
  var table = layui.table;
  var layer=layui.layer;
  var cPattern = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/;//车牌正则
  var mpPattern = /^[1][3,4,5,7,8][0-9]{9}$/;//手机正则

  //房屋表头
  var houseThead=[[ //标题栏
    {type:'numbers', title: '编号', width: 70}
    ,{field: 'homeName', title: '楼栋号', width: 150}
    ,{field: 'unitName', title: '单元号', width:150}
    ,{field: 'doorNum', title: '门牌号', width:150}
    ,{field: 'hadOwner', title: '是否绑定', width:100,templet: '#sexTpl'}
    ,{field: 'ownerName', title: '业主', width:250}
    ,{field: 'ownerPhone', title: '电话', width:150}
    ,{field:'operation', title: '操作', width:120,templet: '#checkboxTpl'}
  ]];

  //车辆表头
  var carThead=[[ //标题栏
    {type:'numbers', title: '编号', width: 70}
    ,{field: 'code', title: '车牌号', width: 150}
    ,{field: 'ownerName', title: '车主姓名', width:250}
    ,{field: 'model', title: '车型', width:250}
    ,{field: 'ownerPhone', title: '手机号', width:150}
    ,{field:'operation', title: '操作', width:130,templet: '#checkboxTpl'}
  ]];

  layer.config({
    extend: 'myskin/style.css'
  });
  layui.use('form', function () {
    form = layui.form;
  })

  $(function () {
    initial()
  })

//初始化
  function initial() {
    initialTabel("test", houseThead,RESULT_URL.getAssetRoomList,page,pageSize);
    $(".building").click();
    $("#test").show();
    $(".house form")[0].reset();
    $(".car form")[0].reset();
  }


  //tab切换
  //楼栋
$(".building").click(function () {
  $(this).addClass("active").siblings().removeClass("active")
  $(".house").show();
  $(".addBtn").show();
  $(".car").hide();
  $(".house form")[0].reset();
  initialTabel("test", houseThead,RESULT_URL.getAssetRoomList,page,pageSize);
})
  //车辆
  $(".vehicle").click(function () {
    $(this).addClass("active").siblings().removeClass("active")
    $(".house").hide();
    $(".addBtn").hide();
    $(".car").show();
    $(".car form")[0].reset();
    initialTabel("carTable",carThead,RESULT_URL.getAssetCarList,page,pageSize);
  })


  function initialTabel(id,cols,url,page,pageSize,unitName,doorNum,homesName,
                        name,model,code,phone) {
    var tableIns, tablePage;
    //1.表格配置
    tableIns = table.render({
      id: id,
      elem: '#' + id,
      cols: cols,
      page: false,
      // even: true,
      skin: 'line' //表格风格
    });
    var res=pageCallback(url,page,pageSize,unitName,doorNum,homesName,
      name,model,code,phone)

    //第一页，一页显示15条数据
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
      groups: '4',
      limit: pageSize,//每页条数
      limits: [5, 6, 7]
    }
    page_options.jump = function(obj, first) {
      tablePage = obj;

      //首次不执行
      if(!first) {
        var resTwo = pageCallback(url,obj.curr, obj.limit,unitName,doorNum,homesName,
          name,model,code,phone);
        if(resTwo && resTwo.code == 1)
          tableIns.reload({
            data: resTwo.data
          });
        else
          layer.msg(resTwo.msg);
      }
    }
    layui.laypage.render(page_options);
  }

  function pageCallback(url,page,pageSize,unitName,doorNum,homesName,
                        name,model,code,phone) {
    var param={
      merchantId: merchantId,
      shopId: shopId,
      pageNo: page,
      pageSize: pageSize,
      unitName: unitName,
      doorNum: doorNum,
      homesName: homesName,
      ownerName:name,
      model: model,
      code: code,
      ownerPhone: phone
    }
    var res= reqAjax(url,JSON.stringify(param));
    if(res.code==1){
      return res;
    }
  }

  //搜索房屋号
  $(".house .searchHouseBtn").click(function () {
    var ipt=$(".house .houseFORM input")
    var houseNumber=$.trim(ipt.eq(0).val());
    var  unitName=$.trim(ipt.eq(1).val());
    var  doorName=$.trim(ipt.eq(2).val());
    initialTabel("test",houseThead,RESULT_URL.getAssetRoomList,page,pageSize,unitName,doorName,houseNumber)
  })

  //搜索车辆
  $(".car .searchCarBtn").click(function () {
    var ipt=$(".car .carForm input")
    var code=$.trim(ipt.eq(0).val());
    var  name=$.trim(ipt.eq(1).val());
    var  phone=$.trim(ipt.eq(2).val());
    var model=$.trim(ipt.eq(3).val());
    initialTabel("carTable",carThead,RESULT_URL.getAssetCarList,page,pageSize,"","","",name,model,code,phone)
  })

  //监听房屋表格工具条
  table.on('tool(tableHouse)', function(obj){
    var data = obj.data;
    var id=data.id;
    var layEvent = obj.event;
    //是否绑定
    var hadOwner=data.hadOwner;
    //编辑
    if(layEvent=="to_edit"){
      if(hadOwner==1){
        return layer.msg("请先解绑业主，再修改!")
      }else{
        layer.open({
          type: 1,
          title: ['修改资产信息', 'height:50px;line-height: 50px;font-size:20px;text-align: center;background-color:#353b53;color:#1ae0d5;padding-left:80px'],
          skin: 'layer-ext-myskin',
          content: $('#assert'),
          area:  ['500px',' 350px'],
          btn: ['确定'],
          btnAlign: 'c',
          closeBtn: 1,
          scrollbar: false,
          resize: false,
          move: false,
          end: function () {
            $('#assert').hide();
            $('#assert form')[0].reset();
            $("#assert .unitOption").html('');
            $('#assert .unitOption option:selected').attr("selected",false)
            form.render('select');
          },
          success:function () {
            //渲染select
            selectHouse();
            form.render('select');
            var param={
              id:id
            }
            reqAjaxAsync(RESULT_URL.getOneAssetRoom,JSON.stringify(param))
              .done(function (res) {
                if(res.code==1){
                  var data=res.data;
                  var homeId=data.homeId;
                  var unitId=data.unitId;
                  var doorNum=data.doorNum;
                  $('#assert .homeOption option[value="'+homeId+'"]').attr("selected",true);

                  var param={
                    shopId:shopId,
                    homeId:homeId
                  }
                  reqAjaxAsync(RESULT_URL.getAssetUnitList,JSON.stringify(param))
                    .done(function (res) {
                      if (res.code == 1) {

                        var data = res.data;
                        var html='<option value=""></option>'
                        $.each(data,function (i,v) {

                          html+=' <option  value="'+v.id+'">'+v.unitName+'</option>'

                        })
                        $("#assert .unitOption").html(html);
                        $('#assert .unitOption option[value="'+unitId+'"]').attr("selected",true)
                        form.render('select');
                      }
                    })

                  $("#assert .doorNember").val(doorNum);
                }
              })
          },
          yes:function (index, layero) {
            AddAsset(RESULT_URL.updateAssetRoom,index,id)
          }
        })
      }
      //删除
    }else if(layEvent=="to_del"){
      layer.confirm(
        "确认删除?",
        {icon: 3, title:'提示'},
        function(index){
          var paramDel = {
            id:id
          };
          reqAjaxAsync(RESULT_URL.delAssetRoom,JSON.stringify(paramDel))
            .done(function(res){
              layer.close(index);
              if (res.code == 1) {
                layer.msg("删除成功");
                initial();
              } else {
                layer.msg(res.msg);
              }
            });
        })
      //绑定业主
    }else if(layEvent=="to_bind"){
      layer.open({
        type: 1,
        title: ['绑定业主', 'height:50px;line-height: 50px;font-size:20px;text-align: center;background-color:#353b53;color:#1ae0d5;padding-left:80px'],
        skin: 'layer-ext-myskin',
        content: $('#owner'),
        area: '350px',
        btn: ['确定'],
        btnAlign: 'c',
        closeBtn: 1,
        scrollbar: false,
        resize: false,
        move: false,
        end: function () {
          $('#owner').hide();
          $('#owner form')[0].reset();
        },
        yes:function (index,layero) {
          //判断必填项
          for (var i = 0; i < $('#owner input').length; i++) {
            if (!$('#owner input').eq(i).val())
            {return showTips($('#owner input').eq(i));}
          }
        var m=$("#owner .ownerPhone").val();
            if(!mpPattern.test(m)){
              return layer.msg("请输入有效的手机号码",{zIndex:1989110144})
            }
            var param={
              id:id,
              merchantId:merchantId,
              userId:userId,
              shopId:shopId,
              ownerName:$("#owner .ownerName").val(),
              ownerPhone:$("#owner .ownerPhone").val(),
              operatorId:userId,
        }
            reqAjaxAsync(RESULT_URL.addAssetRoomOwner,JSON.stringify(param))
              .done(function (res) {
                layer.close(index)
                layer.msg(res.msg);
                if(res.code==1){
                  initial()
                }
              })
        }
      })
      //解绑
    }else if(layEvent=="to_unbind"){
      layer.confirm(
        "确认解绑?",
        {icon: 3, title:'提示'},
        function(index){
          var paramDel = {
            id:id
          };
          reqAjaxAsync(RESULT_URL.delAssetRoomOwner,JSON.stringify(paramDel))
            .done(function(res){
              layer.close(index);
              if (res.code == 1) {
                layer.msg("解绑成功");
                initial();
              } else {
                layer.msg(res.msg);
              }
            });
        })

    }
  })

  //监听车辆表格工具条
  table.on('tool(tableCar)', function(obj){
    var data = obj.data;
    var id=data.id;
    var layEvent = obj.event;
    //编辑
    if(layEvent=="to_edit"){
      layer.open({
        type: 1,
        title: ['修改车辆信息', 'height:50px;line-height: 50px;background-color:#353b53;font-size:20px;text-align: center;background-color:#353b53;color:#1ae0d5;padding-left:80px'],
        skin: 'layer-ext-myskin',
        content: $('#addvehical'),
        area: '350px',
        btn: ['确定'],
        btnAlign: 'c',
        closeBtn: 1,
        scrollbar: false,
        resize: false,
        move: false,
        end: function () {
          $('#addvehical').hide();
          $('#addvehical form')[0].reset();
        },
        success:function () {
          var param={
            id:id
          }
          reqAjaxAsync(RESULT_URL.getOneAssetCar,JSON.stringify(param))
            .done(function (res) {

            if(res.code==1){

              var data=res.data;
              $("#addvehical .addCarNumber").val(data.code);
              $("#addvehical .addOwner").val(data.ownerName);
              $("#addvehical .ownerPhone").val(data.ownerPhone);
              $("#addvehical .carType").val(data.model);


            }
          })

        },
        yes:function (index, layero) {
          editAddCar(id,RESULT_URL.updateAssetCar,index)
        }
      })
      //删除
    }else if(layEvent=="to_del"){
      layer.confirm(
        "确认删除?",
        {icon: 3, title:'提示'},
        function(index){
          var paramDel = {
            id:id
          };
          reqAjaxAsync(RESULT_URL.delAssetCar,JSON.stringify(paramDel))
            .done(function(res){
              layer.close(index);
              if (res.code == 1) {
                layer.msg("删除成功");

                $(".vehicle").click();

              } else {
                layer.msg(res.msg);
              }
            });
        })
    }

  })

  //录入楼栋and单元号
  $(".addHouse").click(function () {
    layer.open({
      type: 1,
      title: ['楼栋/单元号录入', 'height:50px;line-height: 50px;font-size:20px;text-align: center;background-color:#353b53;color:#1ae0d5;padding-left:80px'],
      skin: 'layer-ext-myskin',
      content: $('#addBuilding'),
      area: '950px',
      btn: ['关闭'],
      btnAlign: 'c',
      closeBtn: 1,
      scrollbar: false,
      resize: false,
      move: false,
      end: function () {
        $('#addBuilding').hide();
      },
      success:function () {
        //获取楼栋号
        getHouse();


      },
      yes:function (index,layero) {
        layer.close(index);
      }
    })
  })

  //新增楼栋号
  $("#addBuilding").on("click",".addBlock",function () {
    layer.open({
      type: 1,
      title: ["新增楼栋号",'background-color:#353b53;color:#1ae0d5;'],
      skin: 'layer-ext-myskin',
      content: ' <input type="text" name="title" required  lay-verify="required" placeholder="请输入楼栋名称" autocomplete="off" class="layui-input buildingInput" maxlength="5" style="margin: 10px;width: 92%">',
      btn: ['确定', '取消'],
      btnAlign: 'r',
      closeBtn: 1,
      scrollbar: false,
      resize: false,
      move: false,
      zIndex: layer.zIndex, //重点1
      offset: '215px',
      end:function () {
      },
      yes: function (index, layero) {
        var num=$(".buildingInput").val();

        if(!num){

          return layer.msg("请输入楼栋号",{zIndex:1989110144})
          return false;
        }else{
            var param={
              shopId:shopId,
              merchantId:merchantId,
              homeName:num
            }
            reqAjaxAsync(RESULT_URL.addAssetHomes,JSON.stringify(param))
              .done(function (res) {
                layer.close(index);
                layer.msg(res.msg);
              if(res.code==1){
                //获取楼栋号
                getHouse();

              }
            })
        }
      }
    })
  })


//每个楼栋号添加点击事件
  $("#addBuilding .leftPart").on("click","li",function () {
    $(this).addClass("active").siblings().removeClass("active");
    var id=$(this).attr("data-id");
    var param={
      shopId:shopId,
      homeId:id
    }
    reqAjaxAsync(RESULT_URL.getAssetUnitList,JSON.stringify(param))
    .done(function (res) {
    if(res.code==1){
      var data=res.data;
      var html='<li >\n' +
        '          <span class="addUnit corlor" data-homeId="'+id+'">' +
        '<i class="layui-icon corlor">&#xe654;</i>' +
        '新增单元号</span>\n' +
        '        </li>'
      $.each(data,function (i,v) {
        html+='<li data-id="'+v.id+'" data-homeId="'+v.homeId+'">\n' +
          '          <span class="number">'+v.unitName+'</span>\n' +
          '          <i class="layui-icon  editBlock">&#xe642;</i>\n' +
          '          <i class="layui-icon  delBlock">&#x1006;</i>\n' +
          '        </li>'
      })
      $("#addBuilding .rightContent").html(html);
    }else {
      console.log(res.msg);
    }
    })
  });

  //新增单元号
  $("#addBuilding").on("click",".addUnit",function () {
    var homeId=$(this).attr("data-homeId")
    layer.open({
      type: 1,
      title: ["新增单元号",'background-color:#353b53;color:#1ae0d5;'],
      skin: 'layer-ext-myskin',
      content: ' <input type="text" name="title"  placeholder="请输入单元号名称" autocomplete="off" class="layui-input unitInput" maxlength="5" style="margin: 10px;width: 92%">',
      btn: ['确定', '取消'],
      btnAlign: 'r',
      closeBtn: 1,
      scrollbar: false,
      resize: false,
      move: false,
      offset: '215px',
      zIndex: layer.zIndex, //重点1
      yes: function (index, layero) {
        var num=$(".unitInput").val();

        if(!num){
          return layer.msg("请输入单元号",{zIndex:1989110144})
        }else{

          var param={
            shopId:shopId,
            unitName:num,
            homeId:homeId
          }
          reqAjaxAsync(RESULT_URL.addAssetUnit,JSON.stringify(param))
            .done(function (res) {
              layer.close(index);
              layer.msg(res.msg);
              if(res.code==1){

                $("#addBuilding .blockNumber .active").click();

              }
            })
        }
      }
    })
  })

  //新增资产
  $(".content").on("click",".addAssert",function () {
    layer.open({
      type: 1,
      title: ['新增资产管理', 'height:50px;line-height: 50px;font-size:20px;text-align: center;background-color:#353b53;color:#1ae0d5;'],
      skin: 'layer-ext-myskin',
      content: $('#assert'),
      area: ['500px',' 350px'],
      btn: ['确定'],
      btnAlign: 'c',
      closeBtn: 1,
      scrollbar: false,
      resize: false,
      move: false,
      end: function () {
        $('#assert').hide();
        $('#assert form')[0].reset();
        $("#assert .unitOption").html('');
        form.render('select');
      },
      success:function () {
        selectHouse();
       form.render('select');
      },
      yes:function (index, layero) {
          AddAsset(RESULT_URL.addAssetRoom,index,'')
      }
    })
  })
  //新增 弹框 获取楼栋号
  function selectHouse() {

    var param={
      shopId:shopId,
      merchantId:merchantId
    }
    var res=reqAjax(RESULT_URL.getAssetHomesList,JSON.stringify(param))
    // .done(function (res) {
    if(res.code==1){
      var data=res.data;
      var html='<option value=""></option>'
      $.each(data,function (i,v) {

        html+=' <option  value="'+v.id+'">'+v.homeName+'</option>'

      })

      $("#assert .homeOption").html(html);
    }else{
      console.log(res.msg);
    }
    // })

  }

  //新增资产选择单元号绑定事件
  form.on('select(homeOption)', function(data){
    var id=data.value;
   if(!id){
     $(".unitOption").prop("disabled",false)
   }

    var param={
      shopId:shopId,
      homeId:id
    }
    reqAjaxAsync(RESULT_URL.getAssetUnitList,JSON.stringify(param))
      .done(function (res) {
        if (res.code == 1) {

          var data = res.data;
          var html='<option value=""></option>'
          $.each(data,function (i,v) {

            html+=' <option  value="'+v.id+'">'+v.unitName+'</option>'

          })
          $("#assert .unitOption").html(html);
          form.render('select');
        }
      })
  });

  //编辑楼栋号
  $("#addBuilding .leftPart").on("click",".editBlock",function () {
    var dom=$(this);
    var id=dom.parent().attr("data-id");
    var name=dom.prev().text();
    editName(RESULT_URL.updateAssetHomes,id,name,'',"编辑楼栋号")
  })
  //编辑单元号
  $("#addBuilding .rightPart").on("click",".editBlock",function () {
    var dom=$(this);
    var id=dom.parent().attr("data-id");
    var name=dom.prev().text();
    var homeId=dom.parent().attr("data-homeId");
    editName(RESULT_URL.updateAssetUnit,id,name,homeId,"编辑单元号")
  })

  //新增车辆
  $(".content").on("click",".addCar",function () {
    layer.open({
      type: 1,
      title: ['新增车辆', 'height:50px;line-height: 50px;font-size:20px;text-align: center;background-color:#353b53;color:#1ae0d5;'],
      skin: 'layer-ext-myskin',
      content: $('#addvehical'),
      area: '350px',
      btn: ['确定'],
      btnAlign: 'c',
      closeBtn: 1,
      scrollbar: false,
      resize: false,
      move: false,
      end: function () {
        $('#addvehical').hide();
        $('#addvehical form')[0].reset();
      },
      yes:function (index,layero) {

        editAddCar("",RESULT_URL.addAssetCar,index)
      }
    })
  })

  //删除楼栋号
  $("#addBuilding .leftPart").on("click",".delBlock",function () {
    var id=$(this).parent().attr("data-id");
    delNumber(RESULT_URL.delAssetHomes,id)
  });
  //删除单元号
  $("#addBuilding .rightContent").on("click",".delBlock",function () {
    var id=$(this).parent().attr("data-id");
    layer.confirm(
      "确认删除?",
      {icon: 3, title:'提示'},
      function(index){
        var paramDel = {
          id:id
        };
        reqAjaxAsync(RESULT_URL.delAssetUnit,JSON.stringify(paramDel))
          .done(function(res){
            layer.close(index);
            if (res.code == 1) {
              layer.msg("删除成功");

              $("#addBuilding .blockNumber .active").click();

            } else {
              layer.msg(res.msg);
            }
          });
      })

  })

  //判断必填项方法
  function showTips(dom) {
    var tips = {
      addCarNumber: '请填写车牌号',
      addOwner: '请填写车主姓名',
      ownerPhone: '请填写手机号',
      carType: '请填写车型',
      homeOption:"请选择楼栋号",
      unitOption:"请选择单元号",
      ownerName:"请填写业主姓名",
    }

    for (var key in tips) {
      if ($(dom).hasClass(key)) return layer.msg(tips[key], {icon: 2});
    }
  }

  //新增and编辑资产方法
  function AddAsset(d,index,id) {
    //判断必填项
    for (var i = 0; i < $('#assert select').length; i++) {
      if (!$('#assert select').eq(i).val())
      {return showTips($('#assert select').eq(i));}
    }
    var doorName=$("#assert .doorNember").val()
    if(!doorName){
      return  layer.msg("请填写门牌号")
    }
    var param={
      id:id,
      shopId: shopId,
      doorNum: doorName,
      merchantId: merchantId,
      homeId: $('.homeOption  option:selected').val(),
      unitId:$('.unitOption  option:selected').val(),
    }
    reqAjaxAsync(d,JSON.stringify(param))
      .done(function (res) {
        layer.close(index);
        layer.msg(res.msg);
        if (res.code==1){
          initial()
        }
      })
  }

  //新增and修改车辆方法
  function editAddCar(id,d,index) {

    for (var i = 0; i < $('#addvehical input').length; i++) {
      if (!$('#addvehical input').eq(i).val())
      {return showTips($('#addvehical input').eq(i));}
    }
    //验证车牌号
    var m=$('#addvehical .addCarNumber').val();
    if(!cPattern.test(m)){
      return layer.msg("请输入有效的车牌号",{zIndex:1989110144})
    }
    //验证手机号
    var m=$('#addvehical .ownerPhone').val();
    if(!mpPattern.test(m)){
      return layer.msg("请输入有效的手机号码",{zIndex:1989110144})
    }

    var param={
      id:id,
      ownerName:$('#addvehical .addOwner').val() ,
      model:$('#addvehical .carType').val(),
      shopId:shopId,
      merchantId:merchantId,
      operatorId:userId,
      userId:userId,
      code: $('#addvehical .addCarNumber').val(),
      ownerPhone:$('#addvehical .ownerPhone').val()
    }

    reqAjaxAsync(d,JSON.stringify(param))
      .done(function (res) {
        layer.close(index);
        layer.msg(res.msg);

        if(res.code==1){

          $(".vehicle").click();
        }
      })
  }

  //获取楼栋号方法
  function getHouse() {

    var param={
      shopId:shopId,
      merchantId:merchantId
    }
    reqAjaxAsync(RESULT_URL.getAssetHomesList,JSON.stringify(param))
      .done(function (res) {
        if(res.code==1){
          var data=res.data;
          var html=''
          $.each(data,function (i,v) {

            html+='<li data-id="'+v.id+'">\n' +
              '         <span class="number">'+v.homeName+'</span>\n' +
              '          <i class="layui-icon corlor editBlock">&#xe642;</i>\n' +
              '          <i class="layui-icon corlor delBlock">&#x1006;</i>\n' +
              '        </li>'

          })
          $("#addBuilding .blockNumber").html(html);

          //默认第一层点击
          $("#addBuilding .leftPart li:eq(0)").click();
        }else{
          console.log(res.msg);
        }
      })
  }

  //编辑楼栋号and单元号方法
  
  function editName(d,id,name,homeId,title) {
    layer.open({
      type: 1,
      title: [title,'background-color:#353b53;color:#1ae0d5;'],
      content: ' <input type="text" value="'+name+'" name="title" placeholder="请重新输入名称"  class="layui-input editInput" maxlength="5" style="margin: 10px;width: 92%">',
      skin: 'layer-ext-myskin',
      btn: ['确定', '取消'],
      btnAlign: 'r',
      closeBtn: 1,
      scrollbar: false,
      resize: false,
      move: false,
      offset: '215px',
      zIndex: layer.zIndex, //重点1
      yes: function (index, layero) {
        var num=$(".editInput").val();
        if(!num){
          return layer.msg("请输入名称",{zIndex:1989110144})
        }else{
          var param={
            id:id,
            unitName:num,
            homeName:num,
            shopId:shopId,
            homeId:homeId,
            merchantId:merchantId
          }
          reqAjaxAsync(d,JSON.stringify(param))
            .done(function (res) {
              layer.close(index);
              if(res.code==1){
                $("#addBuilding .leftPart .active .number").html(num);
                $("#addBuilding .leftPart li.active").click();
              }else {
                layer.msg(res.msg);
              }
            })
        }
      }
    })
  }

  //删除楼栋号方法
  function delNumber(d,id) {

    layer.confirm(
      "确认删除?",
      {icon: 3, title:'提示'},
      function(index){
        var paramDel = {
          id:id
        };
        reqAjaxAsync(d,JSON.stringify(paramDel))
          .done(function(res){
            layer.close(index);
            if (res.code == 1) {
              layer.msg("删除成功");
              getHouse()
            } else {
              layer.msg(res.msg);
            }
          });
      })
  }

})
(jQuery)