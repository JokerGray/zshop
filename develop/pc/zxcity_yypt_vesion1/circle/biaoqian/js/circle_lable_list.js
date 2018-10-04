$(function () {
	//设置默认值
	var USERID=121;
	if(window.location.host=='managernew.izxcs.com'){
	    USERID=1706
	}
	//请求URL
	var USER_URL = {
        SEARCHLIST: "circle/listAllLabel",  //根据关键字模糊查询
        INSERT_LABLE:"circle/insertLabelSelective",//新增标签
        DELETE_LABLE:"circle/deleteLabelById" //删除标签
    };
    
    //获取参数
  	function getUrlParams(name) {
	    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	    var r = window.location.search.substr(1).match(reg);
	    if (r != null) {
      		r[2] = r[2].replace(new RegExp("%", 'g'), "%25");
      		return decodeURI(decodeURIComponent(r[2]));
    	}
    	return "";
  	}
  	
	var pageno=1;
  	var rows=10;
  	var paramKey = "";
  	var layer=layui.layer;
	var table = layui.table;
	var upload = layui.upload;
	//调用方法
  	getTable(paramKey,pageno);
	
  	function getTable(paramKeys,pageno) {    	
    	//第一个实例
    	var tableINs=table.render({
      		id:'demo',
      		elem: '#demo',
      		cols: [[ //表头
        		{type:'numbers',title: '序号',width: '40', templet:"#indexTpl"},
		        {field: 'id', title: '标签', width: '80',templet:"#labelNameTpl"}, 
		        {field: 'labelBgimg', title: '背景图片', width: '100', templet: "#imgTpl"},   
		        {field: 'createTime', title: '创建时间', width: '160'},  
		        {field: 'modifyTime', title: '修改时间', width: '160'},  
		        {title: '操作', width: '200',fixed: 'right', templet: '#checkboxTpl'}
      		]]
    	});

    	var res=pageCallback(paramKeys,pageno);
		if(res){
  			if(res.code==1){
		        tableINs.reload({
		          data: res.data
		        })
		    }else {
		        layer.msg(res.msg)
		    }
		}

		//分页
		layui.use('laypage');
		var page_options = {
  			elem: 'laypageLeft',
  			count: res ? res.total : 0,
  			layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
  			groups: '4',
  			limit: rows,//每页条数
  			limits: [5, 8, 10]
		}
		//分页渲染
		page_options.jump = function(obj, first) {
  			if(!first) {
    			var resTwo = pageCallback(paramKeys,obj.curr);
    			if(resTwo && resTwo.code == 1)
      				tableINs.reload({
        				data: resTwo.data
      				});
    			else
      				layer.msg(resTwo.msg);
  			}
		}
		layui.laypage.render(page_options);
  	}

  	//获取内容方法
  	function pageCallback(paramKeys,pagerows) {
    	var param={
      		keyWord: paramKeys,
      		//userId: USERID,
      		page: pagerows - 1 ,
        	row: rows
      		/*pagination:{
        		page: pagerows,
        		rows: rows
      		}*/
    	}
    	var res=reqAjax(USER_URL.SEARCHLIST,JSON.stringify(param));
    	if(res.code==1){
     		return res;
    	}
  	}
		
  	//搜索
  	$("#search").on('click', function (){
  		var paramKeys = $("#paramKeys").val();
  		getTable(paramKeys,pageno);
  	});

  	//监听工具条
	table.on('tool(test)', function(obj){
	    var data = obj.data;   
	    var layEvent = obj.event;   
	    if(layEvent=="to_del"){
	    	var delParam={
				id: data.id,
	      		userId: USERID
	    	}
			layer.confirm('确认删除该条数据吗', function(index){
				//异步请求
		    	reqAjaxAsync(USER_URL.DELETE_LABLE,JSON.stringify(delParam)).done(function(res) {
		    		if (res.code == 1) {
	                    obj.del();
			        	layer.close(index);
	                }else{
	                    layer.msg(res.msg);
	                }
		    	});
		    });
	    }
    
	});
	
	//图片上传
	function reqAjaxUpload(cmd, data){
	    var deferred = $.Deferred();
	    $.ajax({
	        type:"post",
	        dataType: 'json',
	        url:"/zxcity_restful/ws/rest",
	        headers: {
	            apikey: sessionStorage.getItem('apikey') || 'test'
	        },
	        data: {
	            cmd: cmd,
	            data: JSON.stringify(data),
	            version: 1 // 版本号根据情况默认
	        },
	        success: function(data){
	            deferred.resolve(data)
	        },
	        error: function(){
	            deferred.reject()
	        }
	    });
	    return deferred;
	}
	var OSSParams;
	window.pluploadList = [];
	// oss上传
	function initUpload(arg) {
	    var uploader = new plupload.Uploader({
	        runtimes: 'html5,html4',
	        browse_button: arg.dom,
	        multi_selection: false,
	        unique_names: true,
	        url: 'http://oss.aliyuncs.com',
	        filters: {
	            mime_types: arg.flag,
	            max_file_size: arg.fileSize,
	            prevent_duplicates: false
	        }
	    });
	    uploader.init();
	    uploader.bind('FilesAdded', function (up, files) {
	        $(arg.dom).siblings('.cover').addClass('active')
	        startUpload(up, files[0]);
	    });
	    uploader.bind('UploadProgress', function(up, file) {
	        // console.log(file.percent)
	        $(arg.dom).siblings('.cover').find('p').eq(0).text(file.percent + '%');
	    });
	    uploader.bind('Error', function (up, err, file) {
	        if (err.code == -600) {
	            layer.msg("选择的文件过大,视频大小限制在20M以内,图片大小限制在5M以内", {icon: 2});
	        } else if (err.code == -500) {
	            layer.msg('初始化错误', {icon: 2})
	        } else if (err.code == -601) {
	            layer.msg("不支持该文件格式", {icon: 2});
	        } else if (err.code == -602) {
	            layer.msg("这个文件已经上传过一遍了", {icon: 2});
	        } else {
	            layer.msg("系统繁忙，请稍后再试!", {icon: 2});
	        }
	        $(arg.dom).siblings('.cover').find('p').eq(0).text('0%');
	        $(arg.dom).siblings('.cover').removeClass('active')
	    });
	    uploader.bind('FileUploaded', function (up, file, info) {
	        if (info && info.status == 200) {
	            var src = OSSParams.host + '/' + OSSParams.dir + '/' + file.name;
	            $(arg.dom).attr('src', src);
	            $(arg.dom).siblings('input[type="hidden"]').val(src);
	            layer.msg('上传成功！', {icon: 1})
	        } else {
	            layer.msg("系统繁忙，请稍后再试!", {icon: 2});
	        }
	        $(arg.dom).siblings('.cover').find('p').eq(0).text('0%');
	        $(arg.dom).siblings('.cover').removeClass('active')
	    });
	    window.pluploadList.push(uploader);
	};
	//图片上传
	initUpload({
	    dom: $('#idCardBack').siblings()[0], 
	    flag: [{
	        title: '请上传背景图片',
	        extensions: 'jpg,png,jpeg,bmp'
	    }], 
	    fileSize: "10mb"
	});
	
	function startUpload(up, file) {
	    getOssParams().then(function (data) {
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
	    for (i = 0; i < len; i++) {
	        str += chars.charAt(Math.floor(Math.random() * maxPos));
	    }
	    return new Date().getTime() + str;
	}
	
	function getOssParams() {
	    var defer = $.Deferred();
	    if (OSSParams && OSSParams.expire > new Date().getTime() / 1000) {
	        defer.resolve(OSSParams);
	    } else {
	        var def = reqAjaxUpload('circle/ossUpload');
	        def.then(function(res){
	            OSSParams = res;
	            defer.resolve(res);
	        });
	        def.fail(function(err){
	            defer.reject();
	            layer.msg("系统繁忙，请稍后再试!");
	        });
	    }
	    return defer.promise();
	}
	
	//新增
	$("#add").on('click', function (){
  		$("#addTop").modal("show");
  		$("#addTopic").on('click', function (){
  			var img = $("#idCardBack").val();
	  		var name = $("#lablename1").val();
	  		var addParam = {
	  			userId: USERID,
	  			labelName: name,
	  			labelBgimg: img
	  		};
  			//异步请求
	    	reqAjaxAsync(USER_URL.INSERT_LABLE,JSON.stringify(addParam)).done(function(res) {
	    		if (res.code == 1) {
		        	$("#addTop").modal("hide");
	            }else{
	                layer.msg(res.msg);
	            }
	    	});
  		});
  	});
	
});
