var zNodes = [];
var params;
var loading;
$(document).ready(function () {
    loading = layer.load(1, {
        shade: [0.1, '#fff'] //0.1透明度的白色背景
    });
    serviceInit();
    params = getParams();
    getInfo();
    getSelect(params);
});
//获取信息
function getInfo(shopId, subaccountId) {
    var cmd = "customer/serviceCardItemList";
    var datas = {
        merchantId: params.merchantId,
        id: params.id,
        shopId: shopId,
        subaccountId: subaccountId
    };
    ajaxAsync(cmd, datas, function (re) {
        if (re.code == 1) {
            layer.msg(re.msg);
            var businessList = [];
            if(re.data){
                if (re.data.serviceCardTLC){
                    var serviceCardTLC = re.data.serviceCardTLC;
                    for (var i = 0; i < serviceCardTLC.length; i++) {
                        businessList.push(serviceCardTLC[i]);
                    }
                }
                if (re.data.packageCardTLC){
                    var packageCardTLC = re.data.packageCardTLC;
                    for (var i = 0; i < packageCardTLC.length; i++) {
                        businessList.push(packageCardTLC[i]);
                    }
                }
            }
            refreshTable(businessList);
        } else {
            layer.msg(re.msg);
        }
    })
}

//加载下拉框
function getSelect(data) {
    var cmd = "customer/acconutAndShopInfo";
    var datas = {
        merchantId: data.merchantId,
        id: data.id
    };
    ajaxAsync(cmd, datas, function (re) {
        if (re.code == 1) {
            if (re.data.accountsInfo){
                var accountsInfo = re.data.accountsInfo;
                for (let i = 0; i < accountsInfo.length; i++) {
                    var optBox = `
                        <option class="" value="${accountsInfo[i].subaccountId}">${accountsInfo[i].accountName}</option>
                    `;
                    $('#account').append(optBox);
                }
            }
            if (re.data.shopList){
                var shopList = re.data.shopList;
                for (let i = 0; i < shopList.length; i++) {
                    var optBox = `
                        <option class="" value="${shopList[i].shopId}">${shopList[i].shopName}</option>
                    `;
                    $('#shop').append(optBox);
                }
            }
        } else {
            layer.msg(re.msg);
        }
    })
};
$('#searchTable').click(function () {
    var subaccountId = $('#account').val();
    var shopId = $('#shop').val();
    getInfo(shopId, subaccountId)
})
//刷新表格
function refreshTable(businessList) {
    if (businessList !== undefined){
        $('#serviceTable').bootstrapTable('load', businessList);
        var price = 0;
        for (var i = 0; i < businessList.length; i++) {
            price += Number(businessList[i].purchasePrice);
        }
        $('#serviceTable').append('<tr><td colspan="10" style="text-align:right;padding-right:30px;font-size:15px;">合计办卡消费：<font color="#ff3300">' + price.toFixed(2) + '</font>元</td></tr>');
    }
    layer.close(layer.loading);
    // $('#recordTable').bootstrapTable('load', consumeList);
}

//撤销之前消费的服务信息
function revokeConsumeRecord(subid, pchid, serid) {
    layer.confirm('确定撤销消费掉的服务卡吗?', function (index) {
        //do something
        $.ajax({
            type: "post",
            url: "revokeConsumeRecord.do",
            dataType: "json",
            data: {
                'subaccountId': subid,
                'purchaseId': pchid,
                'serviceId': serid
            },
            success: function (data) {
                if (data.result == 'succ') {
                    layer.alert('撤销成功!', function () {
                        location.reload();
                    });
                } else {
                    if (data.msg != null && data.msg != '' && data.msg != "") {
                        layer.alert(data.msg);
                    } else {
                        layer.alert("撤销失败");
                    }
                }

            }
        });

        layer.close(index);
    });
}

/**
 * 退掉购买的服务卡或套餐
 * @param purchaseId
 * @param subaccountId
 * @param consumeNum
 */
