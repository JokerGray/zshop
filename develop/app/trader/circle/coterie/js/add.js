var shopId = getUrlParams('shopId');
var userId = getUrlParams('userId');
var OSSParams;

$(document).ready(function(){
  // 标签点击
  $('.tags').on('click', '.btn', function(){
    $(this).addClass('active').siblings().removeClass('active');
  });
  $('.area-content>select').bind('change', function(){
    getAreasByCode(this);
  })
  getTages();
  getAreasByCode();
  //上传头像
  initUpload({
    dom: $('#potrait')[0], 
    flag: [{
        title: '请上传圈子头像',
        extensions: 'jpg,png,jpeg,bmp'
    }], 
    fileSize: "1mb"
  });
})

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
        $(arg.dom).find('.progressContent').show();
        startUpload(up, files[0]);
    });
    uploader.bind('UploadProgress', function(up, file) {
        $(arg.dom).find('.progress-bar').text(file.percent + '%').css({width: file.percent+'%'});
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
        $(arg.dom).find('.progress-bar').text('').css({width: 0});
        $(arg.dom).find('.progressContent').hide();
    });
    uploader.bind('FileUploaded', function (up, file, info) {
        if (info && info.status == 200) {
            var src = OSSParams.host + '/' + OSSParams.dir + '/' + file.name;
            $(arg.dom).find('.thumbnail').attr('src', src);
            $(arg.dom).find('input[type="hidden"]').val(src);
            layer.msg('上传成功！', {icon: 1})
        } else {
            layer.msg("系统繁忙，请稍后再试!", {icon: 2});
        }
        $(arg.dom).find('.progress-bar').text('').css({width: 0});
        $(arg.dom).find('.progressContent').hide();
    });
};


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
        var def = reqAjaxAsync('oss/ossUpload');
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
// 获取所有圈子标签
function getTages(){
  var params = {
    page: 0,
    row: 100
  }
  var def = reqAjaxAsync('circle/listAllLabel', params);
  def.then(function(res){
    if(res.code == 1) {
      $(res.data).each(function(i, v){
        var $btn = $($('#tagsTpl').html());
        $btn.text(v.labelName).val(v.id);
        $('.tags').append($btn);
      })
      $('.tags .btn').first().trigger('click');
    }
  })
}

// 根据上一级，获取下级省市区等
function getAreasByCode(pSelect) {
  // 判断是否第一个
  var pCode = $(pSelect).val() || 0;
  var $pSelect, $select;
  if(pSelect) {
    $pSelect = $(pSelect);
    $select = $pSelect.nextAll('select').eq(0);
  } else {
    $pSelect = $('.area-content>select').eq(0);
    $select = $('.area-content>select').eq(0);
  }
  $pSelect.nextAll('select').attr('disabled', true);
  // 判断是否最后一个，若获取不到下一个select，则无需继续
  // 加上ended用于第一次判断结尾
  if($select.length == 0) {
    return $pSelect.addClass('ended');
  }

  // 获取省市区数据
  var def = reqAjaxAsync('cms_new/queryScCmsAdvProvinces', {code: pCode});
  def.then(function(res){
    if(res.code == 1) {
      $select.empty();
      // 最后一个加全部的选项
      if($select.nextAll('select').length == 0) $select.append($('<option>--- 全部 ---</option>').val(pCode));
      $(res.data).each(function(i, v){
        var $opt = $('<option></option>').val(v.code).text(v.areaname)
        $select.append($opt);
      })

      // 判断是否需要根据地图默认标记更换城市，前提是省市区已经加载完毕
      var code = $select.data('areacode');
      if(code && $select.hasClass('ended')){
        // 若能找到，则使用该code，否则不变
        $select.val(code);
        if(!$select.val()) $select.val($select.find('option').eq(0).val())
        $select.data('areacode', '');
      }
      $select.trigger('change');
      $select.removeAttr('disabled');
    }
  })
}

