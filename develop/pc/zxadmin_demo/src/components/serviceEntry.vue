<template>
  <section ref="section" id="section">
    <div class="box">
      <div class="path">
        <span>服务录入/</span>
        <span>录入详情</span>
      </div>
      <div class="tabNav">
        <span class="active1">1.编辑基本信息</span>
        <span class="active2" @click="toCloudeSetting">2.云店相关设置</span>
      </div>
      <div class="baseInfo">
        <div class="title">基本信息</div>
        <div class="baseContent">
          <el-row>
            <el-col :span="16">
              <div class="form">
                <!--服务名称-->
                <el-row class="row">
                  <el-col :span="5">
                    <div class="alignRight" :class="{warning:serviceWarning === 1}">*服务名称：</div>
                  </el-col>
                  <el-col :span="13">
                    <el-input placeholder="60字以内" size="large" class="serviceName dataItem" :class="{warning:serviceWarning === 1}" v-model="serviceName"></el-input>
                    <span class="mustTips" v-html="serviceWarning === 1?'服务名称不能为空':''"></span>
                  </el-col>
                </el-row>
                <!--服务分组-->
                <el-row class="row noMargin">
                  <el-col :span="5">
                    <div class="alignRight">*服务分组：</div>
                  </el-col>
                  <el-col :span="13">
                    <el-select size="large" class="serviceGrouping" v-model="serviceGrouping">
                      <el-option label="默认" key="1" value="1"></el-option>
                      <el-option label="隐藏" key="2" value="2"></el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="6">
                    <el-row>
                      <span class="newGrouping">新建分组</span>
                      <el-popover
                        placement="top"
                        title=""
                        width="264"
                        trigger="hover"
                        popper-class="tips"
                        content="创建新的分类，并将当前录入的商品、服务归类在此分类下，一般用于同品牌或系列的商品/服务">
                        <el-button slot="reference" class="helpIcon el-icon-question"></el-button>
                      </el-popover>
                    </el-row>
                  </el-col>
                </el-row>
                <!--所属店铺-->
                <el-row class="row">
                  <el-col :span="5">
                    <div class="alignRight">*所属店铺：</div>
                  </el-col>
                  <el-col :span="13">
                    <el-input size="large" class="shopName dataItem" value="智能美肤馆沙湖总店" :disabled="true"></el-input>
                  </el-col>
                </el-row>
                <!--服务类型-->
                <el-row class="row">
                  <el-col :span="5">
                    <div class="alignRight">*服务类型：</div>
                  </el-col>
                  <el-col :span="13">
                    <el-select size="large" class="serviceType" v-model="serviceType">
                      <el-option label="标准" key="1" value="1"></el-option>
                      <el-option label="万能" key="2" value="2"></el-option>
                    </el-select>
                  </el-col>
                </el-row>
                <!--服务单价,手工费-->
                <el-row class="row">
                  <el-col :span="5">
                    <div class="alignRight" :class="{warning:priceWarning === 1}">*服务单价：</div>
                  </el-col>
                  <el-col :span="4">
                    <input type="text" class="servicePrice dataItem" :class="{wariningLine:priceWarning === 1}" v-model="servicePrice">
                  </el-col>
                  <el-col :span="4" :offset="1">
                    <div class="alignRight" :class="{warning:manualFeeWarning === 1}">*手工费：</div>
                  </el-col>
                  <el-col :span="4">
                    <input type="text" class="manualFee dataItem" :class="{wariningLine:manualFeeWarning === 1}" v-model="manualFee">
                  </el-col>
                </el-row>
                <!--服务单价，手工费未填提示-->
                <el-row class="row" style="margin-top:0">
                  <el-col :span="9" :offset="5" style="height: 49px;">
                    <div class="manualFeeTip" :class="{warning:priceWarning === 1}" v-show="priceWarning === 1">产品销售价不能为空</div>
                  </el-col>
                  <el-col :span="10">
                    <div class="manualFeeTip" :class="{warning:manualFeeWarning === 1}">如果该服务没有手工费请填“ 0 ”</div>
                  </el-col>
                </el-row>
                <!--服务销售状态-->
                <el-row class="row noMargin">
                  <el-col :span="5">
                    <div class="alignRight">*服务销售状态：</div>
                  </el-col>
                  <el-col :span="8">
                    <div class="serviceStatus">
                      <a href="javascript:;" :class="{active:salesStatusSelect === 1}">
                        <i class="radio" @click="salesStatus(1)"></i><span>正常</span>
                      </a>
                      <a href="javascript:;" :class="{active:salesStatusSelect === 0}">
                        <i class="radio" @click="salesStatus(0)"></i><span>停售</span>
                      </a>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="picture">
                <label class="warning-0">*服务图片：</label>
                <div class="addPicture" @click="open">
                  <span class="addIcon"></span>
                  <span class="addText">更换图片</span>
                </div>
                <!--<p>服务图片至少有一张</p>-->
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="packServiceCard">
        <a href="javascript:;" class="packBtn" :class="{'canClick':canClick === 1}" @click="openPackCard"></a>
        <transition name="fade">
          <div class="packTips" v-if="closeTip === 1">
            <p>该服务可以打包成服务卡哦！</p>
            <i class="closeIcon" @click="closeTips"></i>
          </div>
        </transition>
      </div>
      <div class="cloudShopSetting" ref="cloudShopSetting">
        <div class="cloudShopSettingTitle" ref="cloudShopSettingTitle">
          <span>云店相关设置</span>
          <el-popover
            placement="top"
            title=""
            width="264"
            trigger="hover"
            popper-class="tips"
            content="在此添加轮播图、视频后，智享城市的云店和智享店务可以看到对应的轮播图/视频。">
            <el-button slot="reference" class="helpIcon el-icon-question"></el-button>
          </el-popover>
        </div>
        <div class="banner-video-isshow">
          <label>轮播图/视频：</label>
          <div class="radio">
            <a href="javascript:;" :class="{active:isShowSetting}">
              <i class="radio-icon" @click="showSetting(true)"></i>
              <span>是</span>
            </a>
            <a href="javascript:;" :class="{active:!isShowSetting}">
              <i class="radio-icon" @click="showSetting(false)"></i>
              <span>否</span>
            </a>
          </div>
          <!--<span class="demoBtn">示例</span>-->
          <el-popover
            placement="top"
            width="340"
            popper-class="demoContent"
            trigger="click">
            <div class="top">
              <p>轮播图在《智享城市》APP商品展示示例：</p>
              <img src="../assets/bannerGIF.gif" alt="">
            </div>
            <div class="bottom">
              <p>视频在《智享城市》APP店铺首页展示示例：</p>
              <img src="../assets/huoguo.gif" alt="">
            </div>
            <div class="erCode"></div>
            <el-button slot="reference" popper-class="demoBtn" class="exampleBtn">示例</el-button>
          </el-popover>
        </div>
        <div class="settingContent" v-show="isShowSetting">
          <div class="bannerSettingBox">
            <label>轮播图设置：</label>
            <div class="bannerSetting">
              <div class="addPicBtn" @click="open">
                <a href="javascript:;" class="addIcon"></a>
                <span>+添加图片</span>
              </div>
            </div>
            <div class="bannerTips">最多上传6张，仅支持jpg、png，图片大小不超过20M</div>
          </div>
          <div class="videoSettingBox">
            <label>视频设置：</label>
            <div class="videoSetting">
              <div class="addPostBtn" @click="open">
                <a href="javascript:;" class="addIcon"></a>
                <span>+添加封面</span>
              </div>
              <div class="addVidoBtn">
                <a href="javascript:;" class="addIcon"></a>
                <span>+添加视频</span>
              </div>
              <div class="tipsBox" style="font-size: 18px;">
                <span>上传的图片大小不能超过10M</span>
                <span>上传的视频必须小于20M</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="btns">
      <a href="javascript:;" class="yes" @click="yes">确定</a>
      <a href="javascript:;" class="cancel" @click="cancle">取消</a>
    </div>

    <imgUpload :dialogVisible="dialogVisible" @hideDialog2="dialogVisible = false"></imgUpload>
  </section>
