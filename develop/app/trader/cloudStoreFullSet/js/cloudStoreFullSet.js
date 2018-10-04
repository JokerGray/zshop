$(function($) {
  // 数据交互部分
  var shopId = 8;
  var merchantId = 10;
	var layer=layui.layer;
	var pageNo=1;
	var pageSize=10;
	var RESULT_URL={
    firstScreen:'shopFullScreen/selectFullScreenByType',//第一屏
    alblumType:'shopFullScreen/getFirstPageAndAlbumList',//获取相册视频分类名称
    getallgoods:"shopFullScreen/getPhotoListByAlbum",//根据分类获取对应图片
    updateFullScreen:"shopFullScreen/updateFullScreen2589",//保存视频
    getGoodsListByPage:'shopFullScreen/getGoodsListByPage',// 获取店铺所有商品并模糊查询
    updateFullScreen67:'shopFullScreen/updateFullScreen67',//保存6，7屏接口

  }

  // 页面初始化
  $(function () {
    //上传初始化
    initial();

    //已选择视频拖拽
    $( "#ul_video" ).sortable();
    $( "#ul_video" ).disableSelection();

    $( "#ul_img" ).sortable();
    $( "#ul_img" ).disableSelection();

    //定时器，令时间一秒一跳
    setInterval(clock, 1000);

    //默认第一屏点击
    $(".first_screen").click();
  });

  layer.config({
    extend: 'myskin/style.css', //加载您的扩展样式
    skin: 'layer-ext-myskin'
  });

  // 左侧Tab栏点击切换对应栏
    $(".leftTab .common_tab").click(function() {
    	var index=$(this).index();
    	var indexs=index+1;
      $("#managementTab").attr("data-screenType",indexs)
			var item=$(this).children('.hasChoose');
			var itmes=$(this).siblings().children('.hasChoose');
      item.addClass("active");
      itmes.removeClass("active");
      $(".rightSet .rightSetTab").eq(index).show().siblings().hide();

      //第一屏点击
      if(index==0){
        isCoverhave(indexs);
        //第二屏点击
			}else if(index==1){
        isCoverhave(indexs);
      }

      //第5屏点击（图片）
      else if(index==4){
        isCoverhave(indexs);
      }

      //第六屏商品
      else if(index==5){
        // getDoodslist('')
        isCoverhave(indexs);
      }
    });

    //删除已选择视频
  $(".videoSet").on('click','.del_btn',function () {
    $(this).parents('.video_list').remove();
  });

  //点击视频中间手机栏显示
  $(".choosed_vedio ").on("click",'.video_list',function () {
    var src=$(this).find('img').attr('src');
    $(".fistcenter_img").css("backgroundImage",'url('+src+')');
  })


  //保存视频
  $("#saveVideo").click(function () {
    toSaveDate()
  });

  //保存图片
  $("#saveImg").click(function () {
    toSaveDate()
  });




	//选择视频弹出页面层
	$('.videoSet  .choose_video').on('click', function(){

    var screenType=$("#managementTab").attr("data-screenType");

    if( screenType==2){
      getlayerBox('选择视频')
    }else if( screenType==5){
      getlayerBox('选择图片')
    }

	});

  //保存选择的图片或者视频
  function toSaveDate() {
    var screenType= $("#managementTab").attr("data-screenType");
    var eq=screenType-1;
    var screenItemList=[];
    var dom;
      if(screenType==2){
      dom= $("#ul_video .video_list")
    }else{
        dom= $("#ul_img .video_list")
      }

   dom.each(function () {
      var dom=$(this);
      var index=dom.index()+1;
      screenItemList.push({
        'businessId':dom.attr('data-id'),
        'homePage':dom.attr('data-homePage'),
        'coverImg':dom.find('img').attr('src'),
        'screenPriority':index
      })
    })

    console.log(screenItemList);
    var param={
      screenItemList: screenItemList,
      shopId: shopId,
      screenType: screenType
    }

    reqAjaxAsync(RESULT_URL.updateFullScreen,JSON.stringify(param))
      .done(function (res) {
        if(res.code==1){
          layer.msg('保存成功')
          $("#managementTab .common_tab ").eq(eq).click();
        }
      })
  }

  //获取选择视频或者图片弹框
  function getlayerBox(title) {
    var screenType=$("#managementTab").attr("data-screenType");
    layer.open({
      type: 1,
      title: [title,'text-align:center'],
      area: ['760px', '690px'],
      btn: ['保存'],
      resize: false,
      scrollbar: false,
      anim: 5,
      content: $('#choose_videoBox'),
      end: function () {
        $('#choose_videoBox').hide();
        $("#choose_videoBox .center_hidden").html('');
      },
      success: function(){
        getVideoList();
        //上传视频或者图片按钮切换
        if( screenType==2){
          $("#choose_videoBox .videoStyle").show();
          $("#choose_videoBox .imgStyle").hide();

          var html=$("#ul_video").html();
          $("#choose_videoBox .center_hidden").html(html);
        }else if( screenType==5){
          $("#choose_videoBox .videoStyle").hide();
          $("#choose_videoBox .imgStyle").show();

          var html=$("#ul_img").html();
          $("#choose_videoBox .center_hidden").html(html);
        }


      },
      yes:function () {
        var html=$("#choose_videoBox .center_hidden").html();
        if( screenType==2){
          $("#ul_video").html(html);
        }else{
          $("#ul_img").html(html);
        }

        layer.closeAll();
      }
    });
  }

  //选择视频分类获取对应视频
  $("#choose_videoBox .centerBtn").on("click","li",function () {
    var screenType=$("#managementTab").attr("data-screenType");
    $(this).addClass("active").siblings().removeClass("active");
    var id=$(this).attr('data-id');
    var index=$(this).index();
    var homePage= $("#choose_videoBox .centerBtn").attr("data-homePage");//0没有首页，1有首页
    //如果没有首页
    if(homePage==0){
      getallablum(id);

      //如果有首页
    }else{
      //如果点击首页
      if(index==0){
        var filePath=$(this).attr("data-filePath");
        var coverImagePath=$(this).attr("data-coverImagePath");
        var imgHtml=' <li data-homePage="1" class="video_list" data-id="'+id+'"  data-filePath="'+filePath+'">\n' +
          '                    <img src="'+coverImagePath+'" class="img_video">\n' +
          '                    <span class="to_play"></span>\n' +
          '                    <span class="the_cheack"></span>\n' +
          '                    <span class="to_cheack"></span>\n' +
          '                </li>'
        $("#choose_videoBox .center_ul").html(imgHtml);
        $("#choose_videoBox .videoStyle").hide();
        $("#choose_videoBox .imgStyle").hide();


        //渲染已选择
        renderBox();

        //隐藏播放按钮
        if(screenType==2){
          $("#choose_videoBox .to_play").show()
        }else{
          $("#choose_videoBox .to_play").hide()
        }
      }else{
        getallablum(id);
      }
    }
  });

  //弹框里选中or删除视频
  $("#choose_videoBox .center_ul").on("click",".the_cheack",function () {
    // $("#choose_videoBox").attr("data-havechoose",true);//标记已经在选择操作
    var dom=$(this).parents(".video_list");
    var id=dom.attr("data-id");
    var vediourl=dom.attr("data-filepath");
    var url=$(this).siblings('.img_video').attr("src");
    var homePage=dom.attr("data-homePage")
    var html='<li class="video_list" data-homePage='+homePage+' data-id="'+id+'" data-videourl="'+vediourl+'">\n' +
      '                                    <img src="'+url+'" alt="">\n' +
      '                                    <span class="del_btn"></span>\n' +
      '                                </li>'

    var item= $(this).siblings(".to_cheack");
    if(item.is(":hidden")){
      var length= $("#choose_videoBox .center_hidden .video_list").length;

      if(length==10){
        return layer.msg("视频最多10个")
      }

        item.show();
        //添加此元素到目标框中
        $("#choose_videoBox .center_hidden").append(html);

    }else{
      item.hide();
      //如果不选中则在目标框剔除此元素
      $("#choose_videoBox .center_hidden .video_list").each(function () {
        var itemId=$(this).attr("data-id");
        if(itemId==id){
          $(this).remove();
        }
      })
    }
  });


  //选择商品弹框
  $(".rightSetTab .add_goods").click(function () {
    goodOrService('选择商品')

  });

  //选择动态弹框
  $(".rightSetTab .add_trends").click(function () {
    layer.open({
      type: 1,
      title: ['选择动态','text-align:center'],
      area: ['700px', '700px'],
      btn: ['保存'],
      anim: 5,
      content: $('#choose_trendsBox'),
      end: function () {
        $('#choose_trendsBox').hide();


      },
      success: function(){

      },
      yes:function () {
      }
    });

  });

  //获取商品设置列表
  function getDoodslist(content) {
    var param={
      shopId: shopId,    //店铺id
      content: content, //查询内容
      page: "1",
      row: "10",
      merchantId: merchantId   //商户id
    }

    reqAjaxAsync(RESULT_URL.getGoodsListByPage,JSON.stringify(param))
      .done(function (res) {
        if(res.code==1){
          var html='';
          var data=res.data;
          $.each(data,function (i,v) {
            html+=' <li data-id="'+v.id+'" >\n' +
              ' <input type="radio" value="'+v.id+'" name="商品">'+
              '  <img src="'+v.picture_url+'" class="img_show">\n' +
              '   <span>'+v.goodsName+'</span>\n' +
              '                                </li>'
          })
        }
        $("#choose_goodsBox .have_searched_box").show().html(html);
      })
  }

  //搜索商品
  $("#choose_goodsBox .search_title").keyup(function(e){
    stopPropagation(e);
    var value=$(this).val();
    getDoodslist(value)
    });

  $('#choose_goodsBox .have_searched_box').bind('click',function(e){
    stopPropagation(e);
  });

  //商品单选框添加点击事件
  $('#choose_goodsBox .have_searched_box').on('click','input[name="商品"]',function(e){
    stopPropagation(e);
    var value =$(this).siblings('span').text();
    var id=$(this).val();
    $("#choose_goodsBox .search_title").val(value).attr('data-id',id);
  });

  //选择商品或者服务弹框
  function goodOrService(title) {
    layer.open({
      type: 1,
      title: [title,'text-align:center'],
      area: ['600px', '600px'],
      btn: ['保存'],
      anim: 5,
      content: $('#choose_goodsBox'),
      end: function () {
        $('#choose_goodsBox').hide();
        $(".have_searched_box").hide();
        $("#choose_goodsBox .haveUpload").hide();
        $("#add_goods").show();
        $(".search_title").val('');
      },
      success: function(){

      },
      yes:function () {
      }
    });
  }

  // 初始化
  function initial() {
    // 首页封面选择封面海报
     initUpload({
      btn: 'goodsChooseBtn',
      flag: 'image',
      type: '1',
    });

    initUpload({
      //视频上传
      btn: 'to_choose_video',
      flag: 'video',
      type: '2'
    });

     // 上传视频封面
     initUpload({
      btn: 'the_cover_btn',
      flag: 'image',
      type: '3',
    });

    // 替换视频封面
    initUpload({
      btn: 'choosedCoverImg',
      flag: 'image',
      type: '4',
    });

    //上传图片
    initUpload({
      btn: 'to_choose_img',
      flag: 'image',
      type: '5',
    });

    //上传商品图片
    initUpload({
      btn: 'add_goods',
      flag: 'image',
      type: '6',
    });

  };

  //获取模拟iphoneX左上时间
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
    } else if (seconds > 59)(
      seconds = '00', min++
    )
    if (min < 10) {
      min = '0' + min;
    }
    var str = hours + ':' + min + ':' + seconds;
    $('.time_tab').html(str);
  };

  // 判断第一屏封面是否存在，有则放到中部swiper第一屏
  function isCoverhave(screenType) {
    var param = {
      shopId: shopId,
      screenType: screenType
    }
    reqAjaxAsync(RESULT_URL.firstScreen, JSON.stringify(param)).done(function(res) {
      if(res.code == 1) {
        var data = res.data;
        if (data == null || data == " undefind " || data == "") {
          return false;
        }else{
          //第一屏封面设置
          if(screenType==1){
            var url=data.shopFullScreen.coverImg;
            if(!url){
              $(".blank_img").show();
              $(".fistcenter_img").hide();
            }else{
              $(".blank_img").hide();
              $(".fistcenter_img").show().css("backgroundImage",'url('+url+')');
            }
            //第二屏视频//或者第5屏图片
          }else if(screenType==2||screenType==5){

            var choosedVideo=data.shopFSItemList;

            if(!choosedVideo){
              $(".blank_img").show();
              $(".fistcenter_img").hide();
            }else{
              var html= getChoosedVeido(choosedVideo);
              $(".videoSet .choosed_vedio").html(html);
              var imgurl=$(".choosed_vedio .video_list").eq(0).find('img').attr('src');
              $(".blank_img").hide();
              $(".fistcenter_img").show().css("backgroundImage",'url('+imgurl+')');
            }

          }
          //第六屏商品
          else if(screenType==6){
            var html='';
            console.log(data)
            var data=data.shopFSItemList;

            $.each(data,function (i,v) {
              html+=' <li data-id="'+v.shopGoodsInfo.id+'">\n' +
                '                                    <img src="'+v.coverImg+'" class="img_show">\n' +
                '                                    <p>'+v.shopGoodsInfo.goodsName+'</p>\n' +
                '                                    <p class="red">¥ '+v.shopGoodsInfo.price+'</p>\n' +
                '                                    <span class="to_del layui-icon">\n' +
                '                                    &#x1007;\n' +
                '                                </span>\n' +
                '                                </li>'
            })
            $(".rightSetTab .have_choosed_goods").html(html);
          }
        }
      }
    });
  }

  //获取已经选择的视频
  function getChoosedVeido(shopFSItemList) {
    var screenType=$("#managementTab").attr("data-screenType");
    if(screenType==2){
      var url='';
      var html='';
      var id='';
      var vediourl='';
      $.each(shopFSItemList,function (i,v) {
        if(v.homePage==0){
          url=v.shopPhoto.coverPath;
          id=v.shopPhoto.id;
          vediourl=v.shopPhoto.contentUrl;
        }else if(v.homePage==1){
          url=v.shopEditUpload.coverImagePath;
          id=v.shopEditUpload.id;
          vediourl=v.shopEditUpload.filePath;
        }
        html+='<li class="video_list" data-homePage='+v.homePage+'  data-id="'+id+'" data-videourl="'+vediourl+'">\n' +
          '                                    <img src="'+url+'" alt="">\n' +
          '                                    <span class="del_btn"></span>\n' +
          '                                </li>'
      })
      //如果是图片
    }else if(screenType==5){
      var url='';
      var html='';
      var id='';
      var vediourl='';
      $.each(shopFSItemList,function (i,v) {
        if(v.homePage==0){
          url=v.shopPhoto.contentUrl;
          id=v.shopPhoto.id;
          vediourl=v.shopPhoto.contentUrl;
        }else if(v.homePage==1){
          url=v.shopEditUpload.filePath;
          id=v.shopEditUpload.id;
          vediourl=v.shopEditUpload.coverImagePath;
        }
        html+='<li class="video_list" data-homePage='+v.homePage+'  data-id="'+id+'" data-videourl="'+vediourl+'">\n' +
          '                                    <img src="'+url+'" alt="">\n' +
          '                                    <span class="del_btn"></span>\n' +
          '                                </li>'
      })
    }

    return html;
  }

  //获取视频分类列表
  function getVideoList() {
    var screenType=$("#managementTab").attr("data-screenType");
      var param={
        shopId: shopId,
        screenType:screenType
      }
      reqAjaxAsync(RESULT_URL.alblumType,JSON.stringify(param))
        .done(function (res) {

          if(res.code==1){
            var data=res.data.albumList;
            //是否有首页
            var homePage=res.data.shopEditInfo;
            var html='';
            $.each(data,function (i,v) {
              html+='  <li data-id="'+v.id+'">'+v.albumName+'</li>'
            })
            //如果没有首页
            if(!homePage){
              $("#choose_videoBox .centerBtn").html(html).attr("data-homePage",0);
              var item=$("#choose_videoBox .centerBtn li:first-child");
              var id=item.attr("data-id");
              //默认第一个点击
              item.addClass("active");
              getallablum(id)
              // $("#choose_videoBox .videoStyle").show();

            }else {



              //如果是视频
              if(screenType==2){

                //拼接首页到分类栏
                var shtml='  <li data-id="'+homePage.id+'" data-filePath="'+homePage.filePath+'" data-coverImagePath="'+homePage.coverImagePath+'" class="active">首页</li>'
                var sshtml=shtml+html;
                $("#choose_videoBox .centerBtn").html(sshtml).attr("data-homePage",1);
                //拼接查询到的图片
                var imgHtml=' <li data-homePage="1" class="video_list" data-id="'+homePage.id+'"  data-filePath="'+homePage.filePath+'">\n' +
                  '                    <img src="'+homePage.coverImagePath+'" class="img_video">\n' +
                  '                    <span class="to_play"></span>\n' +
                  '                    <span class="the_cheack"></span>\n' +
                  '                    <span class="to_cheack"></span>\n' +
                  '                </li>'
                $("#choose_videoBox .center_ul").html(imgHtml);

              }else{
                //拼接首页到分类栏
                var shtml='  <li data-id="'+homePage.id+'" data-filePath="'+homePage.filePath+'" data-coverImagePath="'+homePage.filePath+'" class="active">首页</li>'
                var sshtml=shtml+html;
                $("#choose_videoBox .centerBtn").html(sshtml).attr("data-homePage",1);
                //拼接查询到的图片
                var imgHtml=' <li data-homePage="1" class="video_list" data-id="'+homePage.id+'"  data-filePath="'+homePage.filePath+'">\n' +
                  '                    <img src="'+homePage.filePath+'" class="img_video">\n' +
                  '                    <span class="the_cheack"></span>\n' +
                  '                    <span class="to_cheack"></span>\n' +
                  '                </li>'
                $("#choose_videoBox .center_ul").html(imgHtml);

              }
              $("#choose_videoBox .videoStyle").hide();
              $("#choose_videoBox .imgStyle").hide();

              //渲染已选择
              renderBox();
            }
          }
        })
  }

  //根据分类获取对应图片
  function getallablum(id) {
    var screenType=$("#managementTab").attr("data-screenType");
    var param={
      albumId: id,
      pageNo: pageNo,//页号，1开始
      pageSize: pageSize,//每页数量
      screenType: screenType,//类型:2视频,5图片
      shopId: shopId
    }

    reqAjaxAsync(RESULT_URL.getallgoods,JSON.stringify(param))
      .done(function (res) {

        if(res.code==1){
          var data=res.data.rows;
          var html='';
          $.each(data,function (i,v) {


            if(screenType==2){

              html+=' <li data-homePage="0" class="video_list" data-filePath="'+v.contentUrl+'" data-id="'+v.id+'">\n' +
                '                    <img src="'+v.coverPath+'" class="img_video">\n' +
                '                    <span class="to_play"></span>\n' +
                '                    <span class="the_cheack"></span>\n' +
                '                    <span class="to_cheack"></span>\n' +
                '                </li>'
            }else{

              html+=' <li data-homePage="0" class="video_list" data-filePath="'+v.contentUrl+'" data-id="'+v.id+'">\n' +
                '                    <img src="'+v.contentUrl+'" class="img_video">\n' +
                '                    <span class="the_cheack"></span>\n' +
                '                    <span class="to_cheack"></span>\n' +
                '                </li>'
            }

          });

          $("#choose_videoBox .center_ul").html(html);

          if(screenType==2){
            $("#choose_videoBox .videoStyle").show();
            $("#choose_videoBox .imgStyle").hide();
          }else{
            $("#choose_videoBox .videoStyle").hide();
            $("#choose_videoBox .imgStyle").show();
          }

          //渲染已选择
          renderBox();
        }
      })
    
  }

  //给选择视频弹框渲染已选择的视频
  function renderBox() {

    // if(item){
      var chekedIds=[];
      $("#choose_videoBox .center_hidden .video_list").each(function () {
        var id=$(this).attr("data-id");
        chekedIds.push(id);
      });

      $("#choose_videoBox .center_ul .video_list").each(function () {
        var dom=$(this);
        var id=dom.attr("data-id");
        $.each(chekedIds,function (i,v) {
          if(id==v){
            dom.children(".to_cheack").show();
          }
        })
      })

    // }else{
    //   var checkedId=[];
    //   //获取已经选择的视频id
    //   $("#ul_video .video_list").each(function () {
    //     var id=$(this).attr("data-id");
    //     checkedId.push(id);
    //   });
    //
    //   $("#choose_videoBox .center_ul .video_list").each(function () {
    //     var dom=$(this);
    //     var id=dom.attr("data-id");
    //     $.each(checkedId,function (i,v) {
    //       if(id==v){
    //         dom.children(".to_cheack").show();
    //       }
    //     })
    //   })
    //
    // }
  }


  $(document).bind('click',function(){
    $('#choose_goodsBox .have_searched_box').css('display','none');
  });

  function stopPropagation(e) {
    if (e.stopPropagation)
      e.stopPropagation();
    else
      e.cancelBubble = true;
  }


  // 左边选择板块根据后台数据判断开关是否打开
  function isSwitchopen() {
    var param = {
      shopId: shopId,
      merchantId: merchantId
    }

    reqAjaxAsync('shopFullScreen/selectAllFullScreenList', JSON.stringify(param))
      .done(function (res) {
        if(res.code == 1) {
          var data = res.data;
          if (data == null || data == " undefind " || data == "") {
            return false;
          }
          for(var i = 0; i < data.length; i++) {
            // var screenType = data[i].screenType;

            // $('.leftChoose .leftTab input').eq(i).val(screenType);
            $('.leftChoose .leftTab a').eq(i).attr("data-screentype", data[i].screenType);

            if(data[i].screenOpen == 1) {
              $('.leftChoose .leftTab input').eq(i).val("1");
              $('.leftChoose .leftTab div').eq(i).addClass("layui-form-onswitch");
            }
          }
        };


      });
  };
  // isSwitchopen();

});