
//初始化富文本编辑器
var editor = KindEditor.create('#applicationform', {
    useContextmenu: false,
    esizeType : 1,
	allowPreviewEmoticons : false,
    cssData: 'img { max-width: 100%; }',
    items: [
        "undo", "redo", "|", "preview", "cut", "copy", "paste", "plainpaste", "wordpaste", "|", "justifyleft", "justifycenter", "justifyright", "justifyfull", "outdent", "subscript", "superscript", "clearhtml", "quickformat", "selectall", "|", "fullscreen", "/", "formatblock",
        "fontname", "fontsize", "|", "forecolor", "hilitecolor", "bold", "italic", "underline", "strikethrough", "lineheight", "removeformat", "|", "images"
    ],
    filterMode: true,
    htmlTags: {
        font: ['color', 'size', 'face', '.background-color'],
        span: [
            '.color', '.background-color', '.font-size', '.font-family', '.background',
            '.font-weight', '.font-style', '.text-decoration', '.vertical-align', '.line-height'
        ],
        'p,div': [
            'align', '.text-align', '.color', 'css', '.background-color', '.font-size', '.text-decoration', '.vertical-align'
        ],
        table: [
            'border', 'cellspacing', 'cellpadding', 'width', 'height', 'align', 'bordercolor', 'css',
            '.padding', '.margin', '.border', 'bgcolor', '.text-align', '.color', '.background-color',
            '.font-size', '.font-family', '.font-weight', '.font-style', '.text-decoration', '.background',
            '.width', '.height', '.border-collapse'
        ],
        'td,th': [
            'align', 'valign', 'width', 'height', 'colspan', 'rowspan', 'bgcolor', 'css',
            '.text-align', '.color', '.background-color', '.font-size', '.font-family', '.font-weight',
            '.font-style', '.text-decoration', '.vertical-align', '.background', '.border'
        ],
        a: ['href', 'target', 'name'],
        embed: ['src', 'width', 'height', 'type', 'loop', 'autostart', 'quality', '.width', '.height', 'align', 'allowscriptaccess'],
        img: ['src', 'border', 'alt', 'title', 'align', '.border'],
        'ol,ul,li,blockquote,h1,h2,h3,h4,h5,h6': [
            'align', '.text-align', '.color', '.background-color', '.font-size', '.font-family', '.background',
            '.font-weight', '.font-style', '.text-decoration', '.vertical-align', '.text-indent', '.margin-left'
        ],
        pre: ['class'],
        hr: ['class', '.page-break-after'],
        'br,tbody,tr,strong,b,sub,sup,em,i,u,strike,s,del': [],
    },
    resizeType: 1
});
//初始化富文本编辑器
KindEditor.lang({
    images: '插入图片'
});
KindEditor.plugin('images', function(K) {
    var self = this,
        name = 'images';
    self.clickToolbar(name, function() {
        layer.msg("正在进行中请耐心等待！~");
        $("#btn").click();
    });
});

$(function() {
    //储存富文本编辑器中的图片
    var imgArr = [];
    //富文本编辑器上传图片
    uploadOss({
        btn: "btn",
        imgArr: imgArr,
        editor: editor,
        flag: "send"
    });
});

