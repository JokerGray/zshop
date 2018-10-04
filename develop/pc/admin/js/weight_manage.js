$(function(){
    //禁止在input中输入空格：
    inhibitTrim('#authorNameInp');
    inhibitTrim('#start');
    inhibitTrim('#end');
    inhibitTrim('#recentArtInp');
    inhibitTrim('#totalArtInp');
	var action = new $.platform();
	//获取今天的日期：
    var today = format(new Date());

    //点击起止日期input获取间隔时间
    layui.use('laydate', function () {
        var laydate = layui.laydate;
        var startDate = {
            // min: laydate.now(),
            max: today,
            istoday: false,
            choose: function (datas) {
                endDate.min = datas; //开始日选好后，重置结束日的最小日期
                endDate.start = datas //将结束日的初始值设定为开始日
                if (!isNull($("#end").val())) {
                    
                }
            }
        };
        var endDate = {
            // min: laydate.now(),
            max: today,
            istoday: false,
            choose: function (datas) {
                startDate.max = datas; //结束日选好后，重置开始日的最大日期
                startDate.end = datas
                if (!isNull($("#start").val())) {
                	
                }
            }
        };
        $('#start').click(function () {
            startDate.elem = this;
            laydate(startDate);
        });

        $('#end').click(function () {
            endDate.elem = this;
            laydate(endDate);
        });
    });

    //页面进来获取所有作家列表：
    action.getAuthorTable(action.authData, true);

    //点击tab栏切换列表：
    $('.tabinner li').click(function(){
        action.authData.writerRank = $(this).attr('writerRank');
        action.authData.pagination.page = 1;
        action.getAuthorTable(action.authData, true);
    })

    //点击搜索按钮搜索：
    $('#search_icon').click(function(){
        var startTime = $('#start').val(), endTime = $('#end').val();
        if(!isNull(startTime)) {startTime = startTime + ' 00:00:00'}
        if(!isNull(endTime)) { endTime = endTime + ' 23:59:59'}
        action.authData.pagination.page = 1;
        action.authData.subscriptionName = delTrim($('#authorNameInp').val());
        action.authData.writerRank = $('#authorTypeInp').val();
        action.authData.start = startTime;
        action.authData.end = endTime;
        action.authData.article30Count = delTrim($('#recentArtInp').val());
        action.authData.articleCount = delTrim($('#totalArtInp').val());
        $('.tabinner li').each(function(i,e){
            $(this).attr('writerRank') == $('#authorTypeInp').val() ? $(this).addClass('active').siblings().removeClass('active') : false;
        })
        action.getAuthorTable(action.authData, true);
    })

    //导出Excel:
    $('#exportExcel').click(function(){
        console.log(action.authData)
        window.location.href = '/zxcity-cms-new-ms/newms/' + action.Request.getExcel + '?data=' + JSON.stringify(action.authData);
    })

    //点击升级按钮弹出升级弹窗：
    var userId = 0;
    $('#gainsTabBody').on('click', '.gainsTabFreeze', function(){
        var text = $(this).parent().siblings('.writerRank').html();
        userId = $(this).parent().parent().attr('userId');
        $('#authorName').html($(this).parent().siblings('.subscriptName').html());
        $('#oldSubNameType').html(text);
        authUpGrade(text, '#newSubNameType');
    });
    //点击确认升级调用ajax：
    $('#affirmBtn').click(function(){   
        reqNewAjaxAsync(action.Request.upGrade, {userId: userId, writerRank: examAuthType($('#oldSubNameType').html())}).done(function(res){
            if(res.code == 1) {
                action.getAuthorTable(action.authData, true);
            } else {
                layer.msg(res.msg);
            }
        })
    })
    //文章详情弹窗内的升级按钮：
    $('#freezeAcc').click(function(){
        reqNewAjaxAsync(action.Request.upGrade, {userId: $(this).attr('userId'), writerRank: examAuthType($('.authorNameType').html())}).done(function(res){
            if(res.code == 1) {
                action.getAuthorTable(action.authData, true);
            } else {
                layer.msg(res.msg);
            }
        })
    })

    //点击查看查看作家的文章详情：
    $('#gainsTabBody').on('click', '.gainsTabBtn', function(){
        var userId = $(this).parent().parent().attr('userId');
        $('#freezeAcc').attr('userId', userId);
        $('.authorNameCon').html($(this).parent().siblings('.subscriptName').html());
        $('.authorNameType').html($(this).parent().siblings('.writerRank').html());
        $('.authorDateCon').html($(this).parent().siblings('.subscriptName').attr('createTime'));
        action.artData.pagination.page = 1;
        action.artData.userId = userId;
        action.getArtTable(action.artData, true);
        $.trim($('.authorNameType').html()) + "" == '签约作者' ? $('#accModalBtnBox').addClass('hide').removeClass('show') : $('#accModalBtnBox').addClass('show').removeClass('hide');
    })

    //限制input只能输入数字
    ExamInpNum('#recentArtInp');
    ExamInpNum('#totalArtInp');
    ExamInpNum('#setNewbieInp');      
    ExamInpNum('#setCommonInp');
    ExamInpNum('#setOriginalInp');
    ExamInpNum('#setAddVInp');
    ExamInpNum('#setSignedInp');
    ExamInpNum('#newHandNum');
    ExamInpNum('#commonNum');
    ExamInpNum('#OriginalNum');
    ExamInpNum('#addVMun');
    ExamInpNum('#signNum');
    
    //显示限制数量
    var articleArr = [], questionArr = [], voteArr = [], invitationArr = [];
    $('#exportLimit').click(function(){
        $('.voteAddBox').hide();
        $('#setExpNav li[type="article"]').addClass('active').siblings().removeClass('active');
        reqNewAjaxAsync('selectAllSubActicle', {}).done(function(res){
            if(res.code != 1) return layer.msg(res.msg);
            if(res.code == 1 && !isNull(res.data)) {
                var data = res.data;
                $.each(data, function(i, e) {
                    articleArr.push({num: e.publishArticleNumber || '0', rank: e.writerRank || '0'});
                    questionArr.push({num: e.publishQuestionNumber || '0', rank: e.writerRank || '0'});
                    voteArr.push({num: e.publishVoteNumber || '0', rank: e.writerRank || '0'});
                    invitationArr.push({num: e.publishInvitationNumber || '0', rank: e.writerRank || '0'});
                })
                $.each(articleArr, function(i, e) {
                    $('.authorGradeInp[rank="'+ e.rank +'"]').val(e.num);
                });
            }
        });
    })
    //更多设置切换tab栏
    $('#setExpNav li').click(function() {
        var type = $(this).attr('type');
        $(this).addClass('active').siblings().removeClass('active');
        if(type == 'article') {
            $('.voteAddBox').hide();
            $.each(articleArr, function(i, e) {
                $('.authorGradeInp[rank="'+ e.rank +'"]').val(e.num);
            });
        } else if(type == 'ques') {
            $('.voteAddBox').show();
            $.each(questionArr, function(i, e) {
                $('.authorGradeInp[rank="'+ e.rank +'"]').val(e.num);
            });
            $.each(invitationArr, function(i, e) {
                $('.invitationNum[rank="'+ e.rank +'"]').val(e.num);
            });
        } else if(type == 'vote') {
            $('.voteAddBox').hide();
            $.each(voteArr, function(i, e) {
                $('.authorGradeInp[rank="'+ e.rank +'"]').val(e.num);
            });
        }
    })
    //修改发文数量  
    $('#setExpSaveBtn').click(function(){
        var flag = false, type = $('#setExpNav li.active').attr('type'), upData = [];
        $.each($('#setExpCon .authorGradeInp'), function(i, e) {
            if(isNull(e.value)){
                flag = true;
            }
        })
        if($('.voteAddBox').css('display') == 'block') {
            $.each($('.voteAddBox input'), function(i, e) {
                if(isNull(e.value)){
                    flag = true;
                }
            })
        }
        if(flag) {
            layer.msg('请填写完整！');
            return false;
        }
        if(type == 'article') {
            $.each($('.authorGradeInp'), function(i, e){
                upData.push({writerRank: $(e).attr('rank'), publishArticleNumber: e.value})
            })
        } else if(type == 'ques') {
            $.each($('.authorGradeInp'), function(i, e){
                upData.push({
                    writerRank: $(e).attr('rank'), 
                    publishQuestionNumber: e.value,
                    publishInvitationNumber: $('.invitationNum[rank="'+ $(e).attr('rank') +'"]').val()
                })
            })
            console.log(upData)
        } else if(type == 'vote') {
            $.each($('.authorGradeInp'), function(i, e){
                upData.push({
                    writerRank: $(e).attr('rank'), 
                    publishVoteNumber: e.value
                })
            })
        }
        reqNewAjaxAsync('updateOnlySubActicle', upData).done(function(res){
            if(res.code != 1) return layer.msg(res.msg);
            if(res.code == 1) {
                layer.msg(res.msg);
            }
        })
        $('#setExpSaveBtn').attr('data-dismiss', 'modal');
    })
    
    //打开文章详情
    $('#artTabBody').on('click','.articleTitle', function(){
        var userId = $(this).attr('userId');
        var articleId = $(this).attr('articleId');
        var artHref = '/articleDetail.html?userId=' + userId + '&articleId=' + articleId;
        $(this).attr('href', artHref);
    })
})

