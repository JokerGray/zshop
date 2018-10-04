/**
 * Created by Administrator on 2017/6/21.
 */
(function ($) {
  var layer = layui.layer;

  layer.config({
    extend: 'myskin/style.css' //同样需要加载新皮肤
  });

  $('#chooseShop').on('click', function () {
    if ($('#add_shop').attr('data-flag') == '0') {
      layer.open({
        type: 2,
        title: ['选择店铺', 'background:#303030;color:#fff;'],
        skin: 'layer-ext-myskin',
        area: ['700px', '550px'],
        shade: 0.5,
        closeBtn: 1,
        shadeClose: false,
        scrollbar: false,
        content: '../shop_list/shop_list.html',
        btn: ['确定'],
        btnAlign: 'c',
        yes: function (index) {
          var body = layer.getChildFrame('body');
          var shopName = body.find('.active td').eq(1).text();
          var shopId = body.find('.active').attr('data-id');
          var active = body.find('tr.active').length;
          if (!active) {
            layer.msg('请选择店铺!');
            return;
          }
          $('#chooseShop').val(shopName).attr('data-shopId', shopId);
          layer.close(index);
        }
      })
    }
  })

  //上传图片
  uploadOss({
    btn: "uploadImg",
    flag: "cover",
    size: "5mb"
  });

})(jQuery)