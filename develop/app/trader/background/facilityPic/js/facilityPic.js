//https://wxapp.izxcs.com/qrcode/offline/index.html//自定义参数?shopId=288&facilityId=1
//https://wxapp.izxcs.com/qrcode/offline/a.html?s=288&f=1  s--shopId, f--facilityId
//o--offline(线下-1), f--facilityId(设备id), s--shopId(店铺id), t--type(正餐0，快餐1，店内2), a--area(楼层或区域)

//餐饮--正餐(o, shopId, facilityId, type, area)，快餐(o, shopId, type)
//店内购物--o, shopId,type

(function($){
    var QR_CodeUrl = "https://wxapp.izxcs.com/qrcode/offline/a.html";
    var merchantId = getUrlParams('merchantId');
    var backUserId = getUrlParams('backUserId');
    var shopList = "";
    var REQUIRE_RUL = {
        shopList: 'backUser/getCanManageTheShop',//根据backUserId查询shopList
        categoryList: 'facility/getShopFacilityCategoryList',//查询设备分类列表
       // facilityList: 'facility/list',//设备列表
        facilityList: 'facility/getShopFacility',//设备列表-new
        batchExportCode: 'facility/batchExportCode'//批量导出二维码
    };
    var qrCodeArr = [];
    var imgArr = [];

    //渲染店铺列表数据
    function renderingShopList(shopList, targetDom) {
        var html = '';
        for(var i=0; i<shopList.length; i++){
            html += '<option value="' + shopList[i].shopId + '">' + shopList[i].shopName + '</option>';  
        }
        $(targetDom).html(html).select2();
        
        getCategoryList();
        createQrcode();
        
    }

    //渲染左侧设备分类列表
    function categoryListShow(cList) {
        var sHtml = '';
        for (var i = 0; i < cList.length; i++) {
            sHtml += '<a class="tab-item" href="javascript:;" data-id="' + cList[i].id + '">' + cList[i].categoryName + '</a>'
        }
        $(".list-tab").html(sHtml);
        $(".list-tab").find(".tab-item:eq(0)").addClass("active");
    }

    $(".list-tab").on("click", ".tab-item", function(){
        clear();
        $(this).addClass("active").siblings().removeClass("active");
        loadFacilityList();
    });

    //获取店铺设备分类
    function getCategoryList() {
        var params = {
            'merchantId': merchantId,
            'shopId': $("#shopSelector").val()
        };
        reqAjaxAsync(REQUIRE_RUL['categoryList'], JSON.stringify(params)).done(function (res) {
            if (res.code == 1) {
                categoryListShow(res.data);
            } else {
                layer.msg(res.msg, { icon: 5 });
            }
        });
    }

    //获取店铺列表
    function getShopList() {
        var params = {
            'backUserId': parseInt(backUserId)
        };
        reqAjaxAsync(REQUIRE_RUL['shopList'], JSON.stringify(params)).done(function (res) {
            if (res.code !== 1) {
                layer.msg(res.msg, { icon: 5 });
            }
            shopList = res.data;
            renderingShopList(res.data, '#shopSelector');
        })
    }

   
    function createQrcode(facilityId){

        var shopId = $("#shopSelector").val();
        var type = $(".con-title .tab-box .tab-li.active").attr("data-type");

        var codeUrl = QR_CodeUrl + '?o=1&s=' + shopId + "&t="+type;
        if(facilityId){
            codeUrl = QR_CodeUrl + '?o=1&s=' + shopId + "&t=" + type + '&f=' + facilityId;
        }
        var qrcode = $("#qrCanvas").qrcode({
            render: 'canvas',
            text: codeUrl,
            width: 100,              //二维码的宽度
            height: 100,            //二维码的高度
            //imgWidth: 298 / 4,       //logo图片宽
            //imgHeight: 298 / 4,      //logo图片高
            background: "#ffffff",       //二维码的后景色
            foreground: "#000000"       //二维码的前景色
            //src: ctx + '/css/cloudstore/img/zxcity.png'  //二维码中间的图片
        });
        qrCodeArr.push(qrcode);
        demoCanvas(); 
    }

    $(".con-title .tab-box .tab-li").click(function(){
        clear();
        var type = $(this).attr("data-type");
        $(this).addClass("active").siblings().removeClass("active");
        if (type == 0){
            loadFacilityList();
            $(".facility-box").removeClass("hide").siblings().addClass("hide");
        }else{
            $(".facility-box").addClass("hide").siblings().removeClass("hide");
            createQrcode();
        }
    });
    
    function showFacility(res){
        var sHtml = '';
        if (res.data.length > 0){
            for(var i=0; i<res.data.length; i++){
                sHtml += '<li class="list-item" data-name="' + res.data[i].title + '" data-facilityId="' + res.data[i].id + '" data-shopId="' + res.data[i].shopId +'">';
                sHtml += '<h4 title="">' + res.data[i].title + '</h4>';
                sHtml += '<p>可容纳' + res.data[i].maxNum+'人</p>';
                sHtml += '<div class="erCodeIcon" data-flag="true" ></div>';
                sHtml += '</li>';
                createQrcode(res.data[i].id);
            }
        }else{
            createQrcode();
        }
        $("#facilityList").html(sHtml);

        
    }

    function loadFacilityList(){
        // 获取当前需显示设备的分类
        var facilityType = $('.list-tab').find('.tab-item.active').attr('data-id');
        var params = {
            "facilityType": facilityType, // --设施分类
            "shopId": $('#shopSelector').val() || '',//--店铺编号(可选)
            "merchantId": merchantId, // --商户编号**必传**
            //"shopIdList": [{ "shopId": $('#shopSelector').val() }],
            "pageSize":200,
            "pageNo":1
        };
        reqAjaxAsync(REQUIRE_RUL['facilityList'], JSON.stringify(params)).done(function (res) {
            if(res.code == 1){
                layer.msg('数据加载成功', { icon: 6 });
                showFacility(res);
            }else{
                layer.msg(res.msg, { icon: 5 });
                return;
            }
        });
    }

    //清空，归零
    function clear(){
        qrCodeArr = [];
        imgArr = [];
        $("#qrCanvas").html("");
    }

    $('#shopSelector').on('change', function () {
        clear();
        $(".list-tab .tab-item:eq(0)").addClass("active").siblings().removeClass("active");
        loadFacilityList();
    });
    
    $(function(){
        getShopList();
        
    });

    $("#facilityList").delegate("li", "click", function(){
        var _index = $(this).index();
        demoCanvas(_index);
    });


    //单个二维码
    function demoCanvas(_index){
        var shopName = $("#shopSelector").find("option:selected").text();
        
        var width = 480//$("#canvasBox").width(); //宽度  
        var height = 656//$("#canvasBox").height(); // 高度
        var c = document.getElementById("showCanvas");
        c.width = width
        c.height = height
        var ctx = c.getContext("2d");
        //首先画上背景图
        var img = new Image();
        img.src = 'image/erweima_bg.png';
        img.setAttribute("crossOrigin", 'Anonymous')


        //画上二维码
        function convertCanvasToImage(canvas) {
            var image = new Image();
            image.src = canvas.toDataURL("image/png");
            return image;
        }

        var li_index = _index || 0;
        var shopName = $("#shopSelector").find("option:selected").text();
        var fName = $("#facilityList").find(".list-item:eq(" + li_index + ")").attr("data-name") || shopName;
        var mycans = $('#qrCanvas canvas')[li_index];//二维码所在的canvas
        var codeimg = convertCanvasToImage(mycans);

        var xw = width / 4 + 2
        var xh = height / 4 + 1

        var w_name = width / 2,
            h_name = height / 4 - 30  //画上名字

        img.onload = function () { //必须等待图片加载完成
            ctx.drawImage(img, 0, 0, width, height); //绘制图像进行拉伸

            ctx.font = "26px Microsoft Yahei";
            ctx.fillStyle = '#fff';
            ctx.textAlign = "center";
            ctx.fillText(shopName, w_name, h_name);

            ctx.font = "36px Microsoft Yahei";
            ctx.fillStyle = "#fff";
            ctx.textAlign = "center";
            ctx.fillText(fName, w_name, height / 4 * 3 - 15);

            ctx.drawImage(codeimg, xw, xh, width / 2, width / 2);
            //绘制完成,转为图片

            var bigCans = document.getElementById("showCanvas");
            let images = new Image();
            images.src = bigCans.toDataURL("image/png");
            images.setAttribute("crossOrigin", 'Anonymous');
            var temp = {
                name: fName,
                src: bigCans.toDataURL("image/png").substr(22)
            }
            imgArr.push(temp);
        }   
        return imgArr; 
        
    }

    //导出图片
    function outputPackedImg() {
        
        var shopName = $("#shopSelector").find("option:selected").text();
        var tabName = $(".list-tab .tab-item.active").text();
        var num = qrCodeArr.length;
        var type = $(".con-title .tab-box .tab-li.active").attr("data-type");
        var typeName = $(".con-title .tab-box .tab-li.active").text();
        if(type == 0){
            var folderAndFileName = shopName + '_' + tabName + '二维码图片' + num + '张';
        }else{
            var folderAndFileName = shopName + '_' + typeName + '二维码图片' + num + '张';
        }

        // 压缩包，包内为唯一文件夹
        var zip = new JSZip();
        var img = zip.folder(folderAndFileName);
        var liArr = $("#facilityList").find("li.list-item");
        if(num > 0){
            imgArr = [];
            for(var i=0; i<num; i++){
                imgArr = demoCanvas(i);
            }
            //防止图片没有生成完整就开始下载，延迟
            setTimeout(function () {
                imgArr.forEach(function(item) {
                    img.file(item.name + '.png', item.src, { base64: true });
                }, this);
                // 打包下载
                zip.generateAsync({ type: 'blob' })
                    .then(function (content) {
                        saveAs(content, folderAndFileName + '.zip');
                    });
            }, 300);
        }else{
            layer.msg("当前列表没有二维码可供下载~~~");
        }        
    }

    //点击批量下载
    $(".download-link").click(function(){
        outputPackedImg();
    });
    

})(jQuery);