$(function(){FastClick.attach(document.body);var e=sessionStorage.getItem("apikey")||"test",t=sessionStorage.getItem("version")||"1",n="dazzle/findRecommendDazzle",a="dazzle/findDazzleDetail",d=GetQueryString("userid"),s=GetQueryString("dazzleid");toadverHtml();Promise.all([new Promise(function(n,o){var i={dazzleId:s,userId:d},l=JSON.stringify(i);$.ajax({type:"POST",url:"/zxcity_restful/ws/rest",dataType:"json",data:{cmd:a,data:l||"",version:t},beforeSend:function(t){t.setRequestHeader("apikey",e)},success:function(e){n(e)},error:function(e){o(e)}})}),new Promise(function(a,s){var o={userId:d,pagination:{page:1,rows:8}},i=JSON.stringify(o);$.ajax({type:"POST",url:"/zxcity_restful/ws/rest",dataType:"json",data:{cmd:n,data:i||"",version:t},beforeSend:function(t){t.setRequestHeader("apikey",e)},success:function(e){a(e)},error:function(e){s(e)}})})]).then(function(e){if(1==e[0].code&&e[0].data){var t=document.getElementById("page");t.style.display="none";var n=template("vdhtml",e[0]);if(document.getElementById("xuanVd").innerHTML=n,setTimeout(function(){document.getElementsByClassName("reload")[0].style.display="none",t.style.display="block"},500),i=document.getElementById("theVideo"),l=document.getElementById("playb"),c=document.getElementById("vdCop"),r=document.getElementById("vdDes"),l.onclick=function(){i.play(),l.style.display="none"},$("#theVideo").on("click",function(){i.paused?i.play():i.pause()}),i.addEventListener("pause",function(){c.style.display="block",r.style.display="block",l.style.display="block"}),i.addEventListener("play",function(){c.style.display="none",r.style.display="none",l.style.display="none"}),1==e[1].code&&e[1].data){var a=template("recList",e[1]);document.getElementById("vdList").innerHTML=a;var d=e[0].data?e[0].data.introduce:"快来加入全民炫视频吧~！",s=e[0].data?e[0].data.scSysUser.username+"的全民炫":"全民炫视频",o=e[0].data.coverUrl;share(d,s,o),$(".toApp").on("click",function(){getCoupon()}),$(".toAds").on("click",function(){toAds($(this))}),toHtml($(".toHtml"))}else document.getElementById("vdList").innerHTML="<p class='no-recommend'>暂无推荐列表~</p>"}else document.getElementById("xuanVd").innerHTML="<p class='delAll'>炫已被删除或为空...!</p>";var i,l,c,r})});