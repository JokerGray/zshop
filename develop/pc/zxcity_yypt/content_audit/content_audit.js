$(function () {
    var page = 1;
    var rows = 10;
    var USER_URL = {
        SYSTEMLIST: 'operations/reviewList' //(查询列表)
    };

     function getdetail(res){
         var sHtml ="";
         if(res.code == 1){
             for(var i=0;i<res.data.length;i++){
                 var row = res.data[i];
                 sHtml += '<tr data-userid="' + row.userId + '" data-id="' + row.id + '" data-reviewOpinion="' + row.reviewOpinion + '">' +
                            '<td>' + (i+1) + '</td>'
                        if(row.type == 1){ //文字-1 图片-2 视频-3
                            sHtml += '<td data-type="' + row.type + '">' + '文字' + '</td>';
                        }else if(row.type == 2){
                            sHtml += '<td data-type="' + row.type + '">' + '图片' + '</td>';
                        }else if(row.type == 3){
                            sHtml += '<td data-type="' + row.type + '">' + '视频' + '</td>';
                        };
                 sHtml += '<td class="pTitle">' + row.publisherTitle + '</td>' +
                          '<td class="modalUrl" data-reviewId="' + row.reviewId + '" data-url="' + row.reviewUrl + '">' + row.tableName + '</td>'
                        if(row.status == 0){ //审核状态 0-未审核 1-审核已通过 2-审核未通过
                            sHtml += '<td class="status blue" data-statu="' + row.status + '">' + '未审核' + '</td>';
                        }else if(row.status == 1){
                            sHtml += '<td class="status green" data-statu="' + row.status + '">' + '已通过' + '</td>';
                        }else if(row.status == 2){
                            sHtml += '<td class="status red" data-statu="' + row.status + '">' + '未通过' + '</td>';
                        };
                        if(row.isTipoff == 0){ //是否举报 0-未举报 1-已举报
                            sHtml += '<td data-isTipoff="' + row.isTipoff + '">' + '正常' + '</td>';
                        }else if(row.isTipoff == 1){
                            sHtml += '<td data-isTipoff="' + row.isTipoff + '">' + '举报' + '</td>';
                        };
                        if(row.tipoffStatus==0){ //举报处理状态0-举报未处理 1-举报已处理
                            sHtml += '<td data-tipoffStatus="' + row.tipoffStatus + '">' + '未处理' + '</td>';
                        }else if(row.tipoffStatus==1){
                            sHtml += '<td data-tipoffStatus="' + row.tipoffStatus + '">' + '已处理' + '</td>';
                        }else{
                            sHtml += '<td data-tipoffStatus="' + row.tipoffStatus + '">' + '--' + '</td>';
                        }
                 sHtml += '<td>' + row.userId + '</td>' +
                          '<td>' + row.createTime + '</td>'
                            if(row.status == 1){
                                sHtml +=  '<td class="tdauti"><button class="btn btn-info audi" data-toggle="modal" data-target="#modularAudit" disabled="disabled" style="border:0;background-color:#eaeaea;color:#000">已审核</button></td>'
                            }else if(row.status == 2){
                                sHtml +=  '<td class="tdauti"><button class="btn btn-info audi" data-toggle="modal" data-target="#modularAudit" disabled="disabled" style="border:0;background-color:#eaeaea;color:#000">已审核</button></td>'
                            }else{
                                sHtml +=  '<td class="tdauti"><button class="btn btn-info audi" data-toggle="modal" data-target="#modularAudit">审核</button></td>'
                            }

                 sHtml +=  "<td style='display:none;'>"+row.fieldStatusName+"</td>" +
                            "<td style='display:none;'>"+row.publisherUserCode+"</td>" +
                            "<td style='display:none;'>"+row.primaryName+"</td>" +
                     '</tr>'
             }
             $("#auditBody").html(sHtml);
         }else{
             layer.msg(res.msg);
         }
     }


     //获取初始化数据
        function getAjax(){
            var publisherTitle = $.trim($("#jurisdiction-name").val()); //标题
            var status = $("#searchA").find("option:selected").val();// 审核状态
            var isTipoff = $("#searchB").find("option:selected").val(); //举报状态
            var dataList = {
                page: 1,
                rows: 10,
                publisherTitle: publisherTitle,
                status: status,
                isTipoff :isTipoff
            };
            var res = reqAjax(USER_URL.SYSTEMLIST, JSON.stringify(dataList));
            var layer = layui.laypage;
            //模拟渲染
            var render = function(data, curr){
                var arr = []
                    ,thisData = res.data;
                layui.each(thisData, function(index, item){
                    arr.push('<li>'+ item +'</li>');
                });
                return arr.join('');
            };
            //调用分页
            layer({
                cont: 'paging-box'
                ,first: false
                ,last: false
                ,prev: '<' //若不显示，设置false即可
                ,next: '>'
                ,pages: Math.ceil(res.total/rows) //得到总页数
                ,total:res.total
                ,curr: function(){ //通过url获取当前页，也可以同上（pages）方式获取
                    var page = location.search.match(/page=(\d+)/);
                    return page ? page[1] : 1;
                }()
                ,jump: function(obj,first){
                    var dataList = {
                        page: obj.curr,
                        rows: 10,
                        publisherTitle: publisherTitle,
                        status: status,
                        isTipoff :isTipoff
                    };
                    var res = reqAjax(USER_URL.SYSTEMLIST, JSON.stringify(dataList));
                    getdetail(res);
                    document.getElementById('paging-box-count').innerHTML = render(res, obj.curr);
                    $('#paging-box-count').html('共'+ obj.pages +'页，每页'+rows+'条，总数'+obj.total+'条');
                }
            });
        }
    getAjax();

    //查询
    $("#searchBtn").click(function(){
        getAjax();
    });
    // 默认刷新第一页
   /* (function (){
        var dataList = {
            page: 1,
            rows: 10
        }
        var dataAll = reqAjax("operations/reviewList", JSON.stringify(dataList));
        var data = dataAll.data;
        var layer = layui.laypage;
        var nums = 10; //每页出现的数据量
        //模拟渲染
        var render = function (data, curr) {
            var arr = []
                , thisData = data;
            layui.each(thisData, function (index, item) {
                arr.push('<li>' + item + '</li>');
            });
            return arr.join('');
        };
        //调用分页
        layer({
            cont: 'paging-box',
            first: false,
            last: false,
            prev: '<', //若不显示，设置false即可
            next: '>',
            pages: Math.ceil(dataAll.total / nums), //得到总页数
            curr: function () { //通过url获取当前页，也可以同上（pages）方式获取
                var page = location.search.match(/page=(\d+)/);
                return page ? page[1] : 1;
            }(),
            jump: function (obj, first) {
                var dataList = {
                    page: obj.curr,
                    rows: 10
                }
                var dataAll = reqAjax("operations/reviewList", JSON.stringify(dataList));
                var data = dataAll.data;
                var str;
                var isoff =""; //是否举报
                var isstatu = "";//举报处理状态

                for(var i=0;i<data.length;i++){
                    data[i].isTipoff=0?"未举报":"已举报";//是否举报 0-未举报 1-已举报
                    if(data[i].isTipoff == 0){
                        isoff = "未举报";
                    }else if(data[i].isTipoff== 1){
                        isoff = "已举报";
                    };
                    if(data[i].tipoffStatus==0){
                        isstatu="举报未处理";//举报处理状态0-举报未处理 1-举报已处理
                    }else if(data[i].tipoffStatus==1){
                        isstatu="举报已处理";
                    }
                    if(data[i].type==1){
                        data[i].type="文字";
                    }else if(data[i].type==2){
                        data[i].type="图片";
                    }else{
                        data[i].type="视频";
                    }
                    if(data[i].status==0){
                        data[i].status="未审核";
                    }else if(data[i].status==1){
                        data[i].status="已通过";
                    }else{
                        data[i].status="未通过";
                    }
                    str+="<tr>" +
                        "<td style='display:none;'>"+data[i].id+"</td>" +
                        "<td>"+(i+1)+"</td>" +
                        "<td>"+data[i].type+"</td>" +
                        "<td class='pTitle'>"+data[i].publisherTitle+"</td>" +
                        "<td class='modalUrl' data-toggle='modal' data-target='#modularAudit' style='display:none;'>"+data[i].reviewUrl+"</td>" +
                        "<td>"+data[i].tableName+"</td>" +
                        "<td class='status'>"+data[i].status+"</td>" +
                        "<td>"+isoff+"</td>" +
                        "<td>"+isstatu+"</td>" +
                        "<td>"+data[i].userId+"</td>" +
                        "<td>"+data[i].createTime+"</td>" +
                        "<td class='tdauti'><button class='audi' data-toggle='modal' data-target='#modularAudit'>审核</button></td>" +
                        "<td style='display:none;'>"+data[i].primaryName+"</td>" +
                        "<td style='display:none;'>"+data[i].reviewId+"</td>" +
                        "<td style='display:none;'>"+data[i].reviewTime+"</td>" +
                        "<td style='display:none;'>"+data[i].fieldStatusName+"</td>" +
                        "<td style='display:none;'>"+data[i].reviewOpinion+"</td>" +
                        "<td style='display:none;'>"+data[i].operatorId+"</td>" +
                        "<td style='display:none;'>"+data[i].operatorName+"</td>" +
                        "<td style='display:none;'>"+data[i].publisherUserCode+"</td>" +
                        "<td style='display:none;'>"+data[i].tipoffReason+"</td>" +
                        "</tr>"
                }
                $("#auditBody").html(str);
                setRed()
                document.getElementById('paging-box-count').innerHTML = render(data, obj.curr);
                $('#paging-box-count').html('共'+ obj.pages +'页，每页'+nums+'条，共'+ dataAll.total +'条');
                if(!first){ //一定要加此判断，否则初始时会无限刷新
                    location.href = '?page='+obj.curr;
                }
            }
        })
    })();*/
	//未评论的默认变红,已评论的默认变绿;
		/*function setRed() {
			var oTd = $('#auditBody').find('tr').find('td');
			var oTdArr = [];
			oTd.each(function(i, item) {
				if($(item).hasClass('status')) {
					oTdArr.push(item)
				}
			})
			// console.log(oTdArr)
			for(var i = 0; i < oTdArr.length; i++) {
				if(oTdArr[i].innerHTML == '未通过') {
					oTdArr[i].setAttribute("class", "status red");
                    oTdArr[i].nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.lastElementChild.setAttribute("disabled", "disabled");
                    oTdArr[i].nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.lastElementChild.setAttribute("style","background-color:#eaeaea;color:#777")
				}
				if(oTdArr[i].innerHTML == '已通过') {
					oTdArr[i].setAttribute("class", "status green");
					oTdArr[i].nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.lastElementChild.setAttribute("disabled", "disabled");
					oTdArr[i].nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.lastElementChild.setAttribute("style","background-color:#eaeaea;color:#777")
				}
				if(oTdArr[i].innerHTML == '未审核') {
					oTdArr[i].setAttribute("class", "status blue");
				}
			}
		}*/


    //查询
  /*  $("#searchBtn").on("click", function () {
        var publisherTitle =$("#searchForm div:nth-of-type(1) input").val();
        // var tableName =$("#searchForm div:nth-of-type(2) select").val();
        var tableName ="";
        var status =$("#searchForm div:nth-of-type(2) select").val();
        var isTipoff =$("#searchForm div:nth-of-type(3) select").val();
        //console.log(publisherTitle + "--" + tableName + "--" + status + "--" + isTipoff);
        var layers = layui.laypage;
        var nums = 10; //每页出现的数据量
        //模拟渲染
        var render = function (data, curr) {
            var arr = []
            // ,thisData = data.concat().splice(curr*nums-nums, nums);
                , thisData = data;
            layui.each(thisData, function (index, item) {
                arr.push('<li>' + item + '</li>');
            });
            return arr.join('');
        };
        
        var data={
        //    tableName:tableName,
            status:status,
            publisherTitle:publisherTitle,
            isTipoff:isTipoff
        }
        var a =reqAjax("operations/reviewList",JSON.stringify(data));
        var data =a.data;
        var str1;
         //调用分页
        layers({
            cont: 'paging-box',
            first: false,
            last: false,
            prev: '<', //若不显示，设置false即可
            next: '>',
            pages: Math.ceil(a.total / nums), //得到总页数
            curr: function () { //通过url获取当前页，也可以同上（pages）方式获取
                var page = location.search.match(/page=(\d+)/);
                return page ? page[1] : 1;
            }(),
            jump: function (obj, first) {
                var publisherTitle =$("#searchForm div:nth-of-type(1) input").val();
                // var tableName =$("#searchForm div:nth-of-type(2) select").val();
                var tableName ="";
                var status =$("#searchForm div:nth-of-type(2) select").val();
                var isTipoff =$("#searchForm div:nth-of-type(3) select").val();
        		
                var data={
		            page: obj.curr,
					rows: 10,
		        //    tableName:tableName,
		            status:status,
		            publisherTitle:publisherTitle,
		            isTipoff:isTipoff
        		}
        		var a =reqAjax("operations/reviewList",JSON.stringify(data));
                var data = a.data;
                var isoff =""; //是否举报
                var isstatu = "";//举报处理状态
                for(var i=0;i<data.length;i++){
                        data[i].isTipoff=0?"未举报":"已举报";//是否举报 0-未举报 1-已举报
                        if(data[i].isTipoff == 0){
                            isoff = "未举报";
                        }else if(data[i].isTipoff== 1){
                            isoff = "已举报";
                        };
                        if(data[i].tipoffStatus==0){
                            isstatu="举报未处理";//举报处理状态0-举报未处理 1-举报已处理
                        }else if(data[i].tipoffStatus==1){
                            isstatu="举报已处理";
                        }
                    if(data[i].type==1){
                        data[i].type="文字";
                    }else if(data[i].type==2){
                        data[i].type="图片";
                    }else{
                        data[i].type="视频";
                    }
                    if(data[i].status==0){
                        data[i].status="未审核";
                    }if(data[i].status==1){
                        data[i].status="已通过";
                    }if(data[i].status==2){
                    	data[i].status="未通过";
                    }
                    str1+="<tr>" +
                        "<td style='display:none;'>"+data[i].id+"</td>" +
                        "<td>"+(i+1)+"</td>" +
                        "<td>"+data[i].type+"</td>" +
                        "<td class='pTitle'>"+data[i].publisherTitle+"</td>" +
                        "<td class='modalUrl' data-toggle='modal' data-target='#modularAudit' style='display: none'>"+data[i].reviewUrl+"</td>" +
                        "<td>"+data[i].tableName+"</td>" +
                        "<td class='status'>"+data[i].status+"</td>" +
                        "<td data-statu='"+ data[i].isTipoff +"'>"+data[i].isTipoff+"</td>" +
                        "<td>"+data[i].tipoffStatus+"</td>" +
                        "<td>"+data[i].userId+"</td>" +
                        "<td>"+data[i].createTime+"</td>" +
                        "<td><button class='audi' data-toggle='modal' data-target='#modularAudit'>审核</button></td>" +
                        "<td style='display:none;'>"+data[i].primaryName+"</td>" +
                        "<td style='display:none;'>"+data[i].reviewId+"</td>" +
                        "<td style='display:none;'>"+data[i].reviewTime+"</td>" +
                        "<td style='display:none;'>"+data[i].fieldStatusName+"</td>" +
                        "<td style='display:none;'>"+data[i].reviewOpinion+"</td>" +
                        "<td style='display:none;'>"+data[i].operatorId+"</td>" +
                        "<td style='display:none;'>"+data[i].operatorName+"</td>" +
                        "<td style='display:none;'>"+data[i].publisherUserCode+"</td>" +
                        "<td style='display:none;'>"+data[i].tipoffReason+"</td>" +
                        "</tr>"
                }
                $("#auditBody").html(str1);
                setRed()
                str1 ='';
                document.getElementById('paging-box-count').innerHTML = render(data, obj.curr);
                $('#paging-box-count').html('共'+ obj.pages +'页，每页'+nums+'条，共'+ a.total +'条');
            }
        })
        if(publisherTitle==""&&status==""&&isTipoff==""){
            layer.msg("请输入查询信息",{time:1000});
        }else if(data.length==0){
            $("#auditBody").html("");
            layer.msg("查询不到该用户信息",{time:1000})
        }

    })*/
	
//  版块设置
    $("#setting").on("click", function () {
        var data ={};
        var res =reqAjax("operations/reviewindex",JSON.stringify(data));
        var data = res.data;
        console.log(data);
        var str;
        for(var i=0;i<data.length;i++){
            str+="<tr>" +
                "<td style='display:none;'>"+data[i].id+"</td>" +
                "<td>"+data[i].plateDesc+"</td>" +
                "<td>"+data[i].tableName+"</td>" +
                "<td><select name='' data-sel="+data[i].reviewStatus+" class='tdNum'><option value='0'>发布即审核</option><option value='1'>审核后发布</option></select></td>" +
                "<td><button class='btn-lg delBut'><i class='glyphicon glyphicon-minus-sign'></i><span>&nbsp;删除</span></button></td>" +
                "</tr>"
                $("#board").html(str);
        }
        var  sel =$("#board tr td select[data-sel]");
        //console.log(sel);
        for(var i=0;i<sel.length;i++){
            if(sel.eq(i).attr("data-sel")==0){
                sel.eq(i).val("0")
            }else{
                sel.eq(i).val("1");
            }
        }
       
        //var id=$("#board tr td").eq(0).html();
        //模块删除
        $("#board").on("click","tr td .delBut",function () {
            var $this =$(this);
            layer.confirm("确认删除？",{icon:3,title:"提示"}, function () {
                $this.parent().parent().remove();
                layer.closeAll('dialog');
            })
        })
        //模块保存
        $("#saveSet").on("click", function () {
            var trs=$("#board tr")
            var datas =[];
            for(var i=0;i<trs.length;i++){
                var tds=trs.eq(i).children();
                var id=tds.eq(0).html();
                var tableName=tds.eq(2);
                if(tableName.find("input").length==0){
                    tableName=tableName.html();
                }else{
                    tableName=tableName.find("input").val();
                }
                var plateDesc=tds.eq(1);
                if(plateDesc.find("input").length==0){
                    plateDesc=plateDesc.html();
                }else{
                    plateDesc=plateDesc.find("input").val();
                }
                var reviewStatus=tds.eq(3).children().val();
                if(tds.eq(1).children('input').val()!='' && tds.eq(2).children('input').val()!=''){
                    var da={
                        id:id,      //主键id
                        tableName:tableName, //板块对应的表名
                        plateDesc:plateDesc, //板块描述
                        reviewStatus:reviewStatus //审核状态 0-发布即审核 1-发布后审核
                    }
                    datas.push(da);
                }

            }
            var trs=$("#board tr")
            var tr0 = trs.eq(0)
            console.log($(tr0).find('td').eq(2).children('input').val())
 			if($(tr0).find('td').eq(1).children('input').val()==''){
 				layer.msg('版块名称不能为空~')
 			}else if($(tr0).find('td').eq(2).children('input').val()==''){
 				layer.msg('版块表名不能为空~')
 			}else{
 				var data ={data:datas};
	            var aa =reqAjax("operations/plateset",JSON.stringify(data));
	            location.reload(true);
 			}
        })
    })
    
    
     $("#addNew").on("click", function () {
            var a="<tr>" +
                "<td style='display:none;'>0</td>" +
                "<td><input type='text'/></td>" +
                "<td><input type='text'/></td>" +
                "<td><select name=''><option value='0'>发布即审核</option><option value='1'>发布后审核</option></select></td>" +
                "<td><button class='btn-lg delBut'><i class='glyphicon glyphicon-minus-sign'></i><span>&nbsp;删除</span></button></td>" +
                "</tr>"
            $("#board").prepend(a);
        })
//    审核
    /*$("#auditBody").on("click",".audi",audit);*/
    /*function audit() {
        // console.log($(this));
            var b=$(this).parent().parent().children();
        var status = b.eq(6).html();
        var reviewOpinion = b.eq(16).html();
        reviewOpinion="null"?"":reviewOpinion;
        // console.log(reviewOpinion);
        var url = b.eq(4).html();
        var type=b.eq(2).html();
        // console.log(type);
        //文字-1 图片-2 视频-3
        if(type=="文字"||type=="图片"){
            $("#show").append(ifra);            $("#show iframe").prop("src",url);
            // ifram();
            // var r=document.frames[ "iframe1 "].document.body.createTextRange();
            // r.execCommand( "FontSize ", "false ",20);
            // $("#show iframe html").css("font-size","24px");
            // document.frames["iframe1"].document.styleSheets.mycss.addRule("FontSize",20);

        }else{
            var vide ="<video style='width:900px;height:400px;object-fit:fill;' controls ></video>"
            $("#show").html(vide);
            $("#show video").prop("src",url);
        }

        var id= b.eq(0).html();
        var reviewId= b.eq(13).html();
        var fieldStatusName= b.eq(15).html();
        var tableName= b.eq(5).html();
        var publisherUserCode= b.eq(19).html();
        var isTipoff= b.eq(7).html();
        isTipoff="未举报"?0:1;
        var primaryName= b.eq(12).html();
        var publisherTitle= b.eq(3).html();
        var userName=sessionStorage.getItem('username');
        var userId = sessionStorage.getItem('userno');

        if(status=="未审核"){
            $("#modularAudit .isPass input").prop("checked",false);
            $("#modularAudit .fail input").prop("checked",false);
        }else if(status=="已通过"){
            $("#modularAudit .isPass .pass").prop("checked",true);
            $("#modularAudit .fail input").prop("checked",false);

            $("#extra").val(reviewOpinion);
        }else{
            //未通过的信息返回页面上
            $("#modularAudit .isPass .noPass").prop("checked",true);
            $("#extra").val(reviewOpinion);
            var che= $("#modularAudit .fail input[type='radio']");
            for(var i=0;i<che.length;i++){
                if(che.eq(i).val()==reviewOpinion){
                    che.eq(i).prop("checked",true);
                }
            }
        }
        /!*选择通过，其他选框取消选中*!/
        $("#modularAudit .fail input").on("click", function () {
            $("#modularAudit .isPass .pass").prop("checked",false);
            $("#modularAudit .isPass .noPass").prop("checked",true);
            $(this).siblings().prop("checked",false);
            var val=$("#modularAudit .fail input[type='radio']:checked").val();
            $("#extra").val(val);
        })
        $("#modularAudit .isPass .pass").on("click", function () {
            $("#modularAudit .fail input").prop("checked",false);
            $("#extra").val("");
        })
        $("#modularAudit .isPass .noPass").on("click", function () {
            $("#modularAudit .fail input[value='其他']").prop("checked",true);
            var val=$("#modularAudit .fail input[type='radio']:checked").val();
            $("#extra").val(val);
        })

        $("#saveAudit").on("click", function () {
            var status = $("#modularAudit .isPass input[type='radio']:checked").val();
            if(status=="审核通过"){
                status=1;
            }else if(status=="不予通过"){
                status=2;
            }else if(status==undefined){
                status=0;
            }
            //console.log(status);
            var reviewOpinion=$("#extra").val();
            if(reviewOpinion==""){
                layer.msg("请填写审核意见",{time:800});
                return false
            }
            var data ={
                userName:userName,// 当前用户名
                userId:userId, //当前系统用户id
                id:id,
                reviewId:reviewId,//审核对象id
                fieldStatusName:fieldStatusName,//审核对象表字段名称，默认re_status
                tableName:tableName,//审核对象表名称
                publisherUserCode:publisherUserCode,//发布者usercode（作者usercode 用于推送）
                isTipoff:isTipoff,//是否举报 0-未举报 1-已举报
                primaryName:primaryName,//主键名称
                publisherTitle:publisherTitle,//发布者标题（用于查询和推送）
                status:status,//审核状态 0-未审核 1-审核已通过 2-审核未通过
                reviewOpinion:reviewOpinion//审核意见
            }
            //console.log(data);
            var a =reqAjax("operations/reviewConfirm",JSON.stringify(data));
            //console.log(a);
            //layer.msg("审核上传中")
            window.location.reload();
        })
    }*/
        $("#auditBody").on("click",".audi",function(){
            var b=$(this).parents("tr");
            var status = b.find(".status").text();
           /* var reviewOpinion = b.attr("data-reviewopinion");
            reviewOpinion="null"?"":reviewOpinion;*/
            var url = b.find(".modalUrl").attr("data-url");
            var type= b.find("td").eq(1).text();
            var id = b.attr("data-id");
            var userName=sessionStorage.getItem('username');
            var userId = sessionStorage.getItem('userno');
            var reviewId = b.find(".modalUrl").attr("data-reviewid");
            var fieldStatusName = b.find("td").eq(10).text();
            var publisherUserCode = b.find("td").eq(11).text();
            var primaryName = b.find("td").eq(12).text();
            var tableName = b.find("td").eq(3).text();
            var isTipoff = b.find("td").eq(5).attr("data-isTipoff");
            var publisherTitle = b.find("td").eq(2).text();
            layer.config({
                extend: 'myskin/style.css' //同样需要加载新皮肤
            });
            layer.open({
                type: 2,
                title: ['审核', 'background:#303030;color:#fff;'],
                skin: 'layer-ext-myskin',
                area: ['1024px', '768px'],
                shade: 0.5,
                closeBtn: 1,
                shadeClose: false,
                content: 'addcomment.html',
                btn: ['保存'],
                btnAlign: 'c',
                success: function (layero, index) {
                   var body = layer.getChildFrame('body', index);
                    /* body.contents().find(".url").val(url);
                    body.contents().find(".type").val(type);*/
                    if(type=="文字"||type=="图片"){
                        body.contents().find("#pavid").prop("style","display:none")
                        body.contents().find("#paFrame").prop({"src":url,"style":"display:block"});
                    }else{

                        body.contents().find("#paFrame").prop("display","display:none")
                        body.contents().find("#pavid").prop({"src":url,"style":"display:block;width:90%;height:420px;object-fit:fill;padding:20px 10px"});
    }
                    if(status=="未审核"){
                        body.contents().find(".addsystem .isPass input").prop("checked",false);
                        body.contents().find(".addsystem .fail input").prop("checked",false);
                    }
                    //选择通过，其他选框取消选中
                    var aa=body.contents().find(".fail");
                    aa.find("input").on("click", function () {
                        body.contents().find(".pass").prop("checked",false);
                        body.contents().find(".noPass").prop("checked",true);
                        aa.siblings().prop("checked",false);
                        var val=aa.find("input[type='radio']:checked").val();
                        body.contents().find("#extra").val(val);
                    })
                    body.contents().find(".pass").on("click", function () {
                        $(this).prop("checked",true);
                       aa.find("input").prop("checked",false);
                        body.contents().find("#extra").val("");
                    })
                    body.contents().find(".noPass").on("click", function () {
                        $(this).prop("checked",true);
                        aa.find("input[value='其他']").prop("checked",true);
                        body.contents().find("#extra").val("其他");
                    })
                },
                yes: function (index) {
                    var body = layer.getChildFrame('body');
                    //console.log(status);
                    var reviewOpinion=body.contents().find("#extra").val();
                    var status = body.contents().find(".isPass input[type='radio']:checked").val();
                   /* if(reviewOpinion==""){
                        layer.msg("请填写审核意见",{time:800});
                        return false
                    }*/
                    var data ={
                        userName:userName,// 当前用户名
                        userId:userId, //当前系统用户id
                        id:id,
                        reviewId:reviewId,//审核对象id
                        fieldStatusName:fieldStatusName,//审核对象表字段名称，默认re_status
                        tableName:tableName,//审核对象表名称
                        publisherUserCode:publisherUserCode,//发布者usercode（作者usercode 用于推送）
                        isTipoff:isTipoff,//是否举报 0-未举报 1-已举报
                        primaryName:primaryName,//主键名称
                        publisherTitle:publisherTitle,//发布者标题（用于查询和推送）
                        status:status,//审核状态 0-未审核 1-审核已通过 2-审核未通过
                        reviewOpinion:reviewOpinion//审核意见
                    }

                    var a =reqAjax("operations/reviewConfirm",JSON.stringify(data));
                    if(a.code == 1){
                        //window.location.reload();
                        getAjax();
                        layer.close(index);
                    }else{
                        layer.msg(a.msg);
                    }
                }
            });
        });

        //    用户封号
    $("#auditBody").on("click","tr",function () {
        $(this).addClass("chose");
        $(this).siblings().removeClass("chose");
    })

    $("#resetBtn").on("click", function () {
        // console.log($("#auditBody .chose"));
        var userId = $("#auditBody tr.chose").attr("data-userid");
        if(userId==undefined){
            layer.msg("请选择用户进行封号",{time:1000});
            return false;
        }
        var data ={
            userId:userId
        }
        layer.confirm("确认封号？",{icon:0,title:"提示"}, function () {
            var a =reqAjax("operations/kick",JSON.stringify(data));
            console.log(a);
            console.log(a.code);
            if(a.code==9){
                layer.msg(a.msg,{time:1000});
            }else{
                layer.msg(a.msg,{time:1000});
            }

        })
    })
//
})