</template>

<script>
import imgUpload from "./imgUpload";

export default {
  components: {
    imgUpload
  },
  data() {
    return {
      serviceGrouping: '默认', //分组
      serviceType: '标准', //服务类型
      serviceWarning: 0, //服务名称未填提示
      priceWarning: 0, //服务价格未填提示
      manualFeeWarning: 0, //手工费未填 提示
      serviceName: "", //服务名称
      servicePrice: "", //服务价格
      manualFee: "", //手工费
      isShowSetting: false, //是否显示云店设置页面
      closeTip: 0, //打包服务卡按钮上的提示
      salesStatusSelect: 1, //销售服务状态选择
      dialogVisible: false
    };
  },
  methods: {
    open() {
      this.dialogVisible = true;
    },
    // 打包成卡
    openPackCard() {
      window.open('#/entry/packCard');
      // this.$router.push("packCard");
    },
    //确定按钮
    yes() {
      var c = true
      //判断服务名称是否为空，为空显示红色警告框
      if (this.serviceName === "") {
        this.serviceWarning = 1;
        c = false
      }
      //判断服务单价是否为空，为空显示红色警告框
      if (this.servicePrice === "") {
        this.priceWarning = 1;
        c = false
      }
      //判断手工费是否为空，为空显示红色警告框
      if (this.manualFee === "") {
        this.manualFeeWarning = 1;
        c = false
      }

      if(!c) return;
      this.$message({
        message: '保存成功！',
        type: 'success'
      });
      this.$emit('addService', {
        serviceName: this.serviceName,
        servicePrice: this.servicePrice
      });
      this.$emit("setCardForm", true);
    },
    // 取消返回上一页
    cancle() {
      this.$emit("setCardForm", true);
    },
    // 是否显示云店设置
    showSetting(val) {
      this.isShowSetting = val;
    },
    //关闭打包按钮上面的提示
    closeTips() {
      this.closeTip = 0;
    },
    //选择销售服务状态
    salesStatus(val) {
      this.salesStatusSelect = val;
    },
    // 点击顶部tab栏云店设置，显示云店设置页面，并滚动到顶部显示
    toCloudeSetting() {
      //显示云店设置页面
      this.isShowSetting = true;
      //获取需要滚动的距离
      let disdance =
        this.$refs.cloudShopSetting.offsetTop -
        document.querySelector(".path").offsetHeight;
      // 执行缓慢滚动
      let y = 0;
      let timer = setInterval(() => {
        if (y <= disdance) {
          y += 30;
          document.getElementById("section").scroll(0, y);
        } else {
          clearInterval(timer);
        }
      }, 15);
    }
  },
  watch: {
    serviceName: function(value, old) {
      if (value !== "") {
        this.serviceWarning = 0;
      }
    },
    servicePrice: function(value, old) {
      if (value !== "") {
        this.priceWarning = 0;
      }
    },
    manualFee: function(value, old) {
      if (value !== "") {
        this.manualFeeWarning = 0;
      }
    },
    canClick(value, old) {
      this.closeTip = value;
    }
  },
  mounted() {
    this.$nextTick(() => {
      document.getElementById("section").style.height =
        document.body.offsetHeight - 100 + "px";
    });
  },
  computed: {
    //当所有表单输入完成，打包服务卡按钮高亮
    canClick() {
      if (
        this.serviceName !== "" &&
        this.serviceGrouping !== "" &&
        this.serviceType !== "" &&
        this.servicePrice !== "" &&
        this.manualFee !== ""
      ) {
        return 1;
      } else {
        return 0;
      }
    }
  }
};
</script>

