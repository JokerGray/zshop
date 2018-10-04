$(function () {

    // 默认刷新第一页
    function reload(){


        var dataList={
            page:1,
            size:10
        }
        var dataAll=reqAjax("operations/userList",JSON.stringify(dataList));
        var data = dataAll.data;
        var layer = layui.laypage;
        var nums = 10; //每页出现的数据量

        //模拟渲染
        var render = function(data, curr){
            var arr = []
            // ,thisData = data.concat().splice(curr*nums-nums, nums);
                ,thisData = data;
            layui.each(thisData, function(index, item){
                arr.push('<li>'+ item +'</li>');
            });
            return arr.join('');
        };

        //调用分页
        layer({
            cont: 'paging-box',
            first: false,
            last: false,
            prev: '<', //若不显示，设置false即可
            next: '>',
            total:dataAll.total,
            pages: Math.ceil(dataAll.total/nums), //得到总页数
            curr: function(){ //通过url获取当前页，也可以同上（pages）方式获取
                var page = location.search.match(/page=(\d+)/);
                return page ? page[1] : 1;
            }(),
            jump: function(obj,first){
                var dataList={
                    page:obj.curr,
                    size:10,
                }
                //console.log(obj.curr)
                var dataAll=reqAjax("operations/userList",JSON.stringify(dataList));
                var data=dataAll.data;
                // console.log(data)
                var roleData={
                    page:1,
                    rows:1000
                }
                var role=reqAjax("operations/roleList",JSON.stringify(roleData))
                // console.log(role.data)
                var user = '';
                var roleId,roleName;
                for(var i = 0; i<data.length;i++){
                    if(data[i].roles!=""){
                        roleId =data[i].roles[0].id||"";
                        roleName=data[i].roles[0].name||"";
                        // console.log(roleId+"================"+roleName)
                    }else{
                        roleId="";
                        roleName=""
                    }

                    if(data[i].status==1){
                        user+=`<tr>
                        <td style="display:none;" user-id=`+data[i].id+`>`+data[i].id+`</td>
                        <td userId=`+(i+1)+`>`+(i+1)+`</td>
                        <td user-name=`+data[i].name+`>`+data[i].name+`</td>
                        <td user-uname=`+data[i].uname+`>`+data[i].uname+`</td>
                        <td user-sex=`+data[i].sex+`>`+data[i].sex+`</td>
                        <td user-phone=`+data[i].phone+`>`+data[i].phone+`</td>
                        <td user-roles=`+roleId+`>`+roleName+`</td>

                        <td>
                        <div class="btn-group" data-toggle="buttons-radio" user-status=`+data[i].status+`>
                    <button type="button" class="btn btn1">锁定</button>
                        <button type="button" class="btn btn2 enable">启用</button>
                        </div>
                        </td>
                        <td><span>`+data[i].createTime+`</span></td>
                        <td user-orgno="`+data[i].orgno+`" style="display:none;"></td>
                        <td class="row remove-modifier">
                        <div class="edUser" data-toggle="modal" data-target="#add-newuser">
                        <button class="btn-md editUser">
                        <i class="edicticon"></i>
                        <span>修改</span>
                        </button>
                        </div>
                        <div class="delUser">
                        <button class="btn-md deleteUser">
                        <i class="glyphicon glyphicon-minus-sign"></i>
                        <span>删除</span>
                        </button>
                        </div>
                        <div>
                        <button class="btn resetBtn">重置密码</button>
                        </div>
                        </td>
                        <td user-pic="`+data[i].userpic+`"  style="display:none"></td>
                        </tr>`
                    }else {

                        user+=`<tr>
                        <td style="display:none;" user-id=`+data[i].id+`>`+data[i].id+`</td>
                        <td userId=`+(i+1)+`>`+(i+1)+`</td>
                        <td user-name=`+data[i].name+`>`+data[i].name+`</td>
                        <td user-uname=`+data[i].uname+`>`+data[i].uname+`</td>
                        <td user-sex=`+data[i].sex+`>`+data[i].sex+`</td>
                        <td user-phone=`+data[i].phone+`>`+data[i].phone+`</td>
                        <td user-roles=`+roleId+`>`+roleName+`</td>
                        <td>
                        <div class="btn-group" data-toggle="buttons-radio" user-status=`+data[i].status+`>
                    <button type="button" class="btn btn1 lock">锁定</button>
                        <button type="button" class="btn btn2">启用</button>
                        </div>
                        </td>
                        <td><span>`+data[i].createTime+`</span></td>
                        <td user-orgno="`+data[i].orgno+`" style="display:none;"></td>
                        <td class="row remove-modifier">
                        <div class="edUser" data-toggle="modal" data-target="#add-newuser">
                        <button class="btn-md editUser">
                        <i class="edicticon"></i>
                        <span>修改</span>
                        </button>
                        </div>
                        <div class="delUser">
                        <button class="btn-md deleteUser">
                        <i class="glyphicon glyphicon-minus-sign"></i>
                        <span>删除</span>
                        </button>
                        </div>
                        </div>
                        <div>
                        <button class="btn resetBtn">重置密码</button>
                        </div>
                        </td>
                        <td user-pic="`+data[i].userpic+`"  style="display:none"></td>
                        </tr>`
                    }

                }


                $("#userBody").html(user);
                document.getElementById('paging-box-count').innerHTML = render(data, obj.curr);
                $('#paging-box-count').html('共'+ obj.pages +'页，每页'+nums+'条，总数'+ obj.total + "条");
                if(!first){ //一定要加此判断，否则初始时会无限刷新
                    location.href = '?page='+obj.curr;
                }
            }
        });
    }
    reload();
    /* 重置密码 */
    $("#content").on("click"," .table .remove-modifier .resetBtn",function () {
        var $this =$(this).parent().parent().siblings();
        var uId = $this.eq(0).attr("user-id");
        var update_id=sessionStorage.getItem("userId");
        var data = {
            id:uId,
            update_id:update_id
        }
        layer.confirm("确认重置密码？",{icon:0,title:"提示"}, function () {
            var a =reqAjax("operations/resetUserPwd",JSON.stringify(data));
            //window.location.reload();
            console.log(a);
            layer.msg("密码重置成功",{time:500});
        })
    })


    /* 查询用户 */
    $("#searchUser").on("click", function () {
        var name = $("#searchName").val();
        var phone = $("#searchPhone").val();
        var userType = $("#userTypeSelector").val();
        var param = {
            page:1,
            size:10,
            uname:name,
            phone:phone,
            isAdmin:userType
        }
        var res = reqAjax("operations/userList",JSON.stringify(param));

        if(res.code == 1){
            //显示列表
            if(res.data.length==0){
                $('#userBody').html("");
                $('#paging-box').html("");
                $("#paging-box-count").html('总数0条');
            }else{
                var content = showUserList(res);

                $('#userBody').html(content);

                //以下代码为分页功能
                var layer = layui.laypage;
                console.log(layer);
                //模拟渲染
                var render = function(data, curr){
                    var arr = []
                        ,thisData = res;
                    layui.each(thisData, function(index, item){
                        arr.push('<li>'+ item +'</li>');
                    });
                    return arr.join('');
                };
                //调用分页
                layer({
                    cont: 'paging-box'
                    //,groups: 10
                    ,first: false
                    ,last: false
                    ,prev: '<' //若不显示，设置false即可
                    ,next: '>'
                    ,pages: Math.ceil(res.total/param.size) //得到总页数
                    ,total:res.total
                    ,curr: function(){ //通过url获取当前页，也可以同上（pages）方式获取
                        var page = location.search.match(/page=(\d+)/);
                        return page ? page[1] : 1;
                    }()
                    ,jump: function(obj,first){

                        var pageNo = obj.curr;
                        param['page'] = pageNo;

                        var res = reqAjax("operations/userList",JSON.stringify(param));
                        if(res.code == 1){
                            var content = showUserList(res);
                            $('#userBody').html(content);

                            document.getElementById('paging-box-count').innerHTML = render(res.data, obj.curr);
                        }

                        $('#paging-box-count').html('共'+ obj.pages +'页，每页'+param.size+'条，总数'+obj.total+'条');
                    }
                });
            }

        }
    });

    function showUserList(search){
        var tData = search.data;
        var tdataLength = tData.length;
        var user;
        var roleId,roleName;
        for(var i = 0; i<tdataLength;i++){

            if(tData[i].roles!=""){
                roleId =tData[i].roles[0].id||"";
                roleName=tData[i].roles[0].name||"";
            }else{
                roleId="";
                roleName=""
            }
            if(tData[i].status=="1"){
                user+=`<tr>
                <td style="display:none;" user-id=`+tData[i].id+`>`+tData[i].id+`</td>
                <td userId=`+(i+1)+`>`+(i+1)+`</td>
                <td user-name=`+tData[i].name+`>`+tData[i].name+`</td>
                <td user-uname=`+tData[i].uname+`>`+tData[i].uname+`</td>
                <td user-sex=`+tData[i].sex+`>`+tData[i].sex+`</td>
                <td user-phone=`+tData[i].phone+`>`+tData[i].phone+`</td>
                <td user-roles=`+roleId+`>`+roleName+`</td>
                <td>
                <div class="btn-group" data-toggle="buttons-radio" user-status=`+tData[i].status+`>
            <button type="button" class="btn btn1">锁定</button>
                <button type="button" class="btn btn2 enable">启用</button>
                </div>
                </td>
                <td><span>`+tData[i].createTime+`</span></td>
                <td user-orgno="`+tData[i].orgno+`" style="display:none;"></td>
                <td class="row remove-modifier">
                <div class="edUser" data-toggle="modal" data-target="#add-newuser">
                <button class="btn-md editUser">
                <i class="edicticon"></i>
                <span>修改</span>
                </button>
                </div>
                <div class=" delUser">
                <button class="btn-md deleteUser">
                <i class="glyphicon glyphicon-minus-sign"></i>
                <span>删除</span>
                </button>
                </div>
                <div >
                <button class="btn resetBtn">重置密码</button>
                </div>
                </td>
                <td user-pic="`+tData[i].userpic+`"  style="display:none"></td>
                </tr>`
            }else{
                user+=`<tr>
                <td style="display:none;" user-id=`+tData[i].id+`>`+tData[i].id+`</td>
                <td userId=`+(i+1)+`>`+(i+1)+`</td>
                <td user-name=`+tData[i].name+`>`+tData[i].name+`</td>
                <td user-uname=`+tData[i].uname+`>`+tData[i].uname+`</td>
                <td user-sex=`+tData[i].sex+`>`+tData[i].sex+`</td>
                <td user-phone=`+tData[i].phone+`>`+tData[i].phone+`</td>
                <td user-roles=`+roleId+`>`+roleName+`</td>
                <td>
                <div class="btn-group" data-toggle="buttons-radio" user-status=`+tData[i].status+`>
            <button type="button" class="btn btn1 lock">锁定</button>
                <button type="button" class="btn btn2">启用</button>
                </div>
                </td>
                <td><span>`+tData[i].createTime+`</span></td>
                <td user-orgno="`+tData[i].orgno+`" style="display:none;"></td>
                <td class="row remove-modifier">
                <div class=" edUser" data-toggle="modal" data-target="#add-newuser">
                <button class="btn-md editUser">
                <i class="edicticon"></i>
                <span>修改</span>
                </button>
                </div>
                <div class=" delUser">
                <button class="btn-md deleteUser">
                <i class="glyphicon glyphicon-minus-sign"></i>
                <span>删除</span>
                </button>
                </div>
                <div>
                <button class="btn resetBtn">重置密码</button>
                </div>
                </td>
                <td user-pic="`+tData[i].userpic+`"  style="display:none"></td>
                </tr>`
            }
        }
        return user;
    }

    //    新增用户
    var newUser =`<div class="modal-dialog">
    <div class="modal-content">
    <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×
    </button>
    <h4 class="modal-title" id="myModalLabel">新增用户</h4>
    </div>
    <div class="modal-body">
    <form class="bs-example bs-example-form" role="form">
    <div class="input-group">
    <span class="input-group-addon">用户账号:</span>
    <input type="text" class="form-control name" maxlength="18" onkeyup="this.value=this.value.replace(/[\u4e00-\u9fa5]/g,'')">
    <span><i>* </i> 输入4-18个字符，推荐使用字母开头数字下划线</span>
    </div>
    <br>
    <div class="input-group">
    <span class="input-group-addon">密码:</span>
    <input type="text" class="form-control pw" value="123456" disabled="disabled">
    <span><i>* </i> 默认密码</span>
    </div>
    <br>
    <div class="input-group">
    <span class="input-group-addon">手机号码:</span>
    <input class="form-control phone" onkeyup="this.value=this.value.replace(/[^0-9.]/g,'');" maxlength="11" type="text" />
    <span><i>* </i> 请输入11位数的手机号码</span>
    </div>
    <br>
    <div class="input-group">
    <span class="input-group-addon">姓名:</span>
    <input type="text" class="form-control uname" maxlength="10">
    </div>
    <br>
    <div class="input-group">
    <span class="input-group-addon">性别:</span>
    <select id="basic1" class="selectpicker show-tick form-control sex">
    <option>男</option>
    <option data-subtext="option subtext">女</option>
    </select>
    </div>
    <br>

    <div class="input-group">
    <span class="input-group-addon">部门:</span>
    <ul id="treeDemo1" class="ztree" ></ul>
    </div>
    <br>

    <div class="input-group">
    <span class="input-group-addon">是否锁定:</span>
    <select id="basic2" class="selectpicker show-tick form-control isLock">
    <option>否</option>
    <option data-subtext="option subtext">是</option>
    </select>
    </div>
    <br>

    <div class="input-group">
    <span class="input-group-addon">角色:</span>
    <select id="basic3" class="selectpicker show-tick form-control uRole">
    </select>
    </div>
    <br>
    <div class="input-group" id="contentLabel">
    <span class="input-group-addon">上传头像:</span>
    <img src="common/image/user.png" class="signform-face-img"  />
    <label class="btn signform-face-btn uploadLabel" id="uploadLabel">
    <input type="hidden" class="file-hidden" name="subscriptionImgUrl"/></label>
    <div class="signform-face-text"><br />最大5M，200x200像素</div>
    </div>
    <br>
    <div class="input-group">
    <span class="input-group-addon">是否创建云信:</span>
    <div class="radio">
    <label>
    <input id="yx" type="checkbox" name="yx">
    </label>
    </div>
    </div>
    <br>
    </form>
    </div>
    <div class="modal-footer">
    <button type="button" class="btn btn-primary close-btn" id="saveNew" data-dismiss="modal">
    保存
    </button>
    </div>
    </div>
    </div>`

    // ========
    /*新增用户*/

    $("#newRole").on("click", function () {
        $("#add-newuser").html(newUser);
        // 树形============================================
        var setting = {
            check: {
                enable: true,
                chkStyle: "radio",
                radioType: "all"
            },
            data: {
                simpleData: {
                    enable: true
                }
            }
        };
        var data={};
        var tree=reqAjax("operations/organizationNodes",JSON.stringify(data))
        // console.log(tree)
        var treeNodes=[],i,len=tree.data.nodes.length;
        for(i=0;i<len;i++){
            treeNodes.push(tree.data.nodes[i])
        }
        // console.log(treeNodes)
        var treeObj = $.fn.zTree.init($("#treeDemo1"), setting, treeNodes);
        // console.log(treeObj)
        // ================================================
        // ============角色================
        var roleData={
            page:1,
            rows:1000
        }
        var roleList=reqAjax("operations/roleList",JSON.stringify(roleData))
        // console.log(roleList)
        var role,i=0,data=roleList.data;
        var len=data.length;
        for(;i<len;){
            role+=`<option data-id=`+data[i].id+`>`+data[i].name+`</option>`
                i++;
        }

        $("#basic3").html(role)
        var uRole;/*用户角色*/
        $("#basic3").on("change",function(){
            var $this=$(this).children()
            for(var i=0;i<$this.length;i++){
                if($this[i].innerText==$(this).val()){
                    uRole=$this[i].getAttribute("data-id")
                }
            }
        })
        // ================================
        $("#saveNew").on("click", function () {
            var name = $("#add-newuser").find(".name").val();/*新增用户 账号*/
            var uname = $("#add-newuser").find(".uname").val();/*姓名*/
            var sex = $("#add-newuser").find(".sex").val();/*性别*/
            var userPic = $("#contentLabel img").attr("src");/*头像*/
            var radioval = $("input[type='checkbox']").is(':checked');
            var registerNIM = "0";
            if(radioval){
                registerNIM = "1";
            }

            console.log(userPic)
            var uPho =$("#add-newuser").find(".phone").val();
            if(!uRole){
                uRole=$("#basic3").children().eq(0).attr("data-id")
            }

            var status =$("#add-newuser").find(".isLock").val();/*是否锁定*/
            console.log(status)
            if(status == "否"){
                status = 1;
            }else{
                status = 2;
            }
            //获取选中树形id
            var nodes = treeObj.getCheckedNodes(true);
            var resourceTree ;
            $.each(nodes, function(i, item){
                // 这是单选 后期要复选再改
                resourceTree=item.id
            });
            if(name.length<4){
                layer.msg("账号请输入最少4位数");
                return false
            }else if(name.indexOf(" ")>=0){
                layer.msg("账号不能包含空格");
                return false
            }else if(uPho.length<1){
                layer.msg("请输入手机号码");
                return false
            }else if(!/^1[0-9]{10}$/.exec(uPho)){
                layer.msg("请输入正确的手机号码")
                return false
            }else if(uname.length<1){
                layer.msg("姓名不能为空")
                return false
            }else if(!resourceTree){
                layer.msg("请选择部门")
                return false
            }
            var parent_id =sessionStorage.getItem("userId");
            var data = {
                name:name,
                uname:uname,
                sex:sex,
                birthday:"",
                phone:uPho,
                userpic:userPic,
                roleIds:uRole,
                orgno:resourceTree,
                status:status,
                parent_id:parent_id,
                registerNIM:registerNIM //是否注册云信
            }
           var data_user = reqAjax("operations/addUser",JSON.stringify(data));
            if(data_user.code==1){
                window.location.reload();
            }else{
                layer.msg(data_user.msg);
            }

        })



        //在上传按钮绑定事件开始========================
        var uploaderLabel = new plupload.Uploader({
            runtimes: 'html5,flash,silverlight,html4',
            browse_button: 'uploadLabel',
            container: document.getElementById('contentLabel'),
            //flash_swf_url: 'common/lib/plupload-2.1.2/js/Moxie.swf',
            flash_swf_url: '../common/assets/plupload-2.1.2/js/Moxie.swf',
            silverlight_xap_url: '../common/assets/plupload-2.1.2/js/Moxie.xap',
            url: 'http://oss.aliyuncs.com',
            filters: {
                mime_types: [ //只允许上传图片和zip,rar文件
                    { title: "Image files", extensions: "jpg,gif,png,bmp" }
                ],
                max_file_size: '10mb', //最大只能上传10mb的文件
                prevent_duplicates: true //不允许选取重复文件
            },

            init: {
                PostInit: function() {},

                FilesAdded: function(up, files) {
                    set_upload_param(uploaderLabel, '', false); //上传到阿里云
                },

                BeforeUpload: function(up, file) {
                    check_object_radio();
                    set_upload_param(up, file.name, true);
                },

                UploadProgress: function(up, file) {},

                FileUploaded: function(up, file, info) {
                    if (info.status == 200) {
                        var urls = "http://zxcity-app.oss-cn-hangzhou.aliyuncs.com" + "/" + get_uploaded_object_name(file.name);
                        console.log(file.name);
                        var imgName = file.name; //图片名字
                        imgName = imgName.substr(0, imgName.indexOf('.'));

                        var img = new Image();
                        //图片宽高
                        var width;
                        var height;
                        img.onload = function() {
                            width = this.width;
                            height = this.height;
                            this.onload = null;
                            var imgEle = "<img src='" + urls + "' width='110' height='110' name='" + imgName + "' ysWidth='" + width + "' ysHeight='" + height + "'>";
                            $(".signform-face-img").attr("src", urls);
                        };
                        img.src = urls;
                    } else {
                        document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = info.response;
                    }
                },

                Error: function(up, err) {
                    if (err.code == -600) {
                        document.getElementById('console').appendChild(document.createTextNode("\n选择的文件太大了,可以根据应用情况，在upload.js 设置一下上传的最大大小"));
                    } else if (err.code == -601) {
                        document.getElementById('console').appendChild(document.createTextNode("\n选择的文件后缀不对,可以根据应用情况，在upload.js进行设置可允许的上传文件类型"));
                    } else if (err.code == -602) {
                        document.getElementById('console').appendChild(document.createTextNode("\n这个文件已经上传过一遍了"));
                    } else {
                        document.getElementById('console').appendChild(document.createTextNode("\nError xml:" + err.response));
                    }
                }
            }
        });
        uploaderLabel.init();
        //在上传按钮绑定事件结束========================

    })



    //修改 编辑
    var editRole =`<div class="modal-dialog">
    <div class="modal-content">
    <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×
    </button>
    <h4 class="modal-title" id="myModalLabel">修改用户</h4>
    </div>
    <div class="modal-body" id="editUser">
    <form class="bs-example bs-example-form" role="form">
    <div class="input-group">
    <span class="input-group-addon">用户账号:</span>
    <input type="text" class="form-control name" maxlength="18" onkeyup="this.value=this.value.replace(/[\u4e00-\u9fa5]/g,'')">
    <span><i>* </i> 输入4-18个字符，推荐使用字母开头数字下划线</span>
    </div>
    <br>
    <div class="input-group">
    <span class="input-group-addon">手机号码:</span>
    <input class="form-control phone" onkeyup="this.value=this.value.replace(/[^0-9.]/g,'');" maxlength="11" type="text" />
    <span><i>* </i> 请输入11位数的手机号码</span>
    </div>
    <br>
    <div class="input-group">
    <span class="input-group-addon">姓名:</span>
    <input type="text" class="form-control uname" maxlength="4">
    </div>
    <br>
    <div class="input-group">
    <span class="input-group-addon">性别:</span>
    <select id="basic1" class="selectpicker show-tick form-control sex">
    <option>男</option>
    <option data-subtext="option subtext">女</option>
    </select>
    </div>
    <br>

    <div class="input-group">
    <span class="input-group-addon">部门:</span>
    <ul id="treeDemo" class="ztree"></ul>
    </div>
    <br>

    <div class="input-group">
    <span class="input-group-addon">是否锁定:</span>
    <select id="basic2" class="selectpicker show-tick form-control isLock">
    <option>否</option>
    <option data-subtext="option subtext">是</option>
    </select>
    </div>
    <br>

    <div class="input-group">
    <span class="input-group-addon">角色:</span>
    <select id="basic3" class="selectpicker show-tick form-control uRole">

    </select>
    </div>
    <br>

    <div class="input-group" id="contentLabel">
    <span class="input-group-addon">更改图像:</span>
    <img src="common/image/user.png" class="signform-face-img"  />
    <label class="btn signform-face-btn uploadLabel" id="uploadLabel">
    <input type="hidden" class="file-hidden" name="subscriptionImgUrl"/></label>
    <div class="signform-face-text"><br />最大5M，200x200像素</div>
    </div>

    <br>
    </form>
    </div>
    <div class="modal-footer">
    <button type="button" class="btn btn-primary close-btn" id="saveEdit" data-dismiss="modal">
    保存
    </button>
    </div>
    </div>
    </div>`

    /* 修改 */
    $("#userBody").on("click",".edUser",function () {

        $("#add-newuser").html(editRole);

        var $this=$(this).parent().siblings();
        var roleId =$this.eq(0).attr("user-id");
        var name = $this.eq(2).attr("user-name");
        var uname = $this.eq(3).attr("user-uname");
        var sex =$this.eq(4).attr("user-sex");
        var uRole =$this.eq(6).attr("user-roles");
        var uStatus=$this.eq(7).children("div").attr("user-status");
        var uPho=$this.eq(5).attr("user-phone")
        var userPic=$this.eq(10).attr("user-pic")
        // ======状态开启否=======
        if(uStatus=="1"){
            $("#basic2").val("否")
        }else{
            $("#basic2").val("是")
        }
        // console.log(uStatus)
        // console.log($("#basic2").val())
        // ------------------------
        var orgno=$this.eq(9).attr("user-orgno")


        // ===============树形=============================
        var setting = {
            check: {
                enable: true,
                chkStyle: "radio",
                radioType: "all"
            },
            data: {
                simpleData: {
                    enable: true
                }
            }
        };
        var data={};
        var tree=reqAjax("operations/organizationNodes",JSON.stringify(data))
        // console.log(tree)
        var treeNodes=[],i,len=tree.data.nodes.length;
        for(i=0;i<len;i++){
            treeNodes.push(tree.data.nodes[i])
        }
        // console.log(treeNodes)
        var treeObj = $.fn.zTree.init($("#treeDemo"), setting, treeNodes);
        // ================================================
        // ============获取选中树形（部门）=================
        var nodes = treeObj.getCheckedNodes(false);
        // console.log(nodes)
        var resourceTree ;
        $.each(nodes, function(i, item){
            // 这是单选 后期要复选再改
            // console.log(item.id)
            // resourceTree=item.id
            if(orgno==item.id){
                //item.checked=true
                treeObj.checkNode(item, true, false);
            }
            // if(item.checked && !item.children){
            //     console.log(item);
            //     resourceTree.push(item.id);
            //     resourceTree.push(item.children.id)
            // }
        });
        // =================================================
        // ============角色================
        var roleData={
            page:1,
            rows:1000
        }
        var roleList=reqAjax("operations/roleList",JSON.stringify(roleData))
        // console.log(roleList)
        var role,i=0,data=roleList.data;
        var len=data.length,uRolename;
        for(;i<len;){
            role+=`<option data-id=`+data[i].id+`>`+data[i].name+`</option>`
                if(uRole==data[i].id){
                    uRolename=data[i].name
                }
            i++;
        }

        $("#basic3").html(role)
        $('#basic3').val(uRolename)
        var uRole;/*用户角色*/
        $("#basic3").on("change",function(){
            console.log($(this).val())
            var $this=$(this).children()
            console.log($this)
            // console.log($this.length)
            for(var i=0;i<$this.length;i++){
                if($this[i].innerText==$(this).val()){
                    // console.log($this[i].getAttribute("data-id"))
                    uRole=$this[i].getAttribute("data-id")
                    console.log(uRole)
                }
            }
        })
        // ================================
        var $input =$("#editUser input");
        // console.log($input)
        $input.eq(0).val(name);
        $input.eq(1).val(uPho);
        $input.eq(2).val(uname)
        $("#basic1").val(sex);
        //  sex1=$("#basic1").val()
        // console.log(sex1)
        // sex = sex=="1"?"男":"女";
        // console.log(userPic)
        $("#contentLabel img").attr("src",userPic)

        $("#saveEdit").on("click", function () {
            var name =$input.eq(0).val();
            var userP = $input.eq(1).val();
            var uname =$input.eq(2).val();
            // var sex =$input.eq(3).val();
            // 性别
            var sex=$("#basic1").val();
            // sex = sex=="男"?"1":"2";
            var uPic=$("#contentLabel img").attr("src")
            // 是否锁定 
            var status =$("#add-newuser").find(".isLock").val();/*是否锁定*/
            if(status == "否"){
                status = 1;
            }else{
                status = 2;
            }
            // var uPic = $input.eq(7).val();
            // console.log(uPic)
            // ====================
            //获取选中树形id
            var nodes = treeObj.getCheckedNodes(true);
            console.log(nodes)
            var resourceTree ;
            $.each(nodes, function(i, item){
                // 这是单选 后期要复选再改
                resourceTree=item.id
                // if(item.checked && !item.children){
                //     console.log(item);
                //     resourceTree.push(item.id);
                //     resourceTree.push(item.children.id)
                // }
            });
            // function checkChk(){
            //     alert(1)
            // }
            // $('body').on('click',"#treeDemo>li>ul>li>ul>li",checkChk)
            if(name.length<4){
                layer.msg("账号请输入最少4位数");
                return false
            }else if(name.indexOf(" ")>=0){
                layer.msg("账号不能包含空格");
                return false
            }else if(userP.length<1){
                layer.msg("请输入手机号码");
                return false
            }else if(!/^1[0-9]{10}$/.exec(userP)){
                layer.msg("请输入正确的手机号码")
                return false
            }else if(uname.length<1){
                layer.msg("姓名不能为空")
                return false
            }else if(!resourceTree){
                layer.msg("请选择部门")
                return false
            }
            var update_id=sessionStorage.getItem("userId");
            // ==============================
            var data = {
                id:roleId,
                name:name,
                uname:uname,
                sex:sex,
                phone:userP,
                userpic:uPic,
                roleIds:uRole,
                orgno:resourceTree,
                status:status,
                update_id:update_id
            }
            //修改当前用户头像，刷新缓存头像
            if(name==sessionStorage.getItem("username")){
                sessionStorage.setItem("userImg",uPic)
            }

            var o=reqAjax("operations/updateUser",JSON.stringify(data));
            window.location.reload();
            // console.log(o)
            // console.log(data);
        })

        //在上传按钮绑定事件开始========================
        var uploaderLabel = new plupload.Uploader({
            runtimes: 'html5,flash,silverlight,html4',
            browse_button: 'uploadLabel',
            container: document.getElementById('contentLabel'),
            //flash_swf_url: 'common/lib/plupload-2.1.2/js/Moxie.swf',
            flash_swf_url: '../common/assets/plupload-2.1.2/js/Moxie.swf',
            silverlight_xap_url: '../common/assets/plupload-2.1.2/js/Moxie.xap',
            url: 'http://oss.aliyuncs.com',
            filters: {
                mime_types: [ //只允许上传图片和zip,rar文件
                    { title: "Image files", extensions: "jpg,gif,png,bmp" }
                ],
                max_file_size: '10mb', //最大只能上传10mb的文件
                prevent_duplicates: true //不允许选取重复文件
            },

            init: {
                PostInit: function() {},

                FilesAdded: function(up, files) {
                    set_upload_param(uploaderLabel, '', false); //上传到阿里云
                },

                BeforeUpload: function(up, file) {
                    check_object_radio();
                    set_upload_param(up, file.name, true);
                },

                UploadProgress: function(up, file) {},

                FileUploaded: function(up, file, info) {
                    if (info.status == 200) {
                        var urls = "http://zxcity-app.oss-cn-hangzhou.aliyuncs.com" + "/" + get_uploaded_object_name(file.name);
                        console.log(file.name);
                        var imgName = file.name; //图片名字
                        imgName = imgName.substr(0, imgName.indexOf('.'));

                        var img = new Image();
                        //图片宽高
                        var width;
                        var height;
                        img.onload = function() {
                            width = this.width;
                            height = this.height;
                            this.onload = null;
                            var imgEle = "<img src='" + urls + "' width='110' height='110' name='" + imgName + "' ysWidth='" + width + "' ysHeight='" + height + "'>";
                            $(".signform-face-img").attr("src", urls);
                        };
                        img.src = urls;
                    } else {
                        document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = info.response;
                    }
                },

                Error: function(up, err) {
                    if (err.code == -600) {
                        document.getElementById('console').appendChild(document.createTextNode("\n选择的文件太大了,可以根据应用情况，在upload.js 设置一下上传的最大大小"));
                    } else if (err.code == -601) {
                        document.getElementById('console').appendChild(document.createTextNode("\n选择的文件后缀不对,可以根据应用情况，在upload.js进行设置可允许的上传文件类型"));
                    } else if (err.code == -602) {
                        document.getElementById('console').appendChild(document.createTextNode("\n这个文件已经上传过一遍了"));
                    } else {
                        document.getElementById('console').appendChild(document.createTextNode("\nError xml:" + err.response));
                    }
                }
            }
        });
        uploaderLabel.init();
        //在上传按钮绑定事件结束========================
    })

    /*锁定、启用 按钮切换*/
    $("#content").on("click",".table td .btn-group .btn",function () {
        var $this=$(this).parent().parent().siblings()
        var roleId =$this.eq(0).attr("user-id");
        if($(this).hasClass("btn1")){
            $(this).parent().attr("user-status","2");
            $(this).addClass("lock");
            $(this).siblings("button").removeClass("enable");
            //status=0;
        }else if($(this).hasClass("btn2")){
            $(this).parent().attr("user-status","1");
            $(this).addClass("enable");
            $(this).siblings("button").removeClass("lock");
            //status=1;
        }
        var status=$(this).parent().attr("user-status");
        //console.log($(this).parent().attr("user-status"))
        //console.log($(this).attr("data"))
        /*用户状态变更 */
        console.log(roleId);
        var update_id=sessionStorage.getItem("userId");
        console.log(update_id);
        var data={
            id:roleId,
            status:status,
            update_id:update_id
        }
        var a =reqAjax("operations/userStatus",JSON.stringify(data));
        console.log(a);
        //window.location.reload();
    });
});


