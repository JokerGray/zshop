/**
 * Created by Administrator on 2017/6/16.
 */
(function ($) {
  const REQUEST_URL = {
    MERCHANTORGINDEX: 'operations/merchantOrgIndex',//顶级商户组织机构树
    MERCHANTORGTREE: 'operations/merchantOrgTree',//子商户组织结构树
    PROFESSPRODUCTDETAIL: 'operationCloudShop/getProfessProductDetail',//专业制作详情
    SUBPROFESSPRODUCT: 'operationCloudShop / subProfessProduct'//提交保存接口
  }

  var layer = layui.layer;

  //父级商户渲染方法
  function parentNav(res) {
    var sHtml = '';
    if (res.code == 1) {
      var row = res.data;
      for (var i = 0; i < row.length; i++) {
        var rowA = row[i];
        sHtml +=
          '<div class="merchant" data-id="' + rowA.id + '">' +
          '<span class="glyphicon glyphicon-triangle-top"></span>' +
          '<a href="javascript:void(0)">' + rowA.name + '</a>' +
          '<div class="shop-list">' +
          '</div></div>';
      }
      $('#profess-product .nav-list').html(sHtml);
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

  navLeftinit();

  //子商户渲染方法
  function childNav(that) {
    var sHtml = '';
    var parentId = that.parent().attr('data-id');
    var res = reqAjax(REQUEST_URL.MERCHANTORGTREE, "{'id':'" + parentId + "'}");
    if (res.code == 1) {
      var row = res.data;
      for (var i = 0; i < row.length; i++) {
        var rowA = row[i];
        sHtml +=
          '<div class="shop-name">' +
          '<span class="glyphicon glyphicon-circle"></span>' +
          '<a href="javascript:void(0)" data-id="' + rowA.note + '">' + rowA.name + '</a>' +
          '</div>';
      }
      that.siblings('.shop-list').html(sHtml);
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

  /*******************************************************************************************/

  //查询方法
  function tab(shopId, fileType) {
    var res = reqAjax(REQUEST_URL.PROFESSPRODUCTDETAIL, "{'shopId':'" + shopId + "','fileType':'" + fileType + "'}");
    return res;
  }

  //右侧制作列表初始化
  function mainContent(that) {
    var shopId = that.attr('data-id');
    $('.live').find('input:eq(0)').val('');
    $('.live').find('input:eq(1)').val('');
    var res = tab(shopId, '3');
    if (res.data != null) {
      //推流
      var url0 = res.data.filePath;
      //拉流
      var url1 = res.data.extend1;
      var mid = res.data.id;
      $('.live').find('input:eq(0)').val(url0);
      $('.live').find('input:eq(1)').val(url1);
      $('#mid').val(mid);//切换店铺更改mid
    } else {
      $('.live').find('input:eq(0)').val('');
      $('.live').find('input:eq(1)').val('');
      $('#mid').val('');//切换店铺更改mid
    }
  }

  //点击商铺渲染右侧列表
  $('#profess-product').on('click', '.shop-name a', function () {
    $(this).addClass('active').parent().siblings().find('a').removeClass('active');
    $(this).addClass('active').parents('.merchant').siblings().find('a').removeClass('active');
    mainContent($(this));
    $('#profess-product .tabs a:eq(0)').addClass('active').siblings().removeClass('active');
    $('.live').show().siblings('.content').hide();
  })


  //制作列表tabs切换查询
  $('#profess-product').on('click', '.main .tabs a', function () {
    if ($('#profess-product .shop-list a[class=active]').index() == -1) {
      layer.msg('请在菜单栏选择所在商户店铺!');
      return;
    }
    var index = $(this).index();
    $(this).addClass('active').siblings().removeClass('active');
    var shopId = $('.nav-list').find('.active').attr('data-id');
    $('#profess-product .main-content .content').eq(index).show().siblings('.content').hide();
    if (index == 0) {
      $('.live').find('input:eq(0)').val('');
      $('.live').find('input:eq(1)').val('');
      var res = tab(shopId, '3');//直播
      if (res.code == 1) {
        if (res.data != null) {
          var mid = res.data.id;
          var url0 = res.data.filePath;
          var url1 = res.data.extend1;
          $('.live').find('input:eq(0)').val(url0);
          $('.live').find('input:eq(1)').val(url1);
          $('#mid').val(mid);//切换更改mid
        } else {
          $('.live').find('input:eq(0)').val('');
          $('.live').find('input:eq(1)').val('');
          $('#mid').val('');//切换更改mid
        }
      }
    } else if (index == 1) {
      $('.full-screen').find('input').val('');
      var res = tab(shopId, '2');
      if (res.code == 1) {
        if (res.data) {
          var mid = res.data.id;
          var url = res.data.filePath;
          $('.full-screen').find('input').val(url);
          $('#mid').val(mid);//切换更改mid
        } else {
          $('.full-screen').find('input').val('');
          $('#mid').val('');//切换更改mid
        }
      }
    } else if (index == 2) {
      $('.upload-video video,.upload-video img').attr('src', '');
      var res = tab(shopId, '1');
      if (res.code == 1) {
        var id = res.data.id;
        var videoUrl = res.data.filePath;
        var coverImagePath = res.data.coverImagePath;
        $('.upload-video video').attr('src', videoUrl);
        $('.upload-cover img').attr('src', coverImagePath);
        $('#mid').val(mid);//切换更改mid
      }
    } else if (index == 3) {
      $('.upload-img img').attr('src', '');
      var res = tab(shopId, '5');
      if (res.code == 1) {
        var mid = res.data.id;
        var imgUrl = res.data.filePath;
        $('.upload-img img').attr('src', imgUrl);
        $('#mid').val(mid);//切换更改mid
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
      if (index == 0) {
        var mid = $('#mid').val();
        var shopId = $('.nav-list').find('.active').attr('data-id');
        var fileType = 3;
        var filePath = $('.live').find('input:eq(0)').val();
        var extend1 = $('.live').find('input:eq(1)').val();
        var param = "{'id':'" + mid + "','shopId':'" + shopId + "','fileType':'" + fileType + "','filePath':'" + filePath + "','extend1':'" + extend1 + "'}";
        var res = reqAjax(REQUEST_URL.SUBPROFESSPRODUCT, param);
        if (res.code == 1) {
          layer.msg(res.msg);
          //如果拉推为空,则将mid删除清空
          if (!filePath && !extend1) {
            $('#mid').val('');
          } else {
            $('#mid').val(tab(shopId, 3).data.id);
          }
        } else {
          layer.msg(res.msg);
        }
      } else if (index == 1) {
        var mid = $('#mid').val();
        var shopId = $('.nav-list').find('.active').attr('data-id');
        var fileType = 2;
        var filePath = $('.full-screen').find('input').val();
        var param = "{'id':'" + mid + "','shopId':'" + shopId + "','fileType':'" + fileType + "','filePath':'" + filePath + "'}";
        var res = reqAjax(REQUEST_URL.SUBPROFESSPRODUCT, param);
        if (res.code == 1) {
          layer.msg(res.msg);
          //如果拉推为空,则将mid删除清空
          if (!filePath) {
            $('#mid').val('');
          } else {
            $('#mid').val(tab(shopId, 2).data.id);
          }
        } else {
          layer.msg(res.msg);
        }
      } else if (index == 2) {
        var mid = $('.upload-video video').attr('data-mid');
        var shopId = $('.nav-list').find('.active').attr('data-id');
        var fileType = 1;
        var filePath = $('.upload-video video').attr('src');
        var coverImagePath = $('.upload-cover img').attr('src');
        if (mid == undefined || mid == null || mid == '' || mid === 'null') {
          var param = "{'shopId':'" + shopId + "','fileType':'" + fileType + "','filePath':'" + filePath + "','coverImagePath':'" + coverImagePath + "'}";
        } else {
          var param = "{'id':'" + mid + "','shopId':'" + shopId + "','fileType':'" + fileType + "','filePath':'" + filePath + "','coverImagePath':'" + coverImagePath + "'}";
        }
        var res = reqAjax(REQUEST_URL.SUBPROFESSPRODUCT, param);
        if (res.code == 1) {
          layer.msg(res.msg);
        } else {
          layer.msg(res.msg);
        }
      } else if (index == 3) {
        var mid = $('.upload-img img').attr('data-mid');
        var shopId = $('.nav-list').find('.active').attr('data-id');
        var fileType = 5;
        var filePath = $('.upload-img img').attr('src');
        if (mid == undefined || mid == null || mid == '' || mid === 'null') {
          var param = "{'shopId':'" + shopId + "','fileType':'" + fileType + "','filePath':'" + filePath + "'}";
        } else {
          var param = "{'id':'" + mid + "','shopId':'" + shopId + "','fileType':'" + fileType + "','filePath':'" + filePath + "'}";
        }
        var res = reqAjax(REQUEST_URL.SUBPROFESSPRODUCT, param);
        if (res.code == 1) {
          layer.msg(res.msg);
        } else {
          layer.msg(res.msg);
        }
      }
    }
  )

  //获取推拉流地址
  $('#profess-product .main .btn').on('click', function () {
    if ($('#profess-product .shop-list a[class=active]').index() == -1) {
      layer.msg('请在菜单栏选择所在商户店铺!');
      return;
    }

    var mid = $('#mid').val();
    var shopId = $('.nav-list').find('.active').attr('data-id');
    var fileType = 3;
    var param = "{'id':'" + mid + "','shopId':'" + shopId + "','fileType':'" + fileType + "'}";
    var res = reqAjax(REQUEST_URL.SUBPROFESSPRODUCT, param);
    if (res.code == 1) {
      $('.live').find('input:eq(0)').val(res.data.filePath);//推流
      $('.live').find('input:eq(1)').val(res.data.extend1);//拉流
      layer.msg(res.msg);
    }
  })

  //上传视频
  uploadOss({
    btn: "uploadVideo",
    flag: "video",
    size: "2048mb"
  });

  //上传封面
  uploadOss({
    btn: "uploadCover",
    flag: "cover",
    size: "5mb"
  });

  //上传图片
  uploadOss({
    btn: "uploadImg",
    flag: "img",
    size: "5mb"
  });

  /*//判断字段是否为空
   function isNull(val) {
   if (val == null || val == "null" || val == undefined) {
   return '';
   }
   return val;
   }*/
})(jQuery)