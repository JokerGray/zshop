(function($) {
	var userno = sessionStorage.getItem('userno');
	var userName = sessionStorage.getItem('username')
	var userId = sessionStorage.getItem('userId');
	var layer = layui.layer;
	var laypage = layui.laypage;
	var nums = 10;
	//未评论的默认变红,已评论的默认变绿,已回复按钮加上禁止点击；
	function setRed() {
		var oTd = $('#tbodyParameter').find('tr').find('td');
		var oTdArr = [];
		oTd.each(function(i, item) {
			if($(item).hasClass('status')) {
				oTdArr.push(item)
			}
		})
		for(var i = 0; i < oTdArr.length; i++) {
			if(oTdArr[i].innerHTML == '未回复') {
				oTdArr[i].setAttribute("class", "status red");
				oTdArr[i].nextElementSibling.nextElementSibling.lastElementChild.lastElementChild.innerHTML = "回复"
				oTdArr[i].nextElementSibling.nextElementSibling.lastElementChild.lastElementChild.setAttribute("id", "reply")
			}
			if(oTdArr[i].innerHTML == '未确认回复') {
				oTdArr[i].setAttribute("class", "status red");
				oTdArr[i].nextElementSibling.nextElementSibling.lastElementChild.lastElementChild.innerHTML = "修改"
				oTdArr[i].nextElementSibling.nextElementSibling.lastElementChild.lastElementChild.setAttribute("id", "change")
			}
			if(oTdArr[i].innerHTML == '已回复') {
				oTdArr[i].nextElementSibling.nextElementSibling.lastElementChild.lastElementChild.innerHTML = "已回"
				oTdArr[i].setAttribute("class", "status green");
				oTdArr[i].nextElementSibling.nextElementSibling.lastElementChild.lastElementChild.setAttribute("class", "btn reply")
				oTdArr[i].nextElementSibling.nextElementSibling.lastElementChild.lastElementChild.setAttribute("disabled", "disabled")
			}
		}
	}
	//删除审核
	$('#tbodyParameter').on('click', '.delete-parameter', deleteParameter)

	function deleteParameter() {
		var id = $(this).parent().siblings('td').eq(1).html();
		var _thistr = $(this).parent().parent('tr');
		layer.confirm("确认删除?", {
			icon: 3,
			title: '提示'
		}, function() {
			var d3 = {
				"id": Number(id)
			}
			d3 = JSON.stringify(d3)
			var ans = reqAjax("operations/deleteReply", d3);
			_thistr.remove();
			location.reload(true)
			layer.close()
		})
	}
	//回复审核
	$('#tbodyParameter').on('click', '#change', getChange);
	$('#tbodyParameter').on('click', '#reply', getReply);

	function getChange() {
		var id = $(this).parent().parent().siblings('td').eq(1).html();
		var replyStatus = ($(this).parent().parent().siblings('td').eq(10).html() == '已回复') ? '是' : '否(待修改)';
		var replyContent = $(this).parent().parent().siblings('td').eq(4).html();
		var feedbackArtic = $(this).parent().parent().siblings('td').eq(3).html();
		$('#replyStatus1').val(replyStatus);
		$('#replyCon').val(replyContent);
		$('#feedbackCon').val(feedbackArtic);
		var e1 = {
			"id": Number(id)
		};
		e1 = JSON.stringify(e1);
		var getList = reqAjax("operations/updateReplyIndex ", e1)
		console.log(getList)
		var dataId = getList.data.id;
		var dataQuistionId = getList.data.questionId;
		$('#saveAudit').click(function() {
			var breplyStatus = ($('#replyStatus1').val() == '是') ? '1' : '0';
			var replyContent = $('#replyCon').val();
			var e2 = {
				id: Number(dataId),
				questionId: Number(id),
				reply: replyContent,
				replyStatus: Number(breplyStatus),
				userId: Number(userno),
				userName: userName
			}
			e2 = JSON.stringify(e2);
			reqAjax("operations/addReply", e2);
			location.reload(true)
		})
	}

	function getReply() {
		var id = $(this).parent().parent().siblings('td').eq(1).html();
		var replyStatus = ($(this).parent().parent().siblings('td').eq(10).html() == '已回复') ? '是' : '否(待修改)';
		var replyContent = $(this).parent().parent().siblings('td').eq(4).html();
		var feedbackArtic = $(this).parent().parent().siblings('td').eq(3).html();
		$('#replyStatus1').val(replyStatus);
		$('#replyCon').val(replyContent);
		$('#feedbackCon').val(feedbackArtic);
		$('#saveAudit').click(function() {
			var breplyStatus = ($('#replyStatus1').val() == '是') ? '1' : '0';
			var replyContent = $('#replyCon').val();
			var e2 = {
				questionId: Number(id),
				reply: replyContent,
				replyStatus: Number(breplyStatus),
				userId: Number(userno),
				userName: userName
			}
			e2 = JSON.stringify(e2);
			reqAjax("operations/addReply", e2);
			location.reload(true)
		})
	}

	//查询详情
	$('#tbodyParameter').on('click', '.feedbackInfo', lookStatu);
	function lookStatu() {
		var imgUrl = $(this).parent().parent().siblings('td').eq(6).attr('data-url');
		var id = $(this).parent().parent().siblings('td').eq(1).html();
		var replyStatus = $(this).parent().parent().siblings('td.status').html();
		var replyContent = $(this).parent().parent().siblings('td').eq(4).html();
		var feedbackArtic = $(this).parent().parent().siblings('td').eq(3).html();
			var sHtml = `<tr>
		                	<td class="">反馈内容:</td>
		                	<td class="">`+feedbackArtic+`</td>
                        </tr>
                        <tr>
                        	<td class="">回复状态:</td>
                        	<td class="">`+replyStatus+`</td>
                        </tr>
                        <tr>
                        	<td class="">回复内容:</td>
                        	<td class="">`+replyContent+`</td>
                        </tr>
                        <tr>
                        	<td class="">反馈图片:</td>
                        	<td class="">
                        		<img src=`+imgUrl+`>
                        	</td>
                        </tr>`
            $('#infoAudit').on('show.bs.modal', function () {
							$('#infoAudit #modal-tbody').html(sHtml)
	       })
	}

	//查询审核		
	$('#inquire').on('click', inquire)

	function inquire() {
		//模拟渲染
		var render = function(data, curr) {
			var arr = []
				// ,thisData = data.concat().splice(curr*nums-nums, nums);
				,
				thisData = data;
			layui.each(thisData, function(index, item) {
				arr.push('<li>' + item + '</li>');
			});
			return arr.join('');
		};
		var replyStatus = function() {
			var status = '';
			if($('#replyStatus').val() == '未回复') {
				status = -1;
			};
			if($('#replyStatus').val() == '未确认') {
				status = 0;
			};
			if($('#replyStatus').val() == '已回复') {
				status = 1;
			};
			if($('#replyStatus').val() == '--全部--') {
				status = '';
			};
			return status;
		}
		var feedbacktType = function() {
			var type = '';
			if($('#feedbacktType').val() == '系统问题') {
				type = '0'
			};
			if($('#feedbacktType').val() == '页面问题') {
				type = '1'
			}
			if($('#feedbacktType').val() == '其它问题') {
				type = '2'
			}
			if($('#feedbacktType').val() == '--全部--') {
				type = ''
			}
			return type;
		}
		var clientType = function() {
			var client = '';
			if($('#clientSide').val() == 'PC端') {
				client = '1'
			};
			if($('#clientSide').val() == 'APP') {
				client = '2'
			}
			if($('#clientSide').val() == '--全部--') {
				client = ''
			}
			return client;
		}
		var check1 = replyStatus();
		var check2 = feedbacktType();
		var check3 = clientType();
		var inquire = $('#inquireInput').val();
		var dataList = {
			page: 1,
			rows: 10,
			problemsSuggestion: inquire,
			userId: userno,
			replyStatus: check1,
			feedbackType: check2,
			moreField1: check3
		}
		var dataAll = reqAjax("operations/feedBackList", JSON.stringify(dataList));
				var str1 = '';
				//调用分页
				laypage({
					cont: 'paging-box',
					first: false,
					last: false,
					prev: '<' //若不显示，设置false即可
						,
					next: '>',
					pages: Math.ceil(dataAll.total/ nums) //得到总页数
						,
					curr: function() { //通过url获取当前页，也可以同上（pages）方式获取
						var page = location.search.match(/page=(\d+)/);
						return page ? page[1] : 1;
					}(),
					jump: function(obj, first) {
							var dataList = {
								page: obj.curr,
								rows: 10,
								problemsSuggestion: inquire,
								userId: userno,
								replyStatus: check1,
								feedbackType: check2,
								moreField1: check3
								}
							var dataAll = reqAjax("operations/feedBackList", JSON.stringify(dataList));
							var data = dataAll.data
							var str = '';
							for(var i = 0; i < data.length; i++) {
								var suggenstStr = data[i].problemsSuggestion;
								var forReplyStr = data[i].forReply;
								if(data[i].feedbackType == 0) {
									data[i].feedbackType = '系统问题'
								} else if(data[i].feedbackType == 1) {
									data[i].feedbackType = '页面问题'
								} else if(data[i].feedbackType == 2) {
									data[i].feedbackType = '其他问题'
								}
								if(data[i].replyStatus == 0) {
									data[i].replyStatus = '未确认回复'
								} else if(data[i].replyStatus == 1) {
									data[i].replyStatus = '已回复'
								} else if(!data[i].replyStatus) {
									data[i].replyStatus = '未回复'
								}
								if(data[i].moreField1 == 1) {
									data[i].moreField1 = 'PC端'
								} else if(data[i].moreField1 == 2) {
									data[i].moreField1 = 'APP'
								}
								if(!data[i].email) {
									data[i].email = ''
								}
								if(!data[i].qqCode) {
									data[i].qqCode = ''
								}
								if(suggenstStr&&suggenstStr.length>=20){
									suggenstStr=suggenstStr.substring(0,20)+'...'
								}
								if(forReplyStr&&forReplyStr.length>=20){
									forReplyStr=forReplyStr.substring(0,20)+'...'
								}
								
								var moreField2 = data[i].moreField2==null?'':data[i].moreField2
								str += "<tr class='row'>" +
								"<td>" + (i + 1) + "</td>" +
								"<td id='id' style='display:none'>" + data[i].id + "</td>" +
								"<td>" + data[i].feedbackType + "</td>" +
								"<td class='feedback-artic' style='display:none;width:300px'>" + suggenstStr + "</td>"
								if(forReplyStr == null){
									str += "<td class='feedback-reply' style='display:none;width:300px'>" + "" + "</td>";
								}else{
									str += "<td class='feedback-reply' style='display:none;width:300px'>" + forReplyStr + "</td>";
								}
								
								var moreField2 = data[i].moreField2==null?'':data[i].moreField2
								str +=	"<td id='type' style='display:none'>" + + data[i].typeCode + "</td>" +
								"<td data-url="+data[i].problemsImgurl+">" + data[i].nickName  + "</td>" +
								"<td>" + moreField2  + "</td>" +
								"<td>" + data[i].qqCode  + "</td>" +
								"<td>" + data[i].email  + "</td>" +
								"<td>" + data[i].createTime  + "</td>" +
								"<td class='status'>" +  data[i].replyStatus  + "</td>" +
								"<td>" + data[i].moreField1 + "</td>" +
								"<td class='row remove-modifier' style='width:170px'>" +
								"<div class='col-md-4 delete-parameter'>" +
								"<i class='glyphicon glyphicon-minus-sign m5 red'></i> 删除" +
								"</div>" +
								"<div class='col-md-4 info'>" +
									"<button class='feedbackInfo btn btn-success info' type='button' data-toggle='modal' data-target='#infoAudit'>" +
									"详情 </button>" +
								"</div>" +
								"<div class='col-md-4 reply'>" +
								"<button class='btn btn-success reply' type='button' data-toggle='modal' data-target='#changeAudit'>" +
								"回复 </button>" +
								"</div>" +
								"</td>" +
					"</tr>"
							}
//							console.log("1")
//							console.log($(tbodyParameter)[0])
							$(tbodyParameter).html(str);
							str=""
							setRed()
							document.getElementById('paging-box-count').innerHTML = render(data, obj.curr);
							$('#paging-box-count').html('共' + obj.pages + '页，每页' + nums + '条，共'+dataAll.total+'条');
						}
				})
	}

	//分页
(function(){
	var dataList = {
		page: 1,
		rows: 10,
		problemsSuggestion: '',
		userId: '',
		replyStatus: '',
		feedbackType: '',
		moreField1: ''
	}
	var dataAll = reqAjax("operations/feedBackList", JSON.stringify(dataList));
	var data = dataAll.data
	var nums = 10; //每页出现的数据量

	//模拟渲染
	var render = function(data, curr) {
		var arr = []
			// ,thisData = data.concat().splice(curr*nums-nums, nums);
			,
			thisData = data;
		layui.each(thisData, function(index, item) {
			arr.push('<li>' + item + '</li>');
		});
		return arr.join('');
	};
		laypage({
			cont: 'paging-box',
			first: false,
			last: false,
			prev: '<' //若不显示，设置false即可
				,
			next: '>',
			pages: Math.ceil(dataAll.total / nums) //得到总页数
				,
			curr: function() { //通过url获取当前页，也可以同上（pages）方式获取
				var page = location.search.match(/page=(\d+)/);
				return page ? page[1] : 1;
			}(),
			jump: function(obj, first) {
				var dataList = {
					page: obj.curr,
					rows: 10,
					problemsSuggestion: '',
					userId: '',
					replyStatus: '',
					feedbackType: '',
					moreField1: ''
				}
				var dataAll = reqAjax("operations/feedBackList", JSON.stringify(dataList))
				var data = dataAll.data;
				console.log(data)
				var str;
				for(var i = 0; i < data.length; i++) {
					var suggenstStr = data[i].problemsSuggestion;
					var forReplyStr = data[i].forReply;
					if(data[i].feedbackType == 0) {
						data[i].feedbackType = '系统问题'
					} else if(data[i].feedbackType == 1) {
						data[i].feedbackType = '页面问题'
					} else if(data[i].feedbackType == 2) {
						data[i].feedbackType = '其他问题'
					}
					if(data[i].replyStatus == 0) {
						data[i].replyStatus = '未确认回复'
					} else if(data[i].replyStatus == 1) {
						data[i].replyStatus = '已回复'
					} else if(!data[i].replyStatus) {
						data[i].replyStatus = '未回复'
					}
					if(data[i].moreField1 == 1) {
						data[i].moreField1 = 'PC端'
					} else if(data[i].moreField1 == 2) {
						data[i].moreField1 = 'APP'
					}
					if(!data[i].email) {
						data[i].email = ''
					}
					if(!data[i].qqCode) {
						data[i].qqCode = ''
					}
					if(suggenstStr&&suggenstStr.length>=20){
						suggenstStr=suggenstStr.substring(0,20)+'...'
					}
					if(forReplyStr&&forReplyStr.length>=20){
						forReplyStr=forReplyStr.substring(0,20)+'...'
					}
					
					str += "<tr class='row'>" +
					"<td>" + (i + 1) + "</td>" +
					"<td id='id' style='display:none'>" + data[i].id + "</td>" +
					"<td>" + data[i].feedbackType + "</td>" +
					"<td class='feedback-artic' style='display:none;width:300px'>" + suggenstStr + "</td>"
					if(forReplyStr == null){
						str += "<td class='feedback-reply' style='display:none;width:300px'>" + "" + "</td>";
					}else{
						str += "<td class='feedback-reply' style='display:none;width:300px'>" + forReplyStr + "</td>";
					}
					
					var moreField2 = data[i].moreField2==null?'':data[i].moreField2
					str +=	"<td id='type' style='display:none'>" + + data[i].typeCode + "</td>" +
					"<td data-url="+data[i].problemsImgurl+">" + data[i].nickName  + "</td>" +
					"<td>" + moreField2  + "</td>" +
					"<td>" + data[i].qqCode  + "</td>" +
					"<td>" + data[i].email  + "</td>" +
					"<td>" + data[i].createTime  + "</td>" +
					"<td class='status'>" +  data[i].replyStatus  + "</td>" +
					"<td>" + data[i].moreField1 + "</td>" +
					"<td class='row remove-modifier' style='width:170px'>" +
					"<div class='col-md-4 delete-parameter'>" +
					"<i class='glyphicon glyphicon-minus-sign m5 red'></i> 删除" +
					"</div>" +
					"<div class='col-md-4 info'>" +
						"<button class='feedbackInfo btn btn-success info' type='button' data-toggle='modal' data-target='#infoAudit'>" +
						"详情 </button>" +
					"</div>" +
					"<div class='col-md-4 reply'>" +
					"<button class='btn btn-success reply' type='button' data-toggle='modal' data-target='#changeAudit'>" +
					"回复 </button>" +
					"</div>" +
					"</td>" +
					"</tr>"
				}
			$(tbodyParameter).html(str);
			setRed();
			document.getElementById('paging-box-count').innerHTML = render(data, obj.curr);
			$('#paging-box-count').html('共' + obj.pages + '页，每页' + nums + '条，共'+dataAll.total+'条');
		}
	});
})()
})(jQuery)