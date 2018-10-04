<template>
    <section class="main">
      <el-card v-for="i in 9" :key="i">
            <div slot="header" class="clearfix">
                <span>员工录入</span>
                <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
            </div>
            <div v-for="o in 4" :key="o" class="text item">
                {{'列表内容 ' + o }}
            </div>
        </el-card>
    </section>
</template>
<script>
export default {}
</script>
<style scoped>
.main{
    height: 100%;
    padding: 20px;
    background-color: #fff;
    box-shadow: 0 4px 8px 0px rgba(153, 153, 153, 0.5);
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
    overflow: auto;
}
</style>
