(function($) {
    var package = function() {
        this.rows = 1;
        this.page = 1;
        this.id = 0;
        this.url = {
            getScCouponDetail: "operations/getScCouponDetail", //获取优惠券详情
            getPacksDetail: "operations/getPacksDetail" //获取产品优惠券id
        };
    };
    package.prototype = {
        getPacksDetail: function(d) {
            var _this = this;
            var d = JSON.stringify(d);
            reqAjax(this.url.getPacksDetail, d).done(function(res) {
                if (res.code == 1) {
                    if (res.data.couponContent.split("-")[0] == "1") {
                        _this.id = res.data.couponContent.split("-")[1];
                    } else {
                        return alert("没有新手礼包");
                    }
                    _this.getScCouponDetail({
                        id: _this.id || ""
                    });
                } else {
                    alert(res.msg);
                }
            });
        },
        getScCouponDetail: function(d) {
            var d = JSON.stringify(d);
            reqAjax(this.url.getScCouponDetail, d).done(function(res) {
                $.each(res.data, function(i, v) {
                    $("#" + i).html(v);
                });
                $("#endTime").html($("#endTime").html().slice(0, 10));
            });
        },

    };

    var start = new package();
    start.getPacksDetail({
        id: getUrlParams("packsId") || ""
    });

    function reqAjax(cmd, data) {
        var apikey = sessionStorage.getItem('apikey') == null ? "test" : sessionStorage.getItem('apikey'); //获取缓存 通行证码
        var version = sessionStorage.getItem('version') == null ? "1" : sessionStorage.getItem('version'); //获取缓存 版本号
        var reData = "";
        var defer = $.Deferred();
        $.ajax({
            type: "POST",
            url: "/zxcity_restful/ws/rest",
            dateType: "json",
            data: {
                "cmd": cmd,
                "data": data,
                "version": version
            },
            beforeSend: function(request) {
                request.setRequestHeader("apikey", apikey);
            },
            success: function(res) {
                defer.resolve(res);
                if (res.code != 1) {
                    alert(res.msg);
                }
            },
            error: function() {
                alert("系统繁忙，请稍后再试！")
            }
        });
        return defer.promise();
    }

    // 获取url参数
    function getUrlParams(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            r[2] = r[2].replace(new RegExp("%", 'g'), "%25");
            return decodeURI(decodeURIComponent(r[2]));
        }
        return "";
    }
})(jQuery);