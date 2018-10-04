(function($) {
		const   GETBASERESOURCELIST = 'operations/getBaseResourceList',//资源列表
				UPDATEVASERESOURCE = 'operations/updateBaseResource'//保存资源
		var parms ="";
   		var res =reqAjax(GETBASERESOURCELIST,parms);
   		var data = res.data;
   		var oss = data[0].resourceValue;
   		var resourceKey = data[0].resourceKey;
   		var key = data[1].resourceKey;
   		var value = data[1].resourceValue;
   		$('#one').html(resourceKey);
   		$('#oss').val(oss);
   		$('#two').html(key);
   		$('#resource').val(value);
   		
   		$('#add-users').on('click',function(){
   			var idsvalue = "1,2";
   			var oss = $('#oss').val();
   			var resource = $('#resource').val();
   			var resourceValues = [];
   			resourceValues.push(oss);
   			resourceValues.push(resource)
   			resourceValues = resourceValues.join(',')
   			var param = "{'idsvalue':'" + idsvalue + "','resourceValues':'" + resourceValues + "'}";
	 	 	var res = reqAjax(UPDATEVASERESOURCE, param);
	 	 	layer.msg(res.msg);
   		})
	
})(jQuery)