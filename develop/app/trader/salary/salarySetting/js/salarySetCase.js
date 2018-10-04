var hasRulesDate;

// 实体 规则 主键id
var entityRulesId;
// 自定义 业绩 规则 主键id
var customRulesId;

// url获取 merchantId
var merchantId = getQueryString('merchantId');
var positionId = getQueryString('positionId');
var type = getQueryString('type');

$("#positionName").select2({
	width:'100%',
	language:'zh-CN'
});

$("#selectInfo1").select2({
	width:'100%',
	language:'zh-CN'
});

$("#selectInfo2").select2({
	width:'100%',
	language:'zh-CN'
});

// 返回按钮
$('.back').attr({'href':'salarySet.html?merchantId='+merchantId});

// 根据商户ID获取商户下职务列表  接口联调
// var def = reqAjax('shop/newsalary/getPositionProjects', {
// 	"merchantId": merchantId,
//     "pagination": {
//         "page": 1,
//         "rows": 10
//     }
// });
// def.then(function(data){
// 	console.log(data);
// 	var data = data.data;
// 	if(type == 0){  // 设置（已有） 
// 		for(var i = 0;i<data.length;i++){
// 			var content = $('.positionInfoItem').first().clone();
// 			content.attr({'id':data[i].id});
// 			content.find('.position').text(data[i].positionName);
// 			content.find('.baseSalary').val(data[i].referenceSalary);
// 			content.find('.fixedSubsidy').val(data[i].fixedSubsidy == null || data[i].fixedSubsidy == '' ? 0 : data[i].fixedSubsidy);
// 			content.show();
// 			$('.positionInfo tbody').append(content);
// 		}
// 	}else if(type == 1){ // 新增
// 		// $('.caseDescribeItem').show();
// 	}
// })


getProject();
// 根据职务主键ID获取职务已经设置的提成方案和提成规则  接口联调
function getProject(){
	var def = reqAjax('shop/newsalary/getPositionProjectAndRules', {
		"merchantId": merchantId,
		"positionId":positionId
	});
	def.then(function(data){
		hasRulesDate = data.data;
		var data = data.data;
		if(data.length != 0){

			var caseName = '';

			$('.cassDescribe').text('');
			for(var i =0;i<data.length;i++){
				$('.projectId').val(data[i].projectId)
				caseName = data[i].projectName;

				var content = $($('#tp3').html()).first().clone();
				content.find('.counts').text(Number(i+1));
				content.find('.caseInfos').append(data[i].ruleStr);
				content.find('.caseSetting').attr({'rulesId':data[i].id});
				content.find('.deleteRules').attr({'rulesId':data[i].id});

				$('.cassDescribe').append(content);

			}
			$('.caseName').val(caseName);
		}
	})
}

// 删除规则
function deleteRule(self){
	var ruleId = $(self).attr('rulesId');
	var index1 = layer.confirm('确定要删除该规则吗?', function(){
        // 删除 职务 接口联调
        var def = reqAjax('shop/newsalary/deleteRuleById', {
            ruleId : ruleId
        });
        def.then(function(data){
            if(data.code == 1){
                layer.msg(data.msg,{icon:1});
                layer.close(index1);
                location.reload();
            }else{
                layer.msg(data.msg,{icon:2});
            }
        })
    });
}

// 职位修改
$('#positionName').change(function(event) {
	positionId = $(this).find('option:selected').val();
	location.href='salarySetCase.html?merchantId='+merchantId+'&positionId='+positionId;
});



