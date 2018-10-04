(function($){
    var page = 1;
    var rows = 10;
    var USER_URL = {       
        MERCHANT :'operations/merchantDataCopy',//(商户)
        SHOP :'operations/shopMerchantDataCopy' //(店铺)
    };
    layui.use('form', function(){
        form = layui.form;
    })
	$('#submit1').click(function(){
		var merchantId =$('#merchantId').val()||'';
		var destmerchantId=$('#destmerchantId').val()||'';
		
		var parm={
			merchantId :merchantId ,
			destmerchantId:destmerchantId
		}
		reqAjaxAsync(USER_URL.MERCHANT,JSON.stringify(parm)).done(function(res){
			console.log(res)
			
			$('#contentDetial').text(res.msg);
		});
	});
	
	$('#submit2').click(function(){
		var srcShopId=$('#srcShopId').val()||'';
		var destShopId=$('#destShopId').val()||'';
		
		var parms={
			srcShopId:srcShopId,
			destShopId:destShopId
		}
		reqAjaxAsync(USER_URL.SHOP,JSON.stringify(parms)).done(function(res){
			console.log(res)
			
			$('#contentDetial').text(res.msg);
		});
	});
	
})(jQuery);