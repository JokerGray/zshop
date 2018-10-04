(function($){
    var page = 1;
    var rows = 15;
    var locked = true;
    var userNo = yyCache.get("userno") || "";
    var username = yyCache.get('username') || "";
    var oldId = sessionStorage.getItem("id") || ""; //id 
	var reviewId = sessionStorage.getItem("reviewId") || ""; //reviewId
    var tableName = sessionStorage.getItem("tableName") || ""; //tableName
    var reviewUrl = sessionStorage.getItem("reviewUrl") || ""; //url
    var reviewType = sessionStorage.getItem("reviewType") || ""; ////1-审核 2-查看 3-复审
    var opinion = sessionStorage.getItem("reviewOpinion") || "";
    var reviewStatu = sessionStorage.getItem("reviewStatu") || ""; //是否通过 1-通过 2-不通过
    var opinions = sessionStorage.getItem("reviewOpinion") || ""; //审核意见
    var reviewData = JSON.parse(sessionStorage.getItem("reviewData")); //整页数据
    var reviewsize = sessionStorage.getItem("countsize"); //总页数
    var reviewPag = sessionStorage.getItem('reviewPag'); //当前是第几页
    var reviewindex = sessionStorage.getItem('reviewindex'); //当前索引
    var reviewtitle = sessionStorage.getItem('reviewtitle') || ""; //标题
    var reviewplate = sessionStorage.getItem('reviewplate') || ""; //搜索板块
    var reviewbegin = sessionStorage.getItem('reviewbegin') || ""; //开始时间
    var reviewend = sessionStorage.getItem('reviewend') || ""; //结束时间
    var reviewcity = sessionStorage.getItem('reviewcity') || ""; //大板块属于哪一个
    var isfirst=0;//是否初次进入
    var inss;//之后的索引
    var pagese;//之后的页码
    var newdata;//下一页的数据
    var pid = '';
    var USER_URL = {
        RESOURLIST : 'operations/confirmAudit',//(审核)
        NORESOURLIST : 'operations/getContentReviewNotAuditedPage' //(未审核查询) 1 是第一个, 2是第二个, 3是第三个 (文字-1 图片-2 视频-3)
    };
	//判断是否全民炫业务
	if(tableName == "sc_dazzle_dazzle_info"){
		$(".noreomtype").show();
		$("#toptime").hide();
		//$("#content").append("<video src="+reviewUrl+" width='100%' height='100%' autoplay='autoplay' controls></video>");
	}else{
		$(".noreomtype").hide();
		$("#toptime").hide();
		//$("#content").append('<iframe id="articFrame" name="articFrame" src="'+reviewUrl+'" frameborder="0" width="100%" height="100%"></iframe>')
	}
    var layer = layui.layer;
    var table = layui.table;
    layui.use('form', function(){
        form = layui.form;
        if(reviewType == 1){
            $("#nextBtn").show();
            $(".detail_box").find("#rightConsave").show();
            $(".detail_box").find("#rightCon").hide();
            //全民炫业务
			if(tableName == "sc_dazzle_dazzle_info"){
				$(".noreomtype").show();
				$("#toptime").hide();
			}else{
				$(".noreomtype").hide();
				$("#toptime").hide();
			}
        }else if(reviewType == 2){
            $("#nextBtn").show();
            $(".detail_box").find("#rightCon").show();
            $(".detail_box").find("#rightConsave").hide();
            $("#reviewOpinion1").val(opinion);
            if(reviewStatu==1){
                $("#passResult").text("审核通过");
            }else if(reviewStatu==2){
                $("#passResult").text("审核未通过");
            }
            //全民炫业务
			$(".noreomtype").hide();
			$("#toptime").hide();
        }else if(reviewType == 3){
        	//全民炫业务
			$(".noreomtype").hide();
			$("#toptime").hide();
			
            $("#nextBtn").hide();
            $(".detail_box").find("#rightConsave").show();
            $(".detail_box").find("#rightCon").hide();
            if(reviewStatu==1){
                document.getElementById('pass').checked=true;
                document.getElementById('nopass').checked=false;
                $("#noreom").hide();                
            }
            if(reviewStatu==2){
                document.getElementById('pass').checked=false;
                document.getElementById('nopass').checked=true;
                $(".noreom").show();
                if(opinions.indexOf("色情")!=-1){
                    document.getElementById('noResi').checked=true;
                    $("#reviewOpinion").val("色情");
                }else if(opinions.indexOf("暴力")!=-1){
                    document.getElementById('noResi1').checked=true;
                    $("#reviewOpinion").val("暴力");
                }else if(opinions.indexOf("政治")!=-1){
                    document.getElementById('noResi2').checked=true;
                    $("#reviewOpinion").val("政治");
                }else if(opinions.indexOf("侵权")!=-1){
                    document.getElementById('noResi3').checked=true;
                    $("#reviewOpinion").val("侵权");
                }else if(opinions.indexOf("广告")!=-1){
                    document.getElementById('noResi4').checked=true;
                    $("#reviewOpinion").val("广告");
                }else{
                    document.getElementById('noResi5').checked=true;
                    $("#reviewOpinion").val(opinions);
                }
            }
            form.render();
        }
    })

	$("#articFrame").attr("src",reviewUrl);
    //返回
    $("#backBtn").click(function(){
        var onthisid = $(window.parent.document).find(".top_tab li[class*='layui-this']").children("i.layui-icon").attr("data-id");
        $(window.parent.document).find("iframe[data-id='"+onthisid+"']").attr("src","page/content_audit_new/content_audit_new.html?v=" + new Date().getMilliseconds());//切换后刷新框架
        // window.top.admin.current("content_audit_new/content_audit_new.html?v=" + new Date().getMilliseconds());
    });
    $("#backBtn1").click(function(){
        var onthisid = $(window.parent.document).find(".top_tab li[class*='layui-this']").children("i.layui-icon").attr("data-id");
        $(window.parent.document).find("iframe[data-id='"+onthisid+"']").attr("src","page/content_audit_new/content_audit_new.html?v=" + new Date().getMilliseconds());//切换后刷新框架
        window.top.admin.current("content_audit_new/content_audit_new.html?v=" + new Date().getMilliseconds());
    });

    //通过不通过切换时的交互
    form.on('radio(radios)', function(data){
        var val= data.value;
        if(val == 2){
        	//全民炫业务
			if(tableName == "sc_dazzle_dazzle_info"){
				$(".noreomtype").hide();
				$("#toptime").hide();
			}else{
				$(".noreomtype").hide();
				$("#toptime").hide();
			}
        	$("#toptime").hide();
            $(".noreom").show();
            document.getElementById('noResi').checked=true;
            var tex = $("input[name='reson']").eq(0).val();
            $("#reviewOpinion").val(tex);
        }else if(val == 1){
        	//全民炫业务
			if(tableName == "sc_dazzle_dazzle_info"){
				$(".noreomtype").show();
				$("#toptime").hide();
			}else{
				$(".noreomtype").hide();
				$("#toptime").hide();
			}
            $(".noreom").hide();
            $("#reviewOpinion").val("");
            //置顶时间
            if($("input[name='istop']").is(':checked')) {
            	$("#toptime").show();
			}
        }
        form.render();
    });
	//置顶复选框选中切换
	form.on('checkbox(istop)', function(data){
        var a = data.elem.checked;
		if(a == true){
			$("#toptime").show();
		}else{
			$("#toptime").hide();
		}
		form.render();
    });

    //不予通过原因切换
    form.on('radio(resions)', function(data){
        var val= data.value;
        $("#reviewOpinion").val(val);
    });
	
    //审核
    $("#saveBtn").click(function(){
        var status = $("input[name='sex']:checked").val();
        var val = $.trim($("#reviewOpinion").val());
       	/*全民炫业务开始*/
        var audittype = $("input[name='audittype']:checked").val();
        var topBegin;
        var topEnd;
        var istop;
        if($("input[name='istop']").is(':checked')) {
    		istop = 1;
    		topBegin = $("#start_time").val();
    		topEnd = $("#end_time").val();
		}else{
			istop = 0;
			topBegin = $("#start_time").val("");
			topEnd = $("#end_time").val("");
		}
		if(tableName == "sc_dazzle_dazzle_info"){
			if(istop == 1){
				var param = {
		            id:oldId,
		            reviewId:reviewId,
		            tableName:tableName,
		            status:status, // 审核状态 0-未审核 1-审核已通过 2-审核未通过
		            reviewOpinion:val, // 审核意见
		            userName:username, //审核人名称
		            auditType:audittype,  //审核类型
		           	isTop:istop,    //是否置顶
		           	topBegin:topBegin,
		           	topEnd:topEnd
	        	}
			}else{
				var param = {
		            id:oldId,
		            reviewId:reviewId,
		            tableName:tableName,
		            status:status, // 审核状态 0-未审核 1-审核已通过 2-审核未通过
		            reviewOpinion:val, // 审核意见
		            userName:username, //审核人名称
		            auditType:audittype,  //审核类型
		           	isTop:istop    //是否置顶
		        }
			}
			/*全民炫业务结束*/
		}else{
			var param = {
	            id:oldId,
	            reviewId:reviewId,
	            tableName:tableName,
	            status:status, // 审核状态 0-未审核 1-审核已通过 2-审核未通过
	            reviewOpinion:val, // 审核意见
	            userName:username //审核人名称
	        }
		}		
        
        if(locked){
            locked = false;
            reqAjaxAsync(USER_URL.RESOURLIST,JSON.stringify(param)).done(function(res) {
                if (res.code == 1) {
                    layer.msg(res.msg);
                    setTimeout(function(){
                        var onthisid = $(window.parent.document).find(".top_tab li[class*='layui-this']").children("i.layui-icon").attr("data-id");
                        $(window.parent.document).find("iframe[data-id='"+onthisid+"']").attr("src","page/content_audit_new/content_audit_new.html?v=" + new Date().getMilliseconds());//切换后刷新框架
                        // window.top.admin.current("content_audit_new/content_audit_new.html?v=" + new Date().getMilliseconds());
                    },500);
                }else{
                    layer.msg(res.msg);
                    locked = true;
                }
            });
        }
    });

    //审核并下一个
    $("#nextBtn").click(function(){
        var reviewData = JSON.parse(sessionStorage.getItem("reviewData")); //整页数据
        var reviewindex = sessionStorage.getItem('reviewindex'); //当前索引
        var reviewPag = sessionStorage.getItem('reviewPag'); //当前是第几页
        var status = $("input[name='sex']:checked").val();
        var val = $.trim($("#reviewOpinion").val());
        
        var audittype = $("input[name='audittype']:checked").val();
        var topBegin;
        var topEnd;
        var istop;
        if($("input[name='istop']").is(':checked')) {
    		istop = 1;
    		topBegin = $("#start_time").val();
    		topEnd = $("#end_time").val();
		}else{
			istop = 0;
			topBegin = $("#start_time").val("");
			topEnd = $("#end_time").val("");
		}
        inss =reviewindex;
        var id;
        if(isfirst==0) { //初次进入
        	id = oldId;
            inss = parseInt(reviewindex)+1;
            var count = reviewData.length;
        }else if(isfirst==2){ //下一页
            var count = reviewData.length-1;
            id = reviewData[inss].id;
        }else{
            var count = reviewData.length-1;
            id = reviewData[inss].id;
        }
        if(tableName == "sc_dazzle_dazzle_info"){
			if(istop == 1){
				var param = {
		            id:oldId,
		            reviewId:reviewId,
		            tableName:tableName,
		            status:status, // 审核状态 0-未审核 1-审核已通过 2-审核未通过
		            reviewOpinion:val, // 审核意见
		            userName:username, //审核人名称
		            auditType:audittype,  //审核类型
		           	isTop:istop,    //是否置顶
		           	topBegin:topBegin,
		           	topEnd:topEnd
	        	}
			}else{
				var param = {
		            id:oldId,
		            reviewId:reviewId,
		            tableName:tableName,
		            status:status, // 审核状态 0-未审核 1-审核已通过 2-审核未通过
		            reviewOpinion:val, // 审核意见
		            userName:username, //审核人名称
		            auditType:audittype,  //审核类型
		           	isTop:istop    //是否置顶
		        }
			}
			/*全民炫业务结束*/
		}else{
			var param = {
	            id:id,
	            reviewId:reviewId,
	            tableName:tableName,
	            status:status, // 审核状态 0-未审核 1-审核已通过 2-审核未通过
	            reviewOpinion:val, // 审核意见
	            userName:username //审核人名称
	        }
		}	
        if(locked){
		    locked = false;
		    reqAjaxAsync(USER_URL.RESOURLIST,JSON.stringify(param)).done(function(res) {
			    if (res.code == 1) {
				    layer.msg(res.msg);
			        setTimeout(function(){
			        	locked=true;
			            console.log("count:"+count+",inss:"+inss)
			           	if(inss<count){
				            $("#articFrame").attr("src",reviewData[inss].reviewUrl);
				            inss++;
				            sessionStorage.setItem('reviewindex',inss);
				            isfirst = 1;
			            }else if(inss==count){
			                isfirst = 2;
			                sessionStorage.setItem('reviewindex',inss);
			                //调用下一页
			            	var param = {
			                    page :parseInt(reviewPag)+1,
			                    rows :15,
			                    publisherTitle :reviewtitle,
			                    tableName : reviewplate,//板块表名
			                    plateType :reviewcity,//板块名称
			                    createTimeStart:reviewbegin,
			                    createTimeEnd:reviewend
			                }
			                reqAjaxAsync(USER_URL.NORESOURLIST, JSON.stringify(param)).done(function (res) {
			                    if (res.code == 1) {
			                        if(res.data.length==0){
			                            layer.msg("没有下一条了哟");
			                            $("#nextBtn").attr("disabled",true);
			                            $("#nextBtn").css("background","#dfdfdf");
			                            $("#nextBtn").css("cursor","not-allowed");
			                            sessionStorage.setItem("oldreviewPag",1)
			                        }else{
			                            sessionStorage.setItem('reviewPag',parseInt(reviewPag)+1);
			                            $("#articFrame").attr("src",res.data[0].reviewUrl);
			                            sessionStorage.setItem('reviewindex',0); //当前索引
			                            sessionStorage.setItem('reviewData',JSON.stringify(res.data));
			                            isfirst = 1;
			                        }
			                    }else{
			                        layer.msg(res.msg);
			                    }
			                })
			            }
			        },500);
		
		            $("#reviewOpinion").val("");
		            $(".noreom").hide();
		            document.getElementById('pass').checked=true;
		            document.getElementById('nopass').checked=false;
		            $("#pass").next(".layui-unselect").addClass("layui-form-radioed");
		            $("#nopass").next(".layui-unselect").removeClass("layui-form-radioed");
		            form.render();
		        }else{
		            layer.msg(res.msg);
		            locked = true;
		        }
	        });
        }
    });

	//日期选择
	/*var laydate = layui.laydate;
	var nowTime = new Date().valueOf();
	var start = laydate.render({
        elem: '#start_time',
        type: 'datetime',
        min: nowTime,
        btns: ['clear', 'confirm'],
        choose: function(datas){  
             end.min = datas; //开始日选好后，重置结束日的最小日期  
             end.start = datas //将结束日的初始值设定为开始日  
        } 
    });
    var end = laydate.render({
        elem: '#end_time',
        type: 'datetime',
        max: "2099-12-31 23:29:59",
        choose: function(datas){  
            start.max = datas; //结束日选好后，重置开始日的最大日期  
        }  
    });*/
	layui.use('laydate', function(){
        var laydate = layui.laydate;
        var endDate= laydate.render({
            elem: '#end_time',//选择器结束时间
            type: 'datetime',
            min:"1970-1-1",//设置min默认最小值
            done: function(value,date){
                startDate.config.max={
                    year:date.year,
                    month:date.month-1,//关键
                    date: date.date,
                    hours: 0,
                    minutes: 0,
                    seconds : 0
                }
            }
        });
        //日期范围
        var startDate=laydate.render({
            elem: '#start_time',
            type: 'datetime',
            max:"2099-12-31",//设置一个默认最大值
            done: function(value, date){
                endDate.config.min ={
                    year:date.year,
                    month:date.month-1, //关键
                    date: date.date,
                    hours: 0,
                    minutes: 0,
                    seconds : 0
                };
            }
        });

    });

})(jQuery);