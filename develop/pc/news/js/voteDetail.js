var layer = layui.layer,
    laytpl = layui.laytpl;
var imgsArr = [];
var searchData = {};

$(function() {
    var userId = localStorage.getItem("userId");
    var articleId = GetQueryString("articleId");
    var endTime = '';
    $("#navChildA").html("投票");
    var toutiao = function() {
        this.attentionUserId = 0;
        this.url = {
            channel: "cms_back/selectAllChannel",
            voteDetail: "cms_new/queryVoteDetail",       //投票详情
            addVote: "cms_new/secretBallot",      //新增投票
            searchUrl: "cms_new/selectVoteDetail",    //搜索选项
            iscollection: 'cms_new/isArticleCollection',
            collection: 'cms_new/ArticleCollection',
        }
        this.videoData = { //收藏
            userId: userId,
            articleId: GetQueryString("articleId") || ""
        }
    };
    toutiao.prototype = {
        getVoteDetail: function(d) {
            var _this = this;
            reqAjaxAsync(this.url.voteDetail, d).done(function(res) {
                if (res.code != 1) {
                    layer.msg(res.msg);
                    return false;
                } else {
                    var data = res.data;
                    if (isNull(data)) {
                        layer.msg('暂无数据');
                        return false;
                    }
                    $(".writerimg span").html(res.data.scCmsArticleCommentCount||"0");
                    // 判断是自己得文章 筑城就不显示
                    res.data.releaseId==userId ? $("#FollowAuthor").hide():$("#FollowAuthor").show();
                    searchData = {
                        scCmsVoteEndTime: data.scCmsVoteEndTime,
                        scCmsVoteType: data.scCmsVoteType,
                        scCmsVoteAllNumber: data.scCmsVoteAllNumber,
                        scCmsVoteMethod: data.scCmsVoteMethod
                    }
                    $.each(data.scCmsVoteList, function(i, e) {
                        if(e.isVotePeopleToDay == 1) {
                            searchData.isVotePeopleToDay = 1;
                        }
                    })
                    var obj = {
                        author: data.scSysUser.username,
                        time: data.scSysUser.releaseTime,
                        articleTitle: isNull(data.articleTitle) ? '' : '<p>'+data.articleTitle+'</p>' + '<span>'+ voteOption(data.scCmsVoteOption) +'</span>',
                        videoTagList: label(data.label),
                        articleContent: data.articleContent,
                        voteStartTime: isNull(data.scCmsVoteStartTime) ? '' : data.scCmsVoteStartTime.replace('.0', ''),
                        voteEndTime: isNull(data.scCmsVoteEndTime) ? '' : data.scCmsVoteEndTime.replace('.0', ''),
                        voteType: voteTypeFunc(data.scCmsVoteMethod)
                    }
                    for(var key in obj) {
                        $('.' + key).html(obj[key]);
                    }
                    $('.articleAvatar').attr('src', data.scSysUser.userpic);
                    $('.userInfoImgIcon').attr('href', 'myArticle.html?userId=' + res.data.releaseId);
                    if (res.data.scSysUser.hasConcern == 0) {
                        $('#FollowAuthor').removeClass('active');
                    } else if (res.data.scSysUser.hasConcern == 1) {
                        $('#FollowAuthor').addClass('active');
                    }
                    $('#FollowAuthor').attr('hasConcern', res.data.scSysUser.hasConcern || '0');
                    $('#FollowAuthor').attr('personId', res.data.releaseId || '0');
                    _this.attentionUserId = data.releaseId;
                    var getTpl = $("#voteTpl").html();
                    $('#searchVoteBtn').attr('voteType', data.scCmsVoteType);
                    // 1文字 0图文
                    if(data.scCmsVoteType==1){
                        $('#searchVote').attr("placeholder","输入名称");
                    }else{
                        $('#searchVote').attr("placeholder","输入名称或编号");
                    }
                    laytpl(getTpl).render(data, function (html) {
                        $('#voteListBox').html(html);
                    });
                    if($('#multiVoteUlBox').length == 1) {
                        var multiStr = '<li class="swiper-slide">';
                        $.each(data.scCmsVoteList, function(i, e) {
                            imgsArr.push({isVote: e.isVotePeeple, voteId: e.scCmsVoteId, num: e.scCmsVoteNumber, imgUrl: e.scCmsVoteUrl, title: e.scCmsVoteTitle, descri: e.scCmsVoteDescribe});
                            if(i % 6 == 0 && i != 0) {
                                multiStr += '</li><li class="swiper-slide">';
                            }
                            multiStr += '<div>'
                            +'<img class="multiImgsBtn" src="'+ e.scCmsVoteUrl +'" alt="" >'
                            +'<p class="clearfix">'
                            +'<span class="voteLNum fl">编号'+ e.scCmsVoteNumber +'</span>'
                            +'<span class="voteTicketIcon fr">'+ e.scCmsVotePeepleNumber +'票</span>'
                            +'</p>'
                            +'<p>'+ e.scCmsVoteTitle +'</p>';
                            if(res.data.scCmsIsOverdue==2){
                                multiStr += '<button class="voteLBtn" disabled="disableds" style="border: 2px solid #ccc;color: #ccc;margin-left: 40px;">投票未开始</button>'
                            }else if(e.isVotePeopleToDay == 0) {
                                multiStr += '<button class="voteLBtn" voteId="'+ e.scCmsVoteId +'" articleId = "'+ data.articleId +'">投票</button>'
                            } else if(e.isVotePeopleToDay == 1) {
                                multiStr += '<button class="voteLBtn active" voteId="'+ e.scCmsVoteNumber +'" articleId = "'+ data.articleId +'">已投票</button>'
                            }
                            multiStr += '</div>'
                        })
                        multiStr += '</li>';
                        var sliders = $(multiStr);
                        $('#multiVoteUlBox').html(multiStr);
                        voteListSwiper();
                    }
                     // 判断scCmsIsOverdue==2 投票未开始，不能点击搜索,点击图片的时候没有弹出层
                     if(res.data.scCmsIsOverdue==2){
                         $('#searchVoteBtn').attr('voteClick', 0);
                         $("#multiVoteUlBox .multiImgsBtn").attr({'voteClick': 0,"data-toggle":"","data-target":""});
                     }else{
                         $('#searchVoteBtn').attr('voteClick', 1);
                         $("#multiVoteUlBox .multiImgsBtn").attr({'voteClick': 1,"data-toggle":"modal","data-target":"#votePlayerInfo"});
                     }
                }
            });
        },
        addVoteFunc: function(d, callback) {
            reqAjaxAsync(this.url.addVote, d).done(function(res) {
                if(res.code != 1) {
                    layer.msg(res.msg);
                    return false;
                } else {
                    if(res.msg == "你今天已经投过票，请不要重复投票" || res.msg == "你已经投过票，请不要重复投票") {
                        layer.msg(res.msg);
                    } else {
                        callback();
                    }
                }
            });
        },
        searchFunc: function(d) {
            reqAjaxAsync(this.url.searchUrl, d).done(function(res) {
                if(res.code != 1) {
                    layer.msg(res.msg);
                    return false;
                } else {
                    if(isNull(res.data)){
                        layer.msg("暂无查询数据"); 
                    }
                    searchData.scCmsVoteList = res.data
                    var getTpl = $("#voteTpl").html();
                    laytpl(getTpl).render(searchData, function (html) {
                        $('#voteListBox').html(html);
                    });
                    if($('#multiVoteUlBox').length == 1) {
                        var multiStr = '<li class="swiper-slide">';
                        imgsArr = [];
                        $.each(searchData.scCmsVoteList, function(i, e) {
                            imgsArr.push({isVote: e.isVotePeeple, voteId: e.scCmsVoteId, num: e.scCmsVoteNumber, imgUrl: e.scCmsVoteUrl, title: e.scCmsVoteTitle, descri: e.scCmsVoteDescribe});
                            if(i % 6 == 0 && i != 0) {
                                multiStr += '</li><li class="swiper-slide">';
                            }
                            multiStr += '<div>'
                            +'<img class="multiImgsBtn" src="'+ e.scCmsVoteUrl +'" alt="" data-toggle="modal" data-target="#votePlayerInfo">'
                            +'<p class="clearfix">'
                            +'<span class="voteLNum fl">编号'+ e.scCmsVoteNumber +'</span>'
                            +'<span class="voteTicketIcon fr">'+ e.scCmsVotePeepleNumber +'票</span>'
                            +'</p>'
                            +'<p>'+ e.scCmsVoteTitle +'</p>';
                            if(e.isVotePeopleToDay == 0) {
                                multiStr += '<button class="voteLBtn" voteId="'+ e.scCmsVoteId +'" articleId = "'+ articleId +'">投票</button>'
                            } else if(e.isVotePeopleToDay == 1) {
                                multiStr += '<button class="voteLBtn active" voteId="'+ e.scCmsVoteNumber +'" articleId = "'+ articleId +'">已投票</button>'
                            }
                            multiStr += '</div>'
                        })
                        multiStr += '</li>';
                        var sliders = $(multiStr);
                        $('#multiVoteUlBox').html(multiStr);
                        voteListSwiper();
                    }
                }
            });
        },
        iscollection:function(d){
            var _this = this;
            if(!isNull(userId)&&userId!=1){
                reqAjaxAsync(_this.url.iscollection, d).done(function(res) {
                    if (res.code != 1) return layer.msg(res.msg);
                    if (res.code == 1) {
                        if(res.data==0){
                            $(".collect .sc").attr("isEnshrined","0");
                            $(".collect .sc img").attr("src","../img/sc.png");
                        }else{
                            $(".collect .sc img").attr("src","../img/sca.png");
                            $(".collect .sc").attr("isEnshrined","1");
                        }
                    }
                })
            }
        }
    };

    var homepage = new toutiao();
    // 启动导航
    getChannel({
        url: homepage.url.channel,
        num: 0,
        dom: $("#navUl")
    });
    homepage.getVoteDetail({
        userId: userId,
        articleId: articleId
    });  
    $('#voteListBox').on('click', '.radio', function() {
        $(this).addClass('checked').parent().siblings().find('.radio').removeClass('checked');
    })
    // 判断是否收藏
    homepage.iscollection(homepage.videoData);
    //点击收藏按钮
    $('.collect').on('click', '.sc', function(){
        if (isNull(userId) ||userId == 1) {
            $('.userOperate span:first-child').click();
            layer.msg('请先登录');
        } else {
            reqAjaxAsync(homepage.url.collection, homepage.videoData).done(function(res) {
                if (res.code != 1) return layer.msg(res.msg);
                if (res.code == 1) {
                    if(res.data.isEnshrined==0){
                        $(".collect .sc").attr("isEnshrined","0");
                        $(".collect .sc img").attr("src","../img/sc.png");
                    }else{
                        $(".collect .sc img").attr("src","../img/sca.png");
                        $(".collect .sc").attr("isEnshrined","1");
                    }
                }
            })
        }
        
    })
    //点击投票详情看选手照片
    $('#voteListBox').on('click', '.multiImgsBtn', function() {
        var thisVote=$(this).attr("voteclick");
        if(thisVote=="1"){
            var imgsStr = '';
            $.each(imgsArr, function(i, e) {
                imgsStr += '<img class="swiper-slide" src="'+ e.imgUrl +'" alt="">';
            })
            $('#voteBigImgBox').html(imgsStr);
            $('#voteSmallImgBox').html(imgsStr);
            $('#votePCNum').html(imgsArr[0].num);
            $('#votePCName').html(imgsArr[0].title);
            $('#votePCDescri').html(imgsArr[0].descri);
            $('#vpBtnBox').attr('voteId', imgsArr[0].voteId);
            console.log(imgsArr);
            imgsArr[0].isVote == 1 ? $('#vpBtnBox').html('已投票').addClass('active') : $('#vpBtnBox').html('投票').removeClass('active');
            votePlayerSwiper();
        }
    })
    //多图点击投票
    $('#voteListBox').on('click', '.voteLBtn', function() {
        var _this = this;
        if($(this).hasClass('active')) {
            layer.msg('已经投过票了!');
        } else {
            var voteId = $(this).attr('voteId');
            var articleId = $(this).attr('articleId');
            var data = {
                scCmsVoteUserId: userId,
                scCmsVoteId: voteId,
                scCmsVoteArticleId: articleId
            }
            homepage.addVoteFunc(data, function() {
                $(_this).html('已投票').addClass('active');
            });

            homepage.getVoteDetail({userId: userId,articleId: articleId});
        }
    })
    //单图点击投票
    $('#voteListBox').on('click', '#singleVBtn button', function() {
        var voteId = $('.singleVote .radio.checked').attr('voteId');
        if(isNull(voteId)) {
            layer.msg('请先选择一个选项');
        } else {
            var data = {
                scCmsVoteUserId: userId,
                scCmsVoteId: voteId,
                scCmsVoteArticleId: articleId
            }
            homepage.addVoteFunc(data, function() {
                console.log('投票成功');
                homepage.getVoteDetail({
                    userId: userId,
                    articleId: articleId
                }); 
            });
        }
    })
    
    //弹窗中的投票
    $('#vpBtnBox').click(function() {
        var _this = this;
        if($(this).hasClass('active')) {
            layer.msg('已经投过票了!');
        } else {
            var voteId = $(this).attr('voteId');
            var data = {
                scCmsVoteUserId: userId,
                scCmsVoteId: voteId,
                scCmsVoteArticleId: articleId
            }
            homepage.addVoteFunc(data, function() {
                $(_this).html('已投票').addClass('active');
                homepage.getVoteDetail({
                    userId: userId,
                    articleId: articleId
                }); 
            });
        }
    })

    //搜索选项 voteclick=="1" 说明投票开始可以点击
    $('#searchVoteBtn').click(function() { 
        var thisVote=$(this).attr("voteclick");
        if(thisVote=="1"){
            var searchVal = $('#searchVote').val();
            var voteType = $(this).attr('voteType');
            //0图文  1文字
            if(voteType == 0) {
                var data = {
                    "userId": userId,
                    "scCmsArticleId": articleId,
                    "scCmsVoteNumber": searchVal,
                    "scCmsVoteTitle": searchVal
                }
            } else if(voteType == 1) {
                var data = {
                    "userId": userId,
                    "scCmsArticleId": articleId,
                    "scCmsVoteTitle": searchVal,
                    "scCmsVoteNumber": searchVal
                }
            }
            homepage.searchFunc(data);
        }
    })
    //点击筑城按钮
    $('#FollowAuthor').click(function() {
        if (isNull(userId) || userId == 1) {
            $('.userOperate span:first-child').click();
            layer.msg('请先登录');
        } else {
            var hasConcern = $(this).attr('hasConcern');
            var personId = $(this).attr('personId');
            var data = {
                "appName": "24",
                "busiId": personId,
                "busiType": 0,
                "userId": userId
            }
            if (hasConcern == 0) {
                isFollowState({
                    url: "addCocernRela",
                    data: data
                }, function() {
                    homepage.getVoteDetail({
                        userId: userId,
                        articleId: articleId
                    });
                });
            } else if (hasConcern == 1) {
                isFollowState({
                    url: "delCocernRela",
                    data: data
                }, function() {
                    homepage.getVoteDetail({
                        userId: userId,
                        articleId: articleId
                    });
                });
            }
        }
    });
    //js over
});
//选项详情弹窗
//选手列表    
function voteListSwiper() {
    var mySwiper = new Swiper('.voteListSwiper > div', {
        direction: 'horizontal',
        loop: false,
        pagination: {
            el: '.swiper-pagination'
        },
        navigation: {
            nextEl: '.vlSwiperNextBtn',
            prevEl: '.vlSwiperPrevBtn'
        }
    });
    var totalNum = $('.voteListSwiper li').length, pageNum = 1;
    $('#totalPageNum').html(totalNum);
    $('.vlSwiperNextBtn').click(function() {
        if(pageNum != totalNum) {
            pageNum++;
        }
        $('#votePageNum').html(pageNum);
    })
    $('.vlSwiperPrevBtn').click(function() {
        if(pageNum != 0) {
            pageNum--;
        }
        $('#votePageNum').html(pageNum);
    })
}
//选手详情
function votePlayerSwiper() {
    var galleryTop = new Swiper('.vpSwiperBig', {
        spaceBetween: 10,
        longSwipesRatio: 1,
        touchRatio: 1,
        observer: true,    
        observeParents:true,
        navigation: {
            nextEl: '.vpImgBoxNext',
            prevEl: '.vpImgBoxPrev'
        },
        on: {
            slideChangeTransitionEnd: function(){
                $('#votePCNum').html(imgsArr[this.activeIndex].num);
                $('#votePCName').html(imgsArr[this.activeIndex].title);
                $('#votePCDescri').html(imgsArr[this.activeIndex].descri);
                $('#vpBtnBox').attr('voteId', imgsArr[this.activeIndex].voteId);
                imgsArr[this.activeIndex].isVote == 1 ? $('#vpBtnBox').html('已投票').addClass('active') : $('#vpBtnBox').html('投票').removeClass('active');
            }
        }
    });
    var galleryThumbs = new Swiper('.vpSwiperSmall', {
        spaceBetween: 10,
        centeredSlides: true,
        slidesPerView: 'auto',
        longSwipesRatio: 1,
        touchRatio: 1,
        slideToClickedSlide: true,
        observer: true, 
        observeParents: true,
        on: {
            slideChangeTransitionEnd: function(){
                $('#votePCNum').html(imgsArr[this.activeIndex].num);
                $('#votePCName').html(imgsArr[this.activeIndex].title);
                $('#votePCDescri').html(imgsArr[this.activeIndex].descri);
                $('#vpBtnBox').attr('voteId', imgsArr[this.activeIndex].voteId);
                imgsArr[this.activeIndex].isVote == 1 ? $('#vpBtnBox').html('已投票').addClass('active') : $('#vpBtnBox').html('投票').removeClass('active');
            }
        }
    });
    galleryTop.controller.control = galleryThumbs;
    galleryThumbs.controller.control = galleryTop;
}

//问题详情中的标签
function label(d) {
    var quesLabel = (d).trim(), labelArr = [], quesLabelList = '';
    quesLabel = quesLabel.charAt(quesLabel.length - 1) == ',' ? quesLabel.slice(0, -1) : quesLabel;
    labelArr = quesLabel.split(',');
    if(!isNull(labelArr)) {
        $.each(labelArr, function(i, e) {
            quesLabelList += '<li>'+ e +'</li>';
        })
    }
    return quesLabelList;
}

function voteTypeFunc(d) {
    var str = '';
    if(d == 0) {
        str = '同一个账号仅能投一票';
    } else if(d == 1) {
        str = '同一个账号每天可投一票';
    }
    return str;
}

function voteOption(option) {
    var str = '';
    if(option == 0) {
        str = '【实名】';
    } else if(option == 1) {
        str = '【匿名】';
    }
    return str;
}