// 点击设置按钮 对应信息补充
$('.cassDescribe').on('click','.caseSetting',function(){
	for(var i=0;i<hasRulesDate.length;i++){
		if(hasRulesDate[i].id == $(this).attr('rulesId')){

			// 自定义 规则id  和 自定义 主键id 初始化
			$('.customId').val(''); 
			$('.customRuleId').val('');

			// 初始化
			$('.projectId').val('');
			$('.contentKeyId').val(''); 

			// 
			$('.projectId').val(hasRulesDate[i].projectId);

			//
			$('.contentKeyId').val(hasRulesDate[i].id); 

			// 规则名称
			$('.rulesNames').val(hasRulesDate[i].ruleName);



			// 自定义业绩  业绩基数
			for(var j = 0;j<$('#formulaModeType option').length;j++){
				if(hasRulesDate[i].formulaModeType == $($('#formulaModeType option')[j]).val()){
					$($('#formulaModeType option')[j]).prop('selected','true');
				}
			}

			if(hasRulesDate[i].formulaModeType == 1){
				$('.customPerformance').show();
			}else{
				$('.customPerformance').hide();
			}
 		

			// 选择的提成业绩组成项  
			var consistTypeArr = [];
			var checkTypeArr = [];
			var checkValueArr = [];

			var itemIdArr = [];
			var itemRulesIdArr = [];


			for(var k = 0;k < hasRulesDate[i].scShopSalaryConsists.length;k++){
				if(hasRulesDate[i].scShopSalaryConsists[k].forType == 0){
					consistTypeArr.push(hasRulesDate[i].scShopSalaryConsists[k].consistType);
					checkTypeArr.push(hasRulesDate[i].scShopSalaryConsists[k].checkType);
					checkValueArr.push(hasRulesDate[i].scShopSalaryConsists[k].checkValue);

					itemIdArr.push(hasRulesDate[i].scShopSalaryConsists[k].id);
					itemRulesIdArr.push(hasRulesDate[i].scShopSalaryConsists[k].ruleId);

				}
			}

			// 实体 
			$('.money').val(hasRulesDate[i].money);
			
			// 根据 后面方法 切换 会执行（先删除后添加）两步  则 需要执行两次相同的方法
			$('#selectInfo1').select2().val(consistTypeArr).trigger("change");
			$('#selectInfo1').select2().val(consistTypeArr).trigger("change");

			//全部 选中 选中以外  遍历 
			for(var d=0;d <consistTypeArr.length;d++){
				for(var h = 0;h<$('.rulesItem1').length;h++){

					if(consistTypeArr[d] == $($('.rulesItem1')[h]).attr('selecId')){
						// 全部 选中 选中以外
						$($('.rulesItem1')[h]).find('.selecStatus option').each(function(index, el) {
							if(checkTypeArr[d] == $(el).val()){
								$(el).prop('selected',true);
							}else{
								$(el).prop('selected',false);
							}
						});
						// 主键id 和 规则id
						$($('.rulesItem1')[h]).find('#itemId').val(itemIdArr[d]);
						$($('.rulesItem1')[h]).find('#itemrulesId').val(itemRulesIdArr[d]);

						// 数据
						$($('.rulesItem1')[h]).find('#infoItemId').val(checkValueArr[d]);

						if(checkValueArr[d].split(',')[0] == ''){
							$($('.rulesItem1')[h]).find('.numbers').text('0');
						}else{
							$($('.rulesItem1')[h]).find('.numbers').text(checkValueArr[d].split(',').length);
						}
						
						if(checkTypeArr[d] == 0){
							$($('.rulesItem1')[h]).find('.selecs').hide();

						}else{
							$($('.rulesItem1')[h]).find('.selecs').show();
						}
					}
				}	
			}

			// 自定义 提成业绩组成
			if(hasRulesDate[i].scShopSalaryCustomRule != null){
				
				$('#selectInfo2').select2().val(hasRulesDate[i].scShopSalaryCustomRule.consist.split('|')).trigger("change");
				$('#selectInfo2').select2().val(hasRulesDate[i].scShopSalaryCustomRule.consist.split('|')).trigger("change");

				if(hasRulesDate[i].scShopSalaryCustomRule.scShopSalaryConsists != null ){
					for(var j = 0;j<hasRulesDate[i].scShopSalaryCustomRule.scShopSalaryConsists.length;j++){
						$('.rulesItem2').each(function(index, el) {
							if(index > 0){
								if(hasRulesDate[i].scShopSalaryCustomRule.scShopSalaryConsists[j].consistType == $(el).attr('selecId')){
									$(el).find('#infoItemId').val(hasRulesDate[i].scShopSalaryCustomRule.scShopSalaryConsists[j].checkValue);
									$(el).find('#customSelcId').val(hasRulesDate[i].scShopSalaryCustomRule.scShopSalaryConsists[j].id);   
									$(el).find('#customSelcRuleId').val(hasRulesDate[i].scShopSalaryCustomRule.scShopSalaryConsists[j].ruleId);

									$(el).find('.selecStatus option').each(function(index, el) {
										if(hasRulesDate[i].scShopSalaryCustomRule.scShopSalaryConsists[j].checkType == $(el).val()){
											$(el).prop('selected',true);
										}else{
											$(el).prop('selected',false);
										}
									});

									if(hasRulesDate[i].scShopSalaryCustomRule.scShopSalaryConsists[j].checkType == 0){
										$(el).find('.selecs').hide();
									}else{
										$(el).find('.selecs').show();
									}
									if(hasRulesDate[i].scShopSalaryCustomRule.scShopSalaryConsists[j].checkValue.split(',')[0] == ''){
										$(el).find('.numbers').text('0');
									}else{
										$(el).find('.numbers').text(hasRulesDate[i].scShopSalaryCustomRule.scShopSalaryConsists[j].checkValue.split(',').length);
									}

								}
							}
						});			
					}
				}
					

				// 自定义 业绩 选择 个人 团队 店铺
				$('.customTeam option').each(function(index, el) {
					if($(el).val() == hasRulesDate[i].scShopSalaryCustomRule.onlyType){
						$(el).prop('selected',true);
					}
				});

				// 自定义业绩 金额
				$('.moneys').val(hasRulesDate[i].scShopSalaryCustomRule.money);

				// 自定义业绩 每笔
				$('#customNum option').each(function(index, el) {
					if($(el).val() == hasRulesDate[i].scShopSalaryCustomRule.countType){
						$(el).prop('selected',true);
					}
				});

				// 自定义业绩 业绩值/数量
				$('#customType option').each(function(index, el) {
					if($(el).val() == hasRulesDate[i].scShopSalaryCustomRule.unitType){
						$(el).prop('selected',true);
					}
				});
				// 自定义业绩  主键id
				$('.customId').val(hasRulesDate[i].scShopSalaryCustomRule.id);

				// 自定义 规则id
				$('.customRuleId').val(hasRulesDate[i].scShopSalaryCustomRule.ruleId);
			}


			//分档次提成对应档次列表
			$('.divideClass').text('');
			for(var a = 0;a < hasRulesDate[i].scShopSalaryLevels.length;a++){
				var content = $($('#tp1').html()).first().clone();

				content.find('.levelId').val(hasRulesDate[i].scShopSalaryLevels[a].id);
				content.find('.ruleId').val(hasRulesDate[i].scShopSalaryLevels[a].ruleId);

				content.find('.scopeMin').val(hasRulesDate[i].scShopSalaryLevels[a].scopeMin);
				content.find('.scopeMax').val(hasRulesDate[i].scShopSalaryLevels[a].scopeMax);
				content.find('.calcType option').each(function(index, el) {
					if($(el).val() == hasRulesDate[i].scShopSalaryLevels[a].calcType){
						$(el).prop('selected',true);
					}
				});
				content.find('.calcValue').val(hasRulesDate[i].scShopSalaryLevels[a].calcValue);
				$('.divideClass').append(content);	
			}

			// 0-个人；1-团队；2-店铺
			$('.onlyType option').each(function(index, el) {
				if($(el).val() == hasRulesDate[i].onlyType){
					$(el).prop('selected',true);
				}
			});



			// 0-每笔；1-首次；2-首次以外；3-前三次；4-前三次以外；
			$('#selectCount option').each(function(index, el) {
				if($(el).val() == hasRulesDate[i].countType){
					$(el).prop('selected',true);
				}
			});

			//0-业绩值；1-数量
			$('.resultValue option').each(function(index, el) {
				if($(el).val() == hasRulesDate[i].unitType){
					$(el).prop('selected',true);
				}
			});

			// 0-本月累计；1-本季度累计；2-本年累计；
			$('.accumulativeType option').each(function(index, el) {
				if($(el).val() == hasRulesDate[i].accumulativeType){
					$(el).prop('selected',true);
				}
			});

			// 0-固定提成；1-分档次提成；
			$('.caleType option').each(function(index, el) {
				if($(el).val() == hasRulesDate[i].caleType){
					$(el).prop('selected',true);
					if(hasRulesDate[i].caleType == 0){
						$('.fixeds').show();
						$('.divideClass').hide();
					}else{
						$('.fixeds').hide();
						$('.divideClass').show();
					}
				}
			});

			//0-固定值；1-百分比
			$('.fixedsType option').each(function(index, el) {
				if($(el).val() == hasRulesDate[i].caleUnitType){
					$(el).prop('selected',true);
				}
			});

			// 固定提成值
			$('.fixedsValue').val(hasRulesDate[i].caleValue);
		}
	}
});



