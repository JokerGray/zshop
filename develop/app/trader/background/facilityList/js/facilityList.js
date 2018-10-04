var merchantId = getUrlParams('merchantId');
var backUserId = getUrlParams('backUserId');
var apikey = getUrlParams("apikey") || "test";
var shopList = [];
var aCategoryList = []

var REQUIRE_RUL = {
    shopList: 'backUser/getCanManageTheShop',//根据backUserId查询shopList
    categoryList: 'facility/getShopFacilityCategoryList',//查询设备分类列表
    addCategory: 'facility/addShopFacilityCategory',//新增分类
    editCategory: 'facility/updateShopFacilityCategory',//修改分类
    delCategory: 'facility/delShopFacilityCategory',//删除分类
    defaultDuration: 'facility/updateMerchantServiceTime',//设置商铺服务默认时长
    facilityList: 'facility/getShopFacility',//设备列表
    editAdd: 'facility/ajaxSave',//新增或者修改设备
    del: 'facility/ajaxDelete',//删除设备
    getTime: 'facility/setMerchantServiceTime'//查询默认时长
};

//加载店铺数据
function getShopList(){
    var params = {
        'backUserId': parseInt(backUserId)
    };
    reqAjaxAsync(REQUIRE_RUL['shopList'], JSON.stringify(params)).done(function (res) {
        if (res.code == 1) {
            shopList = res.data;
            renderingShopList(res.data, '#selectShop');
            getCategoryList();
            getFacilityList();
        } else {
            layer.msg(res.msg, { icon: 5 });
        }
    });
}

//渲染店铺列表数据
function renderingShopList(shopList, targetDom) {
    var html = '';
    shopList.forEach(function (v, i) {
        html += '<option value="' + v.shopId + '">' + v.shopName + '</option>'
    });
    $(targetDom).html(html).select2()
}

//切换店铺
$("#selectShop").change(function(){
    getCategoryList();
    $('#facilityTable').bootstrapTable("refresh");
});



//获取设备分类列表
function getCategoryList(shopId){
    shopId = shopId || $("#selectShop").val();
    var params = {
        'merchantId': merchantId,
        'shopId': shopId
    };
    reqAjaxAsync(REQUIRE_RUL['categoryList'], JSON.stringify(params)).done(function (res) {
        if (res.code == 1) {
            aCategoryList = res.data;
            categoryListShow(aCategoryList);
        } else {
            layer.msg(res.msg, { icon: 5 });
        }
    });
}

//渲染左侧设备分类列表
function categoryListShow(cList){
    var sHtml = '<li class="list-item active">全部</li>';
    for(var i=0; i<cList.length; i++){
        sHtml += '<li class="list-item" data-id="' + cList[i].id + '" data-name="' + cList[i].categoryName+'">' + cList[i].categoryName +'<i class="c-btn c-del-btn"></i><i class="c-btn c-edit-btn"></i></li>'
    }
    $(".category-list").html(sHtml);
    $('#facilityTable').bootstrapTable("refresh");
    renderCategoryList(aCategoryList, '#selectFacilityCate');
}

//下拉弹框设备分类
function renderCategoryList(cList, ele){
    var str = '';
    for(var i=0; i<cList.length; i++){
        str += '<option value="' + cList[i].id + '">' + cList[i].categoryName + '</option>';
    }
    $(ele).html(str).select2({ minimumResultsForSearch: -1 });
}


//分类菜单操作
$(".category-list").on("click", ".list-item", function(event){
    event.stopPropagation();
    $(this).addClass("active").siblings().removeClass("active");
    $('#facilityTable').bootstrapTable("refresh");

}).on("click", ".list-item .c-edit-btn", function(event){
    event.stopPropagation();
    var item = {
        shopId: $("#selectShop").val(),
        id: $(this).parent().attr("data-id"),
        name: $(this).parent().attr("data-name")
    };
    editFacilityCategory(item);
}).on("click", ".list-item .c-del-btn", function(event){
    event.stopPropagation();
    var id = $(this).parent().attr("data-id");
    delFacilityCategory(id);
});

//获取设备列表
function getFacilityList(){
    //1.初始化Table
    var oTable = new TableInit();
    oTable.Init();
}

