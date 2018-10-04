
this.onmessage = function(evt){

    // console.log('随机业务数！22222：'+evt.data);
    // postMessage('随机业务数！：'+evt.data);
    for (var i = 0; i < evt.data.length; i++) {
      // console.log('我是线程方法：'+evt.data[i]);
      postMessage('随机业务数2222！：'+evt.data[i]);
    }

};