// 根据商户id 获取 商户 职位列表
var def = reqAjax('shop/newsalary/getPositionList', {
	"merchantId": merchantId,
});
def.then(function(data){
	var data = data.data;
	for(var i = 0;i <data.length;i++){
		if(positionId == data[i].id){
			$('#positionName').append('<option value="'+data[i].id+'" selected="selected">'+data[i].positionName+'</option>')
		}else{
			$('#positionName').append('<option value="'+data[i].id+'">'+data[i].positionName+'</option>')
		}
	}
})

// 自定义 
$('#formulaModeType').change(function(event) {
	if($(this).val() == 0){
		$('.customPerformance').hide();
	}else if($(this).val() == 1){
		$('.customPerformance').show();
	}
});


// 规则（业绩基数） 切换 
$('#selectInfo1').on('change',function(){
	var isStatus = true;
	var isDelete = true;
	var hasArr = [];
	var selected = $("#selectInfo1").select2('data');//选择的值
	//
	for(var h = 0;h<selected.length;h++){
		if(selected[h].id == 10 || selected[h].id == 11 ){
			for(var i = 0;i<selected.length;i++){
				if(selected[h].id == 10){
					
					if(selected[i].id == 1 || selected[i].id == 2 || selected[i].id == 3 || selected[i].id == 4 || selected[i].id == 5 || selected[i].id == 6 || selected[i].id == 7 || selected[i].id == 8 || selected[i].id == 9 ){
						layer.msg('人头数与业绩不能共存！',{icon:2});
						return;
					}
				}else{
					if(selected[i].id == 1 || selected[i].id == 2 || selected[i].id == 3 || selected[i].id == 4 || selected[i].id == 5 || selected[i].id == 6 || selected[i].id == 7 || selected[i].id == 8 || selected[i].id == 9 ){
						layer.msg('服务工单数与业绩不能共存！',{icon:2});
						return;
					}
				}
			}

		}else{

			for(var i = 0;i<selected.length;i++){
				if(selected[i].id == 10){
					layer.msg('人头数与业绩不能共存！',{icon:2});
					return;
				}

				if(selected[i].id == 11){
					layer.msg('服务工单数与业绩不能共存！',{icon:2});
					return;
				}
			}
		}
	}


	// 获取 已有 单子的
	for(var j = 0;j<$('.rulesItem1').length;j++){
		if($($('.rulesItem1')[j]).attr('selecId') != undefined){
			hasArr.push($($('.rulesItem1')[j]).attr('selecId'));
		}
	}
	
	if(hasArr.length < selected.length){  // 添加
		for (var i=0;i<selected.length;i++){  // 新增所有
			if(hasArr.length != 0){
				for(var k = 0;k<hasArr.length;k++){
					if(selected[i].id == hasArr[k]){  // 已有
						isStatus = false;
					}
				}
			}
			
			if(isStatus){
				var content = $($('#tp2').html()).first().clone();
				content.find('.rulesName').text(selected[i].text);
				content.css({'display':'inline-block'}).attr({'selecId':selected[i].id});
				if(selected[i].id == 1){
					content.find('.names').text('会员');
				}else if(selected[i].id == 2 || selected[i].id==5){
					content.find('.names').text('商品');
				}else if(selected[i].id == 3 || selected[i].id == 6 || selected[i].id == 8 || selected[i].id == 9 || selected[i].id == 10 || selected[i].id == 11 || selected[i].id == 12){
					content.find('.names').text('服务项目');
				}else if(selected[i].id == 4 || selected[i].id == 7){
					content.find('.names').text('服务卡项');
				}
				$('.rulesMessage1').append(content);
			}
			isStatus = true;
		}
	}else{ // 删除
		for(var k = 0;k<hasArr.length;k++){   // 已有 
			for (var i=0;i<selected.length;i++){  // 删除还剩
				if(hasArr[k] == selected[i].id){
					isDelete = false;
				}
			}
			if(isDelete){
				for(var h =0;h<$('.rulesItem1').length;h++){
					if($($('.rulesItem1')[h]).attr('selecId') == hasArr[k]){  // 找到 不匹配 那一项
						$($('.rulesItem1')[h]).remove();
					}
				}
			}
			isDelete = true;
		}
	}

});

