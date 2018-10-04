var CONST_COMBOBOX="combobox";
var CONST_COMBOGRID="combogrid";
//load方法加载
function comboload(obj,pp,types,reload){
	if(pp.url){//异步加载
		var surl;
		if(pp.url.indexOf("?")==-1){
			surl=encodeURI(pp.url)+"?time="+new Date().getTime();
		}else{
			surl=encodeURI(pp.url)+"&time="+new Date().getTime();
		};
		var pdata=pp.data||{};
		if($(obj).val()){pdata.searchField=$(obj).val();}
		if($(obj).attr("ckvalue")){pdata.ckvalue=$(obj).attr("ckvalue");}
		$.ajax({
			type : 'POST',
			url :surl,  
			dataType:'json', 
			data :pdata,
			success : function(sdata){ 
				combotypedo(sdata,obj,pp,types,reload);
			},  
			error : function() {  
				alert('Err...');  
			}  
		});
	}else if(pp.data){//默认设置值 data填充
	//var pdata=JSON.parse(JSON.stringify(pp.data));//var pdata=JSON.stringify(pp.data);//alert(typeof($(pdata).serializeArray()));	
			combotypedo(pp.data,obj,pp,types,reload);
	}
}
//类型方法抽取
function combotypedo(sdata,obj,pp,types,reload){
	 //if(types==CONST_COMBOBOX){
		switch(types){
			case  CONST_COMBOBOX:
				if(pp.menu=="dropdown-menu"){
						dropcomboboxDataload(sdata,obj,pp);
					}else{
					
						comboboxDataload(sdata,obj,pp);
				}
			break;
			case  CONST_COMBOGRID:
				if(pp.menu=="dropdown-menu"){
					dropcombogridDataload(sdata,obj,pp,reload);
				}else{
					combogridDataload(sdata,obj,pp,reload);//执行下列表格绘制
				}
			break;
		default:
		alert('组件类型为定义');
		return;
	 }
}

function comboclassLoad(){
	 var comboboxs= $("input[class=lcc-combobox]");
			  $.each(comboboxs,function(infoIndex,info){
				  var options=$(info).attr("data-options");
				  //var str = '{'+options.replace("'","\"")+'}';
				 var str = "{"+$(info).attr("data-options")+"}";
				 var json = (new Function("return " + str))(); 
				// alert(json.valueField);
				//	var obj = $.parseJSON(str); // --> parse json 
				//var obj = 	JSON.parse(str)
		$(info).combobox(json);
	});
	 var combogrids= $("input[class=lcc-combogrid]");
			  $.each(combogrids,function(infoIndex,info){
				  var options=$(info).attr("data-options");
				  //var str = '{'+options.replace("'","\"")+'}';
				 var str = "{"+$(info).attr("data-options")+"}";
				 var json = (new Function("return " + str))(); 
				// alert(json.valueField);
				//	var obj = $.parseJSON(str); // --> parse json 
				//var obj = 	JSON.parse(str)
		$(info).combogrid(json);
	});
}

//jquery对象方法扩展combobox
/********************************************combobox********************************************************/
//方法动态生成  combobox选项发生变化时 执行的方法
$.fn.combobox = function(pp,url){
    // alert(pp.url);
	
	var obj=this;
	if(obj.attr("initState")==undefined){
		obj.attr("initState",0);
	};
	 if(pp=='reload'){
		 var str = "{"+obj.attr("data-options")+"}";
		var json = (new Function("return " + str))(); 
		if(url){json.url=url};
		//alert(url);
		comboload(obj,json,CONST_COMBOBOX,true);
	}else if(obj.attr("initState")==0 && (pp.url||pp.data)){
		obj.attr("initState",parseInt(obj.attr("initState"))+1);
		comboload(obj,pp,CONST_COMBOBOX);
	}else{
		//alert(1);
		$(obj).hide();//默认无数据 隐藏
	}
}

