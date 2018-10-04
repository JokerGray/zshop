$(window).ready(function () {
    var table = layui.table;
    var form = layui.form;
    var layer = layui.layer;
    var objFood = {};
    var API = {
        findBaseSetting: 'foodBoot/base/selSettingByShopId',         //根据id查询基础设置
        editBaseSetting: 'foodBoot/base/insOrUpt',                   //新增 编辑 基础设置
        addEditPrice: 'foodBoot/attach/insOrUpt',           //新增 编辑费用 
        findPrice: 'foodBoot/attach/selSettingByShopId',    //根据店铺id查询附加费
 
        shopId: getUrlParams("shopId") || '',
        merchantId: getUrlParams('merchantId') || '',
        userId: getUrlParams('userId') || '',
        backUserId: getUrlParams('backUserId') || '',
        name: getUrlParams('userName') || '',
    }
    layui.use(['laydate', 'layer', 'form', 'element', 'table'], function () {
        window.laydate = layui.laydate;
        table = layui.table;
        form = layui.form;
        layer = layui.layer;

        form.render();
        findPrice();
        findBaseSetting();
        //showAddSurcharge();
    });
    $('.setting-radio').on('click',function(){
        $(this).addClass('radio-checked').siblings().removeClass('radio-checked');
        var type = $(this).attr('data-type');
        if (type == "algorithm"){
            var value = $(this).attr('data-value');
            if(value == '1'){
                $('.algorithm-price').text('每人');
            }else {
                $('.algorithm-price').text('每桌');
            }
        }
    });
    $('.surcharge-algorithm .setting-label').on('click', function () {
        // $(this).addClass('radio-checked').siblings().removeClass('radio-checked');
        var value = $(this).attr('data-value');
        var elem = $(this).prev().addClass('radio-checked').siblings().removeClass('radio-checked');
        if (value == '1') {
            $('.algorithm-price').text('每人');
        } else {
            $('.algorithm-price').text('每桌');
        }
        
    });
     
    $('.setting-add').on('click',function(){
        showAddSurcharge();
    });
    // 附加费 取消
    $('.surcharge-ctl .btn-cancel').on('click',function(){
        layer.closeAll();
        $('#add-surcharge').hide();
    });
    // 附加费 确定
    $('.surcharge-ctl .btn-ok').on('click', function () {
        var name = $('.surcharge-name input').val();
        if(name == ''){
            layer.msg('请输入附加费',{time:1000});
            return ;
        }
        
        var value = $('.surcharge-algorithm .setting-radio.radio-checked').attr('data-value');
        var price = $('.surcharge-price input').val();
        var unit = '';
        if (price == '') {
            layer.msg('请设置价格', { time: 1000 });
            return;
        }
        if (price <= 0) {
            layer.msg('请设置合理价格', { time: 1000 });
            price = $('.surcharge-price input').val('');
            return;
        }
        price = Number(price);
        if(isNaN(price)){
            layer.msg('请设置合理价格', { time: 1000 });
            price = $('.surcharge-price input').val('');
            return;
        }
        price = price.toFixed(2);
        if (value == '') {
            layer.msg('请选择算法', { time: 1000 });
            return;
        }else if(value == '1'){
            unit = '人';
        }else if(value == '2'){
            unit = '桌';
        }
        var params = {
            shopId: API.shopId,
            id: API.userId,
            settingName: name,
            settingType: value,
            typeMoney: price
        }
        reqAjaxAsync(API.addEditPrice,JSON.stringify(params))
        .done(function(res){
            if(res.code == 1){
                setPrice(name,price,value);
                $('.setting-add').hide();
                layer.closeAll();
                $('#add-surcharge').hide();
            }else {
                layer.msg(res.msg);
            }
        })
    });

    //附加费 修改
    $('.data-edit').on('click',function(){
        showAddSurcharge();
    });

    // 确定
    $('.setting-btn .btn-ok').on('click',function(){
        editBaseSetting();
    });

    function setPrice(name,price,value){
        //设置附加费
        $('.surcharge-data .data-name').text(name || '');
        $('.surcharge-data .data-price').text(price || '0.00');
         
        $('.surcharge-data .data-unit').attr('data-value', value);
        if (value == '1'){
            $('.surcharge-data .data-unit').text('人');
        }else if(value == '2'){
            $('.surcharge-data .data-unit').text('桌');
        }
        $('#add-surcharge').hide();
        $('.surcharge-data').show();
        $('.setting-add').hide();
    }
    //编辑 价格
    function eidtPrice(callback){
        var name = $('.data-name').text();
        var price = $('.data-price').text();
        var value = $('.data-unit').attr('data-value');
        if(name == '' || price == '' || value == ''){
            layer.msg('附加费设置错误!',{time:1000});
            return;
        }
        var params = {
            shopId: API.shopId,
            id: API.userId,
            settingName: name,
            settingType: value,
            typeMoney: price
        }
        reqAjaxAsync(API.addEditPrice,JSON.stringify(params))
        .done(function(res){
            if(res.code == 1) {
                layer.msg('设置成功',{time:1000});
                callback && callback();
            }else {
                layer.msg(res.msg);
            }
        });
    }

    //查询附加费
    function findPrice() {
        reqAjaxAsync(API.findPrice, JSON.stringify({ shopId: API.shopId}))
        .done(function(res){
            if(res.code == 1) {
                var data = res.data &&  res.data[0];
                if (data && data.settingName){
                    setPrice(data.settingName, data.typeMoney, data.settingType);
                }
            }
        })
    }
    //查询基础设置
    function findBaseSetting(){
        reqAjaxAsync(API.findBaseSetting, JSON.stringify({ shopId: API.shopId }))
            .done(function (res) {
                if (res.code == 1) {
                    if(res.data && res.data.length > 0){
                        var takeAway = res.data[0].takeAway;            //外卖
                        var dirtyStation = res.data[0].dirtyStation;    //脏台
                        var str = '.setting-food .setting-radio[data-value="' + dirtyStation + '"]';
                        $(str).addClass('radio-checked');
                        var str = '.setting-takeout .setting-radio[data-value="' + takeAway + '"]';
                        $(str).addClass('radio-checked');
                    } 
                }else{
                    layer.msg(res.msg);
                }
            }) 
    }
    // 编辑 基础设置
    function editBaseSetting(){
        var takeAway = $('.setting-takeout .setting-radio.radio-checked').attr('data-value');
        if (takeAway == ''){
            layer.msg('请设置是否开启外卖!');
            return;
        }
        var dirtyStation = $('.setting-food .setting-radio.radio-checked').attr('data-value');
        if (dirtyStation == '') {
            layer.msg('请设置是否开启脏台!');
            return;
        }
        var params = {
            id: API.userId,
            shopId: API.shopId,
            takeAway: takeAway,
            dirtyStation: dirtyStation
        }
        reqAjaxAsync(API.editBaseSetting, JSON.stringify(params))
            .done(function (res) {
                if (res.code == 1) {
                    console.log(res);
                    layer.msg('修改成功',{time:1000});
                }
            }) 
    }
    //附加费添加 弹框
    function showAddSurcharge(){
        layer.open({
            type: 1,
            // closeBtn: 0, //不显示关闭按钮
            title: ['添加附加费','text-align:center;font-size:18px;'],
            area: ['680px', '500px'],
            anim: 2,
            shadeClose: true, //开启遮罩关闭
            content: $('#add-surcharge'),
            success: function(){
                var name = $('.surcharge-data .data-name').text();
                var price = $('.surcharge-data .data-price').text();
                var value = $('.surcharge-data .data-unit').attr('data-value');
                $('.surcharge-name input').val(name);
                if(value == '1'){
                    $('.surcharge-algorithm .setting-radio').eq(0).addClass('radio-checked').siblings().removeClass('radio-checked');
                }else if(value == '2') {
                    $('.surcharge-algorithm .setting-radio').eq(1).addClass('radio-checked').siblings().removeClass('radio-checked');
                }
                // $('.surcharge-algorithm .setting-radio.radio-checked').attr('data-value', value);
                $('.surcharge-price input').val(price);
            },
            end: function(index,layeno){
                layer.close(index);
                $('#add-surcharge').hide();
            }
        });
    }
});