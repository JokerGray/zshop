	var valve=true,params;
		$(function(){
			$('#photoName,input[type="file"]').bind('input propertychange', function() {
				dataInteract();
			});
		params = getParams();
		$('input[name="albumId"]').val(params.albumId||"");
		$('input[name="userId"]').val(params.userId||"");
		$('input[name="circleId"]').val(params.circleId||"");
		$('input[name="id"]').val(params.id||"");
		if(!params.albumId){
			$('#save').html('保存');
		}else{
			$('#save').html('修改');
			var cmd = "circle/getPhones";
			data = {
				albumId:params.albumId,
				circleId:params.circleId,
				type:"1"
			}
			function setData(re){
				$('.bgShow').attr('src',re.data[0].albumUrl);
				$('#photoName').val(re.data[0].albumName);
			    $('input[name="albumUrl"]').val(re.data[0].albumUrl);
				$('input[name="albumId"]').val(re.data[0].albumId);
				$('input[name="userId"]').val(re.data[0].userId);
				$('input[name="circleId"]').val(re.data[0].circleId)
			}
			ajaxAsy(cmd,data,setData)
		}
		});
		function getParams(){
            var url = location.search;
            var params = new Object();
            if (url.indexOf("?") != -1) {
                var str = url.substr(1);
                var strs = str.split("&");
                for (var i = 0; i < strs.length; i++) {
                    params[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
                }
            }
            return params;
        }
		//数据交互方式
		function dataInteract() {
			var evt = new Event('detaInteract');
			evt.prefix = 'addPhoto';
			evt.params = {
				mienText: $('#photoName').val().trim(),
				bgImgs: $('.bgShow').attr('src')
			}
			parent.window.dispatchEvent(evt);
		}
		//取消 
		$('#cancel').click(function() {
			parent.window.$('#videoBack').trigger('click')
		})
		//保存
		$('#save').click(function() {
			var albumUrl = $('.bgShow').attr('src');
			var albumName = $('input[name="albumName"]').val();
			var circleId = $('input[name="circleId"]').val();
			var userId = $('input[name="userId"]').val()||731;
			var id = $('input[name="id"]').val();
			var albumId = $('input[name="albumId"]').val();
			if(albumName.length<1){
				return parent.index.sweetAlert('请正确输入相册名称',"warning")
			}
			if(albumUrl=""||!albumUrl){
				return parent.index.sweetAlert('请选择背景图片',"warning")
			}

			if(albumId!=""){
				var data = {albumUrl:$('.bgShow').attr('src'),albumName,userId,circleId,albumId,id},
				cmd = 'circle/updateBackCover';
				callback = function(re){
					console.log(re)
					parent.index.sweetAlert(re.msg,"success");
					parent.index.initPhoto();
				}
				ajaxAsy(cmd,data,callback)
				
			}else{
				var data = {albumUrl:$('.bgShow').attr('src'),albumName,userId,circleId},
					cmd = 'circle/addBackCover';
					callback = function(re){
						console.log(re)
					parent.index.sweetAlert(re.msg,"success");
					parent.index.initPhoto();
				}
				ajaxAsy(cmd,data,callback)
			}
			
			
		})
		function ajaxAsy(cmd,data,callback){
			var apikey = params.apikey||'test'; 
			var data = JSON.stringify(data);
			if(valve){
				$.ajax({
					type: "POST",
					url: "/zxcity_restful/ws/rest",
					dataType: "json",
					data: {
						cmd: cmd,
						data: data
					},
					beforeSend: function(request) {
						valve = false
						request.setRequestHeader("apikey", apikey);
					},
					success: function(re) {
						if(re.code == 1) {
							callback(re);
						} else {
							parent.index.sweetAlert(re.msg,"warning")
						}
					},
					error: function(re) {
						parent.index.sweetAlert(re.msg,"warning")
					},
					complete: function() {
						valve = true
					}
				});
			}
		};
		function upImg(arg) {
			parent.layer.open({
				type: 2,
				title: '图片裁剪',
				closeBtn: 0,
				skin: 'imgcrop',
				area: ['820px', '600px'],
				content: './imgCrop/imgCrop.html',
				btn: ['取消', '确定'],
				btn2: function(index) {
					var res = top.window["layui-layer-iframe" + index].callbackdata();
					$('.bgShow').attr('src',res.imgCrop);
					$('input[name="albumUrl"]').val(res.imgCrop);
					dataInteract()
				}
			});
		}
		