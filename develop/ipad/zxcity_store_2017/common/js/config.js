//定义单全局变量，避免全局变量过多
var GLOBAL_CONFIG = {};
//数据提交方式
GLOBAL_CONFIG.METHOD = {
	G : "GET",
	P : "POST"
};
//默认值
GLOBAL_CONFIG.DEFAULT = {

};
//接口地址
GLOBAL_CONFIG.AJAX_URL = {
    M1:{//我的首页
		
    },
    M2:{//门店首页

    },
    M3:{//方案

    },
    M4:{//客户预约

    },
    M5:{//消耗开单

    },
    M6:{//工单管理

    },
    M7:{//房间管理

    },
    M8:{//排班

    },
    M9:{//订单管理

    },
    M10:{//客户管理

    },
	M11:{//统计报表

    },
    M12:{//操作屏

    },
    M13:{//取单屏

    }
};
//提示信息
GLOBAL_CONFIG.MSG = {

};

window.gConfig = GLOBAL_CONFIG;