function returnPurchaseRecord(memberId, subaccountId, cardName, consumeNum) {
    if (consumeNum > 0) {
        layer.msg("此卡已消费，不能退卡。", { icon: 2 });
        return;
    }
    layer.confirm('确定退掉购买的服务卡吗?退卡之后，顾客账户不受影响，影响工作人员的业绩。', function (index) {
        var cmd = "customer/returnPurchaseRecord";
        var datas = {
            merchantId: params.merchantId,
            id: memberId,
            userId: params.userId,
            memberId: params.id,
            cardName: cardName,
            subaccountId: subaccountId
        };
        ajaxAsync(cmd, datas, function (re) {
            if (re.code == 1) {
                parent.layer.msg(re.msg);
                $('#searchTable').click();
                layer.close(index);
            } else {
                layer.msg(re.msg);
            }
        })
    });
}
//提示
function warnInfo(index) {
    if (index == 1) {
        layer.msg('服务卡已消费，不能退卡。', { icon: 2 });
    } else if (index == 2) {
        layer.msg('服务卡未使用或已使用完，不能销卡。', { icon: 2 });
    } else {
        layer.msg('服务卡未使用，不能撤销。', { icon: 2 });
    }
    return;
}

/**
 * 修改划卡次数（总数量为purchaseNum * packNumber）
 * @param purchaseId 划卡id
 * @param purchaseNum 购买数量
 * @param packNumber 打包数量
 * @param remainNum 剩余次数
 * @param consumeNum 消费次数
 */
function modifyPurchaseRecord(memberId, purchaseNum, packNumber, totalNum, consumeNum, subaccountId, cardName) {
    layer.open({
        type: 2,
        area: ['500px', '260px'],
        title: '修改卡项次数',
        maxmin: true, //开启最大化最小化按钮
        content: 'modifyPurchaseInit/modifyPurchaseInit.html?purchaseNum=' + purchaseNum + '&packNumber=' + packNumber + '&totalNum=' + totalNum + '&consumeNum=' + consumeNum,
        btn: ['确定', '关闭'],
        yes: function (index, layero) {
            var info = window["layui-layer-iframe" + index].callbackdata();
            if (info.purchaseNum.length <= 0){
                layer.msg('请填写购买数量！');
                return false
            }else{
                var cmd = "customer/modifyPurchaseNum";
                var datas = {
                    merchantId: params.merchantId,
                    id: memberId,
                    userId: params.userId,
                    memberId: params.id,
                    cardName: cardName,
                    subaccountId: subaccountId,
                    purchaseNum: info.purchaseNum
                };
                ajaxAsync(cmd, datas, function (re) {
                    if (re.code == 1) {
                        layer.msg(re.msg);
                        $('#searchTable').click();
                        layer.close(index);
                    } else {
                        layer.msg(re.msg);
                    }
                })
            }
        },
        cancel: function (index) {
            $('#searchTable').click();
        }
    });
}

/**
 * 修改时长卡的办卡时间
 * @param purchaseId 划卡ID
 * @param purchaseTime 办卡时间
 */
function modifyPurchaseTime(memberId, purchaseTime, remainNum, subaccountId, cardName) {
    layer.open({
        type: 2,
        area: ['500px', '480px'],
        title: '修改卡项办卡时间',
        maxmin: true, //开启最大化最小化按钮
        content: 'modifyPurchaseTime/modifyPurchaseTime.html?purchaseTime=' + purchaseTime + '&remainNum=' + escape(remainNum),
        btn: ['确定', '关闭'],
        yes: function (index, layero) {
            var info = window["layui-layer-iframe" + index].callbackdata();
            var cmd = "customer/modifyPurchaseTime";
            var datas = {
                merchantId: params.merchantId,
                id: memberId,
                userId: params.userId,
                memberId: params.id,
                cardName: cardName,
                subaccountId: subaccountId,
                purchaseTime: info.purchaseTime
            };
            ajaxAsync(cmd, datas, function (re) {
                if (re.code == 1) {
                    layer.msg(re.msg);
                    $('#searchTable').click();
                    layer.close(index);
                } else {
                    layer.msg(re.msg);
                }
            })
        },
        cancel: function (index) {
            $('#searchTable').click();
        }
    });
}

