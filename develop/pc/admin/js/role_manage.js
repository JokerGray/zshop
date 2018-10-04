var laytpl = layui.laytpl, layer = layui.layer, laypage = layui.laypage;
var roleId = 0;
var role = function() {
    this.rows = 5;
    this.pages = 1;
    this.url = {
        inquireTable: 'querScCmsNewRoles',        //查询列表
        delRole: 'delScCmsNewRole',               //删除角色
        // newPermission: 'qCmsNewpermissions',      //查询权限菜单
        addRole: 'addScCmsNewRolePermission',      //添加角色
        inquirePri: 'queryCmsNewPermissionsByRoleId',   //查询角色所有的权限
        updateRole: 'updateScCmsNewRolePermission'     //修改角色
    }
    this.tableData = {
        scCmsNewRole: {},
        pagination: {
            page: 1,
            rows: this.rows
        }
    }
}
role.prototype = {
    inquirePri: function(d) {                 //渲染左侧权限菜单
        reqNewAjaxAsync(this.url.inquirePri, d).done(function(res){
            var data = res.data, str = '';
            if(!isNull(data)) {
                for(var i = 0; i < data.length; i++) {
                    if(data[i].isChecked == 1) {
                        str += 
                        "<li class='priModule'>"
                        +"<a class='priCheckBox priModeleA priModuleTit' href='javascript:;'><i class='arrow glyphicon glyphicon-triangle-bottom'></i>"+ data[i].name +"<i class='grandParentCheck checkBoxIcon active' myselfId='"+ data[i].id +"'></i></a>"
                        +"<ul class='priModuleUl hide'>";
                    } else {
                        str += 
                        "<li class='priModule'>"
                        +"<a class='priCheckBox priModeleA priModuleTit' href='javascript:;'><i class='arrow glyphicon glyphicon-triangle-bottom'></i>"+ data[i].name +"<i class='grandParentCheck checkBoxIcon' myselfId='"+ data[i].id +"'></i></a>"
                        +"<ul class='priModuleUl hide'>";
                    }
                    var sonData = data[i].children;
                    if(!isNull(sonData)) {
                        for(var k = 0; k < sonData.length; k++) {
                            if(sonData[k].isChecked == 1) {
                                str += 
                                "<li class='cur-p'>"
                                +"<a href='javascript:;' class='priCheckBox priModeleA priSonLi'><i class='arrow glyphicon glyphicon-triangle-bottom'></i>"+ sonData[k].name +"<i class='parentCheck checkBoxIcon active' myselfId='"+ sonData[k].id +"'></i></a>"
                                +"<ul class='prigrandSonUl hide'>";
                            } else {
                                str += 
                                "<li class='cur-p'>"
                                +"<a href='javascript:;' class='priCheckBox priModeleA priSonLi'><i class='arrow glyphicon glyphicon-triangle-bottom'></i>"+ sonData[k].name +"<i class='parentCheck checkBoxIcon' myselfId='"+ sonData[k].id +"'></i></a>"
                                +"<ul class='prigrandSonUl hide'>";
                            }
                            var grandsonData = sonData[k].children;
                            if(!isNull(grandsonData)) {
                                for(var j = 0; j < grandsonData.length; j ++) {
                                    if(grandsonData[j].isChecked == 1) {
                                        str += "<li><a href='javascript:;' class='priCheckBox prigrandSonLi'>"+ grandsonData[j].name +"<i class='sonCheck checkBoxIcon active' myselfId='"+ grandsonData[j].id +"'></i></a></li>";
                                    } else {
                                        str += "<li><a href='javascript:;' class='priCheckBox prigrandSonLi'>"+ grandsonData[j].name +"<i class='sonCheck checkBoxIcon' myselfId='"+ grandsonData[j].id +"'></i></a></li>";
                                    }
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
    inquireTab: function(d, flag) {          //渲染角色表格
        var _this = this;
        reqNewAjaxAsync(_this.url.inquireTable, d).done(function(res){
            if(res.code == 1) {
                var data = res.data || '';
                var total = res.total || '';
                _this.pages = Math.ceil(total / _this.rows);
                _this.pages > 1 ? $('#page').addClass('show').removeClass('hide') : $('#page').addClass('hide').removeClass('show');  
                var getTpl = $('#priTableList').html();
                if(!isNull(data)){
                    laytpl(getTpl).render(data, function(html){
                        $('#tableCon').html(html);
                    });
                    return flag ? _this.inquireTabPage(_this.pages, d) : false;
                } else {
                    $('#tableCon').html('');
                }
            } else {
                layer.msg(res.msg);
            }
        })
    },
    inquireTabPage: function(pages, d){      //角色表格分页
        var _this = this;
        laypage({
            cont: 'page', //容器。值支持id名、原生dom对象，jquery对象,
            pages: pages, //总页数
            skip: true, //是否开启跳页
            skin: '#2BC6FF',
            groups: 3, //连续显示分页数
            jump: function(obj) {
                d.pagination.page = obj.curr;
                _this.inquireTab(d, false);
            }
        }); 
    },
    operateRole: function(url, d) {          //添加角色
        var _this = this;
        reqNewAjaxAsync(url, d).done(function(res){
            layer.msg(res.msg);
            if(res.code == 1) {
                _this.tableData.pagination.page = 1;
                _this.inquireTab(_this.tableData, true);
                $('#confilmAddBtn').attr('data-dismiss', 'modal');
            } else {
                $('#confilmAddBtn').attr('data-dismiss', '');
            }
        })
    }
}
$(function() {
    var roleFunc = new role();

    //禁止在输入框输入空格
    inhibitTrim('#searchInp');
    inhibitTrim('#addPriName');

    //获取默认列表
    roleFunc.inquireTab(roleFunc.tableData, true);

    //搜索角色
    $('#search_icon').click(function() {
        var searchCon = $('#searchInp').val();
        var data = {
            scCmsNewRole: {
                name: searchCon
            },
            pagination: {
                page: 1,
                rows: roleFunc.rows
            }
        }
        roleFunc.inquireTab(data, true);
    })

    //删除角色
    $('#tableCon').on('click', '.labCancelIcon', function() {
        var uId = $(this).parent().parent().attr('uId');
        // roleFunc.delRole({uId: uId});
        layer.confirm('确认删除吗？', {
            title: "提示",
            btn: ['确认', '取消'],
            btn1: function (index, layero) {
                reqNewAjaxAsync(roleFunc.url.delRole, {uId: uId}).done(function(res){
                    layer.msg(res.msg);
                    if(res.code != 1) {return false};
                    if(res.code == 1) {
                        roleFunc.tableData.pagination.page = 1;
                        roleFunc.inquireTab(roleFunc.tableData, true);
                    }
                });
            }
        });
    })

    //权限菜单
    roleFunc.inquirePri({});
    //点击权限菜单切换显示隐藏
    $('#privilegeList').on('click', '.arrow', function() {
        $(this).toggleClass('.glyphicon-triangle-bottom').toggleClass('glyphicon-triangle-top');
        $(this).parent().siblings('ul').toggleClass('hide').toggleClass('show');
    })
    //点击多选框是否选中
    $('#privilegeList').on('click', '.checkBoxIcon', function() {
        var flag = true, pFlag = true;
        $(this).toggleClass('active');
        var childrens = $(this).parent().siblings('ul').find('.checkBoxIcon');
        var siblings = $(this).parent().parent().siblings().children('a').find('.checkBoxIcon');
        var parents = $(this).parent().parent().parent().siblings().find('.checkBoxIcon');
        var grandParent = parents.parent().parent().parent().siblings().find('.checkBoxIcon');
        if($(this).hasClass('active')) {
            childrens.addClass('active');
            parents.addClass('active');
            grandParent.addClass('active');
        } else {
            childrens.removeClass('active');
            siblings.each(function(i, e) {
                if($(e).hasClass('active')) {
                    flag = false;
                    console.log(e)
                }
            })
            if(flag) {
                parents.removeClass('active');
            }
            if($(this).parent().parent().parent().parent().parent().find('.checkBoxIcon').hasClass('active')) {
                pFlag = false;
            }
            if(pFlag) {
                grandParent.removeClass('active');
            }
        }
    })

    //新增角色
    //点击新增按钮加标示
    $('#addNewLabel').click(function() {
        $('.addPriTitle').html('新增角色');
        $('#confilmAddBtn').attr('flag', 0);
        beEmpty();
    })
    //点击修改按钮加标示
    $('#tableCon').on('click', '.synLabelIcon', function() {
        $('.addPriTitle').html('修改角色');
        $('#addPriName').val($(this).parent().siblings('.url').html());      //渲染原来的数据
        $('#isAvailabel').val($(this).parent().siblings('.priCode').attr('available'));      //渲染原来的数据
        $('#confilmAddBtn').attr('flag', 1);
        var uId = $(this).parent().parent().attr('uId');
        roleId = uId;
        roleFunc.inquirePri({uId: uId});
    })
    //点击保存操作的角色
    $('#confilmAddBtn').click(function() {
        var addPriName = $('#addPriName').val(), isAvailabel = $('#isAvailabel').val();
        if(!isNull(addPriName) && !isNull(isAvailabel)) {
            var flag = $(this).attr('flag');
            var data = {
                scCmsNewRole:{
                    Name: addPriName,
                    uId: '',
                    available: isAvailabel
                },
                scCmsNewRolePermission: []
            }
            $('.checkBoxIcon.active').each(function(i, e) {
                data.scCmsNewRolePermission.push({'cmsNewPermissionId': $(e).attr('myselfId')});
            })
            if(flag == 0) {
                data.scCmsNewRole.uId = '';
                roleFunc.operateRole(roleFunc.url.addRole, data);
            } else if(flag == 1) {
                data.scCmsNewRole.uId = roleId;
                roleFunc.operateRole(roleFunc.url.updateRole, data);
            }
            $('#confilmAddBtn').attr('data-dismiss', 'modal');
        } else {
            layer.msg('角色名称不能为空');
            $('#confilmAddBtn').attr('data-dismiss', '');
        }
    })
})

//置空所有选项
function beEmpty() {
    $('#addPriName').val('');
    $('#addPriName').val('');
    $('#privilegeList').find('.checkBoxIcon').removeClass('active');
}