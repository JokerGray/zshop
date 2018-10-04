<template>
    <section>
        <div class="uploadImg">
            <el-dialog title="选择图片" :visible="dialogVisible"  width="930px" @close="toggle">
                <div class="upload">
                    <a href="javascript:;">本地照片上传
                        <input type="file" @change="getFile" ref="file" id="file" multiple="multiple">
                    </a>
                    <div class="img-container box">
                        <img :src="src" alt="">
                        <label for="file" id="changePic">画像変更</label>
                    </div>
                </div>
                <h3>推荐图片选择:</h3>
                <ul>
                    <li v-for="(item,index) in imgSrcs" :key='index'>
                        <img :src="item" alt="" @click="selecPic(item)">
                    </li>
                </ul>
                <img src="../assets/商品1.jpg" alt="" style="display:none">
                <img src="../assets/商品2.jpg" alt="" style="display:none">
                <img src="../assets/商品3.jpg" alt="" style="display:none">
                <img src="../assets/商品4.jpg" alt="" style="display:none">
                <img src="../assets/商品5.jpg" alt="" style="display:none">

                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="toggle">确 定</el-button><el-button @click="toggle">取 消</el-button>
                </span>
            </el-dialog>
        </div>
    </section>
</template>

<script>
export default {
  data() {
    return {
      src: "",
      imgSrcs: [
        "/static/img/商品1.c2e1094.jpg",
        "/static/img/商品2.f3e4968.jpg",
        "/static/img/商品3.9293d77.jpg",
        "/static/img/商品4.3343e45.jpg",
        "/static/img/商品5.6e6ce3f.jpg"
      ]
    };
  },
  props: {
    dialogVisible: Boolean
  },
  methods: {
    toggle() {
      this.$emit("hideDialog", true);
      this.$emit("hideDialog2", true);
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    getFile(e) {
      let _this = this;
      var files = e.target.files[0];
      if (!e || !window.FileReader) return;
      let reader = new FileReader();
      reader.readAsDataURL(files);
      reader.onloadend = function() {
        _this.src = this.result;
      };
    },
    selecPic(e) {
      this.src = e;
    }
  }
};
</script>

<style lang="scss">
.uploadImg {
  .el-dialog {
    margin-top: 80px !important;
  }
  .el-dialog__header {
    padding: 30px;
    .el-dialog__title {
      color: #333;
      font-size: 24px;
    }
    .el-dialog__headerbtn {
      top: 30px;
      right: 30px;
      font-size: 23px;
    }
  }
  .el-dialog__body {
    border-top: 1px solid #ececec;
    padding: 30px;
    .el-upload-list.el-upload-list--text {
      display: none;
    }

    a {
      position: relative;
      text-decoration: none;
      display: inline-block;
      font-size: 18px;
      padding: 11px 45px;
      color: #00ccc0;
      border: 1px solid #00ccc0;
      input#file {
        display: inline-block;
        position: absolute;
        z-index: 9;
        top: 0;
        left: 0;
        width: 200px;
        height: 48px;
        opacity: 0;
      }
    }
    .box {
      position: relative;
      margin: 30px auto;
      width: 298px;
      height: 298px;
      border: 1px solid #eee;
      img {
        width: 100%;
        height: 100%;
      }
      #changePic {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
      }
    }

    h3 {
      margin: 0;
      padding-bottom: 30px;
      font-size: 20px;
      color: #333;
      font-weight: normal;
    }
    ul {
      margin: 0;
      padding: 0;
      list-style: none;
      overflow: hidden;
      li {
        float: left;
        width: 148px;
        height: 148px;
        border: 1px solid #eee;
        margin: 0 15px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      li:first-of-type {
        margin-left: 0;
      }
      li:last-of-type {
        margin-right: 0;
      }
    }
  }
  .el-dialog__footer {
    padding: 0 30px 30px;
    .el-button {
      padding: 10px 24px !important;
      font-size: 18px;
      color: #fff;
      border: none;
      border-radius: 2px;
    }

    .el-button.el-button--primary {
      background: #00ccc0;
    }
    .el-button.el-button--default {
      margin-left: 30px;
      background: #999;
    }
  }
}
</style>




