// 数据交互
var def = reqAjax('game/getNewGrade', {
    userId : getQueryString('userId'),
});
def.then(function(data){
    // 判断等级
    if(data.code == 1){
        var level = data.data.level;
        var number = data.data.number;
        if(level == 1){
            $('.count').text(parseFloat(number)+'位粉丝');
            $('.playerBarPrs').css({'width': ((50-number)/50)*100+'%'});
            player();
        }else if(level == 2){
            $('.header_bottom p span:first-of-type').css({'display':'none'}).parent().find('.remark').text('【网红】').parent().find('.count').text(parseFloat(number)+'元礼品金');
            $('.playerBarPrs').css({'width':'100%'}).parent().parent().parent().find('.talentBarPrs').css({'width':((25000-number)/25000)*100+'%'});
            talent();
        }else if(level == 3){
            $('.header_bottom p span:first-of-type').css({'display':'none'}).parent().find('.remark').text('【明星】').parent().find('.count').text(parseFloat(number)+'元礼品金');
            $('.playerBarPrs,.talentBarPrs').css({'width':'100%'}).parent().parent().parent().find('.onlineSensationBarPrs').css({'width':((750000-number)/750000)*100+'%'});
             onlineSensation();
        }else if(level == 4){
            $('.header_bottom p span:first-of-type').css({'display':'none'}).parent().find('.remark').text('【巨星】').parent().find('.count').text(parseFloat(number)+'元礼品金');
            $('.playerBarPrs,.talentBarPrs,.onlineSensationBarPrs').css({'width':'100%'}).parent().parent().parent().find('.starBarPrs').css({'width':((2000000-number)/2000000)*100+'%'});
            star();
        }else if(level == 5){            
            $('.header_bottom p').html('恭喜你达到<span class = "remark">【巨星】</span>等级！');
            $('.playerBarPrs,.talentBarPrs,.onlineSensationBarPrs,.starBarPrs').css({'width':'100%'});
            superstar();
        }
    }else{
        layer.msg(data.msg,{'icon':2});
    }
})


// 表格隔行变色
for(var i=0;i<$('.table tr').length;i++){
    if(i%2 == 0){
        $($('.table tr')[i]).css('background','#f9f9f9');
    }
}

$('.level_model >div').on('click',function(){
    var level = $(this).attr("level");
    levelJudge(level);
});


function levelJudge(level){
    if(level == 1){
        player();
    }else if(level == 2){
        talent();
    }else if(level == 3){
        onlineSensation();
    }else if(level == 4){
        star();
    }else if(level == 5){
        superstar();
    }
} 
// 玩家 特效
function player(){
    $('.tittleName').text('玩家');
    $('.pic').attr({'src':'./image/lq_dengji_Lwanjia@2x.png'});
    $('.level_model_pic img').removeClass('active').parent().parent().parent().parent().find('.player img').addClass('active');
    $('.description').removeClass('activeColor').parent().parent().parent().find('.player .description').addClass('activeColor');
    $('.triangle').css({'left':'0.5rem'});
    $('.privilege').children().css({'display':'none','width':'30.6%'}).parent().find('.flowerCount').text('10').parent().parent().parent().find('.flower').css({'display':'inline-block'});
}
// 达人 特效
function talent(){
    $('.tittleName').text('达人');
    $('.pic').attr({'src':'./image/lq_dengji_Ldaren@2x.png'});
    $('.level_model_pic img').removeClass('active').parent().parent().parent().parent().find('.talent img').addClass('active');
    $('.description').removeClass('activeColor').parent().parent().parent().find('.talent .description').addClass('activeColor');
    $('.triangle').css({'left':'2.03rem'});
    $('.privilege').children().css({'display':'none','width':'47%'}).parent().find('.flowerCount').text('20').parent().parent().parent().find('.flower,.logo,.shop,.fans').css({'display':'inline-block'}).find('.logoName').text('达人');
}
// 网红 特效
function onlineSensation(){
    $('.tittleName').text('网红');
    $('.pic').attr({'src':'./image/lq_dengji_Lwanghong@2x.png'});
    $('.level_model_pic img').removeClass('active').parent().parent().parent().parent().find('.online_sensation img').addClass('active');
    $('.description').removeClass('activeColor').parent().parent().parent().find('.online_sensation .description').addClass('activeColor');
    $('.triangle').css({'left':'3.54rem'});
    $('.privilege').children().css({'display':'none','width':'30.6%'}).find('.flowerCount').text('50').parent().parent().parent().parent().find('.flower,.logo,.iphone').css({'display':'inline-block'}).find('.logoName').text('网红');
}
// 明星 特效
function star(){
    $('.tittleName').text('明星');
    $('.pic').attr({'src':'./image/lq_dengji_mingxing@2x.png'});
    $('.level_model_pic img').removeClass('active').parent().parent().parent().parent().find('.star img').addClass('active');
    $('.description').removeClass('activeColor').parent().parent().parent().find('.star .description').addClass('activeColor');
    $('.triangle').css({'left':'5.05rem'});
    $('.privilege').children().css({'display':'none','width':'30.6%'}).find('.flowerCount').text('80').parent().parent().parent().parent().find('.flower,.logo,.car').css({'display':'inline-block'}).find('.logoName').text('明星');
}

// 巨星 特效
function superstar(){
    $('.tittleName').text('巨星');
    $('.pic').attr({'src':'./image/lq_dengji_Ljuxing@2x.png'});
    $('.level_model_pic img').removeClass('active').parent().parent().parent().parent().find('.superstar img').addClass('active');
    $('.description').removeClass('activeColor').parent().parent().parent().find('.superstar .description').addClass('activeColor');
    $('.triangle').css({'left':'6.57rem'});
    $('.privilege').children().css({'display':'none','width':'30.6%'}).find('.flowerCount').text('80').parent().parent().parent().parent().find('.flower,.logo,.spokesperson').css({'display':'inline-block'}).find('.logoName').text('巨星');
}