// 全部 选中 选中以外  selec
$('.rulesMessage1').on('change','.selecStatus',function(){
	if($(this).val() == 0){
		$(this).parent().parent().find('.selecs').hide();
	}else{
		$(this).parent().parent().find('.selecs').show();
	}
});


// 自定义 全部 选中 选中以外  selec
$('.rulesMessage2').on('change','.selecStatus',function(){
	if($(this).val() == 0){
		$(this).parent().parent().find('.selecs').hide();
	}else{
		$(this).parent().parent().find('.selecs').show();
	}
});


// 点击 选中 商品/服务/服务卡
$('.rulesMessage1').on('click','.rulesItem1 .selecs',function(){
	var selecId = $(this).parent().attr('selecId');

	var titleName = '';
	if(selecId == 1){
		var type = 0;
		titleName = '选中充值会员';
	}else if(selecId == 2 || selecId==5){
		var type = 1;
		titleName = '选中商品';
	}else if(selecId == 3 || selecId == 6 || selecId == 8 || selecId == 9 || selecId == 10 || selecId == 11 || selecId == 12){
		var type = 2;
		titleName = '选中服务项目';
	}else if(selecId == 4 || selecId == 7){
		var type = 3;
		titleName = '选中服务卡';
	}
	
	var that = this;
	//自定页
	layer.open({
	    type: 2,  
	    area: ['800px', '500px'],
	    btn: ['确定','取消'],
	    title: titleName,
	    maxmin: true,
	    content: 'list.html?merchantId='+merchantId+'&type='+type+'&selecId='+$(that).parent().find('#infoItemId').val(),
	    yes: function(index, layero){
	    	//获取到弹框里面的body
	    	var body = layer.getChildFrame('body', index);
	        var iframeWin = layero.find('iframe')[0]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
	       	var res = iframeWin.contentWindow.doSubmit();
	       	$(that).find('.numbers').text(res.Nums);
	       	$(that).parent().find('#infoItemId').val(res.idArr);
	       	layer.close(index);

	  	}
	});	
});

