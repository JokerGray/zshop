var types = ['活动引客', '爆点留客', '追销锁客', '粉丝升客', '团队拓客', '观鱼览客', '人', '事', '客', '项', '钱'];
var captions = ['通过线上、线下大量活动、卡券、优惠吸引拓客。',
    '设定 “爆点”让体验顾客不得不留在店面，以便追销锁客。',
    '设定长期的、连续的追销系统让顾客连续消费，创造收益，让其成为长期稳定顾客。',
    '因应消费者权益向粉丝权益的消费升级改变，设定本商品及服务的粉丝权益，从而服务升级——供给侧改革，顾客变粉丝...',
    '建立粉团队，组织化发展，娱乐性实现 。体验参与、搭建平台、社会推动——变成员工、顾客、社会的共享性平台...',
    '客户定位——你的顾客在哪？',
    '颠覆“招人难、用人难、留人难”，人员自动自发，打造“最强团队”',
    '颠覆“老板就是事妈”，流程管事，打造“自动流转店务机器”',
    '颠覆“差客、客差、客同店固有的敌对矛盾”，六脉粉神剑、退而搭平台，打造“线下粉团队、线上粉闭环”',
    '颠覆“店面为产品打工、为项目牺牲”，项目=爱好=追求，打造“顾客项目培训体系”',
    '颠覆“亏损、负债经营”，消费者权益上升为粉丝权益服务，打造“粉团队”，企业“变银行”'
];

var projectType = -1;
/*
$.urlParam = function (name) {
	var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
	if (typeof results === "undefined" || results == null)
		return null;
	else
		return results[1] || 0;
}*/

var p1 = getUrlParams('type');
var userId = getUrlParams('user');
if (p1 && p1 != "") {
    projectType = parseInt(p1);
    $(".main-title .rightTitle").text(types[projectType]);
    $("#slogen .slogen-icon").addClass("type" + projectType);
    $("#slogen .slogen-desc").text(captions[projectType]);

}

/**
 * 刷新表单
 */
function refreshTable() {
    $('#listTable').bootstrapTable('refresh');
}

var TableInit = function() {
    var oTableInit = new Object();
    // 初始化Table
    oTableInit.Init = function() {
        $('#listTable').empty();

        $('#listTable').bootstrapTable({
            url: '/zxcity_restful/ws/rest', // 请求后台的URL（*）
            method: 'POST', // 请求方式（*）
            toolbar: '#toolbar', // 工具按钮用哪个容器
            striped: false, // 是否显示行间隔色
            cache: false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            pagination: true, // 是否显示分页（*）
            sortable: false, // 是否启用排序
            //sortName : "accountId", // 排序的字段
            //sortOrder : "desc", // 排序方式
            contentType: "application/x-www-form-urlencoded", // 解决POST，后台取不到参数
            queryParams: oTableInit.queryParams, // 传递参数（*）
            sidePagination: "server", // 分页方式：client客户端分页，server服务端分页（*）
            pageNumber: 1, // 初始化加载第一页，默认第一页
            pageSize: 10, // 每页的记录行数（*）
            // pageList: [10, 25, 50, 100], //可供选择的每页的行数（*）
            strictSearch: true,
            clickToSelect: true, // 是否启用点击选中行
            // height: 460, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
            uniqueId: "id", // 每一行的唯一标识，一般为主键列
            cardView: false, // 是否显示详细视图
            detailView: false, // 是否显示父子表
            singleSelect: true, // 是否只能选中一个
            columns: [{
                field: 'title',
                title: '标题',
            }, {
                field: 'author',
                title: '作者',
            }, {
                field: 'favCount',
                title: '点赞',
                formatter: function(value) {
                    return '<i class="like-icon"></i> ' + (parseInt(value) || 0);
                }
            }, {
                field: 'viewCount',
                title: '浏览',
                formatter: function(value) {
                    return '<i class="view-icon"></i> ' + (parseInt(value) || 0);
                }
            }, {
                field: 'createTime',
                title: '发布时间',
            }],
            onClickRow: function(row, $tr) {
                if (row && row.id)
                    location.href = "info.html?id=" + row.id + "&user=" + userId;
            }
        });
    };


    // 定义查询的参数
    oTableInit.queryParams = function(params) {
        var cmd = "shop/getShopProjectList"; // 请求经过/zxcity_restful/ws/rest转到ws/shop/getShopProjectList

        var pageNo = params.pageNumber;
        var pageSize = params.pageSize;

        var jsonData = "{'projectType': " + projectType + ", 'pageNo': " + pageNo + ", 'pageSize': " + pageSize + "}";
        var version = "1";
        return {
            sort: params.sort,
            order: params.order,
            page: params.offset / params.limit + 1,
            rows: params.limit,
            cmd: cmd,
            data: jsonData,
            version: version
        }
        return params;
    };

    return oTableInit;
};


function goBack() {
    if (parseInt(projectType) > 5)
        location.href = "tree.html";
    else
        location.href = "fsj.html?type=" + projectType + "&user=" + userId;
}


$(function() {

    // 初始化表格及数据
    var oTable = new TableInit();
    oTable.Init();

    /*$(".round-icon").text(types[projectType].substr(0,1) );
    $(".round-icon").css("background-color", iconBgColors[projectType]);*/


    // 绑定'发布'按钮事件
    $("#btnAdd").click(function() {
        location.href = "new.html?type=" + projectType + "&user=" + userId;
    });

});