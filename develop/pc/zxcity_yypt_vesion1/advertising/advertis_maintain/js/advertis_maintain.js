$(function(){
    var CMD_QUERY='operations/queryByType',
        CMD_ADD='operations/addAdRegoin',
        CMD_AREA='operations/queryByLevel',
        CMD_CHECKPRO='operations/getProvinceList',
        CMD_DEL='operations/deleteAdRegoin',
        CMD_EDIT='operations/updateAdRegoin';
    var USERNAME=yyCache.get('username')||'',
        PROVINCE=$('.provice-name').attr('data-id'),
        CITY=$('.city-name').attr('data-id'),
        REGION_Type='1';
    // 初始化
    var startParam={
        regointype:'1',
        provincial:PROVINCE,
        city:CITY
    }
    // console.log(startParam);
    reqAjaxAsync(CMD_QUERY, JSON.stringify(startParam)).done(function (res) {
        res.addStr="新增商圈";
        res.addStr2="新增商城";
        res.regointype=REGION_Type;
        showContent(res);
    })
    $('#search').on('click',function(){
        var name=$('#searchName').val();
        var regionType=$('.advertising-item-type.active').attr('data-type');
        var startParam={
            regointype:regionType,
            provincial:PROVINCE,
            city:CITY,
            regoinname:name
        }
        checkAll(regionType,startParam)
    })
    // 渲染内容
    function showContent(res){
        var tmpl=template('temp',res);
        $('#itemCont').html(tmpl);
        // 滑过编辑，删除显示     
        $('.advertising-item-child').on('mouseover',function(){
            $(this).find('.hover-box').show();
        }) 
        $('.advertising-item-child').on('mouseout',function(){
            $(this).find('.hover-box').hide();
        })  
        $('.advertising-item-nav').on('mouseover',function(){
            $(this).find('.hover-box0').show();
        }) 
        $('.advertising-item-nav').on('mouseout',function(){
            $(this).find('.hover-box0').hide();
        })         
        
        // 新增父类
         $('.addBtn1').on('click',function(){
            $('#addFath1').val('');
            var choseTit=$(this).attr('data-title'),
                btnLevel=$(this).attr('data-level'),
                btnType=$(this).attr('data-regointype');
            layer.open({
                type:1,
                title:choseTit,
                area:['400px','200px'],
                resize:false,
                btn:['确认','取消'],
                content:$('#addFath'),
                yes:function(){
                    var inputVal=$('#addFath1').val();
                    if(inputVal==""){
                        layer.msg('请输入内容！');
                        return false;
                    }
                    var addData={
                        username:USERNAME,
                        provincial:PROVINCE,
                        level:btnLevel,
                        regointype:btnType,
                        regoinname:inputVal,
                        parentid:0,
                        city:CITY
                    }
                    reqAjaxAsync(CMD_ADD, JSON.stringify(addData)).done(function (res) {
                        reloadPage(res);
                    })                  
                },
                btn2:function(){
                  
                },
                end:function(){
                    $('#addFath').hide();
                }
            })                
         }); 
        //  新增子类
         $('.addBtn2').on('click',function(){
             $('#addChild2').val('');
            var choseTit=$(this).attr('data-title'),
                btnLevel=$(this).attr('data-level'),
                btnType=$(this).attr('data-regointype'); 
                // 获取可选的区域,区分是否为市内区域
                console.log(btnType);  
                if(btnType=='2'||btnType=='3'){
                    // 社区，职能部门查询
                    var queryArea={
                        parentcode:CITY
                    }
                    var optHtml="";
                    // console.log(queryArea);
                    reqAjaxAsync(CMD_CHECKPRO, JSON.stringify(queryArea)).done(function (res) {
                        console.log(res);
                        for(var i=0;i<res.data.length;i++){
                            optHtml+= '<option value="'+res.data[i].code+'">'+res.data[i].areaname+'</option>';
                        }
                        $('#addChild1').html(optHtml);  
                    })  
                }else{
                    // 商圈，地铁，公交一级目录查询
                    var queryArea={
                        provincial:PROVINCE,
                        level:'1',
                        regointype:btnType,
                        city:CITY
                    }
                    var optHtml="";
                    console.log(queryArea);
                    reqAjaxAsync(CMD_AREA, JSON.stringify(queryArea)).done(function (res) {
                        console.log(res);
                        for(var i=0;i<res.data.length;i++){
                            optHtml+= '<option value="'+res.data[i].regoinId+'">'+res.data[i].regoinName+'</option>';
                        }
                        $('#addChild1').html(optHtml);  
                    })                     
                }
                
            layer.open({
                type:1,
                title:choseTit,
                area:['400px','250px'],
                resize:false,
                btn:['确认','取消'],
                content:$('#addChild'),
                yes:function(){
                    var inputVal=$('#addChild2').val(),
                        selectVal=$('#addChild1').val(),
                        selectTxt=$("#addChild1").find("option:selected").text();
                    if(inputVal==""){
                        layer.msg('请输入内容！');
                        return false;
                    }
                    if(btnType=='2'||btnType=='3'){
                        var addData={
                            username:USERNAME,
                            provincial:PROVINCE,
                            level:btnLevel,
                            regointype:btnType,
                            regoinname:inputVal,
                            parentid:0,
                            counties:Number(selectVal),
                            countiesname:selectTxt,
                            city:CITY
                        }  
                    }else{
                        var addData={
                            username:USERNAME,
                            provincial:PROVINCE,
                            level:btnLevel,
                            regointype:btnType,
                            regoinname:inputVal,
                            parentid:Number(selectVal),
                            city:CITY
                        }                        
                    }
                    reqAjaxAsync(CMD_ADD, JSON.stringify(addData)).done(function (res) {
                        reloadPage(res);
                    })   
                },
                end:function(){
                    $('#addChild').hide();
                }
            })              
         });  
        //  删除商城
        $('.delItem').on('click',function(){
            var regoinId=Number($(this).attr('data-regionid'));
            layer.open({
                type:1,
                title:'确认删除？',
                btn:['删除','取消'],
                area:['400px','160px'],
                yes:function(){
                    var delData={
                        regoinid:regoinId
                    }
                    reqAjaxAsync(CMD_DEL, JSON.stringify(delData)).done(function (res) {
                        reloadPage(res);
                    });
                }
            })
        });
         //  编辑
         $('.editItem').on('click',function(){
             $('#editName').val($(this).attr('data-name'))
            var regoinId=Number($(this).attr('data-regionid'));
            $('#editName').show();
            layer.open({
                type:1,
                title:'编辑内容',
                btn:['确定','取消'],
                area:['400px','200px'],
                content:$('#editCont'),
                yes:function(){
                    console.log(1)
                    var editData={
                        regoinid:regoinId,
                        regoinname:$('#editName').val(),
                        username:USERNAME
                    }
                    reqAjaxAsync(CMD_EDIT, JSON.stringify(editData)).done(function (res) {
                        reloadPage(res);
                    });
                },
                end:function(){
                    $('#editName').hide();
                }
            })
        });       
         
    }

    
    // 切换城市时重新刷新
	$(".selectcity").on("click","li a",function(){
        setTimeout(function(){
            $('.advertising-item-type').eq(0).trigger('click');
        },500)
	});    
    // 点击切换类型
    $('.advertising-item-type').on('click',function(){
        $('#searchName').val("");
        $(this).addClass('active').siblings().removeClass('active');
        $('#plateName').text($(this).text());
        REGION_Type=$(this).attr('data-type');
        console.log(REGION_Type);
        PROVINCE=$('.provice-name').attr('data-id');
        CITY=$('.city-name').attr('data-id');
        var startParam={
            regointype:REGION_Type,
            provincial:PROVINCE,
            city:CITY
        }
        console.log(startParam);
        checkAll(REGION_Type,startParam);
    })

    function checkAll(REGION_Type,paramData){
        reqAjaxAsync(CMD_QUERY, JSON.stringify(paramData)).done(function (res) {
            console.log(res);
            // console.log(REGION_Type);
            switch(REGION_Type){
                case '1':
                res.addStr="新增商圈";
                res.addStr2="新增商城";
                res.regointype=REGION_Type;
                break;
                case '2':
                res.addStr=null;
                res.addStr2="新增社区";
                res.regointype=REGION_Type;
                break;
                case '3':
                res.addStr=null;
                res.addStr2="新增职能部门";
                res.regointype=REGION_Type;
                break;
                case '4':
                res.addStr="新增线路";
                res.addStr2="新增站点";
                res.regointype=REGION_Type;
                break;
                case '5':
                res.addStr="新增线路";
                res.addStr2="新增站点";
                res.regointype=REGION_Type;
                break;                                                                
            }
            showContent(res);
        })
    }

    // 访问成功后刷新页面
    function reloadPage(res){
        unbindClick();
        layer.msg(res.msg,{time:2000});
        setTimeout(function(){
            layer.load(0,{shade:false});
        },2000);
        setTimeout(function(){
           $('.advertising-item-type').eq(REGION_Type-1).trigger('click');
           layer.closeAll();
        }, 2500);
    }
    //解除点击事件
    function unbindClick(){
        $('.layui-layer-close,layui-layer-btn0,layui-layer-btn1').unbind('click');
    }


});