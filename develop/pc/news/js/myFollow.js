var layer = layui.layer, laypage = layui.laypage, laytpl = layui.laytpl;
function followFunc() {
    this.userId = GetQueryString('userId') || '';
    this.rows = 5;
    this.pages = 1;
    this.url = {
        getFollowList: 'cms_new/queryNewAttentionList',
        getFansList: 'cms_new/queryNewFansList',
        addAttention: 'concern/addCocernRela',
        cancelAttention: 'concern/delCocernRela'
    }
    this.followDataZC = {
        userId: this.userId,
        currentUserId: localStorage.getItem('userId') || this.userId,
        pagination: {
            rows: this.rows,
            page: 1
        }
    }
    this.followDataFS = {
        currentUserId: this.userId,
        userId: localStorage.getItem('userId') || this.userId,
        pagination: {
            rows: this.rows,
            page: 1
        }
    }
}

followFunc.prototype = {
    getFollowList: function(url, d, tplHtml){
        var _this = this;
        reqAjaxAsync(url, d).done(function(res){
            if(isNull(localStorage.getItem('userId'))) {$('.myIntroBox button').addClass('hide').removeClass('show')};
            if(res.code != 1) {return layer.msg(res.msg)};
            if(res.code == 1) {
                var data = res.data;
                var total = res.total || '';
                _this.pages = Math.ceil(total / _this.rows);
                _this.pages < 2 ? $('#moreListBtn').addClass('hide').removeClass('show') : $('#moreListBtn').addClass('show').removeClass('hide'); 
                if(!isNull(data)) {
                    var getTpl = $(tplHtml).html();
                    laytpl(getTpl).render(data, function (html) {
                        $('#followConBox').append(html);
                    });
                } else {
                    $('#followConBox').html('<img src="img/zhanwei.png" alt="" style="margin: 100px 0 0 260px;">');
                }
                //未登录时不能关注,用户登录时的显示隐藏在pub.js  getUserInfo()函数控制
                if(isNull(localStorage.getItem('userId'))) {
                    $('.followBtn').addClass('hide').removeClass('show');
                } 
            } 
        })
    }
}
$(function() {
    var loginUserId = localStorage.getItem('userId');
    var follow = new followFunc();
    var typeCode = GetQueryString('typeCode') || '';
    $('#myNav').find('a').removeClass('active');
    if(typeCode == '1001') {
        $('#navAttention a').addClass('active');
        follow.getFollowList(follow.url.getFollowList, follow.followDataZC, '#followList');
    } else if(typeCode == '1002') {
        $('#navFollow a').addClass('active');
        follow.getFollowList(follow.url.getFansList, follow.followDataFS, '#followList');
    }

    // 启动导航
    getChannel({
        url: "cms_back/selectAllChannel",
        num: 0,
        dom: $("#navUl")
    });
    $('#commonNavChild').addClass('hide');   //隐藏公用面包屑
    
    //查询我的信息
    getUserInfo();

    //查询登录用户是否关注了被访问用户
    reqAjaxAsync('cms_new/selectAttention', {userId: loginUserId, currentUserId: follow.userId}).done(function(res){
        if(res.code != 1) {return false};
        if(res.code == 1) {
            if(res.data.isSubscribe == 0) {
                $('#topFollowBtn').html('筑城').removeClass('active').attr('isFollow', 0);
            } else if(res.data.isSubscribe == 1) {
                $('#topFollowBtn').html('取消筑城').addClass('active').attr('isFollow', 1);
            }
        }
    });

    //点击tab栏
    $('#myNav').on('click', 'li', function() {
        $('#myNav').find('a').removeClass('active')
        $(this).find('a').addClass('active');
        var typeCode = $(this).find('a').attr('typeCode');
        if(typeCode == '1001') {
            $('#followConBox').html('');
            follow.followDataZC.pagination.page = 1;
            follow.getFollowList(follow.url.getFollowList, follow.followDataZC, '#followList');
        } else if(typeCode == '1002') {
            $('#followConBox').html('');
            follow.followDataFS.pagination.page = 1;
            follow.getFollowList(follow.url.getFansList, follow.followDataFS, '#followList');
        }
    })

    //点击查看更多
    $('#moreListBtn').click(function() {
        var typeCode = $('#myNav').find('a.active').attr('typeCode');
        if(typeCode == 1001) {
            follow.followDataZC.pagination.page++;
            if(follow.followDataZC.pagination.page > follow.pages) {
                layer.msg('别点了，没有了！');
                return;
            }
            follow.getFollowList(follow.url.getFollowList, follow.followDataZC, '#followList');
        } else if(typeCode == 1002) {
            follow.followDataFS.pagination.page++;
            if(follow.followDataFS.pagination.page > follow.pages) {
                layer.msg('别点了，没有了！');
                return;
            }
            follow.getFollowList(follow.url.getFansList, follow.followDataFS, '#followList');
        }
    })

    //点击最上面的关注按钮
    $('#topFollowBtn').click(function() {
        var _this = this;
        // var data = {userId: loginUserId, attentionUserId: follow.userId};
        var isFollow = $(this).attr('isFollow');
        var busiId = $(this).attr('myid');
        var data ={
            "appName":"24",
            "busiId":busiId,
            "busiType":0,
            "userId":loginUserId
        }
        if(isFollow == 0) {
            reqAjaxAsync(follow.url.addAttention, data).done(function(res){
                layer.msg(res.msg);
                if(res.code != 1) {return false};
                if(res.code == 1) {
                    $(_this).html('筑城').addClass('active').attr('isFollow', 1);
                    getUserInfo();
                }
            });
        } else if(isFollow == 1) {
            reqAjaxAsync(follow.url.cancelAttention, data).done(function(res){
                layer.msg(res.msg);
                if(res.code != 1) {return false};
                if(res.code == 1) {
                    $(_this).html('已筑城').removeClass('active').attr('isFollow', 0);
                    getUserInfo();
                }
            });
           
        }
        var typeCode = $('#myNav a.active').attr('typeCode');
        if(typeCode == 1001) {
            $('#followConBox').html('');
            follow.followDataZC.pagination.page = 1;
            follow.getFollowList(follow.url.getFollowList, follow.followDataZC, '#followList');
        } else if(typeCode == 1002) {
            $('#followConBox').html('');
            follow.followDataFS.pagination.page = 1;
            follow.getFollowList(follow.url.getFansList, follow.followDataFS, '#followList');
        }
    })

    //点击列表关注按钮
    $('#followConBox').on('click', '.followListBtn', function() {
        var isFollow = $(this).attr('isFollow');
        var busiId = $(this).closest(".followUserBox").attr("userid");
        console.log(busiId);
        var data ={
            "appName":"24",
            "busiId":busiId,
            "busiType":0,
            "userId":loginUserId
        }
        if(isFollow == 0) {
            isFollowFunc(follow.url.addAttention, data, this, 1);
        } else if(isFollow == 1) {
            isFollowFunc(follow.url.cancelAttention, data, this, 0);
        }
    })
})
//是否关注的通用函数
function isFollowFunc(url, d, html, isFollow) {
    reqAjaxAsync(url, d).done(function(res){
        if(res.code != 1) {return layer.msg(res.msg)};
        if(res.code == 1) {
            var typeCode = $('#myNav').find('a.active').attr('typeCode');
            if(typeCode == 1001) {
                if(isFollow == 0) {
                    $(html).attr('isFollow', 0);
                    $(html).removeClass('active');
                    $(html).html('筑城');
                } else if(isFollow == 1) {
                    $(html).attr('isFollow', 1);
                    $(html).addClass('active');
                    $(html).html('已筑城');
                }
            } else if(typeCode == 1002) {
                if(isFollow == 0) {
                    $(html).attr('isFollow', 0);
                    $(html).removeClass('active');
                    $(html).html('筑城');
                } else if(isFollow == 1) {
                    $(html).attr('isFollow', 1);
                    $(html).addClass('active');
                    $(html).html('已筑城');
                }
            }
            getUserInfo();
        }
    })
}