$(function () {
    var REQUIRE_URL = {
        'ShopAccountList': 'shopDisplayTerminal/queryShopMemberList',
            //'shopDisplayTerminal/queryShopAccountList',//获取店内客户列表
        'card_list': 'shop/serviceCards',//获取客户的服务卡列表
        'waiter': 'shopDisplayTerminal/getShopWaiterList',//获取店内服务员
        'services': 'shopDisplayTerminal/getAllServicePage',//获取成长卡服务项目
        //'services': 'shopDisplayTerminal/getAllServiceList',//获取成长卡服务项目
        'memberRelative':'shopDisplayTerminal/getMemberRelativeList',//亲朋列表
        'memberList':'shopDisplayTerminal/getAccounts',//获取子账户
        'quickChecks': 'shopDisplayTerminal/quickChecksV2',//快速开单
        'sendMsg':'shop/getRoomIdSendMessage'//往聊天室推送消息接口
    };
    //记录获取卡项列表的次数，当第一次加载的时候，用allServiceCardList记录当前客户的所有服务卡列表
    var flag = 0;
    var shopId = sessionStorage.getItem('shopId'),
        merchantId = sessionStorage.getItem('merchantId'),
        userName = sessionStorage.getItem('username'),
        backUserId = sessionStorage.getItem('backUserId'),
        memberId,//当前客户的id
        changeThis,//记录点击成长卡选择服务项目按钮
        memberRelativeList;//记录当前客户亲朋列表
    var accountList = [],//记录弹框中当前显示的客户列表
        selectedServiceCardList = [],//记录已选中服务卡列表
        allServiceCardList = {},//记录当前客户的所有服务卡列表
        searchServiceCardResult = {};//记录搜索服务卡列表结果

    //获取店内熟客信息
    function getFamiliarInfo() {
        var data = {
            "merchantId": merchantId,                        //-- 商铺ID **必传**
            "shopId": shopId,                                //-- 门店ID **必传**
            "keyword": "",                                  //-- 筛选条件
            "pageNo": 1,                                     // -- 第几页
            "pageSize": 10                                  // -- 每页条数
        };
        reqAjaxAsync(REQUIRE_URL['ShopAccountList'], JSON.stringify(data)).done(function (res) {
            if (res.code !== 1) {
                layer.msg(res.msg);
                return
            }
            if (res.data.length > 0) {
                res.data[0]['username'] = userName;
                var html = template('familiarTpl', res.data[0]);
                $('.selectedVip_msg').html(html);
                getServiceCardList(res.data[0].memberId);
                memberId = res.data[0].memberId;
                getMemberRelativeList()
            }
        })
    }

    getFamiliarInfo();

    //获取店内客户列表
    function getAccountList(keyword) {
        var data = {
            "merchantId": merchantId,
            "shopId": '',
            "keyword": keyword || '',
            "pageNo": 1,
            "pageSize": 10
        };
        reqAjaxAsync(REQUIRE_URL['ShopAccountList'], JSON.stringify(data)).done(function (res) {
            if (res.code !== 1) {
                layer.msg(res.msg);
                return
            }
            accountList = res.data;
            if (!keyword && keyword !== '') {
                var html = template('allaccountList', res.data);
                layer.open({
                    type: 1,
                    skin: 'accountList-class',
                    title: '会员搜索',
                    area: ['70%', '80%'],
                    shadeClose: true,
                    scrollbar: false,
                    content: html
                })
            } else {
                var searchResultHtml = '';
                res.data.forEach(function (item, index) {
                    searchResultHtml += "<li data-index='" + index + "'><span>" + item.memberName + "</span><span>" + item.mobile + "</span><span></span></li>"
                });
                searchResultHtml = "<ul>" + searchResultHtml + "</ul>";
                $('.accountListBox').html(searchResultHtml);
            }
            selectAccount();
            //初始化分页器
            pagingInit('.page-selection',res.total,10,function (page) {
                data['keyword'] = $('.searchBox input').val().trim();
                data['pageNo'] = page;
                reqAjaxAsync(REQUIRE_URL['ShopAccountList'], JSON.stringify(data)).done(function (res) {
                    accountList = res.data;
                    var searchResultHtml = '';
                    res.data.forEach(function (item, index) {
                        searchResultHtml += "<li data-index='" + index + "'><span>" + item.memberName + "</span><span>" + item.mobile + "</span><span></span></li>"
                    });
                    searchResultHtml = "<ul>" + searchResultHtml + "</ul>";
                    $('.accountListBox').html(searchResultHtml);
                    selectAccount()
                })
            })
        })
    }

    //选择客户
    function selectAccount() {
        $('.accountListBox li').on('click', function () {
            // 搜索框初始化
            $('.allServiceCards_box').show();
            $('.serviceCardsResult_box').hide();
            $('#serviceCardKeyWord').val('');
            //flag归零，说明已经切换客户
            flag = 0;
            //已选择的服务卡列表清空
            selectedServiceCardList = [];
            $('.selectedServiceCards_box').html('');
            //客户信息栏更新
            var accountInfo = accountList[$(this).attr('data-index')];
            accountInfo['username'] = userName;
            memberId = accountInfo.memberId;
            var html = template('familiarTpl', accountInfo);
            $('.selectedVip_msg').html(html);
            getServiceCardList(accountInfo.memberId);
            getMemberRelativeList();
            layer.closeAll()
        });
    }

    //获取客户卡项列表
    function getServiceCardList(memberId, keyword, keyCode) {
        var data = {
            // 'accountId': accountId,
            'memberId':memberId,
            'cardName': keyword || ''
        };
        reqAjaxAsync(REQUIRE_URL['card_list'], JSON.stringify(data)).done(function (res) {
            if (res.code !== 1) {
                layer.msg(res.msg);
                return
            }
            flag++;
            res['username'] = userName;
            res['backUserId'] = backUserId;
            res['waiters'] = JSON.stringify([{
                id:backUserId,
                backUserName:userName
            }])
            if (keyCode && keyCode === 13) {
                //当搜索结果中有被选中的卡时，显示“取消选择按钮”
                if (selectedServiceCardList.length > 0) {
                    res.data.forEach(function (v, i) {
                        selectedServiceCardList.forEach(function (item, index) {
                            if (v.purchaseId === item.purchaseId) {
                                res.data[i] = item
                            }
                        })
                    })
                }
                var html = template('serviceCardsTpl', res);
                $('.serviceCardsResult_box').html(html)
            } else {
                var html = template('serviceCardsTpl', res);
                $('.allServiceCards_box').html(html)
            }
            //记录第一次获取卡项列表时的卡项数据
            if (flag === 1) {
                allServiceCardList = res;
            } else {
                searchServiceCardResult = res;
            }
        })
    }

    //点击选择会员按钮，弹出会员列表弹窗
    $('.selectVipBtn').on('click', function () {
        getAccountList()
    });

    //选择会员，并加载该会员的卡项信息
    $('.accountListBox li').on('click', function () {
        // 搜索框初始化
        $('.allServiceCards_box').show();
        $('.serviceCardsResult_box').hide();
        $('#serviceCardKeyWord').val('');
        //flag归零，说明已经切换客户
        flag = 0;
        //已选择的服务卡列表清空
        selectedServiceCardList = [];
        $('.selectedServiceCards_box').html('');
        //客户信息栏更新
        var accountInfo = accountList[$(this).attr('data-index')];
        accountInfo['username'] = userName;
        memberId = accountInfo.memberId;
        var html = template('familiarTpl', accountInfo);
        $('.selectedVip_msg').html(html);
        getServiceCardList(accountInfo.memberId);
        layer.closeAll()
    });

    //搜索会员和服务项目
    $(document).on('click', '.searchBtn', function () {
        var keyword = $('.searchBox input').val().trim();
        if ($(this).attr('data-type') === 'account') {
            getAccountList(keyword)
        } else if ($(this).attr('data-type') === 'service') {
            getServiceItems(keyword)
        }
    });

    //点击加减按钮，改变服务次数
    $('.selectedServiceCards_box').on('click', '.reduceBtn', function () {
        var val = $(this).siblings('input').val();
        if (val > 1) {
            val--;
            $(this).siblings('input').val(val);
            selectedServiceCardList[$(this).attr('data-index')]['serviceCount'] = val;
        }
    }).on('click', '.addBtn', function () {
        var val = $(this).siblings('input').val();
        if (val * 1 >= $(this).siblings('input').attr('data-maxnum') * 1) {
            layer.msg('服务次数不能超过剩余服务次数');
            return
        }
        val++;
        $(this).siblings('input').val(val);
        selectedServiceCardList[$(this).attr('data-index')]['serviceCount'] = val;
    });

    //点击切换服务人员按钮，弹出选择服务人员选项框
    $(document).on('click', '.changeServicePeopleBtn', function () {
        var _this = this;
        getServicesWaiters(_this)
    });

    //获取服务人员
    function getServicesWaiters(_this) {
        var data = {
            "shopId": shopId,
            "merchantId": merchantId,
            "backUserName": ''
        };
        var waiterList;
        reqAjaxAsync(REQUIRE_URL['waiter'], JSON.stringify(data)).done(function (res) {
            waiterList = res.data;//保存本店下所有服务人员列表
            var html = template('selectWaiter', res.data);
            var selectedWaiters = [];
            layer.open({
                type: 1,
                skin: 'waiterList-class',
                title: '请选择服务人员',
                area: ['40%', '70%'],
                shadeClose: true,
                scrollbar: false,
                btn: ['确定','取消'],
                content: html,
                yes: function (index) {
                    if(selectedWaiters.length === 0){
                        layer.msg('请选择服务人员！');
                        return
                    }
                    if(selectedWaiters.length >5){
                        layer.msg('最多5个服务人员');
                        return
                    }
                    var names = [];
                    selectedWaiters.forEach(function (item,index) {
                        names.push(item.backUserName)
                    });
                    names = names.join('，');
                    $(_this).siblings('span').text(names).attr('data-waiters',JSON.stringify(selectedWaiters))
                    layer.close(index)
                }
            });
            //搜索商铺下面的服务人员
            $('#searchSubmit').on('submit', function () {
                data['backUserName'] = $('#waiterName').val().trim();
                reqAjaxAsync(REQUIRE_URL['waiter'], JSON.stringify(data)).done(function (res) {
                    if (res.code !== 1) {
                        layer.msg(res.msg);
                        return
                    }
                    var htmlStr = '';
                    for(var i = 0;i<res.data.length;i++){
                        for(var j = 0;j<selectedWaiters.length;j++){
                            // console.log(res.data[i].id , selectedWaiters[j].id);
                            if(res.data[i].id == selectedWaiters[j].id){
                                res.data[i].selected = true;
                                break
                            }else{
                                res.data[i].selected = false
                            }
                        }
                    }
                    res.data.forEach(function (v, i) {
                        if(v.selected){
                            htmlStr += "<li data-id='" + v.id + "'><span>" + v.backUserName + "</span><span class='active'></span></li>"
                        }else{
                            htmlStr += "<li data-id='" + v.id + "'><span>" + v.backUserName + "</span><span></span></li>"
                        }
                    });
                    htmlStr = '<ul>' + htmlStr + '</ul>';
                    $('.waiterList').html(htmlStr);
                    $('#waiterName').blur()
                })
            });
            //选择服务人员并显示到相应的位置
            $('.waiterList').on('click', 'li', function () {
                var _that = this;
                $(this).find('span:nth-of-type(2)').toggleClass('active');
                if($(this).find('span:nth-of-type(2)').hasClass('active')){
                    selectedWaiters.push({
                        "id": parseInt($(this).attr('data-id')),
                        "backUserName":$(this).find('span:nth-of-type(1)').text()
                    })
                    waiterList.forEach(function (item, index) {
                        if(item.id == parseInt($(_that).attr('data-id'))){
                            item.selected = true
                        }
                    })
                }else{
                    selectedWaiters.forEach(function (item, index) {
                        if($(_that).attr('data-id') == item.id){
                            selectedWaiters.splice(index,1)
                        }
                    });
                    waiterList.forEach(function (item, index) {
                        if(item.id == parseInt($(_that).attr('data-id'))){
                            item.selected = false
                        }
                    })
                }
                // console.log(selectedWaiters);
                // $(_this).siblings('span').html($(this).find('span:nth-of-type(1)').html()).attr('data-id', $(this).attr('data-id'));
                // layer.closeAll()
            });
            // 当输入框中的内容为空时，显示当前店铺下的所有服务人员
            $('#waiterName').on('keyup', function () {
                if ($(this).val().trim() === '') {
                    var htmlStr = '';
                    waiterList.forEach(function (v, i) {
                        if(v.selected){
                            htmlStr += "<li data-id='" + v.id + "'><span>" + v.backUserName + "</span><span class='active'></span></li>"
                        }else{
                            htmlStr += "<li data-id='" + v.id + "'><span>" + v.backUserName + "</span><span></span></li>"
                        }

                    });
                    htmlStr = '<ul>' + htmlStr + '</ul>';
                    $('.waiterList').html(htmlStr)
                }
            })
            //初始化下拉选择框插件select2
            // $('#waiterSelector').select2({
            //     // minimumResultsForSearch: -1,
            // })
        })
    }

    //选择成长卡服务项目
    function selectServiceItem() {
        $('.serviceListBox ul li').on('click', function () {
            //避免用户点击列表title
            if ($(this).attr('data-flag') === 'false') {
                return
            }
            var serviceId = $(this).find('.serviceId').html();
            var serviceName = $(this).find('.serviceName').html();
            var price = $(this).find('.servicePrice').html();
            $(changeThis).siblings('span').html(serviceName).attr('data-serviceId', serviceId);
            $(changeThis).siblings('span').html(serviceName).attr('data-price', price);
            $(changeThis).parent().siblings('h4').find('sub').html('(' + serviceName + ')');
            layer.closeAll()
        })
    }

    //获取成长卡服务项目列表
    function getServiceItems(keyword) {
        var data = {
            "merchantId": merchantId,
            "serviceName": keyword || "",
            "pageNo": 1,
            "pageSize": 10
        };
        reqAjaxAsync(REQUIRE_URL['services'], JSON.stringify(data)).done(function (res) {
            if (!keyword && keyword !== '') {
                var html = template('allservicesList', res.data);
                layer.open({
                    type: 1,
                    skin: 'accountList-class',
                    title: '服务项目',
                    area: ['70%', '80%'],
                    shadeClose: true,
                    scrollbar: false,
                    content: html
                });
            } else {
                var searchResultHtml = '<li data-flag="false"><span>服务编号</span><span>服务名称</span><span>服务价格</span></li>';
                res.data.forEach(function (item, index) {
                    searchResultHtml += "<li><span class='serviceId'>" + item.id + "</span><span class='serviceName'>" + item.serviceName + "</span><span class='servicePrice'>" + item.price + "</span></li>"
                });
                searchResultHtml = "<ul>" + searchResultHtml + "</ul>";
                $('.serviceListBox').html(searchResultHtml);
            }
            selectServiceItem();
            //初始化分页器
            pagingInit('.service-page-selection',res.total,10,function (page) {
                data['serviceName'] = keyword || '';
                data['pageNo'] = page;
                reqAjaxAsync(REQUIRE_URL['services'], JSON.stringify(data)).done(function (res) {
                    var searchResultHtml = '<li data-flag="false"><span>服务编号</span><span>服务名称</span><span>服务价格</span></li>';
                    res.data.forEach(function (item, index) {
                        searchResultHtml += "<li><span class='serviceId'>" + item.id + "</span><span class='serviceName'>" + item.serviceName + "</span><span class='servicePrice'>" + item.price + "</span></li>"
                    });
                    searchResultHtml = "<ul>" + searchResultHtml + "</ul>";
                    $('.serviceListBox').html(searchResultHtml);
                    selectServiceItem()
                })
            })
        })
    }

    //点击切换成长卡服务项目按钮，弹出可选服务项目列表框
    $(document).on('click', '.changeServiceTypeBtn', function () {
        getServiceItems();
        changeThis = this
    });

    //点击笔图片按钮，对应的输入框获取焦点，提示用户可更改
    $('.allServiceCards_box').on('click', '.canRewriteBtn', function () {
        $(this).siblings('span').find('input').focus()
    });

    //点击立即选择按钮，选择需要的服务卡，并显示在页面左面
    $('.allServiceCards_box').on('click', '.select_sure_btn', function () {
        selectServiceCard(this, false)
    });

    //选择服务卡
    function selectServiceCard(_this, issearch) {
        // issearch为true时说明点击的是搜索结果中的服务卡，
        // 如果为false时，说明点击的是服务卡列表中的服务卡。
        var item,//当前被选中的服务卡
            serviceCarsResultHtml,//服务卡搜索结果的渲染模板
            allServiceCardHtml,//所有服务卡的渲染模板
            html;//已选中的服务卡列表渲染模板
        if (!issearch) {
            item = allServiceCardList.data[$(_this).attr('data-index')];
        } else {
            item = searchServiceCardResult.data[$(_this).attr('data-index')];
        }
        if (!$(_this).hasClass('cancelColor')) {
            var serviceCount = $(_this).siblings('.cardMsg').find('input').val();
            if (serviceCount * 1 > item.remainNum * 1) {
                layer.msg('服务次数超过剩余次数，请重新输入！');
                return
            } else if (serviceCount <= 0) {
                layer.msg('服务次数输入错误，请重新输入！');
                return
            }
            // item['waiterId'] = $(_this).siblings('.cardMsg').find('.waiter').attr('data-id');
            item['waiterNames'] = $(_this).siblings('.waitersBox').find('.waiter').html();
            item['waiters'] = $(_this).siblings('.waitersBox').find('.waiter').attr('data-waiters');
            item['serviceCount'] = serviceCount;
            item['serviceItem'] = $(_this).siblings('p').find('.serviceItem').html();
            item['serviceId'] = $(_this).siblings('p').find('.serviceItem').attr('data-serviceId');
            item['selected'] = true;
            item['price'] = $(_this).siblings('p').find('.serviceItem').attr('data-price');
            item['memberRelativeList'] = memberRelativeList.relativeList;
            selectedServiceCardList.unshift(item);
            html = template('selectedServiceCardsTpl', selectedServiceCardList);
            $('.selectedServiceCards_box').html(html).find('.userPeople').select2({minimumResultsForSearch: -1});
            //已选择服务卡置顶
            if (!issearch) {
                allServiceCardList.data.splice($(_this).attr('data-index'), 1);
                allServiceCardList.data.unshift(item);
                allServiceCardHtml = template('serviceCardsTpl', allServiceCardList);
                $('.allServiceCards_box').html(allServiceCardHtml);
            } else {
                searchServiceCardResult.data.splice($(_this).attr('data-index'), 1);
                searchServiceCardResult.data.unshift(item);
                serviceCarsResultHtml = template('serviceCardsTpl', searchServiceCardResult);
                $('.serviceCardsResult_box').html(serviceCarsResultHtml);
                allServiceCardList.data.forEach(function (v, i) {
                    if (v.purchaseId === item.purchaseId) {
                        allServiceCardList.data.splice(i, 1);
                        allServiceCardList.data.unshift(item);
                        var allServiceCardHtml = template('serviceCardsTpl', allServiceCardList);
                        $('.allServiceCards_box').html(allServiceCardHtml);
                    }
                })
            }
        } else {
            //当取消选择了某个服务卡，已选择框里的服务列表需要删除
            selectedServiceCardList.forEach(function (v, i) {
                if (v.purchaseId === item.purchaseId) {
                    selectedServiceCardList.splice(i, 1)
                }
            });
            html = template('selectedServiceCardsTpl', selectedServiceCardList);
            $('.selectedServiceCards_box').html(html).find('.userPeople').select2({minimumResultsForSearch: -1});
            if (!issearch) {
                allServiceCardList.data[$(_this).attr('data-index')]['selected'] = false;
                // item =  allServiceCardList.data[$(_this).attr('data-index')];
                // allServiceCardList.data.splice($(_this).attr('data-index'),1)
                // allServiceCardList.data.push(item)
                allServiceCardList.data[$(_this).attr('data-index')]['serviceCount'] = 1;
                allServiceCardHtml = template('serviceCardsTpl', allServiceCardList);
                $('.allServiceCards_box').html(allServiceCardHtml);
            } else {
                searchServiceCardResult.data[$(_this).attr('data-index')]['selected'] = false;
                searchServiceCardResult.data[$(_this).attr('data-index')]['serviceCount'] = 1;
                serviceCarsResultHtml = template('serviceCardsTpl', searchServiceCardResult);
                $('.serviceCardsResult_box').html(serviceCarsResultHtml);
                //当在搜索结果中取消选择服务卡时，服务卡列表中这个被选中的服务卡要显示立即选择，
                // 并且取消置顶
                allServiceCardList.data.forEach(function (v, i) {
                    if (v.purchaseId === item.purchaseId) {
                        allServiceCardList.data[i]['selected'] = false;
                        item = allServiceCardList.data[i];
                        allServiceCardList.data.splice(i, 1);
                        allServiceCardList.data.push(item)
                    }
                });
                allServiceCardHtml = template('serviceCardsTpl', allServiceCardList);
                $('.allServiceCards_box').html(allServiceCardHtml);
            }
        }
    }

    //确认开单
    $('.addOrderBtn').on('click', function () {
        if (selectedServiceCardList.length === 0) {
            layer.msg('请选择服务项目！');
            return
        }
        var flag = false;
        var params = {
            "shopId": shopId,
            "merchantId": merchantId,
            // "accountId": accountId,
            "salesmanId": backUserId,
            "salesman": userName
        };
        var serviceCards = [];
        $('.selectedServiceCards_box ul li').each(function (i, v) {
            if (selectedServiceCardList[i].serviceType === 2 && !$(v).find('.serviceItem').attr('data-serviceid')) {
                layer.msg('请选择成长卡服务项目');
                serviceCards = [];
                return false
            }
            if ($(v).find('.selectServiceNum input').val() < 1 ||
                $(v).find('.selectServiceNum input').val() === '' ||
                $(v).find('.selectServiceNum input').val().indexOf('.') >= 0) {
                layer.msg('服务次数输入错误，请重新输入！');
                serviceCards = [];
                return false
            }
            if($(v).find('.extraCharge').val() > 0){
                flag = true
            }
            serviceCards.push({
                "serviceCardId": selectedServiceCardList[i].cardId, // -- 服务卡编号**必传**
                "serviceCardName": selectedServiceCardList[i].cardName, //-- 服务卡名称**必传**
                "remake": "备注",//-- 服务备注**必传**
                "waiterList":JSON.parse($(v).find('.waiter').attr('data-waiters')),
                //"waiterId": $(v).find('.waiter').attr('data-id'),//-- 技师编号**必传**
                //"waiterName": $(v).find('.waiter').html(),//-- 技师名**必传**
                "achievements": selectedServiceCardList[i].achievements,//-- 服务业绩**必传**
                "num": $(v).find('.selectServiceNum input').val(),//-- 服务次数**正整数必传**
                "serviceType": selectedServiceCardList[i].serviceType,//-- 服务卡类型【1:标准卡   2:成长卡】**必传**
                "price": $(v).find('.serviceItem').attr('data-price') ? $(v).find('.serviceItem').attr('data-price') : '',//-- 所选服务价格**serviceType=2必传**
                "serviceId": $(v).find('.serviceItem').attr('data-serviceid') ? $(v).find('.serviceItem').attr('data-serviceid') : '', // -- 所选服务编号**serviceType=2必传**
                "serviceName":  $(v).find('.serviceItem').html(),//-- 所选服务名称**必传**
                "purchaseId": selectedServiceCardList[i].purchaseId ,//-- 顾客服务卡编号**必传**
                "extraCharge":$(v).find('.extraCharge').val(),
                "consumerRelative":$(v).find('.userPeople').val()//亲朋
            })
        });
        if (serviceCards.length === 0) {
            return
        }
        params['serviceCards'] = serviceCards;
        getMemberList().done(function (res) {
            if(res.data.length > 1 && flag){
                selectMember(res,function (accoundId) {
                    params['accountId'] = accoundId;
                    reqAjaxAsync(REQUIRE_URL['quickChecks'], JSON.stringify(params)).done(function (res) {
                        if (res.code === 1) {
                            layer.msg('开单成功');
                            selectedServiceCardList = [];
                            $('.selectedServiceCards_box').html('');
                            $('.allServiceCards_box').find('.select_sure_btn').each(function (i, v) {
                                if ($(v).hasClass('cancelColor')) {
                                    $(v).removeClass('cancelColor').html('立即选择')
                                }
                                if (allServiceCardList.data[i].selected) {
                                    allServiceCardList.data[i].selected = false
                                }
                            });
                            sendMsg(res.data.presaleId)
                        } else {
                            layer.msg(res.msg);
                        }
                    })
                })
            }else{
                params['accountId'] = res.data[0].accountId;
                reqAjaxAsync(REQUIRE_URL['quickChecks'], JSON.stringify(params)).done(function (res) {
                    if (res.code === 1) {
                        layer.msg('开单成功');
                        selectedServiceCardList = [];
                        $('.selectedServiceCards_box').html('');
                        $('.allServiceCards_box').find('.select_sure_btn').each(function (i, v) {
                            if ($(v).hasClass('cancelColor')) {
                                $(v).removeClass('cancelColor').html('立即选择')
                            }
                            if (allServiceCardList.data[i].selected) {
                                allServiceCardList.data[i].selected = false
                            }
                        });
                        sendMsg(res.data.presaleId)
                    } else {
                        layer.msg(res.msg);
                    }
                })
            }
        })
    });

    //搜索客户服务卡
    $('#serviceCardKeyWord').on('keyup', function (e) {
        var keyword = $('#serviceCardKeyWord').val().trim();
        if (keyword === '' && e.keyCode === 13) {
            layer.msg('请输入您要搜索的卡项关键字')
        }
        if (keyword !== '' && e.keyCode == 13) {
            $('.allServiceCards_box').hide();
            $('.serviceCardsResult_box').html('').show();
            $('.deleBtn').show();
            getServiceCardList(memberId, keyword, 13);
            $(this).blur();
        }
        if (keyword === '') {
            $('.deleBtn').hide();
            $('.allServiceCards_box').show();
            $('.serviceCardsResult_box').hide();
        }
    });
    $('.deleBtn').on('click', function () {
        $('#serviceCardKeyWord').val('');
        $('.allServiceCards_box').show();
        $('.serviceCardsResult_box').hide();
        $(this).hide();
    });

    // 选择服务卡搜索结果中服务卡，并将选中的服务卡在左侧显示
    $('.serviceCardsResult_box').on('click', '.select_sure_btn', function () {
        selectServiceCard(this, true)
    })

    //获取客户亲朋列表
    function getMemberRelativeList(){
        var params = {
            memberId:memberId
        }
        reqAjaxAsync(REQUIRE_URL['memberRelative'],JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg);
                return
            }
            memberRelativeList = res.data;
        })
    }
    //获取客户所有子账户
    function getMemberList(){
        var defer = $.Deferred();
        var params = {
            memberId:memberId
        };
        reqAjaxAsync(REQUIRE_URL['memberList'],JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg);
                return
            }
            defer.resolve(res)
        })
        return defer.promise()
    }
    //选择子账户弹窗
    function selectMember(data,callBack){
        var html = template('memberList',data);
        layer.open({
            type:1,
            shade:0.5,
            shadeClose:true,
            title:'请选择消费账户',
            closeBtn:false,
            content:html,
            area:['50%','70%'],
            skin:'memberListBox',
            success:function (layeror, index) {
                $(layeror).on('click','.listBox ul li',function () {
                    callBack?callBack($(this).attr('data-accountid')):null;
                    layer.close(index)
                })
            }
        })
    }
    //开单成功往聊天室推送消息接口
    function sendMsg(orderNo){
        var userCode = sessionStorage.getItem('musercode');
        var params = {
            "orderNo": orderNo,
            "userCode": userCode,
            "shopId": shopId,
            "type":1
        };
        reqAjaxAsync(REQUIRE_URL['sendMsg'],JSON.stringify(params)).done(function (res) {
            console.log(res.msg);
        })
    }
});