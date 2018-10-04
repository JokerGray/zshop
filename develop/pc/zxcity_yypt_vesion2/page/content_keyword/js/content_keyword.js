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
    // 搜索条件进行搜索
    $('#searchbtn').on('click',function(){
      var keywords=$.trim($("#keywords").val());
      sessionStorage.setItem('skeyword',keywords);
      getTable(keywords);
    });

    var x = $(".additem").length;
    // 新增关键字弹窗
    $("#commonAdd").on("click",function(){
      $(".keyinput").val('');
      layer.open({
        title: ['新增关键字', 'font-size:12px;background-color:rgb(66, 70, 81);color:#fff'],
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
          // 销毁后重置新增关键字 弹窗
          resetInput();
          x = $(".additem").length;
        },
        yes: function(layero, index){
          var redtext = $(".redtext").text().length;
          var repeattext = $(".repeattext").text().length;
          if( redtext == 0 && repeattext == 0 ){
            var keyword = cleardata();
            var adata = unique(keyword);
            var keyword = adata.join("#-#");
          
            var param = {
              keyword : keyword
            }
            if( param.keyword.length > 0 || param.keyword !=""){
              reqAjaxAsync(CON_KEYWORD.ADDKEYWORD,JSON.stringify(param)).done(function(res){
                if(res.code == 1){
                  var ikeyword = sessionStorage.getItem('skeyword');
                  getTable(ikeyword);
                }else{
                  layer.msg(res.msg);

                  console.log(res.msg);
                }
              });
             }
            layer.closeAll(); 
          }
          else{
            layer.alert("请更正后再保存");
          }
          
          // 销毁后重置新增关键字 弹窗
          resetInput();
          x = $(".additem").length;
        },
        cancel:function(){
          // 销毁后重置新增关键字 弹窗
          resetInput();
          x = $(".additem").length;
        }
        });
    });

    // 新增关键字输入框
    $("#addbtn").on("click",function(){
      if( x <= 10 ){
        var inputhtml = '<div class="additem itemcon">'+
        '              <div class="layui-form-item">'+
        '                <div class="layui-input-inline">'+
        '                  <input type="text" name="title" '+ 'id="field_'+ '"  placeholder="" autocomplete="off" class="keyinput layui-input" >'+
        '                </div>'+
        '                <a class="reducebtn layui-btn  layui-btn-primary">—</a>'+
        '              </div>'+
        '              <div class="redtext"></div>'+
        '              <div class="repeattext"></div>'+
        '            </div>'
        $("#keywordlist").append(inputhtml);
        x++;
        // console.log(x);
      }
      else{
        layer.alert('最多可一次添加10个');
      }
      return false;
    });



    // 批量删除
    $("#deletSomebtn").click(function () {
      deletAll();
    });
    var keyarr = [];
    // 内容改变监听
    // $("#keywordlist").on("change",".keyinput",maxLength(30));
    $("#keywordlist").on("change",".keyinput", function(e){ 
      var $this = $(this);
      var s = $.trim($this.val());

      if (s.indexOf("+") != -1 || s.indexOf("/") != -1 || s.indexOf("\\") != -1 || s.indexOf("?") != -1 || s.indexOf("？") != -1 || s.indexOf("%") != -1 || s.indexOf("#") != -1 || s.indexOf("&") != -1 || s.indexOf("=") != -1 || s.indexOf("(") != -1 || s.indexOf(")") != -1 || s.indexOf("（") != -1 || s.indexOf("）") != -1 || s.indexOf("{") != -1 || s.indexOf("}") != -1 || s.indexOf("\"") != -1 || s.indexOf("<") != -1 || s.indexOf(">") != -1 || s.indexOf("@") != -1 || s.indexOf("!") != -1 || s.indexOf("！") != -1 || s.indexOf("$") != -1 || s.indexOf(".") != -1 || s.indexOf(",") != -1 || s.indexOf("，") != -1 || s.indexOf("、") != -1 || s.indexOf(":") != -1 || s.indexOf("：") != -1 || s.indexOf(";") != -1 || s.indexOf("；") != -1 || s.indexOf("￥") != -1 || s.indexOf("*") != -1 || s.indexOf("~") != -1 || s.indexOf("`") != -1 || s.indexOf("-") != -1 || s.indexOf("——") != -1 || s.indexOf("_") != -1 || s.indexOf("^") != -1 || s.indexOf("“") != -1 || s.indexOf("”") != -1 || s.indexOf("‘") != -1 || s.indexOf("’") != -1 || s.indexOf("……") != -1 || s.indexOf("[") != -1 || s.indexOf("]") != -1 || s.indexOf("【") != -1 || s.indexOf("】") != -1){
        this.value = s.replace(new RegExp("[\\+,\\/,\\\\,\\?,\\？,\\%,\\#,\\&,\\=,\\(,\\),\\（,\\）,\\{,\\},\\',\\\",\\<,\\>,\\@,\\!,\\！,\\$,\\.,\\，,\\、,\\:,\\：,\\;,\\；,\\￥,\\*,\\~,\\`,\\-,\\——,\\_,\\^,\\“,\\”,\\‘,\\’,\\……,\\【,\\】,\\[,\\],\\,]", "gm"), ""); 
      }

      var tval = $.trim(s);

      if( keyarr.indexOf(tval) != -1 ){
        $(this).parents(".layui-form-item").siblings(".repeattext").text("不可输入重复关键字");
      }
      else{
        keyarr.push(tval);
        $(this).parents(".layui-form-item").siblings(".repeattext").text("");
      }

      // 匹配关键字库是否有重复
      if( tval == null || tval.length<=0 ){
        $this.parents(".layui-form-item").next(".redtext").text('');                
      }
      else{
        var param = {
          keyword : tval
        }
        reqAjaxAsync(CON_KEYWORD.FINDKYEWORD,JSON.stringify(param)).done(function(res){
          if(res.code == 1){
            console.log('11'+res.data.length);
            if(res.data.length == 0){
               $this.parents(".layui-form-item").next(".redtext").text('');                
            }else{
              $this.parents(".layui-form-item").next(".redtext").text('库中已存在名为' + tval +'的关键字');
            }
          }
        });
      }

    });

    //移除输入框
    $("#keywordlist").on("click",".reducebtn", function(e){ 
      var len = $("#keywordlist").find(".itemcon").length;
      if( len > 1 ) {  
        $(this).parents('.itemcon').remove(); 
        len--; 
      }  
      return false;  
    });
    // 修改关键字禁止输入特殊字符
    $("#updateKeywordPage").on("input propertychange",".keyinput", function(e){ 
      var $this = $(this);
      var s = $.trim($this.val());

      if (s.indexOf("+") != -1 || s.indexOf("/") != -1 || s.indexOf("\\") != -1 || s.indexOf("?") != -1 || s.indexOf("？") != -1 || s.indexOf("%") != -1 || s.indexOf("#") != -1 || s.indexOf("&") != -1 || s.indexOf("=") != -1 || s.indexOf("(") != -1 || s.indexOf(")") != -1 || s.indexOf("（") != -1 || s.indexOf("）") != -1 || s.indexOf("{") != -1 || s.indexOf("}") != -1 || s.indexOf("\"") != -1 || s.indexOf("<") != -1 || s.indexOf(">") != -1 || s.indexOf("@") != -1 || s.indexOf("!") != -1 || s.indexOf("！") != -1 || s.indexOf("$") != -1 || s.indexOf(".") != -1 || s.indexOf(",") != -1 || s.indexOf("，") != -1 || s.indexOf("、") != -1 || s.indexOf(":") != -1 || s.indexOf("：") != -1 || s.indexOf(";") != -1 || s.indexOf("；") != -1 || s.indexOf("￥") != -1 || s.indexOf("*") != -1 || s.indexOf("~") != -1 || s.indexOf("`") != -1 || s.indexOf("-") != -1 || s.indexOf("——") != -1 || s.indexOf("_") != -1 || s.indexOf("^") != -1 || s.indexOf("“") != -1 || s.indexOf("”") != -1 || s.indexOf("‘") != -1 || s.indexOf("’") != -1 || s.indexOf("……") != -1 || s.indexOf("[") != -1 || s.indexOf("]") != -1 || s.indexOf("【") != -1 || s.indexOf("】") != -1){
        this.value = s.replace(new RegExp("[\\+,\\/,\\\\,\\?,\\？,\\%,\\#,\\&,\\=,\\(,\\),\\（,\\）,\\{,\\},\\',\\\",\\<,\\>,\\@,\\!,\\！,\\$,\\.,\\，,\\、,\\:,\\：,\\;,\\；,\\￥,\\*,\\~,\\`,\\-,\\——,\\_,\\^,\\“,\\”,\\‘,\\’,\\……,\\【,\\】,\\[,\\],\\,]", "gm"), ""); 
      }
    });
 
    // 表格右侧操作按钮
    table.on('tool(keywordtable)', function(obj){
      var data = obj.data;
      var layEvent = obj.event;
      
      // 修改关键字
      if(layEvent === 'change'){
        var id = data.id;
        var keytext = data.keyword;
        $("#oldkeyword").val(keytext);
        $("#oldkeyword").maxLength(30);
        layer.open({
          title: ['修改关键字', 'font-size:12px;background-color:rgb(66, 70, 81);color:#fff'],
          btn: ['保存', '取消'],
          type: 1,
          resize:false,
          shade: [0.1, '#fff'],
          content:$('#updateKeywordPage'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
          area: ['600px', '200px'],
          closeBtn:1,
          offset: "auto",
        end:function(){
          $('#updateKeywordPage').hide();
        },
        yes: function(layero, index){
            var param = {
              id : id,
              keyword : $("#oldkeyword").val()
            }
            reqAjaxAsync(CON_KEYWORD.UPDATEKEYWORD,JSON.stringify(param)).done(function(res){
              if(res.code == 1){
              
                var ikeyword = sessionStorage.getItem('skeyword');
                getTable(ikeyword);
              }else{
                layer.msg(res.msg);
              }
            });
            layer.closeAll(); 
          }
        })
      }
      // 删除关键字
      else if(layEvent === 'del'){
        layer.confirm(
          "确认删除?",
          {icon: 3, title:'提示'},
          function(index){
            var id = data.id;
            var param = {
              id : id
            }
            reqAjaxAsync(CON_KEYWORD.DELKEYWORD,JSON.stringify(param)).done(function(res){
              if(res.code == 1){
                layer.msg("删除成功");
                layer.close(index);

                var ikeyword = sessionStorage.getItem('skeyword');
                getTable(ikeyword);
              }else{

              }
            });
          })
      }

    });


    /*
    * FUN：添加关键字输入框 
    */
    function addinput(inputnum){
      var maxinputs = 10;  //最多一次添加个数
      var inputwrap   = $(".additem"); //文本输入框最外层div
      var x = inputnum; //已有输入框个数
      var fieldcount = 1; //定义输入框id序号
      $("#addbtn").on("click",function(){
        if( x <= maxinputs ){
          fieldcount++;
          // var inputhtml = $("#itemid").html();
          var inputhtml = '<div class="additem itemcon">'+
          '              <div class="layui-form-item">'+
          '                <div class="layui-input-inline">'+
          '                  <input type="text" name="title" '+ 'id="field_'+ fieldcount + '"  placeholder="" autocomplete="off" class="keyinput layui-input" >'+
          '                </div>'+
          '                <a class="reducebtn layui-btn  layui-btn-primary">—</a>'+
          '              </div>'+
          '              <div class="redtext"></div>'+
          '              <div class="repeattext"></div>'+
          '            </div>'
          $("#keywordlist").append(inputhtml);
          x++;
          console.log(x);
        }
        else{
          layer.alert('最多可一次添加10个');
        }
        return false;
      });
    }
    /*
    * FUN：重新打开弹窗 - 关键字输入框重置
    */
    function resetInput(){
      var inputhtml = '<div class="additem itemcon">'+
      '              <div class="layui-form-item">'+
      '                <div class="layui-input-inline">'+
      '                  <input type="text" name="title" '+ 'placeholder="" autocomplete="off" class="keyinput layui-input" >'+
      '                </div>'+
      '                <a class="reducebtn layui-btn  layui-btn-primary">—</a>'+
      '              </div>'+
      '              <div class="redtext"></div>'+
      '              <div class="repeattext"></div>'+
      '            </div>'
      $("#keywordlist").html('').append(inputhtml);
    }
    /*
    * FUN：返回多个关键字数组
    */
    function cleardata(){
      var $inputlist = $("#keywordlist .itemcon .keyinput");
      var inputValArr = [],i;
      var len = $inputlist.length;
      $inputlist.each(function(index, element){
        var val = $(element).val();
        if( val ){
          inputValArr.push($.trim($(element).val()));
        }
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
    * FUN：批量删除
    */
    function deletAll() {
      var arr ="";
      $.each(layui.table.checkStatus('keywordtable').data, function(i, v){
        arr+=v.id+",";
      
      });

      if(arr.length=="0"){
        layer.msg("请先选中要删除的行");
      }else if(arr.length>0){
        var arr1 = arr.substring(0,arr.length-1);

        layer.confirm('确认删除选中的行吗', function(index){
          var d3 = {
            id:arr1,// 多个用户Id用逗号分隔
          };
          reqAjaxAsync(CON_KEYWORD.DELKEYWORD,JSON.stringify(d3)).done(function(res){
            if(res.code == 1){
              layer.msg(res.msg);
              layer.close(index);

              var ikeyword = sessionStorage.getItem('skeyword');
              getTable(ikeyword);
            }
          })
        });
      }
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
    function getTbl(){
      obj = tableInit('keywordtable', [
        [{checkbox: true},
          {
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
        },
        // {
        //   title: '备注',
        //   align: 'left',
        //   field:'remarks',
        //   width: 230
        // },
        {
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
    * FUN：加入 关键字 参数重新填充表格
    * @param {string} keyword 
    */
    function getTable(keyword){
      
      var initTable = obj.tableIns;
      var res = pageCallback(1, 10,keyword);
      initTable.reload({ data : res.data });
      layui.use('laypage');
      var page_options = {
        elem: 'laypageLeft',
        count: res ? res.total : 0,
        layout: ['count', 'prev', 'page', 'next', 'skip'],
        // limits: [10, 30],
        limit: 10
      }
      page_options.jump = function(obj, first) {
        tablePage = obj;

        //首次不执行
        if(!first) {
          var resTwo = pageCallback(obj.curr, obj.limit,keyword);
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


    /*
    * FUN：表格初始化
    * @param (string) tableId：表格 id 值
    * @param (array)  cols：表头设置
    * @method (function) pageCallback
    * @param (string)  keywords:关键字 
    */
    function tableInit(tableId, cols, pageCallback, keywords) {
      var tableIns, tablePage;
      //表格配置
      tableIns = table.render({
        id: tableId,
        elem: '#' + tableId,
        height: 530,
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
        layout: ['count', 'prev', 'page', 'next', 'skip'],
        // limits: [10, 30],
        limit: 10
      }
      page_options.jump = function(obj, first) {
        tablePage = obj;
      
        //首次不执行
        if(!first) {
          var resTwo = pageCallback(obj.curr, obj.limit,keywords);
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
        keyword :keyword
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


  // 限制输入字符长度
  jQuery.fn.maxLength = function(max){
    this.each(function(){
        var type = this.tagName.toLowerCase();
        var inputType = this.type? this.type.toLowerCase() : null;
        if(type == "input" && inputType == "text" || inputType == "password"){
            //Apply the standard maxLength
            this.maxLength = max;
      }
      else if(type == "textarea"){
          this.onkeypress = function(e){
              var ob = e || event;
              var keyCode = ob.keyCode;
              var hasSelection = document.selection? document.selection.createRange().text.length > 0 : this.selectionStart != this.selectionEnd;
              return !(this.value.length >= max && (keyCode > 50 || keyCode == 32 || keyCode == 0 || keyCode == 13) && !ob.ctrlKey && !ob.altKey && !hasSelection);
          };
          this.onkeyup = function(){
              if(this.value.length > max){
                  this.value = this.value.substring(0,max);
              }
          };
      }
  });
  }

})(jQuery);