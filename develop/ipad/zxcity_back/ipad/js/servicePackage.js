(function($){
    //初始化编辑框
    initKindEditor();

    //服务卡名称下拉
    function changeSelect(){
        if($(".card-detail").hasClass("actve")){
            $(".card-detail").removeClass("actve");
        }else{
            $(".card-detail").addClass("actve");
        }
    }

    $(".service-card-input").click(function(){
        changeSelect();
    });

    //选择下拉框的列表
    function selectVal(event){
        var cardName = event.find('td').eq(1).text();
        var cardPrice = event.find('td').eq(2).text();
        var cardId = event.attr("data-serviceId");//获取当前选择的id
        $(".card-detail").removeClass("actve");//隐藏下拉框
        $(".card-id").val(cardName);//插入选择的名称
        $("#servicePrice").val(cardPrice);//插入选择的价格
        $(".card-id").attr("data-serviceId",cardId);
    }

    $(".card-detail-table tbody").on('click','tr',function(){
        var $this = $(this);
        selectVal($this);
    });

//计算总价格
    function calcPrice(){
        var total = 0;
        $("input[name^='add-cardPrice']").each(function(index) {
            total += Number($(this).val());
        });

        $("#packageActualPrice").val(total);
    }
    //添加每条的初始方法
    function addDetail(id,name,num,price){//可传id，name为名称，num为数量，price为价格
        var sHtml = "";
        sHtml += '<tr data-serviceId="' + id + '">' +
                    '<td>' + name + '</td>' +
                    '<td>' + num + '</td>' +
                    '<td>' + '<input class="add-cardPrice" name="add-cardPrice" class="form-control required"  type="text"  value="' + price + '">' + '</td>' +
                    '<td>' + '<button class="delBtn btn btn-primary dim" type="button" >删除</button>' + '</td>' +
                '</tr>';
        $(".addCard-table tbody").append(sHtml);
    }

    //当键盘松开或者按下一个键盘按键时总价改变
    $(".addCard-table tbody").on('keydown keyup','.add-cardPrice',function(){
        calcPrice();
    });

    //点击添加值
    $(".card-detail-btn").click(function(){
        $(".addCard-table").css("display","block");
        var cardName = $(".card-id").val();
        var cardNum = $("#serviceNum").val();
        var cardPrice = $("#servicePrice").val();
        var cardId = $(".card-id").attr("data-serviceId");//要添加的条目的id
        if(cardName == ""){ //判断服务卡名称
            layer.msg('请选择服务卡名称', {icon: 2});
            return;
        };
        if(cardName == ""){ //判断服务卡价格
            layer.msg('服务价格不能为空', {icon: 2});
            return;
        };
        addDetail(cardId,cardName,cardNum,cardPrice);
        calcPrice();
    });

    //点击删除
    $(".addCard-table tbody").on('click','.delBtn',function(){
        var cardId = $(this).parent().attr("data-serviceId");//获取要删除的id
        $(this).parent().parent().remove();
        var trLength = $(".addCard-table tbody tr").length;
        if(trLength==0){
            $(".addCard-table").css("display","none");
        }
        calcPrice();
    });


    /*
     * 编辑框
     */
    function initKindEditor(){
        KindEditor.ready(function(K) {
            editor = K.create('textarea[name="detail"]', {
                resizeType : 0,
                allowPreviewEmoticons : false,
                uploadJson : 'upload_detail_image.do',
                items : [ 'image', 'source', 'undo', 'redo', 'preview',
                    'plainpaste', 'wordpaste', 'justifyleft', 'justifycenter',
                    'justifyright', 'justifyfull', 'insertorderedlist',
                    'insertunorderedlist', 'subscript', 'superscript',
                    'clearhtml', 'formatblock', 'fontname', 'fontsize',
                    'forecolor', 'hilitecolor', 'bold', 'italic', 'underline',
                    'strikethrough', 'lineheight', 'removeformat', 'hr' ,'quickformat']
            });
        });

    }

    //下拉选框的初始化方法
    function selectVal(res,name,price){ //res为接口数据，name为名称，price为价格
        var sHtml = "";
        for(var i=0;i<res.length;i++){
            sHtml += '<tr data-serviceId="' + res.id + '">' +
                        '<td>' + (i+1) + '</td>' +
                        '<td>' + name + '</td>' +
                        '<td>' + price + '</td>' +
                    '</tr>';
        }
        $(".card-detail-table tbody").append(sHtml);
    }
})(jQuery);
