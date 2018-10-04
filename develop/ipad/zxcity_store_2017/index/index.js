//backUser/listMerShops
var REUQIRE_URL = {
    "userInfo": 'backUser/userInfo',
    "shopList": 'backUser/listMerShops',
    "isFiveStatus": 'shopKitchen/getFiveScreensStatus'//是否开启五屏
}
var params = getParams();
$(function () {

    // if (typeof (params["backUserID"]) != "undefined" && sessionStorage.getItem("backUserId") != params["backUserID"]) {
    //     sessionStorage.clear();
    //     sessionStorage.setItem("apikey", params["apikey"]);
    //     sessionStorage.setItem("backUserId", params["backUserID"]);
    //     sessionStorage.setItem("shopId", params["shopID"]);
    //     sessionStorage.setItem("shopName", getUrlParams("shopName"));
    //     sessionStorage.setItem("merchantId", params["merchantId"]);
    //     $.ajax({
    //         type: "POST",
    //         url: "/zxcity_restful/ws/rest",
    //         dateType: "json",
    //         data: {
    //             "cmd": "backUser/userInfo",
    //             "data": "{'id': " + sessionStorage.getItem("backUserId") + "}",
    //             "version": "1"
    //         },
    //         beforeSend: function (request) {
    //             request.setRequestHeader("apikey", sessionStorage.getItem("apikey"));
    //         },
    //         success: function (res) {
    //             if (res.code == 1 && res.data != null) {
    //                 //isRegionalAgent 区域代理 0-否 1-是
    //                 //regionalLevel 代理级别 1-连锁总部  2-片区
    //                 var oUser = res.data.backUser,
    //                     roleList = res.data.roleList,
    //                     shopList = res.data.shopList;
    //                 // sessionStorage.setItem("merchantId", oUser.merchantId);
    //                 sessionStorage.setItem("username", oUser.username);
    //                 sessionStorage.setItem("usercode", oUser.usercode);
    //                 sessionStorage.setItem("userId", oUser.userId);
    //
    //                 if (oUser.isRegionalAgent == 1 && !sessionStorage.getItem('isRegionalAgent')) {
    //                     sessionStorage.setItem("isRegionalAgent", oUser.isRegionalAgent);
    //                     sessionStorage.setItem("regionalLevel", oUser.regionalLevel);
    //                     if (oUser.regionalLevel == 1) {
    //                         window.location.href = "./chain/chainAll.html"
    //                     } else if (oUser.regionalLevel == 2) {
    //                         window.location.href = "chain/chainPartition.html"
    //                     }
    //                 }
    //                 if (shopList.length > 0) {
    //                     var shopArr = [];
    //                     for (var i = 0; i < shopList.length; i++) {
    //                         var temp = {
    //                             'shopId': shopList[i].shopId,
    //                             'shopName': shopList[i].orgName,
    //                             'merchantId': shopList[i].merchantId
    //                         };
    //                         shopArr.push(temp);
    //                         if (params["shopID"] == shopList[i].shopId) {
    //                             sessionStorage.setItem("shopName", shopList[i].orgName);
    //                         }
    //                     }
    //                     sessionStorage.setItem("shopList", JSON.stringify(shopArr));
    //                 }
    //
    //                 if (roleList.length > 0) {
    //                     sessionStorage.setItem("roleInfo", JSON.stringify(roleList[0]));
    //                     sessionStorage.setItem("roleCode", roleList[0].roleCode);
    //                     loadNav(roleList[0].scSysPermissions, roleList[0].roleCode);
    //                 }
    //
    //             } else {
    //                 console.error(res.msg);
    //             }
    //         },
    //         error: function (re) {
    //             var data = JSON.stringify(re);
    //             console.error(re);
    //         }
    //     });
    // } else {
    //     loadNav();
    // }

    init()
});

var navArr = ['pad_my_page', 'pad_store_page', 'pad_view_plan', 'pad_view_reservation', 'pad_consumption', 'pad_workorder', 'pad_room_manager', 'pad_scheduling', 'pad_order_manage', 'pad_customer_manage', 'pad_statistics', 'pad_operation_screen', 'pad_take_screen'];

function loadNav(scSysPermissions, roleCode,scSysOrg) {
    if (!scSysPermissions) {
        scSysPermissions = JSON.parse(sessionStorage.getItem("roleInfo")).scSysPermissions;
    }
    // if(!scSysOrg){
    //     scSysOrg = JSON.parse(sessionStorage.getItem("roleInfo")).scSysOrg;
    // }
    var param = {
        'merchantId': sessionStorage.getItem("merchantId")
    };
    //查询五屏开关，是否开启
    reqAjaxAsync(REUQIRE_URL["isFiveStatus"], JSON.stringify(param)).done(function (res) {
        var isOpened = 0;
        if(res.code == 1){
            if(res.data == 1){
                isOpened = 1;
            }
        }
        var sHtml = template('navTpl', { 'navArr': navArr, 'permissionsList': scSysPermissions, 'isOpened': isOpened });
        $("#mainNav").html(sHtml);
        backToPrevPage(roleCode);
    });
    
}

