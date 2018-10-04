var layer = layui.layer;
var laypage = layui.laypage;
var laydate = layui.laydate;
var laytpl = layui.laytpl;
function sitting(){};
sitting.prototype = {
	constructor: sitting,
	page: 1,
	rows: 5,
	pages: 1,
	artPages: 1,
	shArtPages: 1,
	subArtPages: 1,
	getTabData:function(d){                     //刷新页面时显示所有列表数据
		var _this = this;
		var url = d.url || "";
		var data = d.data || "";
	    var res = reqNewAjax(url, data);
	    if(res.code == 1) {
	    	var total = res.total;
	    	var data = res.data;
            var getTpl = $("#tableList").html();
            _this.pages = Math.ceil(total / _this.rows);
            if(!isNull(data)) {
               	laytpl(getTpl).render(data, function(html){
                    $("#tableCon").html(html);
                });
            } else {
                $("#tableCon").html('');
            }
	    } else if(res.code == 9) {
	    	layer.msg(res.msg);
	    }  
	},
	getPage: function (pages, d) {              //获取分页
		var _this = this;
        laypage({
            cont: 'page', //容器。值支持id名、原生dom对象，jquery对象,
            pages: pages, //总页数
            skip: true, //是否开启跳页
            skin: '#2BC6FF',
            groups: 3, //连续显示分页数
            jump: function(obj) {
                d.data.pagination.page = _this.page = obj.curr;
                $('#multiSelectBox').removeClass('active');
                $('#checkedNum').html('0');
                _this.getTabData({
                	url: d.url,
					data: d.data
                })
            }
        });  
    },
	addSubject:function(d){                     //添加新专题
		var _this = this;
		var url = d.url || "";
		var data = d.data || "";
	    var res = reqNewAjax(url, data);
	    if(res.code == 1) {
	    	$('#inputEmail3').val('');
	    	$('#addTextarea').val('');
	    	$('#previews').html('');
	    	var data = {
				"pagination": {
    				"page": _this.page,
    				"rows": _this.rows
    			}
			};
			_this.getTabData({
				url: 'getScCmsSpecials',
				data: data
			});
			_this.getPage(_this.pages,{
				url: 'getScCmsSpecials',
				data: data
			});
			$('#confirmAddSub').attr('data-dismiss', 'modal');
	    } else if(res.code == 9) {
	    	$('#confirmAddSub').attr('data-dismiss', '');
            layer.msg(res.msg);
        }
	},
	stickAjax: function(d){                     //专题置顶
		var _this = this;
		var url = d.url || "";
		var data = d.data || "";
	    var res = reqNewAjax(url, data);
	    if(res.code == 1) {
            var data = {
				"pagination": {
    				"page": _this.page,
    				"rows": _this.rows
    			}
			};
			_this.getTabData({
				url: 'getScCmsSpecials',
				data: data
			});
			_this.getPage(_this.pages,{
				url: 'getScCmsSpecials',
				data: data
			})
	    } else if(res.code == 9) {
            layer.msg(res.msg);
        }  
	},
	getSubDetail:function(d){                   //得到专题详情
		var _this = this;
		var url = d.url || "";
		var data = d.data || "";
		$('#addArtcleIcon').attr('sccmsspecialid', data.getSubDetail);
		$('#subDArtTable').attr('sccmsspecialid', data.getSubDetail);
	    var res = reqNewAjax(url, data);
	    if(res.code == 1) {
	    	var total = res.total;
	    	var data = res.data;
            if(!isNull(data)) {
            	$('#subNumDName').html(data.scCmsSpecialName);
            	$('#subNumDName').attr('title', data.scCmsSpecialName)
            	$('#subNumDInp').val(data.scCmsSpecialName);
               	$('#subArtNum').html(data.articleNumber);
               	$('#subCommentNum').html(data.commentNumber);
               	$('#subVisitNum').html(data.specialBrowser);
               	$('#subStickIcon').attr('scCmsSpecialTop', data.scCmsSpecialTop);
               	if(data.scCmsSpecialTop == 0) {
               		$('#subStickIcon span').html('置顶专题');
               		$('#subStickIcon').css({'background-color': '#1DBFAF'});
               	} else if(data.scCmsSpecialTop == 1) {
               		$('#subStickIcon span').html('取消置顶');
               		$('#subStickIcon').css({'background-color': '#ccc'});
               	}
            } else {
                console.log('获取专题详情失败');
            }
	    } else if(res.code == 9) {
	    	layer.msg(res.msg);
	    } 
	},
	modifySubTit:function(d){                   //修改专题名称
		var _this = this;
		var url = d.url || "";
		var data = d.data || "";
	    var res = reqNewAjax(url, data);
	    if(res.code == 1) {
	    	
	    } else if(res.code == 9) {
            layer.msg(res.msg);
        }
	},
	getsubIncludeArt:function(d){               //得到该专题包含的文章列表
		var _this = this;
		var url = d.url || "";
		var data = d.data || "";
		$('#subDArtTable').attr('scCmsSpecialId',data.scCmsSpecialId);
	    var res = reqNewAjax(url, data);
	    if(res.code == 1) {
	    	var total = res.total;
	    	var data = res.data;
            var getTpl = $("#subDetailArtList").html();
            _this.subArtPages = Math.ceil(total / _this.rows);
            if(!isNull(data)) {
               	laytpl(getTpl).render(data, function(html){
                    $("#subDetailArtCon").html(html);
                });
            } else {
                $("#subDetailArtCon").html('');
            }
	    } else if(res.code == 9) {
	    	layer.msg(res.msg);
	    }
	},
	subIncludeArtPage: function (pages, d) {    //获取分页
		var _this = this;
        laypage({
            cont: 'subDArtPage', //容器。值支持id名、原生dom对象，jquery对象,
            pages: pages, //总页数
            skip: true, //是否开启跳页
            skin: '#2BC6FF',
            groups: 3, //连续显示分页数
            jump: function(obj) {
                d.data.pagination.page = _this.page = obj.curr;
                $('#subInArtMultiSel').removeClass('active');
                $('#subInCheckedNum').html('0');
                _this.getsubIncludeArt({
                	url: d.url,
					data: d.data
                })
            }
        });  
    },
    delSubIncludeArt:function(d){               //删除专题中自带的文章
    	var _this = this;
		var url = d.url || "";
		var data = d.data || "";
		var scCmsSpecialId = $('#subDArtTable').attr('sccmsspecialid');
	    var res = reqNewAjax(url, data);
	    if(res.code == 1) {
            mySelfArt(_this, scCmsSpecialId);
	    } else if(res.code == 9) {
            layer.msg(res.msg);
        }  
    },
	getContributedArt:function(d){              //得到该专题投稿的文章列表
		var _this = this;
		var url = d.url || "";
		var data = d.data || "";
		$('#addShArtTable').attr('scCmsSpecialId', data.scCmsSpecialId);
	    var res = reqNewAjax(url, data);
	    if(res.code == 1) {
			$('#contributeArt').addClass('show').removeClass('hide');
			$('#storeHouseArt').addClass('hide').removeClass('show');
	    	var total = res.total;
	    	var data = res.data;
            var getTpl = $("#artTabList").html();
            $('#totalArt').html(total);
            _this.artPages = Math.ceil(total / _this.rows);
            if(!isNull(data)) {
               	laytpl(getTpl).render(data, function(html){
                    $("#addArtTableCon").html(html);
                });
            } else {
                $("#addArtTableCon").html('');
            }
	    } else if(res.code == 9) {
	    	layer.msg(res.msg);
	    }  
	},
	getContriArtPage: function (pages, d) {     //获取分页
		var _this = this;
        laypage({
            cont: 'artPage', //容器。值支持id名、原生dom对象，jquery对象,
            pages: pages, //总页数
            skip: true, //是否开启跳页
            skin: '#2BC6FF',
            groups: 3, //连续显示分页数
            jump: function(obj) {
                d.data.pagination.page = _this.page = obj.curr;
                $('#artMultiSelBox').removeClass('active');
                $('#artCheckedNum').html('0');
                _this.getContributedArt({
                	url: d.url,
					data: d.data
                })
            }
        });  
    },
    getStoreHouseArt:function(d){              //得到仓库中的文章列表
		var _this = this;
		var url = d.url || "";
		var data = d.data || "";
	    var res = reqNewAjax(url, data);
	    if(res.code == 1) {
	    	var total = res.total;
	    	var data = res.data;
            var getTpl = $("#storeArtList").html();
            $('#shTotalArt').html(total);
            _this.shArtPages = Math.ceil(total / _this.rows);
            if(!isNull(data)) {
               	laytpl(getTpl).render(data, function(html){
                    $("#addShArtTableCon").html(html);
                });
            } else {
                $("#addShArtTableCon").html('');
            }
	    } else if(res.code == 9) {
	    	layer.msg(res.msg);
	    }  
	},
	getStoreHArtPage: function (pages, d) {     //获取分页
		var _this = this;
        laypage({
            cont: 'artShPage', //容器。值支持id名、原生dom对象，jquery对象,
            pages: pages, //总页数
            skip: true, //是否开启跳页
            skin: '#2BC6FF',
            groups: 3, //连续显示分页数
            jump: function(obj) {
                d.data.pagination.page = _this.page = obj.curr;
                $('#artShMultiSelBox').removeClass('active');
                $('#artShCheckedNum').html('0');
                _this.getStoreHouseArt({
                	url: d.url,
					data: d.data
                })
            }
        });  
    },
    addContriArt: function(d){                  //添加投稿箱文章到专题
    	var _this = this;
		var url = d.url || "";
		var data = d.data || "";
		var scCmsSpecialId = data.scCmsSpecialId;
	    var res = reqNewAjax(url, data);
	    if(res.code == 1) {
	    	
	    } else if(res.code == 9) {
        	layer.msg(res.msg);
        }
    },
    delContriArt:function(d){                   //删除投稿箱文章
    	var _this = this;
		var url = d.url || "";
		var data = d.data || "";
		var scCmsSpecialId = data.scCmsSpecialId;
	    var res = reqNewAjax(url, data);
	    if(res.code == 1) {
	    	getContriArt(_this, scCmsSpecialId);
	    } else if(res.code == 9) {
            layer.msg(res.msg);
        }
    },
    addStoreArtToSub:function(d, scCmsSpecialId){               //添加仓库中的文章到专题
    	var _this = this;
		var url = d.url || "";
		var data = d.data || "";
	    var res = reqNewAjax(url, data);
	    if(res.code == 1) {
			if(res.msg == '操作失败') {
				layer.msg('不要重复添加');
			} else {
				mySelfArt(_this, scCmsSpecialId);
			}
	    } else if(res.code == 9) {
            layer.msg(res.msg);
        }
    }
}

