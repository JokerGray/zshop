reqAjaxAsync("cms_back/selecteAllScCmsSubscriptionType").done(function(re){
	var scCmsSubscriptionTypeList = re.data.scCmsSubscriptionTypeList || [];
	if(scCmsSubscriptionTypeList.length > 0) {
		var scriptionTypeListHtml = ''
		for(i = 0; i < scCmsSubscriptionTypeList.length; i++) {
			scriptionTypeListHtml += '<option value="' + scCmsSubscriptionTypeList[i].subscriptionTypeId + '">';
			scriptionTypeListHtml += scCmsSubscriptionTypeList[i].subscriptionTypeName;
			scriptionTypeListHtml += '</option>';
		}
		$('select[name="subscriptionType"]').append(scriptionTypeListHtml);
	}
});
reqAjaxAsync("cms_back/selectByParentCode", "{'parentCode':'0'}").done(function(re){
	var province = re.data || [];
	var provinceHtml = '';
	for(p=0; p<province.length; p++){
		provinceHtml += '<option value="' + province[p].code + '">';
		provinceHtml += province[p].areaname;
		provinceHtml += '</option>';
	}
	$('select[name="province"]').append(provinceHtml).attr('onchange','showCity()');
});
function showCity(){
	var pid = $('select[name="province"] option:selected').val();
	reqAjaxAsync("cms_back/selectByParentCode", "{'parentCode':'"+pid+"'}").done(function(re){
		var city = re.data || [];
		var cityHtml = '';
		if (city.length > 0){
			for(c=0; c<city.length; c++){
				cityHtml += '<option value="' + city[c].code + '">';
				cityHtml += city[c].areaname;
				cityHtml += '</option>';
			}
			$('select[name="city"]').html(cityHtml).css({'opacity':1});
		}else{
			$('select[name="city"]').html(cityHtml).css({'opacity':0});
		}
	});
}