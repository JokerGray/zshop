<template>
    <div class="upload avatar-uploader" @click="upload">
        <input type="file" id="upload" @change="doUpload"/>
        <img :src="url" alt="" v-if="url" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </div>
</template>
<script>
/* eslint-disable */
import axios from 'axios'
import {doUpload,random_string} from '../../assets/js/upload.js'
export default {
  name: "upload",
  data() {
    return {
      imageUrl: '',
      percentage: 0,
      url: "",
    //   urls: [],
    };
  },
  methods: {
    upload(){
        $('#upload').trigger('click');
    },
    doUpload() {
        doUpload()
    }
  },
  // watch: {
  //   url(val) {
  //     if (val) {
  //       this.urls.push(val);
  //     }
  //   }
  // }
};
</script>
<style scoped>
.line{
    text-align: center;
}
.avatar-uploader{
    width: 178px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader:hover{
border-color: #409EFF;
}
.avatar-uploader-icon{
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}
.avatar{
    width: 178px;
    height: 178px;
    display: block;
}
#upload{
    display: none;
}
</style>