/**
 * 修改时长卡的办卡店铺
 */
function modifyPurchaseShop(shopId, memberId, cardName, subaccountId) {
    layer.open({
        type: 2,
        area: ['500px', '400px'],
        title: '修改办卡店铺',
        maxmin: true, //开启最大化最小化按钮
        content: 'modifyPurchaseShopInit/modifyPurchaseShopInit.html?id=' + params.id + '&merchantId=' + params.merchantId,
        btn: ['确定', '关闭'],
        yes: function (index, layero) {
            var info = window["layui-layer-iframe" + index].callbackdata();
            console.log(info)
            var cmd = "customer/modifyShop";
            var datas = {
                merchantId: params.merchantId,
                id: memberId,
                userId: params.userId,
                memberId: params.id,
                cardName: cardName,
                subaccountId: subaccountId,
                shopId: info.shopId
            };
            ajaxAsync(cmd, datas, function (re) {
                if (re.code == 1) {
                    layer.msg(re.msg);
                    $('#searchTable').click();
                    layer.close(index);
                } else {
                    layer.msg(re.msg);
                }
            })
        },
        cancel: function (index) {
            $('#searchTable').click();
        }
    });
}

/**
 * 修改购买卡项备注信息
 * @param purchaseId 购买卡项ID
 * @param remarks 备注信息
 */
function modifyPurchaseRemarks(purchaseId, cardName, subaccountId, remarks) {
    layer.open({
        type: 2,
        area: ['500px', '400px'],
        title: '修改卡项备注信息',
        maxmin: true, //开启最大化最小化按钮
        content: 'modifyPurchaseRemarksInit/modifyPurchaseRemarksInit.html?purchaseId=' + purchaseId + '&remarks=' + escape(remarks),
        btn: ['确定', '关闭'],
        yes: function (index, layero) {
            var info = window["layui-layer-iframe" + index].callbackdata();
            if (info.remarks == "") {
                layer.msg("备注不能为空！", { icon: 2 });
                return;
            }else{
                var cmd = "customer/modifyPurchaseRemarks";
                var datas = {
                    merchantId: params.merchantId,
                    id: purchaseId,
                    userId: params.userId,
                    memberId: params.id,
                    cardName: cardName,
                    subaccountId: subaccountId,
                    remarks: info.remarks
                };
                ajaxAsync(cmd, datas, function (re) {
                    if (re.code == 1) {
                        layer.msg(re.msg);
                        $('#searchTable').click();
                        layer.close(index);
                    } else {
                        layer.msg(re.msg);
                    }
                })
            }
        },
        cancel: function (index) {
            $('#searchTable').click();
        }
    });
}

/**
 * 修改消耗次数
 * @param purchaseId 划卡ID
 * @param subaccountId 会员账户ID
 * @param remainNum 剩余次数
 */
function fillConsumeRecord(memberId, subaccountId, cardName, remainNum) {
    layer.open({
        type: 2,
        area: ['500px', '300px'],
        title: '修改消耗次数',
        maxmin: true, //开启最大化最小化按钮
        content: 'fillConsumInit/fillConsumInit.html?remainNum=' + remainNum,
        btn: ['确定', '关闭'],
        yes: function (index, layero) {
            var info = window["layui-layer-iframe" + index].callbackdata();
            if (info.consumeNum.length <= 0) {
                layer.msg('请填写消耗数量！');
                return false
            } else if (Number(info.consumeNum) == 0){
                layer.msg('消耗数量不能为0！');
                return false
            }else if (Number(info.remainNum) == 0){
                layer.msg('无剩余次数！');
                return false
            } else if (Number(info.consumeNum) > Number(info.remainNum) ) {
                layer.msg("消耗数量不能大于剩余数量!");
                return false
            }else {
                var cmd = "customer/fillConsume";
                var datas = {
                    merchantId: params.merchantId,
                    id: memberId,
                    userId: params.userId,
                    memberId: params.id,
                    cardName: cardName,
                    subaccountId: subaccountId,
                    remainNum: remainNum,
                    consumeNum: info.consumeNum
                };
                ajaxAsync(cmd, datas, function (re) {
                    if (re.code == 1) {
                        layer.msg(re.msg);
                        $('#searchTable').click();
                        layer.close(index);
                    } else {
                        layer.msg(re.msg);
                    }
                })
            }
        },
        cancel: function (index) {
            $('#searchTable').click();
        }
    });
}
/**
 * 修改总价
 */
