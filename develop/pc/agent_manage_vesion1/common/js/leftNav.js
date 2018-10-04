function navBar(strData) {
	var data;
	var pull = '<i class="fa fa-angle-right pull-right"></i>'
	if(typeof(strData) == "string") {
		var data = JSON.parse(strData); //部分用户解析出来的是字符串，转换一下
	} else {
		data = strData;
	};
	data = data.data;
	var ulHtml = "";
	ulHtml += '<ul class="sidebar-menu" style="width:208px">';
	for(var a = 0; a < data.length; a++) {
		ulHtml += '<li class="treeview">'
		ulHtml += '<a href="#">'
		ulHtml += '<i class="fa fa-share"></i> <cite>' + data[a].name + '</cite>'
		ulHtml += pull;
		ulHtml += '</a>'
		if(data[a].childrenList != null) {
			var bData = data[a].childrenList
			ulHtml += '<ul class="treeview-menu">';
			for(var b = 0; b < bData.length; b++) {
				ulHtml += '<li class="treeview">'
				ulHtml += '<a href="#" data-url=' + bData[b].url + '>'
				ulHtml += '<i class="fa fa-share"></i> <cite>' + bData[b].name + '</cite>'
				if(bData[b].childrenList != null) {
					ulHtml += pull;
					ulHtml += '</a>'
					var cData = bData[b].childrenList;
					ulHtml += '<ul class="treeview-menu">';
					for(var c = 0; c < cData.length; c++) {
						ulHtml += '<li class="treeview">'
						ulHtml += '<a href="#" data-url=' + cData[c].url + '>'
						ulHtml += '<i class="fa fa-share"></i> <cite>' + cData[c].name + '</cite>'
						if(cData[c].childrenList != null) {
							ulHtml += pull;
							ulHtml += '</a>'
							var dData = cData[c].childrenList;
							ulHtml += '<ul class="treeview-menu">';
							for(var d = 0; c < cData.length; c++) {
								ulHtml += '<li class="treeview">'
								ulHtml += '<a href="#" data-url=' + dData[d].url + '>'
								ulHtml += '<i class="fa fa-share"></i> <cite>' + dData[d].name + '</cite>'
								if(dData[d].childrenList != null) {
									ulHtml += pull;
									ulHtml += '</a>'
									var eData = dData[d].childrenList;
									ulHtml += '<ul class="treeview-menu">';
									for(var e = 0; e < dData.length; e++) {
										ulHtml += '<li><a href="#" data-url=' + eData[e].url + '><i class="fa fa-circle-o"></i><cite>' + eData[e].name + '</cite></a>';
									}

									ulHtml += '</li>';
									ulHtml += '</ul>';
								}

							}

							ulHtml += '</li>';
							ulHtml += '</ul>';
						}

					}
					ulHtml += '</li>';
					ulHtml += '</ul>';
				}

			}

			ulHtml += '</li>';
			ulHtml += '</ul>';
		}
	}

	ulHtml += '</li>';
	ulHtml += '</ul>';

	return ulHtml;
}