var TableInit = function () {
    var oTableInit = new Object();
    //初始化Table
    oTableInit.Init = function () {
        $('#facilityTable').bootstrapTable({
            url: '/zxcity_restful/ws/rest',         //请求后台的URL（*）
            method: 'POST',                      //请求方式（*）
            striped: true,                      //是否显示行间隔色
            cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            pagination: true,                   //是否显示分页（*）
            sortable: false,                     //是否启用排序
            queryParams: oTableInit.queryParams,//传递参数（*）
            sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
            pageNumber: 1,                       //初始化加载第一页，默认第一页
            pageSize: 10,                       //每页的记录行数（*）
            pageList: [10, 25, 50, 100],        //可供选择的每页的行数（*）
            contentType: "application/x-www-form-urlencoded",//解决POST，后台取不到参数
            uniqueId: "id", 
            ajaxOptions: {
                headers: {
                    apikey: apikey
                }
            },
            responseHandler: function (res) {
                //远程数据加载之前,处理程序响应数据格式,对象包含的参数: 我们可以对返回的数据格式进行处理
                //在ajax后我们可以在这里进行一些事件的处理
                if (res.code == 1) {
                    res.rows = res.data;
                    return res;
                } else {
                    layer.alert(res.msg);
                }
            },                    //每一行的唯一标识，一般为主键列
            columns: [{
                field: 'id',
                title: '序号',
                formatter: function(value, row, index){
                    return  index + 1;
                }
            }, {
                field: 'title',
                title: '设备名称'
            }, {
                field: 'categoryName',
                title: '设施分类'
            }, {
                field: 'maxNum',
                title: '最大使用人数'
            }, {
                field: 'shopName',
                title: '店铺名称'
            }, {
                field: 'sequence',
                title: '排序号'
            }, {
                field: 'id',
                title: '操作',
                formatter: function(value, row, index){
                    var sHtml = '<a href="javascript:;" class="editBtn" data-item='+JSON.stringify(row)+'></a>';
                    sHtml += '<a href="javascript:;" class="delBtn" data-id="'+value+'"></a>';
                    return sHtml;
                }
            }]
        });
    };
    

    //得到查询的参数
    oTableInit.queryParams = function (params) {
        var categoryType = $(".category-list").find("li.active").attr("data-id");
        var args = {
            pageNo: params.offset / params.limit + 1,
            pageSize: params.limit,
            merchantId: merchantId,//--商户id **必传**
            shopId: $("#selectShop").val() //--店铺id **必传**
        };
        if (categoryType){
            //--设施分类(可选)
            args['facilityType'] = categoryType;
        }
        var temp = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            page: params.offset / params.limit + 1,
            rows: params.limit,
            cmd: REQUIRE_RUL['facilityList'],
            data: JSON.stringify(args),
            version: 1
        };
        return temp;
    };
    return oTableInit;
};

$(function(){
    getShopList();
});


//新增设备和设置默认工单时长
$('.header').on('click', '.addBtn', function () {
    addEditFacility()
}).on('click', '.controlBtnBox .setTimeBtn', function () {
    setDefaultDuration()
});
// 编辑设备和删除设备
$('#facilityTable').on('click', '.editBtn', function () {
    var item = JSON.parse($(this).attr('data-item') || '{}');
    addEditFacility(item)
}).on('click', '.delBtn', function () {
    delFacility($(this).attr('data-id'));
});

