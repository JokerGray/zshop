<template>
    <div>
      <div class="ServiceForm">
      <!-- 顶部展示栏 -->
        <div class="nav">
          <div class="header">
             <el-row class="row1">
                <el-col :span="24">
                  <span class="Price"></span>
                  <span class="IMG"></span>
                  <span class="content">"追风冰点头疗"服务打包成卡</span>
                </el-col>
            </el-row>
        </div>
        <div class="banxin">
          <el-row>
            <el-col :span="2" class="title-one">打包服务:</el-col>
            <el-col :span="7" class="one">
                 <div class="input">{{serviceName}}</div>
            </el-col>
            <el-col :span="2" class="title-two">所属门店:</el-col>
            <el-col :span="7" class="two">
                <div class="input">{{storeNameName}}</div>
            </el-col>
          </el-row>
      </div>
      <div class="banxin bottom">
          <el-row>
            <el-col :span="2" class="title-three">所属分组:</el-col>
            <el-col :span="7" class="three">
                <div class="input">{{groupsNameName}}</div>
            </el-col>
          </el-row>
      </div>
     </div>
     <!-- 顶部展示栏end -->

      <div class="banxin infor">
        <el-row class="inForMation">基本信息</el-row>
      </div>

      <!-- form表单版心 -->
      <div class="banxin el-row1">
    <!-- form表单 -->
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
            <el-row class="basic-inForMation">
              <el-col :span="16">
                <el-col :span="10">
                  <el-row>
                    <el-col :span="20">
                        <el-form-item label="卡项类型 :">
                          <el-select v-model="value1" clearable placeholder="请选择">
                              <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                        </el-form-item>
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span="10">
                  <el-row>
                      <el-col :span="20">
                          <el-form-item label="打包次数 :" prop="name1">
                      <el-input v-model="ruleForm.name1" v-on:input="change" clearable><i slot="prefix" ref="kaxlx" class="el-input__icon el-icon-search">次</i></el-input>
                    </el-form-item>
                      </el-col>
                  </el-row>
                </el-col>
                  <el-col :span="19" class="el-row5">
                    <el-form-item label="卡项名称 :" prop="name">
                      <el-col :span="23" class="four">
                         <el-input v-model="ruleForm.name"  clearable></el-input>
                      </el-col>
                    </el-form-item>
                  </el-col>
              </el-col>
      
              <el-col :span="6">
                <el-col :span="8">*卡项图片 :</el-col>
                <el-col :span="16">
                    
                     <el-row class="upload-pic" >
                       <img class="auto" src="../views/img/商品1.jpg" alt="">
                       <a href="javascript:volid(0);" class="marg-auto">更换图片</a>
                     </el-row>
               </el-col>
              </el-col>
            </el-row>
            <el-row class="inForMation">金额与业绩</el-row>
            <el-row class="el-row2">
              <el-col :span="7">
                <el-row>
                  <el-col :span="19">
                    <el-form-item label="本卡价格 :" prop="name2">
                      <el-input v-model="ruleForm.name2" clearable><i slot="prefix" class="el-input__icon el-icon-search">￥</i></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="7">
                  <el-col :span="19">
                    <el-form-item label="业绩类型 :">
                          <el-select v-model="value2" clearable>
                          <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value"></el-option>
                          </el-select>
                    </el-form-item>
                  </el-col>
              </el-col>
            </el-row>
            <el-row class="el-row5">
              <el-col :span="7">
                <el-row>
                  <el-col :span="19">
                    <el-form-item label="业绩值 :" prop="name3">
                      <el-input v-model="ruleForm.name3" clearable><i slot="prefix" class="el-input__icon el-icon-search">￥</i></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <a class="x" href="javascript:volid(0)" ref="tabItem">设置金额即单次完成后收取的固定金额，计入员工业绩</a>
            <el-row class="border-botm">
              <el-button @click="show3 = !show3" v-on:click="xiala" class="padd0">
                <img ref="xiaLa" src="../views/img/trtangle.png" alt="">
              </el-button>
              <a href="javascript:volid(0)">&nbsp;《智享共享》"合伙人私人定制"&nbsp;设置</a>
               
              <el-popover
                placement="top"
                width="200"
                trigger="hover"
                content="店面特定项目范围内，由顾客指定一项店内仪器，手工等服务项目，包月包年包终身，每次服务需交额外手工费">
                <el-button slot="reference" class="padd0"><img src="../views/img/help.png"></el-button>
              </el-popover>
              
              <el-collapse-transition>
              <div v-show="show3">
                <div class="transition-box P-box">
                  <el-form-item label="顾客收费/次">
                      <el-input class="w-input" v-model="input1" clearable></el-input>
                    </el-form-item>
                    </div>
              </div>
            </el-collapse-transition>
            </el-row>
            <el-row class="banxin-bottom">
              <el-form-item  class="W">
                <el-button type="primary" @click="submitForm('ruleForm')" class="btn-w">确定</el-button>
                <el-button @click="resetForm('ruleForm')" class="btn-w">取消</el-button>
              </el-form-item>
            </el-row>
          </el-form>
      <!-- form表单-end -->
      </div>
      <!-- form表单版心end -->
    </div>
    </div>