// 自定义 
$('#selectInfo2').on('change',function(){
	var isStatus = true;
	var isDelete = true;
	var hasArr = [];
	var selected = $("#selectInfo2").select2('data');//选择的值

	for(var h = 0;h<selected.length;h++){
		if(selected[h].id == 10 || selected[h].id == 11 ){

			for(var i = 0;i<selected.length;i++){
				if(selected[i].id == 1 || selected[i].id == 2 || selected[i].id == 3 || selected[i].id == 4 || selected[i].id == 5 || selected[i].id == 6 || selected[i].id == 7 || selected[i].id == 8 || selected[i].id == 9 ){

					layer.msg('人头数和业绩不能共存！',{icon:2});
					return;
				}
			}
		}else{
			for(var i = 0;i<selected.length;i++){
				if(selected[i].id == 10){
					layer.msg('人头数和业绩不能共存！',{icon:2});
					return;
				}

				if(selected[i].id == 11){
					layer.msg('服务工单数和业绩不能共存！',{icon:2});
					return;
				}
			}
		}
	}

	// 获取 已有 单子的
	for(var j = 0;j<$('.rulesItem2').length;j++){
		if($($('.rulesItem2')[j]).attr('selecId') != undefined){
			hasArr.push($($('.rulesItem2')[j]).attr('selecId'));
		}
	}
	
	if(hasArr.length < selected.length){  // 添加
		for (var i=0;i<selected.length;i++){  // 新增所有
			if(hasArr.length != 0){
				for(var k = 0;k<hasArr.length;k++){
					if(selected[i].id == hasArr[k]){  // 已有
						isStatus = false;
					}
				}
			}
			if(isStatus){
				var content = $('.rulesItem2').first().clone();
				content.find('.rulesName').text(selected[i].text);
				content.css({'display':'inline-block'}).attr({'selecId':selected[i].id});
				if(selected[i].id == 1){
					content.find('.names').text('会员');
				}else if(selected[i].id == 2 || selected[i].id==5){
					content.find('.names').text('商品');
				}else if(selected[i].id == 3 || selected[i].id == 6 || selected[i].id == 8 || selected[i].id == 9 || selected[i].id == 10 || selected[i].id == 11 || selected[i].id == 12){
					content.find('.names').text('服务项目');
				}else if(selected[i].id == 4 || selected[i].id == 7){
					content.find('.names').text('服务卡项');
				}
				$('.rulesMessage2').append(content);
			}
			isStatus = true;
		}
	}else{ // 删除
		for(var k = 0;k<hasArr.length;k++){   // 已有 
			for (var i=0;i<selected.length;i++){  // 删除还剩
				if(hasArr[k] == selected[i].id){
					isDelete = false;
				}
			}
			if(isDelete){
				for(var h =0;h<$('.rulesItem2').length;h++){
					if($($('.rulesItem2')[h]).attr('selecId') == hasArr[k]){
						$($('.rulesItem2')[h]).remove();
					}
				}
			}
			isDelete = true;
		}
	}
});


