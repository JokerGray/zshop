
const SERVICE = {
    MENU_TREE: "operations/menuTree",
    TICKET_ASSIGNED :  "operations/ticketList"
};

var roleId = yyCache.get("roleIds"); // 角色数组 


/* vue对象
******************************************/
var admin = function createVue() {
    return new Vue({
        el: "#admin",
        data: {
            dict: {},       // 表示打开的页面和选项卡集合的字典
            forms: [],      // 表示打开的页面
            tabs: [],       // 表示打开的选项卡
            navBtns: [],    // 表示侧边的导航按钮
            recents: {},   // 表示最近打开过的页面链接
            filterList: [] // 表示用于搜索的链接列表
            , todoTickets : []
            , userInfo : {
                nickName : "",
                roleName : "",
                avator : ""
            }
        },
        methods: {
            /* 判断某个选项卡是否存在 */
            contains: function (key) {
                var contain = false;

                if (this.$data.dict[key])
                    contain = true;

                return contain;
            }
            /* 显示一个页面(加下划线仅表示私有使用, _show对应的公开方法是open)  */
            , _show: function (dict) {
                if (!dict)
                    return;

                $.each(admin.$data.tabs, function (index, item) {
                    item.active = false;
                });
                $.each(admin.$data.forms, function (index, item) {
                    item.visible = false;
                });

                dict.form.visible = true;
                dict.tab.active = true;
                // 仅在第一次显示时, 加载页面url
                if (dict.form.lazyload && dict.form.url != dict.form._delayUrl) {
                    dict.form.url = dict.form._delayUrl;
                }

                var key = dict.form.title;
                if (!this.$data.recents[key]) {
                    this.$data.recents[key] = { name: key, url: dict.form.url };
                }
            }
            /* 添加一个选项卡和一个内嵌页面 */
            , add: function (key, url, options) {


                if (!this.$data.dict[key]) {
                    if (url === undefined || url == null || url == "") {
                        url = "404.html";
                    }

                    var newForm = {
                        title: key,
                        url: url,
                        visible: true,
                        fixed: false,
                        lazyload: false,
                        _delayUrl: ""
                    }

                    var newTab = {
                        title: key,
                        active: false,
                        iconClass: null,
                        url: url
                    }
                    if (options) {

                        // set tab options
                        newTab.active = options.active == true ? true : false;
                        newTab.iconClass = options.icon || "";
                        // set form options
                        if (options.lazyload) {
                            newForm.lazyload = true;
                            newForm.url = "";
                            newForm._delayUrl = url;
                        }
                        else {
                            newForm.lazyload = false;
                            newForm.url = url;
                        }
                        newForm.fixed = options.fixed || false;
                        newForm.visible = options.active == true ? true : false;
                    }

                    this.$data.dict[key] = {
                        form: newForm,
                        tab: newTab
                    };
                    this.$data.forms.push(newForm);
                    this.$data.tabs.push(newTab);


                    // 用session
                    this.save();

                }

                return this.$data.dict[key];
            } 
            /* 添加多个选项卡和内嵌页面 */
            , addRange: function (keys, urls, options) {
                var i = 0;
                for (; i < keys.length; i++) {
                    this.add(keys[i], urls[i], options[i]);
                }
            }
            /* 添加一个选项卡并打开它 */
            , addOpen: function (key, url) {
                this.add(key, url);
                this.open(key);
            }
            /* 新建(打开)一个选项卡 */
            , open: function (key) {
                this._show(this.get(key));
                
                this.save();
                

                // 激活tab (将DOM相关的操作委托给外部)
                if (this.activeTabFunc) {
                    this.activeTabFunc();
                }
            }
            , activeTabFunc : null
            /* 删除一个选项卡和相应的页面 */
            , remove: function (key) {

                var index = Object.keys(this.$data.dict).indexOf(key);  
                var prevIndex = index - 1;
                var lastIndex = this.$data.tabs.length - 1;
                if (prevIndex < 0) {
                    prevIndex = 0;
                }
                else if (prevIndex > lastIndex) {
                    prevIndex = lastIndex;
                }

                var isActived = this.$data.tabs[index].active;
                this.$data.forms.splice(index, 1);
                this.$data.tabs.splice(index, 1);

                delete this.$data.dict[key];

                // active to nearby item
                if (isActived) {
                    let lastTab = this.$data.tabs[prevIndex];
                    let lastFrame = this.$data.forms[prevIndex];

                    lastTab.active = true;
                    lastFrame.visible = true;

                    this.open(lastFrame.key);
                }


                this.save();
            }
            , clear: function () {
                var keys = Object.keys(this.$data.dict);
                for (var i = keys.length - 1; i >= 0; i--) {
                    let key = keys[i];
                    let item = this.$data.dict[key];
                    if (item.form.fixed) {
                        continue;
                    }

                    this.$data.forms.splice(i, 1);
                    this.$data.tabs.splice(i, 1);
                    delete this.$data.dict[key];
                }

                if (keys.length > 0)
                    this.open(keys[0]);


                    this.save();
            }
            , clearEx: function () {

                var keys = Object.keys(this.$data.dict);
                for (var i = keys.length - 1; i >= 0; i--) {
                    let key = keys[i];
                    let item = this.$data.dict[key];
                    if (item.tab.active) {
                        continue;
                    }
                    if (item.form.fixed) {
                        continue;
                    }

                    this.$data.forms.splice(i, 1);
                    this.$data.tabs.splice(i, 1);
                    delete this.$data.dict[key];
                }

                this.save();
            }
            , get: function (key) {
                return this.$data.dict[key] || null;
            }
            , current: function (url) {
                var currentDict = null;

                $.each(this.$data.tabs, function (index, element) {
                    if (element.active) {
                        currentDict = admin.get(element.title);
                        return false;
                    }
                });

                if (url) {
                    currentDict.form.url = url;
                }


                return currentDict;
            }
            , save : function() {
                sessionStorage.setItem("lastOpenedPages", JSON.stringify(this.$data.dict))
            }
            , test : function() {
                console.log('test')
            }
        }
    });
}();