</template>
<style>
.el-form-item__error{
      margin: 16px 0;
  font-size: 18px;
  color: #fe0000;
  font-family: "MicrosoftYaHei"
}
.ServiceForm .el-select-dropdown__item{
  font-size: 18px;
    padding: 0 32px;
}
.ServiceForm .el-button--primary {
    color: #fff;
    background-color: #00CBBF;
    border-color: #00CBBF;
}
.ServiceForm .border-botm{
        border-top: 1px solid #EEEEEE;
        padding-top: 30px;
    }
.ServiceForm .el-icon-search:before {
        content: "";
    }
.el-input__prefix {
      top: 1px;
        left: 1px;
    }
.ServiceForm .x{
  color: #999999 !important;
  display: block;
  margin-top: 50px;
  margin-left: -425px;
  margin-bottom: 30px;
  font-size: 18px;
}
.ServiceForm .jisuan{
        display: block;
        margin-top: 50px;
        margin-left: -390px;
        margin-bottom: 30px;
    }
.ServiceForm .el-form-item.is-success .el-input__inner{
        border:1px solid #00CBBF;
    }
.ServiceForm .el-icon-search{
        background-color: #DDDDDD;
    }
.ServiceForm .Hover-Img{
   transform: rotateZ(90deg);
    }
.ServiceForm .Hover-Img1{
   transform: rotateZ(0deg);
    }
.ServiceForm .padd0{
        transition: all .3s;
        padding: 0;
        margin-left: 20px;
        border: none;
    }
.ServiceForm .el-form-item__label{
        font-family: "MicrosoftYaHei";
        font-size: 18px;
        line-height: 48px;
        color: #333333;
    }
.ServiceForm .el-form-item.is-required .el-form-item__label:before{
        color: #333333;
    }
.ServiceForm .el-form-item{
        margin-bottom: 0px;
    }
.ServiceForm .el-input__inner{
        height: 48px;
        border-radius: 0px;
        text-align: center;
        font-family: "MicrosoftYaHei";
        font-size: 18px;
        color: #333333;
    }
.ServiceForm .el-form-item__content{
        height: 48px;
    }
.ServiceForm .el-message-box__content {
        text-align: center;
        font-size: 18px;
    }
.ServiceForm .el-message-box__header {
        padding-top: 50px;
    }
.ServiceForm [class*=" el-icon-"], [class^=el-icon-] {
        font-weight: 600;
            height: 46px;

    }
.ServiceForm .el-message-box__btns {
        padding: 40px;
        text-align: center;
    }
.ServiceForm .el-button--small {
        font-size: 18px;
}

</style>

<style scoped>

.P-box{
  margin-top:10px;
}
.w-input{
  width: 160px;
}
.transition-box {
    margin-bottom: 10px;
    width: 200px;
    height: 40px;
    border-radius: 4px;
    text-align: center;
    color: #fff;
    box-sizing: border-box;
    margin-right: 20px;
  }
.marg-auto{
    display: block;
    text-align:center;
    width: 100%;
    display: block;
}