// 增加设备弹窗和编辑设备弹窗
function addEditFacility(item) {
    //渲染分类列表
    if (aCategoryList.length == 0) {
        layer.msg("请增加设备分类~");
        return;
    }
    
    var html = template('addEditTpl', item || {});
    layer.open({
        type: 1,
        title: '',
        closeBtn: 0,
        zIndex: 99,
        shade: 0.5,
        area: ['750px', '550px'],
        btn: ['提交', '取消'],
        skin: 'addEditPage',
        content: html,
        success: function (layero, index) {
            $(layero).on('click', '.closePage', function () {
                layer.close(index)
            });
            //渲染弹窗里的shopList
            renderingShopList(shopList, '#shopSelector');
            $('#shopSelector').select2().val($("#selectShop").val()).change();
            // 初始化设施分类的select2
            renderCategoryList(aCategoryList, '#selectFacilityCate')
            //如果itme存在，说明点击的是编辑按钮，进入编辑设备弹窗页面，
            // 初始化店铺下拉框和设备分类下拉框
            
            if (item) {
                $('#shopSelector').select2().val(item.shopId).change();
                
                if (item.facilityType != -1) {
                    $('#selectFacilityCate').select2({
                        minimumResultsForSearch: -1
                    }).val(item.facilityType).change()
                }
            }
            $('#shopSelector').prop("disabled", true);
        },
        yes: function (index, layero) {
            if ($(layero).find('#shopSelector').val() === '') {
                layer.msg('请选择店铺！', { icon: 2, time: 1000 });
                return;
            } 
            if ($(layero).find('#facilityName').val().trim() === '') {
                layer.msg('请输入设备名称！', { icon: 2, time: 1000 });
                return;
            } 
            if ($(layero).find('#selectFacilityCate').val() === '') {
                layer.msg('请选择设备分类！', { icon: 2, time: 1000 });
                return;
            } 
            if ($(layero).find('#sorting').val().trim() === '') {
                layer.msg('请输入排序号！', { icon: 2, time: 1000 });
                return;
            } 
            if ($(layero).find('#sorting').val().trim() > 999 || $(layero).find('#sorting').val().trim() < 0 || $(layero).find('#sorting').val().trim().indexOf('.') >= 0) {
                layer.msg('排序号必须为0到999的整数！', { icon: 2, time: 1000 });
                return;
            } 
            if ($(layero).find('#maxNum').val().trim() === '') {
                layer.msg('请输入设备最大使用人数！', { icon: 2, time: 1000 });
                return;
            } 
            if ($(layero).find('#maxNum').val().trim() > 999 || $(layero).find('#maxNum').val().trim() < 1 || $(layero).find('#maxNum').val().trim().indexOf('.') >= 0) {
                layer.msg('使用人数必须为1到999的整数！', { icon: 2, time: 1000 });
                return;
            }
            var params = {
                "id": item ? item.id : '',//--修改时**必传**，新增时不传
                "shopId": $(layero).find('#shopSelector').val(),//--店铺编号**必传**
                "merchantId": merchantId,//--商户编号**必传**
                "title": $(layero).find('#facilityName').val().trim(),//--设名称**必传**
                "facilityType": $(layero).find('#selectFacilityCate').val(),//--设备分类**必传**(1-房间;2-床位;3-座位;4-其他;5-设备;)
                "sequence": $(layero).find('#sorting').val().trim(),//--排序 (可选)
                "maxNum": $(layero).find('#maxNum').val().trim(),//--最大使用人数(可选)
            };
            reqAjaxAsync(REQUIRE_RUL['editAdd'], JSON.stringify(params)).done(function (res) {
                if (res.code !== 1) {
                    layer.msg(res.msg, { icon: 5 });
                    return
                } else if (res.code === 1 && item) {
                    layer.msg('修改成功！', { icon: 6, time: 500 }, function () {
                        $("#facilityTable").bootstrapTable("refresh");
                        layer.close(index)
                    });
                } else if (res.code === 1 && !item) {
                    layer.msg('新增成功！', { icon: 6, time: 500 }, function () {
                        $("#facilityTable").bootstrapTable("refresh");
                        layer.close(index)
                    });
                }

            })
        }
    })
}

//设置默认时长弹窗
function setDefaultDuration() {
    getTime().done(function (res) {
        var html = template('setDefaultDuration', res);
        layer.open({
            type: 1,
            area: ['400px', '300px'],
            btn: ['提交', '取消'],
            title: '',
            closeBtn: 0,
            zIndex: 99,
            shade: 0.5,
            skin: 'defaultDurationPage',
            content: html,
            success: function (layero, index) {
                $(layero).on('click', '.closePage', function () {
                    layer.close(index)
                })
            },
            yes: function (index, layero) {
                var serviceTime = $(layero).find('#inputDuration').val().trim();
                if (serviceTime === '') {
                    layer.msg('未输入默认时长！', { icon: 2, time: 800 });
                    return
                }
                if (serviceTime <= 0 || serviceTime > 99999 || serviceTime.indexOf('.') > -1) {
                    layer.msg('请输入大于0小于99999的整数！', { icon: 2, time: 800 });
                    return
                }
                var params = {
                    "serviceTime": serviceTime,
                    "merchantId": merchantId
                };
                reqAjaxAsync(REQUIRE_RUL['defaultDuration'], JSON.stringify(params)).done(function (res) {
                    if (res.code !== 1) {
                        layer.msg(res.msg, { icon: 5 });
                        return
                    }
                    layer.close(index);
                    layer.msg('设置成功！', { icon: 6, time: 800 });
                })
            }
        })
    });

}

