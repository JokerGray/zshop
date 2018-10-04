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
				selMerchantUpgradePageList: 'merchantUpdate/selCompanyIncomeDetailList', //(查询列表)
				selectUserInfo:'payStatistics/selectUserInfo',//(信息查看)
//				audit: 'merchantUpgrade/auditMerchantUpgrade', //(审核)
				exportMerchantUpgrade : 'merchantUpdate/CompanyIncomeDetailListExport'//(下载地址)
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
						title: ['用户账户详细信息', 'font-size:12px;background-color:#424651;color:#fff'],
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
								type:0,
								id:data.merchantId
							}
							reqAjaxAsync(server.selectUserInfo,JSON.stringify(parms)).then(function(res){
								var data = res.data;
								$('#show1').val(data.userCode);
								$('#show2').val(data.userSex);
								$('#show3').val(data.userbirth);
								$('#show4').val(data.userName);
								$('#show5').val(data.residenceName);
								$('#show6').val(data.locked);
								$('#show7').val(data.phone);
								$('#show8').val(data.registType);
								$('#show9').val(data.regMode);
								$('#show10').val(data.isrealname);
							})
						},
						yes: function(index,layero) {
							layer.close(index)
						}
					})
				}else if(obj.event === 'lookMerchant'){
					layer.open({
						title: ['线上审核详情', 'font-size:12px;background-color:#424651;color:#fff'],
						btn: ['确定'],
						type: 1,
						anim: 5,
						content: $('#addUser'),
						area: ['1400px', '700px'],
						end: function() {
							addInito();
						},
						success: function(index,layero) {
								$('#audit1').val(data.upgradeTypeStr);
								$('#audit2').val(data.upgradeAmount);
								$('#audit3').val(data.serialNo);
								$('#audit4').val(data.referenceTaxation);
								$('#audit5').val(data.upgradeAmount);
								$('#audit6').val(data.referenceTaxation);
								$('#audit7').val(data.upgradeRealAmount);
								$('#audit8').val(data.auditName);
								$('#audit9').val(data.referenceUserName);
								$('#audit10').val(data.referenceAmount);
								$('#audit11').val(data.statusStr);
								$('#audit12').val(data.remark);
								
						

						},
						yes: function(index,layero) {
							layer.close(index)
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
				$('#audit11').val("");
				$('#audit12').val("");
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
//						status:0,
						onOffLine:1,
//						commissionStatus : null,
						merchantName: $("#merchantName").val(),
						serialNo: $("#serialNo").val(),
						upgradeType: $("#upgradeType").val()
					};
					reqAjaxAsync(server.selMerchantUpgradePageList, JSON.stringify(parms)).then(function(res) {
						if(res.code != 1) {
							return layer.msg(res.msg);
						}
						var data = res.data.list;
						$.each(data, function(i, item) {
							$(item).attr('eq', (i + 1));
							$(item).attr('money',fmoney(item.profitAmount,2));
							$(item).attr('money1',fmoney(item.upgradeAmount,2));
							if(item.upgradeType==1){
								$(item).attr('_upgradeType','开通');
							}else if(item.upgradeType==2){
								$(item).attr('_upgradeType','开通');
							}else if(item.upgradeType==3){
								$(item).attr('_upgradeType','续费');
							}else if(item.upgradeType==4){
								$(item).attr('_upgradeType','续费')
							};
							if(item.referenceMerchantLevel==6){
								$(item).attr('_referenceMerchantLevel','是');
							}else{
								$(item).attr('_referenceMerchantLevel','否');
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
								title: '商户名称',
								align: 'left',
								templet: '#name',
								event:'showMerchant'
							}, {
								title: '升级类型',
								align: 'left',
								field: 'upgradeTypeStr'
							}, {
								title: '缴费金额',
								align: 'left',
								field: 'money1',
							}, {
								title: '业务类型',
								align: 'left',
								field:'_upgradeType'
							}, {
								title: '是否内部员工',
								align: 'left',
								field: '_referenceMerchantLevel',
							}, {
								title: '公司盈利',
								align: 'left',
								field: 'money',
							}, {
								title: '审核时间',
								align: 'left',
								field: 'upgradeAutitTime'
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