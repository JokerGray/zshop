$(function () {
    var form = {};
    var table = {};
    var layer = {};
    var CMD_QUERYTYPE = "dazzle/findAudioType", //查询音乐类型
        CMD_QUERYMUSIC = "dazzle/findAudioFile",
        CMD_UPDATAMUSIC = "dazzle/updateAudioFile",
        CMD_ADDMUSIC = "dazzle/addAudioFile",
        CMD_DELMUSIC = "dazzle/delAudioFile";
    var typeData = {};
    var layer = layui.layer;
    var paramKeys = '';
    var type = '';
    var pageno = 1;
    var rows = 10;
    var limits = [10];
    layui.use(['form', 'table','laypage','layer','element'],function(){
        form = layui.form;
        table = layui.table;
        laypage = layui.laypage;
        layer = layui.layer;
        element = layui.element;
        console.log(form);
        form.render();
        table.on('tool(tablelist)', function (obj) {
            console.log(obj);
            var event = obj.event;
            if (event == 'change') {
                showEdit(obj);
            } else if (event == 'delete') {
                layer.confirm('真的删除该角色吗？', function (index) {
                    //
                    var id = obj.data.id;
                    var delData = {
                        id: id
                    }
                    reqNewAjaxAsync('/zxcity_restful/ws/rest', CMD_DELMUSIC, delData).done(function (res) {
                        // console.log(res);
                        reloadPage();
                    })
                });
            }
        });
        //监听select选择
        form.on('select(musicType)', function () {
            $('#inputSearch').val('');
            var type = $('#musicType').val();
 
            getTable('', type, 1);
        });
        // 查询音乐类型
        queryMusicType();
        getTable(paramKeys,type, 1);
    });
    // 播放器
    var player = document.getElementById('musicPlayer');
    // 上传
    ossUpload('newMusic', $("#showBox1"), "music", resetLayer);
    ossUpload('newImg', $("#showBox1"), "img", resetLayer);
    ossUpload('fixImg', $("#showBox2"), "img");
    ossUpload('fixMusic', $("#showBox2"), "music");

    // 新增音乐
    $('#adGs').on('click', function () {
        showAdd();
    });
    //搜索
    $('#search').on('click',function() {
        var value = $('#inputSearch').val();
        var type = $('#musicType').val();
        getTable(value, type,1);
    });

    // 搜索按钮enter键
    $('#inputSearch').on('keydown', function (event) {
        var value = $(this).val();
        var type = $('#musicType').val();
        if (event.keyCode == 13) {
            getTable(value, type,1);
        }
    });

    // 按音乐类型搜索
    $('#musicType').on('change', function () {
        $('#inputSearch').val('');
        var type = $(this).val();
        getTable('', type, 1);
    });
 
    function resetLayer() {
        console.log('resetLayer');
        $('.layui-layer-content').css('height','auto');
    }
    // 刷新页面
    function reloadPage() {
        setTimeout(function () {
            window.location.reload();
        }, 1000)
    }
    function showAdd() {
        layer.open({
            type: 1,
            anim: 5,
            area: ['600px'],
            shadeClose: true, //点击遮罩关闭
            content: $('#add'),
            btn: ['添加', '取消'],
            title: ['新增音频', 'font-size:12px;background-color:#424651;color:#fff'],
            cancel: function (index, layero) {
                layer.close(index);
                return false;
            },
            yes: function (index, layero) {
                 
                var musicName = $('#musicName').val();
                var author = $('#author').val();
                var musicType = $('#musicType2').val();
                var musicCover = $('#showBox1').find('.musicCover').attr('data-src');
                var musicUrl = $('#showBox1').find('.musicUrl').attr('data-url');
                var musicDur = $('#showBox1').find('.musicDur').attr('data-dur');
                if (musicName == "") {
                    layer.msg('请输入歌曲名')
                    return
                }
                if (author == "") {
                    layer.msg('请输入作者')
                    return
                }
                if (musicCover == undefined) {
                    layer.msg('请上传封面')
                    return
                }
                if (musicUrl == undefined) {
                    layer.msg('请上传歌曲')
                    return
                }
                var addData = {
                    videoTimeSize: musicDur,
                    coverUrl: musicCover,
                    name: musicName,
                    authorName: author,
                    type: musicType,
                    url: musicUrl
                }
                reqNewAjaxAsync('/zxcity_restful/ws/rest', CMD_ADDMUSIC, addData).done(function (res) {
                    console.log(res);
                    if (res.code == "1") {
                        // $('#newSave').unbind('click');
                        reloadPage()
                    } else {
                        layer.msg(res.msg);
                    }
                });
            },
            success: function () {
                $('#add .show-upload').hide();
            },
            btn2: function (index, layero) {
                layer.close(index);
            },
            end: function (index) {
                $('#edit').hide();
            }
        })
    }
    function showEdit(obj) {
        layer.open({
            type: 1,
            anim: 5,
            area: ['600px'],
            shadeClose: true, //点击遮罩关闭
            content: $('#edit'),
            btn: ['确定', '取消'],
            title: ['修改音乐', 'font-size:12px;background-color:#424651;color:#fff'],
            cancel: function (index, layero) {
                layer.close(index);
                return false;
            },
            yes: function (index, layero) {
                var id = obj.data.id;
                var musicName = $('#fixName').val();
                var author = $('#fixAuthor').val();
                var musicType = $('#fixType').val();
                var musicCover = $('#showBox2').find('.musicCover').attr('data-src');
                var musicUrl = $('#showBox2').find('.musicUrl').attr('data-url');
                var musicDur = $('#showBox2').find('.musicDur').attr('data-dur');
                if (musicName == "") {
                    layer.msg('请输入歌曲名')
                    return
                }
                if (author == "") {
                    layer.msg('请输入作者')
                    return
                }
                if (musicCover == undefined || musicCover == "") {
                    layer.msg('请上传封面')
                    return
                }
                if (musicUrl == undefined || musicCover == "") {
                    layer.msg('请上传歌曲')
                    return
                }
                var fixData = {
                    videoTimeSize: musicDur,
                    coverUrl: musicCover,
                    name: musicName,
                    authorName: author,
                    type: musicType,
                    url: musicUrl,
                    id: id
                }
                 
                reqNewAjaxAsync('/zxcity_restful/ws/rest', CMD_UPDATAMUSIC, fixData).done(function (res) {
                    console.log(res);
                    if (res.code == '1') {
                        // $('#fixSave').unbind('click');
                        reloadPage();
                    } else {
                        layer.msg(res.msg);
                    }
                })
            },
            success: function () {
                var data = obj.data;
                $('#fixName').val(data.name);
                $('#fixAuthor').val(data.authorName);
                $('#fixType').val(data.typeName);
                if (data.url) {
                    $('#showBox2').show();
                    $('#showBox2').find('.img_fl').html('<img class="musicCover" data-src="' + data.coverUrl + '" src="' + data.coverUrl + '">')
                    $('#showBox2').find('.img_fr').html('<p data-url="' + data.url + '" class="musicUrl">地址：' + data.url + '</p><p data-dur="' + data.videoTimeSize + '" class="musicDur">时长：' + data.videoTimeSize + '</p>');
                }
                var typeData = {}
                // 选择框赋值
                reqNewAjaxAsync('/zxcity_restful/ws/rest', CMD_QUERYTYPE, typeData).done(function (res) {
                    var type = data.type;
                    var optionHtml = '';
                    console.log(res.data.findMusicType);
                    for (var i = 0; i < res.data.findMusicType.length; i++) {
                        if (res.data.findMusicType[i].id == type) {
                            optionHtml += '<option  selected="selected" value="' + res.data.findMusicType[i].id + '">' + res.data.findMusicType[i].name + '</option>'
                        } else {
                            optionHtml += '<option value="' + res.data.findMusicType[i].id + '">' + res.data.findMusicType[i].name + '</option>'
                        }
                    }
                    $('#fixType').html(optionHtml);
                    form.render();
                })
                 
            },
            btn2: function (index, layero) {
                layer.close(index);
            },
            end: function (index) {
                $('#edit').hide();
            }
        });
    }
 
    // 清空表格中内容
    function clearTable() {
        var musicHtml = '<table class="table table-bordered table-striped"><tbody>' +
            '<tr><th>序号</th><th>图像</th><th>歌曲</th><th>作者</th><th>类型</th><th>时长</th><th>创建时间</th><th>播放</th><th>操作</th></tr>' +
            '</tbody></table><div class="no-data">暂无数据~</div>';
        $('#tablelist').html(musicHtml);
    }
    function getTable(paramKeys, type,pageno) {
        //第一个实例
        
        var tableINs = table.render({
            id: 'tablelist',
            elem: '#tablelist',
            even: true,
            cellMinWidth: 80,
            skin: 'row',
            page: false,
            cols: [
                [ //表头
                    {
                        type: 'numbers', title: '序号', align: 'center', width: 80, templet: "#indexTpl"
                    }, {
                        field: 'coverUrl',
                        title: '图像',
                        edit: false,
                        width: 90,
                        // style: 'height:110px', 
                        templet: "#imgTpl" 
                    }, {
                        field: 'name',
                        title: '歌曲',
                        edit: false,
                        width: 100

                    }, {
                        field: 'authorName',
                        title: '作者',
                        width: 200
         
                    }, {
                        field: 'typeName',
                        title: '类型',
                        width: 200
                       
                    }, {
                        field: 'videoTimeSize',
                        title: '时长',
                        width: 100
                    
                    },{
                        field: 'createTime',
                        title: '创建时间',
                        width: 200
                        
                    },{
                        field: 'plya',
                        title: '播放',
                        width: 150,
                        templet: function(d) {
                            return '<span class="play" data-url="' + d.url + '"><span>';
                        }
                    }
                    , {
                        fixed: 'right',
                        title: '操作',
                        style: 'min-height: 80px;height:auto;',
                        width: 250,
                        toolbar: '#barCtrl'
                    }
                ]
            ]
        });
         
        var res = pageCallback(paramKeys, type, pageno);
         
        if (res) {
            // console.log(res)
            if (res.code == 1) {
                player.pause();
                tableINs.reload({
                    data: res.data.findMusic
                })
            } else {
                layer.msg(res.msg)
            }
        }
        // 添加暂无图片
        var imgs = $('.imgs');
        for (var i = 0; i < imgs.length; i++) {
            if (imgs[i].getAttribute('data-img') == "") {
                imgs[i].innerText = "暂无图片";
            }
        }
        player.pause();
        // playMusic($(player));
        //分页
        layui.use('laypage');
        var page_options = {
            elem: 'laypageLeft',
            count: res ? res.total : 0,
            layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
            groups: '4',
            limit: rows,//每页条数
            limits: limits
        }
        //分页渲染
        page_options.jump = function (obj, first) {
             
            if (!first) {
                player.pause();
                var resTwo = pageCallback(paramKeys, type, obj.curr, obj.limit);
                if (resTwo && resTwo.code == 1)
                    tableINs.reload({
                        data: resTwo.data.findMusic,
                        limit: obj.limit
                    });
                else
                    layer.msg(resTwo.msg);
            }
            playMusic($(player));
        }

        //设置 工具栏 固定后高度
        var tr = $('.layui-table-box .layui-table-main tbody tr');
        var height = $('.layui-table-box .layui-table-main tbody tr').css('height');
        $('.layui-table-box .layui-table-fixed .layui-table-body tr').css('height', height);

        layui.laypage.render(page_options);

    }
    //获取内容方法
    function pageCallback(paramKeys, type, pagerows, limit) {
        // var labelName = $('#search_box').val();
        var data = {
            name: paramKeys,
            type: type,
            page: pagerows - 1 > 0 ? pagerows - 1 : 0,
            row: limit || rows
        };
 
        var res = reqAjax(CMD_QUERYMUSIC, JSON.stringify(data));
        if (res.code == 1) {
            return res;
        }
    }
    function showList(res) {
        if (res.data) {
            // console.log(res);
            // 清楚音乐
            player.pause();
            var musics = res.data.findMusic;
            var musicHtml = "";
            if (musics.length) {
                var musicHead = '<table class="table table-bordered table-striped"><tbody><tr><th>序号</th><th>图像</th><th>歌曲</th><th>作者</th><th>类型</th><th>时长</th><th>创建时间</th><th>播放</th><th>操作</th></tr>';
                var musicBody = "";
                var musicFoot = '</tbody></table>';
                for (var i = 0; i < musics.length; i++) {
                    musicBody += '<tr><td>' + (i + 1) + '</td><td class="url"><div class="showImg"><div class="imgs" data-img="' + musics[i].coverUrl + '" style="background:#5cb85c url(' + musics[i].coverUrl + ') no-repeat center center;background-size:100% 100%;"></div></div></td><td class="name">' + musics[i].name + '</td><td class="author">' + musics[i].authorName + '</td><td>' + musics[i].typeName + '</td><td>' + musics[i].videoTimeSize + '</td>' +
                        '<td>' + musics[i].createTime + '</td><td><span class="play" data-url="' + musics[i].url + '"><span></td><td><button class="btn btn-success fix" hdid="' + musics[i].id + '">修改</button>' +
                        '<button class="btn btn-danger del"  data-id="' + musics[i].id + '"  style="margin-left:10px;">删除</button></td></tr>';
                }
                var musicHtml = (musicHead + musicBody + musicFoot);
            } else {
                musicHtml = '<table class="table table-bordered table-striped"><tbody>' +
                    '<tr><th>序号</th><th>图像</th><th>歌曲</th><th>作者</th><th>类型</th><th>时长</th><th>创建时间</th><th>播放</th><th>操作</th></tr>' +
                    '</tbody></table><div class="no-data">暂无数据~</div>';
            }
            $('#tablelist').html(musicHtml);
            // 添加暂无图片
            var imgs = $('.imgs');
            for (var i = 0; i < imgs.length; i++) {
                if (imgs[i].getAttribute('data-img') == "") {
                    imgs[i].innerText = "暂无图片";
                }
            }
            // 点击播放
            playMusic($(player));
            // 删除
            $('.del').on('click', function () {
                var id = $(this).attr('data-id');
                $('#delGoods').attr('data-id', id);
                $('#delgd').modal('show');
            });
            // 修改音乐
            $('.fix').on('click', function () {
                var id = $(this).attr('hdid');
                $('#fixSave').attr('data-id', id);
                var musicData = {
                    id: id
                }
                // 查询该条音乐
                reqNewAjaxAsync('/zxcity_restful/ws/rest', CMD_QUERYMUSIC, musicData).done(function (res) {
                    var musicObj = res.data.findMusic[0];
                    $('#fixName').val(musicObj.name);
                    $('#fixAuthor').val(musicObj.authorName);
                    $('#showBox2').find('.img_fl').html('<img class="musicCover" data-src="' + musicObj.coverUrl + '" src="' + musicObj.coverUrl + '">')
                    $('#showBox2').find('.img_fr').html('<p data-url="' + musicObj.url + '" class="musicUrl">地址：' + musicObj.url + '</p><p data-dur="' + musicObj.videoTimeSize + '" class="musicDur">时长：' + musicObj.videoTimeSize + '</p>');
                    var typeData = {}
                    // 选择框赋值
                    reqNewAjaxAsync('/zxcity_restful/ws/rest', CMD_QUERYTYPE, typeData).done(function (res) {
                        var type = musicObj.type;
                        var optionHtml = '';
                        console.log(res.data.findMusicType);
                        for (var i = 0; i < res.data.findMusicType.length; i++) {
                            if (res.data.findMusicType[i].id == type) {
                                optionHtml += '<option  selected="selected" value="' + res.data.findMusicType[i].id + '">' + res.data.findMusicType[i].name + '</option>'
                            } else {
                                optionHtml += '<option value="' + res.data.findMusicType[i].id + '">' + res.data.findMusicType[i].name + '</option>'
                            }
                        }
                        $('#fixType').html(optionHtml);
                    })
                })
                $('#fixAudio').modal('show');
            });
        }

    }

    // 删除
    $('#delGoods').on('click', function () {
        var id = $(this).attr('data-id');
        var delData = {
            id: id
        }
        reqNewAjaxAsync('/zxcity_restful/ws/rest', CMD_DELMUSIC, delData).done(function (res) {
            // console.log(res);
            reloadPage()
        })
    });
    
    function playMusic(audio) {
        $('.play').on('click', function () {
            var stopStu = $(this).hasClass('stop');
            if (!stopStu) {
                $('.play').removeClass('stop');
                $(this).addClass('stop');
                var url = $(this).attr('data-url');
                audio[0].pause();
                // console.log();
                if (audio.attr('src') == undefined || audio.attr('src') != url) {
                    audio.attr('src', url);
                }
                audio[0].play();
            } else {
                $('.play').removeClass('stop');
                audio[0].pause();
            }

        });
    }
    function queryMusicType() {
        var queryData = {}
        reqAjaxAsync(CMD_QUERYTYPE, JSON.stringify(queryData), showTypeSelect)
    }
    // 下拉选择音乐类型
    function showTypeSelect(res) {
        // console.log(res);
        $('#musicType').html('');
        $('#musicType2').html('');
        var optionHtml = '<option value="">全部</option>';
        var optionCont = "";
        for (var i = 0; i < res.data.findMusicType.length; i++) {
            optionCont += '<option value="' + res.data.findMusicType[i].id + '">' + res.data.findMusicType[i].name + '</option>';
        }
        $('#musicType').html(optionHtml + optionCont);
        $('#musicType2').html(optionHtml +optionCont);
    
        form.render();
    }
    function tableRender(option) {
        var tableIns = table.render({
            id: option.id,
            elem: '#' + option.id,
            height: option.height || 'full-250',
            cols: option.cols, //表头
            page: false, //是否开启分页
            even: true, //是否开启隔行背景
            skin: 'row', //表格风格
            limit: option.limit || 15, //每页显示的条数
            limits: option.limits || [15],
            done: function (res, curr, count) {
                option.done && option.done();
                console.log('done');
            }
        });
        tableIns.reload({
            data: option.data,
            page: {
                curr: 1
            }
        });
        //分页
        laypage.render({
            elem: option.pageId, //分页容器的id
            count: option.count || option.total || 1, //总页数
            layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
            limit: option.limit || 15, //每页显示的条数
            limits: option.limits | [15],
            skin: '#1E9FFF', //自定义选中色值
            //,skip: true //开启跳页
            jump: function (obj, first) {
                if (!first) {
                    layer.msg('第' + obj.curr + '页');
                }
            }
        });
    }
    // 代入请求数据的ajax异步方法
    function reqAjaxAsync(cmd, data, callback) {
        var apikey = sessionStorage.getItem('apikey') || "test"; //获取缓存 通行证码
        var version = sessionStorage.getItem('version') || "1"; //获取缓存 版本号
        var inputdata = data;
        $.ajax({
            type: "POST",
            url: "/zxcity_restful/ws/rest",
            dataType: "json",
            async: true, //默认为异步
            data: {
                "cmd": cmd,
                "data": data || "",
                "version": version
            },
            beforeSend: function (request) {
                layer.load(0, {
                    shade: [0.1, '#fff']
                });
                request.setRequestHeader("apikey", apikey);
            },
            success: function (res) {
                layer.closeAll('loading');
                callback(res, inputdata);
            },
            error: function (err) {
                layer.closeAll('loading');
                layer.msg("请求出错！");
                console.log(err);
            }
        });
    }
    //异步请求Ajax
    function reqNewAjaxAsync(url, cmd, data, async) {
        var apikey = sessionStorage.getItem('apikey') || "test"; //获取缓存 通行证码
        var version = sessionStorage.getItem('version') || "1"; //获取缓存 版本号
        var defer = $.Deferred();
        $.ajax({
            type: "POST",
            url: url,
            dataType: "json",
            async: async || true, //默认为异步
            data: {
                "cmd": cmd,
                "data": JSON.stringify(data) || "",
                "version": version
            },
            beforeSend: function (request) {
                layer.load(0, {
                    shade: [0.1, '#fff']
                });
                request.setRequestHeader("apikey", apikey);
            },
            success: function (data) {
                layer.closeAll('loading');
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
});