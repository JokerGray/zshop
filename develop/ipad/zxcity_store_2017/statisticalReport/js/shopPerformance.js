/**
 * Created by Administrator on 2016/12/29.
 */
(function(){
    var dataLi=$('.data').children('a');
    var dataA=$('.data').children('a');

    dataA.attr('href','../html/shopRank.html');

    $("#selDate1").click(function(){
        WdatePicker({
            el: 'selDateShow1',
            dateFmt: 'yyyy-MM-dd',
            //minDate: '%y-%M-%d',
            isShowClear: false,
            isShowOK: false,
            onpicked:function(){

            }
        });
    });

    $("#selDate2").click(function(){
        WdatePicker({
            el: 'selDateShow2',
            dateFmt: 'yyyy-MM-dd',
            //minDate: '%y-%M-%d',
            isShowClear: false,
            isShowOK: false,
            onpicked:function(){

            }
        });
    });

})();