//获取商铺默认时长
function getTime() {
    var defer = $.Deferred();
    var params = {
        "merchantId": merchantId
    };
    reqAjaxAsync(REQUIRE_RUL['getTime'], JSON.stringify(params)).done(function (res) {
        if (res.code === 1) {
            defer.resolve(res)
        } else {
            layer.msg(res.msg, { icon: 5 });
        }
    });
    return defer.promise()
}

//发送删除设备的请求
function delFacility(facilityId) {
    layer.confirm('确定要删除吗?', { icon: 3, title: '警告' }, function (index) {
        var params = {
            "id": facilityId
        };
        reqAjaxAsync(REQUIRE_RUL['del'], JSON.stringify(params)).done(function (res) {
            if (res.code == 1) {
                layer.msg('删除成功！', { icon: 6, time: 500 }, function () {
                    $("#facilityTable").bootstrapTable("refresh");
                });
            } else {
                layer.msg(res.msg, { icon: 5 });
            }
        });
    }, null);
}

//新增分类
$("#categoryAddBtn").click(function(){
    editFacilityCategory();
});



function editFacilityCategory(item){
    var html = template('editCategoryTpl', item||{})
    layer.open({
        type: 1,
        title: '',
        closeBtn: 0,
        zIndex: 1,
        shade: 0.5,
        area: ['480px', '320px'],
        btn: ['提交', '取消'],
        skin: 'addEditPage',
        content: html,
        success: function (layero, index) {
            $(layero).on('click', '.closePage', function () {
                layer.close(index)
            });
            //渲染弹窗里的shopList
            renderingShopList(shopList, '#shopSelector2');

            //如果itme存在，说明点击的是编辑按钮，进入编辑设备弹窗页面，
            // 初始化店铺下拉框
            if (item) {
                $('#shopSelector2').select2().val(item.shopId).change().attr("disabled","disabled");
            }
        },
        yes: function (index, layero) {
            var categoryName = $.trim($("#categoryName").val());
            if (categoryName && categoryName == ""){
                layer.msg('请输入分类名称！', { icon: 2, time: 800 });
                return;
            }
            if(item && item.id){
                var params = {
                    "id": item.id,
                    "categoryName": categoryName
                };
                updateCategory(params);
            }else{
                var params = {
                    "shopId": $('#shopSelector2').val(),
                    "merchantId": merchantId,
                    "categoryName": categoryName
                };
                addCategory(params);
            }
            
        }
    });
}
//新增分类
function addCategory(params, layerIndex){
    reqAjaxAsync(REQUIRE_RUL['addCategory'], JSON.stringify(params)).done(function(res){
        if(res.code == 1){
            layer.closeAll();
            layer.msg('添加成功！', { icon: 6, time: 500 }, function () {
                getCategoryList();
                $("#facilityTable").bootstrapTable("refresh");
            });
        }else{
            layer.msg(res.msg, {icon: 5});
        }
    });
}

//修改分类名称
function updateCategory(params) {
    reqAjaxAsync(REQUIRE_RUL['editCategory'], JSON.stringify(params)).done(function (res) {
        if (res.code == 1) {
            layer.closeAll();
            layer.msg('修改成功！', { icon: 6, time: 500 }, function () {
                getCategoryList();
                $("#facilityTable").bootstrapTable("refresh");
            });
        } else {
            layer.msg(res.msg, { icon: 5 });
        }
    });
}

function delFacilityCategory(categoryId){
    
    layer.confirm('确定要删除吗?', { icon: 3, title: '警告' }, function (index) {
        var params = {
            "id": categoryId
        };
        reqAjaxAsync(REQUIRE_RUL['delCategory'], JSON.stringify(params)).done(function (res) {
            if (res.code == 1) {
                layer.msg('删除成功！', { icon: 6, time: 500 }, function () {
                    $(".category-list").find("li[data-id=" + categoryId+"]").remove();
                    getCategoryList();
                    $("#facilityTable").bootstrapTable("refresh");
                });
            } else {
                layer.msg(res.msg, { icon: 5 });
            }
        });
    }, null);
}


