(function($) {
		const   FINDANNOUNCEMNETS = 'operations/queryMerchantRegApplyPage',//商户注册申请列表
				CREATEANNOUNCEMENT = 'operations/approvalMerchantRegApply',//审批商户注册申请
				UPDATEANNOUNCEMENT = 'operations/getMerchantRegApplyDetail'//商户注册申请详情
				GETBASEAREAINFOBY = 'operations/getBaseAreaInfoByCode',//省
				FINDUSERDATABYID = 'user/findUserById'//用户ID查名字
				
		    //日期选择
		    $('#datetimepicker1 input').datepicker({
		        format: 'yyyy-mm-dd',
		        autoclose: true,
		        language: "zh-CN"
		    }).on('changeDate', function(ev) {
		        var startTime = $('#jurisdiction-begin').val();
		        var endTime =  $('#datetimepicker2').attr('data-time');
		        $(this).parent().attr('data-time',startTime);
//		      if(endTime<startTime){
//		         layer.msg("开始时间应早于结束时间哟，请重新选择！");
//		        	 $('#datetimepicker1').datepicker('setDate',endDate);
//		         	}
//		        $("#datetimepicker1 .datepicker").hide();
		    });
		
		    $('#datetimepicker2 input').datepicker({
		        format: 'yyyy-mm-dd',
		        autoclose: true,
		        language: "zh-CN"
		    }).on('changeDate', function(ev) {
		        var startTime = $('#datetimepicker1').attr('data-time');
		        var endTime = $('#jurisdiction-end').val()
		        $(this).parent().attr('data-time',endTime);
//		        if(endTime<startTime){
//		            $('#datetimepicker2').datepicker('setDate',startTime);
//		         layer.msg("开始时间应早于结束时间哟，请重新选择！");
//		         }
//		        $("#datetimepicker2 .datepicker").hide();
		    });
		    
		//列表
			function commercialDetail(res) {
		        var sHtml = "";
		        var data = res.data;
		        if (res.code == 1) {
		           $.each(data,function(i,item){
		                var row = res.data[i];
		                if(item.status == 0){
		                	item.status = '审批中'
		                }else if(item.status == 1){
		                	item.status = '审批通过'
		                }else{
		                	item.status = '审批拒绝'
		                }
		                
		                if(item.address==null){
		                	item.address = '暂无'
		                }
		                
		      			if(item.approveMsg==null){
		      				item.approveMsg = '暂无'
		      			}
		      			if(item.bussinessLicence==null){
		      				item.bussinessLicence = '暂无'
		      			}
		      			if(item.trade == 1){
		      				item.trade = '服务业'
		      			}else if(item.trade == 2){
		      				item.trade = '零售业'
		      			}else if(item.trade == 3){
		      				item.trade = '餐饮业'
		      			}
		                sHtml += `<tr>
                                	<td class="td1">`+(i+1)+`</td>
                                	<td class="td2">`+item.sysUserId+`</td>
                                	<td class="td3">`+item.merchantName+`</td>
                                	<td class="td4">`+item.phoneNumber+`</td>
                                	<td class="td6">`+item.username+`</td>
                                	<td class="td7">`+item.trade+`</td>
                                	<td class="td8">`+item.status+`</td>
                                	<td class="td9">`+(item.createTime).substring(0,16)+`</td>
                                	<td class="id" style="display: none;">`+item.id+`</td>
                                	<td class="bussinessLicence" style="display: none;">`+item.bussinessLicence+`</td>
                                	<td class="licenseFront" style="display: none;">`+item.licenseFront+`</td>
                                	<td class="licenseBack" style="display: none;">`+item.licenseBack+`</td>
                                	<td class="provinceId" style="display: none;">`+item.provinceId+`</td>
                                	<td class="cityId" style="display: none;">`+item.cityId+`</td>
                                	<td class="approveMsg" style="display: none;">`+item.approveMsg+`</td>
					   				<td class="idCardFront" style="display: none;">`+item.idCardFront+`</td>
                                	<td class='row remove-modifier td10'>
                                		<div class='details' data-toggle='modal'  data-target='#showNotice'>
                                			详情信息
                                		</div>
                                		<button type='button' class='check yellow' data-toggle='modal'  data-target='#add-newuser'>
                                			审核
                                		</button>
                                	</td>
                                </tr>`
		           })
			            $("#tbodyParameter").html(sHtml)
			            var $td8 = $('#tbodyParameter .td8')
			            $.each($td8,function(i,item){
		            		if($(item).html()=='审批拒绝'){
		            			$(item).addClass('red')
		            			$(item).siblings('.td10').children('.check').addClass('not').html('已审核').attr('disabled','disabled')
		            		}else if($(item).html()=='审批通过'){
		            			$(item).addClass('green')
		            			$(item).siblings('.td10').children('.check').addClass('not').html('已审核').attr('disabled','disabled')
		            		}
			            })
						var $td2 = $('#tbodyParameter .td2')
						 $.each($td2,function(i,item){
						 	var userId = $(item).html();
						 	var resUser =reqAjax(FINDUSERDATABYID,"{'id':"+userId+"}");
						 	if(resUser.code==1){
						 		$(item).html(resUser.data.scSysUser.username)
						 	}else{
						 		$(item).html('')
						 	}
						 	
						 })

			        } else {
			            layer.msg(res.msg);
			        }
			}	
			
			function list(){
				var rows = 10;
		   		var layer = layui.laypage;
		   		var parms ="{'page':1,'rows':10}"
		   		var res =reqAjax(FINDANNOUNCEMNETS,parms);
		   		console.log(res)
				//模拟渲染
				    var render = function(data, curr){
				        var arr = []
				            ,thisData = res;
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
				        ,curr: function(){ //通过url获取当前页，也可以同上（pages）方式获取
				            var page = location.search.match(/page=(\d+)/);
				            return page ? page[1] : 1;
				        }()
				        ,jump: function(obj,first){
				        	var parms ="{'page':"+obj.curr+",'rows':10}"
				            var res= reqAjax(FINDANNOUNCEMNETS,parms);
				            commercialDetail(res);
				            document.getElementById('paging-box-count').innerHTML = render(res.data, obj.curr);
				            $('#paging-box-count').html('共'+ obj.pages +'页，每页'+rows+'条,总数'+res.total+'条');
				        }
				        });
			}
			list();

			
			//图片加载错误处理
			$('img').error(function(){
			    $(this).attr('src', 'common/image/placeholder.png');
			});
			
			$('#add-newuser p>img').zoomify({
				scale:0.8
			});
			$('#add-newuser p>img').on('click',function(){
				$(this).toggleClass('act')
			})
			$('#showNotice p>img').zoomify({
				scale:0.8
			});
			$('#showNotice p>img').on('click',function(){
				$(this).toggleClass('act')
			})
			
			
			//审核
			$('#tbodyParameter').on('click','.check',function(){
				var sysUserId = $(this).parent().siblings('.td2').html(); //平台用户id
				var merchantName = $(this).parent().siblings('.td3').html(); //商户名称
				var phoneNumber = $(this).parent().siblings('.td4').html();//电话号码
				var address = $(this).parent().siblings('.td5').html();//地址
				var username = $(this).parent().siblings('.td6').html();//管理员名称
				var username = $(this).parent().siblings('.td7').html();//所属行业
				var createTime = $(this).parent().siblings('.td9').html();//注册时间
				var bussinessLicence = $(this).parent().siblings('.bussinessLicence').html();//营业执照
				var licenseFront = $(this).parent().siblings('.licenseFront').html();//营业执照正面
				var licenseBack = $(this).parent().siblings('.licenseBack').html();//营业执照反面
				var username = $(this).parent().siblings('.td6').html();//管理员名称
				var cityId = $(this).parent().siblings('.cityId').html();//城市ID		
				var cheProvinceId = $(this).parent().siblings('.provinceId').html();//省份ID
				var approveMsg = $(this).parent().siblings('.approveMsg').html();//审核意见
				var Provinceres= reqAjax(GETBASEAREAINFOBY,"{'code':'"+cheProvinceId+"'}");//obj 省
				var city= reqAjax(GETBASEAREAINFOBY,"{'code':'"+cityId+"'}")//obj 市
				var id = $(this).parent().siblings('.id').html();//id
				var idCardFront = $(this).parent().siblings('.idCardFront').html() || "";//身份证正反面
				sessionStorage.setItem('id',id);
				var that = $(this)
				$('#cheSysUserId').html(sysUserId);
				$('#cheMerchantName').html(merchantName);
				$('#chePhoneNumber').html(phoneNumber);
				$('#cheBussinessLicence').html(bussinessLicence)
				$('#cheLicenseFront>p>img').attr('src',licenseFront);
				$('#cheLicenseBack>p>img').attr('src',licenseBack);
				$("#cheCardFront>p>img").attr('src',idCardFront);
				if(Provinceres.code==1){
				$('#cheProvinceId').html(Provinceres.data.areaname);
				}else{
					$('#cheProvinceId').html('')
				}
				
				if(city.code==1){
					$('#cheCityId').html(city.data.areaname);
				}else{
					$('#cheCityId').html('')
				}

				$('#cheAddressDetail').html(address);
				$('#cheCreateTime').html(createTime);
			});	
			//审核
			$('#add-newuser').on('click','#no-pass',function(){
						var status = 2;
						var id = sessionStorage.getItem('id');//id
						var userNo = sessionStorage.getItem('userno')//userno
						var approveMsg = $('#chaRemarks').val();
						if(approveMsg==''){layer.msg('请输入审核意见')}else{
							var parms ="{'userNo':'"+userNo+"','id':'"+id+"','status':'"+status+"','approveMsg':'"+approveMsg+"'}"
							var res= reqAjax(CREATEANNOUNCEMENT,parms);
							if(res.code == 1){
								layer.msg(res.msg)
								location.reload();
							}else{
								layer.msg(res.msg)
							}
						}
					});
			$('#add-newuser').on('click','#yes-pass',function(){
				var status = 1;
				var id = sessionStorage.getItem('id');//id
				var userNo = sessionStorage.getItem('userno')//userno
				var approveMsg = $('#chaRemarks').val();
				if(approveMsg==''){layer.msg('请输入审核意见')}else{
					var parms ="{'userNo':'"+userNo+"','id':'"+id+"','status':'"+status+"','approveMsg':'"+approveMsg+"'}"
					var res= reqAjax(CREATEANNOUNCEMENT,parms);
					if(res.code == 1){
						layer.msg(res.msg)
						location.reload();
					}else{
						layer.msg(res.msg)
					}
				}
			});
	
			

			
						
		//查询
		$('#inquire').on('click',function(){
			var layer = layui.laypage;
			var rows = 10;
			var merchantName = $('#inquireInput').val();
			var createTimeBegin = $('#datetimepicker1').attr('data-time');
			var createTimeEnd = $('#datetimepicker2').attr('data-time');
			if(createTimeBegin==undefined){
				createTimeBegin=''
			}
			if(createTimeEnd==undefined){
				createTimeEnd=''
			}
			console.log(createTimeBegin)
			var parms ="{'page':'1','rows':'10','merchantName':'"+merchantName+"','createTimeBegin':'"+createTimeBegin+"','createTimeEnd':'"+createTimeEnd+"'}"
			var res= reqAjax(FINDANNOUNCEMNETS,parms);
			//模拟渲染
		    var render = function(data, curr){
		        var arr = []
		            ,thisData = res;
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
		        ,curr: function(){ //通过url获取当前页，也可以同上（pages）方式获取
		            var page = location.search.match(/page=(\d+)/);
		            return page ? page[1] : 1;
		        }()
		        ,jump: function(obj,first){
		        	var parms ="{'page':'"+obj.curr+"','rows':'10','merchantName':'"+merchantName+"','createTimeBegin':'"+createTimeBegin+"','createTimeEnd':'"+createTimeEnd+"'}"
					var res= reqAjax(FINDANNOUNCEMNETS,parms);
		            commercialDetail(res);
		            document.getElementById('paging-box-count').innerHTML = render(res.data, obj.curr);
		            $('#paging-box-count').html('共'+ obj.pages +'页，每页'+rows+'条');
		        }
		        });
		})
				

					
				
				
				
				
				
		//显示详情
		$('#common-table').on('click','.details',function(){
			var sysUserId = $(this).parent().siblings('.td2').html(); //平台用户id
			var merchantName = $(this).parent().siblings('.td3').html(); //商户名称
			var phoneNumber = $(this).parent().siblings('.td4').html();//电话号码
			var address = $(this).parent().siblings('.td5').html();//地址
			var username = $(this).parent().siblings('.td6').html();//管理员名称
			var username = $(this).parent().siblings('.td7').html();//所属行业
			var createTime = $(this).parent().siblings('.td9').html();//注册时间
			var bussinessLicence = $(this).parent().siblings('.bussinessLicence').html();//营业执照
			var licenseFront = $(this).parent().siblings('.licenseFront').html();//营业执照正面
			var licenseBack = $(this).parent().siblings('.licenseBack').html();//营业执照反面
			var idCardFront = $(this).parent().siblings('.idCardFront').html() || "";//身份证正反面
			var username = $(this).parent().siblings('.td6').html();//管理员名称
			var cityId = $(this).parent().siblings('.cityId').html();//城市ID		
			var cheProvinceId = $(this).parent().siblings('.provinceId').html();//省份ID
			var approveMsg = $(this).parent().siblings('.approveMsg').html();//审核意见
			var Provinceres= reqAjax(GETBASEAREAINFOBY,"{'code':'"+cheProvinceId+"'}");//obj 省
			var city= reqAjax(GETBASEAREAINFOBY,"{'code':'"+cityId+"'}")//obj 市
			$('#chaSysUserId').html(sysUserId);
			$('#chaMerchantName').html(merchantName);
			$('#chaPhoneNumber').html(phoneNumber);
			$('#chaBussinessLicence').html(bussinessLicence);
			$("#idCardFront>p>img").attr('src',idCardFront);
			$('#chaLicenseFront>p>img').attr('src',licenseFront);
			$('#chaLicenseBack>p>img').attr('src',licenseBack);
			
			if(Provinceres.code==1){
				$('#chaProvinceId').html(Provinceres.data.areaname);
			}else{
				$('#chaProvinceId').html('')
			}
			
			if(city.code==1){
				$('#chaCityId').html(city.data.areaname);
			}else{
				$('#chaCityId').html('')
			}
			
			$('#chaAddressDetail').html(address);
			$('#chaCreateTime').html(createTime);
			$('#chaapproveMsg').html(approveMsg);
	})
		
})(jQuery)