function changeMenu(page, roleCode) {
    if (page == "null" || page == null) {
        $("#mainNav").find("li:eq(0)").addClass("active").siblings().removeClass("active");
        page = $("#mainNav").find("li.active a").attr("data-page");
    } else {
        $("#mainNav li a[data-page='" + page + "']").parent().addClass("active").siblings().removeClass("active");
    }
    var myhomeUrl = "myHomePage/myHomePage.html";
    //如果是团队主管,显示主管页面
    if (roleCode == "G" || sessionStorage.getItem("roleCode") == "G") {
        myhomeUrl = "myHomePage/teamPage.html";
    }
    var src = "";
    switch (page) {
        case "1":
            src = myhomeUrl;
            break;
        case "2":
            src = "storeHomePage/storeHomePage.html";
            break;
        case "3":
            src = "fsj/html/fsj.html";
            break;
        case "4":
            src = "fsj/html/tree.html";
            break;
        case "5":
            src = "customerReservation/reservationMain.html";
            break;
        case "6":
            src = "consumptionBilling/consumptionBilling.html";
            break;
        case "7":
            src = "workOrderManage/workOrderManage.html";
            break;
        case "8":
            src = "scheduling/scheduling.html";
            break;
        case "9":
            src = "orderManagement/orderManagement.html";
            break;
        case "10":
            src = "customerManagement/customerManagement.html";
            break;
        case "11":
            src = "statisticalReport/statisticalReport.html";
            break;
        case "12"://操作屏
            //parent.location.href="cookscreen/cookscreen.html";
            parent.location.href = "czp/czp.html";
            break;
        case "13"://取单屏
            //parent.location.href="takemealScreen/takeMealScreen.html";
            parent.location.href = "qdp/qdp.html";
            break;
        case "14"://设备管理
            src = "roomManage/roomManage.html";
            break;
        case "15"://视频教程
            src = "http://docs.izxcs.com/";
            break;
        default:
            src = myhomeUrl;
    }

    $("#pageFrame").attr("src", src);
    window.location.hash = "";
}

function backToPrevPage(roleCode) {
    var prevPage = sessionStorage.getItem("prevPage");
    changeMenu(prevPage, roleCode);
}

