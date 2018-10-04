var app = angular.module('myApp', ['ui.bootstrap','ui.select','ng-layer']);
app.config(['$locationProvider', function($locationProvider) {  
    // $locationProvider.html5Mode(true);  
    $locationProvider.html5Mode({
     enabled: true,
     requireBase: false
    });
   }
]);

app.controller('statusController', ['$scope','$http','$uibModal','$location','locals',function($scope,$http,$uibModal,$location,locals) {
        //查看三个接口的数据是否加载完
        $scope.isStatusDatas = false;
        $scope.isCheckHistory = false;
        $scope.isActiveMembers = false;
        //进入状态页后弹出加载层
        loading_layer = layer.load(0, {
            shade: [0.6,'#fff'] //0.1透明度的白色背景
        });
        //三个接口数据全部加完后 关闭加载层
        $scope.$watchGroup(["isStatusDatas","isCheckHistory","isActiveMembers"], function (newVal,oldVal) {
            // console.log("new:"+newVal,"old:"+oldVal);    
            //注意：newVal与oldVal都返回的是一个数组
            $scope.is_show_loading = true;
            angular.forEach(newVal,function(value, key){
                if(value == false){
                    $scope.is_show_loading = false;
                    return;
                }
            })
            if($scope.is_show_loading == true){
                layer.close(loading_layer)
            }
        });
        
        
        //显示下方审批与拒绝按钮
        $scope.showCheckBtn = true;
        //获取url中的参数
        if($location.search().isAuth==0){
            $scope.showCheckBtn = false;
        };
        $scope.userId = '';
        $scope.merchantId = '';
        if($location.search().userId){
            $scope.userId = $location.search().userId;
        };
        if($location.search().merchantId){
            $scope.merchantId = $location.search().merchantId;
        };

        //获取 活动id (存放在localstorage里)
        window.addEventListener('storage', function (e) {
            // console.log('newValue', e.newValue);
            $scope.activityId = e.newValue;
            $scope.getActiveStatusDatas(e.newValue, $scope.userId, $scope.merchantId);
            $scope.getCheckHistory(e.newValue, $scope.userId);
            $scope.getActiveMembers(e.newValue);

        })
        window.onunload = function(){//页面刷新删除localStorage
            localStorage.removeItem('status_active_id');
        }
        $scope.getAllData = function(user_id, merchant_id){
            $scope.active_id = localStorage.getItem("status_active_id");
            $scope.getActiveStatusDatas($scope.active_id, user_id, merchant_id);
            $scope.getCheckHistory($scope.active_id, user_id);
            $scope.getActiveMembers($scope.active_id);
        }

        //获取活动状态数据
        $scope.getActiveStatusDatas = function(activity_id, user_id, merchant_id){
            $http({    
                method: "POST",    
                url: '/zxcity_restful/ws/rest',    
                data: {
                    cmd: 'fans/getFansActivityDetail',
                    data: JSON.stringify({
                        activityId: activity_id,
                        userId: user_id,
                        merchantId: merchant_id
                    }),
                    version: 1.0
                },  
                headers: { 
                    'apikey': 'test' ,
                    'Content-Type': 'application/x-www-form-urlencoded' 
                },    
                transformRequest: function(obj) {    
                    var str = [];    
                    for (var p in obj) {    
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));    
                    }    
                    return str.join("&");    
                }  
            }).success(function(response, status, headers, config){  
                //活动状态数据加载完毕
                $scope.isStatusDatas = true;        
                $scope.activeStatusData = response.data;
                //判断登录的 是不是活动发布人
                if($scope.userId == response.data.userId){
                    $scope.isMyAc = 1;
                }else{
                    $scope.isMyAc = 0;
                }
                // console.log($scope.isMyAc)
                angular.forEach($scope.activeStatusData,function(val,key,data){
                    //应退 & 应补
                    data['giveOrGet'] = data['realMoney'] - data['totalMoney'] 
                    if(data['giveOrGet']<=0){
                        data['give'] = 0-data['giveOrGet']
                    }else{
                        data['get'] = data['giveOrGet']
                    }
                })
                $scope.activeStep = $scope.activeStatusData.stepId + 1;

                //如果目前登录的不是审批人，则不能进行审批（下面按钮不显示）
                if(response.data.nextAudUser != $scope.userId){
                    $scope.showCheckBtn = false;
                }else{
                    $scope.showCheckBtn = true;
                }

                //不是本人发布的活动 不显示编辑按钮
                if(response.data.userId != user_id){
                    $scope.showEditBtn = false;
                }else if(response.data.stepId ==6){
                    $scope.showEditBtn = false;
                }else{
                    $scope.showEditBtn = true;
                }

                $('#stepbar').children().remove();
                $scope.stepBar($scope.activeStep);
            });
        }
        // $scope.getActiveStatusDatas();
        //编辑按钮
        $scope.openEditPage = function(){     
            var merchantId = $scope.merchantId;
            var userId = $scope.userId;
            var active_id = localStorage.getItem('status_active_id');
            layer.open({
                type: 2,
                content: '../add-or-edit/add-or-edit.html?merchantId='+merchantId+'&&userId='+userId+ '&&type=1'+'&&activityId='+active_id + '&&stepId='+$scope.activeStatusData.stepId,
                title: false,
                btn: false,
                area: ['80%', '80%'],
                // success : function(){
                    
                // }
            });
        }

        //获取审核历史
        $scope.getCheckHistory = function(activity_id ,user_id){
            $http({    
                method: "POST",    
                url: '/zxcity_restful/ws/rest',    
                data: {
                    cmd: 'fans/checkActivityHis',
                    data: JSON.stringify({
                        activityId: activity_id,
                        userId: user_id
                    }),
                    version: 1.0
                },  
                headers: { 
                    'apikey': 'test' ,
                    'Content-Type': 'application/x-www-form-urlencoded' 
                },    
                transformRequest: function(obj) {    
                    var str = [];    
                    for (var p in obj) {    
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));    
                    }    
                    return str.join("&");    
                }  
            }).success(function(response, status, headers, config){  
                //审核历史数据加载完毕
                $scope.isCheckHistory = true;      
                $scope.historyDatas = response.data;
                // console.log($scope.historyDatas)
                if($scope.historyDatas){
                    if($scope.historyDatas[0].type ==1){
                        $scope.actype = 1; //补录
                    }else{
                        $scope.actype = 2; //非补录
                    }
                }else{
                    $scope.actype = 2; //非补录
                }
  
            });
        }
        //获取历史审核人
        $scope.getHisAuditors = function(){
            $http({    
                method: "POST",    
                url: '/zxcity_restful/ws/rest',    
                data: {
                    cmd: 'fans/getShopHisAuditors',
                    data: JSON.stringify({
                        merchantId: $scope.merchantId,
                        userId: $scope.userId,
                        sStartpage: 1,
                        sPagerows: 5
                    }),
                    version: 1.0
                },  
                headers: { 
                    'apikey': 'test' ,
                    'Content-Type': 'application/x-www-form-urlencoded' 
                },    
                transformRequest: function(obj) {    
                    var str = [];    
                    for (var p in obj) {    
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));    
                    }    
                    return str.join("&");    
                }  
            }).success(function(response, status, headers, config){ 
                $scope.hisAuditors = response.data;
            });
        }
        $scope.getHisAuditors();
         //获取参与人员
         $scope.getActiveMembers = function(activityId){
            $http({    
                method: "POST",    
                url: '/zxcity_restful/ws/rest',    
                data: {
                    cmd: 'fans/activityPersonList',
                    data: JSON.stringify({
                        activityId: activityId
                    }),
                    version: 1.0
                },  
                headers: { 
                    'apikey': 'test' ,
                    'Content-Type': 'application/x-www-form-urlencoded' 
                },    
                transformRequest: function(obj) {    
                    var str = [];    
                    for (var p in obj) {    
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));    
                    }    
                    return str.join("&");    
                }  
            }).success(function(response, status, headers, config){           
                $scope.activeMembers = response.data;
                //参与人员加载完毕
                $scope.isActiveMembers = true;
            });
        }

        //修改参与人员    
        $scope.changeMembers = function  (){
            // console.log($scope.activeMembers);
            var memArr = [];
            
            angular.forEach($scope.activeMembers, function(value,key,data){
                memArr.push(value.userId)
            })
            sumList = JSON.stringify(memArr);

             layer.open({
                type: 2,
                area: ['80%', '80%'],
                btn: ['确定'],
                title: false,
                content: '../add-or-edit/selectPeople/selectPeople.html?sumPeople=' + sumList + '&merchantId=' + $scope.merchantId,
                yes: function (index, layero) {
                    var info = window["layui-layer-iframe" + index].callbackdata();
                    sumList = info.selectList;
                    cirList = info.circleList;
                    circleId = [];
                    for (let j = 0; j < cirList.length; j++) {
                        if (j == cirList.length - 1) {
                            circleId += cirList[j];
                        } else {
                            circleId += cirList[j] + ',';
                        }
                    }
            
                    sumListStr = sumList.toString();
                    // console.log(sumListStr)
                    if(sumList.length <1 ){
                        return parent.layer.msg('请选择参加人员')
                    }else{
                        $http({    
                            method: "POST",    
                            url: '/zxcity_restful/ws/rest',    
                            data: {
                                cmd: 'fans/CancelRegistration',
                                data: JSON.stringify({
                                    merchantId: $scope.merchantId,
                                    id: $scope.activityId,
                                    personId: sumListStr,
                                    circleId: circleId
                                }),
                                version: 1.0
                            },  
                            headers: { 
                                'apikey': 'test' ,
                                'Content-Type': 'application/x-www-form-urlencoded' 
                            },    
                            transformRequest: function(obj) {    
                                var str = [];    
                                for (var p in obj) {    
                                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));    
                                }    
                                return str.join("&");    
                            }  
                        }).success(function(response, status, headers, config){   
                            //ajax回调 页面重新获取参与人员 和 活动详情
                            $scope.getActiveStatusDatas($scope.activityId, $scope.userId, $scope.merchantId);
                            $scope.getActiveMembers($scope.activityId);
                            layer.close(index);
                        });
                    }
                    
                }

            })
        }

        //步骤插件cavas，传入参数 -> 第几步
        $scope.stepBar = function(step){
            $('#stepbar').stepbar({
                items: ['活动发布', '活动审核', '经费发放', '结余申请', '结余审核', '结余发放','活动完成'],
                color: '#999',
                fontColor: '#fff',
                textColor: '#999',
                selectedColor: '#25c9c8',
                selectedFontColor: '#fff',
                current: step
            });
        }
        

        //同意活动申请
        $scope.activeAgreeOpenModel = function () {
            $scope.openModalComplete = true;
            var modalInstance = $uibModal.open({
                templateUrl: 'layerTemplate/activeAgree.html',
                controller: 'activeAgreeController',
                openedClass:'test',
                windowClass:'confirm-modal-dialog',
                windowTopClass:'test2',
                resolve: {
                    userId: function(){
                        return $scope.userId;
                    },
                    merchantId: function(){
                        return $scope.merchantId;
                    },
                    
                    activityId: function(){
                        return $scope.activityId;
                    },
                    HisAuditors: function(){
                        return $scope.hisAuditors;
                    },
                    
                }
            });
            modalInstance.result.then(function (result) {
                $('#stepbar').children().remove();
                $scope.openModalComplete = false;
                $scope.getAllData($scope.userId, $scope.merchantId)
                
            },function () {
                $scope.openModalComplete = false;
            });
        };
        //拒绝活动申请
        $scope.activerefuseOpenModel = function () {
            $scope.openModalComplete = true;
            var modalInstance = $uibModal.open({
                templateUrl: 'layerTemplate/refuseMoney.html',
                controller: 'activeRefuseController',
                openedClass:'test',
                windowClass:'confirm-modal-dialog',
                windowTopClass:'test2',
                resolve: {
                    activityId: function(){
                        return $scope.activityId;
                    },
                    Members: function () {
                        return $scope.activeMembers;
                    },
                    userId: function(){
                        return $scope.userId;
                    },
                }
            });
            modalInstance.result.then(function (result) {
                $scope.openModalComplete = false;
                $scope.getAllData($scope.userId, $scope.merchantId)
            },function () {
                $scope.openModalComplete = false;
            });
        };
        //拒绝经费发放
        $scope.refuseMoneyOpenModel = function () {
            $scope.openModalComplete = true;
            var modalInstance = $uibModal.open({
                templateUrl: 'layerTemplate/refuseMoney.html',
                controller: 'refuseMonyController',
                // windowClass:'modal',
                resolve: {
                    activityId: function(){
                        return $scope.activityId;
                    },
                    userId: function(){
                        return $scope.userId;
                    },
                }
            });
            modalInstance.result.then(function (result) {
                $scope.openModalComplete = false;
                $scope.getAllData($scope.userId, $scope.merchantId)

            },function () {
                $scope.openModalComplete = false;
            });
        };
        //同意经费发放
        $scope.accessMoneyOpenModel = function () {
            $scope.openModalComplete = true;
            var modalInstance = $uibModal.open({
                templateUrl: 'layerTemplate/accessMoney.html',
                controller: 'accessMonyController',
                // openedClass:'test',
                // windowClass:'confirm-modal-dialog',
                // windowTopClass:'test2',
                resolve: {
                    activityId: function(){
                        return $scope.activityId;
                    },
                    userId: function(){
                        return $scope.userId;
                    },
                    ActiveStatusData: function(){
                        return $scope.activeStatusData;
                    },
                    merchantId: function(){
                        return $scope.merchantId;
                    },
                    Members: function () {
                        return $scope.activeMembers;
                    }
                }
            });
            modalInstance.result.then(function (result) {
                $scope.openModalComplete = false;
                $scope.getAllData($scope.userId, $scope.merchantId)

            },function () {
                $scope.openModalComplete = false;
            });
        };
        
        $scope.activeSeccessOpenModel = function () {
            $scope.openModalComplete = true;
            var modalInstance = $uibModal.open({
                templateUrl: 'layerTemplate/activeSuccess.html',
                controller: 'activeSeccessController',
                openedClass:'test',
                windowClass:'confirm-modal-dialog',
                windowTopClass:'test2',
                resolve: {
                    Members: function () {
                        return $scope.activeMembers;
                    }
                }
            });
            modalInstance.result.then(function (result) {
                $scope.openModalComplete = false;
                $scope.getAllData($scope.userId, $scope.merchantId)
            },function () {
                $scope.openModalComplete = false;
            });
        };
        //结余申请
        $scope.balanceApplyOpenModel = function () {
            $scope.openModalComplete = true;
            var modalInstance = $uibModal.open({
                templateUrl: 'layerTemplate/balanceApply.html',
                controller: 'balanceApplyController',
                size: 'super-lgs',
                resolve: {
                    activityId: function(){
                        return $scope.activityId;
                    },
                    ActiveData: function(){
                        return $scope.activeStatusData;
                    },
                    merchantId: function(){
                        return $scope.merchantId;
                    },
                    userId: function(){
                        return $scope.userId;
                    },
                }
            });
            modalInstance.result.then(function (result) {
                $scope.openModalComplete = false;
                $scope.getAllData($scope.userId, $scope.merchantId)

            },function () {
                $scope.openModalComplete = false;
            });
        };
        //拒绝结余申请
        $scope.refuseBalanceOpenModel = function () {
            $scope.openModalComplete = true;
            var modalInstance = $uibModal.open({
                templateUrl: 'layerTemplate/refuseMoney.html',
                controller: 'refuseBalanceApplyController',
                size: 'super-lgs',
                resolve: {
                    activityId: function(){
                        return $scope.activityId;
                    },
                    ActiveData: function(){
                        return $scope.activeStatusData;
                    },
                    userId: function(){
                        return $scope.userId;
                    },
                }
            });
            modalInstance.result.then(function (result) {
                $scope.openModalComplete = false;
                $scope.getAllData($scope.userId, $scope.merchantId)
            },function () {
                $scope.openModalComplete = false;
            });
        };
        //同意结余申请
        $scope.accessBalanceOpenModel = function () {
            $scope.openModalComplete = true;
            var modalInstance = $uibModal.open({
                templateUrl: 'layerTemplate/accessBalance.html',
                controller: 'accessBalanceController',
                openedClass:'test',
                windowClass:'confirm-modal-dialog',
                windowTopClass:'test2',
                resolve: {
                    activityId: function(){
                        return $scope.activityId;
                    },
                    ActiveData: function(){
                        return $scope.activeStatusData;
                    },
                    userId: function(){
                        return $scope.userId;
                    },

                }
            });
            modalInstance.result.then(function (result) {
                $scope.openModalComplete = false;
                $scope.getAllData($scope.userId, $scope.merchantId)

            },function () {
                $scope.openModalComplete = false;
            });
        };
        //同意发放活动结余
        $scope.accessGiveLeftMoneyOpenModel = function () {
            $scope.openModalComplete = true;
            var modalInstance = $uibModal.open({
                templateUrl: 'layerTemplate/jieyuList.html',
                controller: 'accessGiveLeftMoneyController',
                openedClass:'test',
                windowClass:'confirm-modal-dialog',
                windowTopClass:'test2',
                resolve: {
                    activityId: function(){
                        return $scope.activityId;
                    },
                    ActiveData: function(){
                        return $scope.activeStatusData;
                    },
                    Members: function () {
                        return $scope.activeMembers;
                    },
                    userId: function(){
                        return $scope.userId;
                    },
                    merchantId: function(){
                        return $scope.merchantId;
                    },
                }
            });
            modalInstance.result.then(function (result) {
                $scope.openModalComplete = false;
                $scope.getAllData($scope.userId, $scope.merchantId)
            },function () {
                $scope.openModalComplete = false;
            });
        };
        //拒绝发放活动结余
        $scope.refuseGiveLeftMoneyOpenModel = function () {
            $scope.openModalComplete = true;
            var modalInstance = $uibModal.open({
                templateUrl: 'layerTemplate/refuseMoney.html',
                controller: 'refuseGiveLeftMoneyController',
                openedClass:'test',
                windowClass:'confirm-modal-dialog',
                windowTopClass:'test2',
                resolve: {
                    activityId: function(){
                        return $scope.activityId;
                    },
                    ActiveData: function(){
                        return $scope.activeStatusData;
                    },
                    Members: function () {
                        return $scope.activeMembers;
                    },
                    userId: function(){
                        return $scope.userId;
                    },
                    merchantId: function(){
                        return $scope.merchantId;
                    },
                }
            });
            modalInstance.result.then(function (result) {
                $scope.openModalComplete = false;
                $scope.getAllData($scope.userId, $scope.merchantId)
            },function () {
                $scope.openModalComplete = false;
            });
        };

    }]
);
//拒绝经费发放
app.controller('refuseMonyController', ['$scope','$http','$uibModal','$uibModalInstance','activityId','userId',function($scope,$http,$uibModal,$uibModalInstance,activityId,userId) {
    $scope.activityId = activityId;
    $scope.userId = userId;
    $scope.isvalidate = true;

    $scope.refuse = function(){
       //判断输入是否合法
       var reasonString = $scope.reason;
       if(typeof(reasonString)!='undefined'){
           if(reasonString.match(new RegExp("^[\u4e00-\u9fa5]{5,20}$"))){
                $scope.refuseMoney($scope.activityId, $scope.userId);
                
           }else{
               $scope.isvalidate = false;
           }
       }else{
           $scope.isvalidate = false;
       }
        
    }

    $scope.cancel = function(){
        $uibModalInstance.dismiss('cancel');
    }

    $scope.refuseMoney = function(activity_id, user_id){
        $http({    
            method: "POST",    
            url: '/zxcity_restful/ws/rest',    
            data: {
                cmd: 'fans/checkActivityFunds',
                data: JSON.stringify({
                    activityId: activity_id,
                    userId: user_id,
                    // personUserId: "111",
                    remark: $scope.reason,
                    type: "1"
                }),
                version: 1.0
            },  
            headers: { 
                'apikey': 'test' ,
                'Content-Type': 'application/x-www-form-urlencoded' 
            },    
            transformRequest: function(obj) {    
                var str = [];    
                for (var p in obj) {    
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));    
                }    
                return str.join("&");    
            }  
        }).success(function(response, status, headers, config){    
            $uibModalInstance.close($scope.data);         
        }); 
    }

}]);
//同意经费发放
app.controller('accessMonyController', ['$scope','$http','$uibModal','$uibModalInstance','activityId','userId','ActiveStatusData','merchantId','Members',function($scope,$http,$uibModal,$uibModalInstance,activityId,userId,ActiveStatusData,merchantId,Members) {
    $scope.activeStatusData = ActiveStatusData;
    $scope.activityId = activityId;
    $scope.userId = userId;
    $scope.merchantId = merchantId;
    $scope.members = Members;

    $scope.ids = '';
    var newArr = [];
    angular.forEach($scope.members, function(value,key,data){
        newArr.push(value.userId)
    })
    $scope.ids = newArr.toString();

    $scope.cancel = function(){
        $uibModalInstance.dismiss('cancel');
    }
    $scope.isSubmite = true;//是否可以提交数据，避免重复提交
    $scope.access = function(){
        if($scope.isSubmite === true){
            $scope.isSubmite = false;//避免重复提交   
            $scope.moneyAccess($scope.activityId, $scope.userId, $scope.merchantId, $scope.ids);
        }
    }

    $scope.moneyAccess = function(activity_id, user_id, merchant_id, ids){
        $http({    
            method: "POST",    
            url: '/zxcity_restful/ws/rest',    
            data: {
                cmd: 'fans/checkActivityFunds',
                data: JSON.stringify({
                    activityId: activity_id,
                    userId: user_id,
                    merchantId: merchant_id,
                    ids: ids,
                    type: "0"
                }),
                version: 1.0
            },  
            headers: { 
                'apikey': 'test' ,
                'Content-Type': 'application/x-www-form-urlencoded' 
            },    
            transformRequest: function(obj) {    
                var str = [];    
                for (var p in obj) {    
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));    
                }    
                return str.join("&");    
            }  
        }).success(function(response, status, headers, config){    
            $uibModalInstance.close($scope.data);        
        }); 
    }

}]);
//结余申请
app.controller('balanceApplyController', ['$scope','$http','$uibModal','$uibModalInstance','ActiveData','activityId','merchantId','userId',function($scope,$http,$uibModal,$uibModalInstance,ActiveData,activityId,merchantId,userId) {
    $scope.merchantId = merchantId;
    $scope.userId = userId;
    $scope.activityId = activityId;//活动id
    $scope.activeData = ActiveData;

    $scope.chooseNext = null;
    $scope.$watch('chooseNext',function(){
        if($scope.chooseNext){
            $scope.personUserId = $scope.chooseNext.userId;
        }
    })
    $scope.$watch('realPerBudget', function(){
        $scope.realTotalMoney = $scope.realPerBudget * $scope.activeData.JoinNum
    })
    $scope.realTotalMoney = null;
    $scope.realPerBudget = null;
    $scope.priceDif = null;
    $scope.isTotalMoneyTips = false;
    $scope.isPerBudgetTips = false;
    $scope.isNextPeople = false;

    $scope.accept = function(){
        // console.log($scope.realTotalMoney)

        //判断下级审核人是否为空
        if($scope.chooseNext ==null){
            $scope.isNextPeople = true;
        }else{
            $scope.isNextPeople = false;
        }

        //验证实际总金额（非负数）
        if($scope.realTotalMoney==null){
            $scope.isTotalMoneyTips = true;
        }else{
            var totalMoneyString = $scope.realTotalMoney;
            var exp=/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;
            if(exp.test(totalMoneyString)){
                $scope.isTotalMoneyTips = false;
            }else{
                $scope.isTotalMoneyTips = true;
            }
        }
        //验证实际人均金额（非负数）
        if($scope.realPerBudget==null){
            $scope.isPerBudgetTips = true;
        }else{
            var realPerBudgetString = $scope.realPerBudget;
            var exp=/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;
            if(exp.test(realPerBudgetString)){
                $scope.isPerBudgetTips = false;
            }else{
                $scope.isPerBudgetTips = true;
            }
        }
        $scope.isSubmite = true;//是否可以提交数据，避免重复提交
        //三个input验证都通过了（false验证通过）才可以点击申请按钮
        if($scope.isNextPeople == false && $scope.isTotalMoneyTips == false && $scope.isPerBudgetTips == false &&  $scope.isSubmite == true){
            $scope.isSubmite = false;//是否可以提交数据，避免重复提交 
            $scope.balanceApply($scope.activityId, $scope.userId, $scope.personUserId, $scope.realPerBudget, $scope.realTotalMoney );
        }

        
    }

    $scope.cancel = function(){
        console.log($scope.chooseNext);
        $uibModalInstance.dismiss('cancel');
    }

    $scope.giveOrGet = 0;
    $scope.give = $scope.activeData.totalMoney;
    $scope.$watch('realTotalMoney',function(){
        $scope.giveOrGet = $scope.realTotalMoney - $scope.activeData.totalMoney
        if($scope.giveOrGet<=0){
            $scope.give = 0-$scope.giveOrGet;
        }else{
            $scope.get = $scope.giveOrGet;
        }
    });
    //获取下级审核人
    $http({    
        method: "POST",    
        url: '/zxcity_restful/ws/rest',    
        data: {
            cmd: 'fans/getShopPersonList',
            data: JSON.stringify({
                merchantId: $scope.merchantId ,
                userId: $scope.userId
            }),
            version: 1.0
        },  
        headers: { 
            'apikey': 'test' ,
            'Content-Type': 'application/x-www-form-urlencoded' 
        },    
        transformRequest: function(obj) {    
            var str = [];    
            for (var p in obj) {    
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));    
            }    
            return str.join("&");    
        }  
    }).success(function(response, status, headers, config){    
        // console.log(response)
        $scope.members = response.data;          
    });                                                                         

    $scope.balanceApply = function(activity_id, user_id, personUser_id, real_budget, real_money){
        $http({    
            method: "POST",    
            url: '/zxcity_restful/ws/rest',    
            data: {
                cmd: 'fans/checkActivitySurplus',
                data: JSON.stringify({
                    activityId: activity_id,
                    userId: user_id,
                    personUserId: personUser_id, //下级审核人
                    realBudget: real_budget,
                    realMoney: real_money,
                }),
                version: 1.0
            },  
            headers: { 
                'apikey': 'test' ,
                'Content-Type': 'application/x-www-form-urlencoded' 
            },    
            transformRequest: function(obj) {    
                var str = [];    
                for (var p in obj) {    
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));    
                }    
                return str.join("&");    
            }  
        }).success(function(response, status, headers, config){    
            $uibModalInstance.close($scope.data);    
               
        }); 
    }
}]);
//同意结余申请
app.controller('accessBalanceController', ['$scope','$http','$uibModal','$uibModalInstance','ActiveData','activityId','userId',function($scope,$http,$uibModal,$uibModalInstance,ActiveData,activityId,userId) {
    $scope.activityId = activityId;
    $scope.userId = userId;
    $scope.activeStatusData = ActiveData;

    $scope.isSubmite = true;//是否可以提交数据，避免重复提交
    $scope.acceptBtn = function(){
        if($scope.isSubmite === true){
            $scope.isSubmite = false;//是否可以提交数据，避免重复提交 
            $scope.accessBalance($scope.activityId, $scope.userId);
        }
    }

    $scope.cancel = function(){
        $uibModalInstance.dismiss('cancel');
    }

    $scope.accessBalance = function(activity_id, user_id){
        $http({    
            method: "POST",    
            url: '/zxcity_restful/ws/rest',    
            data: {
                cmd: 'fans/applyActivitySurplus',
                data: JSON.stringify({
                    activityId: activity_id,
                    userId: user_id,
                    type: "0"
                }),
                version: 1.0
            },  
            headers: { 
                'apikey': 'test' ,
                'Content-Type': 'application/x-www-form-urlencoded' 
            },    
            transformRequest: function(obj) {    
                var str = [];    
                for (var p in obj) {    
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));    
                }    
                return str.join("&");    
            }  
        }).success(function(response, status, headers, config){    
            $uibModalInstance.close($scope.data);     
           
        }); 
    }
}]);
//拒绝结余申请
app.controller('refuseBalanceApplyController', ['$scope','$http','$uibModal','$uibModalInstance','userId','ActiveData','activityId',function($scope,$http,$uibModal,$uibModalInstance,userId,ActiveData,activityId) {
    $scope.activityId = activityId;
    $scope.activeData = ActiveData;
    $scope.userId = userId;
    $scope.isvalidate = true;

    $scope.refuse = function(){
        //判断输入是否合法
        var reasonString = $scope.reason;
        if(typeof(reasonString)!='undefined'){
            if(reasonString.match(new RegExp("^[\u4e00-\u9fa5]{5,20}$"))){
                $scope.refuseBalance($scope.activityId, $scope.userId);
                // $uibModalInstance.dismiss('cancel');
            }else{
                $scope.isvalidate = false;
            }
        }else{
            $scope.isvalidate = false;
        }
        
    }

    $scope.cancel = function(){
        $uibModalInstance.dismiss('cancel');
    }

    $scope.refuseBalance = function(activity_id, user_id){
        $http({    
            method: "POST",    
            url: '/zxcity_restful/ws/rest',    
            data: {
                cmd: 'fans/applyActivitySurplus',
                data: JSON.stringify({
                    activityId: activity_id,
                    userId: user_id,
                    type: "1",
                    remark: $scope.reason

                }),
                version: 1.0
            },  
            headers: { 
                'apikey': 'test' ,
                'Content-Type': 'application/x-www-form-urlencoded' 
            },    
            transformRequest: function(obj) {    
                var str = [];    
                for (var p in obj) {    
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));    
                }    
                return str.join("&");    
            }  
        }).success(function(response, status, headers, config){    
            $uibModalInstance.close($scope.data);         
        }); 
    }
}]);
//同意活动
app.controller('activeAgreeController', ['$scope','$http','$uibModal','$uibModalInstance','activityId','userId','merchantId','HisAuditors',function($scope,$http,$uibModal,$uibModalInstance,activityId,userId,merchantId,HisAuditors) {
    $scope.userId = userId;
    $scope.merchantId = merchantId;
    $scope.activityId = activityId;
    $scope.hisAuditors = HisAuditors;
    // console.log($scope.hisAuditors)
    $scope.chooseNext = '';//下级审核人
    //点击历史审核人
    $scope.choseAuditor = function(data){
        $scope.chooseNext = data
    }
    $scope.$watch('chooseNext',function(){
        if($scope.chooseNext){
            $scope.personUserId = $scope.chooseNext.userId;
        }
    })
    
    //获取下级审核人
    $http({    
        method: "POST",    
        url: '/zxcity_restful/ws/rest',    
        data: {
            cmd: 'fans/getShopPersonList',
            data: JSON.stringify({
                merchantId: $scope.merchantId ,
                userId: $scope.userId
            }),
            version: 1.0
        },  
        headers: { 
            'apikey': 'test' ,
            'Content-Type': 'application/x-www-form-urlencoded' 
        },    
        transformRequest: function(obj) {    
            var str = [];    
            for (var p in obj) {    
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));    
            }    
            return str.join("&");    
        }  
    }).success(function(response, status, headers, config){    
        // console.log(response)
        $scope.members = response.data;          
    }); 

    $scope.cancel = function(){
        $uibModalInstance.close($scope.data);
        // $uibModalInstance.dismiss('cancel');
    }

    $scope.isNext = false;//下级审核人 提示信息 显示与否
    $scope.isSubmite = true;//是否可以提交数据，避免重复提交
    if($scope.isSubmite == true){
        $scope.isSubmite = false;//避免重复提交   
        $scope.agree = function(){
            if($scope.chooseNext){
                $scope.tongyi($scope.activityId, $scope.userId, $scope.personUserId);
            }else{
                $scope.isNext = true;
            }
        }
    }

    $scope.tongyi = function(activity_id, user_id, personUser_id){
        $http({    
            method: "POST",    
            url: '/zxcity_restful/ws/rest',    
            data: {
                cmd: 'fans/checkFansActivity',
                data: JSON.stringify({
                    activityId: activity_id,
                    userId: user_id,
                    personUserId: personUser_id,//下级审核人
                    type: "0"
                }),
                version: 1.0
            },  
            headers: { 
                'apikey': 'test' ,
                'Content-Type': 'application/x-www-form-urlencoded' 
            },    
            transformRequest: function(obj) {    
                var str = [];    
                for (var p in obj) {    
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));    
                }    
                return str.join("&");    
            }  
        }).success(function(response, status, headers, config){    
            $uibModalInstance.close($scope.data);     
            
        }); 
    }
}]);
//拒绝活动
app.controller('activeRefuseController', ['$scope','$http','$uibModal','$uibModalInstance','Members','activityId','userId',function($scope,$http,$uibModal,$uibModalInstance,Members,activityId,userId) {
    $scope.isvalidate = true;
    $scope.activityId = activityId;
    $scope.userId = userId;
    $scope.cancel = function(){
        $uibModalInstance.dismiss('cancel');
    }
    
    $scope.refuse = function(){
        // console.log(11)
        //判断输入是否合法
        var reasonString = $scope.reason;
        if(typeof(reasonString)!='undefined'){
            if(reasonString.match(new RegExp("^[\u4e00-\u9fa5]{5,20}$"))){
                $scope.activeRefuse($scope.activityId, $scope.userId);
                // $uibModalInstance.dismiss('cancel');
            }else{
                $scope.isvalidate = false;
            }
        }else{
            $scope.isvalidate = false;
        }
        
    }

    $scope.activeRefuse = function(activity_id, user_id){
        $http({    
            method: "POST",    
            url: '/zxcity_restful/ws/rest',    
            data: {
                cmd: 'fans/checkFansActivity',
                data: JSON.stringify({
                    activityId: activity_id,
                    userId: user_id,
                    // personUserId: "123",
                    remark: $scope.reason,
                    type: "1"
                }),
                version: 1.0
            },  
            headers: { 
                'apikey': 'test' ,
                'Content-Type': 'application/x-www-form-urlencoded' 
            },    
            transformRequest: function(obj) {    
                var str = [];    
                for (var p in obj) {    
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));    
                }    
                return str.join("&");    
            }  
        }).success(function(response, status, headers, config){    
            $uibModalInstance.close($scope.data);          
        }); 
    }
}]);
app.controller('activeSeccessController', ['$scope','$http','$uibModal','$uibModalInstance','Members',function($scope,$http,$uibModal,$uibModalInstance,Members) {

    $scope.refuse = function(){
        $uibModalInstance.close($scope.data);
        // $uibModalInstance.dismiss('cancel');
    }

    $scope.cancel = function(){
        $uibModalInstance.dismiss('cancel');
    }
}]);

