<template>
  <section >
    <div class="container" ref="container">
      <!--标题选项-->
      <nav>
        <ul class="nav" @click="clickTab">
            <li :class="activeTab == 'day' ? 'active' : ''" id="day">今日</li>
            <li :class="activeTab == 'yesterday' ? 'active' : ''" id="yesterday">昨日</li>
            <li :class="activeTab == 'week' ? 'active' : ''" id="week">近7日</li>
            <li :class="activeTab == 'month' ? 'active' : ''" id="month">近30日</li>
        </ul>
        <div class="line"></div>
      </nav>
      <!--时间-->
      <div class="time">{{time}} <span v-if="time && time_" class="time-text">到</span> {{time_}}</div>
      <!--券使用次数和总收入-->
      <div class="info">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr><td><span class="circle times"></span></td><td>券被使用次数</td><td><span class="circle profit"></span></td><td>总收入</td></tr>
          <tr><td></td><td id="num"></td><td></td><td>¥ <span id="profit"></span></td></tr>
        </table>
      </div>
      <!--图表-->
      <div class="chart-content">
        <Chart id="chartContent" :chartData="chartData"></Chart>
      </div>
      
    </div>

    <!--列表数据-->
    <section ref="listContent" id="listContent" class="listContent">
      <div class="list info">
      
        <div class="list-content" v-for="item in profitList">
          <div class="title arrow-right" @click="getDetail(item)">分享【{{item.couponName}}】</div>
          <div class="content">
            <table border="0" cellspacing="0" cellpadding="0">
              <tr><td><span class="circle times"></span></td><td>券被使用次数</td><td><span class="circle profit"></span></td><td>总收入</td></tr>
              <tr><td></td><td>{{item.sharenum}}</td><td></td><td>¥ {{item.shareProfit}}</td></tr>
            </table>
          </div>
        </div>

        <mugen-scroll :handler="getshareProfitList" scroll-container="listContent" :shouldHandle="shouldHandle">
          <div class="loading text-center" v-if="loading">加载中··· <span class="circle-spin"></span></div>
        </mugen-scroll>

      </div>
    </section>

  </section>
</template>

<script>
import api from './api'
import Chart from './components/Chart'
import MugenScroll from 'vue-mugen-scroll'
var numAnim, profitAnim
export default {
  components: {
    Chart,
    MugenScroll
  },
  data () {
    return {
      activeTab: 'day',
      time: '',
      time_: '',
      num: '',
      profit: '',
      chartData: [],
      profitList: [],
      page: 1,        // 分页，默认第1页
      loading: false, // 是否显示loading样式
      shouldHandle: true   // 是否还需要加载数据
    }
  },
  watch: {
    num (val, oldVal) {
      numAnim = new window.CountUp(this.$el.querySelector('#num'), oldVal, val, 0, 1)
      numAnim.start()
    },
    profit (val, oldVal) {
      profitAnim = new window.CountUp(this.$el.querySelector('#profit'), oldVal, val, 2, 1)
      profitAnim.start()
    },
    // 每次改变选项，重置page和profitList，再取数据
    activeTab (val, oldVal) {
      this.page = 1
      this.profitList = []
      this.getShareReportForUser(val)
      this.getshareProfitList(val)
    }
  },
  methods: {
    // 点击时间tab，有动效，，并请求数据
    clickTab (e) {
      if (e.target.className === 'nav') return
      let id = e.target.id
      this.activeTab = id
      this.resetLine(id)
      this.setTime(id)
    },
    // 请求列表数据
    getShareReportForUser (dayType) {
      let shareUserId = window.getQueryString('shareUserId')
      let date = this.format(new Date())
      let _this = this
      if (window.spinner) window.spinner.spin(document.getElementById('chartContent'))
      api.getShareReportForUser(shareUserId, date, dayType).then(function (data) {
        if (window.spinner) window.spinner.stop()
        if (parseInt(data.code) === 1) {
          let obj = data['data']
          _this.chartData = obj['infoList']
          _this.num = obj['sumMun']
          _this.profit = obj['sumMoney']
        } else {
          alert(data.msg)
        }
      }).catch(function (err) {
        if (window.spinner) window.spinner.stop()
        console.log(err)
      })
    },
    // 请求分享票券数据
    // loading---调用数据前显示加载框，数据取完后关掉
    // shouldHandle---返回数量不足10，则没有下一页，不需要再刷新，除非查询时报错。不考虑又有了新数据的情况，因为实时性要求不高
    getshareProfitList (dayType) {
      if (!dayType) dayType = this.activeTab
      this.loading = true
      this.shouldHandle = false
      let _this = this
      api.getshareProfitList(window.getQueryString('shareUserId'), this.format(new Date()), dayType, this.page).then(function (data) {
        _this.loading = false
        if (parseInt(data.code) === 1) {
          _this.profitList = _this.profitList.concat(data['data'])
          _this.shouldHandle = !(data.data.length < 10)
          _this.page += (data.data.length < 10) ? 0 : 1
        } else {
          _this.shouldHandle = true
          alert(data.msg)
        }
      }).catch(function (err) {
        _this.shouldHandle = true
        _this.loading = false
        console.log(err)
      })
    },
    // 跳转到账单详细页面
    getDetail (item) {
      let shareUserId = window.getQueryString('shareUserId')
      item['shareUserId'] = shareUserId
      window.toDetailPage(item)
    },
    // 根据tab显示时间
    setTime (id) {
      let d = new Date()
      if (id === 'yesterday') {
        d = d.setDate(d.getDate() - 1)
        this.time = ''
        this.time_ = this.format(d)
      }
      if (id === 'week') {
        this.time = this.format(d)
        d = d.setDate(d.getDate() - 7)
        this.time_ = this.format(d)
      }
      if (id === 'month') {
        this.time = this.format(d)
        d = d.setDate(d.getDate() - 30)
        this.time_ = this.format(d)
      }
      if (id === 'day') {
        this.time = this.format(d)
        this.time_ = ''
      }
    },
    // 简易时间格式化
    format (d, fmt) {
      if (!fmt) fmt = 'yyyy-MM-dd'
      let date = new Date(d)
      if (date === 'Invalid Date') return ''
      let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
        'q+': Math.floor((date.getMonth() + 3) / 3),
        'S': date.getMilliseconds()
      }
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
      for (let k in o) if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
      return fmt
    },
    // 设置下划线的位置
    setLinePosition () {
      let line = this.$el.querySelector('.line')
      let tab = this.$el.querySelector(`#${this.activeTab}`)
      line.style.top = tab.offsetHeight * 5 / 6 + 'px'
      line.style.left = `${tab.offsetLeft}px`
      line.style.width = `${tab.offsetWidth}px`
    },
    // 更新重设下划线位置和大小
    resetLine (id) {
      let line = this.$el.querySelector('.line')
      let tab = this.$el.querySelector(`#${id}`)
      line.style.width = `${tab.offsetWidth}px`
      line.style.left = `${tab.offsetLeft}px`
    }
  },
  // 初始化时间，加载数据
  created () {
    this.time = this.format(new Date())
    this.getShareReportForUser(this.activeTab)
  },
  // 组件挂载后设置下划线并监听缩放事件
  mounted () {
    this.setLinePosition()
    window.addEventListener('resize', this.setLinePosition, false)
    // this.$refs.listContent.style.height = document.body.clientHeight - this.$refs.container.clientHeight + 'px'
  }
}
</script>