function changeTotal(memberId, subaccountId, cardName, purchasePrice) {
    layer.open({
        type: 2,
        area: ['500px', '300px'],
        title: '修改总价',
        maxmin: true, //开启最大化最小化按钮
        content: 'changeTotal/changeTotal.html?purchasePrice=' + purchasePrice,
        btn: ['确定', '关闭'],
        yes: function (index, layero) {
            var info = window["layui-layer-iframe" + index].callbackdata();
            if (info.purchasePrice.length <= 0) {
                layer.msg('请填写总价！');
                return false
            } else {
                var cmd = "customer/modifyPurchasePrice";
                var datas = {
                    merchantId: params.merchantId,
                    id: memberId,
                    userId: params.userId,
                    memberId: params.id,
                    cardName: cardName,
                    subaccountId: subaccountId,
                    purchasePrice: info.purchasePrice
                };
                ajaxAsync(cmd, datas, function (re) {
                    if (re.code == 1) {
                        layer.msg(re.msg);
                        $('#searchTable').click();
                        layer.close(index);
                    } else {
                        layer.msg(re.msg);
                    }
                })
            }
        },
        cancel: function (index) {
            $('#searchTable').click();
        }
    });
}

/**
 * 修改消费次数
 * @param purpchaseId 购买id
 * @param consumeNum 消费总次数
 */
function modifyConsumeRecord(purchaseId, consumeNum, cardName, subaccountId) {
    // 总消费次数为0，表示未消费 
    if (consumeNum == 0) {
        layer.msg('服务卡还未产生消费。', { icon: 2 });
        return;
    } else {
        layer.open({
            type: 2,
            area: ['900px', '400px'],
            title: '卡项修改-服务卡消费列表',
            maxmin: true, //开启最大化最小化按钮
            content: 'modifyConsume/modifyConsume.html?purchaseId=' + purchaseId + '&merchantId=' + params.merchantId + '&userId=' + params.userId + '&memberId=' + params.id + '&cardName=' + escape(cardName) + '&subaccountId=' + subaccountId,
            cancel: function (index) {
                $('#searchTable').click();
            }
        });

    }
}

// 修改业绩信息
function keywordsInput(self) {
    //	 var event = event || window.event;
    //	 if (event.keyCode == 13) {
    var oldAchRatio = $(self).attr("ach");
    var achRatio = $(self).parent().find("input").val();
    var purchaseId = $(self).attr("pur");
    if (isNaN(Number(achRatio))){
        layer.msg("不能输入非数字为服务业绩!");
        return false;
    }else if (oldAchRatio == achRatio) {
        layer.msg("无效操作", { icon: 2 });
        return;
    } else if (achRatio.length > 6){
        achRatio = achRatio.substring(0, 6);
        $(self).parent().find("input").val(achRatio);
        layer.msg("请输入不超过6位数的服务业绩!");
        return false;
    }else if (achRatio.length == 0){
        layer.msg("服务业绩不能为空!");
        return false;
    }else{
        layer.confirm('确定修改业绩吗?', function (index) {
            var cmd = "customer/modifyAchRatio";
            var datas = {
                id: purchaseId,
                achRatio: achRatio
            };
            ajaxAsync(cmd, datas, function (re) {
                if (re.code == 1) {
                    layer.msg(re.msg);
                    $('#searchTable').click();
                    layer.close(index);
                } else {
                    layer.msg(re.msg);
                }
            })
        });
    }
}

