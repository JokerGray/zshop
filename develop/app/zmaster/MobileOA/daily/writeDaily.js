(function ($) {
  var REQUEST_URL = {
    SELECTRECORDID: 'userDaily/selectRecordId',//日报(dh)---根据用户id查看今天的日报提交记录
    FINDORGTREEANDSTAFFBYUSERID: 'processSet/findOrgTreeAndStaffByUserId',//日报(dh)---流程设置-->根据后台用户主键查询商户的组织树和树下的员工列表
    QUERYAPPROVERDEFAULTNEXT: 'userDaily/queryApproverDefaultNext',//日报(dh)---查询默认审批人
    SAVEORUPDATEUSERDAILY: 'userDaily/saveOrUpdateUserDaily',//日报(dh)---提交或重新提交日报
    SELECTRECSCAPPROVALPAGE: 'userDaily/selectRecScApprovalPage',//日报(dh)---分页展示我收到的审批单(日报)列表
    SELECTDAILYSCAPPROVALPAGE: 'userDaily/selectDailyScApprovalPage',//日报(dh)---分页展示我提交的审批单(日报)列表
    DETAILSCAPPROVAL: 'userDaily/detailScApproval',//日报(dh)---审批单主键查看审批单详情
    REPLAYDAILYAPPROVAL: 'userDaily/replayDailyApproval',//日报(dh)---回复日报
    QUERYSCAPPROVALPROCESSLIST: 'userDaily/queryScApprovalProcessList'//日报(dh)---查看日报回复记录列表
  }

  var userId = getUrlParams('userId') || 10429,
    bussTypeId = 3,
    index = 0,
    lock = true,
    count = 0,//人员数
    count1 = 0,//临时人员数
    array = [],//人员列表
    array1 = [];//人员临时数组

  $(function () {
    init();
  })

  //初始化方法
  function init() {
    var param = {
      userId: userId,
      bussTypeId: bussTypeId
    }
    //查询当日是否提交过
    reqAjaxAsync(REQUEST_URL.SELECTRECORDID, JSON.stringify(param)).done(function (res) {
      if (res.code == 1) {
        var approvalNowList = res.data.approvalNowList;
        if (approvalNowList.length != 0) {
          //如果提交过
          var data = approvalNowList[0];
          initList(data);
        } else {
          //如果未提交,则添加默认人员数组
          defaultPerson();
        }
      } else {
        layerMsg(res.msg);
      }
    })
  }

  //重写日报渲染方法
  function initList(data) {
    var content = JSON.parse(data.content);
    var sHtml = '';
    $('.today p').html(content.today);
    $('.coordination p').html(content.coordinate);
    $('.tomorrow p').html(content.nextDay);
    $('.remarks p').html(data.remarks || '<span>备注</span>');
    //人员列表
    for (var i = 0; i < data.nextApproverUserList.length; i++) {
      count = data.nextApproverUserList.length;
      count1 = data.nextApproverUserList.length;
      var res = data.nextApproverUserList[i];
      var obj = {};
      sHtml += '<div class="item" data-id="' + res.id + '"><i>' + res.username.slice(0, 1) + '</i><p>' + res.username + '</p></div>';
      //为人员数组添加数据
      obj.id = res.id;
      obj.username = res.username;
      array.push(obj);
    }
    $('.item-list').prepend(sHtml);
    $('.submit button').text('重新提交').attr('data-id', data.id);
  }

  function defaultPerson() {
    var param = {
      userId: userId,
      bussTypeId: bussTypeId
    }
    reqAjaxAsync(REQUEST_URL.QUERYAPPROVERDEFAULTNEXT, JSON.stringify(param)).done(function (res) {
      if (res.code == 1) {
        if (res.data.length != 0) {
          var sHtml = '';
          for (var i = 0; i < res.data.length; i++) {
            count = res.data.length;
            count1 = res.data.length;
            var data = res.data[i];
            var obj = {};
            sHtml += '<div class="item" data-id="' + data.id + '"><i>' + data.username.slice(0, 1) + '</i><p>' + data.username + '</p></div>';
            //为人员数组添加数据
            obj.id = data.id;
            obj.username = data.username;
            array.push(obj);
          }
          sHtml += '<div class="add-item"><i></i><p>添加人员</p></div>';
          $('#writeDaily .item-list').html(sHtml);
          console.log(JSON.stringify(array) + '  ' + count)
        }
      } else {
        layerMsg(res.msg);
      }
    })
  }

  //日报列表渲染方法
  function dailyList(res) {
    if (res.code == 1) {
      var sHtml = '';
      for (var i = 0; i < res.data.length; i++) {
        var data = res.data[i],
          content = JSON.parse(res.data[i].content);
        sHtml +=
          '<li class="daily-item" data-id="' + data.id + '">\n' +
          '        <p class="name">' + data.createUserInfo.username + '</p>\n' +
          '        <p class="date">' + data.updateDate + '</p>\n' +
          '        <div class="details">\n' +
          '          <label>今日完成工作：</label>\n' +
          '          <p>' + isNull(content.today) + '</p>\n' +
          '        </div>\n' +
          '        <div class="details">\n' +
          '          <label>需协调工作：</label>\n' +
          '          <p>' + isNull(content.coordinate) + '</p>\n' +
          '        </div>\n' +
          '        <div class="details">\n' +
          '          <label>次日工作安排：</label>\n' +
          '          <p>' + isNull(content.nextDay) + '</p>\n' +
          '        </div>\n' +
          '        <div class="details">\n' +
          '          <label>备注：</label>\n' +
          '          <p>' + isNull(data.remarks) + '</p>\n' +
          '        </div>\n' +
          '      </li>';
      }
      $('#lookDaily .daily-list ul').html(sHtml);
    } else {
      layerMsg(res.msg);
    }
  }

  //日报详情渲染方法
  function initDetails(approvalId, index) {
    var param = {approvalId: approvalId};
    reqAjaxAsync(REQUEST_URL.DETAILSCAPPROVAL, JSON.stringify(param)).done(function (res) {
      if (res.code == 1) {
        var data = res.data;
        var content = JSON.parse(res.data.content);
        $('#dailyDetails').attr('data-approvalId', approvalId);
        $('#dailyDetails .title span').html(data.createUserInfo.username + '的日报');
        $('#dailyDetails .name').html(data.createUserInfo.username);
        $('#dailyDetails .date').html(data.updateDate);
        $('#dailyDetails .details-item:eq(0) p:eq(1)').html(content.today);
        $('#dailyDetails .details-item:eq(1) p:eq(1)').html(isNull(content.coordinate));
        $('#dailyDetails .details-item:eq(2) p:eq(1)').html(content.nextDay);
        $('#dailyDetails .details-item:eq(3) p:eq(1)').html(isNull(data.remarks));
        if (index == 0) {
          //是我收到的
          $('#reply').show();
        } else if (index == 1) {
          //我发出的,不需要回复
          $('#reply').hide();
        }
        $('#lookDaily,#bottomNav').hide();
        $('#dailyDetails').show();
      } else {
        layerMsg(res.msg);
      }
    })
  }

  //日报回复列表渲染
  function replyList(approvalId) {
    var param = {approvalId: approvalId};
    $('#dailyDetails .content ul').html('');
    $('#dailyDetails .content p').html('共有0条回复');
    $('#dailyDetails .reply-list').hide();

    reqAjaxAsync(REQUEST_URL.QUERYSCAPPROVALPROCESSLIST, JSON.stringify(param)).done(function (res) {
      if (res.code == 1) {
        if (res.data.length != 0) {
          var sHtml = '';
          for (var i = 0; i < res.data.length; i++) {
            var data = res.data[i];
            sHtml +=
              '<li>' +
              '<i class="icon">' + data.approvalUserInfo.username.slice(0, 1) + '</i>' +
              '<dl><dt>' + data.approvalUserInfo.username + '</dt><dd>' + data.opinion + '</dd></dl>' +
              '<span>' + dateFormat(data.approvalTime) + '</span>' +
              '</li>';
          }
          $('#dailyDetails .content ul').html(sHtml);
          $('#dailyDetails .content p').html('共有' + res.data.length + '条回复');
          $('#dailyDetails .reply-list').show();
        } else {
          console.log(res.msg);
        }
      } else {
        layerMsg(res.msg);
      }
    })
  }

  //人员选择页跳转
  $('#writeDaily .item-list').on('click', '.add-item i', function (event) {
    event.stopPropagation();
    $('#writeDaily,#bottomNav').hide();
    $('#chooseReceive .shopList').html('');
    shopList();
    $('#chooseReceive,#total').show();
  })

  //点击头像删除
  $('.item-list').on('click', '.item i', function () {
    var id = $(this).parent().attr('data-id');
    $(this).parents('.item').remove();
    count--;
    array = array.filter(function (item) {
      return item.id != id;
    })
  })

  //提交重提日报
  $('#writeDaily .submit button').on('click', function () {
    var id = $('#writeDaily .submit button').attr('data-id'),
      today = $.trim($('#writeDaily .today p').html()) == '<span>请输入</span>' ? '' : $.trim($('#writeDaily .today p').html()),
      coordinate = $.trim($('#writeDaily .coordination p').html()) == '<span>请输入</span>' ? '' : $.trim($('#writeDaily .coordination p').html()),
      nextDay = $.trim($('#writeDaily .tomorrow p').html()) == '<span>请输入</span>' ? '' : $.trim($('#writeDaily .tomorrow p').html()),
      remarks = $.trim($('#writeDaily .remarks p').html()) == '<span>备注</span>' ? '' : $.trim($('#writeDaily .remarks p').html()),
      nextApproverId = isArray(array),
      approvalStatus = 6,
      isEmailNotify = 0,
      param = {
        userId: userId,
        id: id,
        content: {
          today: today,
          coordinate: coordinate,
          nextDay: nextDay
        },
        remarks: remarks,
        nextApproverId: nextApproverId,
        approvalStatus: approvalStatus,
        isEmailNotify: isEmailNotify
      }

    if (!today) {
      return layerMsg('请填写今日完成工作');
    }
    if (!nextDay) {
      return layerMsg('请填写次日工作安排');
    }

    layer.open({type: 2});
    reqAjaxAsync(REQUEST_URL.SAVEORUPDATEUSERDAILY, JSON.stringify(param)).done(function (res) {
      if (res.code == 1) {
        layer.closeAll();
        layerMsg('提交成功');
        if (!id) {
          setTimeout(function () {
            window.location.reload(true);
          }, 500)
        }
      } else {
        layer.closeAll();
        layerMsg(res.msg);
      }
    })
  })

  //返回App
  $('#writeDaily .back,#lookDaily .back').on('click', function () {
    window.location.href = 'backZmasterApp://';
  })

  /****人员选择页面逻辑*********************************************************************************************************/

//店铺组织人员渲染方法
  function shopList() {
    var param = {
      userId: userId
    }
    reqAjaxAsync(REQUEST_URL.FINDORGTREEANDSTAFFBYUSERID, JSON.stringify(param)).done(function (res) {
      if (res.code == 1) {
        personnelInit(res);
        for (var i = 0; i < array.length; i++) {
          $('#chooseReceive .shopList li').each(function () {
            $(this).find("input[value=" + array[i].id + "]").prop('checked', true);
          })
        }

        //创建一个新的数组;
        array1 = array.slice(0, array.length);
        count1 = count;
        var counter = $('#chooseReceive input[name=stuCheckBox]').length;
        $('#total .count').html('已选择:' + count + '人');

        if (counter == count && counter != 0) {
          $('input[name="selectall"]').prop('checked', true);
        } else {
          $('input[name="selectall"]').prop('checked', false);
        }
      } else {
        layerMsg(res.msg);
      }
    })
  }

  function personnelInit(res) {
    var arr1 = [],
      arr2 = [],
      arr3 = [],
      arr4 = [],
      sHtml = '';

    $('.search p').html(res.data.orgName);//商户名

    //过滤自身
    arr1 = res.data.userList.filter(function (item) {
      return item.id != userId;
    })
    if (arr1.length != 0) {
      //管理员
      sHtml =
        '<div class="shop-item">' +
        '<div class="wrap"><i class="right"></i></div>' +
        '<span class="shopName">管理员</span>' +
        '<ul class="list">';
      for (var a = 0; a < arr1.length; a++) {
        var rowA = arr1[a];
        sHtml +=
          '<li>' +
          '<div class="chooseItem">' +
          '<input type="checkbox" name="stuCheckBox" value="' + rowA.id + '">' +
          '<i class="spot"></i>' +
          '</div>' +
          '<span class="username">' + rowA.username + '</span>';
        if (rowA.sex == 1) {
          sHtml += '<span>女</span>';
        } else {
          sHtml += '<span>男</span>';
        }
        sHtml +=
          '<span>' + rowA.phone + '</span>' +
          '</li>'
      }
      sHtml += '</ul></div>';
    }

    //下属店铺列表组织,过滤掉没有人员的店铺
    arr3 = res.data.subOrgList.filter(function (item) {
      return item.userList.length != 0;
    })

    for (var i = 0; i < arr3.length; i++) {
      var data = arr3[i];
      sHtml +=
        '<div class="shop-item">' +
        '<div class="wrap"><i class="right"></i></div>' +
        '<span class="shopName">' + data.orgName + '</span>' +
        '<ul class="list">';

      //过滤自身
      arr2 = data.userList.filter(function (item) {
        return item.id != userId;
      })

      arr2 = arr2.filter(function (item) {
        if (arr4.indexOf(item.id) == -1) {
          arr4.push(item.id);
          return item;
        }
      })

      for (var z = 0; z < arr2.length; z++) {
        var row = arr2[z];
        sHtml +=
          '<li>' +
          '<div class="chooseItem">' +
          '<input type="checkbox" name="stuCheckBox" value="' + row.id + '">' +
          '<i class="spot"></i>' +
          '</div>' +
          '<span class="username">' + row.username + '</span>';
        if (row.sex == 1) {
          sHtml += '<span>女</span>';
        } else {
          sHtml += '<span>男</span>';
        }
        sHtml += '<span>' + row.phone + '</span></li>';
      }
      sHtml += '</ul></div>';
    }
    $('#chooseReceive .shopList').html(sHtml);
  }

  //全选
  $('input[name="selectall"]').on('click', function (event) {
    event.stopPropagation();
    if ($(this).is(':checked')) {
      array1.splice(0, array1.length);
      $('input[name="stuCheckBox"]').each(function () {
        $(this).prop("checked", true);
        var obj = {};
        obj.id = $(this).val();
        obj.username = $(this).parent().siblings('.username').text();
        array1.push(obj);
      });
      count1 = array1.length;
      $('#total .count').html('已选择:' + count1 + '人');
    } else {
      $('input[name="stuCheckBox"]').each(function () {
        $(this).removeAttr("checked", false);
      });
      array1.splice(0, array1.length);
      count1 = 0;
      $('#total .count').html('已选择:' + count1 + '人');
    }
  });

  //单选
  $('#chooseReceive .shopList').on('click', 'input[name=stuCheckBox]', function (event) {
    event.stopPropagation();
    var val = $(this).val();
    var counter = $('#chooseReceive input[name=stuCheckBox]').length;
    if ($(this).is(':checked')) {
      count1++;
      var obj = {};
      obj.id = $(this).val();
      obj.username = $(this).parent().siblings('.username').text();
      array1.push(obj);
      $('#total .count').html('已选择:' + count1 + '人');
      if (counter == count1 && counter != 0) {
        $('input[name="selectall"]').prop('checked', true);
      }
    } else {
      count1--;
      array1 = array1.filter(function (item) {
        return item.id != val;
      })
      $('#total .count').html('已选择:' + count1 + '人');
      if (counter != count1 && counter != 0) {
        $('input[name="selectall"]').prop('checked', false);
      }
    }
  })

  //搜索
  $('#chooseReceive .search input').on('keyup', function (event) {
    var val = $.trim($(this).val());
    if (event.keyCode == 13) {
      $('.username:contains(' + val + ')').each(function () {
        $('#chooseReceive .allChoose').hide();
        $(this).parents('.shop-item').siblings().hide();
        $(this).parent('li').siblings().hide();
        $(this).parents('.list').show();
        $(this).parents('.shop-item').find('.right').attr('class', 'down');
      })
    }
    if (event.keyCode == 8) {
      if (!val) {
        $('#chooseReceive .allChoose').show();
        $('#chooseReceive .shop-item').show();
        $('#chooseReceive .shop-item .list li').show();
      }
    }
  })

  //点击店铺显示隐藏人员
  $('#chooseReceive .shopList').on('click', '.shop-item .shopName', function (event) {
    event.stopPropagation();
    var $this = $(this).parent();
    var flag = $this.find('i:eq(0)').attr('class');
    $this.find('.list').toggle();
    if (flag == 'right') {
      $this.find('i:eq(0)').attr('class', 'down');
    } else {
      $this.find('i:eq(0)').attr('class', 'right');
    }
  })

  //提交返回首页
  $('#chooseReceive .to_submit').on('click', function () {
    if (array1.length == 0) {
      layerMsg('请至少选择1人!');
      return;
    }

    var sHtml = '';
    /*var arr = [];*/
    count = count1;
    array = array1;

    /*array = array.filter(function (item) {
      if (arr.indexOf(item.id) == -1) {
        arr.push(item.id);
        return item;
      }
    })*/

    for (var i = 0; i < array.length; i++) {
      var data = array[i];
      sHtml += '<div class="item" data-id="' + data.id + '"><i>' + data.username.slice(0, 1) + '</i><p>' + data.username + '</p></div>';
    }
    sHtml += '<div class="add-item"><i></i><p>添加人员</p></div>';
    $('#writeDaily .item-list').html(sHtml);
    $('#chooseReceive,#total').hide();
    $('#writeDaily,#bottomNav').show();
  })

  //返回首页
  $('#chooseReceive .back').on('click', function () {
    $('#chooseReceive,#total').hide();
    $('#writeDaily,#bottomNav').show();
  })

  /**************************************************************************************************************************/

  //写看日报切换
  $('#bottomNav div').on('click', function () {
    $(this).addClass('active').siblings().removeClass('active');
    var index = $(this).index();
    if (index == 0) {
      $('#lookDaily').hide();
      $('#writeDaily').show();
      $('html,body').scrollTop(0);
    } else {
      $('#writeDaily').hide();
      $('#lookDaily').show();
      $('html,body').scrollTop(0);
      $('#lookDaily .topNav li:eq(0)').click();
    }
  })

  //看日报-我发出的,我收到的
  $('#lookDaily .topNav li').on('click', function () {
    $(this).addClass('active').siblings().removeClass('active');
    $('#lookDaily .daily-list ul').html('');
    var param = {
      bussTypeId: bussTypeId,
      pagination: {
        page: 1,
        rows: 10
      },
      userId: userId
    };
    index = $(this).index();
    //我收到的
    if (index == 0) {
      reqAjaxAsync(REQUEST_URL.SELECTRECSCAPPROVALPAGE, JSON.stringify(param)).done(function (res) {
        if (res.data.length == 0) {
          $('#lookDaily .daily-list').attr('class', 'daily-list slot');
        } else {
          $('#lookDaily .daily-list').attr('class', 'daily-list');
          dailyList(res);
        }
      })
      //我提交的
    } else if (index == 1) {
      reqAjaxAsync(REQUEST_URL.SELECTDAILYSCAPPROVALPAGE, JSON.stringify(param)).done(function (res) {
        if (res.data.length == 0) {
          $('#lookDaily .daily-list').attr('class', 'daily-list slot');
        } else {
          $('#lookDaily .daily-list').attr('class', 'daily-list');
          dailyList(res);
        }
      })
    }
  })

  //跳转日报详情页面
  $('#lookDaily .daily-list').on('click', 'li', function () {
    var approvalId = $(this).attr('data-id');
    initDetails(approvalId, index);
    replyList(approvalId);
  })

  //回复日报
  $('#reply button').on('click', function () {
    var $this = $(this);
    var approvalId = $('#dailyDetails').attr('data-approvalId');
    var opinion = $.trim($(this).siblings('input').val());
    var param = {
      userId: userId,
      approvalId: approvalId,
      opinion: opinion
    }

    if (lock) {
      lock = false;
      reqAjaxAsync(REQUEST_URL.REPLAYDAILYAPPROVAL, JSON.stringify(param)).done(function (res) {
        if (res.code == 1) {
          layerMsg(res.msg);
          lock = true;
          $this.siblings('input').val('');
          setTimeout(function () {
            replyList(approvalId);
          }, 500)
        } else {
          layerMsg(res.msg);
          lock = true;
        }
      })
    }
  })

  //详情页返回首页
  $('#dailyDetails .back').on('click', function () {
    $('#dailyDetails,#reply').hide();
    $('#reply').find('input').val('');
    $('#lookDaily,#bottomNav').show();
  })

  //清空重置
  $('.today p, .coordination p, .tomorrow p, .remarks p').on('focus', function () {
    $(this).find('span').remove();
  })
  $('.today p, .coordination p, .tomorrow p').on('blur', function () {
    if (!$(this).text()) {
      $(this).html('<span>请输入</span>');
    }
  })
  $('.remarks p').on('blur', function () {
    if (!$(this).text()) {
      $(this).html('<span>备注</span>');
    }
  })

  //checkbox点击效果
  $(document).on('click', 'input:checkbox', function () {
    var $checkbox = $(this);
    if ($checkbox.data('waschecked') == true) {
      $checkbox.prop('checked', false);
      $checkbox.data('waschecked', false);
    } else {
      $checkbox.prop('checked', true);
      $checkbox.data('waschecked', true);
    }
  })

  //时间过滤
  function dateFormat(val) {
    return val.split(' ').slice(0, 1);
  }

  //审批人数组方法
  function isArray(val) {
    var arr = [];
    for (var i = 0; i < val.length; i++) {
      arr.push(val[i].id);
    }
    return arr.join(',');
  }
})(jQuery)