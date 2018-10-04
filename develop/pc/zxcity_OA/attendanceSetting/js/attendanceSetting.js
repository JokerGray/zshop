// var layer,laydate,form;
// layui.use(['layer','laydate','form'],function () {
//     layer = layui.layer,laydate = layui.laydate,form=layui.form;
// })
$(function () {
    var backUserId = getUrlParams('backUserId');
    var merchantId = getUrlParams('merchantId');
    var REQUIRE_URL = {
        shopList: 'backUser/getCanManageTheShop',//获取店铺列表
        attendanceInfo: 'userWork/queryWorkDeployByShopId',//获取店铺考勤信息
        // save:'userWork/addWorkDeploy'//保存设置
        save:'userWork/addWorkDeployN',//保存设置新
    };
    //复选框
    $('body').on('click','.checki',function () {
        var type = $(this).attr('data-type');
        if(!type){
            $(this).addClass('checkActive').attr('data-type','checked')
        }else{
            $(this).removeClass('checkActive').removeAttr('data-type')
        }
    })

    // var effect = 4;//考勤时间生效方式 1次日生效，4今日生效
    var initStartTime;//初始上班时间
    var initEndTime;//初始下班时间
    //新增上下班时间
    $('#addTime').click(function () {
        var el = $('#addTimeLayer');
        layer.open({
            type: 1,
            title: "新增班次",
            content:el,
            area: ["auto", "300px"],
            closeBtn:1,
            shade: 0.5,
            skin: 'addWifiPage',
            offset: '140px',
            btn: ['确定', '取消'],
            end:function(index){
                emptyInput(el)
                layer.close(index)
            },
            success: function (layeror, index) {
                el.parent().addClass('layui-form')

                // form.on('submit(addTime)',function (data) {
                //     if(data){
                //
                //     }
                // })
            },
            yes:function (index) {
                var timeName = $.trim($('#timeName').val());
                var beginTime = $('#beginTime').val();
                var endTime = $('#endTime').val();

                if(timeName == ''){
                    layer.msg('请填写班次名称',{icon:2})
                    return false;
                }
                if(beginTime == ''){
                    layer.msg('请选择上班时间',{icon:2})
                    return false;
                }
                if(endTime == ''){
                    layer.msg('请选择下班时间',{icon:2})
                    return false;
                }
                if(beginTime === endTime){
                    layer.msg('上班时间和下班时间不能是同一时间',{icon:2});
                    return false;
                }
                if((beginTime.split(":")[0] == endTime.split(":")[0]&&beginTime.split(":")[1] > endTime.split(":")[1])||beginTime.split(":")[0] > endTime.split(":")[0]){
                    layer.msg('上班时间不能大于下班时间',{icon:2});
                    return false;
                }
                var str = ' <ul class="layui-clear ul2"><li class="layui-col-sm4 " data-name="timeName">' +
                    '                        <i class="checki checkActive" data-type="checked"></i>' +timeName+
                    '                    </li>' +
                    '                    <li class="layui-col-sm5 tac" data-name="time">'+beginTime+'-'+endTime+'</li>' +
                    '                    <li class="layui-col-sm3 tar">' +
                    '                        <a href="#" class="edit">编辑</a>' +
                    '                        <a href="#" class="del">删除</a>' +
                    '                    </li></ul>'
                $('.ul2No').before(str);
                $('.ul2No').hide();
                layer.close(index)
                // if(data){
                //
                // }
            }
        })
    })

    $('body').on('click','.edit',function () {
        var el = $('#addTimeLayer');
        var ul = $(this).parents('ul')
        var iclass = ul.find('i').attr('class');
        var ichecked = ul.find('i').attr('data-type') || '';
        console.log(iclass)
        layer.open({
            type: 1,
            title: "修改班次",
            content:el,
            area: ["auto", "300px"],
            closeBtn:1,
            shade: 0.5,
            skin: 'addWifiPage',
            offset: '140px',
            btn: ['确定', '取消'],
            end:function(index){
                emptyInput(el)
                layer.close(index)
            },
            success: function (layeror, index) {
                el.parent().addClass('layui-form')

                var liList =ul.find('li');
                var params = {

                }
                $.each(liList,function (i,item) {
                    var type = $(this).attr('data-name')
                    if(type){

                        if(type == 'time'){
                            var time =  $.trim($(this).text()).split('-');
                            params['beginTime'] =time[0];
                            params['endTime'] =time[1];
                        }else{
                            params[type] = $.trim($(this).text());
                        }
                    }

                })
                setDatas(el,params)
            },
            yes:function (index) {
                var timeName = $('#timeName').val();
                var beginTime = $('#beginTime').val();
                var endTime = $('#endTime').val();

                if(timeName == ''){
                    layer.msg('请填写班次名称',{icon:2})
                    return false;
                }
                if(beginTime == ''){
                    layer.msg('请选择上班时间',{icon:2})
                    return false;
                }
                if(endTime == ''){
                    layer.msg('请选择下班时间',{icon:2})
                    return false;
                }
                if(beginTime === endTime){
                    layer.msg('上班时间和下班时间不能是同一时间',{icon:2});
                    return false;
                }
                if((beginTime.split(":")[0] == endTime.split(":")[0]&&beginTime.split(":")[1] > endTime.split(":")[1])||beginTime.split(":")[0] > endTime.split(":")[0]){
                    layer.msg('上班时间不能大于下班时间',{icon:2});
                    return false;
                }
                var str = ' <li class="layui-col-sm4 " data-name="timeName">' +
                    '                        <i class="'+iclass+'" data-type="'+ichecked+'"></i>' +timeName+
                    '                    </li>' +
                    '                    <li class="layui-col-sm5 tac" data-name="time">'+beginTime+'-'+endTime+'</li>' +
                    '                    <li class="layui-col-sm3 tar">' +
                    '                        <a href="#" class="edit">编辑</a>' +
                    '                        <a href="#" class="del">删除</a>' +
                    '                    </li>'
                ul.html(str);
                layer.close(index)
                // if(data){
                //
                // }
            }
        })


    })
    $('body').on('click','.del',function () {
        var ul = $(this).parents('ul')
        ul.remove()
        var len = $('.ul2').size();
        if(len == 0){
            $('.ul2No').show()
        }else{
            $('.ul2No').hide();
        }
    })
    //渲染数据
        function setDatas(demo,data){
            var inputArr = demo.find('input');
            var imgArr = demo.find('img');
            var selectArr = demo.find('select');
            var textarea = demo.find('textarea');
            setArr(inputArr,data);
            setArr(imgArr,data,'');
            setArr(selectArr,data);
            setArr(textarea,data);

        }
    //遍历数组，填充数据
        function setArr(arr,data,img){
            var ids = '';
            $.each(arr,function (index, item) {
                ids = $(this).attr('id');
                if(data.hasOwnProperty(ids)){
                    if(img !== undefined){
                        $(this).attr('src',data[ids] || '')
                    }else{
                        $(this).val(data[ids]);
                    }
                }
            })
        }
    //清空数据
        function emptyInput(demo){
            demo.find('textarea,input,select').val('');
            demo.find('img').attr('src','');
            demo.find('input,select,textarea').attr('disabled',false)
        }
    //添加WiFi
    $('.addWifi').on('click', function () {
        layer.open({
            type: 1,
            title: "",
            content: template('addWifiTpl', {}),
            area: ["600px", "300px"],
            closeBtn: 0,
            shade: 0.5,
            skin: 'addWifiPage',
            offset: '140px',
            btn: ['确定', '取消'],
            success: function (layeror, index) {
                $(layeror).on('click', '.closeBtn', function () {
                    layer.close(index)
                })
            },
            yes: function (index, layeror) {
                var wifiName = $(layeror).find('#WiFiName').val().trim();
                var macName = $(layeror).find('#wifiMac').val().trim();
                var reg_Mac=/[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}/;
                var wifiList = $('.typeTwo-detail-content li');
                var isCan = true;//记录wifi名称和mac地址是否重复
                if (wifiName === '' || macName === '') {
                    layer.msg('WiFi名称和MAC地址不能为空', {icon: 2});
                    return
                }
                if(!reg_Mac.test(macName)){
                    layer.msg('Mac地址格式不正确', {icon: 2});
                    return
                }
                for(var i = 0;i<wifiList.length;i++){
                    if(wifiName === $(wifiList[i]).find('.wifiName').text()){
                        layer.msg('WiFi名称已被使用，请重新输入',{icon:2});
                        isCan = false;
                    }else if(macName.toLocaleUpperCase() === $(wifiList[i]).find('.wifiMac').text().toLocaleUpperCase()){
                        layer.msg('Mac地址已存在，请重新输入',{icon:2});
                        isCan = false;
                    }
                }
                if(isCan){
                    var html = '<li>'
                        + '<span title="' + wifiName + '" class="wifiName">' + wifiName + '</span>'
                        + '<span class="wifiMac">' + macName.toLocaleUpperCase() + '</span>'
                        + '<span class="delBtn">删除</span>'
                        + '</li>';
                    if ($('.typeTwo-detail-content ul li').length > 1) {
                        $('.typeTwo-detail-content ul').append(html);
                    } else if($('.typeTwo-detail-content ul li').length === 1&&$($('.typeTwo-detail-content ul li')[0]).hasClass('noWifi')) {
                        $('.typeTwo-detail-content ul').html(html);
                    }else{
                        $('.typeTwo-detail-content ul').append(html);
                    }
                    layer.close(index)
                }


            }
        });
    });
    //删除wifi
    $('.typeTwo-detail-content').on('click', '.delBtn', function () {
        $(this).parent().remove();
        if($('.typeTwo-detail-content ul li').length === 0){
            $('.typeTwo-detail-content ul').html('<li style="font-size: 14px;text-align: center;" class="noWifi">您还未设置考勤WIFI，请点击下面按钮设置！</li>')
        }
    });
    //修改考勤地址
    $('.editBtn').on('click', function () {
        layer.open({
            type: 1,
            title: "",
            content: template('editAddressTpl', {}),
            area: ["65.984%", "580px"],
            // area: ["100%", "100%"],
            closeBtn: 0,
            shade: 0.5,
            shadeClose:true,
            skin: 'editAddressPage',
            // offset:'140px',
            btn: '',
            success: function (layeror, index) {
                var num = 0;//记录每次进入弹窗的选址次数，以便判断地址名称显示内容
                getMapLocation(function (obj) {
                    $('.addressDetail').html(obj.address).attr('title', obj.address);
                    $('#coordinate').val(JSON.stringify({
                        longitude: obj.position.lng,
                        latitude: obj.position.lat
                    }));
                    if(num <= 1){
                        $('.addressName').val($('.address h4').text());
                    }else{

                        $('.addressName').val(obj.nearestPOI);
                    }
                    num++;
                });
                $(layeror).on('click', '.cancelBtn', function () {
                    layer.close(index)
                }).on('click', '.yesBtn', function () {
                    var addressName = $('.addressName').val().trim();
                    var addressDetail = $('.addressDetail').text();
                    var location = $('#coordinate').val();
                    if (addressName === '') {
                        layer.msg('请输入地址名称！', {icon: 2});
                        return
                    }
                    if(addressDetail === ''){
                        layer.msg('请选择考勤地址！', {icon: 2});
                        return
                    }
                    $('.address h4').html(addressName);
                    $('.address p').html(addressDetail);
                    $('.address input[type="hidden"]').val(location);
                    layer.close(index)
                })
            }
        })
    });

    // 地图选址
    function getMapLocation(success) {
        var loc = JSON.parse($('.address input').val());
        var nowCenter = [loc.longitude, loc.latitude];
        if(!loc.longitude||!loc.latitude||nowCenter.length === 0){
            nowCenter = [116.397477,39.908692]
        }
        var map = new AMap.Map('container', {
            zoom: 16,
            scrollWheel: true,
            resizeEnable:true,
            center: nowCenter
        });
        //地图选址功能
        AMapUI.loadUI(['misc/PositionPicker'], function(PositionPicker) {
            var positionPicker = new PositionPicker({
                mode: 'dragMap',//dragMap,dragMarker
                map: map,
                // iconStyle:{//自定义外观
                //     url:'//webapi.amap.com/ui/1.0/assets/position-picker2.png',//图片地址
                //     size:[48,48],  //要显示的点大小，将缩放图片
                //     ancher:[24,40],//锚点的位置，即被size缩放之后，图片的什么位置作为选中的位置
                // }
            });
            // var marker = new AMap.Marker({
            //     map: map,
            //     bubble: true
            // });
            positionPicker.on('success', function(positionResult) {
                success?success(positionResult):null
            });
            positionPicker.on('fail', function(positionResult) {
                if(positionResult === {}){
                    map.setCenter(nowCenter);
                }
            });
            positionPicker.start();
            map.panBy(0, 1);
            map.addControl(new AMap.ToolBar({
                liteStyle: true
            }));

        });
        // 完成搜索功能
        AMapUI.loadUI(['misc/PoiPicker'], function(PoiPicker) {
            var poiPicker = new PoiPicker({
                //city:'北京',
                input: 'input'//搜索框ID
            });
            //初始化poiPicker
            poiPickerReady(poiPicker);
        });
        //点击地图，设置地图中心为点击位置
        map.on('click',function (e) {
            map.setCenter([e.lnglat.lng,e.lnglat.lat]);
        });

        function poiPickerReady(poiPicker) {
            window.poiPicker = poiPicker;
            // var marker = new AMap.Marker();
            //
            // var infoWindow = new AMap.InfoWindow({
            //     offset: new AMap.Pixel(0, -20)
            // });
            //选取了某个POI
            poiPicker.on('poiPicked', function(poiResult) {
                var source = poiResult.source,
                    poi = poiResult.item,
                    info = {
                        source: source,
                        id: poi.id,
                        name: poi.name,
                        location: poi.location.toString(),
                        address: poi.address
                    };
                //点击搜索结果后设置搜索框的值为当前点击的结果
                document.getElementById('input').value = info.name;
                //设置地图中心为搜索的位置中心
                map.setCenter([poi.location.lng,poi.location.lat]);
                // marker.setMap(map);
                // infoWindow.setMap(map);
                // marker.setPosition(poi.location);
                // infoWindow.open(map, marker.getPosition());
                // infoWindow.setPosition(poi.location);
                // infoWindow.setContent('POI信息: <pre>' + JSON.stringify(info, null, 2) + '</pre>');

            });
        }
    }
    //获取shopList
    function getShopList() {
        var defer = $.Deferred();
        var params = {
            "backUserId": parseInt(backUserId)
        };
        reqAjaxAsync(REQUIRE_URL['shopList'], JSON.stringify(params)).done(function (res) {
            if (res.code !== 1) {
                layer.msg(res.msg, {icon: 5});
                return
            }
            var html = '';
            res.data.forEach(function (item, index) {
                html += '<option value="' + item.shopId + '">' + item.shopName + '</option>'
            });
            $('#shopSelector').html(html);
            defer.resolve(res)
        }).fail(function (err) {
            layer.msg(err.msg, {icon: 2});
        });
        return defer.promise()
    }

    //切换店铺
    $('#shopSelector').on('change', function () {
        getAttendanceInfo()
    });

    //获取店铺考勤信息
    function getAttendanceInfo() {
        var params = {
            shopId:$('#shopSelector').val(),
            // shopId: "315"
        };
        reqAjaxAsync(REQUIRE_URL['attendanceInfo'], JSON.stringify(params)).done(function (res) {
            if (res.code !== 1) {

                layer.msg(res.msg, {icon: 5});
                return
            }
            setTimeList(res.data.scWorkGrade);
            rendering(res.data);
            layer.msg('数据加载成功', {icon: 6});
        })
    }
    function setTimeList(datas) {

        var str = ''
        if(datas){
            $.each(datas,function(i,item){
                str += ' <ul class="layui-clear ul2"><li class="layui-col-sm4 " data-name="timeName">'+
                    '                        <i class="checki '+(item.isStatus==2?'checkActive':'')+'" data-type="'+(item.isStatus==2?'checked':'')+'"></i>' +item.gradeName+
                    '                    </li>' +
                    '                    <li class="layui-col-sm5 tac" data-name="time">'+item.startTime.slice(0,5)+'-'+item.endTime.slice(0,5)+'</li>' +
                    '                    <li class="layui-col-sm3 tar">' +
                    '                        <a href="#" class="edit">编辑</a>' +
                    '                        <a href="#" class="del">删除</a>' +
                    '                    </li></ul>'
            })
            $('.ul2').remove();
            $('.ul2No').before(str);
            $('.ul2No').hide();
        }else{
            $('.ul2').remove();
            $('.ul2No').show();
        }



    }
    //渲染店铺考勤信息到页面
    function rendering(data) {
        $('#SelectRange').select2({minimumResultsForSearch: -1,language: "zh-CN",}).val(data.workRange).change();
        $('.address h4').text(data.remark1);
        $('.address p').text(data.address || '暂未设置');
        $('.address input[type=hidden]').val(JSON.stringify({
                longitude: data.shopLongitude,
                latitude: data.shopLatitude
            }
        ));
        //渲染wifi信息
        var wifiHtml = '';
        if(data.scWorkWifi === null||(data.scWorkWifi&&data.scWorkWifi.length === 0)){
            wifiHtml = '<li style="font-size: 14px;text-align: center;" class="noWifi">您还未设置考勤WIFI，请点击下面按钮设置！</li>'
        }else{
            data.scWorkWifi.forEach(function (item, index) {
                if(item.wifiName === null){
                    item.wifiName = ''
                }
                if(item.wifiMac === null){
                    item.wifiMac = ''
                }
                wifiHtml += '<li>'
                    + '<span title="' + item.wifiName + '" class="wifiName">' + item.wifiName + '</span>'
                    + '<span class="wifiMac">' + item.wifiMac.toLocaleUpperCase() + '</span>'
                    + '<span class="delBtn">删除</span>'
                    + '</li>';
            });
        }


        $('.typeTwo-detail-content ul').html(wifiHtml);
        //渲染打卡生效方式
        if(data.whether == 1){
            $('.punchStyle li:nth-of-type(1)').find('i').addClass('active');
            $('.punchStyle li:nth-of-type(2)').find('i').removeClass('active');
            $('.punchStyle li:nth-of-type(3)').find('i').removeClass('active');
        }else if(data.whether == 2){
            $('.punchStyle li:nth-of-type(2)').find('i').addClass('active');
            $('.punchStyle li:nth-of-type(1)').find('i').removeClass('active');
            $('.punchStyle li:nth-of-type(3)').find('i').removeClass('active');
        }else if(data.whether == 3){
            $('.punchStyle li:nth-of-type(1)').find('i').addClass('active');
            $('.punchStyle li:nth-of-type(2)').find('i').addClass('active');
            $('.punchStyle li:nth-of-type(3)').find('i').removeClass('active');
        }
        else if(data.whether == 4){
            $('.punchStyle li:nth-of-type(1)').find('i').addClass('active');
            $('.punchStyle li:nth-of-type(2)').find('i').addClass('active');
            $('.punchStyle li:nth-of-type(3)').find('i').addClass('active');
        }else{
            $('.punchStyle li:nth-of-type(1)').find('i').removeClass('active');
            $('.punchStyle li:nth-of-type(2)').find('i').removeClass('active');
            $('.punchStyle li:nth-of-type(3)').find('i').removeClass('active');
        }
        //渲染上下班时间
        // $('#beginTime').val(data.startTime?data.startTime.substr(0, 5):'');
        // $('#endTime').val(data.endTime?data.endTime.substr(0, 5):'');
        // initStartTime = data.startTime?data.startTime:'';
        // initEndTime = data.endTime?data.endTime:'';
        //记录考勤生效方式
        effect = data.effect
    }

    //保存设置
    $('#saveBtn').click(function () {
        var flag = true;
        var shopId = $('#shopSelector').val();
        var shopName = $('#shopSelector :selected').text();
        var workRange = $('#SelectRange').val();
        var remark1 = $('.address h4').text();
        var address = $('.address p').text();
        var wifiName = [];
        var wifiMac = [];
        var whether;
        var startTime = $('#beginTime').val()+':00';
        var endTime = $('#endTime').val()+':00';
        var shopLongitude = JSON.parse($('.address input[type=hidden]').val()).longitude;
        var shopLatitude = JSON.parse($('.address input[type=hidden]').val()).latitude;
        var lis = $('.punchStyle .active');
        var effect = 4;//考勤时间生效方式 1次日生效，4今日生效
        var scWorkGrade = [];
        var ulList = $('.time_list_box').find('.ul2');

        $('.typeTwo-detail-content ul li').each(function (i,v) {
            if($(v).find('.wifiName').text() === ''||$(v).find('.wifiMac').text() === ''){
                wifiName = [];
                wifiMac = [];
                return
            }
            wifiName.push($(v).find('.wifiName').text());
            wifiMac.push($(v).find('.wifiMac').text())
        });
        var total = 0;
        if(ulList.size()>0){
            $.each(ulList,function (i, item) {
                var par = {};
                var time = $(this).find('li:nth-child(2)').text().split('-')
                var gradeName =  $.trim($(this).find('li:nth-child(1)').text())
                par = {
                    "startTime": time[0]+':00',
                    "gradeName":gradeName ,
                    "effect": effect,
                    "endTime": time[1]+':00',
                    "isStatus": 1
                }
                if($(this).find('i').hasClass('checkActive')){
                    par.isStatus = 2
                    total+=1
                }
                scWorkGrade.push(par)
            })
        }else{
            layer.msg('请添加班次',{icon:2});
            flag = false;
        }
        if(total == 0){
            layer.msg('未设置有效班次',{icon:2});
            flag = false;
        }
        if(lis.length === 1 && $(lis[0]).parent().attr('data-whether') == 1){
            whether = 1;
        }else if(lis.length === 1 && $(lis[0]).parent().attr('data-whether') == 2){
            whether = 2;
        }else if(lis.length === 2){
            whether = 3;
        }else if(lis.length === 3){
            whether = 4;
        }
        if(flag){
            var params = {
                "remark1": remark1,
                "address": address,
                "startTime":startTime,
                "endTime": endTime,
                "whether": whether,
                "shopLongitude": shopLongitude,
                "shopLatitude": shopLatitude,
                "workRange": workRange,
                "shopWifiName":wifiName,
                "shopMac": wifiMac,
                "shopId": shopId,
                "shopName": shopName,
                "userId": backUserId,
                "effect": effect,//1次日生效，4今日生效
                scWorkGrade:scWorkGrade
            };
            reqAjaxAsync(REQUIRE_URL['save'],JSON.stringify(params)).done(function (res) {
                if(res.code!==1){
                    layer.msg(res.msg,{icon:5});
                    return
                }
                layer.msg(res.msg,{icon:1});
                getAttendanceInfo()
            })
        }



        // layer.open({
        //     type:1,
        //     title:'',
        //     area:["240px","300px"],
        //     closeBtn:0,
        //     shade:0.5,
        //     shadeClose:true,
        //     content:$('#EffectiveType'),
        //     success:function (layeror, index) {
        //         $(layeror).find('.selectItem ul li').off('click').on('click',function () {
        //             var effectType = $(this).attr('data-effect');
        //             if(effectType == 1||effectType == 4){
        //                 var params = {
        //                     "remark1": remark1,
        //                     "address": address,
        //                     "startTime":startTime,
        //                     "endTime": endTime,
        //                     "whether": whether,
        //                     "shopLongitude": shopLongitude,
        //                     "shopLatitude": shopLatitude,
        //                     "workRange": workRange,
        //                     "shopWifiName":wifiName,
        //                     "shopMac": wifiMac,
        //                     "shopId": shopId,
        //                     "shopName": shopName,
        //                     "userId": backUserId,
        //                     "effect": effect,//1次日生效，4今日生效
        //                     scWorkGrade:scWorkGrade
        //                 };
        //                 params.effect = effectType;
        //                 reqAjaxAsync(REQUIRE_URL['save'],JSON.stringify(params)).done(function (res) {
        //                     if(res.code!==1){
        //                         layer.msg(res.msg,{icon:5});
        //                         return
        //                     }
        //                     layer.msg(res.msg,{icon:1});
        //                     getAttendanceInfo()
        //                 })
        //                 layer.close(index)
        //             }else if(effectType == -1){
        //                 // 取消
        //                 layer.close(index)
        //             }
        //         })
        //     }
        // })

    });

    //选择今日生效和次日生效弹窗
    function selectEffectiveType(params){
        layer.open({
            type:1,
            title:'',
            area:["240px","300px"],
            closeBtn:0,
            shade:0.5,
            shadeClose:true,
            content:$('#EffectiveType'),
            success:function (layeror, index) {
                $(layeror).find('.selectItem ul li').off('click').on('click',function () {
                    var effectType = $(this).attr('data-effect');
                    if(effectType == 1||effectType == 4){
                        params.effect = effectType;
                        reqAjaxAsync(REQUIRE_URL['save'],JSON.stringify(params)).done(function (res) {
                            if(res.code!==1){
                                layer.msg(res.msg,{icon:5});
                                return
                            }
                            layer.msg('保存成功',{icon:1});
                            getAttendanceInfo()
                        })
                        layer.close(index)
                    }else if(effectType == -1){
                        // 取消
                        layer.close(index)
                    }
                })
            }
        })
    }

    init();

    function init() {
        getShopList().done(function () {
            getAttendanceInfo()
        });
        //初始化上班时间和下班时间插件
        laydate.render({
            elem: '#beginTime',
            type: 'time',
            format: 'HH:mm',
            btns: ['now', 'confirm'],
            theme: '#393D49'
        });
        laydate.render({
            elem: '#endTime',
            type: 'time',
            format: 'HH:mm',
            btns: ['now', 'confirm'],
            theme: '#393D49'
        });
        //切换打卡方式
        $('.punchStyle').on('click', 'ul li', function () {
            // $(this).find('i').addClass('active').end().siblings('li').find('i').removeClass('active')

            if(!$(this).find('i').hasClass('active')&&$(this).attr('data-whether') == 1&&$('.typeTwo-detail-content .noWifi').length === 1){
                layer.msg('请先设置考勤wifi',{icon:2});
            }else if(!$(this).find('i').hasClass('active')&&$(this).attr('data-whether') == 2&&(JSON.parse($('.address input[type=hidden]').val()).longitude == null||JSON.parse($('.address input[type=hidden]').val()).longitude == null)){
                layer.msg('请先设置考勤地址',{icon:2});
            }else if(!$(this).find('i').hasClass('active')&&$(this).attr('data-whether') == 3&&($('.typeTwo-detail-content .noWifi').length === 1||JSON.parse($('.address input[type=hidden]').val()).latitude == null)){
                layer.msg('请先设置考勤wifi和考勤地址',{icon:2});
            }else{
                if(($(this).attr('data-whether') == 1||$(this).attr('data-whether') == 2)&&$(this).find('i').hasClass('active')){
                    $(this).find('i').removeClass('active');
                    $('.punchStyle li:nth-of-type(3)').find('i').removeClass('active')
                }else if(($(this).attr('data-whether') == 1||$(this).attr('data-whether') == 2)&&!$(this).find('i').hasClass('active')){
                    $(this).find('i').addClass('active');
                }else if($(this).attr('data-whether') == 3&&$(this).find('i').hasClass('active')){
                    $(this).find('i').removeClass('active')
                }else if($(this).attr('data-whether') == 3&&!$(this).find('i').hasClass('active')) {
                    $(this).find('i').addClass('active').end().siblings().find('i').addClass('active')
                }
            }
        })
    }
});

