(function($) {
    var page = 1;
    var rows = 10;
    var userId = yyCache.get("userId") || "";
    var locked = true;
    var USER_URL = {
        RESOURLIST : 'operations/findScZxTutor', //(查询状态)
        ADDRESOURCE : 'operations/addScZxTutor',//(新增)
        DELUSER : 'operations/deleteScZxTutor', //(删除)
        UPDATELIST:'operations/updateScZxTutor' //修改
    };


    var layer = layui.layer;
    var table = layui.table;
    layui.use('form', function(){
        form = layui.form;
    })

    //初始化渲染表单
    $(function(){
        temple();
    })

    //选中表单事件
    $('#app').on('click','tr',function(){
        $(this).addClass('layui-table-click').siblings().removeClass('layui-table-click');
    })

    //上传图片
    var uploaderLabel = uploadOss({
        btn: 'codeload',
        imgDom: "codeload",
        flag: "sendLocal",
        size:'1mb',
        type:2
    });

    //新增
    $('#commonAdd').on('click',function(){
        layer.open({
            title: ['添加导师', 'font-size:12px;background-color:#424651;color:#fff'],
            btn: ['保存', '取消'],
            resize:false,
            type: 1,
            offset: '50px',
            content:$('#addInfo'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
            area: ['950px', '730px'],
            shade: [0.1, '#fff'],
            end:function(){
                $('#addInfo').hide();
                $("#addInfo").find("input").val("");
                $("#addInfo").find("textarea").val("");
                $("#addInfo").find("#openImg").attr("src", "img/circleico.png");
                $("#addInfo").find(".right-img img").attr("src", "img/squareico.png");
            },
            success:function(layero){
                $("#addstatu").attr("data-type",1);
                document.getElementById('openstatu').checked=true;
                document.getElementById('closestatu').checked=false;
                form.render();

                //给保存按钮添加form属性
                $("div.layui-layer-page").addClass("layui-form");
                $("a.layui-layer-btn0").attr("lay-submit","");
                $("a.layui-layer-btn0").attr("lay-filter","formdemo");
            },
            yes:function(index, layero){
                //form监听事件
                form.on('submit(formdemo)',function(data){
                    if(data){
                        var addname = $.trim($("#addName").val());
                        var addphone = $.trim($("#addPhone").val());
                        var addid = $.trim($("#addId").val());
                        var addmarks = $.trim($("#addRemark").val());
                        var tximg = $("#openImg").attr("src");
                        var codeimg = $("#codeload").attr("src");
                        var addstatus = $("#addstatu").attr("data-type");
                        if(tximg=="img/circleico.png" || codeimg=="img/squareico.png"){
                            layer.msg('请上传相关图片', {icon: 6});
                        }else{
                            var newtximg=tximg.replace('data:image/jpeg;base64,', '');
                            var param = {
                                "phone": addphone,//手机号
                                "usercode": userId,//创建人id
                                "status": addstatus,//状态 1为激活 2为冻结
                                "name": addname,//名字
                                "remarks": addmarks,//备注
                                "avatar": newtximg,//头像
                                "circleId": addid,//圈子 id
                                "wxQRCode":codeimg //微信二维码
                            }
                            if(locked){
                                locked = false;
                                reqAjaxAsync(USER_URL.ADDRESOURCE,JSON.stringify(param)).done(function(res){
                                    if(res.code == 1){
                                        layer.close(index);
                                        layer.msg(res.msg);
                                        setTimeout(function(){
                                            location.reload();
                                            locked = true;
                                        },500);
                                    }else{
                                        layer.msg(res.msg);
                                        locked = true;
                                    }
                                });
                            }
                        }
                    }
                });
            },
            cancel: function(){
                stopUpload();
            }
        });
    })

//是否启用（弹窗）
    form.on('radio(status)', function(data){
        var val = data.value;
        $("#addstatu").attr("data-type",val);
    });



    //渲染表单
function temple(phone,name){
    var obj = tableInit('table', [
            [{
                title: '序号',
                /*sort: true,*/
                align: 'left',
                field: 'eq',
                width: 80
            }, {
                title: '姓名',
                /*sort: true,*/
                align: 'left',
                field: 'name',
                width:160
            }, {
                title: '手机号',
                /*sort: true,*/
                align: 'left',
                field: 'phone',
                width:200
            },
                {
                title: '个人头像',
                align: 'left',
                field:'avatar',
                style:"height:30px",
                templet: '#avatar',
                width:200
            },{
                title: '微信二维码',
                align: 'left',
                field:'wxQRCode',
                style:"height:30px",
                templet: '#wxQRCode',
                width:200
            },
                {
                title: '圈子ID',
                /*sort: true,*/
                align: 'left',
                field: 'circleId',
                width:160
            },{
                title: '备注',
                /*sort: true,*/
                align: 'left',
                field: 'remarks',
                width:200
            },{
                title: '操作',
                fixed: 'right',
                align: 'left',
                toolbar: '#barDemo',
                width: 350
            }]
        ],
        pageCallback,phone,name
    );
}


    /* 表格初始化
     * tableId:
     * cols: []
     * pageCallback: 同步调用接口方法
     */
    function tableInit(tableId, cols, pageCallback,phone,name) {
        var tableIns, tablePage;
        //1.表格配置
        tableIns = table.render({
            id: tableId,
            elem: '#' + tableId,
            height:'full-248',
            cols: cols,
            page: false,
            even: true,
            limit: 15,
            skin: 'row'
        });

        //2.第一次加载
        var res = pageCallback(1, 15,phone,name);
        //第一页，一页显示15条数据
        if(res) {
            if(res.code == 1) {
                tableIns.reload({
                    data: res.data
                })
            } else {
                layer.msg(res.msg)
            }
        }

        //3.left table page
        layui.use('laypage');

        var page_options = {
            elem: 'laypageLeft',
            count: res ? res.total : 0,
            layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
            limits: [15, 30],
            limit: 15
        }
        page_options.jump = function(obj, first) {
            tablePage = obj;

            //首次不执行
            if(!first) {
                var resTwo = pageCallback(obj.curr, obj.limit,phone,name);
                if(resTwo && resTwo.code == 1)
                    tableIns.reload({
                        data: resTwo.data,
                        limit: obj.limit
                    });
                else
                    layer.msg(resTwo.msg);
            }
        }


        layui.laypage.render(page_options);

        return {
            tablePage,
            tableIns
        };
    }




    //左侧表格数据处理
    function getData(url, parms) {

        var res = reqAjax(url, parms);

        var data = res.data;

        $.each(data, function(i, item) {
            $(item).attr('eq', (i + 1))
        });

        return res;
    }

    //pageCallback回调
    function pageCallback(index, limit , phone,name) {
        var param = {
            "page": index,
            "rows": limit,
            "phone": phone,
            "name": name,
            "src":"yy" //用来辨别运营还是官网调用 运营 yy 官网 gw
        }
        return getData(USER_URL.RESOURLIST, JSON.stringify(param));
    }


    //点击上传头像出现弹窗
    $("#openImg").click(function(){
        layer.open({
            title: ['图片裁剪', 'font-size:12px;background-color:#424651;color:#fff'],
            type: 1,
            offset:'50px',
            content: $('#imgTip'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
            area: ['900px', '730px'],
            btn:['保存','取消'],
            closeBtn: 1,
            shade: [0.1, '#fff'],
            end: function() {
                $('#imgTip').hide();
                $("#imgTip").find(".canvas-show1").attr("src","");
                $("#imgTip").find(".canvas-box").html("");
                $("#imgTip").find(".canvas-show").html("");
                $("#imgTip").find("#imageId").val("");
                $("#imgTip").find("#val").val("");
                $(".canvas-show1").hide();
            },
            success: function(layero, index) {

                var box_width = '400';
                var box_height = '400';
                var c = new ZmCanvasCrop({
                    fileInput: $('#ipt')[0],
                    saveBtn: $('#save')[0],
                    min_width: box_width,//保证原图预览效果,限定原图最小宽度
                    min_height: box_height,//保证原图预览效果,限定原图最小高度
                    box_width: box_width,//图片容器的最大宽度(页面显示宽度)
                    box_height: box_height,//图片容器的最大高度(页面显示高度)
                    crop_scale: box_width / box_height //图片裁剪区域宽高比
                } );

                //点击裁剪预览
                $("#save").click(function(){
                    var val = $(".canvas-box").attr("data-type");
                   if(val!="0"){
                       $(".canvas-show1").show();
                   }else{
                       layer.msg('请上传相关图片', {icon: 6});
                   }

                });
            },
            yes:function(index, layero){
                //提交回调处理
                sub($("#openImg"),index);

            }
        });
    });

    //裁剪后提交
    function sub(img, index) {
        if (!$('#imageId').val()) {
            top.layer.alert('没有确认裁剪后的图片不能提交', {title: '提示'});
            return;
        }
        if (img.attr("src")) {
            img.attr("src", $('#imageId').val());
        } else {
            img.attr("style", "background-image: url(" + $('#imageId').val() + ");");
        }

        layer.close(index);
    }


    //监听工具条
    table.on('tool(table)', function(obj){
        var data = obj.data;
        var id = data.id;
        //删除
        if(obj.event === 'del'){
            layer.confirm(
                "确认删除?",
                {icon: 3, title:'提示',shade: [0.1, '#fff']},
                function(index){
                    var paramDel = {
                        ids : id
                    };
                    reqAjaxAsync(USER_URL.DELUSER,JSON.stringify(paramDel)).done(function(res){
                        if (res.code == 1) {
                            layer.msg("删除成功");
                            obj.del();
                        } else {
                            layer.msg(res.msg);
                        }
                    });
                })
        }else if(obj.event === 'look'){
            layer.open({
                title: ['查看', 'font-size:12px;background-color:#424651;color:#fff'],
				type: 1,
                offset:'auto',
				content: $('#lookInfo'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
				area: ['950px', '650px'],
				closeBtn: 1,
				shade: [0.1, '#fff'],
				end: function() {
					$('#lookInfo').hide();
				    $("#lookInfo").find("input").val("");
                    $("#lookInfo").find("textarea").val("");
					$("#lookInfo").find("img").attr("src", "");
				},
				success: function(layero, index) {
                    $("#lookInfo").find(".layui-form-item").eq(0).find("input").val(data.name);
                    $("#lookInfo").find(".layui-form-item").eq(1).find("input").val(data.phone);
                    $("#lookInfo").find(".layui-form-item").eq(2).find("input").val(data.circleId);
                    $("#lookInfo").find(".layui-form-item").eq(3).find("textarea").val(data.remarks);
                    $("#lookInfo").find(".left-img").find("img").attr("src",data.avatar);
                    $("#lookInfo").find(".right-img").find("img").attr("src",data.wxQRCode);
                }
            });
        }else if(obj.event === 'change'){//修改
            layer.open({
                title: ['修改', 'font-size:12px;background-color:#424651;color:#fff'],
                type: 1,
                offset:'0',
                content: $('#addInfo'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                area: ['950px', '730px'],
                btn:["保存","取消"],
                closeBtn: 1,
                shade: [0.1, '#fff'],
                end: function() {
                    $('#addInfo').hide();
                    $("#addInfo").find(".layui-input").val("");
                    $("#addInfo").find("textarea").val("");
                    $("#addInfo").find(".left-img img").attr("src", "img/circleico.png");
                    $("#addInfo").find(".right-img img").attr("src", "img/squareico.png");
                },
                success: function(layero, index) {
                    debugger
                    $("#addInfo").find(".layui-form-item").eq(0).find("input").val(data.name);
                    $("#addInfo").find(".layui-form-item").eq(1).find("input").val(data.phone);
                    $("#addInfo").find(".layui-form-item").eq(2).find("input").val(data.circleId);
                    $("#addInfo").find(".layui-form-item").eq(3).find("textarea").val(data.remarks);
                    $("#addInfo").find(".left-img").find("img").attr("src",data.avatar);
                    $("#addInfo").find(".right-img img").attr("src",data.wxQRCode);
                    $("#addstatu").attr("data-type",data.status);
                    if(data.status==1){
                        document.getElementById('openstatu').checked=true;
                        document.getElementById('closestatu').checked=false;
                    }else{
                        document.getElementById('openstatu').checked=false;
                        document.getElementById('closestatu').checked=true;
                    }
                    form.render();

                    //给保存按钮添加form属性
                    $("div.layui-layer-page").addClass("layui-form");
                    $("a.layui-layer-btn0").attr("lay-submit","");
                    $("a.layui-layer-btn0").attr("lay-filter","formdemo");
                },
                yes:function(index, layero){
                    form.on('submit(formdemo)',function(data){
                        if(data) {
                            var addname = $.trim($("#addName").val());
                            var addphone = $.trim($("#addPhone").val());
                            var addid = $.trim($("#addId").val());
                            var addmarks = $.trim($("#addRemark").val());
                            var tximg = $("#openImg").attr("src");
                            var codeimg = $("#codeload").attr("src");
                            var addstatus = $("#addstatu").attr("data-type");
                            var radioID = $('input[name="sex"]:checked').attr('id');
                            if (addstatus == ''){
                                if (radioID == 'openstatu') {
                                    addstatus = '1';
                                } else {
                                    addstatus = '2';
                                }
                            }
                            var newtximg=tximg.replace('data:image/jpeg;base64,', '');
                            if(tximg=="img/circleico.png" || codeimg=="img/squareico.png"){
                                layer.msg('请上传相关图片', {icon: 6});
                            }else{
                                if(newtximg.indexOf("https")==-1){
                                    changeSet(1,id,addstatus,index,addphone,addname,newtximg,addid,codeimg,addmarks);
                                }else{
                                    changeSet(1,id,addstatus,index,addphone,addname,"",addid,codeimg,addmarks);
                                }

                            }
                        }
                    })
                },
                cancel: function () {
                    stopUpload();
                }
            });
        }else if(obj.event === 'open'){//开启
            changeSet(2,id,2);
        }else if(obj.event === 'close'){//关闭
            changeSet(2,id,1);
        }
    });
    //停止文件上传
    function stopUpload(){
        $("#zxadver .inpt").hide();
        if (uploaderLabel.files.length > 0) {
            uploaderLabel.stop();
            uploaderLabel.splice(0);
        }
    }
    $("#zxadver .inpt").click(function(){
        layer.msg('正在上传请等待！', {icon: 6});
    });

    //修改接口
    function changeSet(type,id,status,index,phone,name,avatar,circleId,wxQRCode,remarks){
        var param = {
            "id":id,
            "usercode":userId,//创建人id
            "status":status//状态 1为激活 2为冻结
        }
        if(type==1){//修改
            param.phone=phone;
            param.name=name;
            if(avatar!=""){
                param.avatar=avatar;
            }
            param.circleId=circleId;
            param.wxQRCode=wxQRCode;
            param.remarks=remarks;
        }
        if(locked){
            locked = false;
            reqAjaxAsync(USER_URL.UPDATELIST,JSON.stringify(param)).done(function(res){
                if(res.code == 1){
                    if(type==1){
                        layer.close(index);
                    }
                    layer.msg(res.msg);
                    setTimeout(function(){
                        var name = $.trim($("#name").val()) || "";
                        var phone = $.trim($("#phone").val()) || "";
                        temple(phone,name);
                        locked = true;
                    },500);
                }else{
                    layer.msg(res.msg);
                    locked = true;
                }
            });
        }
    }

    //刷新
    $("#refrsh").click(function(){
        location.reload();
    });

    //点击顶部搜索出现各搜索条件
    $('#search').on('click',function(){
        $('#search-tool').slideToggle(200)
    });

    //搜索条件进行搜索
    $('#toolSearch').on('click',function(){
        var name = $.trim($("#name").val()) || "";
        var phone = $.trim($("#phone").val()) || "";
        temple(phone,name);
    })

    //重置
    $("#toolRelize").on('click',function(){
        $("#name").val("");
        $("#phone").val("");
    });


})(jQuery)