.money{
  width: 30px;
  height: 100%;
  background-color: #DDDDDD;
}
.auto{
   width: 150px;
  height: 150px; 
  background-size: cover;
  border:1px solid #eee;
  display: block;
  margin: 0 auto;
  margin-bottom:20px;
}
.btn-w{
  width: 96px;
  height: 40px;
  float: left;
}
a{
  text-decoration: none;
    font-family: "MicrosoftYaHei";
    font-size: 18px;
    color: #00ccc0;
    text-align: center;
}
.W{
  margin:10px auto;
  display:block;
  width: 340px;
  height: 40px;
}
.nav{
  overflow: hidden;
  width: 100%;
  height: 100%;
  background-color: #f8f8f8;
}
  .bg-purple-dark {
    background: #99a9bf;
  }
  .Price{
    position: fixed;
    margin-left: -10px;
    width: 40px;
    height: 40px;
    display: inline-block;
    background-image: url(../views/img/back.png);
  }
  .IMG{
    margin-left: 100px;
    display: block;
    float: left;
    width: 72px;
    height: 72px;
    background-image: url(../views/img/small_pic.png)
  }
  .content{
    margin-left: 10px;
    height: 72px;
    float: left;
    display:block;
    font-size: 20px;
    line-height: 72px;
    font-family: "MicrosoftYaHei"
  }
  .bottom{
    margin-bottom: 30px;
  }
  .row1{
    margin-top: 10px;
  }
 .ServiceForm{
    width: 100%;
    height: 100%;
  }
  .banxin{
    margin-top: 10px;
    width: 80%;
    height: 100%;
    margin-left: 120px;
  }
  .title-one,.title-two,.title-three,.title-four{
    text-align: center;
    line-height: 48px;
    font-family:"MicrosoftYaHei";
    font-size: 18px;
    color: #666666;
  }
  .title-two{
    margin-left: 60px;
  }
  .one{
    height: 48px;
  }
  .one .input{
    width: 100%;
    display: inline-block;
    height: 100%;
    background-color: #EEEEEE;
    font-size: 18px;
    color: #666666;
    line-height: 48px;
    border: none;
    padding-left: 15px;
    font-family:"MicrosoftYaHei"
  }
  .two{
    height: 48px;
  }
  .two .input{
    display: inline-block;
    width: 100%;
    height: 100%;
    background-color: #EEEEEE;
    font-size: 18px;
    color: #666666;
    line-height: 48px;
    border: none;
    font-family:"MicrosoftYaHei";
    padding-left: 15px;
  }
  .three{
    height: 48px;
  }
  .three .input{
    display:inline-block;
    width: 100%;
    height: 100%;
    background-color: #EEEEEE;
    font-size: 18px;
    color: #666666;
    line-height: 48px;
    border: none;
    font-family:"MicrosoftYaHei";
    padding-left: 15px;
    
  }
  .infor{
    margin-top: 20px !important;
  }
  .inForMation{
    width: 100%;
    height: 30px;
    background-color: #EEEEEE;
    color: #333333;
    font-size:18px;
    line-height: 30px;
    border: none;
    font-family:"MicrosoftYaHei";
    font-weight:600;
    padding-left: 15px;
  }
  .basic-inForMation{
    width: 100%;
    height: 100%; 
  }
   
  .four{
    height: 48px;
  }
  .el-row1{
    margin-top: 30px;
  }
  .el-row2{
    margin-top: 30px;
  }
  .el-row5{
    margin-top: 55px;
  }
   
  .upload-pic{
    width: 160px;
    height: 160px;
    /* border: 1px solid #EEEEEE; */
    margin-left: 10px;
    margin-bottom: 45px;
  }
  .banxin-bottom{
    background-color: #f0f5f8;
    height: 60px;
    width: 100%;
    position: relative;
    left:0;
    bottom:0;
    margin-top: 30px;
  }
</style>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        disabled:false,
        serviceName: '追风冰点头疗',
        storeNameName: '武汉武昌沙湖美料总店',
         groupsNameName: '追风头道汤',
        show3: false,
        input1:'',
        options1: [{
          value: '1',
          label: '永久'
        }, {
          value: '2',
          label: '时长'
        }, {
          value: '3', 
          label: '次数'
        }],
        value1:'3',
        options2: [{
          value: '1',
          label: '固定业绩'
        }, {
          value: '2',
          label: '浮动业绩'
        }],
        value2: '1',
         ruleForm: {
          name: '',
          name1: '',
          name2: '',
          name3: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入卡项名称', trigger: 'blur' },
          ],
          name1: [
            { required: true, message: '请输入打包次数', trigger: 'blur' }
          ],
          name2: [
            { required: true, message: '请输入本卡价格', trigger: 'blur' }
          ],
          name3: [
            { required: true, message: '请输入业绩值', trigger: 'blur' }
          ]
        }
      };
    },
    watch: {
      value1 (val, oldVal) {
        if(this.value1==1){
            var str='永久卡'
                this.ruleForm.name=`【${this.serviceName}】 (${str})`;
                this.ruleForm.name1="∞";
                
                // console.log(parent);
                // parent.disabled=true;
                // this.$refs.kaxlx.attributes.disabled=true;

        }
        if(this.value1 !==3){
            this.$refs.kaxlx.innerHTML='月';
        }
        if(this.value1 ==3){
          this.$refs.kaxlx.innerHTML='次';
        }
      },
      value2(val,oldVal){
        if(this.value2==1){
            this.$refs.tabItem.innerHTML="设置金额即单次完成后收取的固定金额，计入员工业绩"
            this.$refs.tabItem.className='x'
             
        }
        if(this.value2==2){
            this.$refs.tabItem.innerHTML="计算公式：实际出售业绩÷卡项原价×业绩值=单次服务业绩"
            this.$refs.tabItem.className='jisuan'
        }
      }
    },
    methods: {
      xiala:function(){
        var bn=this.$refs.xiaLa.className
        if(bn =='Hover-Img'){
          this.$refs.xiaLa.className='Hover-Img1'
        }else{
          this.$refs.xiaLa.className='Hover-Img'
        }
      },
      change:function(){
            if(this.value1==2){
                var str='月卡'
                this.ruleForm.name=`【${this.serviceName}】 (${this.ruleForm.name1}${str})`;
            }
            if(this.value1==3){
                var str='次卡'
                this.ruleForm.name=`【${this.serviceName}】 (${this.ruleForm.name1}${str})`;
            }
        },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.$confirm('内容尚未保存, 是否离开此页面?', {
          cancelButtonText: '留下',
          confirmButtonText: '离开',
        }).then(() => {
          this.$message({
            type: 'success',
            message: '离开成功'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已放弃离开'
          });          
        });
      }
    }
  }
</script>