/************* 初始化 ******************/
// 业务办理
function serviceInit() {
    $('#serviceTable').bootstrapTable({
        striped: false,
        sortable: false,
        columns: [{
                field: 'Number',
                align: 'center',
                formatter: function (value, row, index) {
                    return index + 1;
                }
            },
            {
                field: 'cardName', title: '名称', align: 'center',
                formatter: function (val, row, index) {
                    if (row.serviceType == 4) {
                        return val + '[' + row.purchaseName + ']-' + row.shopName;
                    } else {
                        if (row.packageName !== '') {
                            return val + '[' + row.packageName + ']-' + row.shopName;
                        } else {
                            return val + '-' + row.shopName;
                        }
                    }                  
                }
            } ,
            {
                field: 'accountName', title: '类型', align: 'center'
            }, {
                field: 'shopName',
                title: '店铺',
                // width: 150,
                align: "center",
                formatter: function (val, row, index) {
                    var re = val;
                    re += '<button style="postion:absolute;float:right;right:0;top:0;" type="button" onclick="modifyPurchaseShop(' + row.shopId + ',' + row.id + ',\'' + row.cardName + '\',' + row.subaccountId + ')" title="修改办卡店铺" ><i class="fa fa-credit-card"></i></button>';
                    return re;
                }
            }, {
                field: 'totalNum',
                title: '总次数',
                // width: 150,
                align: "center",
                formatter: function (val, row, index) {
                    var ret = val;
                    var packType = row.packType;
                    if (packType == 1) {
                        ret += '<button style="postion:absolute;float:right;right:0;top:0;" type="button" onclick="modifyPurchaseRecord(' + row.id + ',' + row.purchaseNum + ',' + row.packNumber + ',' + row.totalNum + ',' + row.consumeNum + ',' + row.subaccountId + ',\'' + row.cardName + '\')" title="修改卡项总次数" ><i class="fa fa-credit-card"></i></button>';
                    } else {
                        ret += '<button style="postion:absolute;float:right;right:0;top:0;" type="button" onclick="modifyPurchaseTime(' + row.id + ',' + '\'' + row.purchaseTime + '\'' + ',' + '\'' + row.remainNum + '\'' + ',' + row.subaccountId + ',\'' + row.cardName + '\')" title="修改办卡时间" ><i class="fa fa-credit-card"></i></button>';
                    }
                    ret += '<button style="postion:absolute;float:right;right:0;top:0;" type="button" onclick="returnPurchaseRecord(' + row.id + ',' + row.subaccountId + ',\'' + row.cardName + '\',' + row.consumeNum + ')" title="退掉购买的所有卡" ><i class="fa fa-close"></i></button>';

                    return ret;
                }
            }, {
                field: 'purchasePrice',
                title: '购买总价',
                // width: 80,
                align: "center",
                formatter: function (val, row, index) {
                    if (row.isRepair == 2) {
                        return (val) + '<button style="postion:absolute;float:right;right:0;top:0;" type="button" onclick="changeTotal(' + row.id + ',' + row.subaccountId + ',\'' + row.cardName + '\',' + val + ')" title="修改总价" ><i class="fa fa-credit-card"></i></button>';
                    } else {
                        return val;
                    }
                }
            }, {
                field: 'remainNum',
                title: '剩余次数',
                // width: 80,
                align: "center",
                formatter: function (val, row, index) {
                    var packType = row.packType;
                    if (packType == 1) {
                        var remain = row.totalNum - row.consumeNum;
                        return (remain) + '<button style="postion:absolute;float:right;right:0;top:0;" type="button" onclick="fillConsumeRecord(' + row.id + ',' + row.subaccountId + ',\'' + row.cardName + '\',' + remain + ')" title="补齐消费次数" ><i class="fa fa-credit-card"></i></button>';
                    } else {
                        return val;
                    }
                }
            }, {
                field: 'consumeNum',
                title: '消费次数',
                // width: 80,
                align: "center",
                formatter: function (val, row, index) {
                    return val + '<button style="postion:absolute;float:right;right:0;top:0;" type="button" onclick="modifyConsumeRecord(' + row.id + ',' + val + ',\'' + row.cardName + '\',' + row.subaccountId + ')" title="修改消费次数" ><i class="fa fa-reply-all"></i></button>';
                }

            }, {
                field: 'achievements',
                title: '单次消耗金额',
                align: "center",
                visible: false,
                formatter: function (val, row, index) {
                    var ach = Math.round(val);
                    return ach;
                }
            }, {
                field: 'remarks',
                title: '备注',
                // width: 200,
                align: "center",
                formatter: function (val, row, index) {
                    return val + '<button style="postion:absolute;float:right;right:0;top:0;" type="button" onclick="modifyPurchaseRemarks(' + row.id + ',\'' + row.cardName + '\',' + row.subaccountId + ',' + '\'' + val + '\'' + ')" title="变更备注" ><i class="fa fa-credit-card"></i></button>';
                }
            }, {
                field: 'achRatio',
                title: '单次消耗金额(点击√确定)',
                // width: 160,
                align: "center",
                formatter: function (val, row, index) {
                    var achs = row.achievements;
                    var purchaseId = row.id;
                    var ratio = val;
                    return '<input type="text" class="achRatio" style="width:100px;" pur="' + purchaseId + '" ach="' + ratio + '" value="' + achs + '" oninput="isnum(this)" onkeyup="isnum(this)" onafterpaste="delunum(this)"/>' +
                        '<button pur="' + purchaseId + '" ach="' + ratio + '" style="postion:absolute;float:right;right:0;top:0;" type="button" onclick="keywordsInput(this)" title="确定" ><i class="fa fa-check"></i></button>';
                }
            }
        ]
    });
    $('#serviceTable').bootstrapTable('hideLoading');
}

