$(document).ready(function(){
	$('#pub_title').click(function(){
		$('#pub_title').val('');
		$('#icon_length').html($('#pub_title').val().length);

		$('#pub_title').keydown(function(){
			var num = $('#pub_title').val().length;
			if(num >= 30) {
				alert('请输入30字以内的标题');
			} else {
				$('#icon_length').html(num + 1);
			}

		})
		
	})

	var editor; 
	KindEditor.ready(function(K){ 
		editor = K.create('#editor_id'); 
	
		var options = { cssPath:'/css/index.css',filterMode:true }; 
		var editor = K.create('textarea[name="content"]', options);
		//取得HTML内容 
		html = editor.html(); //同步数据后可以直接取得textarea的value 
		editor.sync(); 
		html = document.getElementById('editor_id').value;//原生API
		html = K('#editor_id').val();//KindEditorNodeAPI
		html = $('#editor_id').val();//jQuery //设置HTML内容 
		editor.html('HTML内容');
	});


})