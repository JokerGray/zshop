$(function () {
    // 引入fastclick
    FastClick.attach(document.body);
    var CMD_SHOW='dazzle/selectLabelDetails';
    /**
     * 获取个人userId
     */
    var LABELID=GetQueryString('labelid');
    // 查询个人信息
    var label={
        pagination: {
            page: 1,
            rows: 9
        },
        labelId:Number(LABELID)
    }
    var labeldata=JSON.stringify(label);
    reqAjaxAsync(CMD_SHOW,labeldata,showLabel);
    function showLabel(re){
        // console.log(re);
        if(re.code&&re.code==1){
            var html=template('content',re);
            document.getElementById('pageMain').innerHTML = html;
            var regPtag=/<p>|<\/p>/g;
            var title="我在全民炫参加#"+re.data.dazzleLabel.labelName+"#活动,你也一起来吧！",
                desc=re.data.dazzleLabel.description.replace(regPtag,''),
                shareimg=(re.data.dazzleInfosByLabel[0]?re.data.dazzleInfosByLabel[0].coverUrl:'https://tsnrhapp.oss-cn-hangzhou.aliyuncs.com/touxiang2%402x.png');
                // console.log(title)
                // console.log(desc)
                // console.log(shareimg)
                share(title,desc,shareimg);
            // 跳转视频页
            toHtml($('.toHtml'));
            // 跳转广告页
            $('.toAds').on('click',function(){
                toAds();
            }) 
        }else{
            document.getElementById('pageMain').innerHTML ="<p class='no-data'>话题不存在或被删除~</p>";
        }
     
    }

})