//同意发放活动结余
app.controller('accessGiveLeftMoneyController', ['$scope','$http','$uibModal','$uibModalInstance','Members','ActiveData','activityId','merchantId','userId',function($scope,$http,$uibModal,$uibModalInstance,Members,ActiveData,activityId,merchantId,userId) {
    $scope.activityId = activityId;
    $scope.merchantId = merchantId;
    $scope.userId = userId;
    $scope.activeStatusData = ActiveData;
    $scope.members = Members;

    $scope.ids = '';
    var newArr = [];
    angular.forEach($scope.members, function(value,key,data){
        newArr.push(value.userId)
    })
    $scope.ids = newArr.toString();

    $scope.isSubmite = true;//避免重复提交   
    $scope.access = function(){
        if($scope.isSubmite === true){
            $scope.isSubmite = false;//避免重复提交   
            $scope.accessGiveM($scope.activityId, $scope.userId, $scope.merchantId, $scope.ids);
        }
    }

    $scope.cancel = function(){
        // console.log($scope.chooseNext);
        $uibModalInstance.dismiss('cancel');
    }

    $scope.accessGiveM = function(activity_id, user_id, merchant_id, ids){
        $http({    
            method: "POST",    
            url: '/zxcity_restful/ws/rest',    
            data: {
                cmd: 'fans/doActivitySurplus',
                data: JSON.stringify({
                    activityId: activity_id,
                    userId: user_id,
                    type: "0",
                    merchantId: merchant_id,
                    ids: ids,
                }),
                version: 1.0
            },  
            headers: { 
                'apikey': 'test' ,
                'Content-Type': 'application/x-www-form-urlencoded' 
            },    
            transformRequest: function(obj) {    
                var str = [];    
                for (var p in obj) {    
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));    
                }    
                return str.join("&");    
            }  
        }).success(function(response, status, headers, config){    
            $uibModalInstance.close($scope.data);    
                
        }); 
    }
}]);
//拒绝发放活动结余
app.controller('refuseGiveLeftMoneyController', ['$scope','$http','$uibModal','$uibModalInstance','Members','ActiveData','activityId','merchantId','userId',function($scope,$http,$uibModal,$uibModalInstance,Members,ActiveData,activityId,merchantId,userId) {
    $scope.activityId = activityId;
    $scope.merchantId = merchantId;
    $scope.userId = userId;
    $scope.activeData = ActiveData;
    $scope.members = Members;
    $scope.isvalidate = true;

    $scope.refuse = function(){
        //判断输入是否合法
        var reasonString = $scope.reason;
        if(typeof(reasonString)!='undefined'){
            if(reasonString.match(new RegExp("^[\u4e00-\u9fa5]{5,20}$"))){
                $scope.refuseGiveLeft($scope.activityId, $scope.userId, $scope.merchantId);
                // $uibModalInstance.dismiss('cancel');
            }else{
                $scope.isvalidate = false;
            }
        }else{
            $scope.isvalidate = false;
        }
        
    }

    $scope.cancel = function(){
        $uibModalInstance.dismiss('cancel');
    }

    $scope.refuseGiveLeft = function(activity_id, user_id, merchant_id){
        $http({    
            method: "POST",    
            url: '/zxcity_restful/ws/rest',    
            data: {
                cmd: 'fans/doActivitySurplus',
                data: JSON.stringify({
                    activityId: activity_id,
                    userId: user_id,
                    type: "1",
                    remark: $scope.reason,
                    merchantId: merchant_id,
                }),
                version: 1.0
            },  
            headers: { 
                'apikey': 'test' ,
                'Content-Type': 'application/x-www-form-urlencoded' 
            },    
            transformRequest: function(obj) {    
                var str = [];    
                for (var p in obj) {    
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));    
                }    
                return str.join("&");    
            }  
        }).success(function(response, status, headers, config){    
            $uibModalInstance.close($scope.data);         
        }); 
    }
}]);