//禁止输入框输入非数字和小于0的数，用法在input输入框加属性onkeyup="isnum(this)" onafterpaste="delunum(this)"即可
function isnum(obj) {
    obj.value = obj.value.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符   
    obj.value = obj.value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的   
    obj.value = obj.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');//只能输入两个小数   
    // if (obj.value.indexOf(".") < 0 && obj.value != "") {//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额  
    //     obj.value = parseFloat(obj.value);
    // }
    if (obj.value.indexOf(".") !== -1) {
        var arr = obj.value.split(".");
        var intNum = arr[0];
        if (intNum.length > 7) {
            layer.msg('整数位数不能超过7位！');
            $(obj).val(intNum.substring(0, 7) + '.' + arr[1]);
        } else if (intNum.length == 0) {
            layer.msg('请先输入整数部分！');
            $(obj).val('');
        }
    } else if (obj.value.length > 7) {
        layer.msg('整数位数不能超过7位！');
        $(obj).val(obj.value.substring(0, 7));
    }
}
function delunum(obj) {
    obj.value = obj.value.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符   
    obj.value = obj.value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的   
    obj.value = obj.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');//只能输入两个小数   
    if (obj.value.indexOf(".") !== -1) {
        var arr = obj.value.split(".");
        var intNum = arr[0];
        if (intNum.length > 7) {
            layer.msg('整数位数不能超过7位！');
            $(obj).val(intNum.substring(0, 7) + '.' + arr[1]);
        } else if (intNum.length == 0) {
            layer.msg('请先输入整数部分！');
            $(obj).val('');
        }
    } else if (obj.value.length > 7) {
        layer.msg('整数位数不能超过7位！');
        $(obj).val(obj.value.substring(0, 7));
    }
}
// 通用异步请求
function ajaxAsync(cmd, datas, callback) {
    var data = JSON.stringify(datas);
    var load;
    $.ajax({
        type: "POST",
        url: "/zxcity_restful/ws/rest",
        dataType: "json",
        headers: {
            apikey: 'test'
        },
        data: {
            cmd: cmd,
            data: data
        },
        beforeSend: function (request) {
            load = layer.load(1, { shade: [0.3, "#fff"] })
        },
        success: function (re) {
            callback(re);
        },
        error: function (re) {
            layer.msg('网络错误,稍后重试')
        },
        complete: function (re) {
            layer.close(load);
            layer.close(loading);
        }
    });
}
function getParams() {
    var url = location.search;
    var param = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            param[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return param;
}