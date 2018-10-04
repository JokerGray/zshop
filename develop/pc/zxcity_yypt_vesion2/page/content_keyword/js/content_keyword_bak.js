(function($) {
  //接口参数
  var CON_KEYWORD = {
    FINDKYEWORD : "operations/findScAdministrationKeyword", // 查询关键字
    UPDATEKEYWORD : "operations/updateScAdministrationKeyword", // 修改关键字
    ADDKEYWORD : "operations/addScAdministrationKeyword", // 新增关键字
    DELKEYWORD : "operations/deleteScAdministrationKeyword" // 删除关键字
   };
  

  layui.use(['table','laytpl'], function(){
    var table = layui.table;
    proTableINit();


    // 新增关键字弹窗
    $("#commonAdd").on("click",function(){
      layer.open({
        title: ['新增服务商', 'font-size:12px;background-color:rgb(66, 70, 81);color:#fff'],
        btn: ['保存', '取消'],
        type: 1,
        resize:false,
        shade: [0.1, '#fff'],
        content:$('#addKeywordPage'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
        area: ['800px', '545px'],
        closeBtn:1,
        offset: "auto",
      end:function(){
        $('#addKeywordPage').hide();
      },
      yes: function(layero, index){
        var messlen = $(".redtext.layui-show").length;
        if( messlen == 0){
          var keyword = cleardata();
          var adata = unique(keyword);
          var keyword = adata.join("#-#");

          console.log(keyword);
          var param = {
            keyword : keyword
          }
          reqAjaxAsync(CON_KEYWORD.ADDKEYWORD,JSON.stringify(param)).done(function(res){
            if(res.code == 1){
              console.log(res.code);
              proTableINit();
            }else{
              layer.msg(res.msg);
            }
          });
          layer.closeAll(); 
        }
        else{
          layer.alert("请更正后再保存");
        }
        
      }
      });
    });


    // 内容改变监听
    $("#keywordlist").on("input propertychange",".keyinput", function(e){ 
      var $this = $(this);
      var tval = $.trim($this.val());
      var keywordsArr = cleardata();
      var nary=keywordsArr.sort();

      ValidateValue($this);
      console.log(tval);
      // 匹配是否和之前输入有重复
      for(var i=0;i<keywordsArr.length;i++){
        if (nary[i]==nary[i+1]){
        $(this).parents(".layui-form-item").next(".redtext").removeClass("layui-hide").addClass("layui-show").text("不可输入重复关键字");
        }
        else{
          $(".redtext").removeClass("layui-show").addClass("layui-hide");
        }
      }
      // 匹配关键字库是否有重复
      // if( tval != ''){
      //   var param = {
      //     keyword : tval
      //   }
      //   reqAjaxAsync(CON_KEYWORD.ADDKEYWORD,JSON.stringify(param)).done(function(res){
      //     if(res.code == 1){
      //       console.log('1');
      //     }else{
      //       console.log(res.msg);
      //       $this.parents(".layui-form-item").next(".redtext").removeClass("layui-hide").addClass("layui-show").text(res.msg);
      //     }
      //   });
      // }

    });

    addinput();
    //移除输入框
    $("#keywordlist").on("click",".reducebtn", function(e){ 
      var len = $("#keywordlist").find(".itemcon").length;
      if( len > 1 ) {  
        $(this).parents('.itemcon').remove(); 
        len--; 
      }  
      return false;  
    });


 
    // 表格右侧操作按钮
    table.on('tool(keywordtable)', function(obj){
      var data = obj.data;
      var layEvent = obj.event;

      // 修改关键字
      if(layEvent === 'change'){

      }
      // 删除关键字
      else if(layEvent === 'del'){
        var param = {
          id : ''
        }
        reqAjaxAsync(CON_KEYWORD.DELKEYWORD,JSON.stringify(param)).done(function(res){
          if(res.code == 1){
            console.log('1');
          }else{
            console.log(res.msg);
            $this.parents(".layui-form-item").next(".redtext").removeClass("layui-hide").addClass("layui-show").text(res.msg);
          }
        });
      }

    });


    /*
    * FUN：添加关键字输入框 
    */
    function addinput(){
      var maxinputs = 10;  //最多一次添加个数
      var inputwrap   = $(".itemcon"); //文本输入框最外层div
      var x = inputwrap.length; //已有输入框个数
      var fieldcount = 1; //定义输入框id序号
      $("#addbtn").on("click",function(){
        if( x <= maxinputs ){
          fieldcount++;
          // var keyhtml = $("#itemid").html();
          var inputhtml = '<div class="itemcon">'+
          '              <div class="layui-form-item">'+
          '                <div class="layui-input-inline">'+
          '                  <input type="text" name="title" '+ 'id="field_'+ fieldcount + '"  placeholder="" autocomplete="off" class="keyinput layui-input" >'+
          '                </div>'+
          '                <a class="reducebtn layui-btn  layui-btn-primary">—</a>'+
          '              </div>'+
          '              <div class="redtext layui-hide">辅助文字</div>'+
          '            </div>'
          $("#keywordlist").append(inputhtml);
          x++;
        }
        else{
          layer.alert('最多可一次添加10个');
        }
        return false;
      });
    }

    /*
    * FUN：返回多个关键字数组
    */
    function cleardata(){
      var $inputlist = $("#keywordlist .itemcon .keyinput");
      var inputValArr = [],i;
      var len = $inputlist.length;
      $inputlist.each(function(index, element){
          inputValArr.push($.trim($(element).val()));
      });

      return inputValArr;
    }

    /*
    * FUN：去除数组中重复值
    */
    function unique(arr){
      var result = [];
      for(var i=0;i<arr.length;i++){
          if(result.indexOf(arr[i])==-1){
            result.push(arr[i])
        }
      }
      return result;
    }


    /*
    * FUN：获取关键字数据并填充表格
    */
    function proTableINit(){
      var param = {
        page : 1 ,
        keyword : '',
        rows : 10
      }

      reqAjaxAsync(CON_KEYWORD.FINDKYEWORD,JSON.stringify(param)).done(function(res){
        if(res.code == 1){
          var treeNodes=[],i,len=res.data.length;
          for(i=0;i<len;i++){
            treeNodes.push(res.data[i])
          }
          
          getTbl();

        }else{
          layer.msg(res.msg);
        }

      });
    }

    /*
    * FUN：渲染关键字表格
    * @param {*} keyword 
    */
    function getTbl(keyword){
      obj = tableInit('keywordtable', [
        [{
          title: '序号',
          align: 'left',
          field: 'eq',
          width: 60
        },{
          title: '关键字',
          align: 'left',
          field: 'keyword',
          width: 200
        }, {
          title: '创建时间',
          align: 'left',
          field: 'createTime',
          width: 200
        },{
          title: '备注',
          align: 'left',
          field:'remarks',
          width: 230
        },{
          title: '操作',
          fixed: 'right',
          align: 'left',
          toolbar: '#keywordBar',
          width: 440
        }]
      ],
      pageCallback
      );
    }
        
    /*
    * FUN：表格初始化
    * @param (string) tableId：表格 id 值
    * @param (array)  cols：表头设置
    * @method (function) pageCallback
    */
    function tableInit(tableId, cols, pageCallback) {
      var tableIns, tablePage;
      //表格配置
      tableIns = table.render({
        id: tableId,
        elem: '#' + tableId,
        height: 330,
        cols: cols,
        page: false,
        even: true,
        skin: 'row'
      });

      //第一次加载
      var res = pageCallback(1, 10);
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

      //使用layui分页组件
      layui.use('laypage');
      var laypage = layui.laypage;
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
          var resTwo = pageCallback(obj.curr, obj.limit, orgid);
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
      laypage.render(page_options);

      return {
        tablePage,
        tableIns
      };
    }


    /*
    * FUN：分页传参
    * @param (number) index：页码
    * @param (number)  cols：每页条数
    * @param (string) keyword：搜索关键字
    */
    function pageCallback(index, limit, keyword) {
      if(keyword == undefined){keyword = ''}
      var param = {
        page:index,
        rows:limit,
        providername :providername
      }
      return getData(CON_KEYWORD.FINDKYEWORD,JSON.stringify(param));
    }

    /*
    * FUN：遍历添加序号
    * @param (number) url:
    * @param (number)  parms:
    */
    function getData(url,parms){
      var res =reqAjax(url,parms);
      var data = res.data;
      $.each(data,function(i,item){
        $(item).attr('eq',(i+1));
      })
      return res;
    }
  });


})(jQuery);