<style scoped lang="scss" type="text/scss">
.alignRight {
  text-align: right;
  height: 48px;
  line-height: 48px;
  font-size: 18px;
  color: #333;
  overflow: hidden;
}

#section {
  overflow-y: auto;
}

// 页头路径
.path {
  width: 100%;
  height: 90px;
  line-height: 90px;
  padding-left: 44px;
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #fff;
  z-index: 1;
  max-width: 100%;
  span {
    font-size: 18px;
    color: #333333;
    &:nth-of-type(1) {
      color: #00ccc0;
    }
  }
}

// tab栏
.tabNav {
  width: 100%;
  height: 30px;
  line-height: 30px;
  font-size: 0;
  padding: 0 44px;
  box-sizing: border-box;
  margin-top: 90px;
  span {
    display: inline-block;
    width: 50%;
    height: 100%;
    font-size: 16px;
    color: #333;
    text-align: center;
    background-color: #efefef;
    cursor: pointer;
    &.active1 {
      background-color: #00ccc0;
      color: #fff;
      position: relative;
      &::before {
        content: "";
        position: absolute;
        border-width: 15px;
        border-style: solid;
        border-color: transparent transparent transparent #00ccc0;
        right: -30px;
        top: 0;
      }
    }
  }
}

// 基本信息
.baseInfo {
  width: 100%;
  height: 100%;
  padding: 0 44px;
  margin-top: 20px;
  box-sizing: border-box;
  .title {
    width: 100%;
    height: 30px;
    line-height: 30px;
    font-size: 16px;
    color: #333;
    background-color: #eeeeee;
    padding-left: 20px;
    box-sizing: border-box;
  }
  .baseContent {
    width: 100%;
    height: 100%;
    margin-top: -10px;
    border-bottom: 2px solid #eee;
    padding-bottom: 30px;
    .form {
      width: 100%;
      .row {
        margin-top: 30px;
        font-size: 0;
        .serviceName {
          width: 100%;
          font-size: 18px;
          > .el-input__inner {
            height: 48px;
          }
        }
        .serviceGrouping {
          width: 100%;
          font-size: 18px;
        }
        .newGrouping {
          display: inline-block;
          height: 40px;
          line-height: 40px;
          font-size: 18px;
          color: #00cccc;
          margin: 0 6px;
        }
        .shopName {
          width: 100%;
          font-size: 18px;
        }
        .serviceType {
          width: 100%;
          font-size: 18px;
        }
        .servicePrice,
        .manualFee {
          width: 100%;
          height: 48px;
          outline: none;
          border: 1px solid #dcdfe6;
          box-sizing: border-box;
          background: url("../assets/money.fw.png") no-repeat 0 center;
          background-size: 30px 48px;
          padding-left: 40px;
          font-size: 18px;
          &.wariningLine {
            border-color: #fe0000;
          }
        }
        .manualFeeTip {
          width: 145.6%;
          height: 49px;
          line-height: 49px;
          font-size: 18px;
          color: #999;
        }
        .serviceStatus {
          width: 100%;
          height: 48px;
          line-height: 48px;
          margin-left: 10px;
          > a {
            text-decoration: none;
            margin-right: 20px;
            .radio {
              display: inline-block;
              width: 20px;
              height: 20px;
              background: url("../assets/select.fw.png") no-repeat center;
              background-size: 100%;
              vertical-align: middle;
              margin-right: 6px;
            }
            span {
              font-size: 18px;
              color: #999999;
              vertical-align: middle;
            }
            &.active {
              .radio {
                background: url("../assets/selected.fw.png") no-repeat center;
                background-size: 100%;
              }
              span {
                color: #333;
              }
            }
          }
        }
        .mustTips {
          display: inline-block;
          width: 100%;
          height: 49px;
          line-height: 49px;
          font-size: 18px;
          color: #fe0000;
        }
        .warning {
          color: #fe0000;
        }
      }
      .noMargin {
        margin-top: 0;
      }
    }
    .picture {
      width: 100%;
      margin-top: 30px;
      label {
        display: inline-block;
        font-size: 18px;
        color: #333;
      }
      .addPicture {
        display: inline-block;
        width: 160px;
        height: 160px;
        border: 1px solid #eee;
        vertical-align: top;
        text-align: center;
        padding-top: 26px;
        box-sizing: border-box;
        background: url(../assets/商品1.jpg) no-repeat;
        background-size: contain;

        .addIcon {
          display: inline-block;
          width: 68px;
          height: 60px;
        }
        .addText {
          display: block;
          width: 100%;
          text-align: center;
          font-size: 18px;
          color: #00ccc0;
          margin-top: 75px;
        }
      }
      p {
        width: 166px;
        font-size: 18px;
        color: #fe0000;
        margin: 10px 0 10px 100px;
      }
      .warning {
        color: #fe0000;
      }
    }
  }
}

