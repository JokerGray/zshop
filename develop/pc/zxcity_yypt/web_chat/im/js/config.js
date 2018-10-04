(function() {
    // 配置
    var envir = 'online';
    var configMap = {
        test: {
            /*appkey: 'fe416640c8e8a72734219e1847ad2547',*/
            /*appkey:'855c115e165d419cc48e48e4bd001ffc',*/
            appkey:'4901232afcb608cbfa0fc95278dd115f',
            url:'https://apptest.netease.im'
        },
        pre:{
    		/*appkey: '45c6af3c98409b18a84451215d0bdd6e',*/
            /*appkey:'855c115e165d419cc48e48e4bd001ffc',*/
            appkey:'4901232afcb608cbfa0fc95278dd115f',
    		url:'http://preapp.netease.im:8184'
        },
        online: {
           /*appkey: '45c6af3c98409b18a84451215d0bdd6e',*/
            /*    appkey:'855c115e165d419cc48e48e4bd001ffc',*/
        appkey:'4901232afcb608cbfa0fc95278dd115f',
           url:'https://app.netease.im'
        }
    };
    window.CONFIG = configMap[envir];
}())