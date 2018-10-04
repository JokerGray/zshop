//import {logWrong} from './log.js';
// import $ from 'jquery';


import './index.scss';

$(function(){

    function ShowContent(){
        this.init()
    }

     
    ShowContent.prototype={
        init:function(){
            this.getParams();
            this.getCircleData();
            this.getVideoAlbumData();
            this.getActivityData();
            this.textShow();
            this.tab();
            this.iscroll();
        },
        //获取参数
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
        //获取圈子数据
        getCircleData:function(){
            var that = this;
            var cmd = 'circle/getCircleByID20';
            var datas = {
                "detailId":that.params.detailId
            };
            var callback = that.showCircle;
            that.ajaxAsy(cmd,datas,callback);

        },
        //获取活动数据
        getActivityData:function(){
            var that = this;
            var cmd = 'activityNew/getActivityList';
            var datas = {
                "circleId": that.params.detailId,
                "sStartpage":1,
                "sPagerows":4
            };
            var callback = that.showActivityList;
            that.ajaxAsy(cmd,datas,callback);
        },
        //获取动态数据
        getVideoAlbumData:function(){
            var that = this;
            var cmd = 'circle/searchVideoAlbumListByParamNew20';
            var datas = {
                "videoAlbumCircleId": that.params.detailId,
                "videoAlbumType":"1,2,3",
                "sStartpage":1,
                "sPagerows":4
            };
            var callback =  that.showVideoAlbumList;
            that.ajaxAsy(cmd,datas,callback);
            
        },
        //ajax
        ajaxAsy:function(cmd,datas,callback){
            var that = this;
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
                    callback(re);
                },
                error: function(re) {
                    console.log(re);
                }
            });            
        },
        showCircle:function(re){
            if(re.code==1){
                var html = template('circleHead', re);
                $('.head').html(html);	
                var title = re.data.detailName+'的圈子';
                var desc = re.data.detailTitle;
                var img = re.data.detailTitlePic||"";
                share(title,desc,img);			 
            }else{
                var blankhtml = template('blankPage', re);
                $('.content').html(blankhtml);
            }            
        },
        showVideoAlbumList:function(re){
            if(re.code==1&&re.data.length!=0){
                    console.log(re.data[0].videoAlbum.urls.length)
               
                var html=template('VideoAlbumList',re);
                $('.dyContent').html(html);
            }else{
                $('.dy-stance').show();
            }
        },
        showActivityList:function(re){
            if(re.code==1&&re.data.length!=0){
                var html=template('ActivityList',re);
                $('.acContent').html(html);
            }else{
                $('.ac-stance').show();
            }
        },
        textShow:function(){
            $(".describe").each(function(){
                var maxwidth=55;//设置最多显示的字数
                var text=$.trim($(this).text());
                if(text.length>maxwidth){
                    $(this).text(text.substring(0,maxwidth));
                    $(this).html($(this).html()+"..."+'<a class="unfold" href="#">展开↓</a>');
                };
                $(this).on('click','.unfold',function(){
                    $(this).parent().html(text+'<a class="pack" href="#">收起↑</a>'); 
                });
                $(this).on('click','.pack',function(){
                    $(this).parent().html(text.substring(0,maxwidth)+"..."+'<a class="unfold" href="#">展开↓</a>');
                });
            });
        },
        tab:function(){
            $('.tab-sub').css('left',$('.tab-item').width()/2+"px");
            $('.nav-tabs>li').click(function(){
                $(this).siblings("li").removeClass("active");
                $(this).addClass("active");
                $('.tab-sub').animate({left:$(this).offset().left+$('.tab-item').width()/2+"px"});
                var i=$(this).index();
                $('.tabContent>div:eq('+i+')').siblings("div").removeClass("selected");
                $('.tabContent>div:eq('+i+')').addClass("selected"); 
            });
        },
        iscroll:function(){
            $(window).scroll(function(){
                if($(window).scrollTop()>=$('#tab').offset().top-$('#header').height()){
                    var h= $('.tab-head').addClass('fixed').height();
                     $('.tabContent').css('marginTop',h+'px');
                 }else{
                    $('.tab-head').removeClass('fixed');
                    $('.tabContent').css('marginTop',0);
                 }
                });
        }
    }

    var contents = new ShowContent();
});

