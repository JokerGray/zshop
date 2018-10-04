<template>
    <section>
        <serviceEntry v-if="showCardForm" @setCardForm="setCardForm" @showServiceForm="showServiceForm" @addService="addService"></serviceEntry>
        <el-container v-if="!showCardForm">
            <el-aside width="200px">
                <div class="menuTop">
                    <serviceMenu class="menuList"></serviceMenu>
                </div>
            </el-aside>
            <el-container class="mid-content">
                <el-main>
                    <div class="menus" ref="menus">
                        <div class="menu-content active" @click="menuIndex = 0">
                            <div class="num">21</div>
                            <div class="text">服务</div>
                        </div>
                        <div class="menu-content" @click="menuIndex = 1">
                            <div class="num">01</div>
                            <div class="text">卡项</div>
                        </div>
                        <div class="btn-content" v-if="menuIndex == 0">
                            <el-button type="primary" round @click.native="showCardForm = true">录入服务</el-button>
                            <el-button round class="plain">新增分类</el-button>
                        </div>
                    </div>
                    <div class="category-content">
                        <span>所有服务</span>
                        <span>隐藏服务</span>
                    </div>
                    <ServiceList v-if="menuIndex == 0" :serviceData="serviceData"></ServiceList>
                    <CardList v-if="menuIndex == 1" :serviceData="serviceData"></CardList>
                </el-main>
            </el-container>
        </el-container>
    </section>
</template>
<script>
import serviceMenu from './serviceMenu.vue'
import ServiceList from './ServiceList.vue'
import CardList from './CardList.vue'
import CardForm from './CardForm.vue'
import serviceEntry from '../components/serviceEntry.vue'

export default {
  components: {
    serviceMenu,
    ServiceList,
    CardList,
    CardForm,
    serviceEntry
  },
  data () {
    return {
      firstTime: true,
      showCardForm: false,
      menuIndex: 0,
      serviceData: null
    }
  },
  methods: {
    setCardForm () {
      this.showCardForm = false
    },
    showServiceForm () {
      this.$emit('showServiceFormToParent')
    },
    addService (obj) {
        this.serviceData = obj
    }
  },
  watch: {
    menuIndex (val, oldVal) {
      var children = this.$refs.menus.children
      for (let i = 0; i < children.length; i++) {
          this.$refs.menus.children[i].classList.remove('active')
      }
      var activeItem = this.$refs.menus.children[val]
      activeItem.classList.add('active')
    }
  },
  mounted () {
    this.$on('toggleCardForm', () => {
      this.showCardForm = !this.showCardForm
    })
    if(localStorage.saved) {
        this.menuIndex = 1
        this.serviceData = JSON.parse(localStorage.data)
        localStorage.removeItem('saved');
        localStorage.removeItem('data');
    }
  }
}
</script>
<style scoped lang="scss">
section{
    // height: 100%;
}
.category-content{
    padding: 30px 0;
    border-bottom: 1px solid #eee;
    margin-bottom: 10px;

    >span{
        display: inline-block;
        width: 110px;
        margin-right: 20px;
        font-size: 18px;
        color: #999;
        &::before {
            content: '';
            display: inline-block;
            width: 24px;
            height: 24px;
            margin-right: 8px;
            background-image: url(./img/i-icon.png);
            background-position: 0 0;
            background-repeat: no-repeat;
            vertical-align: bottom;
        }
    }
    >span:nth-of-type(1){
        color: #00cfc0
    }
    >span:nth-of-type(2){
        &::before {
            background-position: -76px 0;
        }
    }
}
.menuTop{
    padding-top: 200px;
    height: 100%;
    box-sizing: border-box;

    .menuList{
        height: 100%;
        border-right: 1px solid #eee;
    }
}
.menus{
    .line{
        display: block;
        width: 110px;
        height: 5px;
        margin-top: 20px;
        background-color: #00cfc0;
    }
}
.menu-content{
    position: relative;
    display: inline-block;
    margin: 0 0 20px 30px;
    width: 110px;
    color: #999;
    text-align: left;
    border-right: 1px solid #efefef;
    cursor: pointer;
    &:first-of-type{
        margin-left: 0;
    }
    &:nth-of-type(2){
        border-right-color: transparent;
    }
    &::after{
        content: '';
        position: absolute;
        display: block;
        width: 110px;
        height: 5px;
        margin: 20px 0 0 0;
        background-color: transparent;
    }
    .num{
        font-size: 36px;
    }
    .text{
        font-size: 18px;
    }
    &.active{
        &::after{
            background-color: #00cfc0;
        }
        .num{
            color: #00cfc0;
        }
        .text{
            color: #333;
        }
    }
}
.btn-content{
    float: right;
    button{
        width: 155px;
        height: 48px;
        margin-top: 16px;
        background-color: #00cfc0;
        border-color: #00cfc0;
        font-size: 22px;
        border-radius: 48px;
        
        &.plain{
            background-color: transparent;
            color: #00cfc0;
        }
    }
}
</style>
<style>
.mid-content{
    min-width:1170px; 
    max-height: 100%;
    overflow: auto;
}
</style>