app.directive('customValidate', function () {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function (scope, elm, attr, ctrl) {
            if (!ctrl) return;
            attr.customValidate = attr.customValidate ? attr.customValidate : 'required';
            elm.bind('blur', function () {
                scope.validateResults = scope.validateResults ? scope.validateResults : {};
                var validateArray = attr.customValidate.split('|');
                angular.forEach(validateArray, function (validate_condition) {
                    switch (validate_condition) {
                        case 'required':
                            var id = ctrl.$name + '_validate_required';
                            $('#' + id).remove();
                            if (!ctrl.$viewValue) {
                                elm.after('<p class="info-tips" id="' + id + '">该项为必填，请填写</p>');
                                elm.addClass("form-info-error");
                                scope.validateResults[ctrl.$name] = false;
                            } else {
                                elm.removeClass('form-info-error');
                                scope.validateResults[ctrl.$name] = true;
                            }
                            scope.$apply();
                            //ctrl.$formatters.push(function (data) {
                            //    return ctrl.$viewValue ? ctrl.$viewValue : null;
                            //});
                            break;
                        case 'number':
                            var id = ctrl.$name + '_validate_number';
                            $('#' + id).remove();
                            if (ctrl.$viewValue) {
                                if (!ctrl.$viewValue.match(new RegExp("^[0-9]+(.[0-9]+)?$"))) {
                                    elm.after('<p class="info-tips" id="' + id + '">该项必须为数字，请填写数字格式</p>');
                                    elm.val('');
                                    elm.addClass("form-info-error");
                                    scope.validateResults[ctrl.$name] = false;
                                } else {
                                    elm.removeClass("form-info-error");
                                    scope.validateResults[ctrl.$name] = true;
                                }
                            }
                            scope.$apply();
                            //ctrl.$formatters.push(function (data) {
                            //    return ctrl.$viewValue && !ctrl.$viewValue.match(new RegExp("^[0-9]+$")) ? ctrl.$viewValue : null;
                            //});
                            break;
                        default :
                            break;
                    }
                });
            });
            if (elm.children('input')) {
                elm.children('input').bind('blur', function () {
                    scope.$parent.validateResults = scope.$parent.validateResults ? scope.$parent.validateResults : {};
                    var validateArray = attr.customValidate.split('|');
                    angular.forEach(validateArray, function (validate_condition) {
                        switch (validate_condition) {
                            case 'required':
                                var id = ctrl.$name + '_validate_required';
                                $('#' + id).remove();
                                if (ctrl.$viewValue) {
                                    elm.find('.ui-select-match').removeClass("form-info-error");
                                    elm.find('input').removeClass("form-info-error");
                                    scope.$parent.validateResults[ctrl.$name] = true;
                                } else {
                                    elm.after('<p class="info-tips" id="' + id + '">该项为必填，请填写</p>');
                                    elm.find('.ui-select-match').addClass("form-info-error");
                                    elm.find('input').addClass("form-info-error");
                                    scope.$parent.validateResults[ctrl.$name] = false;
                                }
                                scope.$apply();
                                break;
                            default :
                                break;
                        }
                    });
                });
            }
        }
    };
});

app.factory('locals', ['$window', function ($window) {
    return {        //存储单个属性
        set: function (key, value) {
            $window.localStorage[key] = value;
        },        //读取单个属性
        get: function (key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },        //存储对象，以JSON格式存储
        setObject: function (key, value) {
            $window.localStorage[key] = JSON.stringify(value);//将对象以字符串保存
        },        //读取对象
        getObject: function (key) {
            return JSON.parse($window.localStorage[key] || '{}');//获取字符串并解析成对象
        }

    }
}]);