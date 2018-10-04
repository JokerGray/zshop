(function ($) {
  var page = 1;
  var rows = 6;
  var userId = 10073;
  var shopId = 49;
  var merchantId = 1070;
  var layer = layui.layer;
  var laypage = layui.laypage;
  var layedit = layui.layedit;
  var laydate = layui.laydate;

  layer.config({
    extend: 'myskin/style.css'
  });

  //添加管理员弹窗
  $('#announcement .title button').click(function () {
    layer.open({
      title: ['添加管理员', 'font-size:14px;background-color:#353b53;color:#1ae0d5'],
      type: 1,
      skin: 'layer-ext-myskin',
      content: $('#details-1'),
      area: ['700px', '853px'],
      btn: ['确定', '取消'],
      btnAlign: 'r',
      closeBtn: 1,
      scrollbar: false,
      resize: false,
      move: false,
      end: function () {
        $('#details-1').hide();
        $('#details-1 form')[0].reset();//表单初始化
        $('#details-1 button:eq(0)').click();
      },
      success: function (layero, index) {

      },

      yes: function (index, layero) {

      },

      btn2: function (index, layero) {

        return false;
      }
    })
  })

  //弹框指定角色切换
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

  //绑定编辑按钮
  $('#announcement table').on('click', '.edit', function () {
    layer.open({
      title: ['添加管理员', 'font-size:14px;background-color:#353b53;color:#1ae0d5'],
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
      },
      success: function (layero, index) {

      },

      yes: function (index, layero) {

      },

      btn2: function (index, layero) {

        return false;
      }
    })
  })

})(jQuery);