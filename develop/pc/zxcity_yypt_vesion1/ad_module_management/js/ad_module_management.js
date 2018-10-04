
        jQuery(function ($) { 
            // 服务清单
            var SERVICE = {
                  AD_LIST: 'operations/adList'
                , REGION_LIST: 'operations/regionDefaultSettings' //区域列表
                , MODULE_ADD: "operations/adModuleAdd"
                , REGION_SET: "operations/regionModuleDetails" // 区域的模板设置
            };

            // vue对象
            var _vm = null;

            // 记录区域页面的状态变量
            var _regionStates = {
                regionType: 1,
                cityCode: "4201",
                regionTagId: "",
                tabIndex: 0,
                reset: function () {
                    this.regionType = 1;
                    this.tabIndex = 0;
                }
            };

            // 记录资源页面的状态变量
            var _adStates = {
                pager: false,
                pageIndex: 1,
                pageSize: 8,
                totalCount: 0,
                argText: "",
                argStatus: 1,
                placeHolder: "ph-1",
                reset: function () {
                    this.pageIndex = 1;
                    this.pageSize = 8;
                    this.totalCount = 0;
                    this.pager = false;
                    this.argText = "";
                    this.argStatus = 1;
                }
            }

            // test
            var _adModule = {
                regionId: 0,
                regionGroupCode: "",
                createTime: "",
                adStartTime: "",
                adEndTime: "",
                mainResUrls: "",
                mainResWidth: "",
                mainResHeight: "",
                sideResUrls: "",
                sideResWidth: "",
                sideResHeight: "",
                address1: "",
                address2: "",
                address3: "",
                province: "",
                city: "",
                region: "",
                lastUpdator: "",
                lastUpdateTime: "",
                name: "",
                type: "",
                mainResType: "",
                sideResType: "",
                mainAdId: 0,
                sideAdId: 0
            }

            /* 初始化vue对象
            ************************************/
            function createVue() {
                return new Vue({
                    el: "#vueWrapper",
                    data: {
                        regionItems: [],
                        adItems: [],
                        adModule: _adModule,
                        adRegion: _regionStates,
                        adGroupModule: [],
                        gallery1: [{ resUrl : "image/default-img.jpg", divClass:"item", active: true, video: false }],
                        gallery2: [{ resUrl : "image/default-img.jpg", divClass:"item", active: true, video: false }]
                    },
                    methods: {
                        resetItems: function () {
                            this.$data.regionItems = [];
                        }
                        , resetADItems: function () {
                            this.$data.adItems = [];
                        }
                        , resetAdModule: function () {
                            this.$data.adModule = {
                                regionId: 0,
                                regionGroupCode: "",
                                createTime: "",
                                adStartTime: "",
                                adEndTime: "",
                                mainResUrls: "",
                                mainResWidth: "",
                                mainResHeight: "",
                                sideResUrls: "",
                                sideResWidth: "",
                                sideResHeight: "",
                                address1: "",
                                address2: "",
                                address3: "",
                                province: "",
                                city: "",
                                region: "",
                                lastUpdator: "",
                                lastUpdateTime: "",
                                name: "",
                                type: "",
                                mainResType: "",
                                sideResType: "",
                                mainAdId: 0,
                                sideAdId: 0
                            }
                        }
                        , setPlaceholder: function (item) {
                            if (_adStates.placeHolder == "ph-1") {
                                // 设置对象属性
                                this.$data.adModule.mainAdId = item.id;
                                let mainResUrls = "";
                                $.each(item.resData, function (index, child) {
                                    mainResUrls += child.resUrl + ","
                                });
                                mainResUrls = mainResUrls.substr(0, mainResUrls.lastIndexOf(","));
                                this.$data.adModule.mainResUrls = mainResUrls;
                                this.$data.adModule.mainResType = item.resType;

                                // 设置封面样式
                                _vm.$data.gallery1 = [];
                                $.each(item.resData, function (index, child) {
                                     
                                    var item = { 
                                        resUrl : child.resUrl, 
                                        divClass:"item", 
                                        active: (index == 0),
                                        video: (child.resType == 2)
                                    };
 
                                    
                                    _vm.$data.gallery1.push(item);
                                });
                                

                            }
                            else {
                                // 设置对象属性
                                this.$data.adModule.sideAdId = item.id;
                                let sideResUrls = "";
                                $.each(item.resData, function (index, child) {
                                    sideResUrls += child.resUrl + ","
                                });
                                sideResUrls = sideResUrls.substr(0, sideResUrls.lastIndexOf(","));
                                this.$data.adModule.sideResUrls = sideResUrls;
                                this.$data.adModule.sideResType = item.resType;
 
                                // 设置封面样式
                                _vm.$data.gallery2 = [];
                                $.each(item.resData, function (index, child) { 
                                    
                                    var item = { 
                                        resUrl : child.resUrl, 
                                        divClass:"item", 
                                        active: (index == 0),
                                        video: (child.resType == 2)
                                    };
                                    
                                    _vm.$data.gallery2.push(item);
                                });
                                 
                            }
                        }
                        , showPerMod: function (regionInfo, event) { 
                            if (event)
                                event.preventDefault();

                            // clean
                            _vm.resetAdModule();

                            // 记录标签的id
                            _regionStates.regionTagId = $(event.target).parent().prop('id');

                            // 清空modal 
                            _vm.$data.gallery1 = [];
                            _vm.$data.gallery2 = [];
                            $("#adContainer").removeClass("in");
                            $("#regionText").text(regionInfo.regionName);


                            this.$data.adModule.regionId = regionInfo.regionId;
                            this.$data.adModule.type = _regionStates.regionType;
                            this.$data.adModule.province = $(".area-name").attr("data-proname");
                            this.$data.adModule.city = $(".area-name").text();
                            this.$data.adModule.region = "";
                            this.$data.adModule.address1 = regionInfo.groupName;
                            this.$data.adModule.address2 = regionInfo.regionName;
                            this.$data.adModule.address3 = "";



                            
                            // 获取当前区域的模板设置
                            let param = {
                                regionId: regionInfo.regionId,
                                parentCode: regionInfo.groupCode,
                                regionType: _regionStates.regionType,
                                cityCode: _regionStates.cityCode
                            }
                            reqAjaxAsync(SERVICE.REGION_SET, JSON.stringify(param))
                                .done(function (res) {
                                    if (res.code == 1) {
                                        if (res.data != null && res.data.length > 0) {
                                            var moduleInfo = res.data[0];

                                            // 刷新广告位封面
                                            var resUrl1 = moduleInfo.mainResUrls.split(',');
                                            var resUrl2 = moduleInfo.sideResUrls.split(',');
                                            _vm.$data.gallery1 = [];
                                            $.each(resUrl1, function (index, child) {  
                                                var item = { 
                                                        resUrl : child, 
                                                        divClass:"item", 
                                                        active: (index == 0),
                                                        video: (moduleInfo.mainResType == 2)
                                                    }; 
                                                _vm.$data.gallery1.push(item);
                                            }); 
                                            _vm.$data.gallery2 = [];
                                            $.each(resUrl2, function (index, child) {  
                                                var item = { 
                                                        resUrl : child, 
                                                        divClass:"item", 
                                                        active: (index == 0),
                                                        video: (moduleInfo.sideResType == 2)
                                                    }; 
                                                _vm.$data.gallery2.push(item);
                                            }); 

                                            // 更新当前模板属性
                                            _vm.$data.adModule.id  = moduleInfo.id;
                                            _vm.$data.adModule.regionId = moduleInfo.regionId;
                                            //_vm.$data.adModule.regionGroupCode = moduleInfo.regionGroupCode;
                                            _vm.$data.adModule.createTime = moduleInfo.createTime;
                                            _vm.$data.adModule.adStartTime = moduleInfo.adStartTime;
                                            _vm.$data.adModule.adEndTime = moduleInfo.adEndTime;
                                            _vm.$data.adModule.mainResUrls = moduleInfo.mainResUrls;
                                            _vm.$data.adModule.mainResWidth = moduleInfo.mainResWidth;
                                            _vm.$data.adModule.mainResHeight = moduleInfo.mainResHeight;
                                            _vm.$data.adModule.sideResUrls = moduleInfo.sideResUrls;
                                            _vm.$data.adModule.sideResWidth = moduleInfo.sideResWidth;
                                            _vm.$data.adModule.sideResHeight = moduleInfo.sideResHeight; 
                                            _vm.$data.adModule.address1 = moduleInfo.address1;
                                            _vm.$data.adModule.address2 = moduleInfo.address2;
                                            _vm.$data.adModule.address3 = moduleInfo.address3;
                                            // 这几个字段后台查不出来, 直接用前端的值
                                            // _vm.$data.adModule.province = moduleInfo.province;
                                            // _vm.$data.adModule.city = moduleInfo.city;
                                            // _vm.$data.adModule.region = "";
                                            _vm.$data.adModule.lastUpdator = moduleInfo.lastUpdator;
                                            _vm.$data.adModule.lastUpdateTime = moduleInfo.lastUpdateTime;
                                            _vm.$data.adModule.name = moduleInfo.name;
                                            _vm.$data.adModule.type = moduleInfo.type;
                                            _vm.$data.adModule.mainResType = moduleInfo.mainResType;
                                            _vm.$data.adModule.sideResType = moduleInfo.sideResType;
                                            _vm.$data.adModule.mainAdId = 0;
                                            _vm.$data.adModule.sideAdId = 0;
                                            
                                            console.log(_vm.$data.adModule.address2);
                                        }
                                        else {
                                            // 如果没有设置模板, 则默认显示广告列表
                                            $('#adContainer').collapse('show')
                                        }

                                        _vm.slideInModule();
                                    } else {
                                        layer.msg(res.msg);
                                    }
                                });

                                return false;
                        }
                        , showGroupMod: function (regionGroupInfo, event) {
                            if (event)
                                event.preventDefault();

                            // clean
                            _vm.resetAdModule();
                            
                            // 清空modal 
                            _vm.$data.gallery1 = [];
                            _vm.$data.gallery2 = [];
                            $("#adContainer").removeClass("in");
                            $("#regionText").text(regionGroupInfo.groupName);

                            // 记录标签的id
                            _regionStates.regionTagId = "";
                            
                            // 基本信息
                            _vm.$data.adModule.regionId = 0;//有的组没有regionId有的组有, 所以统一为0
                            _vm.$data.adModule.regionGroupCode = regionGroupInfo.groupCode; 
                            _vm.$data.adModule.type = _regionStates.regionType;
                            _vm.$data.adModule.province = $(".area-name").attr("data-proname");
                            _vm.$data.adModule.city = $(".area-name").text();
                            _vm.$data.adModule.region = "";
                            _vm.$data.adModule.address1 = regionGroupInfo.groupName;
                            _vm.$data.adModule.address2 = "";
                            _vm.$data.adModule.address3 = "";
                            
                            // 获取区域分组的模板设置
                            let param = {
                                regionGroupCode: regionGroupInfo.groupCode,
                                regionType: _regionStates.regionType,
                                cityCode: _regionStates.cityCode
                            }
                            reqAjaxAsync(SERVICE.REGION_SET, JSON.stringify(param))
                                .done(function (res) {
                                    if (res.code == 1) {
                                        if (res.data != null && res.data.length > 0) {
                                            var moduleInfo = res.data[0]; 


                                            // 刷新广告位封面
                                            var resUrl1 = moduleInfo.mainResUrls.split(',');
                                            var resUrl2 = moduleInfo.sideResUrls.split(',');
                                            _vm.$data.gallery1 = [];
                                            $.each(resUrl1, function (index, child) {  
                                                var item = { 
                                                        resUrl : child, 
                                                        divClass:"item", 
                                                        active: (index == 0),
                                                        video: (moduleInfo.mainResType == 2)
                                                    }; 
                                                _vm.$data.gallery1.push(item);
                                            });
                                            _vm.$data.gallery2 = [];
                                            $.each(resUrl2, function (index, child) {  
                                                var item = { 
                                                        resUrl : child, 
                                                        divClass:"item", 
                                                        active: (index == 0),
                                                        video: (moduleInfo.sideResType == 2)
                                                    }; 
                                                _vm.$data.gallery2.push(item);
                                            });

                                            // 更新当前模板属性
                                            _vm.$data.adModule.id  = moduleInfo.id;
                                            _vm.$data.adModule.regionId = 0;
                                            _vm.$data.adModule.regionGroupCode = moduleInfo.regionGroupCode;
                                            _vm.$data.adModule.createTime = moduleInfo.createTime;
                                            _vm.$data.adModule.adStartTime = moduleInfo.adStartTime;
                                            _vm.$data.adModule.adEndTime = moduleInfo.adEndTime;
                                            _vm.$data.adModule.mainResUrls = moduleInfo.mainResUrls;
                                            _vm.$data.adModule.mainResWidth = moduleInfo.mainResWidth;
                                            _vm.$data.adModule.mainResHeight = moduleInfo.mainResHeight;
                                            _vm.$data.adModule.sideResUrls = moduleInfo.sideResUrls;
                                            _vm.$data.adModule.sideResWidth = moduleInfo.sideResWidth;
                                            _vm.$data.adModule.sideResHeight = moduleInfo.sideResHeight;
                                            // _vm.$data.adModule.address1 = moduleInfo.address1;
                                            // _vm.$data.adModule.address2 = moduleInfo.address2;
                                            // _vm.$data.adModule.address3 = moduleInfo.address3;   
                                            // _vm.$data.adModule.province = moduleInfo.province;
                                            // _vm.$data.adModule.city = moduleInfo.city;
                                            // _vm.$data.adModule.region = "";
                                            _vm.$data.adModule.lastUpdator = moduleInfo.lastUpdator;
                                            _vm.$data.adModule.lastUpdateTime = moduleInfo.lastUpdateTime;
                                            _vm.$data.adModule.name = moduleInfo.name;
                                            _vm.$data.adModule.type = moduleInfo.type;
                                            _vm.$data.adModule.mainResType = moduleInfo.mainResType;
                                            _vm.$data.adModule.sideResType = moduleInfo.sideResType;
                                            _vm.$data.adModule.mainAdId = 0;
                                            _vm.$data.adModule.sideAdId = 0;
                                        }
                                        else {
                                            // 如果没有设置模板, 则默认显示广告列表
                                            $('#adContainer').collapse('show')
                                        }
                                        
                                        _vm.slideInModule();

                                    } else {
                                        layer.msg(res.msg);
                                    }
                                });
                                
                                return false;
                        }
                        , slideInModule: function (event) {
                            if (event) {
                                event.preventDefault();
                            }

                            $("#pnlAlert").hide();

                            $(".advertising-top").hide("fast");
                            $("#tbRegionType").hide("fast");
                            $(".easy1").slideToggle("fast");
                            $(".easy2").slideToggle("fast");
                            $("#pnlModuleButtons").show("fast");
                            return false;
                        }
                        , slideOutModule: function (event) {
                            if (event) {
                                event.preventDefault();
                            }
                            $(".advertising-top").show("fast");
                            $("#tbRegionType").show("fast");
                            $(".easy1").slideToggle("fast");
                            $(".easy2").slideToggle("fast");
                            $("#pnlModuleButtons").hide("fast");


                            while (_vm.$data.gallery1.length) {
                                _vm.$data.gallery1.pop();
                              }
                              while (_vm.$data.gallery2.length) {
                                  _vm.$data.gallery2.pop();
                                }
                            // _vm.$data.gallery1 = [];
                            // _vm.$data.gallery2 = [];

                            

                            return false;
                        }
                        , saveModule: function (event) {
                            if (event)
                                event.preventDefault();

                            if (this.$data.adModule.mainResUrls == null ||
                                this.$data.adModule.mainResUrls == "") {
                                layer.msg("请设置广告位1");
                                return;
                            }

                            if (this.$data.adModule.sideResUrls == null ||
                                this.$data.adModule.sideResUrls == "") {
                                layer.msg("请设置广告位2");
                                return;
                            } 

                            if (this.$data.adModule.regionId == 0 && this.$data.adModule.regionGroupCode == "") { 
                                this.slideOutModule();
                                return;
                            }

                            // 保存
                            reqAjaxAsync(SERVICE.MODULE_ADD, JSON.stringify(this.$data.adModule))
                                .done(function (res) {
                                    if (res.code == 1) {
                                        
                                        // 更新区域的勾选状态
                                        if (_regionStates.regionTagId && _regionStates.regionTagId != "") {
                                            $("#" + _regionStates.regionTagId).not(".checked").addClass("checked");
                                        }
                                        else {
                                            loadAdRegion();
                                        }

                                        layer.msg("模板已保存", { time: 700 }, function () {

                                            _vm.slideOutModule();
                                            _vm.resetAdModule();
                                        });
                                    } else {
                                        layer.msg(res.msg);
                                    }
                                }); 
                        }
                    }
                });
            }








            /* 初始化分页
            ******************************************************/
            function buildPager(totalCount, pageSize, pageIndex) {
                layui.laypage.render({
                    elem: "pgrAdvertise",
                    count: totalCount,
                    layout: ['prev', 'page', 'next'],
                    //limits: [10, 20],
                    limit: pageSize,
                    jump: function (obj, first) {
                        if (!first) {
                            _adStates.pageIndex = obj.curr;
                            loadAd();
                        }
                        $(".layui-laypage-prev").text("<");
                        $(".layui-laypage-next").text(">");
                    }
                });

                _adStates.pager = true;
            }


            /* 加载广告区域设置
            ************************************/
            function loadAdRegion() {
                var param = {
                    regionType: _regionStates.regionType,
                    cityCode: _regionStates.cityCode
                }

                reqAjaxAsync(SERVICE.REGION_LIST, JSON.stringify(param))
                    .done(function (res) {
                        if (res.code == 1) {

                            // 将数据分组
                            var groupData = groupRegion(res.data);

                            _vm.$data.regionItems = groupData;


                        } else {
                            _vm.resetADItems();
                            _regionStates.reset();
                        }
                    });
            }

            /* 加载广告列表
            ************************************/
            function loadAd(adName, status) {
                var param = {
                    sort: "lastUpdateTime",
                    order: "DESC",
                    page: _adStates.pageIndex,
                    rows: _adStates.pageSize,
                    name: adName || _adStates.argText,
                    status: status || _adStates.argStatus
                }

                reqAjaxAsync(SERVICE.AD_LIST, JSON.stringify(param))
                    .done(function (res) {
                        if (res.code == 1) {

                            var data = res.data;
                            for (var i = 0; i < data.length; i++) {
                                if (data[i].coverUrl === undefined || data[i].coverUrl == "") {
                                    data[i].coverUrl = "image/default-img.jpg";
                                }
                            }


                            _vm.$data.adItems = data;

                            _adStates.totalCount = res.total;
                            _adStates.argText = param.name;
                            _adStates.argStatus = param.status;

                            // 创建分页
                            if (_adStates.pager == false) {
                                buildPager(_adStates.totalCount, _adStates.pageSize, _adStates.pageIndex);
                            }


                        } else {
                            layer.msg(res.msg);
                        }
                    });

            }

            /* 将区域数组进行分组
            ************************************/
            function groupRegion(ungroupedRegionArray) {
                let dict = {};
                let groupedRegionArray = [];


                ungroupedRegionArray.forEach((item1) => {
                    // 不存在key
                    if (!dict[item1.groupCode]) {
                        var firstKeyItem = {
                            groupCode: item1.groupCode,
                            groupName: item1.groupName,
                            members: [item1]
                        };

                        groupedRegionArray.push(firstKeyItem);
                        dict[item1.groupCode] = firstKeyItem;
                    } else {
                        // 已存在key 
                        groupedRegionArray.every((item2) => {
                            if (item2.groupCode === item1.groupCode) {
                                dict[item1.groupCode].members.push(item1)
                                return false;
                            }

                            return true;
                        });
                    }
                });

                return groupedRegionArray;
            }

            /* 激活指定名称的标签页
            ************************************/
            function activaTab(tab) {
                $('.nav-tabs a[href="#' + tab + '"]').tab('show');
            };

            /* 获取当前标签页索引
            ************************************/
            function getCurrentTabIndex() {
                var tabIndex = $("ul.nav-tabs li.active").index();
                if (tabIndex < 0)
                    tabIndex = 0;

                return tabIndex;
            }


            /* DOM加载完成后
            ************************************/ 
            function pageLoad() {

                // 1.创建vue
                _vm = createVue();

                // 2.加载广告列表
                loadAdRegion();

                // 3.绑定标签事件
                $('#tbRegionType a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
                    if (e.target == e.relatedTarget)
                        return;

                    _regionStates.tabIndex = getCurrentTabIndex();
                    _regionStates.regionType = _regionStates.tabIndex + 1;

                    loadAdRegion();
                });

                // 4.激活第一个标签
                activaTab("tabs-1");

                // 5.绑定广告位事件
                $("#ph-1").click(function () {
                    $('#adContainer').collapse('show');
                    _adStates.placeHolder = "ph-1";
                    $(this).addClass("active");
                    $("#ph-2").removeClass("active");
 
                });
                $("#ph-2").click(function () {
                    $('#adContainer').collapse('show')
                    _adStates.placeHolder = "ph-2";
                    $(this).addClass("active");
                    $("#ph-1").removeClass("active");
 
                });

                // 6. 加载广告数据 
                loadAd();

                // 滚动条美化
                //$("body").niceScroll({ cursorcolor: "#ccc", iframeautoresize: true });

            }


            pageLoad();

            $(".area-name").bind('DOMNodeInserted', function (e) {
                _regionStates.cityCode = $(".area-name").attr("data-city");
                loadAdRegion();
            });
        });
