(function ($) {
  var RESULT_URL = {
    paymentType: "shopLife/getPaymentSetList",//缴费类型列表
    iconType: "shopLife/getPaymentSetImg",//缴费类型图标列表
    addPayment: " shopLife/addPaymentSet",//新增缴费类型
    cheackPaymentType: " shopLife/getOnePaymentSet",//获取单个缴费类型
    updatePayment: "shopLife/updatePaymentSet",//修改缴费类型
    delPaymentSet: 'shopLife/delPaymentSet',//删除缴费类型
  }
  var page = 1;
  var pageSize = 6;
  var shopId =getUrlParams("shopId");
  // var shopId =getUrlParams("shopId")|| 49;
  var merchantId=getUrlParams("merchantId");
  // var merchantId=getUrlParams("merchantId")||1070;
  var table = layui.table;
  var form = layui.form;
  var layer = layui.layer;

  //表格表头//标题栏
  var tableColum= [[
    {type:'numbers', title: '编号', width: 100}
    , {field: 'paymentTypeName', title: '类型', width: 300}
    , {field: 'status', title: '是否启用', width: 150, templet: '#sexTpl'}
    , {field: 'createTime', title: '创建时间', width: 300}
    , {field: 'operation', title: '操作', width: 300, templet: '#checkboxTpl'}
  ]];

  layer.config({
    extend: 'myskin/style.css'
  });

  $(function () {
    getinitialTabel()
  })

  function getinitialTabel() {
    initialTabel('test', tableColum)
  }

//新增类型弹框
  $(".addbtn").click(function () {
    layer.open({
      type: 1,
      title: ['新增缴费类型', 'height:50px;line-height: 50px;font-size:20px;text-align: center;background-color:#353b53;color:#1ae0d5;padding-left:80px'],
      skin: 'layer-ext-myskin',
      content: $('#addBox'),
      area: '450px',
      btn: ['确定'],
      btnAlign: 'c',
      closeBtn: 1,
      scrollbar: false,
      resize: false,
      move: false,
      end: function () {
        $('#addBox').hide();
        $('#addBox form')[0].reset();
      },
      success: function () {

        getImg()

        //监听单选框
        form.on('radio', function (data) {

          var val = "." + data.value;
          var url = $('img' + val + '').attr("src");
          $("#addBox").attr("data-url", url)
        });
        //监听开关
        form.on('switch(switch)', function (data) {

          var value = data.elem.checked
          if (value == true) {
            $("#addBox").attr("data-switch", '1')
          } else {
            $("#addBox").attr("data-switch", '0')
          }
        });
      },
      yes: function (index, layero) {
        var name = $(".typeName").val();
        if (!name) {
          return layer.msg("请填写缴费类型")
        }
        var param = {
          shopId: shopId,
          merchantId: merchantId,
          paymentTypeName: name,
          status: $("#addBox").attr("data-switch"),
          typeImg: $("#addBox").attr("data-url")
        }

        reqAjaxAsync(RESULT_URL.addPayment, JSON.stringify(param)).done(function (res) {
          layer.msg(res.msg)
          if (res.code == 1) {
            layer.close(index);
            getinitialTabel()
          }
        })
      }
    })
  })

  //监听工具条
  table.on('tool(table)', function (obj) {
    var data = obj.data;
    var id = data.id;
    var layEvent = obj.event;
    var isDefault=data.isDefault;

    //编辑
    if (layEvent == "to_edit") {
      layer.open({
        type: 1,
        title: ['修改缴费类型', 'height:50px;line-height: 50px;font-size:20px;text-align: center;background-color:#353b53;color:#1be0d6;padding-left:80px'],
        skin: 'layer-ext-myskin',
        content: $('#addBox'),
        area: '450px',
        btn: ['确定'],
        btnAlign: 'c',
        closeBtn: 1,
        scrollbar: false,
        resize: false,
        move: false,
        end: function () {
          $('#addBox').hide();
          $('#addBox form')[0].reset();
          $("#addBox").attr("data-switch", '0');
          $(".typeName").prop("disabled",false).css("cursor", "default").css("background","white")
          $(".picCheck input").each(function () {
            $(this).prop("disabled",false);
            form.render('radio');
          })
        },
        success: function () {
          //图标显示
          getImg()

          var param = {
            id: id
          }
          reqAjaxAsync(RESULT_URL.cheackPaymentType, JSON.stringify(param))
            .done(function (res) {

              if (res.code == 1) {
                var data = res.data;
                var name = data.paymentTypeName;

                //类型名称
                $(".typeName").val(name);
                var status = data.status;
                var url = data.typeImg;
                $("#addBox").attr("data-url",url);
                $("#addBox").attr("data-switch",status);
                //开关状态
                if (status == 1) {
                  $(".layui-form-switch").addClass("layui-form-onswitch");
                  $(".layui-form-switch em").html("开启")
                }
                //图标选择
                var dom = $('#addBox img[src="' + url + '"]');
                dom.prev().click();

              }
            })

          //默认类型只能改状态
          if(isDefault==1){

            $(".typeName").prop("disabled",true).css("cursor", "not-allowed").css("background","#f7f7f7")

            $(".picCheck input").each(function () {
              $(this).prop("disabled",true);
              form.render('radio');
            })

            //监听开关
            form.on('switch(switch)', function (data) {

              var value = data.elem.checked;
              console.log(value);
              if (value == true) {
                $("#addBox").attr("data-switch", '1')
              } else {
                $("#addBox").attr("data-switch", '0')
              }
            });
            //新增类型三种状态都可以改
          }else{

            //监听单选框
            form.on('radio', function (data) {

              var val = "." + data.value;
              var url = $('img' + val + '').attr("src");
              $("#addBox").attr("data-url", url)
            });
            //监听开关
            form.on('switch(switch)', function (data) {

              var value = data.elem.checked;
              console.log(value);
              if (value == true) {
                $("#addBox").attr("data-switch", '1')
              } else {
                $("#addBox").attr("data-switch", '0')
              }
            });
          }
        },
        yes: function (index, layero) {

          var name = $(".typeName").val();
          if (!name) {
            return layer.msg("请填写缴费类型")
          }
          var param = {
            id: id,
            paymentTypeName: name,
            status: $("#addBox").attr("data-switch"),
            typeImg: $("#addBox").attr("data-url"),
            shopId: shopId,
            merchantId: merchantId
          }
          reqAjaxAsync(RESULT_URL.updatePayment, JSON.stringify(param)).done(function (res) {
            layer.msg(res.msg);
            if (res.code == 1) {
              layer.close(index);
              getinitialTabel();
            }
          })

        }
      })
      //删除
    } else if (layEvent == "to_del") {
      layer.confirm(
        "确认删除?",
        {icon: 3, title: '提示'},
        function (index) {
          var paramDel = {
            id: id
          };
          reqAjaxAsync(RESULT_URL.delPaymentSet, JSON.stringify(paramDel))
            .done(function (res) {
              if (res.code == 1) {
                layer.msg("删除成功");
                layer.close(index);
                getinitialTabel();

              } else {
                layer.msg(res.msg);
              }
            });
        })
    }
  })

  //显示图标图片

  function getImg() {
    reqAjaxAsync(RESULT_URL.iconType)
      .done(function (res) {

        if (res.code == 1) {
          var data = res.data;
          var imgURL=data[0].img;
          $("#addBox").attr("data-url",imgURL)
          $.each(data, function (i, v) {
            var url = v.img;
            $("#addBox .picCheck img").eq(i).attr("src", url);
          })

        }
      })
  }

  //带分页动态表格生成
  function initialTabel(id, cols) {
    var tableIns, tablePage;
    //1.表格配置
    tableIns = table.render({
      id: id,
      elem: '#' + id,
      cols: cols,
      page: false,
      // even: true,
      skin: 'line  ' //表格风格
    });
    var res = pageCallback(page, pageSize);

    //第一页，一页显示15条数据
    if (res) {
      if (res.code == 1) {
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
    page_options.jump = function (obj, first) {
      tablePage = obj;

      //首次不执行
      if (!first) {
        var resTwo = pageCallback(obj.curr, obj.limit);
        if (resTwo && resTwo.code == 1)
          tableIns.reload({
            data: resTwo.data
          });
        else
          layer.msg(resTwo.msg);
      }
    }

    layui.laypage.render(page_options);
  }

  function pageCallback(index, pageSize) {
    var param = {
      merchantId: merchantId,
      shopId: shopId,
      pageNo: index,
      pageSize: pageSize
    }
    var res = reqAjax(RESULT_URL.paymentType, JSON.stringify(param));
    if (res.code == 1) {
      return res;
    }

  }
})
(jQuery)