// function getMapLocation_1(fn) {
//     // 初始化选址地图的初始位置，默认为原先位置，如果原先位置没有设置，默认为北京
//     var loc = JSON.parse($('.address input').val());
//     var nowCenter = [loc.longitude, loc.latitude];
//     var map = new AMap.Map('container', {
//         resizeEnable: true,
//         zoom: 13,
//         // center: nowCenter.length === 0 ? [116.39, 39.9] : nowCenter
//         center: [114.351542,30.564249]
//     });
//     AMap.plugin('AMap.Geocoder', function () {
//         var geocoder = new AMap.Geocoder({
//             //city: "027"//城市，默认：“全国”
//         });
//         var marker = new AMap.Marker({
//             map: map,
//             bubble: true
//         });
//         var input = document.getElementById('input');
//         map.on('click', function (e) {
//             marker.setPosition(e.lnglat);
//             //获取选取的详细地址
//             geocoder.getAddress(e.lnglat, function (status, addressDetailResult) {
//                 if (status == 'complete') {
//                     input.value = addressDetailResult.regeocode.formattedAddress;
//                     //获取选取位置的坐标
//                     geocoder.getLocation(addressDetailResult.regeocode.formattedAddress, function (status, coordinateResult) {
//                         if (status == 'complete') {
//                             var obj = {
//                                 detail: addressDetailResult.regeocode.formattedAddress,
//                                 location: coordinateResult.geocodes[0].location
//                             };
//                             fn ? fn(obj) : null;
//                         }
//                     })
//                 } else {
//                     layer.msg('无法获取地址', {icon: 5});
//                 }
//             })
//         });
//         input.onchange = function (e) {
//             var address = input.value;
//             geocoder.getLocation(address, function (status, result) {
//                 if (status == 'complete' && result.geocodes.length) {
//                     marker.setPosition(result.geocodes[0].location);
//                     map.setCenter(marker.getPosition());
//                 } else {
//                     layer.msg('无法获取地址', {icon: 5});
//                 }
//             })
//         }
//     });
// }