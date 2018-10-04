layui.use(['form', 'layer', 'jquery', 'laydate', 'table', 'laypage'], function() {
			var form = layui.form,
				layer = layui.layer,
				$ = layui.jquery,
				laydate = layui.laydate,
				table = layui.table,
				laypage = layui.laypage;

			var userNo = sessionStorage.getItem("userno") || "";

			//接口
			var server = {
				selMerchantUpgradePageList: 'merchantUpgrade/selMerchantUpgradePageList', //(查询列表)
				selectUserInfo:'payStatistics/selectUserInfo',//(信息查看)
				audit: 'merchantUpgrade/auditMerchantUpgrade', //(审核)
				exportMerchantUpgrade : 'payExcel/exportMerchantUpgrade'//(下载地址)
			}
			// 金额格式化
			function fmoney(s, n) {
				if(null == s || undefined == s) {
					return "";
				}
				n = n > 0 && n <= 20 ? n : 2;
				s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
				var l = s.split(".")[0].split("").reverse(),
					r = s.split(".")[1];
				t = "";
				for(i = 0; i < l.length; i++) {
					t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
				}
				return t.split("").reverse().join("") + "." + r;
			}
			//日期控件
			var startDate = laydate.render({
				elem: '#startDate',
				min:"1970-1-1",//设置min默认最小值  
				done: function(value,dates) {
					$('.startDate').eq(0).attr('data-date', value)
					if(JSON.stringify(dates) == "{}"){
						endDate.config.min ={ 
			                 year:1970,   
			                 month:1, //关键  
			                 date: 1,   
			                 hours: 0,   
			                 minutes: 0,   
			                 seconds : 0  
				        }; 
					}else{
						endDate.config.min ={ 
			                 year:dates.year,   
			                 month:dates.month-1, //关键  
			                 date: dates.date,   
			                 hours: 0,   
			                 minutes: 0,   
			                 seconds : 0  
				        }; 
					}
				}
			});
		
			var endDate = laydate.render({
				elem: '#endDate',
				max:"2099-12-31",//设置一个默认最大值 
				done: function(value,dates) {
					$('.endDate').eq(0).attr('data-date', value)
					if(JSON.stringify(dates) == "{}"){
						startDate.config.max ={ 
			                 year:2099,   
			                 month:12, //关键  
			                 date: 31,   
			                 hours: 0,   
			                 minutes: 0,   
			                 seconds : 0  
				        }; 
					}else{
						startDate.config.max={  
				        year:dates.year,   
			                month:dates.month-1,//关键   
			                date: dates.date,   
			                hours: 0,   
			                minutes: 0,   
			                seconds : 0  
				       }   
					}
				}
			});

			//搜索
			$('#searchBtn').on('click', function() {
				tableInit();
			})
			//重置
			$('#resetBtn').on('click', function() {
				location.reload()
			})
			
			
			
				//表格操作
			table.on('tool(merchantTable)', function(obj) {
				var data = obj.data;
				console.log(data)
				//查看
				if(obj.event === 'showMerchant') {
						layer.open({
						title: ['商户账户详细信息', 'font-size:12px;background-color:#424651;color:#fff'],
						btn: ['确定'],
						type: 1,
						anim: 5,
						content: $('#addLayer'),
						area: ['1400px', '700px'],
						end: function() {
							addInit();
						},
						success: function(index,layero) {
							var parms = {
								type:1,
								id:data.merchantId
							}
							reqAjaxAsync(server.selectUserInfo,JSON.stringify(parms)).then(function(res){
								var data = res.data;
								$('#show1').val(data.userCode);
								$('#show2').val(data.userName);
								$('#show3').val(data.regular);
								$('#show4').val(data.locked);
								$('#show5').val(data.platformUserCode);
								$('#show6').val(data.registType);
								$('#show7').val(data.phone);
								$('#show8').val(data.trade);
								$('#show9').val(data.provinceName);
								$('#show10').val(data.cityName);
							})
						},
						yes: function(index,layero) {
							layer.close(index)
						}
					})
				}else if(obj.event === 'lookMerchant'){
					layer.open({
						title: ['用户账户详细信息', 'font-size:12px;background-color:#424651;color:#fff'],
						btn: ['确定'],
						type: 1,
						anim: 5,
						content: $('#addView'),
						area: ['1400px', '700px'],
						end: function() {
							addInito();
						},
						success: function(index,layero) {
							var parm={
								type:0,
								id:data.referenceUserId
							};
							reqAjaxAsync(server.selectUserInfo,JSON.stringify(parm)).then(function(res){
								var data=res.data;
								$('#look1').val(data.userCode);
								$('#look2').val(data.userSex);
								$('#look3').val(data.userbirth);
								$('#look4').val(data.userName);
								$('#look5').val(data.residence);
								$('#look6').val(data.locked);
								$('#look7').val(data.phone);
								$('#look8').val(data.registType);
								$('#look9').val(data.regMode);
								$('#look10').val(data.isrealname);
								
							})

						},
						yes: function(index,layero) {
							layer.close(index)
						}
					})
				}else if(obj.event === 'adut'){
					layer.open({
						title: ['线下升级审核', 'font-size:12px;background-color:#424651;color:#fff'],
						btn: ['确定','取消'],
						type: 1,
						anim: 5,
						content: $('#addUser'),
						area: ['1400px', '700px'],
						end: function() {
							addInitView();
						},
						success: function(index,layero) {
							$('#audit1').val(data.upgradeTypeStr);
							$('#audit2').val(data.upgradeAmount);
							$('#audit3').val(data.payerName);
							$('#audit4').val(data.payerNo);
							$('#audit7').val(data.referenceUserName);
							$('#audit8').val(data.referenceAmount);

				        	//给保存按钮添加form属性
							$("div.layui-layer-page").addClass("layui-form");
							$("a.layui-layer-btn0").attr("lay-submit","");
							$("a.layui-layer-btn0").attr("lay-filter","formDemo");
						},
						yes: function(index,layero) {
				        	form.on('submit(formDemo)', function(done) {
				        		if(done){
									// 运营平台审核人员信息
									var upgradeAuditUserId = yyCache.get("userId");
									var upgradeAuditUserName = yyCache.get("username");									
									var upgradeRealAmount=$('#audit5').val();
									var auditName=$('#audit6').val();
									var status=$('#audit9>:checked').val();
									var remark=$('#audit10').val();
									if(status==2&&remark==""){
										layer.msg('不通过时,请输入原因');
										return;
									};
									var parm = {
										id : data.id,
										upgradeRealAmount :upgradeRealAmount,
										auditName:auditName,
										status : status,
										remark : remark
									};
									reqAjaxAsync(server.audit,JSON.stringify(parm)).then(function(res){
										if(res.code==1){
											layer.msg(res.msg);
										}else{
											layer.msg(res.msg);
										}
									})
				        		}
				        	})							
						}
					})
				}
			});
	
			//清空表单
			function addInit(){
				$('#show1').val("");
				$('#show2').val("");
				$('#show3').val("");
				$('#show4').val("");
				$('#show5').val("");
				$('#show6').val("");
				$('#show7').val("");
				$('#show8').val("");
				$('#show9').val("");
				$('#show10').val("");
				
			}
			//清空表单
			function addInito(){
				$('#look1').val("");
				$('#look2').val("");
				$('#look3').val("");
				$('#look4').val("");
				$('#look5').val("");
				$('#look6').val("");
				$('#look7').val("");
				$('#look8').val("");
				$('#look9').val("");
				$('#look10').val("");
			}
			//清空表单
			function addInitView(){
				$('#audit1').val("");
				$('#audit2').val("");
				$('#audit3').val("");
				$('#audit4').val("");
				$('#audit5').val("");
				$('#audit6').val("");
				$('#audit7').val("");
				$('#audit8').val("");
				$('#audit9').val("");
				$('#audit10').val("");
			}

			
			
			//导出excel
			$('#addButton').on('click', function(){
					var parms = {
						status:0,
						onOffLine:2,
						commissionStatus : null,
						merchantOrgName:$('#merchantOrgName').val()||"",
						serialNo:$('#serialNo').val()||"",
						applyTimeStart:$('#startDate').val()||"",
						applyTimeEnd:$('#endDate').val()||""
					};
					downloadFile(server.exportMerchantUpgrade,JSON.stringify(parms))
			})

			//layer展开
			$('body').on('click', '.layui-layer .layui-layer-content .package-some', function() {
				if($(this).children('i.description').html() == '展开') {
					$(this).children('i.description').html('收起')
					$(this).children('i.icon').addClass('deg');
					$(this).parent().siblings('.app-layer-content').children('ul').hide();
					$(this).parent().siblings('.app-layer-content').children('.layer-place').show();
				} else {
					$(this).children('i.description').html('展开')
					$(this).children('i.icon').removeClass('deg');
					$(this).parent().siblings('.app-layer-content').children('ul').show();
					$(this).parent().siblings('.app-layer-content').children('.layer-place').hide();
				}
			})
			$('body').on('click', '.layui-layer .layui-layer-content .layer-place', function() {
				$(this).hide();
				$(this).siblings('ul').show();
				$(this).parent().siblings().children('.package-some').children('.description').html('展开');
				$(this).parent().siblings().children('.package-some').children('.icon').removeClass('deg');
			})



				//pageCallback
				function pageCallback(index, limit, callback) {
					var parms = {
						pageSize: limit,
						pageNo: index,
						status:0,
						onOffLine:2,
						commissionStatus : null,
						merchantOrgName:$('#merchantOrgName').val()||"",
						serialNo:$('#serialNo').val()||"",
						applyTimeStart:$('#startDate').val()||"",
						applyTimeEnd:$('#endDate').val()||""
					};
					reqAjaxAsync(server.selMerchantUpgradePageList, JSON.stringify(parms)).then(function(res) {
						if(res.code != 1) {
							return layer.msg(res.msg);
						}
						var data = res.data.list;
						$.each(data, function(i, item) {
							$(item).attr('eq', (i + 1));
							$(item).attr('money',fmoney(item.upgradeAmount,2));
							if(item.upgradeType==1){
								$(item).attr('_upgradeType','合作商户');
							}else if(item.upgradeType==2){
								$(item).attr('_upgradeType','代理商户');
							}else if(item.upgradeType==3){
								$(item).attr('_upgradeType','合作商户续费');
							}else if(item.upgradeType==4){
								$(item).attr('_upgradeType','代理商户续费')
							}

						});
						return callback(res);
					})
				}

				//当前表格渲染
				function tableInit() {
					var _obj = _tableInit('merchantTable', [
							[{
								title: '序号',
								align: 'left',
								field: 'eq',
							}, {
								title: '流水号',
								align: 'left',
								field: 'serialNo',
							}, {
								title: '账户名称',
								align: 'left',
								templet: '#merchantName',
								event:'showMerchant'
							}, {
								title: '商户名称',
								align: 'left',
								templet: '#orgName',
								event:'showMerchant'
							}, {
								title: '升级类型',
								align: 'left',
								field: '_upgradeType',
							}, {
								title: '缴费人',
								align: 'left',
								field:'payerName'
							}, {
								title: '缴费账户',
								align: 'left',
								field: 'payerNo',
							}, {
								title: '缴费金额',
								align: 'left',
								field: 'money',
							}, {
								title: '办理人员',
								align: 'left',
								templet: '#referenceUserName',
								event:'lookMerchant'
							},{
								title: '申请时间',
								align: 'left',
								field: 'applyTime',
							},{
								title: '操作',
								align: 'left',
								templet: '#adut',
							}]
						],
						pageCallback, 'layTablePage'
					)
					return _obj.cols
				}
				tableInit();
				
				tableArr = tableInit();
				var Dynamic = function() {};
			
				Dynamic.prototype.creatBtn = function() {
					$('<button class="layui-btn my-btn add" lay-event="set" id="dtHead" style="margin-right:10px">设置</button>').appendTo($('.tool-add-box'));
					$('#dtHead').on('click', function() {
						dynamic.setLayer()
					})
				}
			
				Dynamic.prototype.checkbox = "";
			
				Dynamic.prototype.getCols = function(t) {
					var that = this;
					t = t[0];
					that.checkbox += '<div class="layui-form" id="layuiCheck" style="padding: 40px;"  lay-filter="mytest">'
					t.forEach(function(c, i, a) {
						that.checkbox += '<div class="my-layui-checkbox" style="float: left;padding: 20px;"><input type="checkbox" name=' + c.field + "|"+ c.templet + "|" + c.title +"|"+ c.event + '  title=' + c.title + '><div class="layui-unselect layui-form-checkbox" lay-skin=""><span>' + c.title + '</span><i class="layui-icon"></i></div></div>'
					})
					that.checkbox += '</div>'
					return this.checkbox
				}
			
				Dynamic.prototype.initLayer = function() {
					$("div.layui-layer-page").addClass("layui-form");
					$("a.layui-layer-btn0").attr("lay-submit", "");
					$("a.layui-layer-btn0").attr("lay-filter", "formtest");
					form.render(null, 'mytest');
				}
			
				Dynamic.prototype.endLayer = function() {
					this.checkbox = ""
				}
			
				Dynamic.prototype.yesLayer = function() {
					form.on('submit(formtest)', function(data) {
						if(JSON.stringify(data.field)!= "{}") {
							var obj = [];
							var j = data.field;
							for(var i in j) {
								var arr1=[];
								var arr = i.split('|');
								if(arr[1]=='undefined'){
									Array.prototype.push.call(obj, {
										title: arr[2],
										align: "left",
										field: arr[0]
									
									});									
								}else if(arr[0]=='undefined'){
									Array.prototype.push.call(obj, {
										title: arr[2],
										align: "left",
										templet: arr[1],
										event:arr[3]
									});										
								}

							}
							_tableInit('merchantTable', [obj], pageCallback, 'layTablePage')
							layer.closeAll();
						} else {
							layer.msg('请至少选择一项')
						}
					})
				}
			
				Dynamic.prototype.setLayer = function() {
					var that = this;
					layer.open({
						title: ['设置', 'font-size:12px;background-color:#424651;color:#fff'],
						btn: ['确定', '取消'],
						type: 1,
						anim: 5,
						content: dynamic.getCols(tableArr),
						area: ['1000px', '250px'],
						end: function() {
							that.endLayer();
						},
						success: function(index, layero) {
							that.initLayer();
						},
						yes: function(index, layero) {
							that.yesLayer();
						},
						btn2: function(index, layero) {
							that.endLayer();
						}
					})
				}
			
				var dynamic = new Dynamic();
				dynamic.creatBtn();				
				
				// 金额格式化
				function fmoney(s, n){ 
					if(null==s || undefined ==s ) {
						return "";
					}
				   n = n > 0 && n <= 20 ? n : 2;   
				   s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";   
				   var l = s.split(".")[0].split("").reverse(),   
				   r = s.split(".")[1];   
				   t = "";   
				   for(i = 0; i < l.length; i ++ ){   
					  t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");   
				   }   
				   return t.split("").reverse().join("") + "." + r;
				}

				//表格方法
				/* 表格初始化
				 * tableId: 表格容器ID
				 * cols:table配置
				 * pageCallback回调(异步)
				 * pageDomName:分页容器ID
				 */
				function _tableInit(tableId, cols, pageCallback, pageDomName) {
					var tableIns, tablePage;
					//1.表格配置
					tableIns = table.render({
						id: tableId,
						elem: '#' + tableId,
						height: 'full-250',
						cols: cols,
						page: false,
						even: true,
						limit: 15,
						cellMinWidth:80,
						done: function(res, curr, count) {
							$('body').on('click', '.layui-table-body table tr', function() {
								$(this).addClass('layui-table-click').siblings().removeClass('layui-table-click')
							})
						}
					});

					//2.第一次加载
					pageCallback(1, 15, function(res) {
						tableIns.reload({
							data: res.data.list
						})
						//第一页，一页显示15条数据
						layui.use('laypage');
						var page_options = {
							elem: pageDomName,
							count: res ? res.data.total : 0,
							layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
							limits: [15],
							limit: 15
						}
						page_options.jump = function(obj, first) {
							tablePage = obj;
							//首次不执行
							if(!first) {
								pageCallback(obj.curr, obj.limit, function(resTwo) {
									tableIns.reload({
										data: resTwo.data.list
									});
								});
							}
						}
						layui.laypage.render(page_options);
					});
					return {
						cols:cols
					}
				}

		})