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
  var laytpl = layui.laytpl;
  layui.use('form', function(){
    form = layui.form;
  })

  // 点击服务商行，显示对应服务
  layui.use('table', function(){
    var table = layui.table; 
  });

  // $("#iproviderTable").find(".layui-table-box>.layui-table-body>.layui-table>tbody>tr").click(function(){
  //   var id = $(this).last().text();
  //   console.log(id);
  // })



  // 新增服务商
  $('#commonAdd').on('click',function(){
    layer.open({
      title: ['新增服务商', 'font-size:12px;background-color:rgb(66, 70, 81);color:#fff'],
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
        accounts : proaccout,
        remarks : remarks,
        password : propassword,
        serviceProvider : proname
      }
      reqAjaxAsync(PROVIDER_URL.ADDPROVIDER,JSON.stringify(param)).done(function(res){
        if(res.code == 1){
          
        }else{
          layer.msg(res.msg);
        }
      });
      layer.closeAll(); 
     }
    });
  });

  //服务商下对应分类 数据
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
  getSeriviceItem();

  // 服务商右侧对应 操作按钮
  table.on('tool(protable)', function(obj){
    var data = obj.data;
    if( obj.event === 'viewserivce'){
      var serviceProvider = data.id;
      getSerTbl(serviceProvider);
    }
    //新增 应用
    else if(obj.event === 'add'){
      var serid = data.id;
      //保存开启关闭状态值
      var iswitch;
      form.on('switch(switchAdd)', function (data) {
        console.log(data.elem.checked);
        if(data.elem.checked){
          iswitch = 1;
        }else{
          iswitch = 2;
        }
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
            SerTableINit();
          }else{
            layer.msg(res.msg);
          }
        });
        layer.closeAll(); 
       }
      });
    }
    //修改服务商
    else if(obj.event === 'change'){
      var data = obj.data;
      var providerid = data.id;
      $("#proname").val(data.serviceProvider);
      
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
            proTableINit();
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
        "确认删除?",
        {icon: 3, title:'提示'},
        function(index){
          var paramDel = {
            id: id
          };
          reqAjaxAsync(PROVIDER_URL.DELETEPROVIDER,JSON.stringify(paramDel)).done(function(res){
            if (res.code == 1) {
              layer.msg("删除成功");
              layer.close(index);
              // var typ = $(".searchbutton").attr("data-type");
              var providername = $("#providername").val();
              getTable(providername);
            } else {
              layer.msg(res.msg);
            }
          });
        })
    }
  });




  //搜索条件进行搜索
  $('#searchbtn').on('click',function(){
    var providername=$.trim($("#providername").val());
    sessionStorage.setItem('providername',providername);
    getTable(providername);
  });

/*
 * FUN：获取服务商数据填充表格
 */
function proTableINit(){
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

      var providername = $("#providername").val();
        // sessionStorage.setItem('organizationId',organizationId);
        // sessionStorage.setItem('organizationIdone',organizationId);
        // $("#search").attr("data-id",organizationId);

        sessionStorage.setItem('providerFirstId',res.data[0].id);
        $("#commonAdd").attr("data-providername",providername);
        getTbl(providername);

    }else{
      layer.msg(res.msg);
    }

  });
}

proTableINit();
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
      pageCallback,'laypageLeft',orgid
  );
}


/* 服务商表格初始化
   * tableId:
   * cols: []
   * pageCallback: 同步调用接口方法
   */
  function tableInit(tableId, cols, pageCallback, test,orgid) {
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


//序号遍历
function getData(url,parms){
  var res =reqAjax(url,parms);
  var data = res.data;
  $.each(data,function(i,item){
    $(item).attr('eq',(i+1));
  })
  return res;
}

//服务商表格：第一次带参
function pageCallback(index, limit , providername) {
  if(providername == undefined){providername = ''}
  var param = {
    page:index,
    rows:limit,
    providername :providername
  }
  return getData(PROVIDER_URL.SEARCHPROVIDER,JSON.stringify(param));
}

//加入入参的回调方法
function getTable(providername){
  var initPage = obj.tablePage;
  var initTable = obj.tableIns;
  var res = pageCallback(1, 10,providername);
  initTable.reload({ data : res.data });
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





//服务表格：第一次带参
function SerpageCallback(providerId) {
  // 默认展示 第一个服务商下的服务
  // if( providerId == undefined){
  //   var providerId = sessionStorage.getItem("providerFirstId");
  //   providerId = providerId;
  // }

  var param = {
    ServiceProvider:providerId
  }
  return getData(PROVIDER_URL.SEARCHSERVICE,JSON.stringify(param));
}

//FUN：获取服务数据填充表格
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

      getSerTbl();

    }else{
      layer.msg(res.msg);
    }
  });
}


/* 
 * FUN：使用layTpl获取服务开启/关闭状态
 * data 数据
 * itpl tpl模板
 * eleid  需要填充的元素id
 * */
function tplGetStatus(data,itpl,eleid){
  console.log("2222");
  var serdata = data;
  var getTpl = itpl.innerHTML,
  view = document.getElementById(eleid);
  laytpl(getTpl).render(serdata, function(html){
   view.innerHTML = html;
  });
}




/*
 * FUN：渲染服务表格
 * @param {*} orgid 
 **/
function getSerTbl(prodiverid){
  obj = SerivcetableInit('seriviceTable', [
        [
        {
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
      SerpageCallback,'',prodiverid
  );
}

/* 服务 表格初始化
   * tableId:
   * cols: []
   * pageCallback: 同步调用接口方法
   */
  function SerivcetableInit(tableId, cols, SerpageCallback, test , prodiverid) {
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
    // page_options.jump = function(obj, first) {
    //   tablePage = obj;

    //   //首次不执行
    //   if(!first) {
    //     console.log(obj.curr     +'___'  +obj.limit);
    //     var resTwo = pageCallback(obj.curr, obj.limit,orgid);
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
getSerTbl();


//服务右侧按钮
table.on('tool(serivicetable)', function(obj){
  var data = obj.data;
  var layEvent = obj.event;

  //修改服务
  if(layEvent === 'change'){
    var serivceid = data.id;
    console.log(data);
    // tplGetStatus(data,changeserivceTpl,'changeserivce');  
    
    $("#serviceName").val(data.serviceName);
    $("#seriveItem").val(data.categoryName);
    $("#appkey").val(data.appKey);
    $("#appSecret").val(data.appSecret);
    $("#status").val(data.status);
    $("#seremarks").val(data.remarks);
    //服务商下对应分类 数据


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
     },
     yes: function(layero, index){
      var sid = serivceid;
      var status = $("#status").val();
      var seremarks = $.trim($("#seremarks").val());
      var appSecret = $.trim($("#appSecret").val());
      var appkey = $.trim($("#appkey").val());
      var category = $("#seriveItem").val();
      var categoryName = $("#seriveItem option:selected").text();
      var serviceName = $.trim($("#serviceName").val());

      if( $("#remarks").val() == undefined ){ remarks = ""};

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
          SerTableINit();
        }else{
          layer.msg(res.msg);
        }
      });
      layer.closeAll(); 
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
    var status = data.status;
    var nowstatus;
    console.log(status);
    if( status === 1){
      nowstatus = 0;
    }else if( status === 0){
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
        SerTableINit();
      }else{
        layer.msg(res.msg);
      }
    });

  }

});




})(jQuery);