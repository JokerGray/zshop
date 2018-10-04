$.extend({
    // 格式化金额
    /* number_format(1234567.089, 2, ".", ",");//1,234,567.08
    @params:    number 需格式化的数据  decimals 保留小数位  
                dec_point 小数位      thousands_sep 千位分隔符,
    @return:    返回格式化后金额  
    */
    // 'number_format': function(number, decimals, dec_point, thousands_sep) {
    //     /*
    //     * 参数说明：
    //     * number：要格式化的数字
    //     * decimals：保留几位小数
    //     * dec_point：小数点符号
    //     * thousands_sep：千分位符号
    //     * */
    //     var decimals = decimals ? decimals : 2;
    //     var dec_point = dec_point ? dec_point : '.';
    //     var thousands_sep = thousands_sep ? thousands_sep : ',';
    //     number = (number + '').replace(/[^0-9+-Ee.]/g, '');
    //     var n = !isFinite(+number) ? 0 : +number,

    //         prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    //         sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
    //         dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    //         s = '',
    //         toFixedFix = function (n, prec) {
    //             var k = Math.pow(10, prec);
    //             return '' + Math.floor(n * k) / k;
    //         };
    //     s = (prec ? toFixedFix(n, prec) : '' + Math.floor(n)).split('.');
    //     var re = /(-?\d+)(\d{3})/;
    //     //console.log(s)
    //     while (re.test(s[0])) {
    //         s[0] = s[0].replace(re, "$1" + sep + "$2");
    //     }
    //     if ((s[1] || '').length < prec) {
    //         s[1] = s[1] || '';
    //         s[1] += new Array(prec - s[1].length + 1).join('0');
    //     }
    //     return s.join(dec);
    // },
    'number_format': function(s, n){
        n = n > 0 && n <= 20 ? n : 2;
        s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
        var l = s.split(".")[0].split("").reverse(),
            r = s.split(".")[1];
        t = "";
        for (i = 0; i < l.length; i++) {
            t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
        }
        return t.split("").reverse().join("") + "." + r; 
    },
    //计算 并格式化金额返回
    /*
    @params: data  数据的数组   field  需要计算数组中的字段
    @return: 返回field字段叠加后金额 
    */
    'calcTotal': function(data, field) {
        //计算总金额
        var total = 0;
        data.forEach(function (item, index) {
            total = Number(item[field]) + total;
        })
        var num = this.number_format(total, 2, '.', ',');
        //console.log(num);
        return num;
    },
    //获取指定url参数内容
    'getQueryString': function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURIComponent(r[2]) || '';
        return ''; 
    },
    'GetRequest': function() {
        var url = location.search; //获取url中"?"符后的字串  
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    },  
    'isPositiveNum': function(s){//是否为正整数
        var re = /^[0-9]*[1-9][0-9]*$/ ;
        return re.test(s)
    },
    'getDate': function() {
        var date = new Date();
        var year = date.getFullYear();
        var month = parseInt(date.getMonth()) + 1;
        if(month < 10) month = '0' + month;
        var day = date.getDate();
        if (day < 10) day = '0' + day;
        return year + '-' + month + '-' + day;
    },
    /* 设置bootstrap table 选项参数
     @parmas: obj 
        page 当前页  rows 每页显示数  url 请求地址
        cmd          data 请求参数 
    */ 
    'setTableOption': function(obj) {
        var index = 0;
        var option = {
            sortable: false,
            cache: false,
            sidePagination: "server",
            pageNumber: obj.page || 1,
            pageSize: obj.rows || 10,
            pageList: [10, 25, 50, 100],
            striped: true,
            pagination: true,
            url: obj.url || '/zxcity_restful/ws/rest',
            method: 'post',
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            undefinedText: '-',
            toolbar: '#toolbar',
            ajaxOptions: {
                cache: false,
                headers: {
                    apikey: obj.apikey || 'test'
                },
                beforeSend: function (request) {
                    index = layer.load(1, { shade: [0.3, "#fff"] });
                },
                success: function (res) {
                    if(res.code == 9) {
                        layer.close(index);
                        layer.msg('网络错误,稍后重试');
                    }
                },
                error: function (res) {
                    layer.msg('网络错误,稍后重试');
                },
                complete: function (re) {
                    layer.close(index);
                },
                timeout: 1000, 
            },
            responseHandler: function (res) {
                res.rows = res.data
                return res;
            },
            queryParams: function (params) {
                var p = {
                    cmd: obj.cmd,
                }
                var data = {};
                for (key in obj.data) {
                    data[key] = obj.data[key]
                }
                data.page = params.offset / params.limit + 1;  //当前页码
                data.rows = params.limit;                      //每页显示行数
                p.data = JSON.stringify(data);
                return p;
            },
            // onLoadError: function() {
            //     layer.msg('网络错误',{time:2000});
            // },
            formatLoadingMessage: function () {
                return '';
            }
        };
        if (obj.rowAttributes) {
            option.rowAttributes = obj.rowAttributes;
        }
        if (obj.columns) {
            option.columns = obj.columns;
        }
        return option;
    },
    'tableRefresh': function(elem, obj){
        elem.bootstrapTable('refreshOptions',{
            pageNumber: obj.page || 1,
            pageSize: obj.rows || 10,
            url: obj.url || '/zxcity_restful/ws/rest',
            method: 'post',
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            responseHandler: function (res) {
                res.rows = res.data
                return res;
            },
            queryParams: function (params) {
                var p = {
                    cmd: obj.cmd,
                }
                var data = {};
                for (key in obj.data) {
                    data[key] = obj.data[key]
                }
                data.page = obj.page || params.offset / params.limit + 1;  //当前页码
                data.rows = obj.rows ||   params.limit;                      //每页显示行数
                p.data = JSON.stringify(data);
                return p;
            },
        });
    },
    /* 初始化动态分页*/
    /* 
    @params: total  数据总个数   pageNum 每页显示数量默认10
            pages 分页器显示的页面数默认5 [1 2 3 4 5]  pagesAfter 分页器尾部显示页面数默认3  [9 10 11]
            activePage 激活当前页 默认1
    @retrun: 返回html 字符串
    */
    'initPagination': function(total, pageNum, pages, pagesAfter, activePage) {
        // 分页器显示数量
        var html = '';
        pageNum = pageNum ? pageNum : 10;           //默认一页显示10个
        var count = total / pageNum;                //总页数
        var is = true;                              //是否还有页数显示
        pages = pages ? pages : 5;
        pagesAfter = pagesAfter ? pagesAfter : 3;   //默认显示最后三个
        activePage = activePage ? activePage : 1;   //当前激活的页
        html = '<div class="pull-right pagination">';
        html += '<ul class="pagination"' + ' total=' + total + ' count=' + count + '>';
        html += '<li><a href="javascript:;" class="page-pre">' + '‹' + '</a></li>';
        for (var i = 0; i < pages; i++) {
            if (i >= count) {
                is = false;
                break;
            }
            if (activePage == (i + 1)) {
                html += '<li class="page-number active"><a href="javascript:;">' + (i + 1) + '</a></li>';
            } else {
                html += '<li class="page-number"><a href="javascript:;">' + (i + 1) + '</a></li>';
            }
        }
        var afterNum = count - pagesAfter;
        if (is && afterNum > pages) {
            //添加 ...
            html += '<li class="page-number page-disabled"><a href="javascript:;">' + '...' + '</a></li>';
            //计算倒数起始页
            for (var i = 0; i < pagesAfter; i++) {
                if (activePage == (pagesAfter + i + 1)) {
                    html += '<li class="page-number active"><a href="javascript:;">' + (afterNum + i + 1) + '</a></li>';
                } else {
                    html += '<li class="page-number"><a href="javascript:;">' + (afterNum + i + 1) + '</a></li>';
                }
            }
        }
        html += '<li class="page-next"><a href="javascript:;">' + '›' + '</a></li>';
        html += '</ul>';
        html += '</div>';
        return html;
    }
})