<style lang="scss">
@import './assets/mobile.css';
@function pxToRem($px, $base: 26) {
    @return ($px/$base) * 1rem;
}
html, body {
  height: 100%;
  text-align: center;
  overflow: hidden;
}
.container{
  display: block;
  padding-bottom: pxToRem(14);
  margin-bottom: pxToRem(6);
  box-shadow: 0 1px 6px #ccc;
}
// 顶栏选择时间的样式
.nav{
  list-style: none;
  display: flex;
  justify-content: space-between;
  color: #555555;
  background-color: #ffd600;
  font-size: pxToRem(30);
  padding: 0 pxToRem(10);
}
ul.nav li{
  display: inline-block;
  padding: pxToRem(20);
}
ul.nav li.active{
  font-weight: bold;
  color: #333333;
}
// 下划线样式
.line{
  position: absolute;
  display: inline-block;
  height: pxToRem(4);
  background-color: white;
  transition: all 0.2s ease-out;
}
// 时间展示
.time{
  display: block;
  color: #333333;
  background-color: #f6f6f6;
  font-size: pxToRem(28);
  height: pxToRem(72);
  line-height: pxToRem(72);
  font-weight: 500;
  padding: 0 pxToRem(30);
  text-align: left;
}
.time .time-text{
  padding: 0 pxToRem(5);
}
// 图表外框和图表
.chart-content{
  padding: pxToRem(10) pxToRem(30);
  height: pxToRem(300);
}
#chartContent{
  width: 100%;
  height: 100%;
}
// 券使用信息，上下通用
.info{
  padding: pxToRem(14) pxToRem(30);
  text-align: left;
  font-size: pxToRem(33);
}
.info table{
  width: 100%;
}
.info table td{
  height: pxToRem(33);
  line-height: pxToRem(33);
  padding: pxToRem(12) 0
}
.info tr td:nth-child(even){
  width: 50%;
}
// 小圆点
.info .circle{
  display: inline-block;
  border-radius: 100%;
  height: pxToRem(33);
  width: pxToRem(33);
  vertical-align: middle;
  margin-right: pxToRem(33);
}
.circle.times{
  background-color: #ffd600;
}
.circle.profit{
  background-color: #ff7733;
}
.listContent{
  overflow-y: auto;
}
// 券列表
.list{
  padding:0 0 pxToRem(20);
}
.list-content{
  padding-left: pxToRem(30);
  border-top: pxToRem(20) solid #f6f6f6;
  background-color: white;
}
.list-content .title{
  border-bottom: 1px solid #dadada;
  font-size: pxToRem(33);
  color: #333333;
  text-align: left;
  font-weight: 500;
  height: pxToRem(90);
  line-height: pxToRem(90);
}
.arrow-right:after{
  content: '';
  display: inline-block;
  float: right;
  margin: pxToRem(35) pxToRem(36) 0 0;
  width: pxToRem(20);
  height: pxToRem(20);
  border-bottom: solid pxToRem(2) #999999;
  border-right: solid pxToRem(2) #999999;
  transform: rotate(-45deg);
}
.list-content .content{
  padding: pxToRem(15) 0;
}
.loading{
  padding-top: pxToRem(10);
  font-size: pxToRem(35);
  color: #666;
}
@keyframes circle-spin{
  100%{transform:rotate(360deg)}
}
.circle-spin{
  display: inline-block;
  width: pxToRem(35);
  height: pxToRem(35);
  vertical-align: bottom;
  border-width: pxToRem(5);
  border-style: solid;
  border-color: transparent #ccc #ccc;
  border-radius: 100%;
  animation: circle-spin 1s infinite linear;
}
</style>
