/* eslint-disable */
import axios from "axios";
import api from "../../api";
function doUpload() {
  const _this = this;
  const urls = [];
  api.accessAxios().then(res => {
    console.log(res.data);
    const host = res.data.host+'/'+res.data.dir;
    const client = new OSS.Wrapper({
      accessKeyId: res.data.accessid,
      accessKeySecret: res.data.accessKeySecret,
      signature: res.data.signature,
      policy: res.data.policy,
    });
    _this.percentage = 0;
    const files = document.getElementById(_this.id);
    if (files.files) {
      const fileLen = document.getElementById(_this.id).files;
      let resultUpload = "";
      for (let i = 0; i < fileLen.length; i++) {
        const file = fileLen[i];
        // 随机命名
        let random_name =
          this.random_string(6) +
          "_" +
          new Date().getTime() +
          "." +
          file.name.split(".").pop();
        // 上传
        client
          .multipartUpload(random_name, file, {
            progress: function*(percentage, cpt) {
              // 上传进度
              _this.percentage = percentage;
            }
          })
          .then(results => {
            // 上传完成
            const url =
            host +'/'+ results.name;
            // _this.$store.dispatch("changeUrl", _this.url);
            _this.url = url;
            console.log(url);
          })
          .catch(err => {
            console.log(err);
          });
      }
    }
  }).catch(function(error){
      console.log(error);
  });
}

function random_string(len) {
  len = len || 32;
  var chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
  var maxPos = chars.length;
  var pwd = "";
  for (let i = 0; i < len; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}

export { doUpload, random_string };