$(function () {
    /* 删除用户 */
    $("#userBody").on("click",'.delUser',function () {
        var $this=$(this).parent().siblings();
        var usersId =$this.eq(0).attr("user-id");
        var data = {
            ids:usersId
        }
        layer.confirm("确认删除？",{icon:3,title:"提示"}, function () {
            reqAjax("operations/delUser",JSON.stringify(data));;
            $this.parent().remove();
            location.reload(true);
            layer.close();
        })
    })
    //如果当前页全都删除时 默认跳转至首页
    /*if($("#userBody").html()==false){
     console.log(1)
     layer.open({
     content: '跳转至首页',
     yes: function(index, layero){
     location.href=location.href.split("?")[0]
     layer.close(index); //如果设定了yes回调，需进行手工关闭
     }
     });
     }*/

})
$(function(){



//=============================================上传开始代码================================================================
    var userId = sessionStorage.getItem("userId");
    var subscriptionType = "0";
    //上传头像
    var apikey = sessionStorage.getItem('apikey') || "test"; //获取缓存 通行证码
    var version = sessionStorage.getItem('version') || "1"; //获取缓存 版本号

    var accessid = '',
        accesskey = '',
        host = '',
        policyBase64 = '',
        signature = '',
        callbackbody = '',
        filename = '',
        key = '',
        expire = 0,
        g_object_name = '',
        g_object_name_type = '',
        now = timestamp = Date.parse(new Date()) / 1000;

    function send_request() {
        var xmlhttp = null;
        if (window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        if (xmlhttp != null) {
            serverUrl = getHP() + 'zxcity_restful/ws/oss/ossUpload';
            xmlhttp.open("POST", serverUrl, false);
            xmlhttp.send(null);
            return xmlhttp.responseText
        } else {
            alert("Your browser does not support XMLHTTP.");
        }
    };

    function check_object_radio() {
        var tt = document.getElementsByName('myradio');
        for (var i = 0; i < tt.length; i++) {
            if (tt[i].checked) {
                g_object_name_type = tt[i].value;
                break;
            }
        }
    }

    function get_signature() {
        //可以判断当前expire是否超过了当前时间,如果超过了当前时间,就重新取一下.3s 做为缓冲
        now = timestamp = Date.parse(new Date()) / 1000;
        if (expire < now + 3) {
            body = send_request()
            var obj = eval("(" + body + ")");
            host = obj['host']
            policyBase64 = obj['policy']
            accessid = obj['accessid']
            signature = obj['signature']
            expire = parseInt(obj['expire'])
            callbackbody = obj['callback']
            key = obj['dir']
            return true;
        }
        return false;
    };

    function random_string(len) {　　
        len = len || 32;　　
        var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';　　
        var maxPos = chars.length;　　
        var pwd = '';　　
        for (i = 0; i < len; i++) {　　
            pwd += chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    }

    function get_suffix(filename) { //得到文件名的后缀
        pos = filename.lastIndexOf('.')
        suffix = ''
        if (pos != -1) {
            suffix = filename.substring(pos)
        }
        return suffix;
    }

    function calculate_object_name(filename) //得到文件是本地名还是随机名
    {
        g_object_name = g_object_name + '/' + "${filename}"
        return ''
    }

    function get_uploaded_object_name(filename) {
        tmp_name = g_object_name
        tmp_name = tmp_name.replace("${filename}", filename);
        return tmp_name
    }

    function set_upload_param(up, filename, ret) {
        if (ret == false) {
            ret = get_signature()
        }
        g_object_name = key; //目录
        if (filename != '') {
            suffix = get_suffix(filename) //得到后缀
            calculate_object_name(filename) //得到本地或者随机名
        }
        new_multipart_params = {
            'key': g_object_name,
            'policy': policyBase64,
            'OSSAccessKeyId': accessid,
            'success_action_status': '200', //让服务端返回200,不然，默认会返回204
            'callback': callbackbody,
            'signature': signature,
        };

        up.setOption({
            'url': host,
            'multipart_params': new_multipart_params
        });

        up.start();
    }
    //=============================================上传结束代码================================================================
})
