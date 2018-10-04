$(function(){
    //新增成员,增加一级小组领袖
    if(sessionStorage.getItem('shopParams')&&(sessionStorage.getItem('flag')=='addNewMember'||sessionStorage.getItem('flag')=='addNew')){
        let params=JSON.parse(sessionStorage.getItem('shopParams'));
        getPersonList(params);
    }

    //修改领袖,修改组信息修改领袖
    if(sessionStorage.getItem('shopParams')&&sessionStorage.getItem('detailId')&&sessionStorage.getItem('flag')=='addNewLevel'&&sessionStorage.getItem('userId')){
        let params=JSON.parse(sessionStorage.getItem('shopParams'));
        params['detailId']=sessionStorage.getItem('detailId');
        getPersonList(params,sessionStorage.getItem('userId'));
    }

    //获取人员数据
    function getPersonList(params,userId){
        sessionStorage.setItem('userId',userId);
        reqAjaxAsync('fans/getMorePersonListForBack',JSON.stringify(params)).done(function(res){
            if(res.code==1){
                var memberList=[];
                if(res.data){
                    if(res.data.length<1){
                        $('#person').attr('disabled','disabled');
                        $('#noleader').show();
                    }else{
                        $('#leader').show();
                        for(let i=0;i<res.data.length;i++){
                            memberList.push({
                                text:res.data[i].userName+'('+res.data[i].phone+')',
                                id:res.data[i].userId,
                                isGroup:res.data[i].isGroup
                            })
                        }
                    }
                }               
                $("#person").select2({
                    data: memberList,
                    placeholder:'请选择',//默认文字提示
                    language: "zh-CN",
                    allowClear: true,//允许清空
                    templateResult: formatState,
                    templateSelection: formatState
                })
                $('#person').select2('val',userId);
            }else{
                layer.msg(res.msg);
                return
            }
        })
    }

    function formatState(state) {
        if (state.isGroup!=1) { 
            return state.text; 
        }else{
            var $state = $(
                '<span>' + state.text + '<img src="images/benzu@2x.png" class="img-flag" style="width:44px;height:20px;float:right;"/></span>'
                );
            return $state;
        }
    };

    //小组移组
    if(sessionStorage.getItem('shopParams')&&sessionStorage.getItem('detailId')&&sessionStorage.getItem('flag')=='moveTeam'){
        let shopParams=JSON.parse(sessionStorage.getItem('shopParams')),
            detailId=sessionStorage.getItem('detailId');
            shopParams['detailId']=detailId;
        reqAjaxAsync('fans/getGroupMoveForBack',JSON.stringify(shopParams)).done(function(res){
            if(res.code==1){
                var teamList=[];
                if(res.data.groupInfoList.length>0){
                    let groupInfoList=res.data.groupInfoList;
                    for(let i=0;i<groupInfoList.length;i++){
                        if(groupInfoList[i].detailId!=detailId){
                            teamList.push({
                                text:groupInfoList[i].detailName,
                                id:groupInfoList[i].detailId
                            })
                        }
                    }
                }
                $("#team").select2({
                    data: teamList,
                    placeholder:'请选择组',//默认文字提示
                    language: "zh-CN",
                    allowClear: true//允许清空
                })
            }else{
                layer.msg(res.msg);
                return
            }
        })
    }

    //成员移组
    if(sessionStorage.getItem('detailId')&&sessionStorage.getItem('flag')=='memberMoveTeam'){
        let detailId=sessionStorage.getItem('detailId');
        let params={
            detailId:detailId,
            userId:sessionStorage.getItem('userId')
        };
        reqAjaxAsync('fans/getFasnGroup',JSON.stringify(params)).done(function(res){
            if(res.code==1){
                var teamList=[];
                if(res.data.length>0){
                    for(let i=0;i<res.data.length;i++){
                        if(res.data[i].detailId!=detailId){
                            teamList.push({
                                text:res.data[i].detailName,
                                id:res.data[i].detailId
                            })
                        }
                    }
                }
                $("#team").select2({
                    data: teamList,
                    placeholder:'请选择组',//默认文字提示
                    language: "zh-CN",
                    allowClear: true//允许清空
                })
            }else{
                layer.msg(res.msg);
                return
            }
        })
    }
})