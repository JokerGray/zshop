<template>
    <section>
      <div class="card">
        <div class="type-content">
          <span class="type">永久卡</span>
          <span><span class="money">12</span>次</span>
          <span class="line"></span>
          <span class="money">￥1998</span>
        </div>
        <div class="text-content">
          【引火归元】- 永久卡
        </div>
        <div class="menu">
          <div>编辑</div>
          <span></span>
          <div>删除</div>
        </div>
      </div>

      <div class="card">
        <div class="type-content">
          <span class="type">时长卡</span>
          <span><span class="money">24</span>月</span>
          <span class="line"></span>
          <span class="money">￥1998</span>
        </div>
        <div class="text-content">
          【引火归元】- 时长卡
        </div>
        <div class="menu">
          <div>编辑</div>
          <span></span>
          <div>删除</div>
        </div>
      </div>

      <div class="card">
        <div class="type-content">
          <span class="type">次卡</span>
          <span><span class="money">36</span>次</span>
          <span class="line"></span>
          <span class="money">￥1998</span>
        </div>
        <div class="text-content">
          【引火归元】- 次卡
        </div>
        <div class="menu">
          <div>编辑</div>
          <span></span>
          <div>删除</div>
        </div>
      </div>

      <div class="card" v-if="serviceData">
        <div class="type-content">
          <span class="type">{{serviceData.cardType}}</span>
          <span><span class="money">{{serviceData.times}}</span>{{serviceData.unit}}</span>
          <span class="line"></span>
          <span class="money">￥{{serviceData.money}}</span>
        </div>
        <div class="text-content">
          {{serviceData.cardName}}
        </div>
        <div class="menu">
          <div>编辑</div>
          <span></span>
          <div>删除</div>
        </div>
      </div>

    </section>
</template>

<script>
export default {
  components: {},
  props: {
    serviceData: Object
  }
}
</script>
<style scoped lang='scss'>
.card{
  position: relative;
  display: inline-block;
  min-width: 338px;
  min-height: 210px;
  padding: 20px;
  margin: 40px 2vw 0 0;
  border-radius: 10px;
  box-sizing: border-box;
  color: #e8f9ff;
  background: url(./img/card.png) no-repeat;
  overflow: hidden;

  .type-content{
    text-align: right;
    height: 100px;
    padding-top: 10px;
    .type{
      float: left;
      margin-top: -10px;
      width: 60px;
      height: 40px;
      line-height: 40px;
      font-size: 16px;
      text-align: center;
    }
    .money{
      font-size: 24px;
    }
    .line{
      display: inline-block;
      width: 1px;
      height: 24px;
      background-color: rgba($color: #ccc, $alpha: 0.85);
      margin: 0 5px;
      vertical-align: text-bottom;
    }
  }

  .text-content{
    font-size: 20px;
  }

  .menu{
    position: absolute;
    display: flex;
    height: 45px;
    width: 100%;
    bottom: 0;
    left: 0;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    background: rgba($color: #000, $alpha: 0.3);
    transform: translate3d(0, 100%, 0);
    transition: all 0.2s ease-in-out;
    
    >div{
      flex: 1;
      text-align: center;
      line-height: 45px;
      cursor: pointer;
    }
    >span{
      display: inline-block;
      width: 1px;
      background-color: #fff;
      margin: 10px 0;
    }
  }

  &:hover>.menu{
    transform: translate3d(0, 0, 0);
  }
}
</style>
