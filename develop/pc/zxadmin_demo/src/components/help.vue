<template>
  <div class="help-content" id="order-list">
    <div class="top-title" style="padding-left: 20px">
      <h1>问题中心</h1>
      <ul class="problems">
        <li v-for="(str, index) in list[0]" :key="index">{{str}}</li>
      </ul>
    </div>

        <div class="call-center" style="text-align: center">
          <img src="../assets/callcenter.png" alt="">
          <p>客服电话：027-87313787</p>
        </div>

        <div class="gift" >
          <img src="../assets/gift.png" class="gift-img">
          <div class="gift-right-part">
            <h1>
              HI~这里有一份礼物！
            </h1>
            <p>
              智享后台市场调研
            </p>
          </div>
        </div>
        <div class="gift logo-tab" style="position: relative">
          <img src="../assets/zhiLogo.png" class="gift-img">
          <div class="gift-right-part">
            <h1>
              智大师手机客户端
            </h1>
            <p>
              用手机随时随地管理店铺
            </p>
          </div>

          <div class="bg-code">
            <img src="../assets/zhicode.png">
            <p style="color: white;margin: 0">智大师APP下载</p>
          </div>
        </div>
        <div class="recent-activity">
          <h1>近期活动</h1>
          <ul>
            <li>
              武汉课堂免费火热报名中！
            </li>
            <li style="margin: 10px 0">
              智扮！您的店铺可以貌美如花！
            </li>
            <li>
              美博会！智享产品的推广沃土。
            </li>
          </ul>
        </div>

        <el-dropdown class="menu-content">
          <el-button type="primary" placement="top-start">
            <i class="icon-man"></i>吴凡
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>花想美容美肤馆</el-dropdown-item>
            <el-dropdown-item>吴凡</el-dropdown-item>
            <el-dropdown-item divided>账号设置</el-dropdown-item>
            <el-dropdown-item>切换店铺</el-dropdown-item>
            <el-dropdown-item>退出登陆</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data () {
    return {
      info : {
        'one' : '" 隐藏服务 "分类是什么意思？',
        'two' : '服务卡与卡项录入常见问题',
        'three' : '怎么打包服务卡'
      },
      list: [
        ['"隐藏服务"分类是什么意思？', '服务卡与卡项录入常见问题', '怎么打包服务卡 ?'],
        ['浮动业绩、固定业绩是什么？', '什么是“合伙人”私人定制 ?'],
        ['云店是什么 ?', '如何设计云店轮播图 ?'],
      ],
      visible2: false
    }
  },
  // 实时监督路由变换
  watch: {
    '$route': function(to, from) {
      let arr = window.Object.assign(this.list);
      arr.sort((a, b) => {
        return Math.random() - 0.5
      });
      this.list = arr
		}
  }
};
</script>

<style scoped lang="scss">
ul{
  margin: 0;
  padding: 0;
  list-style: none;
}
.problems{
  >li{
    color: #333;
    line-height: 1.5;
    font-size: 16px;
  }
}
.help-content {
  position: relative;
  color: #606266;
  overflow-y: auto;
  height: 100%;
  padding-top: 160px;
  box-sizing: border-box;
}
.call-center {
  padding: 20px;
  background: white;
  margin: 20px 0;
}

.help-content .gift {
  padding: 20px;
  background: white;
  margin-bottom: 20px;
  .gift-img{
    margin-top: 10px;
  }
}
@keyframes wrapper-gradient {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(0);
  }
}
@keyframes img-gradient {
  0% {
    transform: translateY(100%);
  }
  100% {
    transform: translateY(0);
  }
}
.help-content .gift {
  position: relative;
  overflow: hidden;
}
.help-content .gift .bg-code {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  text-align: center;
  transform: translate3d(0, 100%, 0);
  transition: all 0.2s ease-out;
  img{
    position: absolute;
    left: 50%;
    top: 10px;
    transform: translate3d(-50%, 0, 0);
  }
  p{
    position: absolute;
    left: 0;
    bottom: 5px;
    width: 100%;
    text-align: center;
    font-size: 12px;
  }
}
.help-content .logo-tab{
  padding: 30px 20px;
}
.help-content .logo-tab:hover .bg-code {
  transform: translate3d(0, 0, 0);
}
.help-content .gift-img {
  width: 37px;
  height: 37px;
  float: left;
}
.gift-right-part {
  margin-left: 50px;
  color: #000;
  h1{
    font-size: 18px;
    margin: 0 0 5px 0;
  }
  p{
    margin: 0;
    font-size: 16px;
    color: #666;
  }
}
.menu-content {
  position: absolute;
  bottom: 0px;
  left: 0;
  width: 100%;
  color: white;
  text-align: center;
  cursor: pointer;
  >.el-button{
    width: 100%;
    background: #00ccc0;
    border-radius: 0;
    border-color: #00ccc0;
  }
}
.bottom-btn li {
  cursor: pointer;
  margin-bottom: 15px;
}
.recent-activity{
  padding: 0 0 45px 20px;
  margin: 0;
}
.icon-man{
  display: inline-block;
  width: 22px;
  height: 23px;
  background: url(../assets/icon-man.png) no-repeat;
  vertical-align: text-bottom;
  margin: 0 5px -2px 0;
}
</style>
