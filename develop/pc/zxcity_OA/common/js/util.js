//判断是否为空
function isNull(val) {
  if (val == null || val == "null" || val == undefined || val == "") {
    return true;
  }
  return false;
}

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

//同步ajax
function reqAjax(cmd, data) {
  var apikey = getUrlParams('apikey') || 'test';
  var version = getUrlParams('version') || '1';
  var reData;
  $.ajax({
    type: "POST",
    url: "/zxcity_restful/ws/rest",
    dataType: "json",
    async: false,
    data: {
      "cmd": cmd,
      "data": data,
      "version": version
    },
    beforeSend: function (request) {
      layer.load(0, {time: 10 * 1000});
      request.setRequestHeader("apikey", apikey);
    },
    success: function (re) {
      layer.closeAll('loading');
      reData = re;
    },
    error: function (re) {
      layer.closeAll('loading');
      var str1 = JSON.stringify(re);
      re.code = 9;
      re.msg = str1;
      reData = re;
    }
  });
  return reData;
}
//设置分页插件
function pagingInit(target,total,pageSize,fn) {
    //target:目标元素class或者id
    //total:数据条目总数
    //pageSize:每页显示数据的条目数
    //fn:执行的回调函数
    $(target).html('');
    if(total>pageSize){
        var p = new Paging();
        p.init({
            target:target,
            pagesize:pageSize,
            count:total,
            prevTpl:'上一页',
            nextTpl:'下一页',
            callback:function (page, size, count) {
                fn(page,size,count)
            }
        });
    }
}

//异步ajax
function reqAjaxAsync(cmd, data) {
  var apikey = getUrlParams('apikey') || 'test';
  var version = getUrlParams('version') || '1';
  var defer = $.Deferred();
  $.ajax({
    type: "POST",
    url: "/zxcity_restful/ws/rest",
    dataType: "JSON",
    data: {
      "cmd": cmd,
      "data": data || "",
      "version": version
    },
    beforeSend: function (request) {
      layer.load(0, {time: 10 * 1000});
      request.setRequestHeader("apikey", apikey);
    },
    success: function (data) {
      layer.closeAll('loading');
      /*defer.resolve(JSON.parse(html2Escape(JSON.stringify(data))));*/
      defer.resolve(data);
    },
    error: function (err) {
      layer.closeAll('loading');
      layer.msg("系统繁忙，请稍后再试!");
      console.log(err.status + ":" + err.statusText);
    }
  });
  return defer.promise();
}

//时间提示
function timePrompt(d) {
  var formatTimeS = new Date(d).getTime();
  var now = new Date().getTime();
  var data = (formatTimeS - now) / 1000 / 60 / 60 / 24;
  // if (data < 1) {
  //   data = 0.5
  // }

  return data;
}

//返回年月日时分
function formatDateTime(now) {
  var d = new Date(now);
  var hour = parseInt(d.getHours());
  var minute = parseInt(d.getMinutes());
  if (hour < 10) {
    hour = "0" + hour;
  }
  if (minute < 10) {
    minute = "0" + minute;
  }
  return formatDate(now) + " " + hour + ":" + minute;
}

