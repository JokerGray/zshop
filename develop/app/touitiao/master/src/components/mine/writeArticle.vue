<template>
  <div>
    <div class="writeArticle_header">
      <a href="javascript:;" class="cancelBtn">取消</a>
      <div class="changeBts">
        <a href="javascript:;" class="active">编辑</a>
        <a href="javascript:;">发布</a>
      </div>
      <a href="javascript:;" class="previewBtn">预览</a>
    </div>
    <div class="inputTitle">
      <input type="text" placeholder="请输入标题">
    </div>
    <div class="quill-editor-box">
      <quill-editor v-model="content"
                    ref="quillEditorA"
                    :options="editorOption"
                    @blur="onEditorBlur($event)"
                    @focus="onEditorFocus($event)"
                    @ready="onEditorReady($event)">
      </quill-editor>
    </div>
  </div>
</template>

<script>
  import {quillEditor} from 'vue-quill-editor'
  import $ from 'jquery'
  export default {
    components: {
      quillEditor
    },
    data: function () {
      return {
        content: '',
        editorOption: {
          theme: 'snow',
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline'],
              //['blockquote', 'code-block'],
              //[{'header': 1}, {'header': 2}],
              [{'list': 'ordered'}, {'list': 'bullet'}],
              //[{ 'script': 'sub' }, { 'script': 'super' }],
              //[{'indent': '-1'}, {'indent': '+1'}],
              //[{ 'direction': 'rtl' }],

              //[{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              //[{'color': []}, {'background': []}],
              //[{ 'font': [] }],
              //[{'align': []}],
              //['clean'],
              [ 'image', 'video'],
              [{'size': ['small', false, 'large', 'huge']}],
              //['image', 'video']
            ]
          },
          placeholder: '在此编辑文章...',
          readOnly: false
        },
      }
    },
    methods: {
      onEditorBlur: function (editor) {

      },
      onEditorFocus: function (editor) {

      },
      onEditorReady: function (editor) {

      }
    },
    updated:function () {
      this.$nextTick(function () {
        $('.ql-editor').height($(window).height()-$('.writeArticle_header').height()-$('.inputTitle').height()-$('.ql-toolbar').height()-40)
      })
    }
  }
</script>
<style scoped>
  /*@import '../../assets/quill-editor/quillEditor.css';*/
  @import 'https://cdn.quilljs.com/1.3.4/quill.snow.css';
</style>
<style scoped lang="less" type="text/less">
  .writeArticle_header {
    width: 100%;
    height: 90/32rem;
    border-bottom: 1/32rem solid #e5e5e5;
    position: fixed;
    top: 0;
    left: 0;
    background-color: #fff;
    z-index: 1;
    .cancelBtn{
      width: 90/32rem;
      height: 90/32rem;
      line-height: 90/32rem;
      text-align: center;
      font-size: 24/32rem;
      position: absolute;
      top: 0;
      left: 0;
    }
    .changeBts{
      width: 100%;
      height: 90/32rem;
      line-height: 90/32rem;
      text-align: center;
      font-size: 0;
      a{
        display: inline-block;
        border: 1/32rem solid #9172fa;
        color: #9172fa;
        height: 50/32rem;
        line-height: 50/32rem;
        padding: 0 30/32rem;
        font-size: 24/32rem;
        vertical-align: middle;
        &:nth-of-type(1){
          -webkit-border-radius: 8/32rem 0 0 8/32rem;
          -moz-border-radius: 8/32rem 0 0 8/32rem;
          border-radius: 8/32rem 0 0 8/32rem;
        }
        &:nth-of-type(2){
          -webkit-border-radius: 0 8/32rem 8/32rem 0;
          -moz-border-radius: 0 8/32rem 8/32rem 0;
          border-radius: 0 8/32rem 8/32rem 0;
        }
        &.active{
          background-color: #9172fa;
          color: #ffffff;
        }
      }
    }
    .previewBtn{
      width: 90/32rem;
      height: 90/32rem;
      line-height: 90/32rem;
      text-align: center;
      font-size: 24/32rem;
      position: absolute;
      top: 0;
      right: 0;
    }
  }
  .inputTitle{
    width: 100%;
    padding: 0 10/32rem;
    position: fixed;
    top: 90/32rem;
    left: 0;
    z-index: 1;
    input{
      width: 100%;
      height: 70/32rem;
      outline: none;
      border-bottom: 1/32rem solid #e5e5e5;
      font-size: 28/32rem;
      padding-left: 20/32rem;
      font-weight: 700;
      color: #333333;
    }
  }
  .quill-editor-box{
    position: fixed;
    top: 160/32rem;
    left: 0;
    width: 100%;
    height: 100%;
  }
  /deep/.quill-editor{
    .ql-container{
      .ql-editor{
        -webkit-user-select:text;
      }
    }
  }

  /deep/.ql-toolbar.ql-snow{
    border: 0!important;
    .ql-formats{
      margin-right: 0;
      margin-top: 10/32rem;
      margin-bottom: 10/32rem;
      button{
        padding: 0;
        width: 66/32rem;
        text-align: center;
        svg{
          float: none;
        }
      }
    }
    .ql-color-picker {
      .ql-picker-label{
        padding: 0;
      }
    }
    .ql-icon-picker {
      .ql-picker-label{
        padding: 0;
      }
    }
    .ql-picker{
      font-size: 36/32rem;
      font-weight: 700;
    }
  }

  /deep/.ql-container.ql-snow{
    border: 0!important;
  }
</style>
