(function ($) {
    var REQUEST_URL = {
        'getListByUserId': 'operations/getScMultipleShopConfigureByUserId',
        'getListById': 'operations/getScMultipleShopConfigureList',
        'getProfitSum': 'operations/getShopProfitMerchantSum',
        'getShopList': 'operations/getScMultipleShopConfigureById',
        'getShopId': 'backUser/listMerShops'
    };

    var id = getUrlParams("id"), name = getUrlParams("name");

    //柱状图--销售消耗业绩
    function initBarOptions(params) {
        var option = {
            title: {
                text: ''
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                selectedMode: false,
                data: ['销售额', '消耗额']
            },

            calculable: true,
            xAxis: [
                {
                    type: 'category',
                    name: '片区名称',
                    nameTextStyle: {
                        color: '#999'
                    },
                    data: params.xData
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '金额(元)',
                    nameTextStyle: {
                        color: '#999'
                    }
                }
            ],
            series: [
                {
                    name: '销售额',
                    type: 'bar',
                    barWidth: '30px',
                    itemStyle: {
                        normal: {
                            color: '#a3e2ff'
                        }
                    },
                    data: params.saleData
                },
                {
                    name: '消耗额',
                    type: 'bar',
                    barWidth: '30px',
                    itemStyle: {
                        normal: {
                            color: '#93a0fb'
                        }
                    },
                    data: params.consumptionData
                }
            ]
        };
        return option;
    }

    //折线图--费用
    function initLineOptions(params) {
        var option = {
            title: {
                text: ''
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: params.legend
            },
            // grid: {
            //     left: '3%',
            //     right: '4%',
            //     bottom: '3%',
            //     containLabel: true
            // },
            xAxis: {
                type: 'category',
                name: '日期',
                nameTextStyle: {
                    color: '#999'
                },
                data: params.xData
            },
            yAxis: {
                type: 'value',
                name: '金额(元)',
                nameTextStyle: {
                    color: '#999'
                }
            },
            series: params.yData
        };
        return option;
    }

    //折线图--商户数量
    function initLineOptions2(params) {
        var option = {
            title: {
                text: ''
            },
            tooltip: {
                trigger: 'axis'
            },
            // grid: {
            //     left: '3%',
            //     right: '4%',
            //     bottom: '3%',
            //     containLabel: true
            // },
            xAxis: {
                type: 'category',
                name: '片区名称',
                nameTextStyle: {
                    color: '#999'
                },
                data: params.xData
            },
            yAxis: {
                type: 'value',
                name: '数量',
                nameTextStyle: {
                    color: '#999'
                }
            },
            series: [
                {
                    type: 'line',
                    symbolSize: 8,
                    lineStyle: {
                        normal: {
                            width: 5,
                            color: '#ffa074'
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: '#ffa074'
                        }
                    },
                    label: {
                        normal: {
                            formatter: function (params) {
                                return params.value + '{arrow|}'
                            },
                            show: true,
                            position: 'top',
                            distance: 10,
                            color: '#fff',
                            backgroundColor: '#ffa074',
                            padding: [4, 5],
                            borderRadius: 3,
                            borderWidth: 1,
                            borderColor: '#ffa074',
                            rich: {
                                arrow: {
                                    backgroundColor: {
                                        image: 'image/arrow.png'
                                    }
                                }
                            }
                        }
                    },
                    data: params.yData
                }
            ]
        };
        return option;
    }


    var barChart = echarts.init(document.getElementById('barChartofSection1'));

    var lineChart = echarts.init(document.getElementById('lineChartofSection2'));

    var swiper = new Swiper('.swiper-container', {
        spaceBetween: 15,
        slidesPerView: 4,
        pagination: {
            el: '.swiper-pagination',
            clickable: true
        }
    });

    function getListById(id) {
        var param = {
            'id': id
        };
        reqAjaxAsync(REQUEST_URL['getListById'], JSON.stringify(param)).done(function (res) {
            var arr1 = [], arr2 = [], arr3 = [], arr4 = [];
            var tSale = 0, tConsumption = 0, tCost = 0, tplArr = [], tplObj = {};
            var sHtml = '';
            if (res.code == 1) {
                if (res.data.length > 0) {
                    var obj = res.data;
                    for (var i = 0; i < obj.length; i++) {
                        tSale += obj[i].salesMonth;
                        tConsumption += obj[i].comsumptionMonth;
                        tCost += obj[i].cost;
                        var temp = {
                            'name': obj[i].name,
                            'pic': obj[i].imagePath,
                            'sale': obj[i].salesMonth,
                            'consumption': obj[i].comsumptionMonth,
                            'cost': obj[i].cost,
                            'merchantId': obj[i].merchantId
                        };
                        tplArr.push(temp);

                        arr1.push(obj[i].name);//片区名称
                        arr2.push(obj[i].salesMonth);//销售
                        arr3.push(obj[i].comsumptionMonth);//消耗
                        arr4.push(obj[i].merchantCount);//商户数量
                    }
                    tplObj['tSale'] = tSale;
                    tplObj['tCost'] = tCost;
                    tplObj['tConsumption'] = tConsumption;
                    tplObj['slideArr'] = tplArr;
                    // console.log(tplObj);
                    var sHtml = template('section4Tpl', tplObj);
                    $(".section4 .section-detail").html(sHtml);
                    console.log(tplObj);
                }
            }
            var params1 = {
                'xData': arr1,
                'saleData': arr2,
                'consumptionData': arr3
            };
            barChart.setOption(initBarOptions(params1));

        });
    }

    function getProfitSum(id) {
        var param = {
            'id': id
        };
        reqAjaxAsync(REQUEST_URL['getProfitSum'], JSON.stringify(param)).done(function (res) {
            if (res.code == 1) {
                var colorArr = ['#ffa074', '#f17da2', '#338bff', '#7cc6fb', '#8e53ff'];
                var obj = res.data, len = obj.length > 5 ? 5 : obj.length;
                var params = [], legendArr = [], seriesArr = [], xData = [];
                for (var i = 0; i < len; i++) {
                    legendArr.push(obj[i].name);
                    var dataArr = [];
                    for (var j = 0; j < obj[i].list.length; j++) {
                        var m = obj[i].list[j].statisticsDate.substring(5, 7);
                        var n = obj[i].list[j].statisticsDate.substring(8, 10);
                        dataArr.push(obj[i].list[j].totalCost);
                        xData.push(n);
                    }

                    var temp = {
                        name: obj[i].name,
                        type: 'line',
                        smooth: true,
                        symbolSize: 10,
                        lineStyle: {
                            normal: {
                                color: colorArr[i]
                            }
                        },
                        itemStyle: {
                            normal: {
                                areaStyle: {type: 'default'},
                                color: colorArr[i]
                            }
                        },
                        data: dataArr
                    }
                    seriesArr.push(temp);
                }
                params['legend'] = legendArr;
                params['yData'] = seriesArr;
                params['xData'] = xData;
                // console.log(params);
                lineChart.setOption(initLineOptions(params));
            } else {
                layer.msg(res.msg);
            }
        });
    }

    function getListByUserId() {
        var param = {
            'backUserId': sessionStorage.getItem("backUserId")
        };
        reqAjaxAsync(REQUEST_URL['getListByUserId'], JSON.stringify(param)).done(function (res) {
            if (res.code == 1) {
                $(".main-title .title").text(res.data.name);
                getListById(res.data.id);
                getProfitSum(res.data.id);
                id = res.data.id
            } else {
                layer.msg(res.msg);
            }
        });
    }

    //点击详情按钮，跳转详情页面
    $('.link-btn').on('click', function () {
        window.location.href = './costDetail.html?id=' + id;
    });

    //返回按钮
    $('.return-icon').on('click', function () {
        window.history.back()
    });

    //点击商户列表，跳转工作台
    $(".section4 .section-detail").on('click', '.swiper-container .inner', function () {
        var backUserID = sessionStorage.getItem('backUserId');
        var data = {
            merchantId: $(this).attr('data-merchantid')
        };
        reqAjaxAsync(REQUEST_URL['getShopId'], JSON.stringify(data)).done(function (res) {
            if (res.code !== 1) {
                layer.msg(res.msg);
                return
            }
            var shopId = res.data[0].id,
                shopName = res.data[0].shopName;
            // console.log(backUserID);
            // console.log(res);
            sessionStorage.removeItem('backUserId');
            window.location.href = '../../index.html?apikey=test&backUserID=' + backUserID + '&shopID=' + shopId + '&shopName=' + shopName + '&merchantId=' + data.merchantId;

        });
    });

    $(function () {
        if (id) {
            $(".main-title .title").text(name);
            getListById(id);
            getProfitSum(id);
        } else {
            getListByUserId();
        }
    });

})(jQuery);
// apikey=test&backUserID=10073&shopID=49&shopName=武汉女人花&merchantId=1070