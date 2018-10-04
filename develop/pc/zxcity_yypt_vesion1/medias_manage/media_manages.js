$(function () {
    var CMD_QUERYTYPE = "dazzle/findAudioType", //查询音乐类型
        CMD_QUERYMUSIC = "dazzle/findAudioFile",
        CMD_UPDATAMUSIC = "dazzle/updateAudioFile",
        CMD_ADDMUSIC = "dazzle/addAudioFile",
        CMD_DELMUSIC = "dazzle/delAudioFile";
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
    // 刷新页面
    function reloadPage() {
        setTimeout(function () {
            window.location.reload();
        }, 1000)
    }
    // 播放器
    var player = document.getElementById('musicPlayer');
    // 上传
    ossUpload('newMusic', $("#showBox1"), "music");
    ossUpload('newImg', $("#showBox1"), "img");
    ossUpload('fixImg', $("#showBox2"), "img");
    ossUpload('fixMusic', $("#showBox2"), "music");

    // 查询音乐类型
    queryMusicType();

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
        $('#musicType2').html(optionCont);
    }
    // 新增音乐
    $('#adGs').on('click', function () {
        $('#addgd').modal('show');
    });

    //新增音乐，确定
    $('#newSave').on('click', function () {
        var musicName = $('#musicName').val();
        var author = $('#author').val();
        var musicType = $('#musicType2').val();
        var musicCover = $('#showBox1').find('.musicCover').attr('data-src');
        var musicUrl = $('#showBox1').find('.musicUrl').attr('data-url');
        var musicDur = $('#showBox1').find('.musicDur').attr('data-dur');
        // console.log(musicName)
        // console.log(author)
        // console.log(musicType)
        // console.log(musicCover)
        // console.log(musicUrl)
        // console.log(musicDur)
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
            if(res.code=="1"){
                $('#newSave').unbind('click');
                reloadPage()
            }else{
                layer.msg(res.msg);
            }
        })
    });
    // 修改按钮
    $('#fixSave').on('click', function () {
        var id = $(this).attr('data-id');
        var musicName = $('#fixName').val();
        var author = $('#fixAuthor').val();
        var musicType = $('#fixType').val();
        var musicCover = $('#showBox2').find('.musicCover').attr('data-src');
        var musicUrl = $('#showBox2').find('.musicUrl').attr('data-url');
        var musicDur = $('#showBox2').find('.musicDur').attr('data-dur');
        // console.log(musicName)
        // console.log(author)
        // console.log(musicType)
        // console.log(musicCover)
        // console.log(musicUrl)
        // console.log(musicDur)
        if (musicName == "") {
            layer.msg('请输入歌曲名')
            return
        }
        if (author == "") {
            layer.msg('请输入作者')
            return
        }
        if (musicCover == undefined||musicCover=="") {
            layer.msg('请上传封面')
            return
        }
        if (musicUrl == undefined||musicCover=="") {
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
        console.log(fixData)
        reqNewAjaxAsync('/zxcity_restful/ws/rest', CMD_UPDATAMUSIC, fixData).done(function (res) {
            console.log(res);
            if(res.code=='1'){
                $('#fixSave').unbind('click');
                reloadPage()                
            }else{
                layer.msg(res.msg);
            }
        })
    });
    // 初始化查询音乐列表
    function startQuery(name, type) {
        clearTable();
        var queryData = {
            name: name,
            type: type,
            page: 0,
            row: 1
        }
        // console.log(queryData)
        reqAjaxAsync(CMD_QUERYMUSIC, JSON.stringify(queryData), showPage)
    }
    startQuery("", "");
    // 搜索按钮
    $('#search').on('click', function () {
        var value = $('#inputSearch').val();
        var type=$('#musicType').val();
        startQuery(value,type);
    });
    // 搜索按钮enter键
    $('#inputSearch').on('keydown', function () {
        var value = $(this).val();
        var type=$('#musicType').val();
        if(event.keyCode == 13){  
            startQuery(value,type);
        }  
    });
    // 按音乐类型搜索
    $('#musicType').on('change', function () {
        $('#inputSearch').val('');
        var type = $(this).val();
        startQuery('', type);
    });
    // 展示分页
    function showPage(res, inputData) {
        // console.log(res)
        // console.log(inputData)
        var inputObj = JSON.parse(inputData);
        // console.log(inputObj);
        var total = res.total,
            totalPage = Math.ceil(total /7);
        $("#totals").text(total);
        layui.use(['laypage'], function () {
            var laypage = layui.laypage;
            laypage({
                cont: "pages",
                pages: totalPage, //总页数
                groups: 5, //连续显示分页数
                jump: function (obj) {
                    var curr = obj.curr;
                    var currNum = curr;
                    var newdatas = {
                        "name": inputObj.name,
                        "type": inputObj.type,
                        "page": currNum - 1,
                        "row": 7
                    };
                    var data = JSON.stringify(newdatas);
                    // console.log(newdatas)
                    reqAjaxAsync(CMD_QUERYMUSIC, data, showList);
                }
            });
        });
    }
    // 清空表格中内容
    function clearTable() {
        var musicHtml = '<table class="table table-bordered table-striped"><tbody>' +
            '<tr><th>序号</th><th>图像</th><th>歌曲</th><th>作者</th><th>类型</th><th>时长</th><th>创建时间</th><th>播放</th><th>操作</th></tr>' +
            '</tbody></table><div class="no-data">暂无数据~</div>';
        $('#tablelist').html(musicHtml);
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
});