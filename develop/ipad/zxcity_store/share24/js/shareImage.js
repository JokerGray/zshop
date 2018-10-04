(function($){
    function getUrlParams(name){
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null){
            r[2] = r[2].replace(new RegExp("%", 'g'), "%25");
            return decodeURI(decodeURIComponent(r[2]));
        }
        return "";
    }
    var articleId = getUrlParams("articleId"), userId = getUrlParams("userId"), praiseUser = "";

    function reqAjax(cmd, data){
        var apikey = sessionStorage.getItem('apikey') == null ? "test" : sessionStorage.getItem('apikey');	//获取缓存 通行证码
        var version = sessionStorage.getItem('version') == null ? "1" : sessionStorage.getItem('version');	//获取缓存 版本号

        var reData;
        $.ajax({
            type: "POST",
            url: "/zxcity_restful/ws/rest",
            dateType: "json",
            async: false,
            data: {
                "cmd": cmd,
                "data": data,
                "version": version
            },
            beforeSend: function(request){
                request.setRequestHeader("apikey", apikey);
            },
            success: function(re){
                reData = re;
            },
            error: function(re){
                var str1 = JSON.stringify(re);
                re.code = 9;
                re.msg = str1;
                reData = re;
            }
        });
        return reData;
    }


    //文字超出部分用省略号代替
    function moreWord(event,num){
     $(event).each(function(){
     var val = $(this).text();
     var valLength = val.length;
     var subVal = val.substring(0,num)+"...";
     if(valLength>num){
     $(this).text(subVal);
         }else{
             $(this).text();
             }
         });
     }

    //图集初始化
    function imgInit(){
        var param = "{'userId':'"+ userId + "','articleId':'" + articleId + "','praiseUser':'" + praiseUser + "'}";
        var res = reqAjax('cms_new/queryArticleDetail',param);
        var sHtml = "";
        var a = 0;
        var q=0;
        var sum=0;
        if(res.code == 1){
            var length = res.data.scCmsResourcesList.length;
            for(var i=0;i<length;i++){
                var row = res.data.scCmsResourcesList[i];
                if(row.resourcesType == "cover"){
                    q++;
                }else{
                    sHtml += '<div class="swiper-slide">' +
                    '<div class="image-body">' +
                    '<img src="' + row.resourcesUrl + '"/>' +
                    '</div>' +
                    '<div class="image-info">' +
                    '<div class="images-nums">' +
                    '<span class="images-num">' + (a+1) + '</span>/' + '<span class="images-total">' + '' + '</span>' +
                    '</div>'
                    if(row.resourcesRemarks == null){
                        sHtml += '<div class="image-text">' + '' + '</div>';
                    }else{
                        sHtml += '<div class="image-text">' + row.resourcesRemarks + '</div>';
                    };
                    sHtml += '</div>' +
                    '</div>';
                    a++;
                }
            }
            sum += q;
            $(".image-content").append(sHtml);
            $(".images-total").html(length - sum);
        }else{

        }
    }
   imgInit();
   moreWord(".image-text",210);

 window.onload = function() {
    //图集轮播
      var swiper = new Swiper('.swiper-container', {
          paginationClickable: false,
          centeredSlides: true,
          autoplay: 2500,
          autoplayDisableOnInteraction: false
      });
    }
})(jQuery);