// 点击 选中 商品/服务
$('.rulesMessage2').on('click','.rulesItem2 .selecs',function(){
	var selecId = $(this).parent().attr('selecId');
	var titleName = '';
	if(selecId == 1){
		var type = 0;
		titleName = '选中充值会员';
	}else if(selecId == 2 || selecId==5){
		var type = 1;
		titleName = '选中商品';
	}else if(selecId == 3 || selecId == 6 || selecId == 8 || selecId == 9 || selecId == 10 || selecId == 11 || selecId == 12){
		var type = 2;
		titleName = '选中服务项目';
	}else if(selecId == 4 || selecId == 7){
		var type = 3;
		titleName = '选中服务卡';
	}
	
	var that = this;

	//自定页
	layer.open({
	    type: 2,  
	    area: ['800px', '500px'],
	    btn: ['确定','取消'],
	    title: titleName,
	    maxmin: true,
	    content: 'list.html?merchantId='+merchantId+'&type='+type+'&selecId='+$(that).parent().find('#infoItemId').val(),
	    yes: function(index, layero){
	    	//获取到弹框里面的body
	    	var body = layer.getChildFrame('body', index);
	        var iframeWin = layero.find('iframe')[0]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
	       	var res = iframeWin.contentWindow.doSubmit();
	       	$(that).find('.numbers').text(res.Nums);
	       	$(that).parent().find('#infoItemId').val(res.idArr);
	       	layer.close(index);
	  	}
	});	
});


// 固定提成  分档次提成 
$('.caleType').on('change',function(){
	if($(this).val() == 0){
		$('.fixeds').show();
		$('.divideClass').hide();
	}else{
		$('.fixeds').hide();
		$('.divideClass').show();
	}
})


// 新增 
function addItem(self){
	var content = $($('#tp1').html()).first().clone();
	$('.divideClass').append(content);
}

// 删除
function deleteItem(self){
	if($('.divideClassItem').length <= 1){
		layer.msg('提成业绩档次最少有一条！',{icon:2});
		return;
	}

	$(self).parent().remove();
}

