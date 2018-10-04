var layer = layui.layer, laytpl = layui.laytpl, laypage = layui.laypage;
var myselfId = '0', parentid = '0', parentids = '0', availableId = 0;
var privilege = function() {
    this.rows = 5;
    this.pages = 1;
    this.url = {
        addPrivilege: 'addScCmsNewPermission',    //新增权限
        newPermission: 'qCmsNewpermissions',      //查询左侧权限菜单栏
        inquirePri: 'queryCmsNewPermissions',      //查询权限
        updatePri: 'updateScCmsNewPermission',      //修改权限
        deletePri: 'delScCmsNewPermission'         //删除权限
    };
    this.tableData = {
        cmsNewPermission: {
            parentid: 0                       //父级权限Id
        },
        pagination: {
            page: 1,
            rows: this.rows
        }
    }
}
privilege.prototype = {
    addPrivilege: function(d) {              //增加权限
        var _this = this;
        reqNewAjaxAsync(this.url.addPrivilege, d).done(function(res){
            layer.msg(res.msg);
            if(res.code != 1) {return false};
            if(res.code == 1) {
                $('#confilmAddBtn').attr('data-dismiss', 'modal');
                _this.inquirePri();
                _this.getPriTable(_this.tableData, true);
                updataPriSel();
            }
        })
    },
    inquirePri: function() {                 //渲染左侧权限菜单
        reqNewAjaxAsync(this.url.newPermission, {}).done(function(res){
            var data = res.data, str = '';
            if(!isNull(data)) {
                for(var i = 0; i < data.length; i++) {
                    str += 
                        "<li class='priModule'>"
                        +"<a class='priModeleA priModuleTit' href='javascript:;' myselfId='"+ data[i].id +"'><i class='arrow glyphicon glyphicon-triangle-bottom'></i>"+ data[i].name +"</a>"
                        +"<ul class='priModuleUl hide'>";
                    var sonData = data[i].children;
                    if(!isNull(sonData)) {
                        for(var k = 0; k < sonData.length; k++) {
                            str += 
                                "<li class='cur-p'>"
                                +"<a href='javascript:;' class='priModeleA priSonLi' myselfId='"+ sonData[k].id +"'><i class='arrow glyphicon glyphicon-triangle-bottom'></i>"+ sonData[k].name +"</a>"
                                +"<ul class='prigrandSonUl hide'>";
                            var grandsonData = sonData[k].children;
                            if(!isNull(grandsonData)) {
                                for(var j = 0; j < grandsonData.length; j ++) {
                                    str += "<li><a href='javascript:;' class='prigrandSonLi'>"+ grandsonData[j].name +"</a></li>";
                                }
                            }
                            str += '</ul>' + '</li>';
                        }
                    }
                    str += "</ul>" + "</li>";
                }
                $('#privilegeList').html(str);
            } else {
                $('#privilegeList').html('');
            }
        })
    },
    getPriTable: function(d, flag) {         //获取权限表格
        var _this = this;
        reqNewAjaxAsync(this.url.inquirePri, d).done(function(res){
            var data = res.data.cmsNewPermissions, total = res.data.total;
            _this.pages = Math.ceil(total / _this.rows);
            if(_this.pages > 1) {
                $('#page').removeClass('hide');
            } else {
                $('#page').addClass('hide');
            }
            if(!isNull(data)){
                var getTpl = $('#priTableList').html();
                laytpl(getTpl).render(data, function(html){
                    $('#tableCon').html(html);
                });
                if(_this.tableData.pagination.page < 2) {
                    var num = 0;
                    $('.numericalOrder').each(function(i, e) {
                        num++;
                        $(e).html(num);
                    })
                } else {
                    var num = (_this.tableData.pagination.page - 1) * 5;
                    $('.numericalOrder').each(function(i, e) {
                        num++;
                        $(e).html(num);
                    })
                }
                return flag ? _this.getPriTabPage(_this.pages, d) : false;
            } else {
                $('#tableCon').html('');
            }
        })
    },
    getPriTabPage: function(pages, d) {      //权限表格分页
        var _this = this;
        laypage({
            cont: 'page', //容器。值支持id名、原生dom对象，jquery对象,
            pages: pages, //总页数
            skip: true, //是否开启跳页
            skin: '#2BC6FF',
            groups: 3, //连续显示分页数
            jump: function(obj) {
                d.pagination.page = obj.curr;
                _this.getPriTable(d, false);
            }
        });  
    }
}
$(function(){
    var oprateFunc = new privilege(); 

    //禁止在输入框输入空格
    inhibitTrim('#searchInp');
    inhibitTrim('#addPriName');
    inhibitTrim('#addPriUrl');
    inhibitTrim('#addPriCode');
    inhibitTrim('#addPriImgUrl');
    inhibitTrim('#addPriInfo');
    
    //查询左侧权限菜单
    oprateFunc.inquirePri();
    
    //点击左侧菜单顶级权限按钮添加一级菜单
    $('#privilegeTop').click(function() {
        myselfId = $(this).attr('myselfId');
        parentids = '0';
        oprateFunc.tableData.cmsNewPermission.parentid = myselfId;
        oprateFunc.tableData.pagination.page = 1;
        oprateFunc.getPriTable(oprateFunc.tableData, true);
    })
    $('#privilegeTop').click();

    //点击左侧一级菜单
    $('#privilegeList').on('click', '.priModeleA', function() {
        myselfId = $(this).attr('myselfId');
        parentid = $(this).parent().parent().siblings().attr('myselfId');
        $(this).find('.arrow').toggleClass('.glyphicon-triangle-bottom').toggleClass('glyphicon-triangle-top');
        $(this).siblings('ul').toggleClass('hide').toggleClass('show');
        oprateFunc.tableData.cmsNewPermission.parentid = myselfId;
        oprateFunc.tableData.pagination.page = 1;
        oprateFunc.getPriTable(oprateFunc.tableData, true);
    })

    //点击三级菜单
    $('#privilegeList').on('click', '.prigrandSonLi', function() {
        myselfId = '';
    })

    //搜索权限
    $('#search_icon').click(function() {
        var searchCon = $('#searchInp').val();
        // if(isNull(searchCon)) {return layer.msg('搜索框不能为空')};
        var data = {
            cmsNewPermission: {
                name: searchCon
            },
            pagination: {
                page: 1,
                rows: oprateFunc.rows
            }
        }
        oprateFunc.getPriTable(data, true);
    })

    // 点击新增权限 、 点击修改权限
    $('#addNewLabel').click(function(){        //点击新增按钮置空
        $('.addPriTitle').html('新增权限');
        updataPriSel();
        $('#confilmAddBtn').attr('changeType', 0);
    })
    $('#confilmAddBtn').click(function(){
        var addPriName = delTrim($('#addPriName').val()), addPriType = $('#addPriType').val(), 
            addPriUrl = delTrim($('#addPriUrl').val()), addPriCode = delTrim($('#addPriCode').val()), 
            addPriImgUrl = delTrim($('#addPriImgUrl').val()), addPriInfo = delTrim($('#addPriInfo').val()),
            isAvailabel = $('#isAvailabel').val();
        if(!isNull(addPriName) && !isNull(addPriType) && !isNull(addPriCode) && !isNull(addPriUrl) && !isNull(isAvailabel)) {
            var changeType = $('#confilmAddBtn').attr('changeType');
            if(changeType == 0) {                      //增加权限
                console.log('增加');
                if(myselfId == '') {
                    layer.msg('已经到最底级了，不能再往下添加权限了');
                    return;
                };
                if(myselfId != 0) {
                    parentids = parentid + ',' + myselfId;
                }
                var data = {
                    name: addPriName,                  //权限名称
                    type: addPriType,                  //权限类型
                    url: addPriUrl,                    //地址
                    percode: addPriCode,               //权限编码
                    iconUrl: addPriImgUrl,             //图标
                    describe: addPriInfo,              //描述
                    parentid: myselfId,                //父级权限Id
                    parentids: parentids,              //父级权限字符串
                    sortstring: 1,                     //排序号
                    available: isAvailabel             //是否可用
                }
                oprateFunc.addPrivilege(data);
            } else if(changeType == 1) {               //修改权限
                var data = {
                    id: availableId,
                    name: delTrim($('#addPriName').val()),
                    type: $('#addPriType').val(),
                    url: delTrim($('#addPriUrl').val()),
                    percode: delTrim($('#addPriCode').val()),
                    available: $('#isAvailabel').val(),
                    iconUrl: delTrim($('#addPriImgUrl').val()),
                    describe: delTrim($('#addPriInfo').val())
                }
                reqNewAjaxAsync(oprateFunc.url.updatePri, data).done(function(res){
                    layer.msg(res.msg);
                    if(res.code != 1) {return $('#confilmAddBtn').attr('data-dismiss', '')};
                    if(res.code == 1) {
                        oprateFunc.tableData.pagination.page = 1;
                        oprateFunc.getPriTable(oprateFunc.tableData, true);
                        oprateFunc.inquirePri();
                    }
                });
            }
            $('#confilmAddBtn').attr('data-dismiss', 'modal');
        } else {
            layer.msg('请把必填项补齐');
            $('#confilmAddBtn').attr('data-dismiss', '');
        }
    })

    //点击修改权限按钮
    $('#tableCon').on('click', '.synLabelIcon', function() {
        $('.addPriTitle').html('修改权限');
        $('#addPriName').val($(this).parent().siblings('.labelNameText').html());
        $('#addPriUrl').val($(this).parent().siblings('.url').html());
        $('#addPriCode').val($(this).parent().siblings('.priCode').html());
        $('#addPriType').val($(this).parent().siblings('.channelName').html());
        $('#addPriImgUrl').val($(this).attr('iconUrl'));
        $('#addPriInfo').val($(this).attr('describe'));
        $('#confilmAddBtn').attr('changeType', 1);
        $('#isAvailabel').val($(this).attr('isAvailabel'));
        availableId = $(this).parent().parent().attr('id');
    })

    //删除权限
    $('#tableCon').on('click', '.labCancelIcon', function() {
        var priId = $(this).parent().parent().attr('id');
        layer.confirm('确认删除吗？', {
            title: "提示",
            btn: ['确认', '取消'],
            btn1: function (index, layero) {
                reqNewAjaxAsync(oprateFunc.url.deletePri, {id: priId}).done(function(res){
                    layer.msg(res.msg);
                    if(res.code != 1) {return false};
                    if(res.code == 1) {
                        oprateFunc.tableData.pagination.page = 1;
                        oprateFunc.getPriTable(oprateFunc.tableData, true);
                        oprateFunc.inquirePri();
                    }
                });
                
            }
        });
    })
})

//置空权限模态框的inp
function updataPriSel() {
    $('#addPriName').val('');
    $('#addPriType').val(''); 
    $('#addPriUrl').val(''); 
    $('#addPriCode').val(''); 
    $('#addPriImgUrl').val(''); 
    $('#addPriInfo').val('');
    $('#isAvailabel').val('1');
}