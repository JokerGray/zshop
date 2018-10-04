var shopId = getUrlParams('shopId');
var userId = getUrlParams('userId');

$(document).ready(function(){
  $('.title-content>.btn').on('click', function(){
    $(this).addClass('active').siblings().removeClass('active');
    $('#iframe').attr('src', '../'+this.id+'/add.html?userId='+userId+'&shopId='+shopId);
  });
  $('.title-content>.btn').first().click();
})