/* 树控制器 (DOM)
******************************************/
var treeCtrl = {
    treeObj: {},
    lastActiveKey: "",
    build: function (res) {

        var setting = {
            check: {
                enable: false,
                chkStyle: "checkbox",
                radioType: "all",
                nocheckInherit: true,
                chkDisabledInherit: true
            },
            data: {
                simpleData: {
                    enable: true,
                    idKey: "id",
                    pIdKey: "pid",
                    rootPId: null
                }
            },
            view: {
                showIcon: true
            },
            callback: {
                onClick: this.ztreeClick
            }
        };

        // 重新创建 
        $.fn.zTree.destroy();
        $(".side-menu").empty();
        this.treeObj = $.fn.zTree.init($(".side-menu"), setting, res);

        // 展开节点
        this.treeObj.expandAll(true, function () {
            /* 2018-01-17 mzc 滚动条更新 
            * 在ztree的expandAll方法加了callback 
            * 因为等展开动画结束高度才会有变化.再调用resize(). 经测试目前数据量的展开动画的时间在10ms-70ms之间, 容差可在200ms左右调整
            */
            setTimeout(() => {
                //$(".do-nicescroll4").getNiceScroll().remove();
                $(".do-nicescroll4").getNiceScroll().resize();
                $(".do-nicescroll4").scrollTop(0);

            }, 500);
        });
    }
    , ztreeClick: function (event, treeId, treeNode) {
        if (event)
            event.preventDefault();

        if (treeNode.isParent) {
            //this.treeObj.expandNode(treeNode,!treeNode.open,false,true)
        }
        else {
            var key = treeNode.name;
            var url = treeNode.url;

            misc.openTab(key, url);

            // 点击菜单后隐藏
            misc.toggleNavBtn(key);
            treeCtrl.hide(true);
        }

    }
    , show: function (animation, callback) {
        var $sideMenuBar = $(".side-menu-bar");
        if (!$sideMenuBar.hasClass("show")) {
            $sideMenuBar.addClass("show");
        }
        if (animation) {
            $sideMenuBar.attr("data-delay", "1");
            $sideMenuBar.animate({ left: "60px" }, "fast", callback)
        }
        else {
            $sideMenuBar.attr("data-delay", "1");
            $sideMenuBar.css({ left: "60px" });
            if (callback)
                callback.call();
        }
    }
    , hide: function (animation, callback) {
        var $sideMenuBar = $(".side-menu-bar");
        $sideMenuBar.removeClass("show");
        if (animation) {
            $sideMenuBar.attr("data-delay", "0");
            $sideMenuBar.animate({ left: "-250px" }, "fast", callback);
        }
        else {
            $sideMenuBar.attr("data-delay", "0");
            $sideMenuBar.css({ left: "-250px" });
            if (callback)
                callback.call();
        }
    }
    , toggle: function (animation, callback) {
        var $sideMenuBar = $(".side-menu-bar");
        if ($sideMenuBar.hasClass("show")) {
            treeCtrl.hide(animation);
        }
        else {
            treeCtrl.show(animation);
        }
    }

}




