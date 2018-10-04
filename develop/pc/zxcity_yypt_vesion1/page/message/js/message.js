$(function() {
    uploadOss({
        btn: 'upload1',
        imgDom: "preview1",
        flag: "reg",
        num: 1
    });
    $("#title").focus(function() {
        $(".verify").hide();
    })
    $("#title").blur(function() {
        $("#title").removeClass("verifyInfo");
    })

})

$(document).on("click", "#submit", function() {
    submitData();
});

function submitData() {
	var USERID=121;
	if(window.location.host=='managernew.izxcs.com'){
	    USERID=1706
	}
    var title = $("#title").val();
    editor.sync();
    var richText = document.getElementById('applicationform').value;
    if (trim(title) == '' || trim(title) == undefined || trim(title) == null) {
        $("#title").addClass("verifyInfo");
        $(".verify").show();
        return false;
    };
    var params = {
    	userId:USERID,//表示系统发送
    	msgTitle:title,
        msgContent: title,
        contentPic: urls,
        linkUrl: trim(richText)
    }
    reqAjaxAsync("game/insertGameMsg", JSON.stringify(params)).done(function(res) {
        layer.load(1, {
            shade: [0.1, '#fff']
        });
        setTimeout(function() {
            if (res.code == 1) {
                layer.msg("提交成功");
                layer.closeAll('loading');
                dataSetEmpty();
            } else {
                layer.msg(res.msg);
            }
        }, 500);
    })
}

function trim(str) { //删除左右两端的空格
    return str.replace(/(^\s*)|(\s*$)/g, "");
};

function dataSetEmpty() {
    $("#title").val('');
    $('#upload1').css({
        'background': 'url(img/add-3.png) no-repeat center center',
    });
   document.getElementById('applicationform').value = ''; 
}
