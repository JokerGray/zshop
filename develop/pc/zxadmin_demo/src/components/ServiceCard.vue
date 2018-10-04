<template>
  <div class="thecontent">
    <div class="rightPart">
      <p class="top-title" style="border-bottom: 1px solid gainsboro">
        <span>服务录入/</span>
        <span>录入详情</span>
      </p>
      <div class="service-form">
        <el-form ref="form" :model="form" label-width="150px">
          <el-col :span="16">
            <el-form-item label="服务名称：">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="服务分组：">
              <el-col :span="20">
                <el-input v-model="form.group" style="margin-left: -2px;"></el-input>
              </el-col>
              <el-col class="line" :span="4"  style="color: #606266;text-align: right;cursor: pointer" >新建分组</el-col>
            </el-form-item>
            <el-form-item label="所属店铺：">
              <el-input v-model="form.belongs"></el-input>
            </el-form-item>
            <el-form-item label="服务单价：">
              <el-col :span="8">
                <el-input v-model="form.price"  style="margin-left: -2px;"></el-input>
              </el-col>
              <el-col class="line" :span="2"  style="color: #606266;padding-left: 5px"> 元</el-col>
              <el-col class="line" :span="3"  style="color: #606266;">业绩类型: </el-col>
              <el-col :span="8">
                <el-select v-model="form.effortType" placeholder="请选择业绩类型">
                  <el-option label="固定" value="guding"></el-option>
                  <el-option label="浮动" value="fudong"></el-option>
                </el-select>
              </el-col>
              <el-col class="line" :span="2" style="color: #606266"> 元</el-col>
            </el-form-item>
            <el-form-item label="店铺手工费：">
              <el-col :span="8">
                <el-input v-model="form.shopfee" style="margin-left: -2px;"></el-input>
              </el-col>
              <el-col class="line" :span="2"  style="color: #606266;padding-left: 5px"> 元</el-col>
              <el-col class="line" :span="3"  style="color: #606266">员工手工费: </el-col>
              <el-col :span="8">
                <el-input v-model="form.employeerfee"></el-input>
              </el-col>
              <el-col class="line" :span="2" style="color: #606266;padding-left: 5px"> 元</el-col>
            </el-form-item>
            <el-form-item label="服务销售状态：">
              <el-radio-group v-model="form.saleType">
                <el-radio label="正常"></el-radio>
                <el-radio label="隐藏"></el-radio>
                <el-radio label="停售"></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="打包成卡：">
              <el-col :span="8">
                <i class="el-icon-sold-out" style="font-size: 30px;color: #606266;cursor: pointer"></i>
              </el-col>
            </el-form-item>
            <el-form-item label="上传轮播图/视频：">
              <el-radio-group v-model="form.uploadimage">
                <el-radio label="是"></el-radio>
                <el-radio label="否"></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="轮播图设置：">
              <el-upload
                class="avatar-uploader"
                action="https://jsonplaceholder.typicode.com/posts/"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="视频设置：">
              <el-upload
                class="avatar-uploader"
                action="https://jsonplaceholder.typicode.com/posts/"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">确定</el-button>
              <el-button>取消</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="服务图片：">
              <el-upload
                class="avatar-uploader"
                action="https://jsonplaceholder.typicode.com/posts/"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-form>
      </div>
    </div>
  </div>
</template>

<style>
  .thecontent{
    margin-top: 60px;
    background: white;
    border-top-left-radius: 10px;
  }
  .rightPart{
    padding: 20px;
  }
  .rightPart .top-title{
    padding: 20px 0;
    margin-bottom: 20px;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>

<script type="text/ecmascript-6">
  export default {
    data () {
      return {
        input21: '',
        form: {
          name: '',
          group: '',
          belongs: '',
          price: '',
          effortType: '',
          shopfee: '',
          employeerfee: '',
          saleType: '',
          uploadimage: ''
        },
        imageUrl: ''
      }
    },
    methods: {
      onSubmit () {
        console.log('submit!')
      },
      handleAvatarSuccess (res,file) {
        this.imageUrl = URL.createObjectURL(file.raw)
      },
      beforeAvatarUpload (file) {
        const isJPG = file.type === 'image/jpeg'
        const isLt2M = file.size / 1024 / 1024 < 2

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
        }
        return isJPG && isLt2M;
      },
    }
  };
</script>
