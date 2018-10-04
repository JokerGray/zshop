<template>
    <section>
        <div class="main-content">
            <div class="header">
                <img class="icon-back" src="./img/back.png" @click="back" alt="">
                <div class="container">
                    <div class="description">
                        <img src="./img/small_pic.png" alt="">
                        <span>"追风冰点头疗" 服务打包成卡</span>
                    </div>
                    <el-form ref="data" :model="data" label-width="120px" class="dataForm">
                        <el-row class="data-content">
                            <el-col :span="12">
                                <el-form-item label="活动名称" class="dataItem">
                                    <el-input v-model="data.serviceName" :disabled="true"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="活动名称" class="dataItem">
                                    <el-input v-model="data.shop" :disabled="true"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="所属分组" class="dataItem">
                                    <el-input v-model="data.group" :disabled="true"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
            </div>

            <div class="main container">
                <div class="main-header">基本信息</div>
                <el-form :model="form" ref="form1" :rules="rules1" label-width="120px" class="dataForm">
                    <el-row class="data-content">
                        <el-col :span="12">
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="卡项类型：" class="dataItem marginBottom">
                                        <el-select v-model="form.cardType" placeholder="请选择卡项类型" @change="changeCardType">
                                            <el-option label="永久" value="1"></el-option>
                                            <el-option label="时长" value="2"></el-option>
                                            <el-option label="次数" value="3"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="打包次数：" prop="times" class="dataItem">
                                        <el-input v-model="form.times" :disabled="form.times == '∞'">
                                            <i slot="prefix" class="el-input__icon icon-money" ref="times"></i>
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="24">
                                    <el-form-item label="卡项名称：" prop="cardName" class="dataItem hasIcon">
                                        <el-input v-model="form.cardName"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="卡项图片：" class="dataItem">
                                <div class="mycard" @click="dialogVisible = true">
                                    <img src="../../assets/商品1.jpg">
                                    <p>更换图片</p>
                                </div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>

            <div class="main container">
                <div class="main-header">金额与业绩</div>
                <el-form ref="form2" :rules="rules2" :model="form" label-width="120px" class="dataForm">
                    <el-row class="data-content">
                        <el-col :span="12">
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="本卡金额：" prop="money" class="dataItem hasIcon">
                                        <el-input v-model="form.money">
                                            <i slot="prefix" class="el-input__icon icon-money"></i>
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="业绩类型：" class="dataItem">
                                        <el-select v-model="form.type" placeholder="请选择业绩类型" @change="changeType">
                                            <el-option label="固定业绩" value="1"></el-option>
                                            <el-option label="浮动业绩" value="2"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="24">
                                    <el-form-item label="业绩值：" prop="value" class="dataItem hasIcon">
                                        <el-input v-model="form.value">
                                            <i slot="prefix" class="el-input__icon icon-money"></i>
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="24">
                                    <el-form-item>
                                        <p ref="text" class="ach-text">{{form.text}}</p>
                                    </el-form-item>
                                </el-col>
                                
                            </el-row>
                        </el-col>
                    </el-row>
                </el-form>
            </div>

            <div class="main container">
                <el-collapse class="collapse-content">
                    <el-collapse-item name="1">
                        <template slot="title">
                            <div class="collapse-title">
                                <img src="./img/trtangle.png">
                                <span>《智享共享》 “合伙人私人定制” 设置</span>
                                <el-popover placement="top"  width="200" trigger="hover" content="店面特定项目范围内，由顾客指定一项店内仪器，手工等服务项目，包月包年包终身，每次服务需交额外手工费">
                                    <img slot="reference" src="./img/help.png">
                                </el-popover>
                            </div>
                        </template>
                        <el-row>
                            <el-col :span="8">
                                <el-form label-width="150px" class="dataItem">
                                    <el-form-item label="顾客收费/次：">
                                        <el-input></el-input>
                                    </el-form-item>
                                </el-form>
                            </el-col>
                        </el-row>
                    </el-collapse-item>
                </el-collapse>
            </div>
        </div>
        
        <div class="footer">
            <div class="container">
                <el-button class="btn-ensure" @click="submitForm">确定</el-button>
                <el-button class="btn-cancle" @click="cancel">取消</el-button>
            </div>
            <imgUpload :dialogVisible="dialogVisible" @hideDialog="dialogVisible = false"></imgUpload>
        </div>
    </section>
</template>

<script>
import imgUpload from "../../components/imgUpload";

