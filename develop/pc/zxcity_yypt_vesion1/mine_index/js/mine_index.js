(function($){
    var userImg = yyCache.get('userImg',"img/default_icon.png");
    var username = yyCache.get('username',"");
    var pcNickname = yyCache.get("pcNickname",""); //用户昵称

    
    var userId = yyCache.get("userId","");
    var userNo = yyCache.get("userno","");


    $(".top-leftbox img").attr("src",userImg);
    $(".top-username").text(pcNickname);

    var USER_URL =  {
        RESOURLIST : 'operations/countGroupByCategory', //(待办)
        QUERYLIST : 'operations/getUserDiary', //(查询日志)
        SAVELIST : 'operations/updateUserDiary', //(保存日志)
        MERVHANTACCOUNT :'operations/merchantCountOf12Months', //（商户统计）
        APPUSER : 'operations/appUserCountOf12Months' //(平台用户统计)
    };

    //获取当前时间
    var date = new Date();
    var m = date.getMonth()+1;
    var day = date.getDate();
    if(m>9){
        newm = m;
    }else{
        newm = "0" + m;
    }
    if(day>9){
        newd = day;
    }else{
        newd = "0" + day;
    }
    var str = date.getFullYear()+"-"+ newm +"-"+ newd;

    //日历插入时间
    function getTime(){
        var dateTime = new Date().toLocaleString();
        $(".datetime").text(dateTime);
    }


    //设置定时30s加载一次
    var ref = "";
    ref = setInterval(function(){
        getTime();
    },1000);

    //日历
    $('#datetimepicker').datepicker({
        format: 'yyyy-mm-dd',
        autoclose: false,
        language: "zh-CN",
        todayHighlight:true
    }).on('changeDate', function(ev) {
        var time = $("#jurisdiction-begin").val();
        var param = {
            userNo : userNo,
            date:time
        }
        reqAjaxAsync(USER_URL.QUERYLIST,JSON.stringify(param)).done(function(res){
            if(res.code == 1){
                $("#note").val(res.data.content);
                if(time == str){
                    $("#note").attr("disabled",false);
                }else{
                    $("#note").attr("disabled",true);
                }
            }else{
                layer.msg(res.msg);
            }
        });
    });

    //加载待办
    function getEvent(){
        var param = {
            userId : userId
        }
        reqAjaxAsync(USER_URL.RESOURLIST,JSON.stringify(param)).done(function(res) {
            if (res.code == 1) {
                var list = $(".centerbox-event li");
                var row = res.data;
                for (var i in row) {
                    if (row[i].categoryId == 1) {
                        list.eq(0).find(".event-num").text(row[i].count);
                    } else if (row[i].categoryId == 2) {
                        list.eq(1).find(".event-num").text(row[i].count);
                        list.eq(i).attr("data-categoryId", row[i].categoryId);
                    } else if (row[i].categoryId == 3) {
                        list.eq(2).find(".event-num").text(row[i].count);
                        list.eq(i).attr("data-categoryId", row[i].categoryId);
                    } else if (row[i].categoryId == 4) {
                        list.eq(3).find(".event-num").text(row[i].count);
                        list.eq(i).attr("data-categoryId", row[i].categoryId);
                    }
                }
            }
        })
    }

    getEvent();

    //点击待办进入第二层
    $(".centerbox-event").on("click","li",function(){
        var categoryId = $(this).attr("data-categoryId");
        var name = $(this).find(".event-name").text();
        var number = $(this).find(".event-num").text();
        if(number == 0){
            layer.msg("暂无待办");
        }else {
            sessionStorage.setItem("categoryId",categoryId);
            var namelist = $(".menu-head li",window.parent.document);
            var drr = [];
            for(var i=0;i<namelist.length;i++){
                drr.push(namelist.eq(i).find(".head-txt").text());
            }

            if($.inArray(name,drr) == -1){
                //$("#pageFrame",window.parent.document).attr("src","backlog/backlog.html");
                addTab("backlog.html",name);
            }else{
                //$("#pageFrame",window.parent.document).attr("src","backlog/backlog.html");
                addTab("backlog.html",name);

            }
        }


    });

    //点击左侧菜单，顶部会相应增加tab
    function addTab(url,name){

        window.top.misc.openTab(name, url);
        
        // if(name.length>5){
        //     var newname = name.substr(0,4)+'...';
        // }else{
        //     var newname = name;
        // }
        // var str="";
        // str += '<li class="head-add ave">' +
        // '<a title="'+ name +'" data-href="' + url + '">' +
        // '<span class="head-menus"></span><span class="head-txt">' + newname + '</span>' +
        // '</a>' +
        // '<i class="nav-close"></i>' +
        // '</li>';
        // //遍历是否重复存在
        // var names = $(".menu-head li",window.parent.document);
        // var arr = [];
        // for(var i=0;i<names.length;i++){
        //     arr.push(names.eq(i).find("a").attr("title"));
        //     if(name == names.eq(i).find("a").attr("title")){
        //         names.removeClass("ave");
        //         names.eq(i).addClass("ave");
        //     }
        // }
        // if($.inArray(name,arr) == -1){
        //     var num = sessionStorage.getItem("indx");
        //     $(".menu-nav li",window.parent.document).eq(num).addClass("ave");
        //     $(".menu-head li",window.parent.document).removeClass("ave");
        //     $(".menu-head",window.parent.document).append(str);
        //     moretab();
        //     topmenu();
        // }


    }
    //顶部菜单效果
    function topmenu(){
        var menulist = $(".menu-head li",window.parent.document);
        for(var i=1;i<menulist.length;i++){
            if(i==1){
                menulist.eq(i).css("z-index",98-i);
                menulist.eq(i).css("left",200);
            }else{
                var offsetwith = menulist.eq(i-1).offset().left;
                menulist.eq(i).css("z-index",98-i);
                menulist.eq(i).css("left",offsetwith+148);
            }

        }
    }

    //顶部tab超过8个就关闭倒数第二个
    function moretab(){
        var lengs = $(".menu-head li",window.parent.document).length;
        if(lengs>8){
            $(".menu-head li",window.parent.document).eq(7).remove();
        }
    }

    $("#note").focus(function(){
        $("#saveBtn").addClass("yelloBg");
    });

    $("#note").blur(function(){
        $("#saveBtn").removeClass("yelloBg");
    });

    //文本域保存
    $(".savebtn").click(function(){
        $("#saveBtn").removeClass("yelloBg");
        saveText();
    });
    function saveText(){
        var text = $("#note").val();
        if(text == ""){
            layer.msg("内容为空哟");
        }else{
            var param = {
                content : text, //内容
                userNo : userNo,
                userName : username,
                date:str
            }
        reqAjaxAsync(USER_URL.SAVELIST,JSON.stringify(param)).done(function(res){
                if(res.code == 1){
                    layer.msg("保存成功");
                }else{
                    layer.msg(res.msg);
                }
            });
        }
    }

    //文本获取
    function readText(){
        var param = {
            userNo : userNo,
            date:str
        }
        reqAjaxAsync(USER_URL.QUERYLIST,JSON.stringify(param)).done(function(res){
            if(res.code == 1){
                $("#note").val(res.data.content);
            }else{
                layer.msg(res.msg);
            }
        });
    }
    readText();


    var worldMapContainer = document.getElementById('myEchars');
    var worldMapContainer1 = document.getElementById('myEchars1');
    //用于使chart自适应高度和宽度,通过窗体高宽计算容器高宽
    var resizeWorldMapContainer = function () {
        worldMapContainer.style.width = (window.innerWidth)/2+'px';
        worldMapContainer1.style.width = (window.innerWidth)/2+'px';
    };
    //设置容器高宽
   // resizeWorldMapContainer();

    //客户统计折线图
   function intLine(e,cmd){
        var xAxisData = [];
        var seriesData = [];
        var parms = {};
        reqAjaxAsync(cmd,parms).then(function(res){
        var data = res.data;
        $.each(data, function(i,item) {
            xAxisData.push(item.dt)
        });
        $.each(data, function(i,item) {
            seriesData.push(item.num)
        });

        var myEchars = echarts.init(document.getElementById(e));
        var option = {
            tooltip : {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#fff'
                    }
                }
            },
            grid: {
                left: '3%',
                right:'3%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: xAxisData,
                axisLabel: {
                    textStyle: {
                        color: '#999'
                    },
                    interval:3
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: '#eee'
                    }
                }
            },

            yAxis: {
                type: 'value',
                axisLabel: {
                    textStyle: {
                        color: '#999'
                    },
                    interval:0
                },
                axisLine: {
                    lineStyle: {
                        color: '#eee'
                    }
                },
                splitLine:{
                    show:true,
                    lineStyle:{
                        color:'#eee',
                        width:1
                    }
                }
            },
            series: [{
                type: 'line',
                data:seriesData,
                symbolSize: 10,
                itemStyle: {
                    normal: {
                        color: '#f6c0c0',
                        label: {
                            show: true
                        },
                        lineStyle: {
                            normal: {
                                width: 10,
                                color: '#2ed9cd'
                            }

                        },
                        areaStyle: {
                            backgroundColor:'#2ed9cd'
                        }
                    }
                }

            }]

        }
        myEchars.setOption(option);
       $(window).resize(function () {          //当浏览器大小变化时
           resizeWorldMapContainer();
           myEchars.resize();
       });
    })
  }

    intLine('myEchars',USER_URL.MERVHANTACCOUNT);
    intLine('myEchars1',USER_URL.APPUSER);

    //子页面滚动条隐藏
    $(".common-container").niceScroll({
        cursorcolor:"#fff",
        cursorborder:"0",
        autohidemode:true
    });
})(jQuery);