//返回年月日
function formatDate(now) {
  var d = new Date(now);
  var month = parseInt(d.getMonth()) + 1;
  var day = parseInt(d.getDate());
  if (month < 10) {
    month = "0" + month;
  }
  if (day < 10) {
    day = "0" + day;
  }
  return d.getFullYear() + "-" + month + "-" + day;
}
//比较日期大小
function compareDate(startdate,enddate){
    var arr=startdate.split("-");
    var starttime=new Date(arr[0],arr[1],arr[2]);
    var starttimes=starttime.getTime();

    var arrs=enddate.split("-");
    var lktime=new Date(arrs[0],arrs[1],arrs[2]);
    var lktimes=lktime.getTime();

    if(starttimes > lktimes){
        return false;
    }else{
        return true;
    }
}
//编辑器初始化
function initEditor(dom) {
  var E = window.wangEditor;
  var apikey = getUrlParams('apikey') || 'test';
  var version = getUrlParams('version') || 1;
  var url = '/zxcity_restful/ws/rest?cmd=oa/uploadPicOSS';
  var editor = new E('#' + dom);
  //图片上传设置
  editor.customConfig.showLinkImg = false; //隐藏上传网络图片
  editor.customConfig.uploadImgServer = url//上传图片接口
  editor.customConfig.uploadImgMaxSize = 5 * 1024 * 1024//限制图片大小5M
  editor.customConfig.uploadImgMaxLength = 1//限制一次最多能传5张图片
  editor.customConfig.uploadImgTimeout = 5 * 60 * 1000//将timeout时间改为5min
  editor.customConfig.uploadImgShowBase64 = false;//是否使用base64保存图片
  editor.customConfig.withCredentials = true;//跨域传递cookie
  editor.customConfig.debug = false;//开启debug模式
  editor.customConfig.uploadImgHeaders = {
    'Accept': 'application/json, text/javascript, */*; q=0.01'
  }
  editor.customConfig.uploadImgParams = {
    version: version
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
      /*if (files.size > 3 * 1000 * 1000) {
        layer.msg('图片大小超过3M限制,请重新选择!')
        return;
      }*/
      layer.msg("图片上传中，请耐心等待!");
      layer.load(1, {shade: [0.1, '#fff']});
    },
    success: function (xhr, editor, result) {
      layer.closeAll('dialog');
      layer.closeAll('loading');
      layer.msg('图片上传成功!');
      // 图片上传并返回结果，图片插入成功之后触发
      // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
    },
    fail: function (xhr, editor, result) {
      // 图片上传并返回结果，但图片插入错误时触发
      // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
      layer.closeAll('loading');
    },
    error: function (xhr, editor) {
      // 图片上传出错时触发
      // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
      /*layer.msg('图片大小限制3M,请重新选择!');*/
      layer.closeAll('loading');
    },
    timeout: function (xhr, editor) {
      // 图片上传超时时触发
      // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
      layer.msg('上传图片超时,请重新选择!');
      layer.closeAll('loading');
    },
    // 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
    // （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
    customInsert: function (insertImg, result, editor) {
      // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
      // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果
      // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
      var url = result.data.imgURL;
      insertImg(url, editor);
      // result 必须是一个 JSON 格式字符串！！！否则报错
    }
  }
  editor.customConfig.customAlert = function (info) {
    //info 是需要提示的内容
    /*layer.msg('图片上传失败,请点选编辑框要插入的位置!');*/
  }
  //菜单项配置
  editor.customConfig.menus = [
    'head',  // 标题
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

//编辑器插入图片方法
function insertImg(src, editor) {
  var img = $('<img src="' + src + '" style="max-width: 100%">')
  editor.cmd.do('insertHTML', img[0]);
}

//html剔除富文本标签，留下纯文本
function getSimpleText(html) {
  var re1 = new RegExp("<.+?>", "g");//匹配html标签的正则表达式，"g"是搜索匹配多个符合的内容
  var msg = html.replace(re1, '');//执行替换成空字符
  return msg;
}

//防脚本注入匹配
function html2Escape(sHtml) {
  return sHtml.replace(/</g, "&lt").replace(/>/g, "&gt");
}

// 时间格式化
function formatAllDate(date, _formate){
  var paddNum = function(num){
      num += "";
      return num.replace(/^(\d)$/,"0$1");
  };
  //指定格式字符
  var cfg = {
      yyyy : date.getFullYear(), //年 : 4位
      yy : date.getFullYear().toString().substring(2),//年 : 2位
      M  : date.getMonth() + 1,  //月 : 如果1位的时候不补0
      MM : paddNum(date.getMonth() + 1), //月 : 如果1位的时候补0
      d  : date.getDate(),   //日 : 如果1位的时候不补0
      dd : paddNum(date.getDate()),//日 : 如果1位的时候补0
      hh : paddNum(date.getHours()),  //时
      mm : paddNum(date.getMinutes()), //分
      ss : paddNum(date.getSeconds()) //秒
  };
  var format = _formate ? _formate : "yyyy-MM-dd hh:mm:ss";
  return format.replace(/([a-z])(\1)*/ig,function(m){return cfg[m];});
}

//计算两个时间的时间差
function between(date1,date2){
  date1 = date1.replace(new RegExp("-","gm"),"/");
  date2 = date2.replace(new RegExp("-","gm"),"/");
  var date3 = Math.abs(new Date(date2).getTime()-new Date(date1).getTime());  //时间差的毫秒数

  //计算出相差天数
  var days=Math.floor(date3/(24*3600*1000));

  //计算出小时数
  var leave1=date3%(24*3600*1000);    //计算天数后剩余的毫秒数
  var hours=Math.floor(leave1/(3600*1000));

  //计算相差分钟数
  var leave2=leave1%(3600*1000);       //计算小时数后剩余的毫秒数
  var minutes=Math.floor(leave2/(60*1000));

  //计算相差秒数
  var leave3=leave2%(60*1000);     //计算分钟数后剩余的毫秒数
  var seconds=Math.round(leave3/1000);

  var difObj = {
      'days':days,
      'hours':hours,
      'minutes':minutes,
      'seconds':seconds
  };

  return difObj;
}