//内容填充  select
function comboboxDataload(sdata,obj,pp){
	var said="combo"+Math.random();
	if(obj.attr("id")==undefined)obj.attr("id","");
	var strHtml="<select id='"+obj.attr("id")+"' said='"+said+"' class='form-control m-b'  ";
	if(obj.attr("data-options")){
		strHtml += " data-options=\""+obj.attr("data-options")+"\" ";
	}
	
	if(obj.attr("name")){
		strHtml += " name=\""+obj.attr("name")+"\" ";
	}
	//alert(obj.attr("style"));
	//if(obj.attr("style")){
	//	strHtml += " style='"+obj.attr("style")+"' ";
	//}
	
	if(pp.onSelect){//绑定选择事件
		strHtml += " onchange='comboSelect(this)' ";
	};	
	if(pp.multiple){
		strHtml += " multiple='true' ";
	}
		strHtml += " >";
		$.each(sdata,function(infoIndex,info){
			if(info["selected"]){
				strHtml += "<option value='"+info[pp.valueField]+"' selected>"+info[pp.textField]+"</option>";
			}else if(obj.attr("value")==info[pp.valueField]){
				strHtml += "<option value='"+info[pp.valueField]+"' selected>"+info[pp.textField]+"</option>";
			}else{
				strHtml += "<option value='"+info[pp.valueField]+"'>"+info[pp.textField]+"</option>";
			}
		});
		strHtml += "</select>";
		obj.replaceWith(strHtml);
		//if(pp.onSelect){
			//var sfuncsels=(new Function("return " + pp.onSelect))(); 
			//$("select[aid='"+aid+"']").on("change",pp.onSelect);
		//}
	return strHtml;
}
//内容填充  drop select
function dropcomboboxDataload(sdata,obj,pp){
	//var daid="menuckall"+Math.random();
	if(obj.attr("id")==undefined)obj.attr("id","");
	var strHtml="";
	 strHtml+="<div class='input-group m-b' ";
	 if(obj.attr("style")){
		strHtml += " style=\""+obj.attr("style")+"\" ";
	}
	 strHtml += "><div class='input-group-btn'><button tabindex='-1' class='btn btn-white' type='button'>操作</button>";
     strHtml+="<button data-toggle='dropdown' id='combodropdown' class='btn btn-white dropdown-toggle' type='button'><span class='caret'></span></button><ul class='dropdown-menu' style='";
	 if(pp.width){strHtml+="width:"+parseInt(pp.width)+"px;";}
	 if(pp.height){strHtml+="height:"+parseInt(pp.height)+"px;";}
	 strHtml+="overflow:auto;'>";
	// strHtml+="<li><div class='checkbox i-checks' ><label><input daid='"+daid+"' type='checkbox' value='all'/><span>全选</span></label></div></li>";
		$.each(sdata,function(infoIndex,info){
			if(info["selected"]){
				strHtml += "<li><div class='checkbox i-checks' ><label><input type='checkbox' value='"+info[pp.valueField]+"' /><span>"+info[pp.textField]+"</span></label></div></li>";
			}else{
				strHtml += "<li><div class='checkbox i-checks' ><label><input type='checkbox' value='"+info[pp.valueField]+"'/><span>"+info[pp.textField]+"</span></label></div></li>";
			}
		});
	 strHtml+="<li><div class='hr-line-dashed'></div></li><li style='text-align:center;align:center;'><button class='btn btn-primary' onclick='checkdop(this)' >确定</button>";
	 strHtml+="<button class='btn btn-white' >取消</button></li></ul></div><input id='"+obj.attr("id")+"' type='text' class='form-control' ";
	 if(obj.attr("data-options")){
		strHtml += " data-options=\""+obj.attr("data-options")+"\" ";
	}
	
	 if(obj.attr("name")){
		strHtml += " name=\""+obj.attr("name")+"\" ";
	}
	
	 strHtml+=" /></div>";
	obj.replaceWith(strHtml);
	//$("input[type=checkbox]").iCheck({checkboxClass:"icheckbox_square-green"});
	/*$("input[daid='"+daid+"']").on('ifClicked', function(event){ //全选事件
					var ulobj=$(this).parent().parent().parent().parent().parent();
					//alert(ulobj.html());
					if($(this).parent().attr("class").indexOf("checked")==-1){
						$.each(ulobj.find("input[type=checkbox]"),function(infoIndex,info){
						if(infoIndex!=0){
							$(info).iCheck('check');
						}
						});
					}else{
						$.each(ulobj.find("input[type=checkbox]"),function(infoIndex,info){
						if(infoIndex!=0){
							$(info).iCheck('uncheck');
						}
					});
					}
			});*/
	$("input[type=checkbox]").iCheck({checkboxClass:"icheckbox_square-green"});
}