var layer = layui.layer;
var laypage = layui.laypage;
var laydate = layui.laydate;
var laytpl = layui.laytpl;

$.extend({
	platform: function(){
		this.rows = 5;
		this.authPages = 1;
        this.artPages = 1;
		this.authData = {
    		subscriptionName: '',
    		writerRank: '',
    		start: '',
    		end: '',
    		article30Count: '',
    		articleCount: '',
    		pagination: {
    			page: 1,
    			rows: this.rows
    		}
    	};
        this.artData = {
            userId: '',
            begainDate: '1',
            pagination: {
                page: 1,
                rows: this.rows
            }
        }
		this.Request = {
			getTable: 'selectUserByWriterRank',
            getArtTable: 'selectDetailsByArticle',
            upGrade: 'writeReview',
            getExcel: 'selectUserByWriterRankExl'
		}
	}
})

$.platform.prototype = {
	constructor: $.platform,
	getAuthorTable: function(d, flag){
		var _this = this;
		reqNewAjaxAsync(_this.Request.getTable, d).done(function(res){
			if(res.code == 1) {
				var data = res.data || '';
				var total = res.total || '';
				_this.authPages = Math.ceil(total / _this.rows);
                _this.authPages > 1 ? $('#page').addClass('show').removeClass('hide') : $('#page').addClass('hide').removeClass('show');
                var getTpl = $('#authorTable').html();
                if(!isNull(data)){
                    laytpl(getTpl).render(data, function(html){
                        $('#gainsTabBody').html(html);
                    });
                    return flag ? _this.getAuthPage(_this.authPages, d) : false;
                } else {
                    $('#gainsTabBody').html('');
                }
			} else {
				layer.msg(res.msg);
			}
		})
	},
    getAuthPage: function(pages, d){
        var _this = this;
        laypage({
            cont: 'page', //容器。值支持id名、原生dom对象，jquery对象,
            pages: pages, //总页数
            skip: true, //是否开启跳页
            skin: '#2BC6FF',
            groups: 3, //连续显示分页数
            jump: function(obj) {
                d.pagination.page = obj.curr;
                _this.getAuthorTable(d, false);
            }
        });  
    },
    getArtTable: function(d, flag){
        var _this = this;
        reqNewAjaxAsync(_this.Request.getArtTable, d).done(function(res){
            if(res.code == 1) {
                var data = res.data || '';
                var total = res.total || '';
                _this.artPages = Math.ceil(total / _this.rows);
                _this.artPages > 1 ? $('#artPage').addClass('show').removeClass('hide') : $('#artPage').addClass('hide').removeClass('show');
                var getTpl = $('#artTable').html();
                if(!isNull(data)){
                    laytpl(getTpl).render(data, function(html){
                        $('#artTabBody').html(html);
                    });
                    return flag ? _this.getArtPage(_this.artPages, d) : false;
                } else {
                    $('#artTabBody').html('');
                }
            } else {
                layer.msg(res.msg);
            }
        })
    },
    getArtPage: function(pages, d){
        var _this = this;
        laypage({
            cont: 'artPage', //容器。值支持id名、原生dom对象，jquery对象,
            pages: pages, //总页数
            skip: true, //是否开启跳页
            skin: '#2BC6FF',
            groups: 3, //连续显示分页数
            jump: function(obj) {
                d.pagination.page = obj.curr;
                _this.getArtTable(d, false);
            }
        });  
    }
}
function authUpGrade(str, html) {
    str = $.trim(str) + "";
    if(str == '新手期') {
        $(html).html('普通作者');
    } else if(str == "普通作者"){
        $(html).html('原创作者');
    } else if(str == "原创作者"){
        $(html).html('加V作者');
    } else if(str == "加V作者"){
        $(html).html('签约作者');
    } else {
        $(html).html('');
    }
}

function examAuthType(str) {
    str = $.trim(str) + "";
    var num = 0;
    switch(str) {
        case '新手期':
            num = 2;
            break;
        case '普通作者':
            num = 3;
            break;
        case '原创作者':
            num = 4;
            break;
        case '加V作者':
            num = 5;
            break;
    }
    return num;
}