// 提交按钮
function submitBtn(){
	// 实体 select 框取值
	var selectInfo1Data = $("#selectInfo1").select2('data');//选择的值
	// 自定义 select 框取值
	var selectInfo2Data = $("#selectInfo2").select2('data');//选择的值
	var selectInfo1DataArr = [];
	var selectInfo2DataArr = [];

	for(var i = 0;i<selectInfo1Data.length;i++){
		selectInfo1DataArr.push(selectInfo1Data[i].id);
	}
	for(var i = 0;i<selectInfo2Data.length;i++){
		selectInfo2DataArr.push(selectInfo2Data[i].id);
	}

	// 求 提成规则档次列表
	var scShopSalaryLevelList = [];
	$('.divideClass .divideClassItem').each(function(index, el) {
		scShopSalaryLevelList.push({
			"calcValue": $(el).find('.calcValue').val(),//提成值，如果百分比（1~100）
			"id": $(el).find('.levelId').val() != undefined ? $(el).find('.levelId').val() : '',//主键值
			"scopeMax": $(el).find('.scopeMax').val(),//档次最大值
			"calcType": $(el).find('.calcType option:selected').val(),//计算方式0-固定值 1-百分比
			"ruleId": $(el).find('.ruleId').val() != undefined ? $(el).find('.ruleId').val() : '',//提成规则表主键
			"scopeMin": $(el).find('.scopeMin').val()//档次最小值
		})
	});


	// 自定义提成规则档次实体
	var scShopSalaryCustomRule = [];
	scShopSalaryCustomRule.push({
		"id": $('.customId').val(),//主键值 
		"unitType": $('.customPerformance').find('#customType option:selected').val(),//0-业绩值；1-数量
		"consist": selectInfo2DataArr.join('|'),//业绩组成项
		"ruleId": $('.customRuleId').val(),//提成规则表主键
		"money": $('.customPerformance').find('.moneys').val(),//金额(大于)
		"onlyType": $('.customPerformance').find('#customTeam option:selected').val(),//0-个人；1-团队；2-店铺
		"countType": $('.customPerformance').find('#customNum option:selected').val()//0-每笔；1-首次；2-首次以外；3-前三次；4-前三次以外
	});


	// 自定义提成规则档次业绩组成项列表
	var salaryCustomConsistList = [];
	$('.rulesMessage2 .rulesItem2').each(function(index, el) {
		if(index > 0){
			salaryCustomConsistList.push({
				"id": $(el).find('#customSelcId').val(),//主键值
				"checkValue": $(el).find('#infoItemId').val(),//选择关系对象主键列表
				"ruleId": $(el).find('#customSelcRuleId').val(),//提成规则表主键
				"consistType": $(el).attr('selecId'),//业绩组成类型（1-充值业绩2-现金购买商品3-现金消费服务4-现金购买服务卡项 * 5-余额购买商品6-余额消费服务7-余额购买服务卡项8-服务业绩9-服务人头数10-服务工单数）
				"forType": $(el).attr('forType'),//0-提成规则组成项1-自定义档次规则
				"checkType": $(el).find('.selecStatus option:selected').val()//选择类型（0-全部，1-选中，2-选中以外）
			});
		}
	});


	// 提成方案实体
	var scShopSalaryProject = [];
	scShopSalaryProject.push({
		"id": $('.projectId').val(),//主键值(方案)  
		"shopId": '',//店铺主键
		"positionId": positionId,//职务ID
		"merchantId": merchantId,//商户主键ID
		"projectName": $('.caseName').val()//方案名称
	});


	// 提成规则业绩组成项列表
	var scShopSalaryConsistList = [];
	$('.rulesMessage1 .rulesItem1').each(function(index, el) {
		scShopSalaryConsistList.push({
			"id": $(el).find('#itemId').val(),//主键值
			"checkValue": $(el).find('#infoItemId').val(),//选择关系对象主键列表
			"ruleId": $(el).find('#itemrulesId').val(),//提成规则表主键
			"consistType": $(el).attr('selecId'),//业绩组成类型（1-充值业绩2-现金购买商品3-现金消费服务4-现金购买服务卡项 * 5-余额购买商品6-余额消费服务7-余额购买服务卡项8-服务业绩9-服务人头数10-服务工单数）
			"forType":$(el).attr('forType') ,//0-提成规则组成项 1-自定义档次规则
			"checkType": $(el).find('.selecStatus option:selected').val()//选择类型（0-全部，1-选中，2-选中以外）
		});
	});

	// 提成规则实体
	var scShopSalaryRule = [];
	scShopSalaryRule.push({
		"consist": selectInfo1DataArr.join('|'),//业绩组成项
		"unitType": $('.rulesDescribe .resultValue option:selected').val(),//0-业绩值；1-数量；
		"projectId": $('.projectId').val(),//提成方案主键
		"caleValue": $('.fixedsValue').val(),//固定提成值
		"onlyType": $('.onlyType option:selected').val(),//0-个人；1-团队；2-店铺
		"id": $('.contentKeyId').val(),//主键值
		"plateType": 1,//所属板块
		"caleType": $('.caleType option:selected').val(),//0-固定提成；1-分档次提成
		"positionId": positionId,//职务主键
		"ruleName": $('.rulesNames').val(),//提成方案规则名称
		"money": $('.money').val(),//金额(大于)
		"merchantId": merchantId,//商户主键
		"accumulativeType": $('.accumulativeType option:selected').val(),//0-本月累计；1-本季度累计；2-本年累计；
		"formulaModeType": $('#formulaModeType option:selected').val(),//0-业绩基数；1-自定义计算档次的业绩；
		"caleUnitType": $('.fixedsType option:selected').val(),//0-固定值；1-百分比；
		"countType": $('#selectCount option:selected').val()//0-每笔；1-首次；2-首次以外；3-前三次；4-前三次以外；
	});

	var Arr = {
		scShopSalaryLevelList:scShopSalaryLevelList,
		scShopSalaryCustomRule:scShopSalaryCustomRule,
		salaryCustomConsistList:salaryCustomConsistList,
		scShopSalaryProject:scShopSalaryProject,
		scShopSalaryConsistList:scShopSalaryConsistList,
		scShopSalaryRule:scShopSalaryRule
	}

	if($('.caseName').val().trim('') == ''){
		layer.msg('方案名称不能为空！',{icon:2});
		return;
	}

	if($('.rulesNames').val().trim('') == ''){
		layer.msg('规则名称不能为空！',{icon:2});
		return;
	}

	if($('.money').val().trim('') == ''){
		layer.msg('规则实体金额不能为空！',{icon:2});
		return;
	}

	if($('.caleType option:selected').val() == 0){
		if($('.fixedsValue').val().trim('') == ''){
			layer.msg('固定提成金额不能为空！',{icon:2});
			return;
		}
	}else if($('.caleType option:selected').val() == 1){

		for(var i = 0;i<$('.scopeMin').length;i++){
			if($($('.scopeMin')[i]).val().trim('') == ''){
				layer.msg('分档次最小金额不能为空！',{icon:2});
				return;
			}
		}

		for(var i = 0;i<$('.scopeMax').length;i++){
			if($($('.scopeMax')[i]).val().trim('') == ''){
				layer.msg('分档次最大金额不能为空！',{icon:2});
				return;
			}
		}


		for(var i = 0;i<$('.calcValue').length;i++){
			if($($('.calcValue')[i]).val().trim('') == ''){
				layer.msg('分档次提成不能为空！',{icon:2});
				return;
			}
		}
	}

	if($('.caseDescribeItem').length > 6){
		layer.msg('提成规则最多5条！',{icon:2});
		return;
	}


	// 新增职务提成规则附带新增修改提成方案等信息
	var def = reqAjax('shop/newsalary/insertProjectAndRules', Arr);
	def.then(function(data){
		console.log(data);
		if(data.code == 1){
			location.reload();
			layer.msg(data.msg,{icon:1});
		}else{
			layer.msg(data.msg,{icon:2});
		}
	})

}


