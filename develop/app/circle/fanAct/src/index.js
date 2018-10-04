
import './index.scss';

$(function(){
    function ShowContent(){
        this.init();
    }
    ShowContent.prototype = {
        init:function(){
            this.getParams();
            console.log(this.params);
            this.getContent();
        },
        getParams:function(){
            var url = location.search;
            var params = new Object();
            if (url.indexOf("?") != -1) {
                var str = url.substr(1);
                var strs = str.split("&");
                for (var i = 0; i < strs.length; i++) {
                    params[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
                }
            }
            this.params=params;
        },
        getContent:function(){
            var that = this;
            // var activityId=that.params.activityId,
            var id = that.params.id,
            userId=that.params.userId,
            activityDetailType=Number(that.params.activityDetailType||"1");
            var datas= {
                id: id,
                userId: userId
            };
            var cmd='fans/getActivityDetailNew';
            // if(activityDetailType==1){
            //     cmd="activityNew/getActivityDetail";
            // }else if(activityDetailType==0){
            //     cmd="activityNew/getBeggarActivityDetail";
            // }else if(activityDetailType==2){
            //     cmd="activityNew/getActivityDetail";
            // }else if(activityDetailType==3){
            //     cmd="activityNew/getActivityDetail";
            // }
            // console.log(cmd)
            var version = sessionStorage.getItem('version') || "1", 
            apikey = sessionStorage.getItem('apikey') || "test"; 
            var data = JSON.stringify(datas);
            $.ajax({
                type: "POST",
                url: "/zxcity_restful/ws/rest",
                dataType: "json",
                async: true,
                data: {
                    cmd: cmd,
                    data: data,
                    version: version
                },
                beforeSend: function(request) {
                    request.setRequestHeader("apikey", apikey);
                },
                success: function(re) {
                    console.log(re);
                    
                    if(re.code==1){
                        var html = template('showCont', re);
                        $('.content').html(html);
                        $("#processContent").append(re.data.detail)
                        //  $('.play').on('click',function(){
                        //     $(this).hide();
                        //     $('.video')[0].play();
                        //     $('.video').click(function(){
                        //         $(this)[0].pause();
                        //         $('.play').show();
                        //          })
                        //     })
                        //  var title=re.data.orgName+"圈子的活动";
                        var title="粉活动详情";
                         var desc=re.data.detail||"";
                         var img=re.data.detailPicUrl||" ";
                         share(title,desc,img);				 
                    }else{
                        $('#contBlank').show();
                    }
                },
                error: function(re) {
                    console.log(re);
                }
            });
        }
    }
    var contents=new ShowContent();
});
