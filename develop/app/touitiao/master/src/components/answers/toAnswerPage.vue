<template>
  <div>
    <div class="writeArticle_header">
      <a href="javascript:;" class="cancelBtn" @click="cancelEdit">取消</a>
      <a href="javascript:;" class="submitBtn" @click="submitAnswer">提交</a>
    </div>
    <div class="inputTitle">
      <input type="text" v-model="articleTitle">
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
  import qs from 'qs'
  import {Toast} from 'mint-ui'
  import { MessageBox } from 'mint-ui'
  export default {
    components: {
      quillEditor
    },
    data: function () {
      return {
        content: '',
        questionInfo:'',
        articleId:'',
        articleTitle:'',
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
    created:function () {
      this.questionInfo = JSON.parse(sessionStorage.getItem('questionInfo'));
      this.articleId= this.questionInfo.articleId;
      this.articleTitle = this.questionInfo.articleTitle
    },
    methods: {
      onEditorBlur: function (editor) {

      },
      onEditorFocus: function (editor) {

      },
      onEditorReady: function (editor) {

      },
      submitAnswer:function () {
        if(this.content===''){
          Toast('请输入回答内容！');
          return
        }
        var url = '/zxcity_restful/ws/rest';
        var data = {
          cmd:'cms_new/publishAnswer',
          data:JSON.stringify({
            "is_draft": "0",
            "channelId": this.questionInfo.channelId,
            "releaseCity": sessionStorage.getItem('cityCode'),
            "typeCode": 1006,
            "label": this.questionInfo.label,
            "subscriptionId": sessionStorage.getItem('subscriptionId'),
            "releaseProvince": sessionStorage.getItem('cityCode').substr(0,2),
            "previewImgType": 1,
            "articleContent": this.content,
            "releaseId": sessionStorage.getItem('userId'),
            "articleTitle":'',
            "scCmsResourcesList": [],
            "hasAdvertisement": "0",
            "releaseType": sessionStorage.getItem('subscriptionType'),
            "scCmsAnswer": {
              "scCmsAnswerUserId": sessionStorage.getItem('userId'),
              "scCmsQuestionArticleId": this.questionInfo.articleId
            }
          })
        };
        this.$axios.post(url,qs.stringify(data)).then((res)=>{
          if(res.data.code!==1){
            Toast(res.data.msg);
            return
          }
          Toast(res.data.msg);
          this.$router.go(-1);
          sessionStorage.removeItem('questionInfo')
        })
      },
      cancelEdit:function () {
        MessageBox({
          title: '提示',
          message: '确定放弃编辑?',
          showCancelButton: true
        }).then((action)=>{
          if(action === 'confirm'){
            this.$router.go(-1);
            sessionStorage.removeItem('questionInfo')
          }
        });
      }
    },
    mounted:function () {
      this.$nextTick(function () {
        $('.ql-editor').height($(window).height()-$('.writeArticle_header').height()-$('.inputTitle').height()-$('.ql-toolbar').height()-40)
      })
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
    .submitBtn{
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
