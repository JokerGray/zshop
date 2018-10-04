(function($) {
    var page = 1;
    var rows = 10;
    var userId = yyCache.get("userId") || "";
    var locked = true;
    var USER_URL = {
        PROVINCE: 'operations/getProvinceList',//省市接口
        RESOURLIST : 'operations/findScRecruitTalent', //(查询状态)
        ADDRESOURCE : 'operations/addScRecruitTalent',//(新增)
        DELUSER : 'operations/deleteScRecruitTalent', //(删除)
        UPDATELIST:'operations/updateScRecruitTalent' //修改
    };


    var layer = layui.layer;
    var table = layui.table;
    layui.use('form', function(){
        form = layui.form;
    })

    //初始化渲染表单
    $(function(){
        temple();
     //   loadArea(0,"#province"); //加载省
    });

    //选中表单事件
    $('#app').on('click','tr',function(){
        $(this).addClass('layui-table-click').siblings().removeClass('layui-table-click');
    })

    //省市通用
    function getCity(res,e){
        var sHtml="";
        for(var i=0;i<res.data.length;i++){
            var row = res.data[i];
            sHtml += '<option value="'+ row.code +'">' + row.areaname + '</option>';
        }
        $(e).append(sHtml);
        form.render();
    }

    //省市加载
    function loadArea(code,e){
        var param = {
            "parentcode":code
        }

        reqAjaxAsync(USER_URL.PROVINCE, JSON.stringify(param)).done(function (res) {
            if (res.code == 1) {
                getCity(res,e)
            } else {
                layer.msg(res.msg);
            }
        })
    }

    //选择了省(暂时写死)
   /* form.on('select(province)', function(data){
        if(data.value!=""){
            $(".tiphid").hide();
            loadArea(data.value,"#city");
            $("#province").attr("data-id",data.value);
            form.render();
            console.log(data.value); //复选框value值，也可以通过data.elem.value得到
        }else{
            $(".tiphid").show();
            $("#province").attr("data-id","");
            $("#city").attr("data-id","");
            $("#city").val("");
            form.render();
        }
    });*/

    //选择了市
    /*form.on('select(city)', function(data){
        if(data.value!=""){
            $("#city").attr("data-id",data.value);
        }
    });*/

    //切换市区
    form.on('select(city)', function(data){
       $("#city").attr("data-name",data.value);
    });

    //切换工作性质
    form.on('select(work)', function(data){
        $("#work").attr("data-name",data.value);
    });

    //切换是否发布
    form.on('select(isOpen)', function(data){
        $("#isOpen").attr("data-type",data.value);
    });


    var layer = layui.layer;
    var table = layui.table;
    layui.use('form', function(){
        form = layui.form;
    })


    //新增
    $('#commonAdd').on('click',function(){
        layer.open({
            title: ['添加职位', 'font-size:12px;background-color:#0678CE;color:#fff'],
            btn: ['保存', '取消'],
            resize:false,
            type: 1,
            offset: 'auto',
            content:$('#addInfo'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
            area: ['950px', '600px'],
            shade: [0.1, '#fff'],
            end:function(){
                $('#addInfo').hide();
               $('#addInfo').find(".clear-input").val("");
                $('#addInfo').find(".layui-textarea").val("");
                $(".joinName").find("input").val(1);
            },
            success:function(layero){
                //给保存按钮添加form属性
                $("div.layui-layer-page").addClass("layui-form");
                $("a.layui-layer-btn0").attr("lay-submit","");
                $("a.layui-layer-btn0").attr("lay-filter","formdemo");
            },
            yes:function(index, layero){
                //form监听事件
                form.on('submit(formdemo)',function(data){
                    if(data){
                        var positionName = $.trim($("#jobTitle").val());
                        var provincial = $("#province").attr("data-name");
                        var workType = $.trim($("#workType").val());
                        var city = $("#city").attr("data-name");
                        var recruitNum = $.trim($(".joinName input").val());
                        var workNature = $("#work").attr("data-name");
                        var workDuty = $.trim($("#duty").val());
                        var workRestd = $.trim($("#requir").val());
                        var status = $("#isOpen").attr("data-type");
                            var param = {
                                "positionName": positionName,//职位名称
                                "workType":workType,//职位类别
                                "provincial": provincial,//省
                                "city": city,//市
                                "recruitNum": recruitNum,//招聘人数
                                "workNature": workNature,//工作性质
                                "workDuty": workDuty,//工作职责
                                "workRestd": workRestd,//职位要求
                                "status":status, //状态 1发布 2停用
                                "usercode":userId //操作人帐号id
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
                });
            }
        });
    })

    //渲染表单
function temple(city,name){
    var obj = tableInit('table', [
            [{
                title: '序号',
                /*sort: true,*/
                align: 'left',
                field: 'eq',
                width: 80
            }, {
                title: '职位名称',
                /*sort: true,*/
                align: 'left',
                field: 'positionName',
                width:300
            }, {
                title: '职位类型',
                /*sort: true,*/
                align: 'left',
                field: 'workType',
                width:200
            }, {
                title: '工作地点',
                /*sort: true,*/
                align: 'left',
                field:'city',
                width:200
            },{
                title: '招聘人数',
                /*sort: true,*/
                align: 'left',
                field:'recruitNum',
                width:200
            },{
                title: '工作性质',
                /*sort: true,*/
                align: 'left',
                field: 'workNature',
                width:200
            },{
                title: '是否发布',
                /*sort: true,*/
                align: 'left',
                field: 'status',
                templet:'#statu',
                width:200
            },{
                title: '操作',
                align: 'left',
                toolbar: '#barDemo',
                width: 350
            }]
        ],
        pageCallback,city,name
    );
}


    /* 表格初始化
     * tableId:
     * cols: []
     * pageCallback: 同步调用接口方法
     */
    function tableInit(tableId, cols, pageCallback,city,name) {
        var tableIns, tablePage;
        //1.表格配置
        tableIns = table.render({
            id: tableId,
            elem: '#' + tableId,
            height:'full-248',
            cols: cols,
            page: false,
            even: true,
            skin: 'row'
        });

        //2.第一次加载
        var res = pageCallback(1, 15,city,name);
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
                var resTwo = pageCallback(obj.curr, obj.limit,city,name);
                if(resTwo && resTwo.code == 1)
                    tableIns.reload({
                        data: resTwo.data
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
    function pageCallback(index, limit , city,name) {
        var param = {
            "page": index,
            "rows": limit,
            "city": city, //职位名称
            "positionName": name, //市
            "src":"yy" //用来辨别运营还是官网调用 运营 yy 官网 gw
        }
        return getData(USER_URL.RESOURLIST, JSON.stringify(param));
    }

    //招聘人数正则
    $(".joinName").on("blur","input",function(){
        var val = $(this).val();
        if(val!=""){
            var reg =  /^[1-9]\d*$/;
            if(!reg.test(val)){
                $(this).val(1);
                layer.msg("请填写正确的数量",{icon:6});
            }
        }else{
            $(this).val(1);
            layer.msg("招聘人数至少为1人",{icon:6});
        }
    });

    //监听工具条
    table.on('tool(table)', function(obj){
        var data = obj.data;
        var id = data.id;
        var positionName = data.positionName;
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
				title: ['查看', 'font-size:12px;background-color:#0678CE;color:#fff'],
				type: 1,
                offset:'auto',
				content: $('#lookInfo'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
				area: ['950px', '600px'],
				closeBtn: 1,
				shade: [0.1, '#fff'],
				end: function() {
					$('#lookInfo').hide();
				    $("#lookInfo").find("input").val("");
                    $("#lookInfo").find("textarea").val("");
					$("#lookInfo").find("img").attr("src", "");
				},
				success: function(layero, index) {
                    $("#lookInfo").find(".layui-form-item").eq(0).find("input").val(data.positionName);
                    $("#lookInfo").find(".layui-form-item").eq(1).find("input").val(data.workType);
                    $("#lookInfo").find(".layui-form-item").eq(2).find("input").eq(0).val(data.provincial);
                    $("#lookInfo").find(".layui-form-item").eq(2).find("input").eq(1).val(data.city);
                    $("#lookInfo").find(".layui-form-item").eq(3).find("input").val(data.recruitNum);
                    $("#lookInfo").find(".layui-form-item").eq(4).find("input").val(data.workNature);
                    if(data.status==1){
                        $("#lookInfo").find(".layui-form-item").eq(5).find("input").val("发布");
                    }else if(data.status==2){
                        $("#lookInfo").find(".layui-form-item").eq(5).find("input").val("停用");
                    }
                    $("#lookInfo").find(".layui-form-item").eq(6).find("textarea").val(data.workDuty);
                    $("#lookInfo").find(".layui-form-item").eq(7).find("textarea").val(data.workRestd);
                }
            });
        }else if(obj.event === 'change'){//修改
            layer.open({
                title: ['修改', 'font-size:12px;background-color:#0678CE;color:#fff'],
                type: 1,
                offset:'auto',
                content: $('#addInfo'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                area: ['950px', '600px'],
                btn:["保存","取消"],
                closeBtn: 1,
                shade: [0.1, '#fff'],
                end: function() {
                    $('#addInfo').hide();
                    $('#addInfo').find(".clear-input").val("");
                    $('#addInfo').find(".layui-textarea").val("");
                    $(".joinName").find("input").val(1);
                },
                success: function(layero, index) {
                    //给保存按钮添加form属性
                    $("div.layui-layer-page").addClass("layui-form");
                    $("a.layui-layer-btn0").attr("lay-submit","");
                    $("a.layui-layer-btn0").attr("lay-filter","formdUpdate");

                    $("#jobTitle").val(data.positionName);
                    $("#workType").val(data.workType);
                    $("#city").attr("data-name",data.city);
                    $("#city").val(data.city);
                    $(".joinName input").val(data.recruitNum);
                    $("#work").val(data.workNature);
                    $("#work").attr("data-name",data.workNature);
                    $("#isOpen").val(data.status);
                    $("#isOpen").attr("data-type",data.status);
                    $("#duty").val(data.workDuty);
                    $("#requir").val(data.workRestd);
                    form.render();
                },
                yes:function(index, layero){
                    form.on('submit(formdUpdate)',function(data){
                        if(data) {
                            var positionName = $.trim($("#jobTitle").val());
                            var provincial = $("#province").attr("data-name");
                            var workType = $.trim($("#workType").val());
                            var city = $("#city").attr("data-name");
                            var recruitNum = $.trim($(".joinName input").val());
                            var workNature = $("#work").attr("data-name");
                            var workDuty = $.trim($("#duty").val());
                            var workRestd = $.trim($("#requir").val());
                            var status = $("#isOpen").attr("data-type");
                            if(recruitNum=="" || recruitNum=="0"){
                                layer.msg('请填写正确的人数', {icon: 6});
                            }else{
                                changeSet(1,id,status,index,positionName,workType,provincial,city,recruitNum,workNature,workDuty,workRestd);
                            }
                        }
                    })
                }
            });
        }else if(obj.event === 'open'){//开启
            changeSet(2,id,2);
        }else if(obj.event === 'close'){//关闭
            changeSet(2,id,1);
        }
    });


    //修改接口
    function changeSet(type,id,status,index,positionName,workType,provincial,city,recruitNum,workNature,workDuty,workRestd){
        var param = {
            "id":id,
            "usercode":userId,//创建人id
            "status":status//状态 1为激活 2为冻结
        }
        if(type==1){//修改
            param.positionName=positionName;
            param.workType=workType;
            param.provincial=provincial;
            param.city=city;
            param.recruitNum=recruitNum;
            param.workNature=workNature;
            param.workDuty = workDuty;
            param.workRestd=workRestd;
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
                        var city = $.trim($("#phone").val()) || "";
                        var name = $.trim($("#name").val()) || "";
                        temple(city,name);
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