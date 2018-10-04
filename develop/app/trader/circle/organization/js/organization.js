$(function(){
    sessionStorage.clear();
    var IDMark_A = "_a",
        style="font-size:18px;background-color:#363c54;color:#fff;font-weight:bold;text-align:center;height:60px;line-height:60px;font-family:'微软雅黑';letter-spacing:1px;",
        merchantId=getQueryString('merchantId');
        shopParams={
            merchantId:merchantId
        };
        console.log('商户id',merchantId);
    //加载左侧tree
    function tree(){
        var zNodes;
        setting = {
            view: {
                // addHoverDom: addHoverDom,
                removeHoverDom: removeHoverDom,
                showIcon:false,
                showLine:false
            },
            data: {
                key:{
                    name:'detailName'
                },
                simpleData: {
                    enable: true,
                    idKey:'detailId',
                }
            },
            callback: {
                onClick: zTreeOnClick
            }
        };
        reqAjaxAsync('fans/getGroupListForBack',JSON.stringify(shopParams)).done(function(res){
			if(res.code==1){
                var teamList=[];
                for(let i=0;i<res.data.length;i++){
                    teamList.push({
                        detailName:res.data[i].detailName,
                        detailId:res.data[i].detailId
                    })
                }
                zNodes=res.data;
                $.fn.zTree.init($("#treeDemo"), setting, zNodes);
                selectNodes();
			}else{
				layer.msg(res.msg);
			}
		})
    }
    tree();

    //获取tree第一个节点,首次加载table
    function selectNodes(){
        var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
        //获取节点
        var nodes = treeObj.getNodes();
        treeObj.selectNode(nodes[0]);
        setting.callback.onClick(null, treeObj.setting.treeId, nodes[0]);
        if (nodes.length>0) {
            // table(nodes[0].detailId,'','',nodes[0].detailName);
            sessionStorage.setItem('teamName',nodes[0].detailName);
            sessionStorage.setItem('detailId',nodes[0].detailId);
        }
    }


    //悬浮当前列添加自定义按钮
    function zTreeOnClick(event,treeId, treeNode){
        if (treeNode.parentNode && treeNode.parentNode.id!=1) return;
        var aObj = $("#" + treeNode.tId + IDMark_A);
        if ($("#diyBtn_"+treeNode.detailId).length>0) return;
        var optionBtn="<div class='option' id='diyBtn_" +treeNode.detailId+ "'><div></div>"
                      +"<ul class='optionList' id='ul_" +treeNode.detailId+ "'>"
                      +"<li class='addNewLevel' flag="+treeNode.detailId+" data-teamName="+treeNode.detailName+">增加下级小组</li>"
                      +"<li class='editInfo' flag="+treeNode.detailId+" data-userId="+treeNode.userId+">修改组信息</li>"
                      +"<li class='moveTeam' flag="+treeNode.detailId+" data-teamName="+treeNode.detailName+">小组移动</li>"
                      +"<li class='dismiss' flag="+treeNode.detailId+" data-teamName="+treeNode.detailName+">解散该组</li>"
                      +"</ul></div>"
        aObj.append(optionBtn);
        $("#diyBtn_"+treeNode.detailId).find('div').bind('click',function(e){
            e.stopPropagation();
            $('.optionList').fadeOut();
            let ul=$(this).next('.optionList'); 
           if(ul.css('display')=='none'){
               ul.fadeIn();
           }else{
               ul.fadeOut();
           }
        })

        //加载table
        table(treeNode.detailId,'','',treeNode.detailName);
        sessionStorage.setItem('teamName',treeNode.detailName);
        sessionStorage.setItem('detailId',treeNode.detailId);
    }

    //悬浮其他列去掉按钮
    function removeHoverDom(treeId, treeNode) {
        $("#diyBtn_"+treeNode.detailId).unbind().remove();
        
    }

    //点击tree动态改变table
    // function zTreeOnClick(event,treeId,treeNode){
    //     table(treeNode.detailId,'','',treeNode.detailName);
    //     sessionStorage.setItem('teamName',treeNode.detailName);
    //     sessionStorage.setItem('detailId',treeNode.detailId);
    // }  
    
    //加载table
    function table(detailId,memberId,flag,name){
        let params={
            detailId:detailId
        }
        reqAjaxAsync('fans/getFansGroupPersonForBack',JSON.stringify(params)).done(function(res){
            if(res.code==1){
                var personList=[];
                if(flag&&flag=='search'){
                    for(let i=0;i<res.data.personList.length;i++){
                        if(res.data.personList[i].memberId==memberId){
                            personList.push(res.data.personList[i]);
                        }
                    }
                }else{
                    personList=res.data.personList;
                }
                for(let i=0;i<personList.length;i++){
                    if(personList[i].type==1){
                        personList[i].type='领袖';
                    }else{
                        personList[i].type='成员';
                    }
                }
                layui.use('table', function(){
                    var table=layui.table;
                    table.render({
                    elem: '#table'
                    ,data:personList
                    ,page: true //开启分页
                    ,cols: [[ //表头
                        {field: 'memberName', title: '姓名', width:200,fixed:'left'}
                        ,{field: 'type', title: '身份', width:180,}
                        ,{field: 'mobile', title: '电话号码', width:180} 
                        ,{field: 'finace', title: '经费查看', width: 200}
                        ,{field: 'option', title: '操作', width: 240,toolbar: '#barDemo'}
                    ]]
                    ,skin:'nob'
                    }); 
                    colorChange();
                    table.on('tool(table)', function(obj){ //tool是工具条事件名，table是table原始容器的属性 lay-filter="对应的值"
                        var data = obj.data; //获得当前行数据
                        var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
                        var tr = obj.tr; //获得当前行 tr 的DOM对象
                        if(layEvent === 'detail'){ //查看
                            detail(data);
                        } else if(layEvent === 'move'){ //移组
                            move(data,detailId,name);
                            sessionStorage.setItem('flag','memberMoveTeam');
                            sessionStorage.setItem('detailId',detailId);
                            sessionStorage.setItem('userId',data.userId);
                        } else if(layEvent === 'delete'){ //删除
                            del(data,detailId);
                        }else if(layEvent === 'edit'){ //修改
                            edit(data,detailId);
                            sessionStorage.setItem('shopParams',JSON.stringify(shopParams));
                            sessionStorage.setItem('detailId',detailId);
                            sessionStorage.setItem('flag','addNewLevel');
                            sessionStorage.setItem('userId',data.userId);
                        }
                    });  
                });
            }else{
                layer.msg(res.msg);
            }
        })
        
    }

    function colorChange(){//改变领袖字体颜色
        $("td[data-field=type]").each(function(){
            if($(this).find('div').text()=='领袖'){
                $(this).find('div').css('color','#fb792d');
            }
        })
    }

    function detail(data){//查看
        layer.open({
            type: 2,
            title: ['查看详情',style],
            shadeClose: true,
            // closeBtn:false,
            shade: 0.8,
            area: ['1200px','600px'],
            content: ['info.html'],
            closeBtn:1,
            success: function(layero, index){
                var body = layer.getChildFrame('body', index),//获取弹窗的内容
                    params={
                        memberId:data.memberId
                    }
                body.find('span#name').text(data.memberName);
                body.find('span#number').text(data.mobile);
                body.find('span#amount').text(data.finace);
                reqAjaxAsync('fans/fansTeamDetailFund',JSON.stringify(params)).done(function(res){//查询经费明细
                    if(res.code==1){
                        let list=res.data,
                            sHtml=''
                        if(list.length<=0){//无数据
                            sHtml='<li>暂无数据</li>';
                        }else{
                            for(let i=0;i<list.length;i++){//有数据
                                list[i].order=i+1;
                                if(list[i].financeDesc==''){
                                    list[i].financeDesc='--'
                                }
                                sHtml+="<li><div class='order'>"+list[i].order+"</div>"
                                        +"<div class='time'>"+list[i].createTime+"</div>"
                                        +"<div class='change'>"+list[i].financeChange+"</div>"
                                        +"<div class='remain'>"+list[i].financeRemain+"</div>"
                                        +"<div class='reason'>"+list[i].financeDesc+"</div>"
                                        +"</li>"
                            }
                        }
                        body.find('ul#list').append(sHtml);
                    }else{
                        layer.msg(res.msg);
                        return
                    }
                })
              }
        })
    }

    function move(data,detailId,name){//成员移组按钮
        layer.open({
            type: 2,
            title: ['成员移组',style],
            shadeClose: true,
            closeBtn:false,
            shade: 0.8,
            area: ['700px','450px'],
            content: ['moveTeam.html'],
            btn: ['保存','关闭'],
            btn1:function(index, layero){
                var body = layer.getChildFrame('body', index);
                if(body.find('#team').val()=='请选择'){
                    layer.msg('请选择组');
                    return;
                }
                let params={
                        personId:data.personId,
                        detailId:body.find('#team').val()
                    }
                reqAjaxAsync('fans/movePersonForBack',JSON.stringify(params)).done(function(res){
                    if(res.code==1){
                       table(detailId);
                       layer.closeAll();
                    }else{
                        layer.msg(res.msg);
                        return
                    }
                })
            },
            btn2:function(index, layero){
                layer.closeAll();
            },
            success:function(layero, index){
                var body = layer.getChildFrame('body', index);
                body.find('#infoBox').show().find('#name').text(data.memberName);
                body.find('#infoBox').find('#teamInfo').text(name);
            }
        })
    }

    function del(data,detailId){//成员删除按钮
        layer.open({
            type: 1,
            title: ['删除成员',style],
            shadeClose: true,
            closeBtn:false,
            shade: 0.8,
            area: ['700px','250px'],
            content: '<div style="line-height:120px;font-weight:bold;font-size:16px;text-indent:60px;">是否确定删除该成员?</div>',
            btn: ['保存','关闭'],
            btn1:function(index, layero){
                var body = layer.getChildFrame('body', index),
                    params={
                        personId:data.personId
                    }
                reqAjaxAsync('fans/delPersonForBack',JSON.stringify(params)).done(function(res){
                    if(res.code==1){
                        table(detailId);
                        layer.closeAll();
                    }else{
                        layer.msg(res.msg);
                        return
                    }
                })
            },
            btn2:function(index, layero){
                layer.closeAll();
            }
        })
    }

    function edit(data,detailId){//修改按钮
        layer.open({
            type: 2,
            title: ['修改领袖',style],
            shadeClose: true,
            closeBtn:false,
            shade: 0.8,
            area: ['700px','400px'],
            content: ['editLeader.html'],
            btn: ['保存','关闭'],
            btn1:function(index, layero){
                var body = layer.getChildFrame('body', index);
                if(body.find('#person').val()==''||body.find('#person').val()==null){
                    layer.msg('请先选择领袖');
                    return;
                }
                let params={
                        userId:body.find('#person').val(),
                        detailId:detailId
                    }
                
                if(body.find('#noleader').css('display')=='block'){
                    layer.closeAll();
                    return
                }
                reqAjaxAsync('fans/uptLeaderForBack',JSON.stringify(params)).done(function(res){
                    if(res.code==1){
                        table(detailId);
                        layer.closeAll();
                    }else{
                        layer.msg(res.msg);
                        return
                    }
                })
            },
            btn2:function(index, layero){
                layer.closeAll();
            },
            success:function(layero, index){
                var body = layer.getChildFrame('body', index)
                body.find('#name').text(data.memberName);
            }
        })
    }

    //增加一级小组
    $('#addNewTeam').click(function(){
        sessionStorage.setItem('shopParams',JSON.stringify(shopParams));
        sessionStorage.setItem('flag','addNew');
        add('新建一级小组');
    })

    //增加下级小组
    $('.ztree').on('click','.addNewLevel',function(){
        sessionStorage.setItem('shopParams',JSON.stringify(shopParams));
        sessionStorage.setItem('flag','addNew');
        add('新建下级组',$(this).attr('flag'),$(this).attr('data-teamName'));
    })

    function add(title,flag,name){
        var name=name;
        layer.open({
            type: 2,
            title: [title,style],
            shadeClose: true,
            closeBtn:false,
            shade: 0.8,
            area: ['700px', '570px'],
            content: ['addNewLevel.html'],
            btn: ['保存','关闭'],
            btn1:function(index, layero){
                if(sessionStorage.getItem('clickFlag')=='clicked'){
                    return false;
                }
                sessionStorage.setItem('clickFlag','clicked');
                var body = layer.getChildFrame('body', index);
                if(check(body)==false){
                    return
                }
                let params={
                        userId:JSON.parse(body.find('#person').val()),
                        detailName:body.find('#teamName').val().trim(),
                        detailTitle:body.find('#detailTitle').val().trim(),
                        detailTitlePic:sessionStorage.getItem('src'),
                        merchantId:merchantId
                    }
                if(title=='新建下级组'){
                    if(flag){
                        params['detailId']=flag;
                    }
                }
                reqAjaxAsync('fans/addFansTeamForBack',JSON.stringify(params)).done(function(res){
                    if(res.code==1){
                        tree();
                        layer.closeAll();
                    }else{
                        layer.msg(res.msg);
                        return
                    }
                })
            },
            btn2:function(index, layero){
                layer.closeAll();
            },
            success: function(layero, index){
                sessionStorage.removeItem('clickFlag');
                var body = layer.getChildFrame('body', index);
                if(name){
                    body.find('#upteam').show().find('span#upteamName').text(name);
                }
            }
          })
    }

    //校验
    function check(body,edit){
        if(body.find('#teamName').val().trim()==''){
            layer.msg('请填写小组名称');
            return false;
        }else if(body.find('#person').val()==null){
            layer.msg('请选择领袖');
            return false;
        }else if(sessionStorage.getItem('src')==null){
            layer.msg('请上传logo');
            return false;
        }else if(body.find('#detailTitle').val().trim()==''){
            layer.msg('请填写小组口号');
            return false;
        }
    }

    //修改组信息
    $('.ztree').on('click','.editInfo',function(){
        var detailId=$(this).attr('flag'),
            userId=$(this).attr('data-userId'),
            data;
        sessionStorage.setItem('shopParams',JSON.stringify(shopParams));
        sessionStorage.setItem('detailId',detailId);
        sessionStorage.setItem('flag','addNewLevel');
        let params={
            detailId:detailId
        }
        reqAjaxAsync('fans/getGroupDetailForBack',JSON.stringify(params)).done(function(res){
            if(res.code==1){
                data=res.data;
                sessionStorage.setItem('userId',res.data.userId);
                layer.open({
                    type: 2,
                    title: ['修改组信息',style],
                    shadeClose: true,
                    closeBtn:false,
                    shade: 0.8,
                    area: ['700px', '550px'],
                    content: ['editInfo.html'],
                    btn: ['保存','关闭'],
                    btn1:function(index, layero){
                        var body = layer.getChildFrame('body', index)
                        if(sessionStorage.getItem('src')){
                            var detailTitlePic=sessionStorage.getItem('src');
                        }
                        let params={
                            detailTitle:body.find('#detailTitle').val().trim(),
                            detailName:body.find('#teamName').val().trim(),
                            newBossId:body.find('#person').val(),
                            detailTitlePic:detailTitlePic,
                            detailId:detailId
                        }
                        reqAjaxAsync('fans/uptFansTeamForBack',JSON.stringify(params)).done(function(res){
                            if(res.code==1){
                                tree();
                                layer.closeAll();
                            }else{
                                layer.msg(res.msg);
                                return
                            }
                        })
                    },
                    success: function(layero, index){
                        var body = layer.getChildFrame('body', index);
                        body.find('#teamName').val(data.detailName);
                        body.find('#detailTitle').val(data.detailTitle);
                        body.find('button').css('background-image',"url('"+res.data.detailTitlePic+"')");
                        // body.find('#person').val(res.data.userId);
                    }
                  })
            }else{
                layer.msg(res.msg);
                return
            }
        })
    })

    //小组移动
    $('.ztree').on('click','.moveTeam',function(){
        sessionStorage.setItem('shopParams',JSON.stringify(shopParams));
        sessionStorage.setItem('flag','moveTeam');
        sessionStorage.setItem('detailId',detailId);
        var detailId=$(this).attr('flag'),
            teamName=$(this).attr('data-teamName');
        layer.open({
            type: 2,
            title: ['小组移动',style],
            shadeClose: true,
            closeBtn:false,
            shade: 0.8,
            area: ['700px', '450px'],
            content: ['moveTeam.html'],
            btn: ['保存','关闭'],
            btn1:function(index, layero){
                var body= layer.getChildFrame('body', index);
                if(body.find('#team').val()=='请选择'){
                    layer.msg('请选择组');
                    return;
                }
                let params={
                        moveId:body.find('#team').val(),
                        detailId:detailId
                    }
                reqAjaxAsync('fans/moveGroupForBack',JSON.stringify(params)).done(function(res){
                    if(res.code==1){
                        tree();
                        layer.closeAll();
                    }else{
                        layer.msg(res.msg);
                        return
                    }
                })
            },
            success: function(layero, index){
                var body = layer.getChildFrame('body', index);
                var treeObj = $.fn.zTree.getZTreeObj("treeDemo"),
                    node = treeObj.getNodeByParam("detailId",detailId),
                    parentNode=node.getParentNode();
                body.find('#teamBox').show().find('#teamNow').text(teamName);
                if(parentNode==null){
                    body.find('#teamUp').text('无');
                }else{
                    body.find('#teamUp').text(parentNode.detailName);
                }
                
            }
        })
    })

    //解散该组
    $('.ztree').on('click','.dismiss',function(){
        var params={
            detailId:$(this).attr('flag')
        },
        teamName=$(this).attr('data-teamName');
        layer.open({
            type: 2,
            title: ['解散该组',style],
            shadeClose: true,
            closeBtn:false,
            shade: 0.8,
            area: ['700px'],
            content: ['dismiss.html','no'],
            btn: ['确定','关闭'],
            btn1:function(){
                reqAjaxAsync('fans/delGroupForBack',JSON.stringify(params)).done(function(res){
                    if(res.code==1){
                        tree();
                        layer.closeAll();
                    }else{
                        layer.msg(res.msg);
                        return
                    }
                }) 
            },
            success: function(layero, index){
                var body = layer.getChildFrame('body', index);
                body.find('#team').text(teamName);
                $('.layui-layer-btn .layui-layer-btn0').attr('style','background-color:#d9524e!important;border-color:#d9524e!important;');
            }
        })
    })

    //新增成员
    $('#addNewMember').click(function(){
        sessionStorage.setItem('shopParams',JSON.stringify(shopParams));
        sessionStorage.setItem('flag','addNewMember');
        layer.open({
            type: 2,
            title: ['增加成员',style],
            shadeClose: true,
            closeBtn:false,
            shade: 0.8,
            area: ['700px','400px'],
            content: ['addMember.html'],
            btn: ['保存','关闭'],
            btn1:function(index,layero){
                if(sessionStorage.getItem('clickFlag')=='clicked'){
                    return false;
                }
                sessionStorage.setItem('clickFlag','clicked');
                var body = layer.getChildFrame('body', index);
                let obj=body.find('#person').val(),
                    arr=[];
                for(let i in obj){
                    arr[i]=obj[i]
                }
                let userId=arr.join(',');
                let params={
                    detailId:sessionStorage.getItem('detailId'),
                    userId:userId
                }
                if(body.find('#person').val()=='请选择'||body.find('#person').val()==null){
                    layer.msg('请先选择人员');
                    return;
                }
                reqAjaxAsync('fans/addPersonForBack',JSON.stringify(params)).done(function(res){
                    if(res.code==1){
                        table(sessionStorage.getItem('detailId'));
                        layer.closeAll();
                    }else{
                        layer.msg(res.msg);
                        return
                    }
                })
            },
            success: function(layero, index){
                sessionStorage.removeItem('clickFlag');
                var body = layer.getChildFrame('body', index);
                body.find('#teamNow').text(sessionStorage.getItem('teamName'));
            }
          })
    })

    //模糊查询人员
    $('#memberList').focus(function(){
        $(this).attr('flag','unchose');
    })
    $('#memberList').on('input',function(){
        if($(this).val().trim()){
            var key=$(this).val().trim();
            $('#list').fadeIn();
            let params={
                name:key,
                merchantId:merchantId
            }
            reqAjaxAsync('fans/getSomePersonListForBack',JSON.stringify(params)).done(function(res){
                if(res.code==1){
                    let html='',
                        shtml="<li><span class='memberName'>姓名</span>"
                            +"<span class='mobile'>电话号码</span>"
                            +"<span class='team'>小组</span>"
                            +"<span class='type' data-field='type'>身份</span>"
                            +"<span class='finace'>剩余活动经费</span></li>";
                        data=res.data;
                    if(data.length>0){
                        for(let i=0;i<data.length;i++){
                            if(data[i].type==1){
                                data[i].type='领袖';
                            }else{
                                data[i].type="成员";
                            }
                            html+="<li data-detailId="+data[i].fansTeamId+" data-memberId="+data[i].memberId+" data-name="+data[i].fansTeamName+"><span class='memberName'>"+data[i].memberName+"</span>"
                                +"<span class='mobile'>"+data[i].mobile+"</span>"
                                +"<span class='team'>"+data[i].fansTeamName+"</span>"
                                +"<span class='type'>"+data[i].type+"</span>"
                                +"<span class='finace'>"+data[i].finace+"</span></li>"
                        }
                    }else{
                        html="<li>搜索无结果</li>"
                    }
                    $('#list').html(shtml+html);
                    $('#list .type').each(function(){
                        if($(this).text()=='领袖'){
                            $(this).css('color','#fb792d')
                        }
                    });
                    $('#list .memberName').each(function(){
                        $(this).html($(this).text().split(key).join("<span style='color:#e1504d;width:auto'>"+key+"</span>"));
                    })
                }else{
                    layer.msg(res.msg);
                    return
                }
            }) 
        }
    })

    //选择查询人员
    $('#list').on('click','li',function(){
        $('#list').fadeOut();
        $('#memberList').val($(this).find('.memberName').text());
        $('#memberList').attr('data-detailId',$(this).attr('data-detailId'));
        $('#memberList').attr('data-memberId',$(this).attr('data-memberId'));
        $('#memberList').attr('data-name',$(this).attr('data-name'));
        $('#memberList').attr('flag','chose');
    })

    //成员搜索按钮
    $('#personSearch').click(function(){
        sessionStorage.setItem('detailId',$('#memberList').attr('data-detailId'));
        if($('#memberList').attr('flag')=='unchose'){
            layer.msg('请先选择要搜索的成员');
            return;
        }
        var treeObj = $.fn.zTree.getZTreeObj("treeDemo"),
            node = treeObj.getNodeByParam("detailId",$('#memberList').attr('data-detailId'));
            var delay=function(dtd){
                var dtd=$.Deferred();
                treeObj.expandAll(false);
                treeObj.cancelSelectedNode();
                dtd.resolve();
                return dtd.promise();
            }

            $.when(delay()).done(function(){
                treeObj.selectNode(node,true);
                treeObj.expandNode(node, true, false);
            })
        table($('#memberList').attr('data-detailId'),$('#memberList').attr('data-memberId'),'search',$('#memberList').attr('data-name'));
    })

    //小组搜索
    $('#teamSearch').click(function(){
        if($('#teamList').val().trim()){
            let key=$('#teamList').val().trim();
            var treeObj = $.fn.zTree.getZTreeObj("treeDemo"),
                node = treeObj.getNodesByParamFuzzy("detailName",key,null); 
                treeObj.expandAll(false);//先收起所有节点
            for(let i=0;i<node.length;i++){
                // treeObj.expandNode(node[i], true, false);
                if(node[i].getParentNode()){
                    treeObj.expandNode(node[i].getParentNode(),true,false);
                }
            }
            $('#treeDemo .node_name').each(function(){
                $(this).find('span').css('color','#333!important');
                if($(this).text().indexOf(key)>-1){
                    $(this).html($(this).text().split(key).join("<span style='color:#e1504d;'>"+key+"</span>"))
                }
            })
        }else{
            layer.msg('请输入粉小组名称');
        }
    })

    //table跳页处理
    $('.tableBox').on('change','.layui-input',function(){
        // let arr=[],
           let key=$(this).val();
        // $('.tableBox a[data-page]').each(function(){
        //     arr.push($(this).attr('data-page'));
        // })
        // let max=arr.sort().reverse()[0];
        if(key==0){
            layer.msg('跳页数请不要超过最小页数');
            return
        }
        // else if(key>parseInt(max)){
        //     layer.msg('跳页数请不要超过最大页数');
        //     return
        // }
    })

    $('.allWrapper:not(#list)').click(function(){
        $('#list').fadeOut();
    })

    $('.allWrapper:not(.optionList)').click(function(){
        $('#treeDemo .optionList').fadeOut();
    })
})