$(function(){
	var start = new sitting();
	//进入页面默认渲染列表数据：
	getAllSubTable(start)
	//input禁止输入空格
	inhibitTrim('#inputEmail3');
	inhibitTrim('#searchInp');
	inhibitTrim('#artSearchInp');
	inhibitTrim('#subNumDInp');

	//专题搜索按钮搜索专题：
	$('#search_icon').click(function(){
		var data = {
			"scCmsSpecialName": delTrim($('#searchInp').val()),
			"pagination": {
    			"page": start.page,
    			"rows": start.rows
    		}
		};
    	start.getTabData({
			url: 'getScCmsSpecials',
			data: data
		});
		start.getPage(start.pages,{
			url: 'getScCmsSpecials',
			data: data
		});
	})
	
	//点击专题列表框选中和取消功能：
	$('#addSubTable').on('click', '.singleSelectBox', function(){
		operateSinCheck(this, '.singleSelectBox.active', '#multiSelectBox', '#checkedNum', $('.singleSelectBox').length);
	})
	$('#addSubTable').on('click', '#isCheckAll', function(){
		operateAllCheck(this, '#multiSelectBox', '.singleSelectBox', '#checkedNum');
	})

	//点击置顶表格中的该专题：
	$('#addSubTable').on('click', '.stickOperate', function(){
		var scCmsSpecialId = $(this).parent().attr('scCmsSpecialId');
		console.log(scCmsSpecialId)
		start.stickAjax({
			url: 'oPerationScCmsSpecials',
			data: {
				'scCmsSpecialId': scCmsSpecialId,
				'scCmsSpecialTop': 1
			}
		})
	});
	//点击删除表格中的该专题：
	$('#addSubTable').on('click', '.deleteOperate', function(){
		var scCmsSpecialId = $(this).parent().attr('scCmsSpecialId');
		layer.confirm('确认删除吗？', {
            title: "提示",
            btn: ['确认', '取消'],
            btn1: function (index, layero) {
				var res = reqNewAjax('delScCmsSpecials', [{'scCmsSpecialId': scCmsSpecialId}]);
                layer.msg(res.msg);
                if(res.code != 1) {return false};
				if(res.code == 1) {
					var data = {
						"pagination": {
							"page": start.page,
							"rows": start.rows
						}
					};
					start.getTabData({
						url: 'getScCmsSpecials',
						data: data
					});
					start.getPage(start.pages,{
						url: 'getScCmsSpecials',
						data: data
					})
				}
            }
        });
	});
	//点击批量删除表格中的专题：
	$('#addSubTable').on('click', '#delTotalOpera', function(){
		var deleteList = $('.singleSelectBox.active').parent().parent();
		var dataArr = [];
		deleteList.each(function(i,e){
			dataArr.push({'scCmsSpecialId': $(e).attr('scCmsSpecialId')})
		})
		if(dataArr[0] != undefined){
			layer.confirm('确认删除吗？', {
				title: "提示",
				btn: ['确认', '取消'],
				btn1: function (index, layero) {
					var res = reqNewAjax('delScCmsSpecials', dataArr);
					layer.msg(res.msg);
					if(res.code != 1) {return false};
					if(res.code == 1) {
						var data = {
							"pagination": {
								"page": start.page,
								"rows": start.rows
							}
						};
						start.getTabData({
							url: 'getScCmsSpecials',
							data: data
						});
						start.getPage(start.pages,{
							url: 'getScCmsSpecials',
							data: data
						})
					}
				}
			});
		} else {
			layer.msg('请至少选择一项');
		}
	});

	//点击确定添加按钮添加新专题：
    $('#confirmAddSub').click(function(){
    	var scCmsResourcesList = [];
    	$('#previews img').each(function(i,e){
    		scCmsResourcesList.push({
    			"resourcesName": new Date().getTime(),
    			"resourcesUrl": e.src,
    			"resourcesType":"cover",
    			"resources_img_width": 170,
    			"resources_img_height": 170
    		});
    	})
    	var inputEmail3 = delTrim($('#inputEmail3').val());
    	if(inputEmail3 && $('#addTextarea').val() && (scCmsResourcesList.length == 1 || scCmsResourcesList.length == 3)){
    		if(inputEmail3.length < 15) {
    			var scCmsShowType = 0;
    			scCmsResourcesList.length > 1 ? scCmsShowType = 2 : scCmsShowType = 1;
				var isChecked = $('.formRadioBox input[type="radio"]:checked').val();
				if(isChecked == 1) {
					if(inputEmail3.length > 2){
						layer.msg('特殊专题名称只能为两个字！');
						$('#confirmAddSub').attr('data-dismiss', '');
					} else {
						start.addSubject({
    						url: 'oPerationScCmsSpecials',
    						data: {
    							"scCmsSpecialName": inputEmail3,
    							"scCmsSpecialDescribe": $('#addTextarea').val(),
    							"scCmsShowType": scCmsShowType,
    							"scCmsResourcesList": scCmsResourcesList,
								"scCmsSpecialIsSpecial": isChecked
    						}
    					})
					}
				} else if(isChecked == 0) {
					start.addSubject({
    					url: 'oPerationScCmsSpecials',
    					data: {
    						"scCmsSpecialName": inputEmail3,
    						"scCmsSpecialDescribe": $('#addTextarea').val(),
    						"scCmsShowType": scCmsShowType,
    						"scCmsResourcesList": scCmsResourcesList,
							"scCmsSpecialIsSpecial": isChecked
    					}
    				})
				}
    			
    		} else {
    			$('#confirmAddSub').attr('data-dismiss', '');
    			layer.msg('专题名称不得超过14个字');
    		}
    	} else {
    		$('#confirmAddSub').attr('data-dismiss', '');
    		layer.msg("专题名称和专题描述为必填项，上传图片只能是1张图/3张图！");
    	}
    });

	//上传本地图片点击事件
	uploadOss({
        btn: "localBtn",
        imgDom: "previews",
        flag: "sendLocals"
    });
    $("#selectfiles").click(function() {
        var len = $("#previews .editor_img").length;
        if (len >= 3) {
            layer.msg("当前封面图片只能选择一张或三张!");
        } else {
            $("#localBtn").click();
        }
    });

    //点击专题弹出专题详情模态框：
    $('#addSubTable').on('click', '.sccmsspecialname', function(){
    	var scCmsSpecialId = $(this).parent().attr('scCmsSpecialId');
    	$('#subNumDInp').attr('scCmsSpecialId', scCmsSpecialId);
    	$('#addArtcleIcon').attr('scCmsSpecialId', scCmsSpecialId);
    	SubDetails(start, scCmsSpecialId);
    	mySelfArt(start, scCmsSpecialId);
    })

    //点击专题模态框中修改按钮修改专题名称：
    $('#modifySubName').click(function(e){
    	e = e || window.event;
		if(e.stopPropagation){
			e.stopPropagation();
		} else {
			e.cancelBuble = true;
		}
    	switchInpCss('hide', 'show');
        $('#subNumDInp').on('keydown',function(event){
        	var e = event || window.event;
        	if(e && e.keyCode == 13){
        		var subNewName = delTrim($('#subNumDInp').val());
        		console.log(subNewName);
        		if(subNewName.length < 15 && subNewName.length > 0){
        			if(subNewName != $('#subNumDName').html()){
        				switchInpCss('show', 'hide');
        				$('#subNumDName').html(subNewName);
        				$('#subNumDName').attr('title', subNewName);
        				start.modifySubTit({
        					url: 'oPerationScCmsSpecials',
        					data: {
        						'scCmsSpecialId': $(this).attr('scCmsSpecialId'),
        						'scCmsSpecialName': subNewName
        					}
        				})
        				getAllSubTable(start);
        			} else {
        				switchInpCss('show', 'hide');
        			}
        		} else {
        			layer.msg('专题名称不能超过14个字且不能为空哦');
        		}
        	}
        })
    })

    //点击input阻止隐藏事件
    $('#subNumDetail').on('click', '#subNumDInp', function(e){
    	e = e || window.event;
		if(e.stopPropagation){
			e.stopPropagation();
		} else {
			e.cancelBuble = true;
		}
    })

    $(document).click(function(){
		switchInpCss('show', 'hide');
	})

    //点击专题详情模态框中文章列表选中和取消功能：
    $('#subDetailArtL').on('click', '.subInArtSingleSel', function(){
		operateSinCheck(this, '.subInArtSingleSel.active', '#subInArtMultiSel', '#subInCheckedNum', $('.subInArtSingleSel').length);
	})
	$('#subDetailArtL').on('click', '#artIsCheckAll', function(){
		operateAllCheck(this, '#subInArtMultiSel', '.subInArtSingleSel', '#subInCheckedNum');
	})

	//专题内包含文章的单个删除操作：
	$('#subDArtTable').on('click', '.subInArtDel', function(){
		var articleId = $(this).parent().parent().attr('articleId');
		var scCmsSpecialId = $('#subDArtTable').attr('scCmsSpecialId');
		start.delSubIncludeArt({
			url: 'delScCmsArsp',
			data: {
				'scCmsSpecialId': scCmsSpecialId,
				'arsps': [{'scCmsArticleId': articleId}]
			}
		})
		SubDetails(start, scCmsSpecialId);
		getAllSubTable(start);
	})

	//专题内包含文章的批量删除操作：
	$('#subDArtTable').on('click', '#subInArtMultiDel', function(){
		var scCmsSpecialId = $('#subDArtTable').attr('scCmsSpecialId');
		var deleteList = $('.subInArtSingleSel.active').parent().parent();
		var arsps = [];
		deleteList.each(function(i,e){
			arsps.push({'scCmsArticleId': $(e).attr('articleId')})
		})
		if(arsps[0] != undefined){
			start.delSubIncludeArt({
				url: 'delScCmsArsp',
				data: {
					'scCmsSpecialId': scCmsSpecialId,
					'arsps': arsps
				}
			})
			SubDetails(start, scCmsSpecialId);
			getAllSubTable(start);
		}
	})

	//专题详情模态框中的置顶按钮：
	$('#subStickIcon').click(function(){
		var scCmsSpecialId = $(this).siblings().attr('sccmsspecialid');
		var sccmsspecialtop = $(this).attr('sccmsspecialtop');
		var data = {
			'scCmsSpecialId': scCmsSpecialId,
			'scCmsSpecialTop': 1
		}
		if(sccmsspecialtop == 0) {
			data.scCmsSpecialTop = 1;
			$('#subStickIcon span').html('取消置顶');
			$(this).attr('sccmsspecialtop', 1).css({'backgroundColor': '#ccc'});
		} else if(sccmsspecialtop == 1) {
			data.scCmsSpecialTop = 0;
			$('#subStickIcon span').html('置顶专题');
			$(this).attr('sccmsspecialtop', 0).css({'backgroundColor': '#1DBFAF'});
		}
		start.stickAjax({
			url: 'oPerationScCmsSpecials',
			data: data
		})
	})

	//专题详情模态框中的添加文章:
	$('#addArtcleIcon').click(function(){
		$('#artSearchInp').val('');
		var scCmsSpecialId = $(this).attr('scCmsSpecialId');
		$('#addArtTable').attr('scCmsSpecialId', scCmsSpecialId);
		getContriArt(start, scCmsSpecialId);
	})

    //点击添加文章按钮：
    $('#addSubTable').on('click', '.ArtListBtn', function(){
    	$('#artSearchInp').val('');
    	var scCmsSpecialId = $(this).parent().attr('scCmsSpecialId');
    	$('#addArtTable').attr('scCmsSpecialId', scCmsSpecialId);
    	getContriArt(start, scCmsSpecialId);
    })

    //点击添加文章模态框中的搜索按钮：
	$('#addArticle').on('click', '#artSearchIcon', function(){
		var artSearchInp = delTrim($('#artSearchInp').val());
		var data = {
			"articleTitle": artSearchInp,
			"pagination": {
    			"page": start.page,
    			"rows": start.rows
    		}				
		}
		if(artSearchInp){
			$('#contributeArt').addClass('hide').removeClass('show');
			$('#storeHouseArt').addClass('show').removeClass('hide');
			start.getStoreHouseArt({
				url: 'getScCmsArList',
				data: data
			})
			start.getStoreHArtPage(start.shArtPages,{
				url: 'getScCmsArList',
				data: data
			})
		} else {
			var scCmsSpecialId = $('#addArtTable').attr('sccmsspecialid');
			getContriArt(start, scCmsSpecialId);
		}
	})
    
    //投稿箱文章列表框选中和取消功能：
	$('#addArtTable').on('click', '.artSingleSelBox', function(){
		operateSinCheck(this, '.artSingleSelBox.active', '#artMultiSelBox', '#artCheckedNum', $('.artSingleSelBox').length);
	})
	$('#addArtTable').on('click', '#contriIsCheckAll', function(){
		operateAllCheck(this, '#artMultiSelBox', '.artSingleSelBox', '#artCheckedNum');
	})

	//单独添加投稿箱文章按钮：
	$('#addArtTable').on('click', '.addContriIcon', function(){
		var scCmsSpecialId = $('#addArtTable').attr('scCmsSpecialId');
		var articleId = $(this).parent().parent().attr('articleId');
		start.addContriArt({
			url: 'updateScCmsArsp',
			data: {
				"scCmsSubmission": 0,
				"scCmsSpecialId": scCmsSpecialId,
				"arsps": [{"scCmsArticleId": articleId}]
			}
		})
		getContriArt(start, scCmsSpecialId);
	    mySelfArt(start, scCmsSpecialId);
		SubDetails(start, scCmsSpecialId);
		getAllSubTable(start);
	})
	//批量添加投稿箱文章按钮：
	$('#addArtTable').on('click', '#addTotContriIcon', function(){
		var scCmsSpecialId = $('#addArtTable').attr('scCmsSpecialId');
		var addList = $('.artSingleSelBox.active').parent().parent();
		var dataArr = [];
		addList.each(function(i,e){
			dataArr.push({'scCmsArticleId': $(e).attr('articleId')})
		})
		if(dataArr[0] != undefined) {
			start.addContriArt({
				url: 'updateScCmsArsp',
				data: {
					"scCmsSubmission": 0,
					"scCmsSpecialId": scCmsSpecialId,
					"arsps": dataArr
				}
			})
			getContriArt(start, scCmsSpecialId);
	    	mySelfArt(start, scCmsSpecialId);
			SubDetails(start, scCmsSpecialId);
			getAllSubTable(start);
		}
	})

	//单独删除投稿箱文章按钮：
	$('#addArtTable').on('click', '.delContriIcon', function(){
		var scCmsSpecialId = $('#addArtTable').attr('scCmsSpecialId');
		var articleId = $(this).parent().parent().attr('articleId');
		console.log(articleId)
		start.delContriArt({
			url: 'delScCmsArsp',
			data: {
				"scCmsSpecialId": scCmsSpecialId,
				"arsps": [{"scCmsArticleId": articleId}]
			}
		})
		SubDetails(start, scCmsSpecialId);
		getAllSubTable(start);
	})
	//批量删除投稿箱文章按钮：
	$('#addArtTable').on('click', '#delTotContriIcon', function(){
		var scCmsSpecialId = $('#addArtTable').attr('scCmsSpecialId');
		var addList = $('.artSingleSelBox.active').parent().parent();
		var dataArr = [];
		addList.each(function(i,e){
			dataArr.push({'scCmsArticleId': $(e).attr('articleId')})
		})
		if(dataArr[0] != undefined){
			start.delContriArt({
				url: 'delScCmsArsp',
				data: {
					"scCmsSpecialId": scCmsSpecialId,
					"arsps": dataArr
				}
			})
			SubDetails(start, scCmsSpecialId);
			getAllSubTable(start);
		}
	})

	//数据库文章列表框选中和取消功能：
	$('#addShArticleBox').on('click', '.artShSingleSel', function(){
		operateSinCheck(this, '.artShSingleSel.active', '#artShMultiSelBox', '#artShCheckedNum', $('.artShSingleSel').length);
	})
	$('#addShArticleBox').on('click', '#searchIsCheckAll', function(){
		operateAllCheck(this, '#artShMultiSelBox', '.artShSingleSel', '#artShCheckedNum');
	})

	//将数据库文章单个添加至专题中：
	$('#addShArticleBox').on('click', '.storeToSub', function(){
		var scCmsSpecialId = $('#addShArtTable').attr('scCmsSpecialId');
		var articleId = $(this).parent().parent().attr('articleId');
		start.addStoreArtToSub({
			url: 'addScCmsArsp',
			data: {
				'arsps': [{'scCmsSubmission': 0, 'scCmsSpecialId': scCmsSpecialId, 'scCmsArticleId': articleId}]
			}
		}, scCmsSpecialId)
		SubDetails(start, scCmsSpecialId);
		getAllSubTable(start);
	})
	//将数据库文章批量添加至专题中：
	$('#addShArticleBox').on('click', '#storeToSubTotal', function(){
		var scCmsSpecialId = $('#addShArtTable').attr('scCmsSpecialId');
		var addList = $('.artShSingleSel.active').parent().parent();
		var dataArr = [];
		addList.each(function(i,e){
			dataArr.push({'scCmsSubmission': 0, 'scCmsSpecialId': scCmsSpecialId, 'scCmsArticleId': $(e).attr('articleid')})
		})
		if(dataArr[0] != undefined){
			start.addStoreArtToSub({
				url: 'addScCmsArsp',
				data: {
					'arsps': dataArr
				}
			}, scCmsSpecialId)
			SubDetails(start, scCmsSpecialId);
			getAllSubTable(start);
		}
	})
	//打开文章详情
	$('#addShArtTableCon').on('click','.sccmsspecialname', function(){
		var articleId = $(this).attr('articleId');
		var artHref = '/articleDetail.html?userId=0&articleId=' + articleId;
		$(this).find('a').attr('href', artHref);
		$(this).find('a').click();
	})
	$('#subDetailArtCon').on('click','.sccmsspecialname', function(){
		var articleId = $(this).attr('articleId');
		var artHref = '/articleDetail.html?userId=0&articleId=' + articleId;
		$(this).find('a').attr('href', artHref);
		$(this).find('a').click();
	})
	$('#addArtTableCon').on('click','.sccmsspecialname', function(){
		var articleId = $(this).attr('articleId');
		var artHref = '/articleDetail.html?userId=0&articleId=' + articleId;
		$(this).find('a').attr('href', artHref);
		$(this).find('a').click();
	})
});

