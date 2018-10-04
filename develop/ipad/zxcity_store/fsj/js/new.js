(function($) {
    //初始化编辑框
    initKindEditor();

    var editor;
    /*
     * 编辑框
     */
    function initKindEditor() {
        KindEditor.ready(function(K) {
            editor = K.create('textarea[name="detail"]', {
                resizeType: 0,
                allowPreviewEmoticons: false,
                themeType: 'example1',
                cssData: 'body{font: 42px/1.5 "sans serif",tahoma,verdana,helvetica;color:#555;}',
                uploadJson: '/zxcity_restful/ws/rest?cmd=/shop/upload_detail_image',
                extraFileUploadParams: {
                    cmd: '/shop/upload_detail_image',
                    data: '',
                    version: 1
                },
                items: ['image', 'source', 'undo', 'redo', 'preview',
                    'plainpaste', 'wordpaste', 'justifyleft', 'justifycenter',
                    'justifyright', 'forecolor', 'hilitecolor', 'justifyfull', 'insertorderedlist',
                    'insertunorderedlist', 'subscript', 'superscript',
                    'clearhtml', 'formatblock', 'fontname', 'fontsize',
                    'bold', 'italic', 'underline',
                    'strikethrough', 'lineheight', 'removeformat', 'hr', 'quickformat'
                ]
            });
        });

    }

    //文字超出部分提示
    function moreWord(event, num) {
        $(event).each(function() {
            var val = $(this).val();
            var valLength = val.length;
            if (valLength == 0) {
                layer.msg("您还未输入标题哟");
            }
            if (valLength < 5 && valLength > 0) {
                layer.msg("标题至少输入5个字哟");
            }
            if (valLength > num) {
                layer.msg("文字超出限制哦，请重新输入");
            }
        });
    };

    //判断标题是否超出
    /*$(".form-title-input").blur(function() {
        moreWord($(this), 30);
    });*/

    ///统计标题字数
    $(".upload-form-title").on("keydown keyup", ".form-title-input", function() {
        var total = $(this).val();
        $(".upload-form-num").text(total.length);
    });


    var types = ['活动引客', '爆点留客', '追销锁客', '粉丝升客', '团队拓客', '观鱼览客', '人', '事', '客', '项', '钱'];
    var captions = ['通过线上、线下大量活动、卡券、优惠吸引拓客。',
        '设定 “爆点”让体验顾客不得不留在店面，以便追销锁客。',
        '设定长期的、连续的追销系统让顾客连续消费，创造收益，让其成为长期稳定顾客。',
        '因应消费者权益向粉丝权益的消费升级改变，设定本商品及服务的粉丝权益，从而服务升级——供给侧改革，顾客变粉丝...',
        '建立粉团队，组织化发展，娱乐性实现 。体验参与、搭建平台、社会推动——变成员工、顾客、社会的共享性平台——...',
        '客户定位——你的顾客在哪？',
        '颠覆“招人难、用人难、留人难”，人员自动自发，打造“最强团队”',
        '颠覆“老板就是事妈”，流程管事，打造“自动流转店务机器”',
        '颠覆“差客、客差、客同店固有的敌对矛盾”，六脉粉神剑、退而搭平台，打造“线下粉团队、线上粉闭环”',
        '颠覆“店面为产品打工、为项目牺牲”，项目=爱好=追求，打造“顾客项目培训体系”',
        '颠覆“亏损、负债经营”，消费者权益上升为粉丝权益服务，打造“粉团队”，企业“变银行”'
    ];
    var projectType = -1;

    $.urlParam = function(name) {
        var results = new RegExp('[\?&]' + name + '=([^&#]*)')
            .exec(window.location.href);
        return results[1] || 0;
    }

    var p1 = $.urlParam('type');
    if (p1 && p1 != "") {
        projectType = parseInt(p1);
        $(".uploadDetail-title").text(types[projectType]);
        $("#txtFA").text(captions[projectType]);
        $("#txtProjectType").val(projectType);


    }

    /*  */
    /* 改变页面大小 */
    /*
        var scaleValue = 1.8;
        $('body').css({
            '-webkit-transform': 'scale(' + scaleValue + ')',
            '-moz-transform': 'scale(' + scaleValue + ')',
            '-ms-transform': 'scale(' + scaleValue + ')',
            '-o-transform': 'scale(' + scaleValue + ')',
            'transform': 'scale(' + scaleValue + ')',

            '-webkit-transform-origin': '0 0',
            '-moz-transform-origin': '0 0',
            '-o-transform-origin': '0 0',
            '-ms-transform-origin': '0 0'
        });*/

    var userId = $.urlParam('user');

    // 标题栏回车事件
    $('#title').keypress(function(e) {
        var keyCode = e.keyCode || e.which;
        if (keyCode === 13)  {
            e.preventDefault();
            editor.focus();
        }
    });
    
    
    // 发布按钮事件
    $("#btnSubmit").click(function() {
        if (projectType == -1)
            return;

        var newTitle = $.trim($("#title").val());
        
        var newContent = $.trim(editor.html());

        if (newTitle == "") {
            layer.msg("请输入标题。");
            return;
        }

        if (newTitle.length < 5 && newTitle.length > 0) {
            layer.msg("标题至少输入5个字哟");
            return;
        }
        if (newTitle.length > 30) {
            layer.msg("文字超出限制哦，请重新输入");
            return;
        }


        if (newContent == "") {
            layer.msg("请输入内容。");
            return;
        }
       
        var imageLinks = "";
        //从编辑器中提取图片地址
        var imgs = $(".plarContent-text").find("iframe").contents().find("body img");
        $.each(imgs, function(i, item){
        	imageLinks += $(item).attr("src") + ",";
        });
        imageLinks = imageLinks.substring(0, imageLinks.length-1);
        var jsonData = {
            usercode: userId,
            author: $.trim($("#author").val()),
            content: editor.html(),
            title: newTitle,
            contact: '',
            imageLinks: imageLinks,
            pType: projectType
        };
        
        var result = reqAjax('shop/submitShopProject', JSON.stringify(jsonData));
        //console.log(result);
        if (result.code == 1) { // 成功
            layer.alert('保存完毕。', function(index) {
                layer.close(index);
                location.href = "list.html?type=" + projectType + "&user=" + userId;
            });
        } else { // 失败
            layer.alert(result.msg);
        }

    });

})(jQuery);