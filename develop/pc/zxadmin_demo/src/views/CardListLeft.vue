<template>
  <el-row class="el_row" type="flex" justify="center" align="middle">
    <el-col>
      <ul class="el_row_ul">
        <li v-for="(list,index) in  lists" :class="{'active':ind === index}" @click="changeBgc(index)" :key="index">
          <a href="javascript:void(0)">{{list}}</a></li>
      </ul>
      <el-button icon="el-icon-search" round size="small" class="w145 m0a">搜索</el-button>
    </el-col>
  </el-row>
</template>

<script type="text/ecmascript-6">
export default {
  data () {
    return {
      lists: ['商品录入', '服务于卡项', '套餐录入', '套盒录入'],
      ind: 1
    }
  },
  methods: {
    changeBgc: function (index) {
      this.ind = index
    }
  },
  components: {}
}
</script>
<style scoped lang="scss" type="text/scss">
$blue: #3bbfce;
$C99: #999;
ul,
li {
  list-style: none;
}

a {
  text-decoration: none;
  color: $C99;
}
.w145 {
  width: 145px;
}
.m0a {
  margin: 0 auto;
  margin-left: 14px;
}
.el_row {
  height: 100%;
  &_ul {
    font-size: 20px;
    color: $C99;
    line-height: 64px;
    padding-left: 40px;
    a {
      padding-left: 22px;
      border-left: 4px solid transparent;
    }
    li.active a,
    a:hover {
      color: $blue;
      border-left: 4px solid $blue;
    }
  }
}
</style>
