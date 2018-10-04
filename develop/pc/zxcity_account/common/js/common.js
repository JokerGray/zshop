$(function(){
    var username = localStorage.getItem("username") || "";
    var userId = localStorage.getItem("userId");
    var userImg = localStorage.getItem("阿里云资源URL") || "";
    var apikey = localStorage.getItem("apikey") || "";
    var str = '';
    $('#contorl-left').click(function(){
        if($('#accordion').hasClass('goleft')){
            $('.left-nav').removeClass('goleft')

        }else{
           $('.left-nav').addClass('goleft')
        }
    })

    $('#user-pic').attr('src',userImg);
    $('#user-name').html(username);
})