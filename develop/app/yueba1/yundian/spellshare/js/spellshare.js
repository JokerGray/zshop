$(function(){
  // 接口参数
  var SPELL_DETAIL = {
    CHECKSPELL : "shop/getGroupBuyOrderDetail"  //查询拼单详情
  }
  
  var swiper = new Swiper('.swiper-container', {
    slidesPerView: 5,
    spaceBetween: 30
  });
  var ua = navigator.userAgent.toLowerCase();
  var myopenway = myclick();

  var groupId=GetQueryString('groupId') || GetQueryString('groupid') || '';
  var orderNo = GetQueryString('orderNo') || GetQueryString('orderno') ||'';
  var shopId = GetQueryString('shopId') || GetQueryString('shopid') ||'';
  var pageNo = GetQueryString('pageNo') || GetQueryString('pageno') || '';
  var pageSize = GetQueryString('pageSize') || GetQueryString('pagesize') || '';
  var cUser = GetQueryString('cUser') || GetQueryString('cuser') || '';
  var nowtime,endtime,lefttime;
  // 调用接口
  var param = {
    groupId: groupId, //拼团id  #int
    orderNo: orderNo, //订单编号
    shopId: shopId,  //店铺id #int
    pageNo: pageNo,
    pageSize: pageSize,
    cUser: cUser //拼团用户
  };
  

  // var param = {"groupId":"1284","orderNo":"ZXCSSHOP201807271429453690005","shopId":"288","pageNo":"1","pageSize":"10","cUser":"39"};


  // 获取服务器时间
  reqAjaxAsync('shopSecondskilActivity/getServerNowTime', JSON.stringify(param)).done(function (res) {
    if (res.code == 1) {
      nowtime=res.data;
    }else {
      layer.msg(res.msg);
    }
  })

  // 调用拼单详情接口
  reqAjaxAsync('shop/getGroupBuyOrderDetail', JSON.stringify(param)).done(function (res) {
    if (res.code == 1) {
      // 主商品信息
      var mainres = res.data;
      var lackUser = mainres.lackUser ? mainres.lackUser : ''; //成团缺少人数#int
      endtime = mainres.endTime ? mainres.endTime : ''; //结束时间#String
      var isMaster = mainres.isMaster; //是否拼主 0不是1是  #int
      var groupOrderList = mainres.groupOrderList;  //参团用户
      var grouplistlength = groupOrderList.length;
      var timeStatus = mainres.timeStatus; //拼团状态0进行中 1成团 2过期失败#int
      var membernum = grouplistlength + lackUser;

      // 拼接参与拼单用户数组
      // 拼团成功,团长度为参与人数数组长度
      if( timeStatus == 1 ){
        groupArr(grouplistlength);
      }
      // 未成功，团长度为参与人数+缺少人数
      if( timeStatus == 0 ||  timeStatus == 2 ){
        groupArr(membernum);
      }
      function groupArr(len){
        usersArr = [];
        usersArr = usersArr.concat(groupOrderList);

        if (usersArr.length < membernum) {
          var obj = { "userpic": "images/@2x/yundian_pindantouxiang@2x.png" };
          for (let i = 0; i < len-usersArr.length ; i++) {
            usersArr.push(obj);
          }
        }
      }

      // 超过人数无法预览则可左右滑动
      $.each(usersArr, function(idx, obj) {
        swiper.appendSlide('<div class="swiper-slide"><div class="single"><img src=' + obj.userpic + ' alt="" class="parter-pic"><div class="owericon"></div></div></div>')
      });
      
      // 超过5人团可左右拖动查看
      if( $("#alreadyUser .swiper-slide").length <= 5 ){
        swiper.allowTouchMove= false;
      }
      else if( $("#alreadyUser .swiper-slide").length >5 ){
        swiper.allowTouchMove= true;        
      }
      
      // 主商品信息渲染
      $("#mainProduct .product-img>img").attr("src",mainres.pictureUrl);
      $("#productTitle").text(mainres.goodsTitle);
      $("#priceText").text(mainres.discountPrice);
      $("#statusnum").text(mainres.groupOrderList.length);


      // isMaster = 1 拼主
      if( isMaster == 1 ){
        // 进行中
        if( timeStatus == 0){
          $("#joinnumber").text(lackUser);
          $("#iredtext").text(lackUser);
          $("#joinbtn").text("邀请好友拼单");
          $("#joinbtn").on("click",function(){
            OpenWetchat(myopenway);
            // layer.open({
            //   title: false,
            //   type: 1,
            //   resize:false,
            //   shade: [0.8, '#000'],
            //   content:$('#share'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
            //   area: ['100%', '7.33rem'],
            //   skin: 'share',
            //   closeBtn:0,
            //   offset: '0',
            //   shadeClose:true,
            //   end:function(){
            //     $('#share').hide();
            //   }
            // })
          });

          // 倒计时定时器
          var nowTime = nowtime;
          var nowTimeNum = Date.parse(nowTime);
          var tim = setInterval(function () {
            count(nowTimeNum,endtime);
            $("#jointime").text(lefttime);
            nowTimeNum  += 1000;
            if(lefttime == 0){
              clearInterval(tim);
            }
          }, 1000);
        }
        // 已成团
        else if( timeStatus == 1 ){
          $(".join-prompt").html('').text("拼单已满");
          $("#joinbtn").text("再次发起拼单");          
          $("#joinbtn").on("click",function(){
            OpenWetchat(myopenway);
          });
          clearInterval(tim);
        }
        // 过期失败
        else if( timeStatus == 2 ){
          $(".join-prompt").html('').text("拼单已过期");
          $("#joinbtn").text("重新发起拼单");      
          $("#joinbtn").on("click",function(){
            OpenWetchat(myopenway);
          });    
          clearInterval(tim);
        }

      }
      // isMaster = 0 不是拼主
      else if( isMaster == 0 ){
        // 进行中
        if( timeStatus == 0){
          $("#joinnumber").text(lackUser);
          $("#joinbtn").text("参与拼单");   
          $("#joinbtn").on("click",function(){
            OpenWetchat(myopenway);
          }); 
          
          // 倒计时定时器
          var nowTime = nowtime;
          var nowTimeNum = Date.parse(nowTime);
          var tim = setInterval(function () {
            count(nowTimeNum,endtime);
            $("#jointime").text(lefttime);
            nowTimeNum  += 1000;
            if(lefttime == 0){
              clearInterval(tim);
            }
          }, 1000)  
        }
        // 已成团
        else if( timeStatus == 1 ){
          $(".join-prompt").html('').text("拼单已满");
          $("#joinbtn").text("发起拼单");     
          $("#joinbtn").on("click",function(){
            OpenWetchat(myopenway);
          });        
          
          clearInterval(tim);
        }
        // 过期失败
        else if( timeStatus == 2 ){
          $(".join-prompt").html('').text("拼单已过期");
          $("#joinbtn").text("发起拼单");    
          $("#joinbtn").on("click",function(){
            OpenWetchat(myopenway);
          });      
          clearInterval(tim);          
        }
      }
      var list = '';
      // 商品列表渲染
      $.each( mainres.moreGroupList , function(i, item){
        list += 
        '        <li>'+
        '          <a href="">'+
        '            <div class="imgcon">'+
        '              <img src=" ' + item.pictureUrl + '" alt="">'+
        '            </div>'+
        '            <section class="productlist-info">'+
        '              <h2 class="productlist-info-tit">'+
        '                '+ item.itemTitle +
        '              </h2>'+
        '              <section class="productlist-info-status clearfix">'+
        '                <div class="status-price">'+
        '                  <span class="code">￥</span>'+
        '                  <span id="price" class="listprice">' + item.discountPrice + '</span>'+
        '                </div>'+
        '                <div class="status-num">已拼<span id="donenumber">' + item.num + '</span>单</div>'+
        '              </section>'+
        '            </section>'+
        '          </a>'+
        '        </li>';
      });

      $("#productlist").append(list);
    } else {
      layer.msg(res.msg);
    }
  })


  // 查看规则
  $("#viewrule").on("click",function(){
    layer.open({
      title: false,
      type: 1,
      resize:false,
      shade: [0.3, '#333'],
      content:$('#rulelayer'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
      area: ['9.07rem', '6.67rem'],
      skin: 'rulepage',
      closeBtn:1,
      offset: 'auto',
      end:function(){
        $('#rulelayer').hide();
      }
    });
  });


  /**
   * FUN:倒计时
   * nowTime  服务器当前时间
   * endTime  拼单结束时间
   */
  function count(nowTime,endTime) {
    var endTime = endTime;
    var nowTimeSec = nowTime;
    var endTimeSec = Date.parse(endTime);
    var leftTimeSec = endTimeSec - nowTimeSec;
    var leftTime = new Date(leftTimeSec);
    var spellLeftTime;
    // console.log(leftTimeSec);
    var day,hour,minute,second;
    // 时间未截至
    if (leftTimeSec > 0) {
      day = Math.floor(leftTimeSec / 1000 / 60 / 60 / 24);
      hour = Math.floor(leftTimeSec / 1000 / 60 / 60 % 24);
      minute = Math.floor(leftTimeSec / 1000 / 60 % 60);
      second = Math.floor(leftTimeSec / 1000 % 60);
      allhour =  Math.floor(day*24+hour);
      
      if (day <= 9) day =  + day;
      if (hour <= 9) hour = '0' + hour;
      if (minute <= 9) minute = '0' + minute;
      if (second <= 9) second = '0' + second;
      lefttime = day + '天' + hour + '小时' + minute + '分' + second + '秒';
      // LeftTime = allhour + ":" + minute + ":" + second; 
      // console.log(lefttime);
    }else{
      lefttime = 0;
    }
  }
  /**
   *判断是微信、QQ内置浏览器打开页面
   *
   */
  function bower() {
      return {
          isiOS: !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
          isAndroid: ua.indexOf('android') > -1 || ua.indexOf('adr') > -1,
          isWeiXin: ua.match(/MicroMessenger/i) == "micromessenger",
          isQQ: ua.indexOf(' qq/') > -1,
          isVrseen: ua.indexOf('vrseen') > -1
      }
  }
  
  function myclick() {
      //安卓手机
      if (bower().isAndroid) {
          // 首先判断是否是 webview  如果包含  VRSeen  说明是我们自己的webview浏览器打开的
          if (bower().isVrseen) {
              // // 内链，走安卓方法，回到详情页
              // window.android.getAppDetail(aid);
          } else if (bower().isWeiXin) {
              return "isAndroidWeixin";
          } else if (bower().isQQ) {
              return "isAndroidQQ";
          } else {
              // 外链
              return "islink";
          }
      } else if (bower().isiOS) {
          //IOS手机
          if(bower().isWeiXin){
              return "isiOSWeixin";
          }else if(bower().isQQ){
              return "isiOSQQ";
          }    
      } 
  }
  /**
   * FUN : 微信中打开小程序/qq中去下载页面
   * @param {string} openway 
   */
  function OpenWetchat(openway){
    if( openway == "isAndroidWeixin" ||  openway == "isiOSWeixin" ){
      window.location.href='//erweima.izxcs.com/erweima.php';
    }
    else if( openway == "isAndroidQQ" ||  openway == "isiOSQQ" ){
      window.location.href='//erweima.izxcs.com/erweima.php';
    }
    else if( openway == "islink"){
      window.location.href='//erweima.izxcs.com/erweima.php';
    }
    else{  
      window.location.href='//erweima.izxcs.com/erweima.php';   
    }   
  }
})