//打包服务卡按钮
.packServiceCard {
  width: 100%;
  height: 108px;
  text-align: right;
  padding: 30px 44px;
  box-sizing: border-box;
  position: relative;
  a {
    display: inline-block;
    width: 206px;
    height: 48px;
    background: url("../assets/greybtn.png") no-repeat center;
    background-color: 100%;
    border-radius: 48px;
    &.canClick {
      background: url("../assets/btn.png") no-repeat center;
    }
  }
  .packTips {
    width: 278px;
    height: 90px;
    line-height: 90px;
    border: 1px solid #eee;
    background-color: #fff;
    position: absolute;
    top: -74px;
    right: 10px;
    p {
      margin: 0;
      text-align: center;
      font-size: 18px;
      color: #333;
    }
    .closeIcon {
      position: absolute;
      width: 15px;
      height: 15px;
      background: url("../assets/guanbi.png") no-repeat center;
      -webkit-background-size: 12px;
      background-size: 12px;
      top: 10px;
      right: 10px;
    }
    &::before {
      position: absolute;
      width: 12px;
      height: 12px;
      border-width: 1px;
      border-style: solid;
      border-color: transparent transparent #eee #eee;
      content: "";
      background-color: #fff;
      bottom: -8px;
      left: 50%;
      transform: rotate(-45deg);
      transform-origin: center;
    }
  }
}