// 根据areaCode设置默认选项
function setAreaByCode(code) {
  var province = code.substring(0, 2);
  var city = code.substring(0, 4);
  var district = code.substring(0, 6);
  var $selectArr = $('.area-content>select');
  $selectArr.eq(0).data('areacode', province);
  $selectArr.eq(1).data('areacode', city);
  $selectArr.eq(2).data('areacode', district);
  // 检测城市是否加载完毕，即街道数据都有了
  var index = setInterval(function(){
    if($selectArr.last().hasClass('ended')) {
      $selectArr.eq(0).val(province);
      $selectArr.eq(0).trigger('change');
      clearInterval(index);
    }
  }, 100)
}

// 设置详细位置和经纬度
function setAddress(obj){
  $('#releaseAddress').text(obj.address);
  $('#lat').val(obj.lat);
  $('#lng').val(obj.lng);
  // 重设区域仅执行一次
  if(window.hasSetArea) return;
  window.hasSetArea = true;
  var areaCode = obj.areaCode;
  if(areaCode) setAreaByCode(areaCode)
}

// 提交
function checkBeforeSave(){
  if(!userId || !shopId) return layer.msg('用户或店铺参数错误！', {icon: 2});
  var circlePortrait = $('#circlePortrait').val();
  if(!circlePortrait) return layer.msg('请上传圈子头像！', {icon: 2});
  var circleName = $.trim($('#circleName').val());
  $('#circleName').val(circleName)
  if(circleName.length == 0) return layer.msg('请填写圈子名称！', {icon: 2});
  if(circleName.length < 2) return layer.msg('圈子名称过短！', {icon: 2});
  var circleIntroduce = $('#circleIntroduce').val();
  if(circleIntroduce.length == 0) return layer.msg('请填写圈子简介！', {icon: 2});
  var circleLabelids = $('.tags .btn.active').val();
  if(!circleLabelids) return layer.msg('请选择圈子标签！', {icon: 2});
  var releaseProvince = $('#province').val();
  if(!releaseProvince) return layer.msg('请选择省级区域！', {icon: 2});
  var releaseCity = $('#city').val();
  if(!releaseCity) return layer.msg('请选择市级区域！', {icon: 2});
  var releaseAddress = $('#releaseAddress').text();
  if(!releaseAddress) return layer.msg('请选择详细位置！', {icon: 2});
  var isAdopts = $('input[name=isAdopts]').val();
  var joinType = $('input[name=joinType]').val();
  var latitude = $('#lat').val();
  var longitude = $('#lng').val();
  save({
    type: '1',
    circlePortrait: circlePortrait,
    circleName: circleName,
    circleIntroduce: circleIntroduce,
    circleLabelids: circleLabelids,
    releaseProvince: releaseProvince,
    releaseCity: releaseCity,
    releaseAddress: releaseAddress,
    isAdopts: isAdopts,
    joinType: joinType,
    latitude: latitude,
    longitude: longitude,
    shopId: shopId,
    userId: userId
  })
}

function save(params) {
    var layIndex = layer.msg('提交中···', {icon: 16, shade: [0.3, '#fff'], time: 10000});
    var def = reqAjaxAsync('circle/insertCircleInfo', params);
    def.then(function(res){
        layer.close(layIndex);
        layer.msg(res.msg, {icon: res.code == 1, time: 2000});
        if(res.code == 1) {
            setTimeout(function(){
                location.reload()
            }, 2000)
        }
    });
    def.fail(function(){
        layer.close(layIndex);
        layer.msg('提交失败，请稍后再试！', {icon: 2});
    })
}

// 自定义ajax请求
function reqAjaxAsync(cmd, params) {
  var data = JSON.stringify(params);
  var defer = $.Deferred();
  $.ajax({
      type: "POST",
      url: "/zxcity_restful/ws/rest",
      dataType: "json",
      data: {
          "cmd": cmd,
          "data": data || "",
          "version": version
      },
      headers: {
        apikey: apikey
      },
      success: function (data) {
        defer.resolve(data);
      },
      error: function (err) {
        defer.reject(err)
      }
  });
  return defer
}