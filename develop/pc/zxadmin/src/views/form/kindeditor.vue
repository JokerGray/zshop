<template>
  <div class="kindeditor">
    <editor id="editor_id" height="500px" width="700px" :content="editorText"
        :items="items"
        :htmlTags="htmlTags"
        :filterMode="true"
        :resizeType="1"
        pluginsPath="../../../static/kindeditor/plugins/"
        :loadStyleMode="false"
        :afterChange="afterChange()"
        @on-content-change="onContentChange">
    </editor>
  </div>
</template>
<script>
/* eslint-disable */
import './kindeditor/lang/zh-CN.js'
export default {
  name: 'kindeditor',
  mounted () {
    //添加自定义插件
    KindEditor.plugin('images', function(K) {
        let self = this,
            name = 'images';
        self.clickToolbar(name, function() {
          //上传阿里云回调
          console.log('上传图片');
        });
    });
    KindEditor.lang({
        images: '插入图片'
    });
  },
  data () {
    return {
      editorText: '',
      items: [
        "undo", "redo", "|", "preview", "cut", "copy", "paste", "plainpaste", "wordpaste", "|", "justifyleft", "justifycenter", "justifyright", "justifyfull", "outdent", "subscript", "superscript", "clearhtml", "quickformat", "selectall", "|", "fullscreen", "/", "formatblock",
        "fontname", "fontsize", "|", "forecolor", "hilitecolor", "bold", "italic", "underline", "strikethrough", "lineheight", "removeformat", "|", "images", "|", "about"
      ],
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
    }
  }, 
  methods: {
    onContentChange (val) {
      this.editorText = val;
    },
    afterChange (){
      
    }
  }
}
</script>
<style>
.ke-icon-images{
  background-image: url(./kindeditor/themes/default/default.png);
  background-position: 0px -496px;
  width: 16px;
  height: 16px;
}
</style>

