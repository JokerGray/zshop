/**
 * Created by Administrator on 2017/6/16.
 */
(function ($) {
  var REQUEST_URL = {
    MERCHANTORGINDEX: 'operations/merchantOrgIndex',//顶级商户组织机构树
    MERCHANTORGTREE: 'operations/merchantOrgTree',//子商户组织结构树
    PROFESSPRODUCTDETAIL: 'operationCloudShop/getProfessProductDetail',//专业制作详情
    SUBPROFESSPRODUCT: 'operationCloudShop / subProfessProduct'//提交保存接口
  }
  var layer = layui.layer,
    extend3 = '',
    extend4 = '',
    extend5 = '';
  layer.config({
    extend: 'myskin/style.css' //同样需要加载新皮肤
  });

  $(function () {
    navLeftinit();

    //上传视频
    uploadOss({
      btn: "uploadVideo",
      flag: "video",
      size: "100mb"
    });

    //上传gif
    uploadOss({
      btn: "btnGif",
      flag: "gif",
      size: "5mb"
    });

    //上传图片
    uploadOss({
      btn: "btnImg",
      flag: "img",
      size: "5mb"
    });

  })

//父级商户渲染方法
  function parentNav(res) {
    var sHtml = '';
    if (res.code == 1) {
      var data = res.data;
      for (var i = 0; i < data.length; i++) {
        sHtml +=
          '<div class="merchant" data-id="' + data[i].id + '">' +
          '<span class="glyphicon glyphicon-triangle-top"></span>' +
          '<a href="javascript:void(0)">' + data[i].name + '</a>' +
          '<div class="shop-list">' +
          '</div></div>';
      }
      $('#profess-product .nav-list').html(sHtml);
    }
  }

//子商户渲染方法
  function childNav(that) {
    var sHtml = '';
    var id = that.parent().attr('data-id');
    var param = {
      id: id
    }
    var res = reqAjax(REQUEST_URL.MERCHANTORGTREE, JSON.stringify(param));
    if (res.code == 1) {
      var data = res.data;
      for (var i = 0; i < data.length; i++) {
        var row = data[i];
        if (row.note) {
          sHtml +=
            '<div class="shop-name">' +
            '<span class="glyphicon glyphicon-circle"></span>' +
            '<a href="javascript:void(0)" data-id="' + row.note + '">' + row.name + '</a>' +
            '</div>';
        }
      }
      that.siblings('.shop-list').html(sHtml);
    } else {
      layer.msg(res.msg)
    }
  }

//父级商户渲染加载
  function navLeftinit() {
    var res = reqAjax(REQUEST_URL.MERCHANTORGINDEX);
    if (res.code == 1) {
      parentNav(res);
    } else {
      layer.msg(res.msg);
    }
  }

//点击父商户加载子店铺
  $("#profess-product .nav-list").on('click', '.glyphicon', function () {
    var classNa = $(this).attr('class');
    if (classNa == 'glyphicon glyphicon-triangle-top') {
      $(this).attr('class', 'glyphicon glyphicon-triangle-bottom');
      childNav($(this));
      $(this).siblings('.shop-list').show();
    }
    if (classNa == 'glyphicon glyphicon-triangle-bottom') {
      $(this).attr('class', 'glyphicon glyphicon-triangle-top');
      $(this).siblings('.shop-list').hide();
    }
  })

//点击搜索
  $('#search').on('click', function () {
    search();
  })

//回车搜索
  $(document).on('keyup', function (event) {
    if (event.keyCode == 13) {
      search();
    }
  })

//快速定位方法
  function search() {
    $('.merchant a').css('color', '#333333');
    $('.nav-list').scrollTop(0);
    var merchantName = $.trim($('#profess-product .nav-left input').val());
    if (merchantName) {
      $('.merchant a:contains(' + merchantName + ')').each(function () {
        $(this).css({'color': '#c83d2d'});
      })
      var length = $('.merchant a:contains(' + merchantName + ')').length;
      if (length != 0) {
        var top = $('.merchant a:contains(' + merchantName + ')').parent().eq(0).position().top - 34;
        if (top != 0) {
          $('.nav-list').scrollTop(top);
          layer.msg('已匹配符合条件的商户!');
        }
      } else {
        layer.msg('未找到符合条件的商户!');
      }
    } else {
      layer.msg('请输入商户名称!');
    }
  }

  /*******************************************************************************************/

//右侧制作列表初始化
  function leftList(that) {
    $('.liveAddress .channel:first').click();
    var shopId = that.attr('data-id');
    $('#profess-product .tabs a:eq(0)').addClass('active').siblings().removeClass('active');
    $('.live').show().siblings('.content').hide();
    $('.save').hide();
    $('.live').find('input:eq(0)').val('');
    $('.live').find('input:eq(1)').val('');
    $('#mid').val('');
    var res = tab(shopId, '3');
    if (res.data) {
      extend3 = JSON.parse(res.data.extend3);
      extend4 = JSON.parse(res.data.extend4);
      extend5 = JSON.parse(res.data.extend5);
      var url0 = extend3.pushUrl;
      var url1 = extend3.rtmpPullUrl;
      var mid = res.data.id;
      $('.live').find('input:eq(0)').val(url0);
      $('.live').find('input:eq(1)').val(url1);
      $('#mid').val(mid);
      $('.liveAddress .channel .status').html('已开通');
    }
  }

//点击子店铺右侧类目初始化
  $('#profess-product').on('click', '.shop-name a', function () {
    $(this).addClass('active').parent().siblings().find('a').removeClass('active');
    $(this).addClass('active').parents('.merchant').siblings().find('a').removeClass('active');
    $('.liveAddress .channel .status').html('未开通');
    leftList($(this));
  })

//制作列表tabs切换查询
  $('#profess-product .tabs a').on('click', function () {
    if ($('#profess-product .shop-list a[class=active]').index() == -1) {
      layer.msg('请在菜单栏选择所在商户店铺!');
      return;
    }

    var index = $(this).index();
    var shopId = $('.nav-list').find('.active').attr('data-id');
    $(this).addClass('active').siblings().removeClass('active');
    $('#profess-product .main-content .content').eq(index).show().siblings('.content').hide();

    if (index == 0) {
      $('.liveAddress .channel:first').click();
      //清空操作
      $('.save').hide();
      $('.live').find('input:eq(0)').val('');
      $('.live').find('input:eq(1)').val('');
      $('#mid').val('');
      var res = tab(shopId, '3');
      if (res.data) {
        var mid = res.data.id || '';
        var val = JSON.parse(res.data.extend3);
        var url0 = val.pushUrl || '';
        var url1 = val.rtmpPullUrl || '';
        $('.live').find('input:eq(0)').val(url0);
        $('.live').find('input:eq(1)').val(url1);
        $('#mid').val(mid);
      }
    } else if (index == 1) {
      $('.save').show();
      $('.full-screen').find('input').val('');
      $('#gifCover').html('');
      $('#mid').val('');
      var res = tab(shopId, '2');
      if (res.data) {
        var mid = res.data.id || '';
        var url = res.data.filePath || '';
        var cover = res.data.coverImagePath;
        if (cover) {
          $('#gifCover').html('<img src="' + cover + '">');
        }
        $('.full-screen').find('input').val(url);
        $('#mid').val(mid);
      }
    } else if (index == 2) {
      $('.save').show();
      $('.upload-video video').attr('src', '');
      $('#uploadCover').html('');
      $('#mid').val('');
      var res = tab(shopId, '1');
      if (res.data) {
        var mid = res.data.id || '';
        var videoUrl = res.data.filePath || '';
        var coverImagePath = res.data.coverImagePath || '';
        $('.upload-video video').attr('src', videoUrl);
        $('#uploadCover').html('<img src="' + coverImagePath + '">');
        $('#mid').val(mid);
      }
    } else if (index == 3) {
      $('.save').show();
      $('#uploadImg').html('');
      $('#mid').val('');
      var res = tab(shopId, '5');
      if (res.data) {
        var mid = res.data.id || '';
        var imgUrl = res.data.filePath || '';
        $('#uploadImg').html('<img src="' + imgUrl + '">');
        $('#mid').val(mid);
      }
    }
  })

//新增编辑保存
  $('#profess-product .main .save').on('click', function () {
    if ($('#profess-product .shop-list a[class=active]').index() == -1) {
      layer.msg('请在菜单栏选择所在商户店铺!');
      return;
    }
    var index = $('#profess-product .tabs a[class=active]').index();
    var id = $('#mid').val();
    var shopId = $('.nav-list').find('.active').attr('data-id');
    if (index == 0) {
      var fileType = 3;
      var filePath = $('.live').find('input:eq(0)').val();
      var extend1 = $('.live').find('input:eq(1)').val();
      var param = {
        id: id,
        shopId: shopId,
        fileType: fileType,
        filePath: filePath,
        extend1: extend1
      }
    } else if (index == 1) {
      var fileType = 2;
      var filePath = $('.full-screen').find('input').val();
      var coverImagePath = $('#gifCover img').attr('src');
      var param = {
        id: id,
        shopId: shopId,
        fileType: fileType,
        filePath: filePath,
        coverImagePath: coverImagePath
      }
    } else if (index == 2) {
      var fileType = 1;
      var filePath = $('.upload-video video').attr('src');
      var coverImagePath = $('#uploadCover img').attr('src');
      var param = {
        id: id,
        shopId: shopId,
        fileType: fileType,
        filePath: filePath,
        coverImagePath: coverImagePath
      }
    } else if (index == 3) {
      var fileType = 5;
      var filePath = $('#uploadImg img').attr('src');
      var param = {
        id: id,
        shopId: shopId,
        fileType: fileType,
        filePath: filePath
      }
    }
    var res = reqAjax(REQUEST_URL.SUBPROFESSPRODUCT, JSON.stringify(param));
    if (res.code == 1) {
      layer.msg(res.msg);
      $('#mid').val(res.data.id);
    } else {
      layer.msg(res.msg);
    }
  })

//获取推拉流地址
  $('#profess-product .main .btn').on('click', function () {
    if ($('#profess-product .shop-list a[class=active]').index() == -1) {
      layer.msg('请在菜单栏选择所在商户店铺!');
      return;
    }

    var id = $('#mid').val();
    var shopId = $('.nav-list').find('.active').attr('data-id');
    var fileType = 3;
    var param = {
      id: id,
      shopId: shopId,
      fileType: fileType
    }
    var res = reqAjax(REQUEST_URL.SUBPROFESSPRODUCT, JSON.stringify(param));
    if (res.code == 1) {
      extend3 = JSON.parse(res.data.extend3);
      extend4 = JSON.parse(res.data.extend4);
      extend5 = JSON.parse(res.data.extend5);
      var url0 = extend3.pushUrl;
      var url1 = extend3.rtmpPullUrl;
      $('.live').find('input:eq(0)').val(url0);
      $('.live').find('input:eq(1)').val(url1);
      $('#mid').val(res.data.id);
      layer.msg(res.msg);
    } else {
      layer.msg(res.msg);
    }
  })

//直播推拉流地址切换
  $('.liveAddress .channel').on('click', function () {
    $(this).addClass('active').siblings().removeClass('active');
    var index = $(this).index();
    if (index == 0) {
      $('.live').find('input:eq(0)').val(extend3.pushUrl);
      $('.live').find('input:eq(1)').val(extend3.rtmpPullUrl);
    }
    else if (index == 1) {
      $('.live').find('input:eq(0)').val(extend4.pushUrl);
      $('.live').find('input:eq(1)').val(extend4.rtmpPullUrl);
    } else if (index == 2) {
      $('.live').find('input:eq(0)').val(extend5.pushUrl);
      $('.live').find('input:eq(1)').val(extend5.rtmpPullUrl);
    }
  })

//查询制作类目方法
  function tab(shopId, fileType) {
    var param = {
      shopId: shopId,
      fileType: fileType
    }
    var res = reqAjax(REQUEST_URL.PROFESSPRODUCTDETAIL, JSON.stringify(param));
    if (res.code == 1) {
      return res;
    } else {
      layer.msg(res.msg);
    }
  }

//contains不区分大小写
  jQuery.expr[':'].contains = function (a, i, m) {
    return jQuery(a).text().toUpperCase()
      .indexOf(m[3].toUpperCase()) >= 0;
  };

//图片,720封面,视频封面裁剪弹窗
  $('#uploadCover,#uploadImg,#gifCover').on('click', function () {
    var $this = $(this);
    var dom = $(this).context.id;
    layer.open({
      title: ['图片裁剪', 'font-size:14px;background-color:#353b53;color:#ffffff;'],
      type: 1,
      skin: 'layer-ext-myskin',
      content: $('#img-area'),
      area: ['1200px', '750px'],
      btn: ['确定'],
      btnAlign: 'c',
      closeBtn: 1,
      scrollbar: false,
      resize: false,
      move: false,
      end: function () {
        $('#img-area').hide();
        $('.img-show').html('');
        $('#btnGif,#btnImg').hide();
      },
      success: function (layero, index) {
        $('#cut').show();
        if (dom == 'gifCover') {
          $(layero).find('#btnGif').show();
        } else {
          $(layero).find('#btnImg').show();
        }
      },
      yes: function (index, layero) {
        var len = $(".editor_img").length;
        if (!len) {
          layer.msg("请先上传图片");
          return;
        }
        var urls = $('.showArea').attr('src') ? $('.showArea').attr('src') : $('.editor_img').attr('src');
        $this.html('<img src="' + urls + '">');
        layer.close(index);
      }
    });
  })

  cutImg('cut', 750, 938);

})(jQuery)