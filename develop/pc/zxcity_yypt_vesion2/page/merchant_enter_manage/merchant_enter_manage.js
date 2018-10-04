layui.use(['form', 'layer', 'laydate', 'table', 'laypage', ], function () {
    var layer=layui.layer,form = layui.form,table=layui.table,laypage=layui.laypage,laydate=layui.laydate;
    var userId = yyCache.get('userId') || ''
    var page = 1,rows = 15;
    var AREA = ['90%', '90%'];
    var TITLE = ['', 'font-size:12px;background-color:rgb(66, 70, 81);color:#fff'];
    var SHADE = [0.2, '#000'];
    var imgPath = '../../common/images/placeholder.png';
    var USER_URL = {
        RESOURLIST: 'operations/queryMerchantSettleinPage', //(查询列表)
        PROVINCE: 'operations/getProvinceList', //省市接口
        PROVINCEBYID: 'operations/getBaseAreaInfoByCode', //省
        INFORMATION:'operations/getMerchantSettleinById',//详情查询
        EDIT:'operations/updateMerchantSettleinInfo'//编辑入驻信息
    };
    $(function(){
        //渲染表单
        form.render()
        //加载表格
        init_obj();
        //初始化加载省市
        loadProvinceAndCity({
            'parentcode': 0
        });
        //时间控件
        laydate.render({
            elem: '#date'
            // ,type: 'datetime'
            ,range: '至'//设置时间段
            ,format: 'yyyy-MM-dd'
            ,theme: '#009688'
        });
    })
    //审核待审核
    $('.tab_box button').click(function () {
        $(this).addClass('active').removeClass('op5').siblings().addClass('op5').removeClass('active');
        var type = $(this).attr('data-type');
        init_obj();
    })
    $('#searchBtn').click(function () {
        init_obj();
    })
    $('#restBtn').click(function () {
        $('.header').find('input,select').val('');
        init_obj();
    })
    //查看
    function getDetails(obj,title) {
        var el = $('#addDemo')
        var reDatas = obj.data;
        TITLE[0] = title
        layer.open({
            title: TITLE,
            type: 1,
            content: el, //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
            area: '60%',
            btn:['确认','取消'],
            end: function (layero,index) {
                layer.close(index);
                emptyInput(el);
            },
            success:function (layero,index) {
                //省
                var param = {
                    code: reDatas.provinceId
                };
                reqAjaxAsync(USER_URL.PROVINCEBYID, JSON.stringify(param)).then(function(req){
                    if(req.code == 1) {
                        reDatas['userprovice'] = req.data.areaname;
                    } else {
                        layer.msg(req.msg);
                    };
                }).done(function () {
                    //市
                    var params = {
                        code: reDatas.cityId
                    };
                    reqAjaxAsync(USER_URL.PROVINCEBYID, JSON.stringify(params)).then(function(reqs){
                        if(reqs.code == 1) {
                            reDatas['usercity'] = reqs.data.areaname;
                        } else {
                            layer.msg(reqs.msg);
                        };
                    }).done(function (reqss) {
                        setDatas(el,reDatas)
                    })
                })
                el.find('input,textarea').attr('readonly','')
                console.log('5255')
            },btn1:function (index) {
                layer.close(index)
            }
        })
    }
    function saveDetails(data){
        var params = {
            id:data.id,
            remarks:$.trim($('#remarks').val()) || '',
            contactsUserId:userId
        }
        reqAjaxAsync(USER_URL.EDIT,JSON.stringify(params)).done(function (res) {
            if(res.code ==1){
                init_obj()
            }
            layer.msg(res.msg)

        })
    }
    //操作表格
    table.on('tool(tableNo)',function (obj) {
        console.log(obj)
        if(obj.event ==='detail'){
            getDetails(obj,'查看');
        }else if(obj.event === 'change'){
            getDetails(obj,'处理');
            $('#remarks').removeAttr('readonly')
            setForms('changeForms')
            form.on('submit(changeForms)',function (data) {
                saveDetails(obj.data);
            })
        }
    })
    //渲染表格
    function init_obj() {
        var objs = tableInit('tableNo', [
                [{
                    title: '序号',
                    align: 'left',
                    field: 'eq',
                    width: 200
                }, {
                    title: '手机号',
                    align: 'left',
                    field: 'phone',
                    width: 224
                }, {
                    title: '商户名称',
                    align: 'left',
                    field: 'merchantName',
                    width: 224
                }, {
                    title: '真实姓名',
                    align: 'left',
                    field: 'realName',
                    width: 330
                }, {
                    title: '创建时间',
                    align: 'left',
                    field: 'createTime',
                    width: 300,
                    event: 'changeSwitch'
                },{
                    title: '操作',
                    align: 'left',
                    fixed: 'right',
                    toolbar: '#barDemo',
                    width: 250
                }]
            ],

            pageCallback, 'laypage'
        );
    }
    //pageCallback回调
    function pageCallback(index, limit) {
        var status = $('.tab_box button.active').attr('data-type');
        var time = $('#date').val().split(' 至 ');
        var params = {
            page: index,
            rows: limit,
            status:status,
            merchantName:$.trim($('#merchantNames').val()) || '',
            phone:$.trim($('#phones').val()) || '',
            provinceId:$.trim($('#provinceSelector1').val()) || '',
            cityId:$.trim($('#citySelector1').val()) || '',
            realName:$.trim($('#realNames').val()) || '',
            createTimeStart:time[0]||'',
            createTimeEnd:time[1] || time[0] || '',

        }
        return getData(USER_URL.RESOURLIST, JSON.stringify(params));
    }
    //获取数据
    //左侧表格数据处理
    function getData(url, parms) {
        var deff = $.Deferred();
        reqAjaxAsync(url, parms).done(function (res) {
            var data = res.data
            console.log(data)
            $.each(data, function (i, item) {
                $(item).attr('eq', (i + 1));
            })
            deff.resolve(res)
        })
        return deff.promise();
    }
    //表格
    function tableInit(tableId, cols, pageCallback, pageLeft) {
        var tableIns, tablePage;
        //1.表格配置
        tableIns = table.render({
            id: tableId,
            elem: '#' + tableId,
            // height: 'full-185',
            cols: cols,
            page: false,
            even: true,
            skin: 'rows',
            limit: 15
        });

        //2.第一次加载
        pageCallback(page,rows).done(function (res) {
            //第一页，一页显示15条数据
            if(res.code == 1) {
                tableIns.reload({
                    data: res.data
                })
            } else {
                layer.msg(res.msg)
            }
            //3.left table page
            var page_options = {
                elem: pageLeft,
                count: res ? res.total : 0,
                layout: ['count', 'prev', 'page', 'next','limit', 'skip'],
                limits: [15, 30],
                limit: 15
            }
            page_options.jump = function(obj, first) {
                tablePage = obj;

                //首次不执行
                if(!first) {
                    pageCallback(obj.curr, obj.limit).done(function (resTwo) {
                        if(resTwo && resTwo.code == 1)
                            tableIns.reload({
                                data: resTwo.data,
                                limit:obj.limit
                            });
                        else
                            layer.msg(resTwo.msg);
                    })

                }
            }

            laypage.render(page_options);

            return {
                tablePage,
                tableIns
            };
        });

    }

    //加载省市数据
    function loadProvinceAndCity(param) {
        reqAjaxAsync(USER_URL.PROVINCE,JSON.stringify(param)).then(function(res){
            if(res.code == 1) {
                var sHtml = '<option value="">选择省</option>';

                for(var i = 0, len = res.data.length; i < len; i++) {
                    sHtml += '<option value="' + res.data[i].code + '">' + res.data[i].areaname + '</option>'
                }
                if(param['parentcode'] == 0) {
                    $("#provinceSelector1").html(sHtml);
                    $("#citySelector1").attr("disabled",'disabled');
                } else {
                    $("#citySelector1").html(sHtml);

                }
                form.render('select')
            }
        })
    }

    //加载市
    function getCity(cityid) {
        var param = {
            parentcode: cityid
        }
        reqAjaxAsync(USER_URL.PROVINCE, JSON.stringify(param)).done(function(res) {
            if(res.code == 1) {
                var mhtml = "选择市";
                for(var i = 0, len = res.data.length; i < len; i++) {
                    mhtml += '<option value="' + res.data[i].code + '">' + res.data[i].areaname + '</option>'
                }
                if(cityid == 0) {
                    $("#provinceSelector1").html(mhtml);
                } else {
                    $("#citySelector1").html(mhtml);
                }
                form.render('select')
            } else {
                layer.msg(res.msg);
            }

        });

    }


    //根据省的选择切换对应的市内容
    form.on('select(provinceSelector1)',function (data) {
        var _value = data.value;
        if(_value == "") {
            $("#citySelector1").attr("disabled", 'disabled').html('<option value="">选择市</option>')
        } else {
            $("#citySelector1").removeAttr("disabled")
            getCity(_value)
        }
        form.render();
    })

    // //layer展开
    // $('body').on('click', '.package-some', function() {
    //     if($(this).children('i.description').html() == '展开') {
    //         $(this).children('i.description').html('收起')
    //         $(this).children('i.icon').addClass('deg');
    //         $(this).parent().siblings('.app-layer-content').children('ul').hide();
    //         $(this).parent().siblings('.app-layer-content').children('.layer-place').show();
    //     } else {
    //         $(this).children('i.description').html('展开')
    //         $(this).children('i.icon').removeClass('deg');
    //         $(this).parent().siblings('.app-layer-content').children('ul').show();
    //         $(this).parent().siblings('.app-layer-content').children('.layer-place').hide();
    //     }
    // })
    // $('body').on('click', '.layer-place', function() {
    //     $(this).hide();
    //     $(this).siblings('ul').show();
    //     $(this).parent().siblings().children('.package-some').children('.description').html('展开');
    //     $(this).parent().siblings().children('.package-some').children('.icon').removeClass('deg');
    // })
})