$(function(){
    // 引入fastclick
    FastClick.attach(document.body);
    var apikey = sessionStorage.getItem('apikey') || "test"; //获取缓存 通行证码
    var version = sessionStorage.getItem('version') || "1"; //获取缓存 版本号
    var CMD_SHOW='dazzle/showPersonalData',
        CMD_ZAN='dazzle/queryPraiseDazzleList',
        CMD_MYXUAN='dazzle/queryMyDazzleList';
    var USERID=GetQueryString('userid');
    function queryInfo(){
        return new Promise(function(resolve,reject){
            //查询个人信息
            var querydata={
                userId:USERID,
                myUserId:USERID
            }
            var queryData=JSON.stringify(querydata);            
            $.ajax({
                type: "POST",
                url: "/zxcity_restful/ws/rest",
                dataType: "json",
                data: {
                    "cmd":CMD_SHOW,
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
    function queryMine(){
        return new Promise(function(resolve,reject){
            //查询个人作品
            var querydata={
                userId:USERID,
                queryUserId:'',
                pagination:{
                    page:1,
                    rows:9
                }
            }
            var queryData=JSON.stringify(querydata);            
            $.ajax({
                type: "POST",
                url: "/zxcity_restful/ws/rest",
                dataType: "json",
                data: {
                    "cmd":CMD_MYXUAN,
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
    function queryLike(){
        return new Promise(function(resolve,reject){
            //查询喜欢作品
            var querydata={
                userId:USERID,
                pagination:{
                    page:1,
                    rows:9
                }
            }
            var queryData=JSON.stringify(querydata);            
            $.ajax({
                type: "POST",
                url: "/zxcity_restful/ws/rest",
                dataType: "json",
                data: {
                    "cmd":CMD_ZAN,
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
    Promise.all([queryInfo(),queryMine(),queryLike()]).then(function(arr){
        // arr[0]:个人信息，arr[1]:个人作品 arr[2]:喜欢的信息
        console.log(arr);
        showPerson(arr[0]);
        showMine(arr[1]);
        showLike(arr[2]);
        console.log(arr[0])
        var title=arr[0].data.sysUser.username+",Ta正在全民炫拍视频，快来加入吧！",
            desc="全民炫-你也可以当明星!",
            imgs=arr[0].data.sysUser.userpic;
        // console.log(title)
        // console.log(imgs)
        // console.log(desc)
        share(title,desc,imgs);
        // 点击切换
        $('.vd-nav-item').on('click',function(){
            $(this).addClass('active').siblings().removeClass('active');
            var index=$(this).index();
            $('.my-vdlist').hide();
            $('.my-vdlist').eq(index).show();
        });
        // 跳转至app
        $('.toApp').on('click',function(){
            getCoupon();
        });      
        // 跳转网页
        toHtml($('.toHtml'));
        // 跳转广告
        $('.toAds').on('click',function(){
            toAds();
        })
    })
    // 个人信息
    function showPerson(re){
        // console.log(re);
        if(re.code){
            if(re.code==1){
                var html=template('userinfo',re);
                document.getElementById('user').innerHTML = html;
            }else{
                var html=template('noData',re);
                document.getElementById('user').innerHTML = html;
            }
        }
    }
    // 个人作品
    function showMine(re){
        console.log(re);
        if(re.code){
            if(re.code==1){
                var html=template('mymd',re);
                document.getElementById('myvd').innerHTML=html; 
                $('#works').html('作品&nbsp;'+re.total);             
            }else{
                var html=template('noData',re);
                document.getElementById('myvd').innerHTML=html;              
            }            
        }
    }    
    // 喜欢作品
    function showLike(re){
        console.log(re);
        if(re.code){
            if(re.code==1){
                var html=template('likemd',re);
                document.getElementById('likevd').innerHTML=html;             
            }else{
                var html=template('noData',re);
                document.getElementById('likevd').innerHTML=html;              
            }            
        }
        $('#likes').html('喜欢&nbsp;'+(re.data?re.data.total:0));      
    }    

});