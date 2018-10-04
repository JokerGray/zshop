(function($) {


  //接口参数
  var PROVIDER_URL = {
   ADDPROVIDER : "operations/addScThirdPartyServiceProvider", // 新增第三方服务商
   ADDSERIVICE : "operations/addScThirdPartyService", // 新增第三方服务
   CHANGEPROVIDER : "operations/updateScThirdPartyServiceProvider", // 修改第三方服务商信息
   CHANGESERIVICE : "operations/updateScThirdPartyService", // 修改第三方服务
   DELETEPROVIDER : "operations/deleteScThirdPartyServiceProvider", // 删除第三方服务商
   DELETSERIVICE : "operations/deleteScThirdPartyService", // 删除第三方服务
   SEARCHPROVIDER : "operations/findScThirdPartyServiceProvider", // 查询第三方服务商信息
   SEARCHSERVICE : "operations/findScThirdPartyService", // 查询第三方服务信息
   SERIVICEITEM : "operations/dictItemsGroupByType" // 服务商下对应分类
  };

  var layer = layui.layer;
  layui.use(['table','form'], function(){
    table = layui.table; 
    form = layui.form;
  });


  getSeriviceItem();
  proTableINit();
  // getSerTbl();

  // 新增服务商
  $('#commonAdd').on('click',function(){
    layer.open({
      title: ['新增服务商', 'font-size:12px;background-color:rgb(66, 70, 81);color:#fff'],
      btn: ['保存', '取消'],
      type: 1,
      resize:false,
      shade: [0.1, '#fff'],
      content:$('#addProviderPage'), 
      area: ['800px', '545px'],
      closeBtn:1,
      offset: "auto",
    end:function(){
      $('#addProviderPage').hide();
    },
    yes: function(layero, index){
      var proname = $("#proname").val();
      var proaccout = $("#proaccout").val();
      var propassword = $("#propassword").val();
      var remarks = $("#remarks").val();
      if( $("#remarks").val() == undefined ){ remarks = ""};

      
      if(isEmpty(proname)){
        return top.layer.alert("请填写服务商名称", {icon: 2});
      }else  if(isEmpty(proaccout)){
        return top.layer.alert("请填写账号", {icon: 2});
      }else if(isEmpty(propassword)){
        return top.layer.alert("请填写密码", {icon: 2});
      }


      var param = {
        accounts : proaccout,
        remarks : remarks,
        password : propassword,
        serviceProvider : proname
      }
      reqAjaxAsync(PROVIDER_URL.ADDPROVIDER,JSON.stringify(param)).done(function(res){
        if(res.code == 1){
          getTbl();
          // SerTableINit();
        }else{
          layer.msg(res.msg);
        }
      });
      layer.closeAll(); 
      $("#proname").val('');
      $("#proaccout").val('');
      $("#propassword").val('');
      $("#remarks").val('');
    }
    });
  });



  // 服务商右侧对应 操作按钮
  table.on('tool(protable)', function(obj){
    var data = obj.data;
    //点击行查看对应服务
    if( obj.event === 'viewserivce'){
      var serviceProvider = data.id;
      getSerTbl(serviceProvider);
    }
    //新增 应用
    else if(obj.event === 'add'){
      var serid = data.id;
      //保存开启关闭状态值
      var iswitch=2;
      form.on('switch(switchAdd)', function (data) {
        if(data.elem.checked){
          iswitch = 1;
        }else{
          iswitch = 2;
        }
        console.log(iswitch);
      });

      layer.open({
        title: ['新增应用', 'font-size:12px;background-color:rgb(66, 70, 81);color:#fff'],
        btn: ['保存', '取消'],
        type: 1,
        resize:false,
        shade: [0.1, '#fff'],
        content:$('#addserivce'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
        area: ['800px', '545px'],
        closeBtn:1,
        offset: "auto",
      end:function(){
        $('#addserivce').hide();
        $("#addserivce input").val('');
        $("#status").removeAttr('checked');
        form.render('checkbox');
        $("#seremarks").val('');
      },
      yes: function(layero, index){
        var serviceName = $.trim($("#serviceName").val());
        var category = $("#seriveItem").val();
        var categoryName = $("#seriveItem option:selected").text();        
        var status = iswitch;
        var seremarks = $.trim($("#seremarks").val());
        var serviceProviderId = serid;
        var appkey = $.trim($("#appkey").val());
        var appSecret = $.trim($("#appSecret").val());
        if( $("#remarks").val() == undefined ){ remarks = ""};
        
        if(isEmpty(serviceName)){
          return top.layer.alert("请填写应用名称", {icon: 2});
        }else if(category==0){
          return layer.msg("请选择应用类型")
        }else  if(isEmpty(appkey)){
          return top.layer.alert("请填写appkey", {icon: 2});
        }else if(isEmpty(appSecret)){
          return top.layer.alert("请填写appSecret", {icon: 2});
        }

        var param = {
          serviceName : serviceName,
          categoryName : categoryName,
          category : category,
          status : status,
          remarks : seremarks,
          serviceProviderId :serviceProviderId ,
          appSecret : appSecret,
          appKey : appkey
        }
        reqAjaxAsync(PROVIDER_URL.ADDSERIVICE,JSON.stringify(param)).done(function(res){
            if(res.code == 1){
              var serviceProvider = data.id;
              getSerTbl(serviceProvider);
            }else{
              layer.msg(res.msg);
            }
        });
        layer.closeAll(); 

        $("#addserivce input").val('');
        $("#status").removeAttr('checked');
        form.render('checkbox');
        $("#seremarks").val('');
      }
      });
    }
    //修改服务商
    else if(obj.event === 'change'){
      var data = obj.data;
      var providerid = data.id;
      $("#proname").val(data.serviceProvider);
      $("#proaccout").val(data.accounts);
      $("#propassword").val(data.password);
      $("#remarks").val(data.remarks);
      
      layer.open({
        title: ['修改服务商', 'font-size:12px;background-color:rgb(66, 70, 81);color:#fff'],
        btn: ['保存', '取消'],
        type: 1,
        resize:false,
        shade: [0.1, '#fff'],
        content:$('#addProviderPage'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
        area: ['800px', '545px'],
        closeBtn:1,
        offset: "auto",
        end:function(){
        $('#addProviderPage').hide();
        },
        yes: function(layero, index){
          var proname = $("#proname").val();
          var proaccout = $("#proaccout").val();
          var propassword = $("#propassword").val();
          var remarks = $("#remarks").val();
          if( $("#remarks").val() == undefined ){ remarks = ""};
          
          var param = {
            id : providerid,
            accounts : proaccout,
            remarks : remarks,
            password : propassword,
            serviceProvider : proname
          }
          reqAjaxAsync(PROVIDER_URL.CHANGEPROVIDER,JSON.stringify(param)).done(function(res){
            if(res.code == 1){
              var keywordtext = $("#providername").val();
              getTbl(keywordtext);
            }else{
              layer.msg(res.msg);
            }
          });
          layer.closeAll(); 
       }
      });
    }
    //删除
    else if(obj.event === 'del'){
      var id = data.id;
      layer.confirm(
        "删除本服务商会删除本服务商下所有应用，是否确认删除?",
        {icon: 3, title:'提示'},
        function(index){
          var paramDel = {
            id: id
          };
          reqAjaxAsync(PROVIDER_URL.DELETEPROVIDER,JSON.stringify(paramDel)).done(function(res){
            if (res.code == 1) {
              var providername = $("#providername").val();
              proTableINit();              
              // getTable(providername);
              SerTableINit(id);
              layer.msg("删除成功");
              layer.close(index);
            } else {
              layer.msg(res.msg);
            }
          });
        })
    }
  });


  //搜索条件搜索
  $('#searchbtn').on('click',function(){
    var providername=$.trim($("#providername").val());
    // sessionStorage.setItem('providername',providername);

    getTable(providername);
  });

  /**
   * FUN：获取 "新增应用" 对应分类，并渲染下拉框
   */
  function getSeriviceItem(){
    var param = {
      code : 'Ser_Class'
    }
    reqAjaxAsync(PROVIDER_URL.SERIVICEITEM,JSON.stringify(param)).done(function(res){
      if(res.code == 1){
        var data = res.data;
        var sHtmldept = '';
        $.each(data, function(i,item) {
          sHtmldept +="<option value='"+item.val+"'>"+item.name+"</option>";
        });
        $('#seriveItem').append(sHtmldept);
        form.render("select");
      }
    })
  }

  /*
  * FUN：获取服务商数据填充表格
  */
  function proTableINit(proid){
  var param = {
    page : 1 ,
    ServiceProvider : '',
    rows : 10
  }
  reqAjaxAsync(PROVIDER_URL.SEARCHPROVIDER,JSON.stringify(param)).done(function(res){
    if(res.code == 1){
      var treeNodes=[],i,len=res.data.length;
      for(i=0;i<len;i++){
        treeNodes.push(res.data[i])
      }

      getTbl(proid);
      $("#providerTable").siblings(".layui-table-view").find(".layui-table>tbody>tr:first-child").addClass("layui-table-click");
      // var providername = $("#providername").val();
      if( res.data[0] ){
        console.log(res.data);
        var profirstid = res.data[0].id;
        getSerTbl(profirstid);
      }else{
        // return top.layer.alert("目前无应用商数据，请添加", {icon: 2});
      }
    }else{
      layer.msg(res.msg);
    }
  });
  }

  /*
  * FUN：渲染服务商表格
  * @param {*} orgid 
  */
  function getTbl(orgid){
  obj = tableInit('providerTable', [
      [{
        title: '序号',
        align: 'left',
        field: 'eq',
        width: 60,
        event: 'viewserivce',
        style :'cursor: pointer'
      },
        {
        title: '服务商名称',
        align: 'left',
        field: 'serviceProvider',
        width: 200,
        event: 'viewserivce',
        style :'cursor: pointer'
      }, {
        title: '注册账号',
        align: 'left',
        field: 'accounts',
        width: 150,
        event: 'viewserivce',
        style :'cursor: pointer'
      },{
        title: '密码',
        align: 'left',
        field: 'password',
        width: 150,
        event: 'viewserivce',
        style :'cursor: pointer'
      },{
        title: '创建时间',
        align: 'left',
        field: 'createTime',
        width: 200,
        event: 'viewserivce',
        style :'cursor: pointer'
      },{
        title: '备注',
        align: 'left',
        field:'remarks',
        width: 130,
        event: 'viewserivce',
        style :'cursor: pointer'
      }, {
        title: '操作',
        fixed: 'right',
        align: 'left',
        toolbar: '#barDemo',
        width: 440
      }]
    ],
    pageCallback, orgid
  );
  }


  /* 服务商表格初始化
   * tableId: 表格id
   * cols: [] 表头
   * pageCallback: 同步调用接口方法
   * orgid :
   */
  function tableInit(tableId, cols, pageCallback, orgid) {
    var tableIns, tablePage;
    //1.表格配置
    tableIns = table.render({
      id: tableId,
      elem: '#' + tableId,
      height: 330,
      cols: cols,
      page: false,
      even: true,
      skin: 'row'
    });

    //2.第一次加载
    var res = pageCallback(1, 10,orgid);
    //第一页，一页显示10条数据
    if(res) {
      if(res.code == 1) {
        tableIns.reload({
         data: res.data
        })
        console.log(res.data);
        if(res.data[0]){
          SerTableINit(res.data[0].id);
        }
      } else {
        layer.msg(res.msg)
      }
    }

    //3.left table page
    layui.use('laypage');

    var page_options = {
      elem: 'laypageLeft',
      count: res ? res.total : 0,
      layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
      limits: [10, 30],
      limit: 10
    }
    page_options.jump = function(obj, first) {
      tablePage = obj;

      //首次不执行
      if(!first) {
        var resTwo = pageCallback(obj.curr, obj.limit,orgid);
        if(resTwo && resTwo.code == 1){
          tableIns.reload({
            data: resTwo.data
          });
        }
        else{
          layer.msg(resTwo.msg);
        }
      }
    }
    layui.laypage.render(page_options);
    return {
      tablePage,
      tableIns
    };
  }


  /**
   * FUN：遍历生成序号
   * @param {*} url 
   * @param {*} parms 
   */
  function getData(url,parms){
    var res =reqAjax(url,parms);
    var data = res.data;
    $.each(data,function(i,item){
      $(item).attr('eq',(i+1));
    })
    return res;
  }

  /**
   * FUN：服务商表格：带参
   * @param {*} index 页码 
   * @param {*} limit 几条
   * @param {*} providername 搜索关键字 
   */
  function pageCallback(index, limit , providername) {
  if(providername == undefined){providername = ''}
  var param = {
    page:index,
    rows:limit,
    ServiceProvider :providername
  }
  return getData(PROVIDER_URL.SEARCHPROVIDER,JSON.stringify(param));
  }

  /**
   * 加入入参回调
   * @param {string} providername 关键字
   */
  function getTable(providername){
    // var initPage = obj.tablePage;
    var initTable = obj.tableIns;
    var res = pageCallback(1, 10, providername);
    console.log(res.data.length);
    console.log(initTable);
    initTable.reload({ data : res.data });
    // 获取第一个服务商id，重新渲染服务表格
    var firstproid = res.data[0].id;
    SerTableINit(firstproid);

    layui.use('laypage');
    var page_options = {
      elem: 'laypageLeft',
      count: res ? res.total : 0,
      layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
      limits: [10, 30],
      limit: 10
    }
    page_options.jump = function(obj, first) {
      tablePage = obj;

      //首次不执行
      if(!first) {
        var resTwo = pageCallback(obj.curr, obj.limit,providername);
        if(resTwo && resTwo.code == 1)
          initTable.reload({
            data: resTwo.data
          });
        else
          layer.msg(resTwo.msg);
      }
    }
    layui.laypage.render(page_options);
  }





/**
 * 服务表格：第一次带参
 * @param {*} providerId 
 */
function SerpageCallback(providerId) {
  var param = {
    ServiceProvider:providerId
  }
  return getData(PROVIDER_URL.SEARCHSERVICE,JSON.stringify(param));
}

/**
 * 获取服务数据填充表格
 * @param {*} providerId 
 */
function SerTableINit(providerId){
  var param = {
    ServiceProvider : providerId
  }
  reqAjaxAsync(PROVIDER_URL.SEARCHSERVICE,JSON.stringify(param)).done(function(res){
    if(res.code == 1){
      var treeNodes=[],i,len=res.data.length;
      for(i=0;i<len;i++){
        treeNodes.push(res.data[i])
      }
      getSerTbl(providerId);
    }else{
      layer.msg(res.msg);
    }
  });
}

/*
 * FUN：渲染服务表格
 * @param {*} orgid 
 **/
function getSerTbl(prodiverid){
  serobj = SerivcetableInit('seriviceTable', [
    [{
      title: '序号',
      align: 'left',
      field: 'eq',
      width: 60
    },
      {
      title: '应用名称',
      align: 'left',
      field: 'serviceName',
      width: 200
    }, {
      title: 'AppKey',
      align: 'left',
      field: 'appKey',
      width: 150
    },{
      title: 'AppSecret',
      align: 'left',
      field: 'appSecret',
      width: 150
    },{
      title: '分类',
      align: 'left',
      field: 'categoryName',
      width: 150
    },{
      title: '创建时间',
      align: 'left',
      field: 'createTime',
      width: 200
    },{
      title: '备注',
      align: 'left',
      field:'remarks',
      width: 130
    }, {
      title: '操作',
      fixed: 'right',
      align: 'left',
      toolbar: '#serbarDemo',
      width: 440
    }]
  ],
  SerpageCallback, prodiverid
  );
}

/* 服务 表格初始化
* tableId:
* cols: []
* pageCallback: 同步调用接口方法
*/
function SerivcetableInit(tableId, cols, SerpageCallback , prodiverid) {
var tableIns, tablePage;
//1.表格配置
tableIns = table.render({
  id: tableId,
  elem: '#' + tableId,
  height: 350,
  cols: cols,
  page: false,
  even: true,
  skin: 'row',
  limit:100,
  limits:[100]
});

//2.第一次加载
var res = SerpageCallback(prodiverid);
//第一页，一页显示10条数据
if(res) {
  if(res.code == 1) {
    tableIns.reload({
      data: res.data
    })
  } else {
    layer.msg(res.msg)
  }
}

//3.left table page
// layui.use('laypage');

// var page_options = {
//   elem: 'laypageLeft',
//   count: res ? res.total : 0,
//   layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
//   limits: [10, 30],
//   limit: 10
// }
// page_options.jump = function(serobj, first) {
//   tablePage = serobj;

//   //首次不执行
//   if(!first) {
//     console.log(serobj.curr     +'___'  +serobj.limit);
//     var resTwo = pageCallback(serobj.curr, serobj.limit,orgid);
//     if(resTwo && resTwo.code == 1){
//       console.log(resTwo);
//       tableIns.reload({
//         data: resTwo.data
//       });
//     }
//     else{
//       layer.msg(resTwo.msg);
//     }
//   }
// }


// layui.laypage.render(page_options);

return {
  // tablePage,
  tableIns
};
}



//服务右侧按钮
table.on('tool(serivicetable)', function(obj){
  var data = obj.data;
  var layEvent = obj.event;

  //修改服务
  if(layEvent === 'change'){
    var serivceid = data.id;
    console.log(data);
    $("#serviceName").val(data.serviceName);
    $("#seriveItem").val(data.categoryName);
    $("#appkey").val(data.appKey);
    $("#appSecret").val(data.appSecret);
    $("#status").val(data.status);
    $("#seremarks").val(data.remarks);

    var iswitch = data.status;
    if(iswitch==1){
      $("#status").attr("checked", true);   
      form.render('checkbox');
    }

    form.on('switch(switchAdd)', function (data) {
      console.log(data.elem.checked);
      if(data.elem.checked){
        iswitch = 1;
      }else{
        iswitch = 2;
      }
    });

    var category=data.category;
    var select = 'dd[lay-value=' + category + ']';
    $('#seriveItem').siblings("div.layui-form-select").find('dl').find(select).click();

    form.render('select');

    layer.open({
      title: ['修改应用', 'font-size:12px;background-color:rgb(66, 70, 81);color:#fff'],
      btn: ['保存', '取消'],
      type: 1,
      resize:false,
      shade: [0.1, '#fff'],
      content:$('#addserivce'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
      area: ['800px', '545px'],
      closeBtn:1,
      offset: "auto",
     end:function(){
      $('#addserivce').hide();
      $("#addserivce input").val('');
      $("#status").removeAttr('checked');
      form.render('checkbox');
      $("#seremarks").val('');
     },
     yes: function(layero, index){
      var serviceProvider = data.serviceProviderId; 
      var sid = serivceid;
      var status = iswitch;
      var seremarks = $.trim($("#seremarks").val());
      var appSecret = $.trim($("#appSecret").val());
      var appkey = $.trim($("#appkey").val());
      var category = $("#seriveItem").val();
      var categoryName = $("#seriveItem option:selected").text();
      var serviceName = $.trim($("#serviceName").val());

      if(status==1){
        $("#status").attr("checked", true);   
        form.render('checkbox');     
      }else{
        $("#status").removeAttr('checked'); 
        form.render('checkbox');  
      }
      if( $("#remarks").val() == undefined ){ remarks = ""};

      if(isEmpty(serviceName)){
        return top.layer.alert("请填写应用名称", {icon: 2});
      }else if(category==0){
        return layer.msg("请选择应用类型")
      }else  if(isEmpty(appkey)){
        return top.layer.alert("请填写appkey", {icon: 2});
      }else if(isEmpty(appSecret)){
        return top.layer.alert("请填写appSecret", {icon: 2});
      }
      
      var param = {
        id : sid,
        status : status,
        remarks : seremarks,
        appSecret : appSecret,
        appKey : appkey,
        category : category,
        categoryName : categoryName,
        serviceName : serviceName
      }
      reqAjaxAsync(PROVIDER_URL.CHANGESERIVICE,JSON.stringify(param)).done(function(res){
        if(res.code == 1){
          SerTableINit(serviceProvider);
        }else{
          layer.msg(res.msg);
        }
      });
      layer.closeAll(); 
      
      $("#addserivce input").val('');
      $("#status").removeAttr('checked');
      form.render('checkbox');
      $("#seremarks").val('');
     }
    });
  }

  //删除服务
  else if(layEvent === 'del'){
    var id = data.id;
    var serviceProvider = data.serviceProviderId;
      layer.confirm(
        "确认删除?",
        {icon: 3, title:'提示'},
        function(index){
          var paramDel = {
            id: id
          };
          reqAjaxAsync(PROVIDER_URL.DELETSERIVICE,JSON.stringify(paramDel)).done(function(res){
            if (res.code == 1) {
              layer.msg("删除成功");
              layer.close(index);

              getSerTbl(serviceProvider);
            } else {
              layer.msg(res.msg);
            }
          });
        })
  }
  //开启关闭服务
  else if(layEvent === 'switchstatus'){
    var proid = data.serviceProviderId;
    console.log(proid);
    var status = data.status;
    var nowstatus;
    if( status === 1){
      nowstatus = 2;
    }else if( status === 2){
      nowstatus = 1;
    }
    var param = {
      id : data.id,
      status : nowstatus,
      remarks : data.seremarks,
      appSecret : data.appSecret,
      appKey : data.appkey,
      category : data.category,
      categoryName : data.categoryName,
      serviceName : data.serviceName
    }
    reqAjaxAsync(PROVIDER_URL.CHANGESERIVICE,JSON.stringify(param)).done(function(res){
      if(res.code == 1){
        SerTableINit(proid);
      }else{
        layer.msg(res.msg);
      }
    });
  }
});
// 检测是否为空
function isEmpty(obj){
  if (typeof obj == "undefined" || obj == null || obj == "") {
    return true;
  } else {
    return false;
  }
}
})(jQuery);