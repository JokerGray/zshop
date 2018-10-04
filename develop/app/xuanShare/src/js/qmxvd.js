$(function(){
    // 引入fastclick
    FastClick.attach(document.body);
    var apikey = sessionStorage.getItem('apikey') || "test"; //获取缓存 通行证码
    var version = sessionStorage.getItem('version') || "1"; //获取缓存 版本号
    var CMD_RECOM='dazzle/findRecommendDazzle';//查询推荐列表
    var CMD_XUAN='dazzle/findDazzleDetail';//查询当前炫
    var USERID=GetQueryString('userid');
    var DAZZLEID=GetQueryString('dazzleid');
    // 跳转领取礼包页面
    var outHtml=toadverHtml();
    // console.log(outHtml);

    function queryVideo(){
        return new Promise(function(resolve,reject){
            //查询炫视频详情,测试588
            var queryXuan={
                dazzleId:DAZZLEID,
                userId:USERID
            }
            var queryData=JSON.stringify(queryXuan);            
            $.ajax({
                type: "POST",
                url: "/zxcity_restful/ws/rest",
                dataType: "json",
                data: {
                    "cmd":CMD_XUAN,
                    "data": queryData || "",
                    "version": version
                },
                beforeSend: function (request) {
                    request.setRequestHeader("apikey", apikey);
                },
                success: function (res) {
                    resolve(res);
                },
                error: function (err) {
                    reject(err);
                }
            });            
        })
    }

    function queryList(){
        return new Promise(function(resolve,reject){
            //查询炫推荐列表
            var queryRec={
                userId:USERID,
                pagination:{
                    page:1,
                    rows:8
                }
            }
            var queryRecData=JSON.stringify(queryRec);            
            $.ajax({
                type: "POST",
                url: "/zxcity_restful/ws/rest",
                dataType: "json",
                data: {
                    "cmd":CMD_RECOM,
                    "data": queryRecData || "",
                    "version": version
                },
                beforeSend: function (request) {
                    request.setRequestHeader("apikey", apikey);
                },
                success: function (res) {
                    resolve(res);
                },
                error: function (err) {
                    reject(err);
                }
            }); 
        })
    }

    Promise.all([queryVideo(),queryList()]).then(function(dataArr){
        // console.log(dataArr[0])
        // console.log(dataArr[1])
        if((dataArr[0].code==1)&&(dataArr[0].data)){
            var pageDom=document.getElementById('page');
            pageDom.style.display="none";
            var html1=template('vdhtml',dataArr[0]);
            document.getElementById('xuanVd').innerHTML=html1;

            setTimeout(function(){
                document.getElementsByClassName('reload')[0].style.display="none";
                pageDom.style.display="block";
            },500)

            // 视频播放控制
            playvideo();
            if((dataArr[1].code==1)&&(dataArr[1].data)){
                var html2=template('recList',dataArr[1]);
                document.getElementById('vdList').innerHTML=html2;
                var title=dataArr[0].data?(dataArr[0].data.introduce):"快来加入全民炫视频吧~！",
                content=dataArr[0].data?dataArr[0].data.scSysUser.username+"的全民炫":"全民炫视频",
                imgUrl=dataArr[0].data.coverUrl;
                // console.log(title,content,imgUrl);
                // 微信分享
                share(title,content,imgUrl);
                // 跳转app
                $('.toApp').on('click',function(){
                    getCoupon();
                });
                $('.toAds').on('click',function(){
                    toAds($(this));
                })
                toHtml($('.toHtml'));
            }else{
                document.getElementById('vdList').innerHTML="<p class='no-recommend'>暂无推荐列表~</p>";
            }
        }else{
            document.getElementById('xuanVd').innerHTML="<p class='delAll'>炫已被删除或为空...!</p>";
        }
    })
    // 点击播放
    function playvideo(){
        var vdtag=document.getElementById('theVideo'),
            playbtn=document.getElementById('playb'),
            coporDom=document.getElementById('vdCop'),
            desDom=document.getElementById('vdDes');
        playbtn.onclick=function(){
            vdtag.play();
            playbtn.style.display='none';
        }
        $('#theVideo').on('click',function(){
            if(vdtag.paused){
                vdtag.play()
            }else{
                vdtag.pause()
            }     
        })
        vdtag.addEventListener('pause',function(){
            coporDom.style.display="block";
            desDom.style.display="block";
            playbtn.style.display="block"
        })
        vdtag.addEventListener('play',function(){
            coporDom.style.display="none";
            desDom.style.display="none";
            playbtn.style.display="none"
        })        
    }

});