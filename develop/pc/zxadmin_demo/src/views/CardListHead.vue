<template>
  <div class='w100'>
    <el-tabs v-model='activeName' @tab-click='handleClick'>
      <el-tab-pane name='first'>
        <span slot='label' class='span_nomal active'>
          <i CLASS=''>21</i>
          <span>服务</span>
        </span>
        <!--<div class=''>-->
          <!--所有服务 隐藏服务-->
        <!--</div>-->
      </el-tab-pane>
      <el-tab-pane name='second '>
        <span slot='label' class='span_nomal'>
          <i CLASS=''>01</i>
          <span>卡项</span>
        </span>
        <!--<div>-->
          <!--所有服务 隐藏服务-->
        <!--</div>-->
      </el-tab-pane>
    </el-tabs>
    <div class='check_box'>
      <ul class='check_box_ul'>
        <li><i class='icon1'></i>所有服务</li>
        <li><i class='icon2'></i>隐藏服务</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeName: 'first'
    }
  },
  methods: {
    handleClick (tab, event) {
      console.log(tab, event)
    }
  }
}
</script>

<style lang='scss' type='text/scss'>
$c00: #00cfbf;
$c999: #999999;
$eff: #efefef;
ul,
li {
  list-style: none;
  padding: 0;
  margin: 0;
}

.w100 {
  margin-top: 16px;
  /*width: 100%;*/
}
.el-tabs__nav-wrap::after {
  background: none;
}
.el-tabs__active-bar {
  height: 5px;
  background-color: $c00;
}
.span_nomal {
  i {
    color: $c999;
    display: block;
    font-style: normal;
    font-size: 30px;
    font-weight: normal;
  }
  span {
    color: $c999;
    font-size: 16px;
  }
}
.is-active {
  i {
    color: $c00;
  }
  span {
    color: #000;
  }
}
.el-tabs__nav-wrap::after {
  height: 5px;
  background-color: transparent;
}
.el-tabs__item {
  height: 92px;
  width: 110px;
}
#tab-first::after {
  position: absolute;
  content: '';
  width: 1px;
  right: 0;
  top: 0;
  background: $eff;
  height: 66px;
}
.check_box {
  width: 100%;
  height: 104px;
  line-height: 104px;
  border-bottom: 2px solid #eeeeee;
  &_ul {
    i {
      display: inline-block;
      width: 24px;
      height: 24px;
      background: #000;
      background: url('./img/i-icon.png') no-repeat;
      vertical-align: middle;
      margin-right: 10px;
    }
    .icon1 {
      background-position: 0 0;
    }
    .icon2 {
      background-position: -76px 0;
    }
    li {
      cursor: pointer;
      color: $c999;
      width: 110px;
      float: left;
    }
  }
}
</style>
