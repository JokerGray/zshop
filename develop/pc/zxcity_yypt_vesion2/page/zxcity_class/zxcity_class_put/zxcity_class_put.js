layui.use(['form', 'table', 'laypage', 'layer','element','laydate'], function () {
    $(document).ready(function(){
        // $('.fee .offline').on('click',function(){
        //     $(this).addClass('active').siblings().removeClass('active');
        // });
        addFenL();
    });
    var offline = {
        courseType: '#offline-content select',                            //课程分类
        courseTitle: '#offline-content .row-title .layui-input',         //课程标题
        courseware: '#offline-content .row-courseware .layui-input',      //课件
        preview: '#offline-content .row-courseware .preview',             //预览
        coverList: '#offline-content .row-cover ul',                        //封面盒子
        coverImg: '#offline-content .row-cover .cover-box img',           //封面图片
        time: '#offline-content .row-time .layui-input',                  //课时说明
        courseList: '#offline-content .row-course-info ul',                    //课程简介
        courseAdd: '#offline-content .row-course-info .list-add',              //添加课程
        teacherList: '#offline-content .row-teacher ul',                  //主讲人简介
        teacherAdd: '#offline-content .row-teacher .list-add',            //添加主讲人
        fee: '#offline-content .row-price .fee',                          //定座费
    };
    var online = {
        courseType: '#online-content select',                            //课程分类
        courseTitle: '#online-content .row-title .layui-input',         //课程标题
        courseware: '#online-content .row-courseware .layui-input',      //课件
        preview: '#online-content .row-courseware .preview',             //预览
        coverList: '#online-content .row-cover ul',                         //封面盒子
        coverImg: '#online-content .row-cover .cover-box img',           //封面图片
        time: '#online-content .row-time .layui-input',                  //课时说明
        courseList: '#online-content .row-course-info ul',                    //课程简介
        courseAdd: '#online-content .row-course-info .list-add',              //添加课程
        teacherList: '#online-content .row-teacher ul',                         //主讲人简介
        teacherAdd: '#online-content .row-teacher .list-add',                   //添加主讲人
            fee: '#online-content .row-price .fee',                             //定座费
    };

    var API = {
        findTeacherList: 'masterCourse/listSpeakers',
        getCourseInfo: 'masterCourse/getBackstageCouseInfo',
        addCourse: 'masterCourse/addCourse',
        update: 'masterCourse/updateCourse',
        delCourseBrief: 'masterCourse/delCourseBrief',
        getThemes:'masterCourse/getThemes',
        userId: '80131',
    }
    // var userId = yyCache.get("userId") || "";
    var userId = yyCache.get("userId") || "";
    API.userId = yyCache.get("userId") || "80131";
 
     
    var layer = layui.layer;
    var laydate = layui.laydate;
    var lineType = 1;
    var queryCourseId = GetQueryString('courseId');
    var look = GetQueryString('look');
    var queryData = '';
    var teacherId = '';
    //课程id 如果url地址为空 为 课程id 需要获取课程信息
    if(queryCourseId != null) {
        reqAjaxAsync(API.getCourseInfo, JSON.stringify({
            courseId: queryCourseId
        })).done(function(res){
            if(res.code != 1){
                layer.msg(res.msg);
            }else {
                var data = res.data;
                var online = data.online;
                queryData = data;
                //设置课程信息
                // $('.layui-select-title input').remove();
                setLineData(data);
                //判断是否是查看
                if (look) {
                    setLook(data);
                }
                hideTeacherDel();
            }
        })
    }
    //设置 只能查看
    function setLook(data){
        var online = '';
        if (data.online == 2) { //线下
            online = $('#offline-content');
 
        } else {
            online = $('#online-content');
        }
        //智享课堂 标题 
        online.find('.row-title input').attr('readonly', 'readonly');
        //智享课堂 课件
        online.find('.row-courseware input').attr('readonly', 'readonly');
        //删除 智享课堂 上传load
        online.find('.row-courseware input+div').remove();
        //隐藏 封面 点击关闭
        online.find('.row-cover .cover-img i').hide();
        //隐藏 可以添加
        online.find('.list-add').hide();
        online.find('.introduction-ctl').hide();
        //隐藏 发布
        online.find('.btn-issue').hide();
        //修改 设置显示价格
        if(Number(data.price) > 0) {
            online.find('.fee-price .price').attr('readonly','readonly');
            online.find('.fee span').hide();
        }else {
            online.find('.fee-price').hide();
            online.find('.fee span').show();
        }
    }
    //修改跳转过来 设置数据
    function setLineData(data){
        addFenL();
        var line = '';
        var type = data.online;
 
        API.userId = data.createId;
        //隐藏 显示当前需要修改的线上线下
        if(type == 2) {
            line = $('#offline-content');
            $('#offline').show().addClass('active').siblings().removeClass('active');
            $('#offline-content').show();
            $('#online').hide();
            $('#online-content').hide();
            $('.spannn').show();
            line.find('.spannn').attr('data-themeId',data.theme.id).attr('data-themeName',data.theme.name);
        }else{
            line = $('#online-content');
            line.find('.spannn').attr('data-themeId',data.theme.id).attr('data-themeName',data.theme.name);
            $('#online').show().addClass('active').siblings().removeClass('active');
            $('#online-content').show();
            $('#offline').hide();
            $('#offline-content').hide();
            $('#offline').remove();
            $('.spannn').show();
        }
        //显示 当前 线上 或者线下内容 更改按钮 标题 保存
        line.show();
        line.find('.btn-issue').text('保存');
        line.find('.spannn').text(data.theme.name);
        //设置类型
        // line.find('select').val(data.type);
        line.find('select').attr('disabled','disabled');
        
        //设置课程标题
        line.find('.row-title .layui-input').val(data.name);
        var resourceList = data.resourceList;
        var item = resourceList[0];  //默认获取第一个资源
        if(item){
            line.find('.row-courseware .layui-input').val(item.resource);
            line.find('.row-courseware .layui-input').attr('data-id', item.id);
            if(item.type == 1) { //1视频  2音频
                var str = data.online == 2 ? '#video' : '#on-video';
                $(str).attr('src',item.resource);
            }else if(item.type == 2) {
                var str = data.online == 2 ? '#audio' : '#on-audio';
                $(str).attr('src',item.resource);
            }
            //设置封面图
            var imgAry = [];
            if(item.imgDetail) {   //分割资源
                if(item.imgDetail.indexOf(',')!= -1) {
                    imgAry = item.imgDetail.split(',');
                }else {
                    imgAry.push(item.imgDetail);
                }
            }
            var ul = line.find('.row-cover ul');
            imgAry.forEach(function(value,index){
                var html = '<li class="cls-img cover-box cover-img"><i></i><img src="' + value +'" alt=""></li>';
                ul.append(html);
            });
            hideUploadCover(ul);
        }
        
        //设置课程简介
        var courseList = line.find('.row-course-info ul');
        var tpl = '';
        if(type == 2) {  //获取 模板htmlzfc
            tpl = 'course-list-tpl';
        }else {
            tpl = 'course-list-on';
        }
        //设置课程简介内容
        data.briefs && data.briefs.forEach(function(item,index){
            if (item.duration){
                item.duration = parseInt(item.duration); // +'天'
            } 
            item.intro = formatBr(item.intro);
            var html = template(tpl, {data: item});
            courseList.append(html);
        });
        //设置主讲师
        var speakers = data.speakers;
        var ul =  line.find('.row-teacher ul');
        var teacher = speakers && speakers[0] ?  speakers[0] : null;
        if(teacher) {
            teacher.intro = formatBr(teacher.intro);
            var html = template('teacher-list-tpl',{data: teacher});
            ul.append(html);
            var add = line.find('.row-teacher .list-add');
            add.hide(); //隐藏 添加主讲人
            teacherId = teacher.id;
        }
        //设置价格
        if(data.price == 0 || data.price == null) {
            line.find('.fee input').val(data.price);
            line.find('.fee span').addClass('active');
        }else {
            line.find('.fee input').val(data.price);
            line.find('.fee span').removeClass('active');
        }
        form.render();
    }

    //修改跳转过来 隐藏 删除按钮
    function hideTeacherDel(){
        $('.row-teacher .ctl-del').hide();
    }
    //格式化 换行br字符串
    function formatLineStr(str){
        if(str && str.indexOf && str.indexOf('<br>') != -1){
            var ary = str.split('<br>');
            var aryTmp = [];
            ary.forEach(function(item,index){
                aryTmp.push($.trim(item));
            });
            return aryTmp.join('\n');
        }
        return $.trim(str);
    }
    //格式化 换行br字符串
    function formatEmptyStr(str){
        if(str && str.indexOf && str.indexOf('\n') != -1){
            var ary = str.split('\n');
            var aryTmp = [];
            ary.forEach(function(item,index){
                var text = $.trim(item);
                if(text != ''){
                    aryTmp.push(text);
                }
            });
            return aryTmp.join('\n');
        }
        return str;
    }
    //格式化时间
    function getNowFormatDate(date) {
        // var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate;
    }
    //格式化 换行字符串
    function formatBr(str){
        if(str && str.indexOf && str.indexOf('\n') != -1){
            var ary = str.split('\n');
            var aryTmp = [];
            ary.forEach(function(item,index){
                aryTmp.push($.trim(item));
            });
            return aryTmp.join('<br>');
        }
        return str;
    }
    //获取当前 线下 线上  类型
    function getLineType(){
        var id = $('.title-tab.active').attr('id');
        if (id == 'offline'){
            return 0;
        }
        return 1;
    }
    $('.fee .offline').on('click', function () {
        $(this).addClass('active').siblings().removeClass('active');
    });

    laydate.render({
        elem: '#add-date',
        type: 'datetime',
        min: getNowFormatDate(new Date())
    });
    //tab切换
    $('.title-tab').on('click',function(){
        var id = $(this).attr('id');
        if(id == 'online'){
            showOn();
        }else if(id == 'offline'){
            showOff();
        }
        $(this).addClass('active').siblings().removeClass('active');
    });

    //点击返回跳转页面
    $('#go-back').on('click',function(){
        location.href = '../zxcity_class_list/zxcity_class_list.html';
    })

    //线下 加载视频音频
    uploadOss({
        btn:'course-upload',
        flag: 'video',
        before: function(up, files){
            var name = files.name;
            var nameOld = $('#course-upload').val();
            if(nameOld  != '' && nameOld != undefined  && queryCourseId != null){
                var type = getVideoType(nameOld);
                if(type == -1) {
                    return true;
                }
                var typeNew = getVideoType(name);
                if(type != typeNew) {
                    layer.msg('上传格式和原来格式不符合!');
                    return false;
                }
            }
            return true;
        },
        callback: function (callbackParams){
            $('#offline-content #course-upload').val(callbackParams.urls);
            $('#offline-content #course-upload').attr('title',callbackParams.urls);
            $('#offline-content #course-upload').attr('data-name', callbackParams.name);
            var type = getVideoType(callbackParams.name);
            $('#offline-content .row-courseware audio').hide();
            var audio = $('#offline-content .row-courseware audio')[0];
            audio && audio.pause();
            if(type == 2) {
                $('#audio').attr('src', callbackParams.urls);
            }else if(type == 1){
                $('#video').attr('src', callbackParams.urls);
            }
            clearCover($('#offline-content'));
        }
    })
    uploadOss({
        btn:  'upload-teacher',
        flag: 'img',
        callback: uploadTeacher,
    });
    //线下 上传封面
    uploadOss({
        btn: 'add-cover',
        flag: 'img',
        before: function (up, files){
            var url = $('#offline-content #course-upload').val();
            if(url == ''){
                layer.msg('请先上传课件');
                return false;
            }
            var ul = $(offline.coverList);
            var li = ul.find('li');
            var name = $('#offline-content #course-upload').attr('data-name');
            var name =  name  ? name : $('#offline-content #course-upload').val();
            var type = getVideoType(name);
            var li = ul.find('li');
            if (li.length >= 2) {
                layer.msg('不能上传两个封面!');
                return false;
            }

        },
        callback: function (callbackParams){
            var ul = $(offline.coverList);
            var li = ul.find('li');
            if (callbackParams.urls) {  
                var ul = $(offline.coverList);
                var html = '<li class="cls-img cover-box cover-img"><i></i><img src="' + callbackParams.urls +'" alt=""></li>';
                ul.append(html);
                hideUploadCover(ul);
            }
        }
    });
    //线上 封面
    uploadOss({
        btn: 'online-add-cover',
        flag: 'img',
        before: function (up, files) {
            var url = $('#online-content #online-course-upload').val();
            if (url == '') {
                layer.msg('请先上传课件');
                return false;
            }
            var ul = $(online.coverList);
            var li = ul.find('li');
            var name = $('#online-course-upload').attr('data-name');
            var name = name ? name : $('#online-course-upload').val();
            var type = getVideoType(name);
            var li = ul.find('li');
            if (li.length >= 2) {
                layer.msg('不能上传两个封面!');
                return false;
            }
        },
        callback: function (callbackParams) {
            var ul = $(offline.coverList);
            var li = ul.find('li');
            if (callbackParams.urls) {
                var ul = $(online.coverList);
                var html = '<li class="cls-img cover-box cover-img"><i></i><img src="' + callbackParams.urls + '" alt=""></li>';
                ul.append(html);
                hideUploadCover(ul);
            }
        }
    });
    uploadOss({
        btn: 'course-cover',
        flag: 'img',
        callback: function (callbackParams) {
            if (callbackParams.urls) {
                $('#course-cover div').hide();
                $('#course-cover img').show();
                $('#course-cover img').attr('src', callbackParams.urls);
            }
        }
    });
    uploadOss({
        btn: 'cover-online',
        flag: 'img',
        callback: function (callbackParams) {
            if (callbackParams.urls) {
                $('#cover-online div').hide();
                $('#cover-online img').show();
                $('#cover-online img').attr('src', callbackParams.urls);
            }
        }
    });
 
    //线上 上传课件
    uploadOss({
        btn: 'online-course-upload',
        flag: 'video',
        before: function(up, files){
            var name = files.name;
            var nameOld = $('#online-course-upload').val();
            if(nameOld  != '' && nameOld != undefined  && queryCourseId != null){
                var type = getVideoType(nameOld);
                if(type == -1) {
                    return true;
                }
                var typeNew = getVideoType(name);
                if(type != typeNew) {
                    layer.msg('上传格式和原来格式不符合!');
                    return false;
                }
            }
            return true;
        },
        callback: function (callbackParams) {
            $('#online-content #online-course-upload').val(callbackParams.urls);
            $('#online-content #online-course-upload').attr('title',callbackParams.urls);
            $('#online-content #online-course-upload').attr('data-name', callbackParams.name);
            var type = getVideoType(callbackParams.name);
            $('#online-content .row-courseware audio').hide();
            var audio = $('#online-content .row-courseware audio')[0];
            audio && audio.pause();
            if(type == 2) {
                $('#on-audio').attr('src', callbackParams.urls);
            }else if(type == 1){
                $('#on-video').attr('src', callbackParams.urls);
            }
            clearCover($('#online-content'));
        }
    })

    //线下 课程添加
    $(offline.courseAdd).on('click',function(){
        var id = $('.title-tab.active').attr('id');
        showAddCourse();
    });
    //线上 课程添加
    $(online.courseAdd).on('click', function () {
        var li = $(online.courseAdd).find('li');
        if (li.length >= 1) {
            layer.msg('线上课程只能添加一个!');
            return;
        }
        showOnCourse();
    });

    //隐藏上传封面  参数 线上  线下的ul dom元素
    function hideUploadCover(ul){
        var li = ul.find('li').eq(0);
        li.hide();
        li.next().hide();
    }
    //显示 上传封面 参数 线上  线下的ul dom元素
    function showUploadCover(ul) {
        var li = ul.find('li').eq(0);
        li.show();
        li.next().show();
    }
    //上传主讲图片
    function uploadTeacher(callbackParams) {
        if(callbackParams.urls) {
            $('#upload-teacher #upload-teacher-img').attr('src', callbackParams.urls);
            $('#upload-teacher-default').hide();
            $('#upload-teacher-img').show();
        }
    }
    //线下课程 点击确定
    $('#add-course-tpl .btn-ok').on('click', function(){
        var img = $('#course-cover img').attr('src');
        var address =  $('#add-address').val();
        var preTime = $('#add-date').val();
        var duration = $('#add-time').val();
        var info = $('#add-recommend').val();
        if(img == ''){
            layer.msg('请上传图片');
            return;
        }
        if(address == ''){
            layer.msg('请设置课堂地址');
            return;
        }
        if (preTime == '') {
            layer.msg('请设置开始时间');
            return;
        }
        //开始时间 必须大于前面时间
        var line = $('#offline-content');
        var li = line.find('.row-course-info .course-list li');
        var tmpDate = new Date(preTime);
        tmpDate = tmpDate.getTime();
        var isTrueDate = true;
        li.each(function(index,item){
            var tmpPreTime = $(item).find('div[data-type="preTime"]').text();
            var tmpDateTime = new Date(tmpPreTime);
            tmpDateTime = tmpDateTime.getTime();
            if (tmpDate <= tmpDateTime ){
                layer.msg('开始时间不能在以前设置的课程!');
                isTrueDate = false;
                return ;
            }
        })
        if (!isTrueDate){
            return;
        }
        if (duration == '') {
            layer.msg('请设置时长');
            $('#add-time').val('');
            return;
        }
        var num = Number(duration);
        if(isNaN(num) || num <= 0) {
            layer.msg('请设置合理时长');
            $('#add-time').val('');
            return;
        }

        if (info == '') {
            layer.msg('请设置课程简介');

            return;
        }
        var obj = {
            imgDetail: img,
            address: address,
            preTime: preTime,
            duration: duration,
            intro: info
        }

        obj.intro = obj.intro.replace(/\n/g, '<br>');
        var html = template('course-list-tpl',{data:obj});
        
        //判断是 修改 还是添加
        var index = $(this).attr('data-index');
        if (index == -1) {
            $(offline.courseList).append(html);
        } else {
            li = $(offline.courseList).find('li').eq(index);
            li.find('img[data-type="imgDetail"]').attr('src', obj.imgDetail);
            li.find('div[data-type="address"]').text(obj.address);
            li.find('div[data-type="preTime"]').text(obj.preTime);
            li.find('div[data-type="duration"]').text(obj.duration + '天' )  ;
            li.find('div[data-type="intro"]').html(obj.intro);
            // $(offline.courseList).find('li').eq(index).html(html);
        }
        layer.closeAll();
        $('#add-course-tpl').hide();
        $('#course-list-tpl').hide();
    });

    //线下课程  修改
    $('#course-info-lists').on('click','.ctl-edit',function(){
        var li = $(this).parents('li');
        var obj = {
            imgDetail: li.find('img[data-type="imgDetail"]').attr('src'),
            address: li.find('div[data-type="address"]').text(),
            preTime: li.find('div[data-type="preTime"]').text(),
            duration: parseInt(li.find('div[data-type="duration"]').text()),
            intro: li.find('div[data-type="intro"]').html(),
            index: $('#course-info-lists li').index(li) || 0
        };
        obj.intro = obj.intro.replace(/<br>/g,'\n');
        if(obj.index >= 0) {
            showAddCourse(obj);
        }
    });

 

    //线上课程 修改
    $(online.courseList).on('click', '.ctl-edit',function(){
        var li = $(this).parents('li');
        var obj = {
            imgDetail: li.find('img[data-type="imgDetail"]').attr('src'),
            intro: li.find('div[data-type="intro"]').html(),
            index: $('#online-course-data li').index(li) || 0
        };
        obj.intro = obj.intro.replace(/<br>/g, '\n');
        if (obj.index >= 0) {
            showOnCourse(obj);
        }
    });
    //课程简介 删除
    $('.row-course-info ul').on('click', '.ctl-del',function(){
        //删除当前Li
        var li = $(this).parents('li');
        var id = li.attr('data-id');
        var lis = li.parent().find('li');
        //判断是否有id 是否为修改
        if(id != undefined && id != ''){
            if(lis && lis.length > 1){
                delCourseBrief(li);
            }else {
                layer.msg('请修改课程简介！此课程必须要有一个课程简介');
            }
        }else{
            //
            var type = getLineType();
            if(type == 1) {
                $('#online-add-course').show(); //显示线上课程添加按钮
            }
            $(this).parents('li').remove();
        }
    });
    //线上课程  点击确定
    $('#add-course-on .btn-ok').on('click', function(){
        var img = $('#cover-online img').attr('src');
        var info = $('#add-recommend-online').val();
        if (img == '') {
            layer.msg('请上传图片');
            return;
        }
        if (info == '') {
            layer.msg('请设置课时简介');
            return;
        }
        var obj = {
            imgDetail: img,
            intro: info
        }

        obj.intro = obj.intro.replace(/\n/g, '<br>');
        var html = template('course-list-on', { data: obj });
        //判断是 修改 还是添加
        var index = $(this).attr('data-index');
        if (index == -1) {
            $(online.courseList).append(html);
        } else {
            var li = $(online.courseList).find('li').eq(index);
            li.find('img[data-type="imgDetail"]').attr('src',obj.imgDetail);
            li.find('div[data-type="intro"]').html(obj.intro);
        }

        layer.closeAll();
        $('#online-add-course').hide();
        $('#course-list-tpl').hide();
    });

    //删除封面
    $('.row-cover').on('click','li i',function(){
        var ul = $(this).parent().parent();
        $(this).parent().remove();
        showUploadCover(ul);
    });

    //线下 课程
    initTeacher();
//分类
function addFenL(){
    var param={}
    //获取主讲人信息
    reqAjaxAsync(API.getThemes,JSON.stringify(param))
        .done(function (res) {
            if (res.code == 1) {
                var html = '';
                if (res.data && res.data.length >= 1) {
                    teacherList = res.data;
                    res.data.forEach(function (item, index) {
                        html += '<option lay-value="' + item.id + '" class="' + item.id + '">' + item.name;
                        html += '</option>';
                    });
                    var seleoffline = $('#offline-content #type');
                    var seleonline = $('#online-content #type');
                    seleoffline.html(html);
                    seleonline.html(html);
                    layui.form.render('select');
                }
            }
        }); 
}
    //显示 线下课程
    function showAddCourse(obj){
        var title = obj && obj.address ?  '修改课程' : '添加课程';
        layer.open({
            type: 1,
            title: [title,'font-size:12px;background-color:#424651;color:#fff;'],
            // shadeClose: true,
            // closeBtn: 0,
            area:['700px', 'auto'],
            shadeClose: true,
            content: $('#add-course-tpl'),
            success:function(){
                //判断是否修改
                if (obj && obj.address) {
                    if (obj.imgDetail) {
                        $('#course-cover img').attr('src', obj.imgDetail).show();
                        $('#course-cover div').hide();
                    }else {
                        $('#course-cover img').attr('src', '').hide();
                        $('#course-cover div').show();
                    }
                    $('#add-address').val(obj.address || '');
                    $('#add-date').val(obj.preTime || '');
                    $('#add-time').val(obj.duration || '');
                    $('#add-recommend').val(obj.intro || '');
                    var len = obj.intro && obj.intro.length ? obj.intro.length : 0;
                    $('#add-recommend+div').text(len + '/100');
                    $('#add-course-tpl .btn-ok').attr('data-index', obj.index);

                }else {
                    $('#course-cover img').attr('src','').hide();
                    $('#course-cover div').show();
                    $('#add-address').val('');
                    $('#add-date').val('');
                    $('#add-time').val('');
                    $('#add-recommend').val('');
                    $('#add-recommend+div').text('0/100');
                    $('#add-course-tpl .btn-ok').attr('data-index','-1');
                }
            },
            cancel: function(){
                $('#add-course-tpl').hide();
            },
            end: function(){
                $('#add-course-tpl').hide();
            }
        });
    }
    //显示 线上课程
    function showOnCourse(obj){
        var title = obj && obj.address ? '修改课程' : '添加课程';
        layer.open({
            type: 1,
            title: [title, 'font-size:12px;background-color:#424651;color:#fff'],
            // shadeClose: true,
            // closeBtn: 0,
            area: ['700px', 'auto'],
            shadeClose: true,
            content: $('#add-course-on'),
            success: function () {
                //判断是否修改
                if (obj) {
                    if (obj.imgDetail) {
                        $('#cover-online img').attr('src', obj.imgDetail).show();
                        $('#cover-online div').hide();
                    } else {
                        $('#cover-online img').attr('src', '').hide();
                        $('#cover-online div').show();
                    }
 
                    $('#add-recommend-online').val(obj.intro || '');
                    var len = obj.intro && obj.intro.length ? obj.intro.length : 0;
                    $('#add-recommend-online+div').text(len + '/500');

                    $('#add-course-on .btn-ok').attr('data-index', obj.index);

                } else {
                    $('#cover-online img').attr('src', '').hide();
                    $('#cover-online div').show();
  
                    $('#add-recommend-online').val('');
                    $('#add-recommend-online+div').text('0/500');

                    $('#add-course-on .btn-ok').attr('data-index', '-1');

                }
            },
            cancel: function () {
                $('#add-course-on').hide();
            },
            end: function () {
                $('#add-course-on').hide();
            }
        });
    }
    //初始化 获取主讲人 列表
    function initTeacher(){
        //获取主讲人信息
        reqAjaxAsync(API.findTeacherList,JSON.stringify({}))
            .done(function (res) {
                console.log(res);
                if (res.code == 1) {
                    var html = '';
                    if (res.data && res.data.length >= 1) {
                        teacherList = res.data;
                        res.data.forEach(function (item, index) {
                            html += '<dd lay-value="' + item.id + '" class="" data-img="' + item.imgDetail + '" data-msg="' + item.intro + '">' + item.name;
                            html += '</dd>';
                        });
                        var dl = $('#add-teacher-tpl dl');
                        dl.html(html);
                        form.render();
                    }
                }
            }); 

    }
    //预览 视频 音频
    $('.preview').on('click',function(){
        var line = '';
        var type = getLineType();
        if(type == 0) {         //线下
            line = $('#offline-content');
        }else if(type == 1) {   //线上
            line = $('#online-content');
        }
        var name = line.find('.row-courseware .layui-input').val(); //课件名字
        if (name == '') {
            layer.msg('请上传课件');
            return;
        }
        var videoType = getVideoType(name);
        if(videoType == 2) {
            line.find('.row-courseware audio').show();
            var audio = line.find('.row-courseware audio')[0];
            audio.currentTime = 0;
            audio.play();
        }else {
            showVideo(type, videoType);
        }
    })
    //显示 视频
    function showVideo(lineType,videoType){
        var video = null;
        var audio = null;
        var onVideo = null;
        var onAudio = null;
        layer.open({
            type: 1,
            title: ['预览', 'font-size:12px;background-color:#424651;color:#fff;'],
            // shadeClose: true,
            // closeBtn: 0,
            area: ['700px', '600px'],
            shadeClose: true,
            content: $('#play-dlg'),
            success: function () {
                if (lineType == 0) { //线下
                    if (videoType == 1) { //视频
                        video = $('#video')[0];
                        $('#video').show();
                        video.currentTime = 0;
                        video.play();
                        $('#audio').hide();
                    }else{
                        $('#video').hide();
                        $('#audio').show();
                        audio = $('#audio')[0];
                        audio.currentTime = 0;
                        audio.play();
                    }   
                    $('#video-dlg').show();
                    $('#on-video-dlg').hide();
                }else {  //线上
                    if(videoType == 1) {
                        onVideo = $('#on-video')[0];
                        $('#on-video').show();
                        onVideo.currentTime = 0;
                        onVideo.play();
                        $('#on-audio').hide();
                    }else {
                        $('#on-video').hide();
                        $('#on-audio').show();
                        onAudio = $('#on-audio')[0];
                        onAudio.currentTime = 0;
                        onAudio.play();
                    }
                    $('#on-video-dlg').show();
                    $('#video-dlg').hide();
                }
                $('play-dlg').show();
                 
            },
            cancel: function(){
                video &&  video.pause();
                audio && audio.pause();
                onVideo && onVideo.pause();
                onAudio && onAudio.pause();
                $('#play-dlg').hide();
            },
            end: function(){
                video && video.pause();
                audio && audio.pause();
                onVideo && onVideo.pause();
                onAudio && onAudio.pause();
                $('#play-dlg').hide();
            }
        });
    }
 
    //主讲人 点击添加 主讲人
    $('.row-teacher').on('click', '.list-add',function () {
        var ul = $(this).parent().parent().find('ul');
        var li =  ul && ul.find('li');
        if (!li.length || li.length == 0) {
            showAddTeacher();
        }else {
            layer.msg('暂只能添加一个主讲');
        }
    });

    //添加主讲 确定
    $('#teacher-ok').on('click',function(){
        var msg = $('#add-teacher-tpl .layui-textarea').val();
        var dd = $('#add-teacher-tpl dl dd');
        var teacherName = $('#add-teacher-tpl .teacher-box input').val();
        var id = '';
        dd.each(function(index,item){
            if($(item).text() == teacherName){  //如果 主讲人姓名相同
                id = $(item).attr('lay-value');
            }
        });
        var src = $('#upload-teacher-img').attr('src');
        if (teacherName.lenght < 2 || teacherName.lenght > 4) {
            layer.msg('姓名长度不符合!');
            return ;
        }
        if (msg == ''){
            layer.msg('主讲人简介不能为空!');
            return;
        }
         
        var data = {
            userpic: src,
            speakerName: teacherName,
            speakerIntro: msg,
            intro: msg,
            id: id,
        }
        data.speakerIntro = data.speakerIntro.replace(/\n/g,'<br>');
        data.intro = data.intro.replace(/\n/g,'<br>');
        var html = template('teacher-list-tpl',{data:data});
        //判断是 修改 还是添加
        //获取是 线下 还是 线上

        var index = $(this).attr('data-index') || '0';
        var lineType = getLineType();
        if(index == -1) { // 添加
            //线下
            if (lineType == 0) {
                $(offline.teacherList).append(html);
                $('#add-teacher').hide();
            }else {
                $(online.teacherList).append(html);
                $('#online-add-teacher').hide();
            }
        } else { //修改
            var li = null;
            if (lineType == 0) { 
                $(offline.teacherList).eq(index).html(html);
            } else {
                $(online.teacherList).eq(index).html(html);
            }
        }
        if(lineType == 0) {
            $(offline.teacherAdd).hide();
        }else {
            $(online.teacherAdd).hide();
        }

        layer.closeAll();
        //按钮禁止
        $('#add-teacher-tpl').hide();

    });

    //主讲人 修改
    $('.row-teacher').on('click', '.ctl-edit',function(){
        var li = $(this).parents('li');
        var obj = {
            teacherName: li.find('.teacher-title').text(),
            img: li.find('.teacher-img img').attr('src'),
            msg: li.find('.teacher-msg').html(),
            index: 0,
            id: li.attr('data-id')
        };

        showAddTeacher(obj);
    });
    
    //主讲人 删除
    $('.row-teacher').on('click', '.ctl-del', function () {
        //删除当前Li
        $(this).parents('li').remove();
        //显示 主讲按钮
        var lineType = getLineType();

        if(lineType == 0) {
            $(offline.teacherAdd).show();
        }else {
            $(online.teacherAdd).show();
        }
    });

 
    //点击 下拉 主讲人
    $('#add-teacher-tpl #teacher-lists').on('click',function(){
        toggleDl();
        return false;
    });
    //切换
    function toggleDl(){
        var is = $('#add-teacher-tpl  .teacher-box i').hasClass('rotate');
        if (is) {
            $('#add-teacher-tpl .teacher-box dl').hide();
            $('#add-teacher-tpl  .teacher-box i').removeClass('rotate');
        } else {
            $('#add-teacher-tpl .teacher-box dl').show();
            var length = $('#add-teacher-tpl .teacher-box dl');
            if (!(length && length.length >= 1)) {
                $('#add-teacher-tpl .teacher-box dl').html('<dd lay-value="0" class="">无</dd>');
            }
            $('#add-teacher-tpl .teacher-box i').addClass('rotate');
        }
    }
    //点击其它地方隐藏 dl

    //点击 dd 设置 主讲人
    $('#add-teacher-tpl dl').on('click','dd',function(){
        var name = $(this).text();
        $('#add-teacher-tpl .teacher-box input').val(name);
        $('#add-teacher-tpl .teacher-box input').attr('data-id',$(this).attr('lay-value'));
        //设置头像
        var img = $(this).attr('data-img');
        $('#upload-teacher-img').attr('src',img || '');
        //是否有图片
        if(img == undefined || img == ''){
            $('#upload-teacher-img').hide();
            $('#upload-teacher-default').show();
        }else {
            $('#upload-teacher-img').show();
            $('#upload-teacher-default').hide();
        }

        //setTeacherImg(img);
        var msg = $(this).attr('data-msg') || '';
        $('#add-teacher-tpl textarea').val(msg);
        var len = msg && msg.length ? msg.length : 0 ;
        $('#add-teacher-tpl .teacher-box input').val(name);
        $('#add-teacher-tpl .text-area-box .text-length').text(len + '/100');

        toggleDl();
        form.render();
    });

    $("#add-teacher-tpl dl").blur(function () {
        $("#add-teacher-tpl dl").hide();
    });

    $('#add-teacher-tpl').on('click',function(){
        $("#add-teacher-tpl dl").hide();
    })
    // 添加时的发布  修改时的保存
    $('.btn-issue').on('click',function(){
        if(queryCourseId != null  &&  queryCourseId != '' ){
            var params = getUpdateParams();
            if(params != '') {
                reqAjaxAsync(API.update,JSON.stringify(params))
                    .done(function(res){
                        if(res.code == 1) {
                            layer.msg('修改成功', {time:1000},function(){
                                location.href = '../zxcity_class_list/zxcity_class_list.html';
                            });
                        }else{
                            layer.msg(res.msg);
                        }
                    });
            }
            return ;
        }
        var type = getLineType();
        var params = '';
        if(type == 0) { //线下
            params = getOfflineParams();
        }else {
            params = getOnlineParams();
        }

        if (params != '') {
            //获取主讲人信息
            reqAjaxAsync(API.addCourse, JSON.stringify(params))
                .done(function (res) {
                    console.log(res);
                    if (res.code == 1) {
                        layer.msg('发布成功', { time: 1000 }, function () {
                            location.href = '../zxcity_class_list/zxcity_class_list.html';
                        });
                    }else {
                        layer.msg(res.msg);
                    }
                });
        }
    });
    function clearData(){

    }
    //删除课程简介
    function delCourseBrief(li){
        var id = li.attr('data-id');

        if(id != undefined && id != ''){
            reqAjaxAsync(API.delCourseBrief, JSON.stringify({briefId:id})).
            done(function(res){
                if(res.code == 1) {
                    layer.msg('删除成功');
                    li.remove();
                }else {
                    layer.msg(res.msg);
                }
            });
        }
    }
    //获取修改需要的参数
    function getUpdateParams(){
        var params = {};
        var line = null;
        var type = queryData.online;
        //获取当前线上 线下
        if(type == 2) {
            line = $('#offline-content');
            params.themeName=line.find('.spannn').attr('data-themename');
            params.themeId =line.find('.spannn').attr('data-themeid');
        }else{
            line = $('#online-content');
            params.themeName=line.find('.spannn').attr('data-themename');
            params.themeId =line.find('.spannn').attr('data-themeid');
        }
        //cover
        params.courseId = queryCourseId;
        params.createId = API.userId;
        params.online = queryData.online;
        params.name =  line.find('.row-title .layui-input').val();
        if (params.name == undefined || params.name == ''){
            layer.msg('请填写课程标题');
            return '';
        }
        params.resource = line.find('.row-courseware .layui-input').val();
        if (params.resource == undefined || params.resource == '') {
            layer.msg('请上传课件');
            return '';
        }
        var price = line.find('.fee input').val();
        if(price === null || price === undefined  || price == '') {
            layer.msg('价格不对!');
            return '';
        }
        params.resourceDuration = 0;
        var index1 = params.resource.lastIndexOf(".");
        var index2 = params.resource.length;
        var suffix = params.resource.substring(index1 + 1, index2);//后缀名
        params.resourceType = getVideoType(suffix);
        params.imgDetail = [];
        if (params.resourceType == -1) {
            layer.msg('上传课件格式有问题');
            return '';
        }else if(params.resourceType == 2) {  //音频
            var  elem = queryData.online == 2 ?  '#audio' : '#on-audio';
            params.resourceDuration = $(elem)[0].duration;
            var li  = line.find('.row-cover li');
            if(li && li.length >=2) {
                li.each(function(index,item){
                    if(index != 0) {
                        var src = $(item).find('img').attr('src');
                        params.imgDetail.push({item:src});
                    }
                });
            }else {
                layer.msg('请上传封面!');
                return '';
            }
        } else if (params.resourceType == 1) {
            var  elem = queryData.online == 2 ?  '#video' : '#on-video';
            params.resourceDuration = $(elem)[0].duration;
            var li  = line.find('.row-cover li').eq(1);
            if(li && li.length >=1) {
                var src = li.find('img').attr('src');
                params.imgDetail = src;
            }else {
                layer.msg('请上传封面!');
                return '';
            }
        }
        params.resourceId = queryData.resourceList && queryData.resourceList[0].id;
        if( !isNaN(params.resourceDuration)){
            params.resourceDuration = formatVideoTime(params.resourceDuration);
        }

        if(price == 0){
            params.isfree = 0;
            params.price = 0;
        }else {
            params.isfree = 1;
            params.price = price;
        }
        //获取 课时简介
        var li = line.find('.row-course-info ul li');
        params.briefs = [];
        li.each(function(index,item){
            var obj = {
                imgDetail: $(item).find('img').attr('src'),
                intro: $(item).find('div[data-type="intro"]').html(),
                courseId:  queryCourseId,
            }
            obj.intro = formatLineStr(obj.intro);
            var id = $(item).attr('data-id');
            if(id){
                obj.briefId = id;
            }
            if(params.online == 2) {
                obj.address = $(item).find('div[data-type="address"]').text();
                obj.preTime = $(item).find('div[data-type="preTime"]').text();
                obj.duration = parseInt($(item).find('div[data-type="duration"]').text());
            }
            params.briefs.push(obj);
        });
        //获取主讲人信息
        var li = line.find('.row-teacher ul li').eq(0);
        var speakerId = li.attr('data-id');
        if(speakerId){
            //判断 主讲人ID是否变化
            if (params.speakerId != teacherId) {
                params.speakerTemp = speakerId;//新修改ID
                params.speakerId = speakerId;  //原来ID
            }else{
                params.speakerId = speakerId;
            }
        }
        params.speakerName = li.find('.teacher-title').text();
        params.speakerIntro = li.find('.teacher-msg').html();
        // params.speakerIntro.replace(/<br>/g,'\n');
        params.speakerIntro = formatLineStr(params.speakerIntro);
        if(params.speakerName == ''){
            layer.msg('请设置主讲人姓名');
            return false;
        }
        if(params.speakerIntro == ''){
            layer.msg('请设置主讲人简介');
            return false;
        }
 
        var img = li.find('img').attr('alt');
        if(img){
            params.userpic = img;
        }
        return params;
    }
    //获取线下
    function getOfflineParams(){
        var params = {};
        params.online = '2';
        params.themeName=$('#offLine .layui-this').attr('lay-value');
        var index=$('#offLine .layui-this').index();
        params.themeId =$("#offLine #type option").eq(index).attr('lay-value');
        if(params.themeName == ''){
            layer.msg('请选择分类');
            return '';
        }
        params.courseName = $(offline.courseTitle).val();
        if (params.courseName == ''){
            layer.msg('请填写课程标题');
            return '';
        }
        params.resource = $(offline.courseware).val();
        if (params.resource == '') {
            layer.msg('请上传课件');
            return '';
        }
        params.resDuration = 0;
        var index1 = params.resource.lastIndexOf(".");
        var index2 = params.resource.length;
        var suffix = params.resource.substring(index1 + 1, index2);//后缀名
        params.resourceType = getVideoType(suffix);
        if (params.resourceType == -1) {
            layer.msg('上传课件格式有问题');
        }else if(params.resourceType == 2) {
            params.resDuration = $("#audio")[0].duration;
        } else if (params.resourceType == 1) {
            params.resDuration = $("#video")[0].duration;
        }
        if( !isNaN(params.resDuration)){
            params.resDuration = formatVideoTime(params.resDuration);
        }
        var li = $(offline.coverList).find('li');
        var coverAry = [];
        if(li.length <= 1) {
            layer.msg('请上传封面');
            return false;
        }
        li.each(function(index,item){
            if(index != 0){
                var src = $(item).find('img').attr('src');
                var obj = {
                    item: src
                };
                coverAry.push(obj);
            }
        });
        params.imgDetail = coverAry;
        params.createId = API.userId;
        var isfree = 0;
        var price = $(offline.fee).find('input').val();
        if (price &&  price != '' && parseFloat(price) > 0){
            params.price = price;
            isfree = 1;
        }else {
            isfree = 0
            params.price = '0';
        }
        params.isfree = isfree;
        params.briefs = [];
        // params.duration = 0;
        var li = $(offline.courseList).find('li');
        if(li.length == 0) {
            layer.msg('请添加课程简介!');
            return '';
        }

        li.each(function(index,item){
            var obj = {
                imgDetail: $(item).find('img').attr('src'),
                address: $(item).find('div[data-type="address"]').text(),
                preTime: $(item).find('div[data-type="preTime"]').text(),
                duration: $(item).find('div[data-type="duration"]').text(),
                intro: $(item).find('div[data-type="intro"]').html(),
            };
            obj.duration = parseInt(obj.duration);
            obj.intro = obj.intro.replace(/<br>/g, '\n');
            params.briefs.push(obj);
        });
        var li = $(offline.teacherList).find('li').eq(0);
        if (li.length == 0) {
            layer.msg('请添加主讲人!');
            return '';
        }
        //主讲人
        var speakerId = li.attr('data-id');
        if (speakerId && speakerId != '') {
            params.speakerId = speakerId;
        }
        params.speakerName = li.find('.teacher-title').text();
        params.speakerIntro = li.find('.teacher-msg').html();
        params.speakerIntro = params.speakerIntro.replace(/<br>/g, '\n');
        var pic = li.find('img').attr('alt');
        params.userpic = '';
        if (pic && pic != ''){
            params.userpic = pic;
        }
        return params;
    }

    //获取线上
    function getOnlineParams() {
        var params = {};
        params.online = '1';
        // params.type = $(online.courseType).val();
        params.themeName=$('#onLine .layui-this').attr('lay-value');
        var index=$('#onLine .layui-this').index();
        params.themeId =$("#onLine #type option").eq(index).attr('lay-value');
        // console.log(params.type);
        // if(params.type == ''){
        //     layer.msg('请选择分类');
        //     return '';
        // }
        params.courseName = $(online.courseTitle).val();
        if (params.courseName == ''){
            layer.msg('请填写课程标题');
            return '';
        }
        params.resource = $(online.courseware).val();
        if (params.resource == '') {
            layer.msg('请上传课件');
            return '';
        }

        params.resDuration = 0;
        var index1 = params.resource.lastIndexOf(".");
        var index2 = params.resource.length;
        var suffix = params.resource.substring(index1 + 1, index2);//后缀名
        params.resourceType = getVideoType(suffix);
        if (params.resourceType == -1) {
            layer.msg('上传课件格式有问题');
        }else if(params.resourceType == 2) {
            params.resDuration = $("#on-audio")[0].duration;
        } else if (params.resourceType == 1) {
            params.resDuration = $("#on-video")[0].duration;
        }
        if( !isNaN(params.resDuration)){
            params.resDuration = formatVideoTime(params.resDuration);
        }
        var li = $(online.coverList).find('li');
        var coverAry = [];
        if(li.length <= 1) {
            layer.msg('请上传封面');
            return false;
        }
        li.each(function(index,item){
            if(index != 0){
                var src = $(item).find('img').attr('src');
                var obj = {
                    item: src
                };
                coverAry.push(obj);
            }
        });
        params.imgDetail = coverAry;
        params.createId = API.userId;
        var isfree = 0;
        var price = $(online.fee).find('input').val();
        if (price &&  price != '' && parseFloat(price) > 0){
            params.price = price;
            isfree = 1;
        }else {
            isfree = 0
            params.price = '0';
        }
        params.isfree = isfree;
        params.briefs = [];
        // params.duration = 0;
        var li = $(online.courseList).find('li');
        if(li.length == 0) {
            layer.msg('请添加课程简介!');
            return '';
        }
        li.each(function(index,item){
            var obj = {
                imgDetail: $(item).find('img').attr('src'),
                intro: $(item).find('div[data-type="intro"]').html(),
            }
            obj.intro = obj.intro.replace(/<br>/g, '\n');
            params.briefs.push(obj);
        });

        var li = $(online.teacherList).find('li').eq(0);
        if (li.length == 0) {
            layer.msg('请添加主讲人!');
            return '';
        }
        //主讲人
        var speakerId = li.attr('data-id');
        if (speakerId && speakerId != '') {
            params.speakerId = speakerId;
        }
        params.speakerName = li.find('.teacher-title').text();
        params.speakerIntro = li.find('.teacher-msg').html();
        params.speakerIntro = params.speakerIntro.replace(/<br>/g, '\n');
        var pic = li.find('img').attr('alt');
        params.userpic = '';
        if (pic && pic != ''){
            params.userpic = pic;
        }
        return params;
    }
    function formatVideoTime(time){
        var hour = Math.floor(time / 3600);
        var other = time % 3600;
        var minute = Math.floor(other / 60);
        var second = Math.floor(other % 60);
        hour = hour >= 10 ? hour : '0' + hour;
        minute = minute >= 10 ? minute : '0' + minute;
        second = second >= 10 ? second : '0' + second;

        return hour + ':' + minute + ':' + second;
    }
    // 1 视频 2 音频
    function getVideoType(type){
        var index1 = type.lastIndexOf(".");
        var index2 = type.length;
        var str = type.substring(index1 + 1, index2);//后缀名
        var str1 = 'mpg,m4v,mp4,flv,3gp,mov,avi,rmvb,mkv,wmv';
        var str2 = 'mp3,wma,ogg,rm,au,aac,flac,rm';
        str = str.toLowerCase();

        var index = str1.indexOf(str);
        if(index != -1){
            return '1'
        }
        index = str2.indexOf(str);
        if (index != -1) {
            return '2'
        }
        return -1;
    }
    //设置 添加主讲人 头像
    function setTeacherImg(img){
        if (img == '' || img == 'img/default-teacher.png') {
            $('#upload-teacher-default').show();
            $('#upload-teacher-img').hide();
        } else {
            $('#upload-teacher-default').hide();
            $('#upload-teacher-img').attr('src', img);
            $('#upload-teacher-img').show();
        }
    }
 
    var teacherList = [];
    //显示 添加主讲人弹框
    function showAddTeacher(obj) {
        var title = obj && obj.teacherName != '' ? '修改主讲' : '添加主讲';

        layer.open({
            type: 1,
            title: [title, 'font-size:12px;background-color:#424651;color:#fff;'],
            // shadeClose: true,
            // closeBtn: 0,
            area:['700px', 'auto'],
            shadeClose: true,
            content: $('#add-teacher-tpl'),
            success:function(){
                if (obj && obj.teacherName != '') {
                    //设置数据
                    $('#add-teacher-tpl .text-area-box .text-length').text('0/100');
                    //清空 空格
                    obj.msg = formatLineStr(obj.msg);
                    var len = obj.msg && obj.msg.length ? obj.msg.length : 0;
                    $('#add-teacher-tpl .teacher-box input').val(obj.teacherName);

                    $('#add-teacher-tpl .text-area-box .text-length').text(len + '/100');
                    $('#add-teacher-tpl  textarea').val(obj.msg);
                    if (obj.img == '' || obj.img == 'img/default-teacher.png') {
                        $('#upload-teacher-default').show();
                        $('#upload-teacher-img').hide();
                        $('#upload-teacher-img').attr('src','');
                    }else {
                        $('#upload-teacher-default').hide();
                        $('#upload-teacher-img').attr('src', obj.img);
                        $('#upload-teacher-img').show();
                    }
                    $('#add-teacher-tpl .teacher-box dl').hide();
                    //设置当前 主讲人id
                    $('#add-teacher-tpl .teacher-box input').attr('data-id',obj.id);
                    //设置当前第几个主讲人 默认0
                    $('#teacher-ok').attr('data-index', '0');
                }else {

                    //清空重置数据
                    $('#add-teacher-tpl textarea').val('');
                    $('#add-teacher-tpl .text-area-box .text-length').text('0/100');
                    $('#add-teacher-tpl .teacher-box input').val('');
                    $('#upload-teacher-default').show();
                    $('#upload-teacher-img').hide();
                    $('#add-teacher-tpl .teacher-box dl').hide();
                    $('#add-teacher-tpl .teacher-box input').attr('data-id','');
                    $('#teacher-ok').attr('data-index',  '-1'); 
                }
 
                //findTeacherList
   
            },
            cancel: function(index){
                layer.close(index);
                $('#add-teacher-tpl').hide();
            },
            end: function(){
                $('#add-teacher-tpl').hide();
            }
        });
    }
    
    //点击 免费
    $('.fee span').on('click',function(){
        $(this).addClass('active');
        $(this).siblings().find('input').val('0');
    });
    // 输入金额 切换激活免费状态
    $('#offline-content .fee-price .price').on('input', function () {
        if ($(this).val() == 0) {
            $('#offline-content .fee span').show().addClass('active');
        } else {
            $('#offline-content .fee span').removeClass('active');
        }
    });
    $('#online-content .fee-price .price').on('input',function(){
        if($(this).val() == 0) {
            $('#online-content .fee span').show().addClass('active');
        }else {
            $('#online-content .fee span').removeClass('active');
        }
    });

    //清空 线下设置
    function clearOff(){
        //清理 类型
        $(offline.courseType).val('');
        //清空课程标题
        $(offline.courseTitle).val('');

        $(offline.courseware).attr('title', '');

        $('#offline-contet .layui-input').attr('src', '');
        $('#course-upload').attr('data-name','');
        $('#course-upload').val('');
        //清空封面
        var ul = $(offline.coverList);
        var li = ul && ul.find('li');
        ul.find(">li").not(":eq(0)").remove();
        //课程列表
        $(offline.courseList).html('');
        $(offline.teacherList).html('');
        $('#offline-content .fee input').val('300');
        $('#offline-content .fee span').removeClass('active');
        $(offline.teacherAdd).show();
        //清除上传的 音频 视频
        $('#video').attr('src','');
        $('#audio').attr('src','');
    }

    //清空 线下设置
    function clearOn() {
        //清理 类型
        $(online.courseType).val('');
        //清空课程标题
        $(online.courseTitle).val('');
        $(online.courseTitle).attr('title','');
        $(online.courseware).val('');
        $(online.courseware).attr('title','');
        $('#online-contet .layui-input').val('');
        $('#online-contet .layui-input').attr('title', '');
        $('#online-contet .layui-input').attr('src', '');
        $('#online-course-upload').attr('data-name','');
        //清空封面
        var ul = $(online.coverList);
        var li = ul && ul.find('li');
        ul.find(">li").not(":eq(0)").remove();
        //课程列表
        $(online.courseList).html('');
        $(online.teacherList).html('');
        $(online.teacherAdd).show();
        $('#online-content .fee input').val('0');
        $('#online-content .fee span').addClass('active');
        //清除上传的 音频 视频
        $('#on-video').attr('src','');
        $('#on-audio').attr('src','');
    }

    function clearCover(line){
        var ul = line.find('.row-cover ul');
        var li = ul && ul.find('li');
        ul.find(">li").not(":eq(0)").remove();
        ul.find('li').eq(0).show();
    }
    function showOff() {
 
        $('#offline-content').show();
        $('#online-content').hide();
    }
    function showOn(){
        $('#online-content').show();
        $('#offline-content').hide();
    }
});