/* 选项卡控制器  (DOM)
******************************************/
var tabCtrl = {
    switchTo: function (key) {
        var dictInfo = admin.get(key);
        if (!dictInfo)
            return false;

        admin.open(key);
    },
    close: function (key, event) {
        admin.remove(key);
    }
}



/* 搜索菜单控制器  (DOM)
******************************************/
var menuFilterBox = function () {
    var input = $('input#txtMenuQuery');
    var divInput = $('div.input');
    var width = divInput.width();
    var outerWidth = divInput.parent().width() - (divInput.outerWidth() - width) - 28;
    var submit = $('.menu-filter-box');
    var recent = $(".recent-list");
    var filtered = $(".filter-list");
    var txt = input.val();

    input.bind('focus', function () {
        if (input.val() === txt) {
            input.val('');
        }
        $(this).animate({ color: '#000' }, 300);
        $(this).parent().animate({
            width: outerWidth + 'px',
            backgroundColor: '#fff',
            paddingRight: '28px'
        }, 300, function () {
            if (!(input.val() === '' || input.val() === txt)) {
                recent.hide();
                filtered.show();
                submit.fadeIn(300);
            }
            else {
                recent.show();
                filtered.hide();
                submit.fadeIn(300);
            }
        }).addClass('focus');



    }).bind('blur', function () {
        $(this).animate({ color: '#b4bdc4' }, 300);
        $(this).parent().animate({
            width: width + 'px',
            backgroundColor: '#e8edf1',
            paddingRight: '15px'
        }, 300, function () {
            if (input.val() === '') {
                input.val(txt)
            }
        }).removeClass('focus');

        input.val("");
        submit.fadeOut(300);
    }).keyup(function () {
        if (input.val() === '') {
            // submit.fadeOut(300);
            admin.$data.filterList = [];
            recent.show();
            filtered.hide();
        } else {
            submit.fadeIn(300);
            recent.hide();
            filtered.show();

            var searchString = $(this).val().replace(/[-[\]{}()*+?.,\\^$|#]/g, "\\$&").replace(" ", "");
            admin.$data.filterList = [];
            misc.menuList.forEach(function (item, index) {
                if (item.name.indexOf(searchString) >= 0) {

                    var filterItem = {
                        name: item.name,
                        url: ""
                    };
                    if (item.url && item.url.indexOf("html") > 0) {
                        if (item.url.indexOf("/") < 0) {
                            filterItem.url = item.url.replace(".html", "/") + item.url;
                        }
                    }

                    admin.$data.filterList.push(filterItem);

                }
            });
        }
    });
};



/* 杂七杂八控制器  (DOM, 业务相关)
******************************************/
var misc = {

    /* 切换圆按钮状态 */
    toggleNavBtn: function (key) {
        $.each(admin.$data.navBtns, function (index, element) {

            if (element.name == key) {
                element.active = true;
            }
            else {
                element.active = false;
            }
        });
    }
    /* 切换左侧菜单树显示隐藏 */
    , toggleMenuBar : function (item, event) {
        var key = item.name;
        var triggered = treeCtrl.lastActiveKey == item.name;//标题是否和上次点击的相同

        if (triggered) {
            this.toggleNavBtn(key);
            treeCtrl.toggle(true);
        }
        else {
            this.toggleNavBtn(key);

            // 切换菜单栏
            $(".side-menu-bar-caption").text(key);

            treeCtrl.show(true, function () {
                treeCtrl.build(item.children);
            });
        }

        treeCtrl.lastActiveKey = key;
    }
    , computeTabLeft(n) {
        return "left:" + (n * 147) + "px; z-index:" + (1000 - n);
    }
    , openTab: function (key, url) { // 为其他页面封装了一个方法

        var dictInfo = admin.get(key);
        if (dictInfo == null) {
            if (url && url.indexOf("html") > 0) {
                if (url.indexOf("/") < 0) {
                    url = url.replace(".html", "/") + url;
                }
            }

            dictInfo = admin.add(key, url);
        }

        admin.open(key);
    }
    /**
     * 生成菜单根节点
     */
    , rootMenu: function (menuData) {
        var groupedArray = [];
        if (!menuData)
            return groupedArray;

        menuData.forEach((item) => {
            if (item.pid == null || item.pid == '') {

                groupedArray.push(item);

                this.childMenu(menuData, item);
            }
        });

        return groupedArray;
    }
    /**
     * 生成菜单子节点
     */
    , childMenu: function (menuData, parentItem) {
        menuData.forEach((item) => {
            if (parentItem.id == item.pid) {
                if (!parentItem.children)
                    parentItem.children = [];
                parentItem.children.push(item);

                this.childMenu(menuData, item);
            }
        });
    }
    /**
     * 刷新页面 
     */
    , reload: function () {
        var dictInfo = admin.current();
        var target = $("iframe[src='" + dictInfo.form.url + "']");
        if (target && target.length > 0) {
            target[0].contentWindow.location.reload(true);
        }
    }
    /**
     * 关闭其他页
     */
    , closeOther: function () {
        admin.clearEx();
    }
    /**
     * 关闭全部页面
     */
    , closeAll: function () {
        admin.clear();
    }
    /**
     * 退出登录
     */
    , quit : function() {
        if (yyCommon)
            yyCommon.logout();
        else
            top.location.href = "login.html";
    }    
    /**
     * 关闭选项卡菜单
     */
    , dismissTabMenu : function() { 
        $(".tab-action-dropdown").attr("data-delay", "0");
        $(".tab-action-dropdown").hide();
    }
    /**
     * 关闭导航栏菜单
     */
    , dismissNavMenus : function() {
        $(".dropdown-menu").removeClass("dropdown-open");
        $(".dropdown-menu").hide();
    }
    /**
     * 初始化选项卡
     */
    , setTab : function() { 
        var lastOpenedPages = JSON.parse(sessionStorage.getItem("lastOpenedPages"));
        if (lastOpenedPages) {
            var act = "";

            for (var key in lastOpenedPages){
                if (lastOpenedPages.hasOwnProperty(key)) {
                    let dict = lastOpenedPages[key];

                    // 第1次
                    if (act == "") {
                        act = dict.tab.title;
                    }
                    else if (dict.tab.active) {
                        act =  dict.tab.title;
                    }

                    admin.add(
                        dict.form.title, 
                        dict.form.lazyload ? dict.form._delayUrl : dict.form.url, 
                        {
                            active: dict.tab.active,
                            icon: dict.tab.iconClass,
                            fixed: dict.form.fixed,
                            lazyload: !dict.tab.active
                        });
                }
            }

            admin.open(act);
        }
        else {
            //判断当是客服时进入客服首页
            if(roleId[0]=='SERVICE_ROLE_ID'){
                admin.addRange(
                    ["我的首页",
                        "我的常用"],
                    ["service_index/service_index.html",
                        "commonly_menu/commonly_menu.html"],
                    [{active: true, icon: "head-index", fixed: true},
                        // { icon: "head-menus", lazyload: true, fixed: true },
                        {icon: "head-usual", lazyload: true, fixed: true}]);
            }else {
                admin.addRange(
                    ["我的首页",
                        "我的常用"],
                    ["mine_index/mine_index.html",
                        "commonly_menu/commonly_menu.html"],
                    [{active: true, icon: "head-index", fixed: true},
                        // { icon: "head-menus", lazyload: true, fixed: true },
                        {icon: "head-usual", lazyload: true, fixed: true}]);
            }
        }
    }
    , setTabWheellEvent : function() { 
        // 设置选项卡栏鼠标滚轮事件
        $(".menu-head").on("mousewheel DOMMouseScroll", function (event) {
            var delta = Math.max(-1, Math.min(1, (event.originalEvent.wheelDelta || -event.originalEvent.detail)));

            $(this).scrollLeft($(this).scrollLeft() - (delta * 40));
            event.preventDefault();
        });
    }
    , setNavMenuEvent : function() { 
        // 设置导航栏点击, 相互隐藏
        $("ul.navbar-menu>li").click(function(e) {
            
            e.stopPropagation();

            var $all = $(".dropdown-menu");
            var $child = $(this).find(".dropdown-menu");
            if ($child.hasClass("dropdown-open")) {
                $all.hide(); 
                $all.removeClass("dropdown-open");
            }
            else {
                $all.hide(); 
                $all.removeClass("dropdown-open");

                misc.dismissTabMenu();

                $child.addClass("dropdown-open");
                $child.show();
            }

        });
    }
    , setVueDelegate : function() {
        // vue相关
        admin.activeTabFunc = function() {
            setTimeout(()=>{ 
                var activeTabLeft = $(".ave").position().left;
                if (activeTabLeft + 167 >= $(".menu-head").outerWidth()) {
                    $(".menu-head").scrollLeft(activeTabLeft);
                }
            },100);
        }
    }
    , setTabMenuItemEvent : function() {

        // 刷新当前
        $("#reload").ripple({
            callback: function ($container, $ripple, posI, maxDiameter) {
                misc.reload();
                misc.dismissTabMenu();
            }
        });
        // 关闭其他 
        $("#closeOther").ripple({
            callback: function ($container, $ripple, posI, maxDiameter) {
                misc.closeOther();
                setTimeout(() => { 
                    misc.dismissTabMenu();
                }, 400);
            }

        });
        // 关闭全部
        $("#closeAll").ripple({
            callback: function ($container, $ripple, posI, maxDiameter) {
                misc.closeAll();
                setTimeout(() => {
                    misc.dismissTabMenu();
                }, 400);
            }
        });


        // tab栏菜单: 鼠标移开菜单消失(iframe点击不好实现, 就这样吧)
        $(".tab-action-dropdown").mouseenter(function () {
            $(".tab-action-dropdown").attr("data-delay", "1");
        });
        $(".tab-action-dropdown").mouseleave(function () {
            $(".tab-action-dropdown").attr("data-delay", "0");
            setTimeout(() => {
                var delay = $(".tab-action-dropdown").attr("data-delay");
                if (delay == "0") {
                    misc.dismissTabMenu();
                }
            }, 500);
        });
    }
    , setPersonalMenuEvent : function () {
        
        // 个人档案
        $("a[data-trigger='profile']").click(function() {
            // layer.open({
            //     type: 2, 
            //     title: "个人档案",
            //     area: ['650px', '380px'],
            //     content: 'user_profile/user_profile.html'
            // });
        });
        // 修改密码
        $("a[data-trigger='password']").click(function() {
            layer.open({
                type: 2, 
                title: "修改密码",
                area: ['650px', '380px'],
                content: 'changePassword/changePassword.html'
              });
        });
        // 退出
        $("a[data-trigger='quit']").click(function() {
            layer.confirm('要退出当前账号吗?', function(index){
                //layer.close(index);
                
                misc.quit()
            });
        });

        $("#btnLogoff").click(function() {
            layer.confirm('要退出当前账号吗?', function(index){
                misc.quit()
            });
        });
    }
    , setTabMenuEvent : function() {
        // 点击展开
        $("a.tab-action-button").click(function (e) {
            e.stopPropagation();

            misc.dismissNavMenus();

            var $dropdown = $(".tab-action-dropdown");
            $(".tab-action-dropdown").attr("data-delay", "1");
            $dropdown.fadeToggle("fast"); 
        });
    }
    , setMenuLostFocusEvent : function() {
        
        $(document).on("click", function(){
            
            // 隐藏Tab栏菜单
            misc.dismissTabMenu();

            // 隐藏Nav栏菜单
            misc.dismissNavMenus();
        });
    }
    , setSidebarMenuEvent : function() {

        // 读取权限, 并创建菜单 (刷新页面会重新拉取菜单数据, 拉取失败会使用上一级缓存)
        var params = { roleId: "" };
        if (roleId && roleId.length > 0) {
            params.roleId = roleId[0]; // 暂时未实现多角色权限的功能
        }
        reqAjaxAsync(SERVICE.MENU_TREE, JSON.stringify(params))
            .done(function (res) {
                if (res.code == 1) {

                    // 缓存到session
                    let groupedMenu = misc.rootMenu(res.data);

                    // 创建导航按钮
                    let temp = [];
                    $.each(groupedMenu, function (index, element) {
                        let button = {
                            active: false,
                            name: element.name,
                            id: element.id,
                            pid: null,
                            icon: '',
                            children: element.children
                        }

                        temp.push(button);
                    });

                    // 2018-02-07 mzc 据说根节点只有一个时, 拿子节点当根节点
                    if (temp.length == 1 && temp[0].children && temp[0].children.length > 0) {
                        temp = temp[0].children;
                    }

                    admin.$data.navBtns = temp;
                    yyCache.set("treeMenu", JSON.stringify(temp));


                    misc.menuListInit(groupedMenu);
                }
                else {
                    var menuStr = yyCache.get("treeMenu");
                    var treeMenu = null;
                    if (menuStr) {
                        treeMenu = JSON.parse(menuStr);
                        admin.$data.navBtns = treeMenu;
                    }
                    misc.menuList = JSON.parse(yyCache.get("one-demensional-menu"));
                }
            });
    }
    , setSidebarEvent : function() {
        // 侧栏自动隐藏事件
        $(".side-menu-bar, .menu-nav").mouseenter(function () {
            $(".side-menu-bar").attr("data-delay", "1");
        });
        $(".side-menu-bar").mouseleave(function () {
            $(".side-menu-bar").attr("data-delay", "0");
            setTimeout(() => {
                var delay = $(".side-menu-bar").attr("data-delay");
                if (delay == "0" && !$("div.input").hasClass("focus")) {
                    var currentDict = admin.current();

                    misc.toggleNavBtn(currentDict.key);
                    treeCtrl.hide(true);
                }
            }, 400);
        });

        
        // 给菜单侧栏添加滚动条
        //$(".side-menu").height($("body").height() - 50);
        $(".do-nicescroll4").niceScroll(".wrap", { cursorcolor: "#ddd", autohidemode: false });
        $(".do-nicescroll4").height($(".do-nicescroll4").height() + 30);
    }
    , clickIframeEvent : function() {
        // 在forms更新后, 添加iframe事件
        admin.$watch('forms', function (newVal, oldVal) {
            $('iframe').iframeTracker(false);
                $('iframe').iframeTracker({
                    blurCallback: function(event) {
                        // 隐藏Tab栏菜单
                        misc.dismissTabMenu();

                        // 隐藏Nav栏菜单
                        misc.dismissNavMenus();
                    }
                });

        }, { deep: true });
    }
    /**
     * 创建快捷搜索的菜单一维数组  
     */
    , menuList: []
    , menuFilter: function (res) {
        if (res && res.children) {
            var index = res.children.length - 1;
            while (index >= 0) {
                let next = res.children[index];
                this.menuFilter(next);

                index--;
            }
        }
        else {
            if (this.menuList.indexOf(res) < 0) {

                //Object.assign({}, object1);

                this.menuList.push(res);
            }
        }
    }
    , menuListInit: function (groupedMenu) {
        // 记录所有末级菜单, 存在menuList
        this.menuFilter({ children: groupedMenu });

        // 缓存备用
        yyCache.set("one-demensional-menu", JSON.stringify(this.menuList));

    }
    , init: function () {

        // 为admin对象设置委托
        this.setVueDelegate(); 

        // 点击iframe事件
        this.clickIframeEvent();

        // tab栏鼠标滚轮事件
        this.setTabWheellEvent();

        // 菜单搜索结果滚动条
        $(".menu-filter-box").niceScroll({ cursorcolor: "#ddd" }); 

        // 设置Tab栏菜单事件
        this.setTabMenuEvent();
        this.setTabMenuItemEvent();

        // 设置顶部导航栏按钮下拉菜单事件
        this.setNavMenuEvent();

        // 设置个人菜单事件
        this.setPersonalMenuEvent();

        admin.$data.userInfo.nickName = yyCache.get("pcNickname");
        admin.$data.userInfo.roleName = yyCache.get("roleName");
        admin.$data.userInfo.avator = yyCache.get("userImg");


        // 初始化菜单搜索框
        var menuFilter = new menuFilterBox();

        this.setSidebarMenuEvent();

            // reqAjaxAsync(SERVICE.TICKET_ASSIGNED, JSON.stringify({
            //     "sort":"priority",
            //     "order":"desc",
            //     "page":1,
            //     "rows":999,
            //     "handlerId2":yyCache.get("userId"),
            //     "copyId2":yyCache.get("userId"),
            //     "status":"7",
            //     "handlerId":yyCache.get("userId")
            // })).done(function (res) {
            //     if (res.code == 1) {
            //         admin.$data.todoTickets = res.data;
            //     }
            // });


        // 2. 增加三个固定选项卡 
        this.setTab(); 



        // 点击其他地方菜单隐藏
        this.setMenuLostFocusEvent();

        // 侧边菜单栏, 失焦自动隐藏
        this.setSidebarEvent();

    }
}


misc.init();

