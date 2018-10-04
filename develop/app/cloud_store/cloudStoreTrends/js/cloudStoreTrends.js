(function ($) {
  var RESULT_URL = {
    getFansVAById: "circle/getFansVAById",//粉团队动态详情
    getVAByIdNew20: "circle/getVAByIdNew20",//圈子动态详情
    delVAById20: "circle/delVAById20",//圈子动态删除
    delVAByIdFansTeam: "circle/delVAByIdFansTeam",	//粉团队动态删除
    getVideoList: "circleBack/getVideoList",	//查询风采列表
    getCircleList: "circleBack/getCircleList",	//查询圈子/粉团队
    addVideo: "circleBack/addVideo",	//发布风采
    delComment: "circle/delComment",//删除评论
    delReply: "circle/delReply",//删除回复
    getShop: "shop/getShopByID",//选择店铺名称
  }
  var shopId = getUrlParams("shopId");
  var userId = getUrlParams("userId");
  var backWebRoot = getUrlParams("backWebRoot");
  var merchantId = getUrlParams("merchantId");
  var page = 1;
  var rows = 4;
  var pageMore = 3;
  var clciknum = 1;
  var lock = true;
  var layer = layui.layer;
  var clickNUm = true;
  var optionNum = true;

  layer.config({
    extend: 'myskin/style.css'
  });

  //页面初始化
  $(function () {
    initial();
  });

  // 初始化
  function initial() {
    up = initUpload({
      //图片视频上传
      btn: 'fakeBtn',
      flag: 'videoImg',
      type: '3',
    });

    upImgBtn=initUpload({
      //图片上传
      btn: 'ImgBtn',
      flag: 'image',
      type: '3',
    });
    upfrontIMG=initUpload({
      //上传封面
      btn: 'frontIMG_video',
      flag: 'image',
      type: '2',
    });

    //清空操作
    delPublish();

    //修改时间
    setInterval(clock, 1000);

    //切换到动态管理页面
    $("#managementTrends").click();

    //获取中间详情列表
    getVideoList(page);

    //修改店名
    var parm = {
      id: $.trim(shopId),
    }
    reqAjaxAsync(RESULT_URL.getShop, JSON.stringify(parm))
      .done(function (res) {
        if (res.code == 1) {
          var data = res.data;
          if (data == null || data == " undefind " || data == "") {
            return false;
          }
          var name = data.shopName;
          $(".onetitle").html(name);
        }
      })

    $(".panel_store1").hide();
    $(".panel_store2").show();
    $(".publih_trends").hide();
    $(".dynamicDetails").hide();

    //初始化上传视频/图片
    // clickNUm=true;
    // $(".add_tips").hide();
    $(".addPIC").css("cursor", "pointer")
    // $(".previewIMG").attr("data-type",3)
  };

  //创建粉团队
  $(".create_Team").on('click', function () {
    changeMenuClik(4, backWebRoot);
  });

  //tab栏切换
  $(".checktags").on("click", 'li', function () {
    $(this).addClass("active").siblings().removeClass("active");
      var index = $(this).index();
      changeMenuClik(index, backWebRoot);
      if (index == 0) {
        changeMenuClik(1, backWebRoot);
        //获取中间详情列表
        getVideoList(page);
    }else if (index == 1) {
        changeMenuClik(2, backWebRoot);
      } else if (index == 2) {
        //return layer.msg("此功能正在开发中，敬请期待！")
        changeMenuClik(3, backWebRoot);
      } else if (index == 3) {
        changeMenuClik(4, backWebRoot);
      }
  });

  //发布动态
  $("#publishTrends ").click(function () {
    var change = $(this).attr("data-change");
    //不可点击
    if (change == 0) {
      return false
    } else {
      $(this).addClass("active").siblings().removeClass("active");
      $(".panel_store1").show();
      $(".panel_store2").hide();
      $(".publih_trends").show();
      $(".dynamicDetails").hide();
    }
  });

  //动态管理
  $("#managementTrends").click(function () {
    var change = $(this).attr("data-change");
    if (change == 0) {
      return false
    } else {
      $(this).addClass("active").siblings().removeClass("active");
      $(".panel_store1").hide();
      $(".panel_store2").show();
      $(".publih_trends").hide();
      // $(".dynamicDetails").show();
      delPublish();
    }
  });

  //动态详情发布动态
  $(".publishBackgrd .publishTrends").click(function () {
    $("#publishTrends ").click()
  });

  //发布动态内容同步预览
  $("#toEdit").keyup(function () {
    var val = $(this).val();
    $(".previewContent .text").html(val);

  });

  //发布动态选择圈子加载下拉框
  $(document).bind('click', function () {
    $('.optionSHOP').hide();
  });
  $('.selectTAB').bind('click', function (e) {

    if (lock) {
      $('.optionSHOP').show();
      getTeamOPtion();


      lock = false;
    } else {
      $('.optionSHOP').hide();
      lock = true;
    }

    stopPropagation(e);//调用停止冒泡方法,阻止document方法的执行
  });

  //为每个下拉框选项添加事件
  $('.optionSHOP').on("click", "li", function (e) {
    var id = $(this).attr("data-id");
    var type = $(this).attr("data-type");
    var imgURL = $(this).children("img").attr("src");
    var name = $(this).children("span").text();
    var html = '<p class="oneSHOP" data-name="' + name + '" data-id="' + id + '" data-type="' + type + '">\n' +
      '            <img src="' + imgURL + '" >\n' +
      '            <span>' + name + '' +
      '             <a class="delbtn"> × </a>\n' +
      '            </span>\n' +
      '          </p>'
    var shtml = '<li data-id="' + id + '">\n' +
      '               <img src="' + imgURL + '" >\n' +
      '               <span>' + name + '</span>\n' +
      '             </li>'

    var thtml = '<div class="title" data-id="' + id + '">\n' +
      '                <img src="' + imgURL + '" class="teamTag"  >\n' +
      '                <span>' + name + '</span>\n' +
      '               ' + getTeamType(type) + '' +
      '              </div>'

    stopPropagation(e);

    // $('.oneSHOP[data-id="' + id + '"]').remove();
    // $('.propmtTab li[data-id="' + id + '"]').remove();

    if (optionNum) {
      $(this).parents(".optionSHOP").prev().children(".theOneShop").append(html);
      $(this).addClass("active");
      $(".previewContent .preview .title_preview").html(thtml);
      optionNum = false;
    } else {
      // var ids = $(".previewContent .preview .title_preview .title").attr("data-id");
      var ids = $(".selectTAB .oneSHOP:first-child").attr("data-id");
      //点击了第一个
      if (id == ids) {
        delFirstOption();
      } else {
        $(this).parents(".optionSHOP").prev().children(".theOneShop").append(html);
        $(".propmtTab").append(shtml);
        $(this).addClass("active");
      }
    }
  });

  // 为每个选中的下拉框选项添加事件
  $('.optionSHOP').on("click", ".active", function (e) {
    var id = $(this).attr("data-id");
    var ids = $(".selectTAB .oneSHOP:first-child").attr("data-id");
    $(this).removeClass("active");
    //如果是第一个被点击
    if (id == ids) {
      var len = $(".selectTAB .theOneShop .oneSHOP").length;
      if (len == 1) {
        $(".previewContent .title_preview").html('');
        $(".selectTAB .oneSHOP:first-child").remove();
        optionNum = true;

      } else {
        var dom = $(".theOneShop .oneSHOP:nth-child(2)");
        var theid = dom.attr("data-id");
        var imgurl = dom.children("img").attr("src");
        var text = dom.attr("data-name");
        var type = dom.attr("data-type");

        //同步头像改变
        var thtml = '<div class="title" data-id="' + theid + '">\n' +
          '                <img src="' + imgurl + '" class="teamTag"  >\n' +
          '                <span>' + text + '</span>\n' +
          '               ' + getTeamType(type) + '' +
          '              </div>'
        $(".previewContent .preview .title_preview").html(thtml);
        //移除列表第一行
        $(".selectTAB .oneSHOP:first-child").remove();
        $('.propmtTab li[data-id="' + id + '"]').remove();
      }
    } else {
      stopPropagation(e);
      $('.oneSHOP[data-id="' + id + '"]').remove();
      $('.propmtTab li[data-id="' + id + '"]').remove();
    }
  });

  //删除选择的团队
  $(".selectTAB").on("click", ".delbtn", function () {
    var elem = $(this).parents(".oneSHOP");
    var id = elem.attr("data-id");
    elem.remove();
    $('.propmtTab li[data-id="' + id + '"]').remove();
    $('.optionSHOP li[data-id="' + id + '"]').removeClass("active");
  });

  //删除第一个选择的团队
  $(".selectTAB").on("click", ".oneSHOP:first-child .delbtn", function () {
    delFirstOption();
  });

  //上传图片视频
  $(".addPIC").click(function () {
    if (clickNUm) {
      $("#fakeBtn").click();

      clickNUm = false;
    } else {
      var type = $(".previewIMG").attr("data-type");

      // var name = $(".previewIMG .parentPic").eq(0).attr("data-name");
      // console.log(name);
      if (type == 3) {
        $("#fakeBtn").click();

        clickNUm = false;
      }
      //第一次上传的是照片
      else if (type == 1) {

        //判断图片数量大于9不能点击
        var len = $(".previewIMG").find("div.parentPic").length;
        if (len == 9) {
          $(".addPIC").css("cursor", "not-allowed")
          return layer.msg("只能上传9张图片");
        } else {
          $(".addPIC").css("cursor", "pointer")
        }
        $("#ImgBtn").click();

        //第一次上传的是视频
      } else if (type == 2) {
        $(".addPIC").css("cursor", "not-allowed");
        layer.msg("只能上传一条视频，请继续上传视频封面！");
        return false;
      }
    }
  });

  //上传视频封面
  $("#addVedioIamges").click(function () {

    var len = $(".previewIMG .vedioIMGBox img").length;
    if (len == 1) {
      $("#addVedioIamges").css("cursor", "not-allowed");
      return layer.msg("只能上传一张封面");
    }
    $("#frontIMG_video").click();
  });

  //删除图片
  $(".previewIMG ").on("click", ".toDelPic", function () {
    var dom = $(this);
    var parent = dom.parent();
    parent.remove();

    //判断图片数量大于9不能点击
    var len = $(".previewIMG").find("div.parentPic").length;

    if (len == 0) {
      $(".previewIMG").attr("data-type", 3);
      clickNUm = true;
      $(".addPIC").css("cursor", "pointer");
    }

    if (len == 9) {
      $(".addPIC").css("cursor", "not-allowed")
    } else {
      $(".addPIC").css("cursor", "pointer")
    }
  });

  //删除视频
  $(".previewIMG ").on("click", ".toDelvideo", function () {
    var dom = $(this);
    var parent = dom.parent();
    parent.remove();
    clickNUm = true;
    $(".previewIMG").attr("data-type", 3);
    $(".addPIC").css("cursor", "pointer");
    //删除封面
    $(".previewIMG .vedioIMGBox").remove();
    $(".add_tips").hide();

    upfrontIMG.destroy();
  });

  //删除视频封面
  $(".previewIMG ").on("click", ".toDelvideoIMG", function () {
    var dom = $(this);
    var parent = dom.parent();
    parent.remove();
    //清空封面地址
    $(".previewIMG").attr("data-vedioImg", '');
    $("#addVedioIamges").css("cursor", "pointer");
  });

  //详情列表加载更多点击事件//分页
  $(".trendsContent .readMore").click(function () {
    clciknum++;
    var param = {
      sStartpage: clciknum,
      shopId: shopId,
      merchantId: merchantId,
      sPagerows: rows,
      orderType: 1,
    }
    reqAjaxAsync(RESULT_URL.getVideoList, JSON.stringify(param))
      .done(function (res) {
        var data = res.data;
        if (data == null || data == " undefind " || data == "") {
          $(".readMore").hide();
          return layer.msg("暂无数据");
        }
        if (res.code == 1) {
          var len = data.length;
          //出现加载更多的按钮
          if (len > pageMore) {
            $(".trendsDetails .readMore").show();
          } else {
            $(".trendsDetails .readMore").hide();
          }
          var shtml = getString(data);
          $(".trendsDetails .appendDetails").append(shtml);
        } else {
          layer.msg(res.msg);
        }

      })
  });

  //查看详情列表添加点击事件
  $(".trendsContent").on("click", '.detailContent', function () {
    var id = $(this).attr("data-videoAlbumId");
    var type = $(this).attr("data-type");
    $(this).addClass('active').siblings().removeClass("active");
    getMOreDetails(type, id);
    $(".dynamicDetails").show();
  });

  //动态详情删除
  $(".dynamicDetails .operationBtn .delBtn").click(function () {
    var type = $(".dynamicDetails .detailsTitel").attr("data-type");
    //动态id
    var videoAlbumId = $(".dynamicDetails .detailsTitel").attr("data-videoAlbumId");
    //圈子id
    var CircleId = $(".dynamicDetails .detailsTitel").attr("data-videoAlbumCircleId");
    delDetails(type, videoAlbumId, CircleId, userId);
  });

  //关闭动态
  $(".dynamicDetails .operationBtn .closebtn").click(function () {
    $(".dynamicDetails").hide();
  })

  //发布动态
  $(".publih_trends .pulishBtn").click(function () {
    var type = $(".previewIMG").attr("data-type");
    var imgurl = [];
    var circleList = [];
    var videoAlbumCoverUrl = '';
    var editHtml = $.trim($("#toEdit").val());
    var SHOPhtml = $(".title_preview .title").attr("data-id");
    //照片
    if (type == 1) {
      $(".previewIMG .parentPic img").each(function () {
        var url = $(this).attr("src");
        imgurl.push(url);
      })
      imgurl = imgurl.toString();
      //视频
    } else if (type == 2) {
      var src = $(".vedioBox video").attr("src");
      imgurl.push(src);
      imgurl = imgurl.toString();
      //视频封面
      videoAlbumCoverUrl = $(".previewIMG .vedioIMGBox img").attr("src");
      if (!videoAlbumCoverUrl) {
        return layer.msg("请上传视频封面");
      }
      //文字
    } else if (type == 3) {
      imgurl = '';
      videoAlbumCoverUrl = '';
      if (!editHtml) {
        return layer.msg("请填写内容")
      }
    }
    //店铺
    $(".publih_trends .oneSHOP").each(function () {
      var id = $(this).attr("data-id");
      var type = $(this).attr("data-type");
      circleList.push({
        circleType: type,
        circleId: id
      })
    })
    if (!SHOPhtml) {
      return layer.msg("请选择所属团队")
    }
    var param = {
      circleList: circleList,
      videoAlbumType: type,
      userId: userId,
      videoAlbumUrl: imgurl,
      videoAlbumDescription: $("#toEdit").val(),
      videoAlbumCoverUrl: videoAlbumCoverUrl,
    }
    reqAjaxAsync(RESULT_URL.addVideo, JSON.stringify(param))
      .done(function (res) {
        if (res.code == 1) {
          layer.msg("发布成功");
          up.destroy();
          upImgBtn.destroy();
          upfrontIMG.destroy();
          // initial();
          window.location.reload(true);
        } else {
          layer.msg(res.msg);
        }
      })
  });

  //取消动态
  $(".publih_trends .operationBtn .delBtn").click(function () {
    delPublish();
    $("#managementTrends").click();
  });

  //查看详情大图
  $(".dynamicDetails").on("click", ".imgHTML", function () {
    var src = $(this).attr("src");

    $(".motai").show();
    $(".motaiimg").attr("src", src);
  });

  //关闭详情大图
  $(".motai").on("click", "#close", function () {
    $(this).parents(".motai").hide()
  });

  //查看更多评论
  $(".getMoreDetails ").on("click", ".checkMore", function () {
    $(".reply").each(function (i, v) {

      $(".getMoreDetails .reply").each(function (i, v) {
        if (i > 1) {
          $(".getMoreDetails .reply").eq(i).show();
        }
      })
    })
    $(this).hide();
  });

  //删除评论
  $(".dynamicDetails").on("click", ".del_commentBtn", function () {
    var dom = $(this);
    var id = $(this).attr("data-suserid");
    var param = {
      sId: id,
    }
    reqAjaxAsync(RESULT_URL.delComment, JSON.stringify(param))
      .done(function (res) {
        if (res.code == 1) {

          var count = $(".appendDetails>.active .data li:nth-child(2)").text();
          count--;
          $(".appendDetails>.active .data li:nth-child(2)").html(count);

          // console.log(count);
          if (count == 0) {
            $(".comment_tab").hide();
          }

          layer.msg("删除成功");
          dom.parents(".reply").remove();
        } else {
          layer.msg(res.msg);
        }
      })
  });

  //删除回复
  $(".dynamicDetails").on("click", ".reply_delBtn", function () {
    var userId = $(this).parents(".reply").attr("data-suserid")
    var replyId = $(this).attr("data-replyuserid");
    var dom = $(this);
    var param = {
      sId: userId,
      replyId: replyId,
    }
    reqAjaxAsync(RESULT_URL.delReply, JSON.stringify(param))
      .done(function (res) {
        if (res.code == 1) {
          layer.msg("删除成功");
          // console.log($(this).parent());
          // console.log($(this).parents(".reversion"));
          dom.parents(".reversion").remove();
        } else {
          layer.msg(res.msg);
        }
      })
  });

  //为每个下拉框渲染背景色
  function getACtive() {
    $(".theOneShop .oneSHOP").each(function (i, v) {

      var id = $(this).attr("data-id");

      $(".optionSHOP li").each(function () {
        var dom = $(this);
        var ids = dom.attr("data-id");
        if (ids == id) {
          dom.addClass("active");
        }
      })
    })
  };

  //删除第一个选择的团队方法
  function delFirstOption() {
    var len = $(".selectTAB .theOneShop .oneSHOP").length;
    if (len == 0) {
      $(".previewContent .title_preview").html('');
      optionNum = true;
    } else {
      var dom = $(".selectTAB .oneSHOP:first-child");
      var id = dom.attr("data-id");
      var imgurl = dom.children("img").attr("src");
      var text = dom.attr("data-name");
      var type = dom.attr("data-type");

      //同步头像改变
      var thtml = '<div class="title" data-id="' + id + '">\n' +
        '                <img src="' + imgurl + '" class="teamTag"  >\n' +
        '                <span>' + text + '</span>\n' +
        '               ' + getTeamType(type) + '' +
        '              </div>'
      $(".previewContent .preview .title_preview").html(thtml);
      //移除列表第一行
      $(".propmtTab li:first-child").remove();
      // optionNum = true;
    }
  };

  //获取时间
  function clock() {
    var today = new Date();
    var hours = today.getHours();
    var min = today.getMinutes();
    var seconds = today.getSeconds();
    ++seconds;
    if (hours < 10) {
      hours = '0' + hours
    }
    if (seconds < 10) {
      seconds = '0' + seconds
    } else if (seconds > 59) (
      seconds = '00', min++
    )
    if (min < 10) {
      min = '0' + min;
    }
    var str = hours + ':' + min + ':' + seconds;
    $('.time_tab').html(str);
  };

  //取消发布动态
  function delPublish() {
    $(".previewIMG").attr("data-type", 3);
    $("#toEdit").val("");

    $(".propmtTab").html("");

    $('.previewIMG').html("");

    $(".theOneShop").html("");

    $(".add_tips").hide();

    $(".previewContent .title_preview").html('');

    $(".previewContent .text").html("");
    optionNum = true;

    $(".optionSHOP li").each(function () {
      $(this).removeClass("active");
    })
  };

  //加载下拉选择框
  function getTeamOPtion() {
    var param = {
      merchantId: merchantId,
      shopId: shopId
    }
    reqAjaxAsync(RESULT_URL.getCircleList, JSON.stringify(param))
      .done(function (res) {
        if (res.code == 1) {
          var data = res.data;
          if (!data) {
            return layer.msg("暂无数据")
          }
          var html = "";
          $.each(data, function (i, v) {
            html += '<li data-id="' + v.circleId + '" data-type="' + v.circleType + '">\n' +
              '              <img src="' + v.circleLogo + '">\n' +
              '              <span>\n' +
              '             ' + v.circleName + '' +
              '            </span>\n' +
              '            </li>'
          })
          $(".publih_trends .optionSHOP ul").html(html);

          getACtive();
        }
      })
  };

  //删除圈子/粉团队动态
  function delDetails(type, videoAlbumId, videoAlbumCircleId, userId) {
    var ajaxUrl = '';
    //删除圈子
    if (type == 1) {
      ajaxUrl = RESULT_URL.delVAById20;
    } else if (type == 2) {
      ajaxUrl = RESULT_URL.delVAByIdFansTeam;
    }

    layer.open({
      type: 1,
      content: $('#alertBox'),
      area: '400px',
      btn: ['确定', '取消'],
      btnAlign: 'c',
      closeBtn: 1,
      scrollbar: false,
      resize: false,
      move: false,
      end: function () {
        $('#alertBox').hide();
      },

      yes: function (index, latero) {
        var param = {
          userId: userId,
          videoAlbumCircleId: videoAlbumCircleId,
          videoAlbumId: videoAlbumId,
        }

        reqAjaxAsync(ajaxUrl, JSON.stringify(param))
          .done(function (res) {
            if (res.code == 1) {
              layer.msg("删除成功");
              layer.close(index);

              $(".trendsDetails").find('.detailContent[data-videoalbumid="' + videoAlbumId + '"]').remove();

              $(".dynamicDetails").hide();
              // initial();

            } else {
              layer.msg(res.msg);
            }

          })
      }
    })
  };

  //判断圈子或者粉团类型
  function getTeamType(d) {
    var html = '';
    if (d == 1) {
      html = '<img class="titleTAG" src="img/quanzi.png" alt="">'
    } else if (d == 2) {
      html = '<img  class="titleTAG" src="img/fentuandui.png" alt="">'
    }
    return html;
  };

  //列表判断是否是图片还是视频
  function ImgVedio(d, vedioURL, imgURL, text) {
    var html = '';
    var imgHTML = ''
    //图片
    if (d == 1) {
      var len = imgURL.length;
      if (len > 3) {
        imgURL = imgURL.slice(0, 3)
      }
      $.each(imgURL, function (i, v) {
        imgHTML += '<img src="' + v + '" class="imgHTML" >'
      })
      html = ' <div class="contentTag">' + text + '</div>' +
        '<p class="substanceIMG">' + imgHTML + '</p>'
      //视频
    } else if (d == 2) {
      html = ' <div class="contentTag">' + text + '</div>' +
        '<p class="substanceIMG">' +
        ' <img src="' + vedioURL + '" class="vedioHTML">' +
        '</p>'
      //文字
    } else if (d == 3) {
      html = ' <div class="contentTag">' + text + '</div>'
    }
    return html;
  };

  //详情判断是否是图片还是视频
  function detailsImgVedio(d, vedioURL, imgURL, text) {
    var html = '';
    var imgHTML = ''
    //图片
    if (d == 1) {
      $.each(imgURL, function (i, v) {
        imgHTML += '<img src="' + v + '" class="imgHTML" >'
      })
      html = ' <div class="contentTag">' + text + '</div>' +
        '<p class="substanceIMG">' + imgHTML + '</p>'
      //视频
    } else if (d == 2) {
      html = ' <div class="contentTag">' + text + '</div>' +
        '<div class="substanceIMG">' +
        '<video class="videoTYpe" width="320" height="240"src="' + vedioURL + '" controls> </video> ' +
        '</div>'
      //文字
    } else if (d == 3) {
      html = ' <div class="contentTag">' + text + '</div>'
    }
    return html;
  };

  //中间列表点赞图标显示
  function likeTab(d) {
    var html = '';
    if (d > 0) {
      html = ' <img src="img/like.png" alt="">'
    } else {
      html = ' <img src="img/noLike.png" alt="">'
    }
    return html
  };

  //查询中间详情列表
  function getVideoList(page) {
    var param = {
      sStartpage: page,
      shopId: shopId,
      merchantId: merchantId,
      sPagerows: rows,
      orderType: 1,
    }
    reqAjaxAsync(RESULT_URL.getVideoList, JSON.stringify(param))
      .done(function (res) {

        if (res.code == 1) {
          var data = res.data;
          var total = res.total;

          //可选择操作按钮 可操作
          $("#publishTrends").addClass("hasChoose").removeClass("commonType").attr("data-change", 1);
          $("#managementTrends").addClass("hasChoose").removeClass("commonType").attr("data-change", 1);

          //有权限显示，无权限隐藏
          $(".trendsContent").show();
          $(".noContent").hide();

          if (data == null || data == " undefind " || data == "") {
            //无内容时
            $(".noTrends").show();
            $(".trendsDetails").hide();
            return layer.msg("暂无数据");
          }
          var len = data.length;
          if (len == 0) {
            //无内容时
            $(".noTrends").show();
            $(".trendsDetails").hide();
          } else {
            $(".trendsDetails").show();
            $(".noTrends").hide();

            //出现加载更多的按钮
            if (total > 4 && len > pageMore) {
              $(".trendsDetails .readMore").show();
            } else {
              $(".trendsDetails .readMore").hide();
            }

            var shtml = getString(data);
            $(".trendsDetails .appendDetails").html(shtml);
          }

        } else if (res.code == 9) {
          //可选择操作按钮 不可操作
          $("#publishTrends").addClass("commonType").attr("data-change", 0).removeClass("hasChoose");
          $("#managementTrends").addClass("commonType").attr("data-change", 0).removeClass("hasChoose");
          //手机框为空;
          $(".panel_store2 .noContent").show();
          $(".panel_store2 .trendsContent").hide();
        }
      })
  };

  //拼接列表字符串
  function getString(arr) {
    var html = '';
    $.each(arr, function (i, v) {
      html += '<div class="detailContent" data-circleId="' + v.circleId + '" ' +
        'data-videoAlbumId="' + v.videoAlbumId + '" data-type="' + v.circleType + '">\n' +
        '                <div class="detailsTitel">\n' +
        '                  <img src="' + v.circleLogo + '" class="titleIMG" alt="">\n' +
        '                  <div class="rightPart">\n' +
        '                    <p>\n' +
        '                      <a class="theme">' + v.circleName + '</a>\n' +
        '                    ' + getTeamType(v.circleType) + '' +
        '                    </p>\n' +
        '                    <p class="time">\n' +
        '                     ' + v.videoAlbumTime + '' +
        '                    </p>\n' +
        '                  </div>\n' +
        '                </div>\n' +
        '                <div class="substance">' +
        '           ' + ImgVedio(v.videoAlbumType, v.videoAlbumCoverUrl, v.urls, v.videoAlbumDescription) + '' +
        '                  <ul class="data">\n' +
        '                    <li>\n' +
        '                    ' + likeTab(v.totalLikeCount) + ' \n' +
        '                      <span>' + v.totalLikeCount + '</span>\n' +
        '                    </li>\n' +
        '                    <li>\n' +
        '                      <img src="img/comment.png" alt="">\n' +
        '                      <span>' + v.totalCount + '</span>\n' +
        '                    </li>\n' +
        '                    <li>\n' +
        '                      <img src="img/view.png" alt="">\n' +
        '                      <span>' + v.videoAlbumTimes + '</span>\n' +
        '                    </li>\n' +
        '                  </ul>\n' +
        '                  </p>\n' +
        '                </div>\n' +
        '              </div>'
    })
    return html;
  };

  //点赞头像
  function likedImg(d) {
    var html = '';
    if (isNull(d)) {
      html = '';

    } else {
      $.each(d, function (i, v) {
        html +=
          '<img src="' + v.sMemberImgName + '">'
      })
    }
    return html;
  };

  //管理员头像/是否管理员
  function getAdmin(type, name, isAdmin) {
    var html = '';
    var imgURl = '';
    //圈子
    if (type == 1) {
      imgURl = "admin";
      //不是管理员
      if (isAdmin == 0) {
        html += ' <img src="img/' + imgURl + '.png" alt="" class="adminImg">' +
          '     <img src="img/person.png" class="person" alt="">' +
          '     <span>' + name + '</span>'

      } else if (isAdmin == 1) {
        html += ' <img src="img/' + imgURl + '.png" alt="" class="adminImg">' +
          '     <img src="img/person.png" class="person" alt="">' +
          '     <span>' + name + '</span>' +
          ' <img src="img/adminstration.png" class="isAdmin">'
      }
      //粉团队
    } else if (type == 2) {
      imgURl = "yellowBack";
      html += ' <img src="img/' + imgURl + '.png" alt="" class="adminImg">' +
        '     <img src="img/person.png" class="person" alt="">' +
        '     <span>' + name + '</span>'
    }
    return html;
  };

  //查看回复内容
  function getReplay(data) {
    var html = '';
    $.each(data, function (i, v) {
      html += '              <div class="reversion">\n' +
        '                <div class="detailsTitel">\n' +
        '                  <img src="' + v.replyUserImage + '" class="titleIMG" alt="">\n' +
        '                  <div class="rightPart">\n' +
        '                    <p>\n' +
        '                      <a class="name">' + v.replyUserCode + '</a>\n' +
        '                      <a >回复</a>\n' +
        '                      <a class="name">' + v.repliedUserCode + '</a>\n' +
        '                      <span class="content">\n' +
        '                    ' + v.replyContent + '' +
        '                   </span>\n' +
        '                    </p>\n' +
        '                    <p>\n' +
        '                      <span class="time">' + v.replyDate + '</span>\n' +
        '                      <a class="delBtn reply_delBtn" data-replyUserId="' + v.replyId + '">删除</a>\n' +
        '                    </p>\n' +
        '                  </div>\n' +
        '                </div>\n' +
        '              </div>\n'
    })
    return html;
  };

  //查看评论内容
  function getComment(data) {
    var html = '';
    $.each(data, function (i, v) {
      html += '   <div class="reply" data-sUserId="' + v.sId + '">\n' +
        '              <div class="detailsTitel title">\n' +
        '                <img src="' + v.sMemberImgName + '" class="titleIMG" alt="">\n' +
        '                <div class="rightPart">\n' +
        '                  <p>\n' +
        '                    <a class="name">' + v.sUserCode + '</a>\n' +
        '                    <span class="content">' + v.sCommentContent + '</span>\n' +
        '                  </p>\n' +
        '                  <p>\n' +
        '                    <span class="time">' + v.sCommentDate + '</span>\n' +
        '                    <a class="delBtn del_commentBtn" data-sUserId="' + v.sId + '">删除</a>\n' +
        '                  </p>\n' +
        '                </div>\n' +
        '              </div>\n' +
        '           ' + getReplay(v.lsccr) + '' +
        '            </div>'
    })
    return html;
  };

  //查看详情方法
  function getMOreDetails(type, AlbumId) {
    //圈子
    var ajaxUrl = '';
    if (type == 1) {
      ajaxUrl = RESULT_URL.getVAByIdNew20;
    } else if (type == 2) {
      ajaxUrl = RESULT_URL.getFansVAById;
    }
    var param = {
      userId: userId,
      videoAlbumId: AlbumId,
    }
    reqAjaxAsync(ajaxUrl, JSON.stringify(param))
      .done(function (res) {
        if (res.code == 1) {
          //信息
          var data = res.data.videoAlbum;
          //评论
          var comment = res.data.commentList;
          var html = '';
          html += '<div class="detailsTitel" data-type="' + type + '"' +
            'data-videoAlbumCircleId="' + data.videoAlbumCircleId + '"' +
            'data-videoAlbumId="' + data.videoAlbumId + '">' +
            '          <img src="' + data.logo + '" class="titleIMG" alt="">\n' +
            '          <div class="rightPart">\n' +
            '            <p>\n' +
            '              <a class="theme">' + data.circleName + '</a>\n' +
            '                    ' + getTeamType(type) + '' +
            '            </p>\n' +
            '            <p class="time">' + data.videoAlbumTime + '</p>\n' +
            '          </div>\n' +
            '        </div>' +
            '       <div class="substance">\n' +
            '           ' + detailsImgVedio(data.videoAlbumType, data.urls, data.urls, data.videoAlbumDescription) + '' +
            '            <p class="admin">' + getAdmin(type, data.userName, data.isAdmin) + '</p>\n' +
            '            <p class="like_tab">点赞：</p>' +
            '            <p class="likeICON">' + likedImg(comment.allLikeList) + '</p>\n' +
            '            <p class="comment_tab">\n' +
            '              评论：\n' +
            '            </p>\n' +
            '       <div class="replay_Content">\n' +
            '' + getComment(comment.commentList) + '' +
            '          </div>' +
            '            <p class="checkMore">\n' +
            '              查看更多评论 >>\n' +
            '            </p>\n' +
            '          </div>'
          $(".dynamicDetails .getMoreDetails").html(html);
          if (isNull(comment.allLikeList)) {
            $(".like_tab").hide();
          }
          var contentList = res.data.commentList.commentList.length;


          if (contentList == 0) {
            $(".comment_tab").hide();
            $(".getMoreDetails .checkMore").hide();
          }
          //加载更多
          else if (contentList > 2) {
            $(".checkMore").show();
            $(".getMoreDetails .reply").each(function (i, v) {
              if (i > 1) {
                $(".getMoreDetails .reply").eq(i).hide();
              }
            })
          } else {
            $(".getMoreDetails .checkMore").hide();
          }
        }
      })
  };

  //取消冒泡方法
  function stopPropagation(e) {
    e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
  };
})(jQuery)