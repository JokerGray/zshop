(function ($) {
  var REQUEST_URL = {
    SELECTSCNOTIFYSITCOUNTBYUSERID: 'oa/selectScNotifySitCountByUserId',//查询公告设置列表
    QUERYROLEBYPARAM: 'processSet/queryRoleByParam',//根据用户Id查询所有角色
    CANCELSCNOTIFYSIT: 'oa/cancelScNotifySit',//取消管理员
    GETSHOPLIST: 'oa/getShopList',//查询管理店铺
    ADDSCNOTIFYSIT: 'oa/addScNotifySit',//添加公告设置
    QUERYBACKUSERBYPARAM: 'processSet/queryBackUserByParam',//根据角色id查询所有用户
    SELECTSCNOTIFYSITBYID: 'oa/selectScNotifySitById',//查询公告设置详情
    UPDATESCNOTIFYSITBYID: 'oa/updateScNotifySitById'//
  };

  var pageNo = 1,
    pageSize = 6,
    lock = true,
    userId = getUrlParams('userId') || 10005,
    layer = layui.layer;

  layer.config({
    extend: 'myskin/style.css'
  });

  var param = {
    pageNo: pageNo,
    pageSize: pageSize,
    userId: userId
  }

  reqAjaxAsync(REQUEST_URL.SELECTSCNOTIFYSITCOUNTBYUSERID, JSON.stringify(param)).done(function (res) {
    init(res)
  })

  //设置列表渲染方法
  function init(res) {
    if (res.code == 1) {
      var sHtml = '';
      for (var i = 0, len = res.data.length; i < len; i++) {
        var data = res.data[i];
        sHtml +=
          '<tr data-id="' + data.id + '">' +
          '<td>' + data.name + '</td>' +
          '<td>' + data.shopNames + '</td>' +
          '<td>' +
          '<a href="javascript:void(0)" class="edit">编辑&nbsp;&nbsp;</a>' +
          '<a href="javascript:void(0)" class="delete">&nbsp;&nbsp;取消管理员</a>' +
          '</td>' +
          '</tr>';
      }
      $('#announcement table tbody').html(sHtml);
    } else {
      layer.msg(res.msg);
    }
  }

  //添加管理员弹窗
  $('#announcement .title button').on('click', function () {
    layer.open({
      title: ['添加管理员', 'font-size:14px;background-color:#353b53;color:#1ae0d5'],
      type: 1,
      skin: 'layer-ext-myskin',
      content: $('#details-1'),
      area: ['700px', '800px'],
      btn: ['确定', '取消'],
      btnAlign: 'r',
      closeBtn: 1,
      scrollbar: false,
      resize: false,
      move: false,
      end: function () {
        $('#details-1,#single,#employee ul').hide();
        $('#details-1 form')[0].reset();//表单初始化
        $('#template-1 .row:eq(1) select:eq(1)').hide();
        $('.choose-container').html('');
      },
      success: function (layero, index) {
        $(layero).find('.title button:eq(0)').click();
        var param = {
          userId: userId
        }

        //查询所有角色
        reqAjaxAsync(REQUEST_URL.QUERYROLEBYPARAM, JSON.stringify(param)).done(function (res) {
          if (res.code == 1) {
            var sHtml1 = '';
            for (var i = 0; i < res.data.length; i++) {
              var data1 = res.data[i];
              sHtml1 += '<option value="' + data1.id + '">' + data1.name + '</option>';
            }
            $(layero).find('#template-1 .row:eq(0) select').html(sHtml1);
            $(layero).find('#template-2 .row:eq(0) select:eq(0)').html(sHtml1);
            $(layero).find('#template-2 .row:eq(0) select:eq(0) option:first').trigger("change");
          }
        })

        //查询所有店铺
        reqAjaxAsync(REQUEST_URL.GETSHOPLIST, JSON.stringify(param)).done(function (res) {
          if (res.code == 1) {
            var sHtml2 = '';
            for (var i = 0, len = res.data.length; i < len; i++) {
              var data2 = res.data[i];
              sHtml2 += '<li><input type="checkbox" value="' + data2.id + '">' + data2.shopName + '</li>';
            }
            $(layero).find('#single ul').html(sHtml2);
            $(layero).find('#single1 ul').html(sHtml2);
          }
        })
      },
      yes: function (index, layero) {
        //指定角色
        if ($(layero).find('.title button:eq(0)').attr('class') == 'btn active') {
          //全部店铺
          if ($(layero).find('#checkbox').val() == 'all') {
            var param = {
              userId: userId,
              roleId: $(layero).find('.row:eq(0) select').val(),
              shopIds: 'all'
            }
            //指定店铺
          } else {
            var param = {
              userId: userId,
              roleId: $(layero).find('.row:eq(0) select').val(),
              shopIds: getShopIds('single')
            }
          }
          //指定个人
        } else {
          //全部店铺
          if ($(layero).find('#checkbox1').val() == 'all') {
            var param = {
              userId: userId,
              shopIds: 'all',
              siteUserIds: getEmployeeIds()
            }
          } else {
            var param = {
              userId: userId,
              shopIds: getShopIds('single1'),
              siteUserIds: getEmployeeIds()
            }
          }
        }
        if (lock) {
          lock = false;
          reqAjaxAsync(REQUEST_URL.ADDSCNOTIFYSIT, JSON.stringify(param)).done(function (res) {
            if (res.code == 1) {
              layer.msg('新增管理员成功')
              setTimeout(function () {
                location.reload(true);
              }, 500)
            } else {
              layer.msg(res.msg)
              lock = true
            }
          })
        }
      }
    })
  })

  //全部店铺指定店铺切换
  $('#checkbox,#checkbox1,#checkbox2').on('change', function () {
    if ($(this).val() == 'all') {
      $(this).parent().siblings('.col-xs-6').find('div').hide();
      $(this).parent().siblings('.col-xs-6').find('ul').hide();
    } else {
      $(this).parent().siblings('.col-xs-6').find('div').show();
      $(this).parent().siblings('.col-xs-6').find('ul').show();
    }
  })

  //新增弹框指定角色切换
  $('#details-1 .title button').click(function () {
    var index = $(this).index();
    $(this).addClass('active').siblings().removeClass('active');
    if (index == 0) {
      $('#template-1').show();
      $('#template-2').hide();
    } else if (index == 1) {
      $('#template-1').hide();
      $('#template-2').show();
    }
  })

  //新增根据角色查询所属员工
  $('#template-2 .row:eq(0) select:eq(0)').on('change', function () {
    var param = {
      roleId: $(this).val()
    }

    reqAjaxAsync(REQUEST_URL.QUERYBACKUSERBYPARAM, JSON.stringify(param)).done(function (res) {
      if (res.code == 1) {
        var sHtml = '';
        if (res.data.length != 0) {
          for (var i = 0; i < res.data.length; i++) {
            var data = res.data[i];
            sHtml += '<li><input type="checkbox" value="' + data.id + '">' + data.username + '</li>'
          }
        } else {
          sHtml += '<li>无</li>'
        }
        $('#employee ul').html(sHtml);
      }
    })

    //遍历已选择的员工并勾选
    $('.choose-container p').each(function () {
      var item = $(this).attr('data-id');
      $('#employee li').find('input[value=' + item + ']').attr('checked', true);
    })
  })

  //指定店铺/员工显示隐藏
  $('#single,#single1,#single2,#employee').on('click', function (event) {
    $(this).find('ul').toggle();
    event.stopPropagation();
  })

  $('#single ul,#single1 ul,#single2 ul').on('click', function (event) {
    event.stopPropagation();
  })

  //点选员工姓名,添加或删除到指定位置
  $('#employee').on('click', 'li input[type=checkbox]', function (event) {
    event.stopPropagation();
    if ($(this).is(':checked')) {
      var sHtml =
        '<p class="item-name" data-id="' + $(this).val() + '">' + $(this).parent().text() +
        '<i class="delete">X</i>' +
        '</p>';
      $('.choose-container').append(sHtml);
    } else {
      $('.choose-container').find('p[data-id=' + $(this).val() + ']').remove();
    }
  })

  //点击删除,并去掉checkbox勾选状态
  $('.choose-area').on('click', '.delete', function () {
    var $this = $(this);
    $('#employee li').each(function () {
      var item = $this.parent().attr('data-id');
      $(this).find('input[value=' + item + ']').attr('checked', false);
    })
    $(this).parent().remove();
  })

  //用户编辑
  $('#announcement table').on('click', '.edit', function () {
    var id = $(this).parents('tr').attr('data-id');
    var name = $(this).parents('tr').find('td:eq(0)').text();
    layer.open({
      title: ['编辑', 'font-size:14px;background-color:#353b53;color:#1ae0d5'],
      type: 1,
      skin: 'layer-ext-myskin',
      content: $('#details-2'),
      area: ['700px', '540px'],
      btn: ['确定', '取消'],
      btnAlign: 'r',
      closeBtn: 1,
      scrollbar: false,
      resize: false,
      move: false,
      end: function () {
        $('#details-2').hide();
        $('#details-2 form')[0].reset();//表单初始化
        $('#single2,#single2 ul').hide();
      },
      success: function (layero, index) {
        $(layero).find('form span').html(name);

        var param1 = {
          userId: userId
        }
        var param2 = {
          id: id,
          userId: userId
        }

        //查询所有店铺
        function searchShopList() {
          reqAjaxAsync(REQUEST_URL.GETSHOPLIST, JSON.stringify(param1)).done(function (res) {
            if (res.code == 1) {
              var sHtml1 = '';
              for (var i = 0, len = res.data.length; i < len; i++) {
                var data1 = res.data[i];
                sHtml1 += '<li><input type="checkbox" value="' + data1.id + '">' + data1.shopName + '</li>';
              }
              $(layero).find('#single2 ul').html(sHtml1);
              selectShop();
            } else {
              layer.msg(res.msg);
            }
          })
        }

        //勾选所有店铺
        function selectShop() {
          reqAjaxAsync(REQUEST_URL.SELECTSCNOTIFYSITBYID, JSON.stringify(param2)).done(function (res) {
            if (res.code == 1) {
              var data = res.data;
              $(layero).find('#details-2').attr('data-siteType', data.siteType).attr('data-siteUser', data.siteUser);
              if (res.data.noticeMerchantid) {
                $('#checkbox2').val('all');
              } else {
                $('#checkbox2').val('checkbox');
                $('#single2,#single2 ul').show();
                var shopIds = data.noticeShopid.split(',');
                for (var i = 0; i < shopIds.length; i++) {
                  $('#single2 li').each(function () {
                    $(this).find('input[value=' + shopIds[i] + ']').attr('checked', true);
                  })
                }
              }
            } else {
              layer.msg(res.msg);
            }
          })
        }

        searchShopList();
      },
      yes: function (index, layero) {
        var siteType = $(layero).find('#details-2').attr('data-siteType');
        var shopCount = $(layero).find('#checkbox2').val();
        var siteUserIds = $(layero).find('#details-2').attr('data-siteUser');
        var roleId = $(layero).find('#details-2').attr('data-siteUser');
        //判断是人员
        switch (siteType) {
          case 1:
            //全部店铺
            if (shopCount == 'all') {
              var param = {
                id: id,
                userId: userId,
                siteUserIds: siteUserIds,
                shopIds: 'all'
              }
              //指定店铺
            } else {
              var param = {
                id: id,
                userId: userId,
                siteUserIds: siteUserIds,
                shopIds: getShopIds('single2')
              }
            }
            break;
          //判断是角色
          case 2: {
            //全部店铺
            if (shopCount == 'all') {
              var param = {
                id: id,
                userId: userId,
                roleId: roleId,
                shopIds: 'all'
              }
              //指定店铺
            } else {
              var param = {
                id: id,
                userId: userId,
                roleId: roleId,
                shopIds: getShopIds('single2')
              }
            }
            break;
          }
        }
        if (lock) {
          lock = false;
          reqAjaxAsync(REQUEST_URL.UPDATESCNOTIFYSITBYID, JSON.stringify(param)).done(function (res) {
            if (res.code == 1) {
              layer.msg(res.msg);
              setTimeout(function () {
                location.reload(true);
              }, 500)
            } else {
              lock = true;
              layer.msg(res.msg)
            }
          })
        }
      }
    })
  })

  //取消管理员
  $('#announcement tbody').on('click', '.delete', function () {
    var id = $(this).parents('tr').attr('data-id');
    var param = {
      id: id,
      userId: userId
    }
    layer.confirm('确定要取消管理员吗?', {title: '提示'}, function (index) {
      if (lock) {
        lock = false;
        reqAjaxAsync(REQUEST_URL.CANCELSCNOTIFYSIT, JSON.stringify(param)).done(function (res) {
          if (res.code == 1) {
            layer.msg(res.msg)
            setTimeout(function () {
              location.reload(true);
            }, 500)
          } else {
            layer.msg(res.msg);
            lock = true;
          }
        })
      }
    })
  })

  //遍历商户id方法
  function getShopIds(dom) {
    var arr = [];
    $('#' + dom + ' li input:checked').each(function (i, e) {
      arr.push($(e).val());
    })
    var str = arr.join(',');
    return str;
  }

  //遍历员工id方法
  function getEmployeeIds() {
    var arr = [];
    $('.choose-container .item-name').each(function () {
      arr.push($(this).attr('data-id'));
    })
    var str = arr.join(',');
    return str;
  }
})
(jQuery)