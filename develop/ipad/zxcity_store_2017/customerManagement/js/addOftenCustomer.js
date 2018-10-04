(function($){
	var shopId = sessionStorage.getItem("shopId"),
	    employeeId = sessionStorage.getItem("backUserId");
	var pageNo = 1, pageSize = 5;

	//展示数据
	function showMemberList(res){
		var sHtml = ""
		if(res.code == 1){
			var obj = res.data;
			if(obj.length > 0){
				for(var i=0; i<obj.length; i++){
					sHtml += '<tr data-accountId="'+obj[i].accountId+'">'
						+ '<td>'+obj[i].accountName+'</td>'
						+ '<td>'+obj[i].mobile+'</td>'
						+ '<td>'+obj[i].cardNumber+'</td>'
						+ '<td>'+(obj[i].businessName ? obj[i].businessName : "")+'</td>'
						+ '<td>'+(obj[i].isRegular == 0 ? "否" : "是")+'</td>';
					if(obj[i].isRegular == 0){
						sHtml += '<td><button type="button" class="btn add-btn">添加熟客</button></td>'
					}else{
						sHtml += '<td><button type="button" class="btn remove-btn">移除熟客</button></td>'
					}
					sHtml += '</tr>'
				}
			}else{
				sHtml += '<tr><td colspan="6">暂无数据</td></tr>'
			}
			$("#customerTable tbody").html(sHtml);
		}else{
			layer.msg(res.msg);
		}

	}

	//操作
	$("#customerTable tbody").delegate("tr .btn", "click", function(){
		var jsonData = "{'employeeId':"+employeeId+", 'accountId':"+$(this).parents("tr").attr("data-accountId")+"}"
		if($(this).hasClass('add-btn')){
			//添加熟客
			reqAjaxAsync("shop/addRegularCustomer", jsonData).done(function(resData){
				if(resData.code == 1){
					layer.msg("已经将该顾客添加到您的熟客列表");
				}else{
					layer.msg(res.msg);
				}
			});

		}else{
			//移除熟客
			reqAjaxAsync("shop/removeRegularCustomer", jsonData).done(function(resData){
				if(resData.code == 1){
					layer.msg("已经将该顾客从您的熟客列表移除！");
				}else{
					layer.msg(res.msg);
				}
			});
		}
		getMembersList();
	});

	//调用接口，加载列表数据
	function getMembersList(){
		var cmd = "shop/shopMembers";
		var keyword = $.trim($("#keyword").val()) == "" ? "" : $.trim($("#keyword").val());	//获取文本框的值
		var param = {
			'shopId': shopId,
			'employeeId':employeeId,
			'keyword':  keyword,
			'pageNo': pageNo,
			'pageSize': pageSize
		}
		reqAjaxAsync(cmd, JSON.stringify(param)).done(function(resData){
			if(keyword != "" && resData.data.code == 1 && resData.data.length == 0){
				layer.msg("对不起，列表中没有您搜索的客户！");
				return;
			}
			showMemberList(resData);
			pagingInit('#customerPage',resData.total,pageSize,function (page) {
                param['pageNo'] = page;
                reqAjaxAsync(cmd, JSON.stringify(param)).done(function(resData){
                    showMemberList(resData);
                });
            })
			// if(resData.total > 0){
			// 	$("#customerPage").bootpag({
			// 		total: Math.ceil(resData.total / pageSize),
			// 		page: 1,
			// 		leaps: false,
			// 		maxVisible: 10
			// 	}).on('page', function(event, num){
			// 		param['pageNo'] = num;
			// 		reqAjaxAsync(cmd, JSON.stringify(param)).done(function(resData){
			// 			showMemberList(resData);
			// 		});
			// 	}).removeClass("invisible");
			// }else{
			// 	$("#customerPage").addClass("invisible");
			// }
		});


	}

	getMembersList();

	$("#btnSel").click(function(){
		var trLen = $("#customerTable tbody").find("tr").length;
		getMembersList();
	});
})(jQuery);