//云店设置开关
.cloudShopSetting {
  padding: 0 44px 75px 44px;
  .cloudShopSettingTitle {
    box-sizing: border-box;
    width: 100%;
    height: 30px;
    line-height: 30px;
    background-color: #eee;
    padding-left: 20px;
    font-size: 18px;
    color: #333;
    i {
      color: #ccc;
      margin-left: 10px;
    }
  }
  .banner-video-isshow {
    padding-left: 34px;
    padding-top: 20px;
    margin-bottom: 20px;
    label {
      font-size: 18px;
      color: #333;
      vertical-align: middle;
    }
    .radio {
      display: inline-block;
      vertical-align: middle;
      margin-left: -10px;
      a {
        text-decoration: none;
        margin-left: 30px;
        .radio-icon {
          display: inline-block;
          width: 20px;
          height: 20px;
          background: url("../assets/select.fw.png") no-repeat center;
          background-size: 100%;
          vertical-align: middle;
          margin-right: 10px;
        }
        span {
          font-size: 18px;
          color: #999;
          vertical-align: middle;
        }
        &.active {
          .radio-icon {
            background: url("../assets/selected.fw.png") no-repeat center;
            background-size: 100%;
          }
          span {
            color: #333;
          }
        }
      }
    }
    .demoBtn {
      font-size: 18px;
      color: #00ccc0;
      vertical-align: middle;
      margin-left: 20px;
      cursor: pointer;
    }
  }
  .settingContent {
    width: 100%;
    height: 560px;
    font-size: 0;
    margin-top: 26px;
    padding-left: 42px;
    .bannerSettingBox {
      > label {
        display: inline-block;
        font-size: 18px;
        color: #333;
        vertical-align: top;
        text-align: right;
        padding-top: 10px;
      }
      .bannerSetting {
        display: inline-block;
        vertical-align: top;
        /*height: 160px;*/
        width: 81%;
        .addPicBtn {
          display: inline-block;
          width: 160px;
          height: 160px;
          border: 2px solid #eee;
          box-sizing: border-box;
          text-align: center;
          margin: 6px 6px;
          .addIcon {
            display: inline-block;
            width: 68px;
            height: 60px;
            background: url("../assets/zhaopian.png") no-repeat center;
            -webkit-background-size: 100%;
            background-size: 100%;
            margin-top: 26px;
          }
          span {
            display: block;
            width: 100%;
            font-size: 18px;
            color: #00ccc0;
            margin-top: 24px;
          }
        }
      }
      .bannerTips {
        padding-left: 114px;
        font-size: 15px;
        color: #999;
        margin-top: 6px;
      }
    }
    .videoSettingBox {
      margin-top: 20px;
      > label {
        display: inline-block;
        font-size: 18px;
        color: #333;
        vertical-align: top;
        text-align: right;
        padding-top: 10px;
        padding-left: 18px;
      }
      .videoSetting {
        display: inline-block;
        vertical-align: top;
        width: 81%;
        .addPostBtn,
        .addVidoBtn {
          display: inline-block;
          width: 160px;
          height: 160px;
          border: 2px solid #eee;
          box-sizing: border-box;
          text-align: center;
          margin: 6px 6px;
          .addIcon {
            display: inline-block;
            width: 68px;
            height: 60px;
            background: url("../assets/zhaopian.png") no-repeat center;
            -webkit-background-size: 100%;
            background-size: 100%;
            margin-top: 26px;
          }
          span {
            display: block;
            width: 100%;
            font-size: 18px;
            color: #00ccc0;
            margin-top: 24px;
          }
        }
        .addVidoBtn {
          .addIcon {
            background: url("../assets/shipin.png");
          }
        }
        .tipsBox {
          span {
            display: inline-block;
            font-size: 15px;
            color: #999;
            width: 160px;
            margin: 0 6px;
          }
        }
      }
    }
  }
}