// 刷新页面 
function refresh(){
	location.reload();
}

// 金额 校验
function moneyCheck(self){
    if($(self).val().length <= 8){
        if($(self).val().length==1){
            $(self).val($(self).val().replace(/[^0-9]/g,''));
        } else {
            $(self).val($(self).val().replace(/[^0-9.]/g,''));
            $(self).val($(self).val().replace(/\.{2,}/g,"."));
            $(self).val($(self).val().replace(".","$#$").replace(/\./g,"").replace("$#$","."));

            if($(self).val().split('.')[1] != undefined && $(self).val().split('.')[1].length > 2){
			  	$(self).val($(self).val().split('.')[0] +'.'+ $(self).val().split('.')[1].substring(0,2));
		    }
        }
    }else{
        $(self).val($(self).val().replace(/[^0-9.]/g,''));
        $(self).val($(self).val().replace(/\.{2,}/g,"."));
        $(self).val($(self).val().replace(".","$#$").replace(/\./g,"").replace("$#$","."));

        // 整数 金额超过 8 位
        if($(self).val() > 99999999.99){
            $(self).val($(self).val().substring(0,8));
        }

        if($(self).val().split('.')[1] != undefined && $(self).val().split('.')[1].length > 2){
			$(self).val($(self).val().split('.')[0] +'.'+ $(self).val().split('.')[1].substring(0,2));
	    }
    }
}

// 正整数 校验
function integerCheck(self){
	if(self.value.length==1){
		self.value=self.value.replace(/[^0-9]/g,'');
	}else{
		self.value=self.value.replace(/\D/g,'');
	}
}

// 1-100 小数 校验
function countCheck(self){
	if($(self).val() <= 100){
		if($(self).val().length==1){
	        $(self).val($(self).val().replace(/[^0-9]/g,''));
	    } else {
	        $(self).val($(self).val().replace(/[^0-9.]/g,''));
	        $(self).val($(self).val().replace(/\.{2,}/g,"."));
	        $(self).val($(self).val().replace(".","$#$").replace(/\./g,"").replace("$#$","."));

	        if($(self).val().split('.')[1] != undefined && $(self).val().split('.')[1].length > 2){
			  	$(self).val($(self).val().split('.')[0] +'.'+ $(self).val().split('.')[1].substring(0,2));
		    }
	    }
	}else{
		$(self).val('100');
	}
} 

// 分档次金额校验
function moneyLimit(self){

	// 如果当前是 最小值
	if($(self).hasClass('scopeMin')){
		var minValue = 0;
		var maxValue = $(self).parent().find('.scopeMax').val();
		if( $(self).parent().prev().find('.scopeMax').val() == undefined || $(self).parent().prev().find('.scopeMax').val() == null || $(self).parent().prev().find('.scopeMax').val() == ''){
			minValue = 0;
		}else{
			minValue = $(self).parent().prev().find('.scopeMax').val();
		}

		if( parseFloat($(self).val()) > parseFloat(maxValue)){  
			layer.msg('当前金额不能大于当前等级的最大值',{icon:2});
			$(self).val(parseFloat(maxValue));
		}

		if(parseFloat($(self).val()) < parseFloat(minValue)){
			layer.msg('当前金额不能小于上一等级的最大值',{icon:2});
			$(self).val(parseFloat(minValue));
		}
	}

	// 如果当前是 最大值
	if($(self).hasClass('scopeMax')){
		var minValue = $(self).parent().find('.scopeMin').val();
		var maxValue = 0;

		if( $(self).parent().next().find('.scopeMin').val() == undefined || $(self).parent().next().find('.scopeMin').val() == null || $(self).parent().next().find('.scopeMin').val() == ''){
			maxValue = $(self).val();
		}else{
			maxValue = $(self).parent().next().find('.scopeMin').val();
		}

		if( parseFloat($(self).val()) > parseFloat(maxValue)){  
			layer.msg('当前金额不能大于下一等级的最小值',{icon:2});
			$(self).val(parseFloat(maxValue));
		}

		if(parseFloat($(self).val()) < parseFloat(minValue)){
			layer.msg('当前金额不能小于当前等级的最小值',{icon:2});
			$(self).val(parseFloat(minValue));
		}
	}
} 