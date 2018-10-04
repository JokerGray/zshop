function cutImg(e, width, height) {
  $('#' + e).click(function () {
    var act_width = parseInt($('.editor_imghid').css('width'));//实际宽度
    var act_height = parseInt($('.editor_imghid').css('height'));//实际高度
    var len = $(".editor_img").length;
    if (!len) {
      layer.msg("请先上传图片");
      return;
    }

    if (act_width < width || act_height < height) {
      layer.msg("图片宽高小于裁剪尺寸750*938像素,请直接点击确定保存!");
      return;
    }

    $('#' + e).hide();
    $('.editor_img').hide();
    $('.editor_imghid').show();
    $('.editor_imghid').Jcrop({
      setImage: function () {
        console.log(this.getBounds())
      },
      setSelect: [0, 0, width, height],
      allowSelect: false,
      bgFade: false,
      removeFilter: true,
      allowMove: true,
      allowResize: false,
      onSelect: function (obj) {
        $("#x1").val(obj.x);
        $("#y1").val(obj.y);
        $("#x2").val(obj.x2);
        $("#y2").val(obj.y2);
        $("#w").val(obj.w);
        $("#h").val(obj.h);
        var srcStr = $('.editor_img').attr('src');
        if (srcStr.indexOf('?') != -1) {
          srcStr = srcStr.substring(0, srcStr.indexOf('?'));
        }
        srcStr = srcStr + '?x-oss-process=image/crop,x_' + Math.floor(obj.x) + ',y_' + Math.floor(obj.y) + ',w_' + width + ',h_' + height + ',g_nw';
        $('.showArea').attr('src', srcStr).show();
      },
      boxWidth: 550
    }, function () {
      var jcropApi = this;
      console.log(jcropApi.getBounds())
    });
  });
}