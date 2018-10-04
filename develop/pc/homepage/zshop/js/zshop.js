$(function() {


  $(".loader").hide()
  $(".Nav").show()
  $("#full").show()
  resize()


  // 刷新页面  NAV a 标签的 样式
  $.each($("#headnav a"), function(i, item) {
    $(item).removeClass("visited")
    if ($(item).attr("href") == location.hash) {
      $(item).addClass("visited")
    }
  })
  $("#full").fullpage({
      anchors: ['首页', '销售篇', '前台服务篇', '员工操作篇', '店长管理篇', 'footerPage'],
      menu: '#myMenu',
      navigation: true,
      navigationPosition: "left",
      scrollingSpeed: 700,
      fitToSection: true,
      afterRender: function() {
        $('.footerPage>div').css('width', '100%');
      },
      afterLoad: function(anchorLink, index) {

        $.each($("#headnav a"), function(i, item) {
          $(item).removeClass("visited")
          if ($(item).text() == anchorLink) {
            $(item).addClass("visited")
          }
        })

        $.each($("video"),function(i, item){
        		item.pause()
        		if(i==index-2){

        			item.play()
        		}
        })
      }
    })
    // 刷新页面  NAV a 标签的 样式
  $.each($("#headnav a"), function(i, item) {
    $(item).removeClass("visited")
    if ($(item).attr("href") == location.hash) {
      $(item).addClass("visited")
    }
  })


  // 导航点击事件
  $("#headnav a").on('click', function() {
      if ($(this).text() == location.hash.replace(/#/g, "")) {
        return false
      }
      $("#headnav a").removeClass("visited")
      $(this).addClass("visited")
      var $this = $(this)
      $.each($("#headnav a"), function(i, item) {
        if ($(item) == $this) {
          var $that = $('.section').eq(i + 1)
        }
      })
    })

  $("video").on("play", function() {
    $(this).siblings("i").addClass("gone")
  })
  $("video").on("pause", function() {
    $(this).siblings("i").removeClass("gone")
  })
  $("video").siblings("i").on("click", function() {
    $(this).siblings("video")[0].play()
  })
  $("video").on("click", function() {
    if ($(this).siblings("i").hasClass("gone")) {
      $(this)[0].pause()
    } else {
      $(this)[0].play()
    }
  })

  function resize() {
    var boWidth = $('body').width()
    if (boWidth < 1024) {
      $("html").css("font-size", 1024 / 1920)
    } else {
      var fz = (boWidth / 1920) * 100
      $("html").css("font-size", fz)
    }
  }

  $(window).on("resize", function() {
    resize()
  })
})