function init() {
    //进入页面，判断是否首次进入，如果是首次进入，发送请求，获取用户信息
    if (!sessionStorage.getItem('isRegionalAgent')) {
        sessionStorage.clear();
        sessionStorage.setItem("apikey", params["apikey"]);
        sessionStorage.setItem("backUserId", params["backUserID"]);
        var data = {
            id: sessionStorage.getItem("backUserId")
        }
        reqAjaxAsync(REUQIRE_URL["userInfo"], JSON.stringify(data)).done(function (res) {
            if (res.code !== 1 || res.data === null) {
                layer.msg(res.msg);
                return
            }
            //isRegionalAgent 区域代理 0-否 1-是
            //regionalLevel 代理级别 1-连锁总部  2-片区
            //根据用户级别，判断是否是区域代理，如果是，跳转到连锁总部页面
            if (res.data.backUser.isRegionalAgent == 1 && !sessionStorage.getItem('isRegionalAgent')) {
                sessionStorage.setItem("isRegionalAgent", res.data.backUser.isRegionalAgent);
                sessionStorage.setItem("regionalLevel", res.data.backUser.regionalLevel);
                if (res.data.backUser.regionalLevel == 1) {
                    window.location.href = "./chain/chainAll.html"
                } else if (res.data.backUser.regionalLevel == 2) {
                    window.location.href = "chain/chainPartition.html"
                }
            } else {
                //如果不是区域代理，进入pad操作页面，并获取当前登录用户所管理或者所在的所有店铺
                var oUser = res.data.backUser,
                    roleList = res.data.roleList,
                    shopList = res.data.shopList;
                sessionStorage.setItem("shopId", params["shopID"]);
                sessionStorage.setItem("shopName", getUrlParams("shopName"));
                sessionStorage.setItem("merchantId", oUser.merchantId);
                sessionStorage.setItem("username", oUser.username);
                sessionStorage.setItem("usercode", oUser.usercode);
                sessionStorage.setItem("musercode", oUser.scSysUser.usercode);//云信账号
                sessionStorage.setItem("userId", oUser.userId);
                sessionStorage.setItem("isRegionalAgent", oUser.isRegionalAgent);
                sessionStorage.setItem("regionalLevel", oUser.regionalLevel);
                if (roleList.length > 0) {
                    sessionStorage.setItem("roleInfo", JSON.stringify(roleList[0]));
                    sessionStorage.setItem("roleCode", roleList[0].roleCode);
                    loadNav(roleList[0].scSysPermissions, roleList[0].roleCode,roleList[0].scSysOrg);
                }
                if (shopList.length > 0) {
                    var shopArr = [];
                    for (var i = 0; i < shopList.length; i++) {
                        var temp = {
                            'shopId': shopList[i].shopId,
                            'shopName': shopList[i].orgName,
                            'merchantId': shopList[i].merchantId
                        };
                        shopArr.push(temp);
                        if (params["shopID"] == shopList[i].shopId) {
                            sessionStorage.setItem("shopName", shopList[i].orgName);
                        }
                    }
                    sessionStorage.setItem("shopList", JSON.stringify(shopArr));
                }
                // getShopList()
            }
        })
    } else {
        //执行此处代码，说明是从连锁总部跳转过来，并且说明该登录用户是区域代理，或者页面已经在pad操作页面，只是返回操作
        if (typeof (params["backUserID"]) != "undefined" && sessionStorage.getItem('backUserId') != params["backUserID"]) {
            sessionStorage.clear();
            sessionStorage.setItem("apikey", params["apikey"]);
            sessionStorage.setItem("backUserId", params["backUserID"]);
            sessionStorage.setItem("merchantId", params["merchantId"]);
            sessionStorage.setItem("shopId", params["shopID"]);
            sessionStorage.setItem("shopName", getUrlParams("shopName"));
            var data = {
                id: sessionStorage.getItem("backUserId")
            }
            reqAjaxAsync(REUQIRE_URL['userInfo'], JSON.stringify(data)).done(function (res) {
                if (res.code !== 1 && res.data === null) {
                    layer.msg(res.msg);
                    return
                }
                var oUser = res.data.backUser,
                    roleList = res.data.roleList;
                sessionStorage.setItem("username", oUser.username);
                sessionStorage.setItem("usercode", oUser.usercode);
                sessionStorage.setItem("musercode", oUser.scSysUser.usercode);//云信账号
                sessionStorage.setItem("userId", oUser.userId);
                sessionStorage.setItem("isRegionalAgent", oUser.isRegionalAgent);
                sessionStorage.setItem("regionalLevel", oUser.regionalLevel);
                if (roleList.length > 0) {
                    sessionStorage.setItem("roleInfo", JSON.stringify(roleList[0]));
                    sessionStorage.setItem("roleCode", roleList[0].roleCode);
                    loadNav(roleList[0].scSysPermissions, roleList[0].roleCode,roleList[0].scSysOrg);
                }
                // 获取当前商铺下面所有店铺
                if (res.data.backUser.isRegionalAgent == 0) {
                    // 如果不是代理，是单店经理，老板，主管或者一线员工，直接获取自己所在的店铺或者管理的店铺
                    var shopList = res.data.shopList;
                    if (shopList.length > 0) {
                        var shopArr = [];
                        for (var i = 0; i < shopList.length; i++) {
                            var temp = {
                                'shopId': shopList[i].shopId,
                                'shopName': shopList[i].orgName,
                                'merchantId': shopList[i].merchantId
                            };
                            shopArr.push(temp);
                            if (params["shopID"] == shopList[i].shopId) {
                                sessionStorage.setItem("shopName", shopList[i].orgName);
                            }
                        }
                        sessionStorage.setItem("shopList", JSON.stringify(shopArr));
                    }
                } else if (res.data.backUser.isRegionalAgent == 1) {
                    //如果是代理，通过merchantId获取shopList
                    getShopList()
                }
            })
        } else {
            loadNav();
        }
    }
}

//获取商户下的shopList
function getShopList() {
    var data = {
        merchantId: params.merchantId
    }
    reqAjaxAsync(REUQIRE_URL['shopList'], JSON.stringify(data)).done(function (res) {
        if (res.code !== 1) {
            layer.msg(res.msg);
            return
        }
        shopList = res.data;
        if (shopList.length > 0) {
            var shopArr = [];
            for (var i = 0; i < shopList.length; i++) {
                var temp = {
                    'shopId': shopList[i].id,
                    'shopName': shopList[i].shopName,
                    'merchantId': shopList[i].merchantId
                };
                shopArr.push(temp);
                if (params["shopID"] == shopList[i].shopId) {
                    sessionStorage.setItem("shopName", shopList[i].shopName);
                }
            }
            sessionStorage.setItem("shopList", JSON.stringify(shopArr));
        }

    })
}

// 退出pad操作页面，清楚用户登录信息，方便用户再次进入时跳转到连锁总店页面，或者切换用户登录
window.clearSessionStorage = function () {
    sessionStorage.clear()
}

$("#mainNav").delegate("li a", "click", function () {
    var page = $(this).attr("data-page");
    sessionStorage.removeItem("prevPage");
    sessionStorage.removeItem("accountId");
    changeMenu(page);
});