//确定和取消按钮
.btns {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 75px;
  line-height: 75px;
  text-align: center;
  background-color: #f0f5f8;
  font-size: 0;
  a {
    display: inline-block;
    width: 96px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 18px;
    text-decoration: none;
    margin: 0 10px;
    vertical-align: middle;
    &.yes {
      background-color: #00ccc0;
      color: #ffffff;
    }
    &.cancel {
      background-color: #fff;
      color: #999;
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
 {
  opacity: 0;
}
</style>
<style type="text/scss" lang="scss">
/*提示框样式*/
.tips {
  font-size: 16px;
  color: #333333;
}

/*示例弹框*/
.demoContent {
  .top {
    width: 100%;
    background-color: #fff;
    p {
      margin-top: 0;
      margin-bottom: 10px;
      font-size: 15px;
      color: #333;
    }
    img {
      width: 340px;
      max-width: 100%;
      vertical-align: middle;
    }
  }
  .bottom {
    background-color: #fff;
    p {
      margin-top: 10;
      margin-bottom: 10px;
      font-size: 15px;
      color: #333;
    }
    img {
      width: 340px;
      max-width: 100%;
      vertical-align: middle;
    }
  }
  .erCode {
    width: 84px;
    height: 84px;
    background: url("../assets/erweima.png") no-repeat center;
    -webkit-background-size: 100%;
    background-size: 100%;
    position: absolute;
    top: 0;
    right: -84px;
    border: 1px solid #eee;
  }
}
.exampleBtn {
  .el-input--large {
    .el-input__inner {
      height: 48px;
      -webkit-border-radius: 0;
      -moz-border-radius: 0;
      border-radius: 0;
      font-size: 18px;
      color: #333333;
    }
  }
  &:hover,&:active, &:focus{
    background-color: inherit;
  }
  &.el-button {
    border: none;
    span {
      color: #00ccc0;
      font-size: 18px;
      vertical-align: middle;
    }
  }
}

/*问号按钮*/
.helpIcon {
  width: 0px;
  height: 0px;
  border: none !important;
  padding: 0 !important;
  font-size: 16px !important;
  color: #bcbcbc !important;

  &.el-button:focus,
  .el-button:hover {
    color: #bcbcbc;
    background-color: #fff;
  }

  &.el-button {
    border: none;
    span {
      color: #00ccc0;
      font-size: 18px;
      vertical-align: middle;
    }
  }
}

.warning {
  .el-input__inner {
    border-color: #fe0000;
  }
}
input.el-input__inner{
  height: 48px;
  border-radius: 0;
}
</style>
