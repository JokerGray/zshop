// 从url 中获取  merchantId
var merchantId = getQueryString('merchantId');

window.onload=function(){
    $('.levelSet').attr('href','levelSet.html?merchantId='+ getQueryString('merchantId'));
    $('.integralSet').attr('href','integralSet.html?merchantId='+ getQueryString('merchantId'));
    $('.integralGoods').attr('href','integralGoods.html?merchantId='+ getQueryString('merchantId'));
}
// 新增等级 弹窗
function addLevel(){
    var level = [];
    var pointValue = [];
    $('.levelSetContent tbody tr').each(function(index, el) {
        if( index > 0){
            level.push($(el).attr('level'));
            pointValue.push($(el).attr('pointValue'));
        }else{
            level.push('0');
            pointValue.push('0');

        }    
    });

    function getMaximin(arr,maximin) { 
        if(maximin=="max"){ 
            return Math.max.apply(Math,arr); 
        }else if(maximin=="min") { 
            return Math.min.apply(Math, arr); 
        } 
    } 
    
    var maxLevel = getMaximin(level,"max")
    var maxPointValue = getMaximin(pointValue,"max");
    if(maxLevel >= 10 ){
        layer.alert('已达最大等级,不能新增',{icon:2});
        return;
    }
    
    layer.open({
        type: 2,  
        content: 'addlevel.html?merchantId='+merchantId+'&maxLevel='+maxLevel+'&maxPointValue='+maxPointValue,
        title: '新增等级',
        area: ['610px', '498px'],
        btn: [],
        maxmin: true,
        scrollbar: false,
        cancel: function(){
            
        }
    });
}

function editor(self){
    var id = $(self).parent().parent().attr('levelId');
    var level = $(self).parent().parent().attr('level');
    var prevPonitvalue = $(self).parent().parent().prev().attr('pointvalue');
    var nextPonitValue = $(self).parent().parent().next().attr('pointvalue');

    // console.log(level+'__'+nextPonitValue+'__'+prevPonitvalue);
    layer.open({
        type: 2,  
        content: 'addlevel.html?merchantId='+merchantId+'&id='+id+'&prevPonitvalue='+prevPonitvalue+'&nextPonitValue='+nextPonitValue+'&level='+level,
        title: '编辑等级',
        area: ['610px', '498px'],
        btn: [],
        maxmin: true,
        scrollbar: false,
        cancel: function(){
            
        }
    });
}

// 商户的等级设置 接口联调
var def = reqAjax('credits/levels', {
    merchantId : merchantId
});
def.then(function(data){
    var data = data.data;
    if(data != null){
        for(var i = 0;i<data.length;i++){
            var row = data;
            var content = $('.levelSetContent tbody tr').first().clone();
          
            if(i < data.length-1){
                content.find('.delete').css({'display':'none'});
            }
            content.attr({'levelId': row[i].id,'level':row[i].levelNumber,'pointValue':row[i].pointValue});
            content.find('.levelNumber img').attr('src','./image/LV'+row[i].levelNumber+'.png');
            content.find('.levelName').text(row[i].levelName);
            content.find('.pointValue').text(row[i].pointValue);
            content.find('.remarks').text(row[i].remarks);
            content.show();
            $('.levelSetContent tbody').append(content);
        }
    }
})

// 删除 按钮
function deleteLevel(self){
    var levelId = $(self).parent().parent().attr('levelId');
    layer.confirm('确认删除？', {
        btn : [ '确定', '取消' ]//按钮
    }, function(index) {
        layer.close(index);

        // 删除 后台接口
        var def = reqAjax('credits/levelOmit', {
           levelId : levelId
        });
        def.then(function(data){
            layer.msg(data.msg,{icon:1});
            location.reload();
        });
    });
}