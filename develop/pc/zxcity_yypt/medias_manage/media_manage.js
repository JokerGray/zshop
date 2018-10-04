$(function(){
    var CMD="dazzle/audioFileManage",
        CMDLODA="dazzle/ossUpload";//上传音频文件
    		// ajax公共方法
    function reqAjaxAsync(cmd, data, callback) {
        var apikey = sessionStorage.getItem('apikey') || "test"; //获取缓存 通行证码
        var version = sessionStorage.getItem('version') || "1"; //获取缓存 版本号
        var inputdata = data;
        $.ajax({
            type: "POST",
            url: "/zxcity_restful/ws/rest",
            dataType: "json",
            async: true, //默认为异步
            data: {
            "cmd": cmd,
            "data": data || "",
            "version": version
            },
            beforeSend: function (request) {
            request.setRequestHeader("apikey", apikey);
            },
            success: function (res) {
            callback(res, inputdata);
            },
            error: function (err) {
            layer.msg("请求出错！");
            console.log(err);
            }
        });
        }
        // 获取初始化查询的条件
        var queryAll={
            condition:4,
            page:0,
            row:10
        }
        var queryAllData=JSON.stringify(queryAll);
        reqAjaxAsync(CMD, queryAllData, showPage);
     // 展示分页信息
     function showPage(re){
        var total=re.total,
            totalPage=Math.ceil(total/10);
        $("#totals").text(total);
        layui.use(['laypage'],function(){
            var laypage=layui.laypage;
              laypage({
              cont:"pages",
              pages:totalPage, //总页数
              groups:5, //连续显示分页数
              jump:function(obj){
                    var curr = obj.curr;
                    var currNum=curr-1;
                    var newdatas={
                      "condition":4,
                      "page":currNum,
                      "row":10
                   };
                   var data=JSON.stringify(newdatas);
                    reqAjaxAsync(CMD,data,showList);
                  }
              });
        });
    }     
    runupload($("#fixUrl"),$("#vdUrl"));
    runupload($("#newImg"),$("#newGoodsPrice"));   
    // 表格展示
        function showList(re){
            console.log(re);
            console.log(re.data.findMusic);
            console.log(re.data.findMusic.length);
            var musics=re.data.findMusic;
            var musicHtml="";
            if(musics.length){
                var musicHead='<table class="table table-bordered table-striped"><tbody><tr><th>序号</th><th>名称</th><th>地址</th><th>上传时间</th><th>操作</th></tr>';
                var musicBody="";
                var musicFoot='</tbody></table>';
                for(var i=0;i<musics.length;i++){
                    musicBody+='<tr><td>'+(i+1)+'</td><td class="name">'+musics[i].name+'</td><td class="url">'+musics[i].url+'</td><td>'+musics[i].createTime.substr(0,10)+'</td>'+
                    '<td><button class="btn btn-success fix" hdid="'+musics[i].id+'">修改</button><button class="btn btn-danger del"  hdid="'+musics[i].id+'"  style="margin-left:10px;">删除</button></td></tr>';
                }
                var musicHtml=(musicHead+musicBody+musicFoot);
            }else{
                musicHtml='<table class="table table-bordered table-striped"><tbody>'+
                '<tr><th>序号</th><th>姓名</th><th>所属店铺</th><th>店铺ID</th><th>店铺地址</th><th>身份证正面</th><th>身份证反面</th></tr>'+
                '</tbody></table><div class="no-data">暂无数据~</div>';
            }
            $("#tablelist").html(musicHtml);
            // 修改
            $(".fix").on("click",function(){
                var id=$(this).attr("hdid"),
                    name=$(this).parent().siblings(".name").text(),
                    url=$(this).parent().siblings(".url").text();
                    console.log(id);
                $("#vdName").val(name);
                $("#vdUrl").val(url);
                $("#fixvd").modal("show");
                $("#mdSave").unbind("click");
                $("#mdSave").on("click",function(){
                    var newname=$("#vdName").val(),
                        newUrl=$("#vdUrl").val();
                    if(newname==""){
                        layer.msg("请输入名称");
                        return false;
                    }                
                    console.log(newname);
                    console.log(newUrl);
                    var datas={
                        condition:3,
                        id:Number(id),
                        type:1,
                        name:newname,
                        url:newUrl
                    }
                    var data=JSON.stringify(datas);
                    console.log(datas);
                    reqAjaxAsync(CMD, data, successFix)
                });                
            });
            // 删除
            $(".del").on("click",function(){
                var id=$(this).attr("hdid");
                console.log(id);
                $("#delgd").modal("show");
                $("#delGoods").unbind("click");
                $("#delGoods").on("click",function(){
                    var datas={
                        condition:2,
                        id:Number(id)
                    }
                    var data=JSON.stringify(datas);
                    reqAjaxAsync(CMD, data, successFix)
                });
            });
        }

        // 新增
        $("#adGs").on("click",function(){
           $("#addgd").modal("show");
           $("#newSave").unbind("click");
           $("#newSave").on("click",function(){
                var name=$("#newGoodsName").val();
                var url=$("#newGoodsPrice").val();
                console.log(name);
                console.log(url);
                if(name==""){
                    layer.msg("请输入名称",{time:1000});
                    return false;
                }
                if(url==""){
                    layer.msg("请上传文件",{time:1000});
                    return false;
                }
                var datas={
                    condition:1,
                    type:1,
                    name:name,
                    url:url
                }
                var data=JSON.stringify(datas);
                reqAjaxAsync(CMD, data, successFix)                               
           });
        });
		// 修改成功回调
		function  successFix(re){
			layer.msg(re.msg,{time:1000});
			$("#newSave").unbind("click");
			$("#mdSave").unbind("click");
			$("#delGoods").unbind("click");
			setTimeout(function(){
				var index = layer.load(0, {shade: false});
				setTimeout(function(){
					layer.close(index);
					window.location.reload();
				},500);
			},1000);
		}

        

        
});