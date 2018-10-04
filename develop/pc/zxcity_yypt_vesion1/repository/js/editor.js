/**
 * Created by Administrator on 2017/11/6.
 */
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

//富文本插入图片方法
function insertImg(src) {
    var img = $('<img src="' + src + '" style="max-width: 100%">')
    initEditor().cmd.do('insertHTML', img[0]);
}

//编辑器初始化
function initEditor(e) {
    var E = window.wangEditor;
    var apikey = getUrlParams('apikey') || 'test';
    var url = '/zxcity_restful/ws/rest?cmd=oa/uploadPicOSS';
    var editor = new E(e);
    //图片上传设置
    editor.customConfig.showLinkImg = false; //隐藏上传网络图片
    editor.customConfig.uploadImgServer = url;//上传图片接口
    editor.customConfig.uploadImgMaxSize = 5 * 1024 * 1024;//限制图片大小5M
    editor.customConfig.uploadImgMaxLength = 1;//限制一次最多能传5张图片
    editor.customConfig.uploadImgTimeout = 20000;//将timeout时间改为10s
    editor.customConfig.uploadImgShowBase64 = false;
    editor.customConfig.withCredentials = true;
    editor.customConfig.uploadImgHeaders = {
        'Accept': 'application/json, text/javascript, */*; q=0.01'
    }
    editor.customConfig.uploadImgParams = {
        version: 1
    }
    editor.customConfig.uploadImgHooks = {
        before: function (xhr, editor, files) {
            // 图片上传之前触发
            // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，files 是选择的图片文件

            // 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
            // return {
            //     prevent: true,
            //     msg: '放弃上传'
            // }
            xhr.setRequestHeader("apikey", apikey);
            layer.msg("图片上传中，请耐心等待!");
            layer.load(1, {shade: [0.1, '#fff']});
        },
        success: function (xhr, editor, result) {
           layer.closeAll('dialog');
            layer.closeAll('loading');
            layer.msg('图片上传成功！');
            // 图片上传并返回结果，图片插入成功之后触发
            // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
        },
        fail: function (xhr, editor, result) {
            layer.msg("图片插入错误，请重新上传!");
            layer.closeAll('loading');
            // 图片上传并返回结果，但图片插入错误时触发
            // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
        },
        error: function (xhr, editor) {
            layer.msg('图片请小于5M,请重新选择!');
            layer.closeAll('loading');
            // 图片上传出错时触发
            // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
        },
        timeout: function (xhr, editor) {
            layer.msg('上传图片超时请重新选择!');
            layer.closeAll('loading');
            // 图片上传超时时触发
            // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
        },

        // 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
        // （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
        customInsert: function (insertImg, result, editor) {
            // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
            // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果

            // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
            var url = result.data.imgURL;
            insertImg(url)

            // result 必须是一个 JSON 格式字符串！！！否则报错
        }
    }
    editor.customConfig.customAlert = function (info) {
        layer.msg("图片大小应小于5m")
        //info 是需要提示的内容
        /*layer.msg('图片上传失败,请点选编辑框要插入的位置!');*/
    }
    //菜单项配置
    editor.customConfig.menus = [
        'bold',  // 粗体
        'underline',  // 下划线
        'foreColor',  // 文字颜色
        'link',  // 插入链接
        'justify',  // 对齐方式
        'image',  // 插入图片
        /*'table',  // 表格*/
        /*'video',  // 插入视频*/
        'undo',  // 撤销
        'redo'  // 重复
    ]
    editor.customConfig.zIndex = 1;
    editor.create();
    return editor;
}