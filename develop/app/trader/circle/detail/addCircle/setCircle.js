$(function(){
	function SetCircle(){
		this.init();
		
	}
	$.extend(true, SetCircle.prototype,{
		init:function(){
			this.getParams();
			this.getData();
			this.initUpload();
			this.synData();
			this.detaInteract();
			this.toBack();
			this.submitData();
		},
		getParams: function() {
				var url = location.search;
				var params = new Object();
				if(url.indexOf("?") != -1) {
					var str = url.substr(1);
					var strs = str.split("&");
					for(var i = 0; i < strs.length; i++) {
						params[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
					}
				}
				this.params = params;
			},
		ajaxAsy: function(cmd, datas, callback) {
				var that = this;
				var apikey = that.params.apikey || 'test';
				var version = that.params.version || "1";
				var data = JSON.stringify(datas);
				$.ajax({
					type: "POST",
					url: "/zxcity_restful/ws/rest",
					dataType: "json",
					data: {
						cmd: cmd,
						data: data
					},
					beforeSend: function(request) {
						request.setRequestHeader("apikey", apikey);
						that.permit = false;
					},
					success: function(re) {
						
						if(re.code==1){
							callback(re);
						}else{
							parent.window.index.sweetAlert(re.msg,"warning")
						}
						that.permit = true;
					},
					error: function(re) {
						parent.window.index.sweetAlert('网络错误,稍后重试',"warning")
						that.permit = true;
					}
				});
			},
		getData: function() {
				//查询标签
				var that = this;
				/*
				var cmd = "circle/getMLNew";
				var datas = {
					sStartpage: 1, markBusiness: "B", sPagerows:40
				};
				* 
				*/
				var cmd = "circle/listAllLabel";
				var datas = {
					page: 0, markBusiness: "B", row:40
				};
				var callback = that.setData;
				that.ajaxAsy(cmd, datas, callback);
			},
		setData:function(re){
			console.log(re)
			if(re.code==1){
				for(var i = 0; i < re.data.length; i++) {
					//var sp = '<button class="btn btn-white btn-sm serviceMark" type="button"  value="' + re.data[i].markContent + '">' + re.data[i].markContent + '</button>'
					var sp = '<button class="btn btn-white btn-sm serviceMark" type="button"  value="' + re.data[i].id + '">' + re.data[i].labelName + '</button>';
					$('#markBox').append(sp);
				}
				$('.serviceMark').on('click', function() {
					var input = $(this).siblings('input');
					var arr = [];
					var cke = $('.serviceMark.btn-info').length
					if(cke < 1 || $(this).hasClass('btn-info')) {
						$(this).toggleClass('btn-info').toggleClass('btn-white');
					} else{
						return
					}
					  //选择多个标签
					$('.serviceMark.btn-info').each(function() {
						arr.push($(this).attr('value'));
					});					
					$('#serviceMark').val(arr.join());
					setCircle.detaInteract();
				})
			}
		},
		initUpload:function(){
			var that = this;
			var uploader =  new plupload.Uploader({
                runtimes: 'html5,html4',
                browse_button: 'upFace',
                multi_selection: false,
                unique_names:true,
                url: 'https://oss.aliyuncs.com',
                filters: {
                    mime_types: [{
                        title: "图片文件",
                        extensions: 'jpg,jpeg,gif,png,bmp'
                    }],
                    max_file_size: "10mb",
                    prevent_duplicates: false
                }
        	});
        	uploader.init();
        	uploader.bind('FilesAdded', function(up, files) {
        	    statrUpload(up,files[0]);
        	});
        	uploader.bind('UploadProgress', function(up, file) {
//      		$(dom).find('.progressContent .progress-bar').css('width', file.percent + "%");
        	});
        	uploader.bind('FileUploaded', function(up, file, info) {
        		if(info && info.status == 200) {
        			var src = OSSParams.host + '/' + OSSParams.dir + '/' + file.name;
        			$('#upFace').attr('src',src+'?x-oss-process=image/resize,m_fill,w_340,h_220,limit_0');
        			$('#url').val(src);
        			that.detaInteract();
        		} else {
        			console.log("上传失败，请重试");
        		}
        	});
        	function statrUpload(up,file) {
        		getOssParams().then(function(data) {
      				file.name = randomName();
        			var fileName = data['dir'] + '/' + file.name;
        			up.setOption({
        				url: data['host'],
        				multipart_params: {
        					key: fileName,
        					policy: data['policy'],
        					OSSAccessKeyId: data['accessid'],
        					success_action_status: 200,
        					signature: data['signature']
        				}
        			});
        			up.start()
        		});
        	}
        	function randomName(len) {
        		len = len || 23;
        		var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
        		var maxPos = chars.length;
        		var str = '';
        		for(i = 0; i < len; i++) {
        			str += chars.charAt(Math.floor(Math.random() * maxPos));
        		}
        		return new Date().getTime() + str;
        	}
        	var OSSParams;
        	function getOssParams() {
        		var defer = $.Deferred();
        		if(OSSParams && OSSParams.expire > new Date().getTime() / 1000) {
        			defer.resolve(OSSParams);
        		} else {
        			$.ajax({
        				url: '/zxcity_restful/ws/oss/ossUpload',
        				dataType: 'json',
        				success: function(data) {
        					OSSParams = data;
        					defer.resolve(data);
        				},
        				error: function() {
        					defer.reject();
        					console.log('上传参数获取失败！')
        				}
        			});
        		}
        		return defer.promise();
        	}
		},
		detaInteract:function(){
			var evt = new Event('detaInteract');
			evt.prefix = 'setCircle';
			evt.params = {
				url:$('#url').val(),
				name:$('#circleName').val(),
				markName:$('#serviceMark').val(),
				title:$('#circleDuc').val(),
				storeName:$('.storeName').html()
			};
			parent.window.dispatchEvent(evt);
		},
		synData:function(){
			var that = this;
			$('#circleName,#circleDuc').each(function(){
				$(this).bind("input propertychange",function(){
					that.detaInteract()	
				})
			})
		},
		toBack:function(code){
			var code =code || ""
			$('#toBack').on('click',function(){
				parent.window.index.backCircle(code)
			})
		},
		
		permit:true,
		submitData:function(){
			var _self = this;
			$('#submitBtn').on('click',function(){
				var detailTitlePic = $('#url').val();
				var detailName = $('#circleName').val().trim();
				var detailMarkName = $('#serviceMark').val();
				var isValidate = $('input[type="radio"]:checked').val();
				var detailTitle = $('#circleDuc').val();
				var shopId = _self.params.shopId;
				var detailCreatePeople = _self.params.userId;
				//var cmd = 'circle/addCircleNew20';
				var cmd = 'circle/insertCircleInfo';
				if(detailTitlePic==""){
					return parent.window.index.sweetAlert('请选择圈子头像',"warning");
				}
				if(detailName==""||detailName.length<2){
					return parent.window.index.sweetAlert('请正确输入圈子名称',"warning");
				}
				if(detailMarkName==""){
					return parent.window.index.sweetAlert('请选择标签',"warning");
				}
				if(detailTitle==""){
					return parent.window.index.sweetAlert('请输入圈子介绍',"warning");
				}
				/*
				var data = {
					detailTitlePic,detailName,detailMarkName,isValidate,detailTitle,shopId,detailCreatePeople
				}
				*/
				var data = {
					userId:detailCreatePeople,
					shopId:shopId,
					type:"1",//类型0个人1店铺
					circleName:detailName,  //圈子名称
					circlePortrait:detailTitlePic, //圈子封面
					circleLabelids:detailMarkName, //标签
					circleIntroduce:detailTitle, //圈子简介
					releaseProvince:returnCitySN["cid"].substring(0,2),
					releaseCity:returnCitySN["cid"].substring(0,4),
					releaseAddress:returnCitySN["cname"],
					joinType:isValidate
				}
				console.log(data)
				function callB(re){
						parent.window.index.sweetAlert('提交成功', "success");
						
						setTimeout(parent.window.index.backCircle(re.code),1000)
				}
				if(_self.permit){
					_self.ajaxAsy(cmd,data,callB)
				}
			})
		}	
	})
	window.setCircle = new SetCircle();
	
})
