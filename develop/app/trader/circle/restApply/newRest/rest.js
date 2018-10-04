
var rest_app = angular.module('restApp', ['ui.bootstrap','ui.select']);
//注册服务 以便使用 $location
rest_app.config(['$locationProvider', function($locationProvider) {  
    // $locationProvider.html5Mode(true);  
    $locationProvider.html5Mode({
     enabled: true,
     requireBase: false
    });
   }
]);
//新增
rest_app.controller('restController', ['$scope','$http','$uibModal','$location',function($scope,$http,$uibModal,$location) {
        // 时间选择器初始化
        $('#startDate, #endDate').datetimepicker({
            language: 'zh-CN',
            autoclose: true,
            format: 'yyyy-mm-dd',
            minView: 2,
            startDate: '2000-01-01',
            // startDate: new Date(),
            // endDate: '2020-12-30'
        });
        // 时间选择器互动
        $('#startDate').on('changeDate', function(ev){
            $('#endDate').datetimepicker('setStartDate', ev.date);
            var d = $('#endDate').val();
            if (d) {
                var date = new Date(d.replace(/-/g, '/'));
                if(date != 'Invalid Date' && date < ev.date){
                    $('#endDate').datetimepicker('setDate', ev.date)
                    $scope.leave_end_time = $scope.dateFormat(ev.date)
                }
            }
        });
        
        //时间格式化 格式 ‘年-月-日’
        $scope.dateFormat = function(date){
            return date.getFullYear() + '-' + (date.getMonth()+1 ) + '-' + date.getDate()
        }

        $scope.leavePerson = {}
        $scope.merchantId = ''
        $scope.leave_start_time = $scope.dateFormat(new Date())
        $scope.leave_end_time = $scope.dateFormat(new Date())
        $scope.leave_days = 1 //请假天数
        $scope.has_person = true
        $scope.has_start_time = true
        $scope.has_end_time = true
        $scope.leaveId = ''
        // 严格限制 结束时间不能再今天之前
        // $scope.$watch('leave_start_time',function(newVal, oldVal){
        //     $('#endDate').datetimepicker('setStartDate', newVal);
        // })
        $scope.$watch('leavePerson.person',function(newVal, oldVal){
            if($scope.leavePerson.person){
                $scope.has_person = true
            }else{
                $scope.has_person = false
            }
           
        })

        //封装ajax请求
        $scope.asyncAjax = function(cmd, datas, callback){
            $.ajax({
                type: "POST",
                url: "/zxcity_restful/ws/rest",
                dataType: "json",
                headers: {
                    apikey: 'test'
                },
                data: {
                    cmd: cmd,
                    data: JSON.stringify(datas),
                },
                beforeSend: function (request) {
                    layer.load(0, { shade: [0.3, "#fff"] })
                },
                success: function (re) {
                    callback(re);
                },
                error: function (re) {
                    parent.layer.msg('网络错误,稍后重试');
                },
                complete: function (re) {
                    layer.closeAll();
                }
            });
        }

        //获取参数中的merchantId
        if($location.search().merchantId){
            $scope.merchantId = $location.search().merchantId
        };

        //计算时间差（天数）
        $scope.DateDiff = function  (sDate1,  sDate2){    //sDate1和sDate2是2006-12-18格式  
            var timestamp1 = Date.parse(sDate1)
            var timestamp2 = Date.parse(sDate2)
            iDays  =  parseInt(Math.abs(timestamp2  -  timestamp1)  /  1000  /  60  /  60  /24)
            $scope.leave_days = iDays+1//请假天数
            return  iDays + 1  
        } 
        //计算时间差（天数）新的
        $scope.DateMinus = function(startDate, endDate){ 
        　　var startDate = new Date(startDate.replace(/-/g, "/")); 
            var endDate = new Date(endDate.replace(/-/g, "/")); 

        　　var days = endDate.getTime() - startDate.getTime(); 
        　　var day = parseInt(days / (1000 * 60 * 60 * 24)); 
            $scope.leave_days = day+1//请假天数
        　　return day; 
        }
        $scope.$watchGroup(['leave_start_time', 'leave_end_time'], function(newVal, oldVal) {
            var times1 = Date.parse(newVal[0])
            var times2 = Date.parse(newVal[1])
            console.log(times1, times2)

            if(times1 > times2){
                newVal[1] = newVal[0]
            }
            $scope.DateMinus(newVal[0], newVal[1])
            // $scope.DateDiff(newVal[0], newVal[1])
        })
        //回调 请求到商户所有人后 赋给 persons
        $scope.personOfMerchant = function(re){
            // console.log(re)
            $scope.persons = re.data
        }
        //获取商户（merchant）下的员工
        $scope.getPersons = function(){
            $scope.asyncAjax('fans/getPersonListForLeave',{
                merchantId:  $scope.merchantId
            } , $scope.personOfMerchant)
        }
        $scope.getPersons()
        
       
        $scope.isSubmit = true //避免重复提交
        //提交请假按钮
        $scope.submitLeave = function(){
            if(JSON.stringify($scope.leavePerson) == "{}"){
                $scope.has_person = false
            }
            if(!$scope.leave_start_time){
                $scope.has_start_time = false
            }
            if(!$scope.leave_end_time){
                $scope.has_end_time = false
            }


            if($scope.has_person ==true && $scope.has_start_time == true && $scope.has_end_time == true){

                if($scope.isSubmit === true){
                    $scope.isSubmit = false//避免重复提交
                    $scope.asyncAjax('fans/addLeave',
                    {
                        merchantId: $scope.merchantId,
                        userId: $scope.leavePerson.person.userId,
                        leaveStartTime: $scope.leave_start_time,
                        leaveEndTime: $scope.leave_end_time,
                        leaveDay: $scope.leave_days 
                    } , $scope.successCallbcak)
                }
               
            }
            
        }
        // 请假层
        var newRest = parent.layer.getFrameIndex(window.name);
        //回调 关闭弹层
        $scope.successCallbcak = function(re){
            parent.layer.msg(re.msg);
            if(re.code==1){
                parent.layer.close(newRest);
            }else{
                return false;
            }
        }

        //取消按钮
        $scope.cancel = function(){
            parent.layer.closeAll()
        }
    }
])
//编辑
rest_app.controller('editRestController', ['$scope','$http','$uibModal','$location',function($scope,$http,$uibModal,$location) {
    // 时间选择器初始化
    $('#startDate, #endDate').datetimepicker({
        language: 'zh-CN',
        autoclose: true,
        format: 'yyyy-mm-dd',
        minView: 2,
        startDate: '2000-01-01',
        // startDate: new Date(),
        // endDate: '2020-12-30'
    });
    // 时间选择器互动
    $('#startDate').on('changeDate', function(ev){
        $('#endDate').datetimepicker('setStartDate', ev.date);
        var d = $('#endDate').val();
        if (d) {
            var date = new Date(d.replace(/-/g, '/'));
            if(date != 'Invalid Date' && date < ev.date){
                $('#endDate').datetimepicker('setDate', ev.date)
                $scope.leave_end_time = $scope.dateFormat(ev.date)
            }
        }
    });
    //时间格式化 格式 ‘年-月-日’
    $scope.dateFormat = function(date){
        return date.getFullYear() + '-' + (date.getMonth()+1 ) + '-' + date.getDate()
    }
    $scope.leavePerson = {}
    $scope.merchantId = ''
    $scope.leave_start_time = $scope.dateFormat(new Date())
    $scope.leave_end_time = $scope.dateFormat(new Date())
     
    $scope.leave_days = 1 //请假天数
    $scope.has_person = true
    $scope.has_start_time = true
    $scope.has_end_time = true
    $scope.leaveId = ''
    // 严格限制 结束时间不能在开始时间之前
    $scope.$watch('leave_start_time',function(newVal, oldVal){
        $('#endDate').datetimepicker('setStartDate', newVal);
        if( Date.parse($scope.leave_end_time) < Date.parse(newVal) ){
            $scope.leave_end_time = newVal;
        }
    })
    
    //封装ajax请求
    $scope.asyncAjax = function(cmd, datas, callback){
        $.ajax({
            type: "POST",
            url: "/zxcity_restful/ws/rest",
            dataType: "json",
            headers: {
                apikey: 'test'
            },
            data: {
                cmd: cmd,
                data: JSON.stringify(datas),
            },
            beforeSend: function (request) {
                layer.load(0, { shade: [0.3, "#fff"] })
            },
            success: function (re) {
                callback(re);
            },
            error: function (re) {
                parent.layer.msg('网络错误,稍后重试');
            },
            complete: function (re) {
                layer.closeAll();
            }
        });
    }
    //计算时间差（天数）
   $scope.DateDiff = function  (sDate1,  sDate2){    //sDate1和sDate2是2006-12-18格式  
        var timestamp1 = Date.parse(sDate1)
        var timestamp2 = Date.parse(sDate2)
        iDays  =  parseInt(Math.abs(timestamp2  -  timestamp1)  /  1000  /  60  /  60  /24)
        $scope.leave_days = iDays+1//请假天数
        // return  iDays + 1  
    }  
    //请假详情 回调
    $scope.freshLeaveDtail = function(re){
        console.log(re)
        $scope.leave_start_time = re.data[0].leaveStartTime.substring(0,10)
        $scope.leave_end_time = re.data[0].leaveEndTime.substring(0,10)
        $('#startDate').val($scope.leave_start_time )
        $('#endDate').val($scope.leave_end_time )
        $scope.DateDiff($scope.leave_start_time, $scope.leave_end_time)
        $('#leave_days').text( $scope.leave_days )

        $scope.leavePerson.userName = re.data[0].userName
        $scope.leavePerson.userId = re.data[0].userId
        $('#person_name').val( $scope.leavePerson.userName )
    }
    //获取请假详情
    $scope.getLeaveDetail = function(id){
        $scope.asyncAjax('fans/getLeaveDetail',{
            leaveId: id
        } , $scope.freshLeaveDtail)
    }
     //获取参数中的leaveId
    //  if($location.search().leave_id){
        $scope.leaveId = $location.search().leave_id
        $scope.getLeaveDetail($scope.leaveId)
    // };
    
    //获取参数中的merchantId
    if($location.search().merchantId){
        $scope.merchantId = $location.search().merchantId
    };
   
    $scope.$watchGroup(['leave_start_time', 'leave_end_time'], function(newVal, oldVal) { 
        var times1 = Date.parse(newVal[0])
        var times2 = Date.parse(newVal[1])
        if(times1 > times2){
            newVal[1] = newVal[0]
        }
        $scope.DateDiff(newVal[0], newVal[1])
    })

    //回调 请求到商户所有人后 赋给 persons
    $scope.personOfMerchant = function(re){
        $scope.persons = re.data
    }
    //获取商户（merchant）下的员工
    $scope.getPersons = function(){
        $scope.asyncAjax('fans/getPersonListForLeave',{
            merchantId:  $scope.merchantId
        } , $scope.personOfMerchant)
    }
    $scope.getPersons()
    
   
    $scope.isSubmit = true //避免重复提交
    //提交请假按钮
    $scope.submitLeave = function(){
        if(JSON.stringify($scope.leavePerson) == "{}"){
            $scope.has_person = false
        }
        if(!$scope.leave_start_time){
            $scope.has_start_time = false
        }
        if(!$scope.leave_end_time){
            $scope.has_end_time = false
        }


        if($scope.has_person ==true && $scope.has_start_time == true && $scope.has_end_time == true){

            if($scope.isSubmit === true){
                $scope.isSubmit = false//避免重复提交
                $scope.asyncAjax('fans/uptLeave',
                {
                    merchantId: $scope.merchantId,
                    leaveId: $scope.leaveId,
                    leaveStartTime: $scope.leave_start_time,
                    leaveEndTime: $scope.leave_end_time,
                    leaveDay: $scope.leave_days 
                } , $scope.successCallbcak)
            }
           
        }
        
    }
   
    // 请假层
    var newRest = parent.layer.getFrameIndex(window.name);
    //回调 关闭弹层
    $scope.successCallbcak = function(re){
        parent.layer.msg(re.msg);
        if(re.code==1){
            parent.layer.close(newRest);
        }else{
            return false;
        }
    }

    //取消按钮
    $scope.cancel = function(){
        parent.layer.closeAll()
    }
}
])