(function ($) {
  var REQUEST_URL = {
    GETSCNOTIFYLIST: 'oa/getScNotifyList',//公告列表
    CHECKCANSENDNOTIFY: 'oa/checkCanSendNotify',//是否能发布公告
    GETCANSENDSHOP: 'oa/getCanSendShop',//查询发布公告的店铺
    ADDNOTIY: 'oa/addNotiy',//发布公告
    GETSCNOTIFYBYID: 'oa/getScNotifyById',//查询公告详情
    DELETESCNOTIFYBYID: 'oa/deleteScNotifyById'//删除公告
  };

  var pageNo = 1;
  var pageSize = 5;
  var userId = getUrlParams('userId') || 10005;
  var shopId = getUrlParams('shopId') || 49;
  var merchantId = getUrlParams('merchantId') || 1070;
  var apikey = getUrlParams('apikey') || 'test';
  var lock = true;
  var layer = layui.layer;
  var laypage = layui.laypage;
  var laydate = layui.laydate;


  layer.config({
    extend: 'myskin/style.css'
  });

  layui.use('form', function () {
    form = layui.form;
  })

  //页面初始化&&绑定附件上传
  $(function () {
    $('#announcement ul li:eq(0)').click();

    initUpload({
      btn: 'upload',
      flag: 'word',
      type: '1',
    });
  })

  //列表渲染方法
  function init(res) {
    if (res.code == 1) {
      var sHtml = '';
      for (var i = 0; i < res.data.length; i++) {
        var data = res.data[i];
        sHtml +=
          '<div class="item" data-id="' + data.id + '">' +
          '<div class="sponsor">';
        if (data.type == 1) {
          sHtml +=
            '<i class="icon-7"></i>' +
            '<p>系统公告</p>';
        } else {
          sHtml += '<p>' + data.createUserName + '</p>'
        }
        sHtml +=
          '<div class="time">' + data.createDate + '</div>' +
          '</div>' +
          '<div class="subtitle">' + data.title + '</div>' +
          '<div class="content">' + getSimpleText(data.content) + '</div>' +
          '</div>';
      }
      $('.item-list').html(sHtml);
    } else {
      layer.msg(res.msg);
    }
  }

  //我收取的,我发送的公告切换
  $('#announcement ul li').on('click', function () {
    $(this).addClass('active').siblings().removeClass('active');
    var index = $(this).index() + 1;
    //我收取的
    if (index == 0) {
      var param = {
        type: index,
        userId: userId,
        pageNo: pageNo,
        pageSize: pageSize
      }
      //我发布的
    } else {
      var param = {
        type: index,
        userId: userId,
        pageNo: pageNo,
        pageSize: pageSize
      }
      reqAjaxAsync(REQUEST_URL.GETSCNOTIFYLIST, JSON.stringify(param)).done(function (res) {
        init(res);

        //分页
        laypage.render({
          elem: 'paging-box-r',//容器
          count: res.total,//总数
          limit: pageSize,//每页条数
          curr: function () { //通过url获取当前页，也可以同上（pages）方式获取
            var page = location.search.match(/page=(\d+)/);
            return page ? page[1] : 1;
          }(),
          layout: ['prev', 'page', 'next', 'skip'],//功能
          jump: function (obj, first) {
            var param = {
              type: index,
              userId: userId,
              pageNo: obj.curr,
              pageSize: pageSize
            }
            if (!first) {
              reqAjaxAsync(REQUEST_URL.GETSCNOTIFYLIST, JSON.stringify(param)).done(function (res) {
                init(res);
              })
            }
          }
        });
      })
    }
  });

  //发布公告
  $('#announcement .title button').on('click', function () {
    var param = {
      userId: userId
    }
    reqAjaxAsync(REQUEST_URL.CHECKCANSENDNOTIFY, JSON.stringify(param)).done(function (res) {
      if (res.code == 1) {
        if (res.data == true) {
          layer.open({
            title: ['发布公告', 'font-size:14px;background-color:#353b53;color:#1ae0d5'],
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
              $('#details-1,#single ul').hide();
              $('#details-1 form')[0].reset();//表单初始化
              $('#details-1 .annex').remove();//清除添加的附件
              $('#editor').html('');
            },
            success: function (layero, index) {
              var param = {
                userId: userId
              }
              reqAjaxAsync(REQUEST_URL.GETCANSENDSHOP, JSON.stringify(param)).done(function (res) {
                if (res.code == 1) {
                  var sHtml = '<li><input type="checkbox"><p>全部</p></li>';
                  for (var i = 0; i < res.data.length; i++) {
                    var data = res.data[i];
                    sHtml += '<li><input type="checkbox" value="' + data.id + '"><p>' + data.shopName + '</p></li>';
                  }
                  $(layero).find('#single ul').html(sHtml);
                } else {
                  layer.msg(res.msg)
                }

                $(layero).find('#single ul li:first input').click();
                $(layero).find('#single ul').hide();
              })

              //日期控件初始化
              $(layero).find('#beginTime').on('click', function () {
                laydate.render({
                  elem: '#beginTime',
                  show: true,
                  min: 0,
                  format: 'yyyy-MM-dd',
                  btns: ['confirm']
                });
              })

              form.render('select');

              editor = initEditor('editor');
            },
            yes: function (index, layero) {
              var title = $.trim($(layero).find('.layui-form-item:eq(0) input').val());
              var type = $(layero).find('.layui-form-item:eq(1) select').val();
              var noticeDate = $(layero).find('.layui-form-item:eq(3) input').val() ? $(layero).find('.layui-form-item:eq(3) input').val() + ' 23:59:59' : '';
              var shopIds = getShopIds('single');
              var status = 2;
              var content = editor.txt.html();
              var fileName = $(layero).find('.annex .txt').text();
              var fileUrl = $(layero).find('.annex').attr('data-fileUrl');
              if (!title) {
                layer.msg('请填写公告标题!');
                return
              }
              if (!shopIds) {
                layer.msg('请选择可见店铺!');
                return
              }
              if (!noticeDate) {
                layer.msg('请选择公示日期!');
                return
              }
              var param = {
                userId: userId,
                title: title,
                type: type,
                noticeDate: noticeDate,
                shopIds: shopIds,
                status: status,
                content: content,
                fileName: fileName,
                fileUrl: fileUrl
              }
              if (lock) {
                lock = false;
                reqAjaxAsync(REQUEST_URL.ADDNOTIY, JSON.stringify(param)).done(function (res) {
                  if (res.code == 1) {
                    layer.msg(res.msg);
                    setTimeout(function () {
                      layer.close(index);
                      $('#announcement .title li:eq(1)').click();
                      lock = true;
                    }, 500);
                  } else {
                    layer.msg(res.msg);
                    lock = true
                  }
                })
              }
            }
          })
        } else {
          layer.msg('该用户不能发布公告');
        }
      } else {
        layer.msg(res.msg);
      }
    })
  })

  //指定店铺显示隐藏
  $('#single').on('click', function (event) {
    $(this).find('ul').toggle();
    event.stopPropagation();
  })

  $(document).on('click', function (event) {
    $(this).find('#single ul').hide();
    event.stopPropagation();
  })

  //可选店铺全部状态勾选/取消
  $('#single ul').on('click', 'li input:first', function () {
    var flag = $(this).prop("checked");
    var others = $(this).parent().siblings().find('input');
    $.each(others, function () {
      $(this).prop("checked", flag);
    })
    if (flag) {
      $(this).parents('#single').find('.content').html('全部');
    } else {
      $(this).parents('#single').find('.content').html('');
    }
  })

  //单独店铺勾选显示
  $('#single ul').on('click', 'li input:not(":first")', function (event) {
    var $this = $(this);
    var first = $('#single ul li:first input');//第一项
    var others = $('#single ul li:not(":first") input:checked');//其余没有被勾选项
    if ($(this).is(':checked')) {
      $('#single .content').append('<span data-id="' + $this.val() + '">' + $this.siblings().text() + '&nbsp;&nbsp;' + '</span>');
    } else {
      $('#single .content').html('');
      first.prop('checked', false);
      //循环遍历所有的被勾选项
      others.each(function () {
        $('#single .content').append('<span data-id="' + $(this).val() + '">' + $(this).siblings('p').text() + '&nbsp;&nbsp;' + '</span>')
      })
    }
    event.stopPropagation();
  })

  //公告详情弹窗
  $('#announcement .item-list').on('click', '.item', function () {
    var id = $(this).attr('data-id');
    var param = {
      userId: userId,
      id: id
    }
    reqAjaxAsync(REQUEST_URL.GETSCNOTIFYBYID, JSON.stringify(param)).done(function (res) {
      if (res.code == 1) {
        var data = res.data;
        layer.open({
          title: ['公告详情', 'font-size:14px;background-color:#353b53;color:#1ae0d5'],
          type: 1,
          skin: 'layer-ext-myskin',
          content: $('#details-2'),
          area: ['700px', '700px'],
          closeBtn: 1,
          scrollbar: false,
          resize: false,
          move: false,
          end: function () {
            $('#details-2').hide();
            $('#details-2 .annex-content').hide();
            $('#details-2 a').hide();
          },
          success: function (layero, index) {
            if (userId == data.scNotify.createUser) {
              $('#details-2 a').show();
            }
            $(layero).find('#details-2').attr('data-id', data.scNotify.id);
            $(layero).find('.subtitle').html(data.scNotify.title);
            $(layero).find('.end-date').html('公示期至 ' + data.scNotify.noticeDate);
            $(layero).find('.name').html(data.scNotify.createUserName);
            $(layero).find('.content').html(data.scNotify.content);
            if (data.scNotify.fileUrl) {
              $(layero).find('.annex-content').show().html(
                '<i class="wps"></i>' +
                '<p class="txt">' + data.scNotify.fileName + '</p>' +
                '<a class="download" href="' + data.scNotify.fileUrl + '" download="' + data.scNotify.fileName + '">下载</a>');
            }
            $(layero).find('.start-date').html(data.scNotify.createDate);
            $(layero).find('.range').html('可见范围：' + data.visibleRange);
          }
        })
      }
    })
  })

  //删除公告
  $('#details-2 a').on('click', function () {
    var id = $(this).parents('#details-2').attr('data-id');
    var param = {
      userId: userId,
      id: id
    }
    layer.confirm('确定要删除此公告吗?', {title: '提示'}, function (index) {
      if (lock) {
        lock = false;
        reqAjaxAsync(REQUEST_URL.DELETESCNOTIFYBYID, JSON.stringify(param)).done(function (res) {
          if (res.code == 1) {
            layer.msg('删除成功');
            setTimeout(function () {
              location.reload(true);
            }, 500);
          } else {
            layer.msg(res.msg);
            lock = true;
          }
        })
      }
    })
  })

  //删除附件
  $('#details-1').on('click', '.annex .layui-icon', function () {
    $(this).parent().remove();
  })

  //遍历商户id方法
  function getShopIds(dom) {
    var arr = [];
    $('#' + dom + ' li:not(":first") input:checked').each(function (i, e) {
      arr.push($(e).val());
    })
    var str = arr.join(',');
    return str;
  }
})
(jQuery)