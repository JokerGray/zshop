(function ($) {
  const REQUEST_URL = {
    TODOLIST: 'oa/getScUpcomingList',//查询待办事项
    HASREAD: 'oa/readScUpcomingById', //标记为已读
    TODOCOUNT:'oa/getNoReadCount'//未读数量总数
  };
  var page = 1;
  var rows = 6;
  var userId = 10073;
  var layer = layui.layer;
  var laypage = layui.laypage;

  //页面初始化
  $(function () {
    $('.title li:eq(0)').click();
    //导航栏显示未读提示
    var params={
      "workeUserId": userId
    }
    var re=reqAjax(REQUEST_URL.TODOCOUNT, JSON.stringify(params));

    if(re.code==1){
      var data=re.data;
      var noReadNotifycount=data.noReadNotifycount;//通告未读
      var noReadNotescount=data.noReadNotescount;//任务
      // var todocount=data.allNoReadcount;//所有
      var noReadLeavecount=data.noReadLeavecount;//审批
      //全部

      //审批
      if(noReadLeavecount>0){
        $(".checkproval>span").addClass("layui-badge-dot")
      }
      //任务
      if(noReadNotescount>0){
        $(".checktesk>span").addClass("layui-badge-dot")
      }
      //通告
      if(noReadNotifycount>0){
        $(".checkannounce>span").addClass("layui-badge-dot")
      }
    }

    $('.title li:eq(0)').css("border-bottom","2px solid #52C8BE")
  });
  //tabs页切换
  $('.title li').on('click', function () {
    var index = $(this).index();

    if (index == 0) {
      getlist();
//被点击的选项添加active以便下面判读
      $('.title li:first-child').addClass("active").siblings().removeClass("active");
      //显示未读数量
      var todocount=$(".checkall").attr("data-count");
      if(todocount==0){
        $(".unread").html("");
      }else if(todocount>0){
        $(".unread").html(todocount);
        $(".unread").addClass("layui-badge");
      }
    } else if (index == 1) {
      getlist(index)

      $('.title li:nth-child(2)').addClass("active");
      $('.title li:nth-child(2)').siblings().removeClass("active");

      //消除提示圆点
      $(".checkproval>span").removeClass("layui-badge-dot")
      var todocount=$(".checkall").attr("data-count");
      if(todocount>0){
        $(".checkproval>span").addClass("layui-badge-dot")
      }

    } else if (index == 2) {
      getlist(index)
      $('.title li:nth-child(3)').addClass("active").siblings().removeClass("active");

      //消除提示圆点
      $(".checkannounce>span").removeClass("layui-badge-dot")
      var todocount=$(".checkall").attr("data-count");
      if(todocount>0){
        $(".checkannounce>span").addClass("layui-badge-dot")
      }

    } else if (index == 3) {
      getlist(index)
      $('.title li:nth-child(4)').addClass("active").siblings().removeClass("active");
      //消除提示圆点
      $(".checktesk>span").removeClass("layui-badge-dot")
      var todocount=$(".checkall").attr("data-count");
      if(todocount>0){
        $(".checktesk>span").addClass("layui-badge-dot")
      }

    }
  });
  //列表查询及分页
  function getlist(index){
    var param = {
      "status": "",
      "pageNo":page,
      "pageSize":rows,
      "workeUserId":userId,
      "fromModule":index
    }

    var res = reqAjax(REQUEST_URL.TODOLIST, JSON.stringify(param));
    initial(res);

    laypage.render({
      elem: 'paging-box-r',//容器
      count: res.total,//总数
      limit: rows,//每页条数
      curr: function () { //通过url获取当前页，也可以同上（pages）方式获取
        var page = location.search.match(/page=(\d+)/);
        return page ? page[1] : 1;
      }(),
      layout: ['prev', 'page', 'next', 'skip'],//功能
      jump: function (obj, first) {
        var param = {
          "status": "",
          "pageNo":obj.curr,
          "pageSize":rows,
          "workeUserId":userId,
          "fromModule": index
        }
        if (!first) {
          var res = reqAjax(REQUEST_URL.TODOLIST, JSON.stringify(param));
          initial(res);
        }
      }
    });
  }

//列表渲染
  function initial(res) {
    $('.title li:eq(0)').css("border-bottom","")

    if(res.code==1){
      $(".centercontent  ul").html("");
      var data = res.data.rows;
      //未读数量
      var todocount=res.data.noReadCount;
      $(".checkall").attr("data-count",todocount);
      var html='';
      $.each(data,function (i,v) {
        html+=`<li class="todolist" data-type="${v.fromModule}"  value="${v.id}" name="${v.isread}"> 
            <span></span>
            <a >${v.applyUserName}</a>
            <i class="datatitle" data-title="${v.operationType}">${v.workName}</i>
            <em class="priority" name="${v.workPriority}"></em>
            <b >${v.applyTime}</b>
            <p class="workcontent" >${v.workContent}</p>
          </li>`
      });
      $(".centercontent  ul").html(html);

      //拼接审批内容

      $(".boxlist .todolist").each(function () {
        var daycount=$(".workcontent").html();
        var datatitle=$(".datatitle").attr("data-title");
        var move="";
        if(datatitle==1){
          move="提交"
        }else if(datatitle==2){
          move="同意"
        }else if(datatitle==3){
          move="驳回"
        }else if(datatitle==4){
          move="同意"
        }else{
          move="同意"
        }
        var dom=$(this);
        if(dom.attr("data-type")==1){
          dom.children("p").html("请假申请："+daycount+"天");
          dom.children("i").html(move+"审批申请")
        }
      })
    }else {
      layer.msg(res.msg);
    }

    //等级显示
    $('li.todolist em').each(function(){
      var dom = $(this);
      if(dom.attr("name")==1){
        dom.addClass("layui-badge layui-bg-gray");
        dom.html("普通")
      }else if(dom.attr("name")==2){
        dom.addClass("layui-badge layui-bg-orange");
        dom.html("紧急")
      }else if(dom.attr("name")==3){
        dom.addClass("layui-badge ");
        dom.html("非常紧急")
      }
    });
    //列表显示未读提示
    $('li.todolist').each(function(){
      var dom = $(this);
      if(dom.attr("name")==1){
        dom.children("span").addClass("layui-badge-dot");
        dom.children("p").css("font-weight","600");
      }
    });
  }
  //未读事件绑定事件
  $(document).on('click', ' li[name=1]', function() {
    var dom=$(this);
    var id=dom.val();
    var type=dom.attr("data-type");
    var param={
      "id": id,
      "fromModule":type
    }
    var res = reqAjax(REQUEST_URL.HASREAD, JSON.stringify(param));
    if(res.code===1){
      dom.children("span").removeClass("layui-badge-dot");
      dom.children("p").css("font-weight","normal");
    }
    //消除对应选项的圆点
    $('.title li.active>span').removeClass("layui-badge-dot")
    var todocount=$(".checkall").attr("data-count");
    if(todocount>0){
      $('.title li.active>span').addClass("layui-badge-dot")
    }


    //导航栏显示未读提示
$(".title span").each(function () {
  var dom=$(this);
  dom.removeClass("layui-badge-dot");
  dom.removeClass("layui-badge");
})

    var params={
      "workeUserId": userId
    }
    var re=reqAjax(REQUEST_URL.TODOCOUNT, JSON.stringify(params));

    if(re.code==1){
      var data=re.data;
      var noReadNotifycount=data.noReadNotifycount;//通告未读
      var noReadNotescount=data.noReadNotescount;//任务
      var todocount=data.allNoReadcount;//所有
      var noReadLeavecount=data.noReadLeavecount;//审批
      //全部
      if(todocount==0){
        $(".checkall>span").html("");
      }else if(todocount>0){
        $(".checkall>span").addClass("layui-badge")
        $(".checkall>span").html(todocount);
      }

      //审批
      if(noReadLeavecount>0){
        $(".checkproval>span").addClass("layui-badge-dot")
      }
      //任务
      if(noReadNotescount>0){
        $(".checktesk>span").addClass("layui-badge-dot")
      }
      //通告
      if(noReadNotifycount>0){
        $(".checkannounce>span").addClass("layui-badge-dot")
      }
    }

  });
})
(jQuery)