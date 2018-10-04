(function ($) {
  var E = window.wangEditor;
  var editor = new E('#editor');
  editor.customConfig.uploadImgServer = '/upload'  //上传图片到服务器
  editor.customConfig.showLinkImg = false //隐藏网络图片
  // 或者 var editor = new E( document.getElementById('#editor') )
  editor.create()
})(jQuery)