//切换专题名称input样式
function switchInpCss(add, remove){
	$('#subNumDName').addClass(add).removeClass(remove);
	$('#subNumDInp').addClass(remove).removeClass(add);
}

//进入页面时默认刷新专题列表数据：
function getAllSubTable(start){
	var data = {
		"pagination": {
			"page": start.page,
			"rows": start.rows
		}
	};
	start.getTabData({
		url: 'getScCmsSpecials',
		data: data
	});
	start.getPage(start.pages,{
		url: 'getScCmsSpecials',
		data: data
	});
}

//获取投稿文章
function getContriArt(start, scCmsSpecialId){
	var data = {
 		'scCmsSpecialId': scCmsSpecialId,
 		'scCmsSubmission': 1,
 		"pagination": {
 			"page": start.page,
 			"rows": start.rows
 		}
 	};
 	start.getContributedArt({
 		url: 'getScCmsArticles',
 		data: data
 	})
 	start.getContriArtPage(start.artPages,{
		url: 'getScCmsArticles',
		data: data
	});
}

//加载专题自带文章
function mySelfArt(start, scCmsSpecialId){
	var data = {
		'scCmsSpecialId': scCmsSpecialId,
		'scCmsSubmission': 0,
		"pagination": {
			"page": start.page,
			"rows": start.rows
		}
	};
	start.getsubIncludeArt({
		url: 'getScCmsArticles',
		data: data
	});
	start.subIncludeArtPage(start.subArtPages, {
		url: 'getScCmsArticles',
		data: data
	})
}

//加载专题详情数据：
function SubDetails(start, scCmsSpecialId){
	start.getSubDetail({
		url: 'getCmsSpecialResponse',
		data: {
			'scCmsSpecialId': scCmsSpecialId
		}
	})
}