function comboSelect(sobj){
		var str = "{"+$(sobj).attr("data-options")+"}";
		var opts = (new Function("return " + str))(); 
		var index = sobj.selectedIndex; // 选中索引
		var recs={};//选中项对象
		recs[opts.valueField]=sobj.options[index].value;
		recs[opts.textField] =sobj.options[index].text;
		opts.onSelect(recs);
}


//多选确定操作
function checkdop(chklis){
	var chks=$(chklis).parent().parent();
	if(chks.children().length<=2)return;
	var chkstr="";
	var chkvalue="";
	for(var i=0;i<chks.children().length-2;i++){
		var liinput = chks.children().eq(i).find("input[type=checkbox]");
		var lispan = chks.children().eq(i).find("span");
		var lidiv = liinput.parent();
		//alert(lidiv.attr("class"));
		if(lidiv.attr("class").indexOf("checked")!=-1)
		{
			chkstr+=lispan.html()+",";
			chkvalue+=liinput.val()+",";
		}
	}
	chkstr=chkstr.substr(0,chkstr.length-1);
	chkvalue=chkvalue.substr(0,chkvalue.length-1);
	chks.parent().parent().children().eq(1).val(chkstr);
	chks.parent().parent().children().eq(1).attr("ckvalue",chkvalue);
}

