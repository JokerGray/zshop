(function($){
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
    var REQUEST_URL = {
        'list':'shop/getShopProjectList',//列表
        'delete':'shop/delProject'//删除
    };

    var projectType = 0, pageNo = 1, pageSize = 10;
    var p1 = getUrlParams('type');
    var backUserId = sessionStorage.getItem("backUserId") ,
        userId = sessionStorage.getItem("userId");
    var oRole = sessionStorage.getItem("roleInfo");
    if (p1 && p1 != "") {
        projectType = parseInt(p1);
        $(".main-title .title").text(types[projectType]);
        $("#slogen .slogen-icon").addClass("type" + projectType);
        $("#slogen .slogen-desc").text(captions[projectType]);
    }

    function checkPermission(){
        var permissionsList = JSON.parse(oRole).scSysPermissions;
        console.log(permissionsList);
        for(var i=0; i<permissionsList.length; i++){
            //发布方案
            if(permissionsList[i].percode == "pad_publish_plan"){
                $("#btnAdd").removeClass("hide");
                break;
            }
        }
    }

    //列表渲染
    function showList(res){
        if(res.code == 1){
            var sHtml = '', obj = res.data;
            if(obj.length > 0){
                for(var i=0; i<obj.length; i++){
                    sHtml += '<tr id="'+obj[i].id+'">'
                        + '<td>'+obj[i].title+'</td>'
                        + '<td>'+(obj[i].author == "" ? "--" : obj[i].author)+'</td>'
                        + '<td><i class="fav-icon"></i>'+obj[i].favCount+'</td>'
                        + '<td><i class="view-icon"></i>'+obj[i].viewCount+'</td>'
                        + '<td>'+obj[i].createTime+'</td>';
                    if(userId == obj[i].userid){
                        sHtml += '<td><a class="del-btn" href="javascript:;">删除</a></td>';
                    }else{
                        sHtml += '<td>--</td>';
                    }
                    sHtml += '</tr>';
                }
            }else{
                sHtml += '<tr class="empty"><td colspan="6">暂无数据</td></tr>';
            }
            $("#listTable tbody").html(sHtml);
        }else{
            layer.msg(res.msg);
        }
    }

    //删除
    $("#listTable tbody").delegate("tr .del-btn", "click", function(event){
        event.stopPropagation();
        var id = $(this).parents("tr").attr("id");
        var param = {'id': id};
        layer.confirm('确定要删除这条数据吗？', {
            btn: ['确定','取消'] //按钮
        }, function(){
            reqAjaxAsync(REQUEST_URL['delete'], JSON.stringify(param)).done(function(res){
                if(res.code == 1){
                    layer.msg("删除成功！");
                    getProjectList();
                }else{
                    layer.msg(res.msg);
                }
            });

        });
    }).delegate("tr", "click", function(event){
        var id = $(this).attr("id");
        if(!$(this).hasClass("empty")){
            location.href = "info.html?id=" + id + "&user=" + userId+"&type="+p1;
        }

    });

    //加载列表数据
    function getProjectList() {
        var param = {
            "projectType":projectType,
            "userId":sessionStorage.getItem("userId"),
            "merchantId":sessionStorage.getItem("merchantId"),
            "queryText":"",
            "pageNo":pageNo,
            "pageSize":pageSize
        };

        reqAjaxAsync(REQUEST_URL['list'], JSON.stringify(param)).done(function(resData){
            showList(resData);
            pagingInit('#listPage',resData.total,pageSize,function (page) {
                param['pageNo'] = page;
                reqAjaxAsync(REQUEST_URL['list'], JSON.stringify(param)).done(function(resData){
                    showList(resData);
                });
            })
            // if (resData.total > 0) {
            //     $("#listPage").bootpag({
            //         total: Math.ceil(resData.total / pageSize),
            //         page: 1,
            //         leaps: false,
            //         maxVisible: 10
            //     }).on('page', function (event, num) {
            //         param['pageNo'] = num;
            //         reqAjaxAsync(REQUEST_URL['list'], JSON.stringify(param)).done(function(resData){
            //             showList(resData);
            //         });
            //
            //     }).removeClass("invisible");
            // } else {
            //     $('#listPage').addClass("invisible");
            // }
        });

    }

    $(".return-icon").click(function(){
        if (parseInt(projectType) > 5){
            location.href = "tree.html";
        }else{
            location.href = "fsj.html?type=" + p1 + "&user=" + userId;
        }
    });

    $(function(){
        checkPermission();
        getProjectList();
    });

    // 绑定'发布'按钮事件
    $("#btnAdd").click(function() {
        location.href = "new.html?type=" + p1 + "&user=" + userId;
    });

})(jQuery);