export default {
    components: {
        imgUpload
    },
    data () {
        return {
            dialogVisible: false,
            data: {
                serviceName: '追风冰点头疗',
                shop: '武汉武昌美料沙湖总店',
                group: '追风头道汤'
            },
            form: {
                cardType: '永久',
                type: '固定类型',
                times: '∞',
                cardName: '【追风冰点头疗】(永久卡)',
                text: '设置金额即单次服务完成后收取的固定金额，计入员工业绩'
            },
            rules1: {
                times: [
                    { required: true, message: '请输入打包次数', trigger: 'blur' }
                ],
                cardName: [
                    { required: true, message: '请输入卡项名称', trigger: 'blur'}
                ]
            },
            rules2: {
                money: [
                    { required: true, message: '请输入本卡金额', trigger: 'blur' }
                ],
                value: [
                    { required: true, message: '请输入业绩值', trigger: 'blur' }
                ]
            }
        }
    },
    watch: {
        'form.times': function(val){
            this.changeCardType(this.form.cardType)
        }
    },
    methods: {
        back () {
            this.$router.replace('/entry/goods')
        },
        changeCardType (val) {
            if(val == 1){
                this.form.times = '∞'
            }
            let str = '永久卡';
            this.$refs.times.classList.toggle('icon-month', val == 2)
            this.$refs.times.classList.toggle('icon-times', val == 3)
            if(val == 2) {
                if (this.form.times == '∞') this.form.times = ''
                str = this.form.times % 12 == 0? (this.form.times/12 + '年卡'): (this.form.times+'月卡')
                if(!this.form.times) str = '月卡'
            }
            if(val == 3) {
                if (this.form.times == '∞') this.form.times = ''
                str = this.form.times + '次卡'
            }
            this.form.cardName = `【${this.data.serviceName}】(${str})`;
        },
        changeType (val) {
            this.$refs.text.classList.toggle('active', val == 2)
            let arr = ['设置金额即单词服务完成后收取的固定金额，计入员工业绩', '计算公式：实际出售业绩÷卡项原价×业绩值=单次服务业绩']
            this.form.text = arr[parseInt(val-1)];
        },
        submitForm () {
            let v1 = false
            let v2 = false
            this.$refs.form1.validate((valid) => {
                v1 = valid
            });
            this.$refs.form2.validate((valid) => {
                v2 = valid
            });
            if(v1 && v2) {
                let str = '永久';
                if(this.form.cardType == 2) str = '时长';
                if(this.form.cardType == 3) str = '次';
                localStorage.saved = 1
                localStorage.data = JSON.stringify({
                    serviceName: this.data.serviceName,
                    cardType: str + '卡',
                    times: this.form.times,
                    cardName: this.form.cardName,
                    money: this.form.money,
                    servicePrice: this.form.money,
                    unit: this.form.cardType == 2 ? '月': this.form.cardType == 3? '次': ''
                })
                this.$router.push('goods')
            }
        },
        cancel() {
            this.$router.push('goods')
        }
    }
}
</script>

<style scoped lang="scss">
section{
    position: relative;
    display: block;
    height: 100%;
    background-color: #fff;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
    box-shadow: 0 4px 8px 0px rgba(153, 153, 153, 0.5);
    .main-content{
        height: 100%;
        padding-bottom: 90px;
        overflow-y: scroll;
    }
}
.container{
    margin: 0 auto;
    max-width: 1190px;
}

.header{
    padding: 10px;
    background-color: #f8f8f8;

    .icon-back{
        display: inline-block;
        position: absolute;
        left: 0;
        top: 10px;
        cursor: pointer;
    }
    .description{
        padding-bottom: 20px;
        img{
            display: inline-block;
            vertical-align: middle;
        }
        span{
            display: inline-block;
            vertical-align: middle;
            font-size: 20px;
            color: #333;
        }
    }
}

.main{
    .main-header{
        padding: 0 20px;
        margin: 20px 0;
        height: 30px;
        color: #333;
        font-weight: bold;
        line-height: 30px;
        background-color: #eee;
    }
}
.marginBottom{
    margin-bottom: 30px;
}
.ach-text{
    white-space: nowrap;
    font-size: 18px;
    color: #999;
    margin: 0;
    line-height: 1;
    
    &.active{
        color: #00ccc0;
    }
}
.mycard{
    width: 160px;
    text-align: center;

    img{
        display: block;
        max-width: 100%;
    }
    p{
        margin: 10px 0 0 0;
        font-size: 18px;
        color: #00ccc0;
        line-height: 1;
    }
}

.collapse-content{
    margin-top: 20px;
    margin-bottom: 20px;
    padding-top: 10px;
    .collapse-title{
        img{
            display: inline-block;
            vertical-align: middle;
            transition: all 0.2s ease-in-out;
        }
        span{
            font-size: 18px;
            color: #00ccc0;
            vertical-align: middle;
        }
    }
    .is-active .collapse-title img{
        transform: rotate(90deg);
    }
}

.footer{
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    >div{
        background: #f0f5f8;
        text-align: center;
        padding: 20px;
        button{
            width: 96px;
        }
        .btn-ensure{
            padding: 10px;
            color: #fff;
            font-size: 18px;
            background-color: #00cbbf;
            border-color: #00cbbf;
        }
        .btn-cancle{
            padding: 10px;
            color: #999;
            font-size: 18px;
            background-color: #fff;
            border-color: #fff;
        }
    }
}


</style>

<style lang="scss">
.dataItem{
    .el-form-item__label{
        height: 48px;
        font-size: 18px;
        line-height: 48px;
    }
    .el-form-item__error{
        position: relative;
    }
    .el-input__inner{
        font-size: 18px;
        border-radius: 0;
        border-color: #eee;
        height: 48px;
        
        &:disabled{
            color: #666;
        }
    }
    &.hasIcon .el-input__inner{
        padding-left: 36px;
    }
    &.el-input__inner{
        border-color: #eee !important;
    }
    .icon-money::after{
        content: '￥';
        display: inline-block;
        font-style: normal;
        width: 25px;
        border: 1px solid transparent;
        height: 44px;
        font-size: 18px;
        background-color: #eee;
        margin: 1px 0 0 -4px;
        line-height: 46px;
        text-align: center;
    }
    .icon-month::after{
        content: '月';
    }
    .icon-times::after{
        content: '次';
    }
}
.el-collapse-item__header{
    border-bottom: none;
}
</style>