/********************************************combobox end********************************************************/
//jquery对象方法扩展combogrid
/********************************************combogrid start********************************************************/
$.fn.combogrid = function(pp,url){
     //alert(pp.url);
	var obj=this;
	//alert(obj.attr("id"));
	if(obj.attr("initState")==undefined){
		obj.attr("initState",0);
	};
	 if(pp=='reload'){
		 var str = "{"+obj.attr("data-options")+"}";
		var json = (new Function("return " + str))(); 
		if(url){json.url=url;obj.removeAttr("data-options");binddataOptions(obj,json);};
		//alert(url);
		comboload(obj,json,CONST_COMBOGRID,true);
	}else if(obj.attr("initState")==0 && (pp.url||pp.data)){
		binddataOptions(obj,pp);
		obj.attr("initState",parseInt(obj.attr("initState"))+1);
		comboload(obj,pp,CONST_COMBOGRID);
	}else{
		//alert(1);
		$(obj).hide();//默认无数据 隐藏
	}
}
//绑定data-options 属性
function binddataOptions(obj,props){
	var dataOptions="";
	if(obj.attr("data-options")==undefined){
		for(o in props){
		//alert(o);
		//alert(typeof(props[o])=='object');
			dataOptions+=o+":"+getOptions(o,props[o])+",";
		}
		dataOptions=dataOptions.substr(0,dataOptions.length-1);
		//alert(dataOptions.replace(new RegExp(/(\")/g),'\''));
		obj.attr("data-options",dataOptions.replace(new RegExp(/(\")/g),'\''));
	}
}
//var gridcolumn=['field','title','width','height'];
function getOptions(p,prop){//拼接属性
	var pstr="";
	if(typeof(prop)=='object'){
		if(p=='columns'){
		pstr+="[[";
		for(var i=0;i<prop[0].length;i++){
			pstr+="{";
		for(o in prop[0][i]){
				//alert(o);
			pstr+="";
			if(o=="formatter"){
				pstr+=o+":"+prop[0][i][o]+",";
			}else{pstr+=o+":'"+prop[0][i][o]+"',";}
			
			pstr+="";
		}
		pstr=pstr.substr(0,pstr.length-1);
			pstr+="},";
		}
		pstr=pstr.substr(0,pstr.length-1);
		pstr+="]]";
		}
	}else{
		if(p=='onSelect'){
			//alert(prop);
			pstr=prop;
			}else
		pstr="'"+prop+"'";
	}
	return pstr;
}
//展示combogrid
function combogridtoogle(obj){
	if($(obj).parent().prev().attr("disabled")=="disabled" || $(obj).parent().prev().attr("readonly")){
	}else{
		$(obj).next().toggle();
	}
}
//选择tr
function combogridchoosetr(otr,textFieldIndex,idField){
			//alert($(otr).find("td").eq(0).html());
			var chvalue=$(otr).find("td").eq(textFieldIndex).html();
			var otrp=$(otr).parent().parent().parent();
			var oipt=otrp.parent().prev();//文本框
			oipt.val(chvalue);
			oipt.attr("ckvalue",idField);
		var str = "{"+oipt.attr("data-options")+"}";
		var opts = (new Function("return " + str))(); 
		var recs={};//选中项对象
		if(opts.onSelect){
			var fields= opts.columns[0];
			for(var i=0;i<fields.length;i++){
				var tdi=i;
				if(opts.showIndex){
					tdi++;
				}
				recs[fields[i].field]=$(otr).find("td").eq(tdi).html();
			}
			//var select_fun =new Function(opts.onSelect); 
			opts.onSelect(recs);
				//select_fun(recs);
		}
			otrp.toggle();
}
function dropcombogridchoosetr(otr){
	var checkb = $(otr).children().eq(0).find("input[type=checkbox]");
	checkb.click();
			//checkb[0].checked=!checkb[0].checked;
	var chkall = $(otr).parent().prev().find("input[type=checkbox]");
	if(!checkb[0].checked && chkall[0].checked){chkall[0].checked=false;};//有一个未选中 去掉全选
	var call=true;  //全选中 选中全选
	$.each($(otr).parent().find("input[type=checkbox]"),function(infoIndex,info){			
						if(!info.checked){
							call=false;
						};
	});
	if(call){
		chkall[0].checked=true;
	}
}
//获取展示属性所在表格列数
function combogridgetFIndex(textField,oths,showIndex,menuType){
	var fieldIndex=0;
	for(var i=0;i<oths.length;i++){
		if(oths[i].field==textField){
			fieldIndex=i;
			break;
		}
	}
	if(showIndex){//有序号列
		fieldIndex++;
	}
	if(menuType){//多选项类型
		fieldIndex++;
	}
	return fieldIndex;
}

function boxcheck(o){
	//alert(o.checked);
	var tbdy=$(o).parent().parent().parent().next();
	$.each(tbdy.find("input[type=checkbox]"),function(infoIndex,info){			
						info.checked =o.checked;
	});
	gridcheckdop(tbdy.find("input[type=checkbox]").eq(0));
}
function closecombogrid(o){
	//alert($(o).parent().parent().parent().parent().parent().html());
	$(o).parent().parent().parent().parent().parent().hide();
}

//获取 th
function combogridgetth(oths,showIndex,menu){
	var shtml="<tr>";
	if(menu){shtml+="<th width='30px'><input type='checkbox' id='gridall' onclick='boxcheck(this)' value=''/></th>";}
	if(showIndex){shtml+="<th width='30px'>序号</th>";}
	var mx=oths.length-1;
	for(var i=0;i<oths.length;i++){
		shtml+="<th ";
		if(oths[i].hide){
			//alert(oths[i].hide);
			shtml+=" style='display:none;' ";
		}
		if(oths[i].width){shtml+=" width='"+parseInt(oths[i].width)+"px' ";}
		if(oths[i].height){shtml+=" height='"+parseInt(oths[i].height)+"px' ";}
		shtml+=">";
		if(i==mx){
			shtml+="<a href='javascript:void(0)' onclick='closecombogrid(this)' style='float:right;color:#000;padding:0px;font-size:14px;'>x</a>";
		}
		shtml+=oths[i].title+"</th>";
	}
	shtml+="</tr>";
	return shtml;
}
//获取tbody内容
function combogridgettbody(sdata,pp,textFieldIndex,showIndex,menu,issearch,searchtxt){
	var shtml="";
	var textField=pp.textField;
	if(pp.searchField){textField=pp.searchField;}
	var sIndex=0;
	$.each(sdata,function(infoIndex,info){
			if(issearch && searchtxt!=""){
				var tfield =""+info[textField];
				if(containSearch(tfield,searchtxt,menu)){//tfield.indexOf(searchtxt)!=-1
					if(showIndex){//是否展示序号
					sIndex++;
					shtml+=combogridgettr(info,pp,textFieldIndex,sIndex,menu);//获取td	
					}else{
					shtml+=combogridgettr(info,pp,textFieldIndex,-1,menu);//获取td
					}
				}
			}else{
				if(showIndex){//是否展示序号
				sIndex++;
				shtml+=combogridgettr(info,pp,textFieldIndex,sIndex,menu);//获取td	
				}else{
				shtml+=combogridgettr(info,pp,textFieldIndex,-1,menu);//获取td
				}
			}
		});
		if(sIndex==0){
				shtml+="<tr><td colspan='30' align='center'>没有找到匹配的记录</td></tr>";	
		}
	return shtml;
}
function containSearch(field,search,menu){
	var ct=false;
	//if(menu){
		var sts =search.split(",");
		if(search.indexOf("，")!=-1){sts =search.split("，");}
		for(s in sts){
			if(field.indexOf(sts[s])!=-1 && sts[s]!=""){ct=true;return ct;};
		}
//	}else if(!menu && field.indexOf(search)!=-1){
	//	ct=true;
	//}
	return ct;
}
//获取 tr td
function combogridgettr(otr,pp,textFieldIndex,infoIndex,menu){
	var shtml="";
	var oths=pp.columns[0];
	var idField="";
	if(otr){
	idField=otr[pp.idField];
	if(menu){
		shtml+="<tr ondblclick='dropcombogridchoosetr(this)'>";
		shtml+="<td><input type='checkbox' value='"+textFieldIndex+"' onclick='gridcheckdop(this)' idField='"+idField+"'/><span></span></td>";
	}else{
		shtml+="<tr onclick='combogridchoosetr(this,\""+textFieldIndex+"\",\""+idField+"\")'>";
	}
	if(infoIndex>=0){
			shtml+="<td>"+infoIndex+"</td>";
		}
	
	for(var i=0;i<oths.length;i++){
		shtml+="<td "; 
		if(oths[i].hide){
			//alert(oths[i].hide);
			shtml+=" style='display:none;' ";
		}
		if(oths[i].formatter){
			shtml+=" >"+oths[i].formatter(otr[oths[i].field],otr)+"</td>";
		}else{
			shtml+=" >"+otr[oths[i].field]+"</td>";
		}
	}
	}
	shtml+="</tr>";
	return shtml;
}
//获得焦点展示
function combosearchfucos(otr){
	var tbodyobj=$(otr).next().find("tbody");
	var divtable=tbodyobj.parent().parent();
		var display =divtable.css('display');
		if(display == 'none'){
			divtable.show();
		}
}
//文本框点击 用于检测文本改变事件
function combosearchdown(otr){
	$(otr).attr("searchtxtchange",$(otr).val());
	
}
//文本框点击 用于检测文本改变事件
function combosearchup(otr){
	if($(otr).val()!=$(otr).attr("searchtxtchange")){
				//alert($(otr).val());
				combosearch(otr);
	}
}
//combogrid 文本搜索功能
function combosearch(otr){
	$(otr).combogrid("reload");
}

//下拉表格绘制
function combogridDataload(sdata,obj,pp,reload){
	var showIndex=false;
	if(pp.showIndex){showIndex=pp.showIndex;}
	var textFieldIndex =combogridgetFIndex(pp.textField,pp.columns[0],showIndex);
	var issearch=false;
	if(reload){issearch=true;};
	if(issearch){//检索表格 重新绘制表格tbody
		var tbodyobj=$(obj).next().find("tbody");
		var searchtxt=$(obj).val();
		//alert(tbodyobj.html());
		tbodyobj.html("");
		tbodyobj.html(combogridgettbody(sdata,pp,textFieldIndex,showIndex,false,issearch,searchtxt));
	}else{
	if(obj.attr("id")==undefined)obj.attr("id","");
	var strHtml="<div class='input-group'";
		if(obj.attr("style")){
		strHtml += " style=\""+obj.attr("style")+"\" ";
	}
	if(obj.attr("name")){
		strHtml += " name=\""+obj.attr("name")+"\" ";
	}
	strHtml += "><input id='"+obj.attr("id")+"' type='text' class='form-control' onkeydown='combosearchdown(this)' onfocus='combosearchfucos(this)' onkeyup='combosearchup(this)' ";
	 if(obj.attr("data-options")){
		strHtml += " data-options=\""+obj.attr("data-options")+"\" ";
	}
	if(obj.val()){
		strHtml += " value=\""+obj.val()+"\" ";
	}
		strHtml += " /><div class='input-group-btn'><button  class='btn btn-white dropdown-toggle' type='button' onclick='combogridtoogle(this)'><span class='caret'></span></button>";
	strHtml+="<div class='dropdown-menu pull-right' style='";
	 if(pp.panelWidth){strHtml+="width:"+parseInt(pp.panelWidth)+"px;";}
	 if(pp.panelHeight){strHtml+="height:"+parseInt(pp.panelHeight)+"px;";}
	 strHtml+="overflow:auto;'><table class='table table-bordered table-hover' ><thead>";
	 strHtml+=combogridgetth(pp.columns[0],showIndex);//获取th
	 strHtml+="</thead><tbody >";
			strHtml+=combogridgettbody(sdata,pp,textFieldIndex,showIndex,false);
		/*$.each(sdata,function(infoIndex,info){
			if(showIndex){//是否展示序号
			strHtml+=combogridgettr(info,pp,textFieldIndex,infoIndex);//获取td	
			}else{
			strHtml+=combogridgettr(info,pp,textFieldIndex);//获取td
			}
		});*/
	 strHtml+="</tbody></table></div></div></div>";
	obj.replaceWith(strHtml);
	}
}

//下拉表格多选绘制
function dropcombogridDataload(sdata,obj,pp,reload){
	var showIndex=false;
	if(pp.showIndex){showIndex=pp.showIndex;}
	var menuType=false;
	if(pp.menu){menuType=true;}
	var textFieldIndex =combogridgetFIndex(pp.textField,pp.columns[0],showIndex,menuType);
	var issearch=false;
	if(reload){issearch=true;};
	if(issearch){//检索表格 重新绘制表格tbody
		var tbodyobj=$(obj).next().find("tbody");
		var searchtxt=$(obj).val();
		//alert(tbodyobj.html());
		tbodyobj.html("");
		tbodyobj.html(combogridgettbody(sdata,pp,textFieldIndex,showIndex,menuType,issearch,searchtxt));
	}else{
	if(obj.attr("id")==undefined)obj.attr("id","");
	var strHtml="<div class='input-group'";
		if(obj.attr("style")){
		strHtml += " style=\""+obj.attr("style")+"\" ";
	}
	if(obj.attr("name")){
		strHtml += " name=\""+obj.attr("name")+"\" ";
	}
	strHtml += "><input id='"+obj.attr("id")+"' type='text' class='form-control' onkeydown='combosearchdown(this)' onfocus='combosearchfucos(this)' onkeyup='combosearchup(this)' ";
	 if(obj.attr("data-options")){
		strHtml += " data-options=\""+obj.attr("data-options")+"\" ";
	}
	if(obj.val()){
		strHtml += " value=\""+obj.val()+"\" ";
	}
		strHtml += " /><div class='input-group-btn'><button  class='btn btn-white dropdown-toggle' type='button' onclick='combogridtoogle(this)'><span class='caret'></span></button>";
	strHtml+="<div class='dropdown-menu pull-right' style='";
	 if(pp.panelWidth){strHtml+="width:"+parseInt(pp.panelWidth)+"px;";}
	 if(pp.panelHeight){strHtml+="height:"+parseInt(pp.panelHeight)+"px;";}
	 strHtml+="overflow:auto;'><table class='table table-bordered table-hover' ><thead>";
	 strHtml+=combogridgetth(pp.columns[0],showIndex,menuType);//获取th
	 strHtml+="</thead><tbody >";
			strHtml+=combogridgettbody(sdata,pp,textFieldIndex,showIndex,menuType);
		/*$.each(sdata,function(infoIndex,info){
			if(showIndex){//是否展示序号
			strHtml+=combogridgettr(info,pp,textFieldIndex,infoIndex);//获取td	
			}else{
			strHtml+=combogridgettr(info,pp,textFieldIndex);//获取td
			}
		});*/
	 strHtml+="</tbody></table></div></div></div>";
	obj.replaceWith(strHtml);
	//<div class='text-center' style='margin-bottom:10px;'><button class='btn btn-primary' onclick='gridcheckdop(this)' >确定</button><button onclick='gridcheckcance(this)' class='btn btn-white' >取消</button></div>
	//$("input[type=checkbox]").iCheck({checkboxClass:"icheckbox_square-green"});
	
	}
}

//多选确定操作
function gridcheckdop(btnck){
	var dtbody=$(btnck).parent().parent().parent();//获取tbody
	//alert(dtable.html());
	var chkstr="";
	var chkvalue="";
	//alert(chks.children().eq(1).html());
	var tchks=dtbody.find("input[type=checkbox]");
	$.each(tchks,function(infoIndex,info){			
		if(info.checked){
			var otr=$(info).parent().parent();
			chkstr+= otr.find("td").eq(parseInt(info.value)).html()+",";
			chkvalue+=$(info).attr("idfield")+",";			
		}
	});
	chkstr=chkstr.substr(0,chkstr.length-1);
	chkvalue=chkvalue.substr(0,chkvalue.length-1);
	//$("#"+oid).val(chkstr);
	//$("#"+oid).attr("ckvalue",chkvalue);
	var ipt = dtbody.parent().parent().parent().prev();
	ipt.val(chkstr);
	ipt.attr("ckvalue",chkvalue);
	
	var str = "{"+ipt.attr("data-options")+"}";
	var opts = (new Function("return " + str))(); 
	var rec ={};
	rec.chkstr =chkstr;
	rec.chkvalue =chkvalue;
	opts.onSelect(rec);
}
function gridcheckcance(btnck){
	var divtable=$(btnck).parent().parent();
	var display =divtable.css('display');
		divtable.hide();
}
/********************************************combogrid end********************************************************/

// input  .lcc-combobox样式自动加载方式
// input  .lcc-grid样式自动加载方式
$(function(){
		comboclassLoad();	
		
});