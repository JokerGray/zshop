// 支付订单
var a = 1;
var b = 8;

function wbeWorkerPayOrder(){
    while(a<b){
      a++;
      this.postMessage(a);
    }
}
wbeWorkerPayOrder();
