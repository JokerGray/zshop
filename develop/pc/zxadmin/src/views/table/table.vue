<template>
<div id='table_init'>
  <el-form :inline='true' :model='formInline' class='demo-form-inline'>
    <el-form-item label='入职时间:'>
      <el-date-picker v-model='formInline.value1' type='date' placeholder='请选择日期'>
      </el-date-picker>
    </el-form-item>
    <el-form-item label='姓名:'>
      <el-input v-model='formInline.user' placeholder='请输入姓名'></el-input>
    </el-form-item>
    <el-form-item label='部门:'>
      <el-select v-model='formInline.region' placeholder='请选择部门'>
        <el-option label='研发' value='0'></el-option>
        <el-option label='销售' value='1'></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label='职位:'>
      <el-select v-model='formInline.position' placeholder='请选择职位'>
        <el-option label='项目经理' value='0'></el-option>
        <el-option label='程序员' value='1'></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type='primary' @click='submit'>查询</el-button>
    </el-form-item>
    <el-form-item>
      <el-button type='primary' @click='reseting'>重置</el-button>
    </el-form-item>
  </el-form>
  <el-table :data='tableData' id="table">
    <el-table-column prop='createDatetime' label='操作时间' width='250'></el-table-column>
    <el-table-column prop='orgName' label='姓名' width='250'></el-table-column>
    <el-table-column prop='phone' label='部门' width='250'></el-table-column>
    <el-table-column prop='usercode' label='职位' width='250'></el-table-column>
    <el-table-column prop='provinceId' label='操作模块' width='250'></el-table-column>
    <el-table-column prop='isdel' label='操作记录' width='250'></el-table-column>
  </el-table>
  <el-pagination @size-change= 'handleSizeChange'
  @current-change= 'handleCurrentChange'
  :current-page= 'currentPage'
  :page-sizes= '[15,20]'
  :page-size= 'pagesize'
  layout= 'total,sizes,prev,pager,next,jumper'
  :total= 'total' id='page'></el-pagination>
</div>
</template>

<script>
import api from '../../api/index.js';
export default {
  data() {
    return {
      formInline: {
        value1: '',
        user: '',
        region: '',
        position: ''
      },
      tableData: [],
      currentPage: 1,
      pagesize: 15,
      total: Number('')
    };
  },
  methods: {
    handleSizeChange(pagesize) {
      this.pagesize = pagesize;
      this.tableInit();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.tableInit();
    },
    tableInit() {
      // 列表查询
      let parm = {
        rows: this.pagesize,
        page: this.currentPage,
        phone: this.formInline.region || '',
        orgName: this.formInline.user || ''
      };
      api.tableAxios('operations/findScBackUserPageList', parm).then(res => {
        this.tableData = res.data.data;
        this.total = res.data.total;
      });
    },
    submit() {
      this.currentPage = 1;
      this.tableInit();
    },
    reseting() {
      this.formInline.region = '';
      this.formInline.user = '';
      this.currentPage = 1;
      this.tableInit();
    }
  },
  mounted() {
    this.tableInit();
  }
};
</script>

<style scoped lang='scss'>
#table_init {
  padding: 50px 50px 50px 100px;
  form {
    padding-left: 90px;
  }
  #table {
    width: 90%;
    margin: 0 auto;
  }
}
#page {
  float: right;
  padding-top: 30px;
}
</style>
