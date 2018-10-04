(function($) {
		const GETUSERBYORGID = 'operations/getUsersByOrgId',
			  ORGANIZATIONLIST = 'operations/organizationList',
			  UPDATEUSER = 'operations/updateUser'
		
		var layer = layui.layer;
		var form = layui.form;
		var phone,uname,birthday,sex,id,orgno,userpic,role_id,name,status;
		$(function(){
			//上传图片
		  $('#uploadImg').css({
		  	'width':160,
		  	'height':160,
		  	'left':100,
		  	'position':'relative',
		  	'border-radius':0
		  })
		  uploadOss({
		    btn: "changePic",
		    flag: "img",
		    size: "5mb"
		  });
		  
		 
		  
		  
		 var oldphone = yyCache.get('phone');
		 var parms = "{'page':1,'rows':100,'organizationId':'','uname':'','phone':'"+oldphone+"'}"
		 var res = reqAjax(GETUSERBYORGID, parms);
		 var data = res.data;
		  name = data[0].name;
		  uname = data[0].uname;
		  phone = data[0].phone;
		  birthday = data[0].birthday;
		  sex = data[0].sex;
		  id = data[0].id;
		  orgno = data[0].orgno;
		  userpic = data[0].userpic;
		  role_id = data[0].role_id;
		  status = data[0].status;
			//日期选择
			$('#datetimepicker1 input').datepicker({
				format: 'yyyy-mm-dd',
				autoclose: false,
				language: "zh-CN",
				todayHighlight:true
			}).on('changeDate', function(ev) {
				var startTime = ev.date.valueOf();
				$(this).parent().attr('data-time',startTime);
			});

		 $('#uname').val(uname);
		 $('#jurisdiction-begin').val(birthday);
		$('#jurisdiction-begin').attr("placeholder",birthday);
		 $('#sex').val(sex);
		 $('#typeSelectr').val(orgno);
		 $('#phone').val(phone);
		 $('#uploadImg').attr('src',userpic)
		 form.render();
	})
	
	
	selectList();
	function selectList(){
		var parms = "{'page':1,'rows':100,'name':'','sort':'sort','order':'asc'}"
		var res = reqAjax(ORGANIZATIONLIST, parms);
		var data = res.data;
		var sHtml = ''
		$.each(data, function(i, item) {
			sHtml += `<option value=` + item.id + `>` + item.name + `</option>`
		});
		$('#typeSelectr').append(sHtml)
	}
	  
	
	  
	  
	  $("#clear").click(function(){
	  		$('#uname').val('');
	  		$('#typeSelectr').val('');
	  		$('#sex').val('');
	  		$('#birthday').val('');
	  		$('#phone').val('');
	  		var userpic = $('#uploadImg').attr('src','images/user.png');
	  		form.render();
	  })
	  
	  
	  $('#save').click(function(){
	  		form.render();
	  		var uname = $('#uname').val();
	  		var orgno = $('#typeSelectr').val();
	  		var sex = $('#sex').val();
	  		var phone = $('#phone').val();
	  		var userpic = $('#uploadImg').attr('src');
		  if($('#jurisdiction-begin').val()==""){
			  var birthday =$('#jurisdiction-begin').attr("placeholder");
		  }else{
			  var birthday =$('#jurisdiction-begin').val();
		  }
			form.on('submit(formDemo)', function(done) {
					var param ={
		                id: id,
		                name:name,
		                uname:uname,
		                orgno:orgno, //组织id
		                sex:sex,
		                birthday:birthday,
		                phone:phone,
		                userpic:userpic,
		                roleIds:role_id,
		                status:status,
		                note:"",
		                update_id:id //当前登录用户ID
              		}
					console.log(JSON.stringify(param))
					var res = reqAjax(UPDATEUSER, JSON.stringify(param));
					sessionStorage.setItem('phone',phone);
					layer.msg(res.msg)
			})
	  })
	  

})(jQuery)