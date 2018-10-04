// 设置饼图数据
function setPiechart(arr) {
    // 初始数据
    var colors = ['#6b98ff', '#ffbc72', '#ff7c64'];
    var names = ['分享赚', '抢标赚', '转文赚'];
    // 总数值和原始数组
    var sum = 0;
    var oriData = [];
    for (var i=0; i<arr.length; i++) {
        sum+= arr[i];
        oriData.push(arr[i]);
    }

    var canvas = document.getElementById('piechart');
    canvas.width = canvas.parentElement.offsetWidth*2;
    canvas.height = parseInt(canvas.width * 2 / 3);
    // 中心点，圆半径，点距中心点的距离，圆点半径，斜线长
    var centerX = canvas.width / 2;
    var centerY = canvas.height / 2;
    var raidus = Math.min(canvas.width, canvas.height) / 4 + 0.5;
    var dotDistance = raidus + 5*2;
    var dotRadius = 2.25*2;
    var obliqueWidth = 8.25*2;

    var ctx = canvas.getContext('2d');
    // --------------------画环形图------------------------
    var angle0 = -Math.PI/2;
    var angle1 = 0;
    arr = setNum(arr, 0.13);
    var hasData = false;
    // 计算百分比
    for (var i = 0; i < arr.length; i++) {
        // 等于0则忽略
        if(arr[i] == 0) continue;
        // 判断有没有数据
        hasData = true;

        var angle = arr[i]/sum * 2 * Math.PI;
        angle1 = angle0 + angle;
        
        // 画扇形
        ctx.beginPath();
        ctx.fillStyle = colors[i];
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, raidus, angle0, angle1, false);
        ctx.fill();
        // 扇形角平分线外一点
        // angle0~angle1之间的半角，即(angle1+angle0)/2
        var h = dotDistance * Math.sin(Math.PI/2 + (angle1 + angle0)/2);
        var w = dotDistance * Math.cos(Math.PI/2 + (angle1 + angle0)/2);
        // 圆点的中心点，画小圆点
        var _x = centerX + h;
        var _y = centerY - w;
        ctx.beginPath();
        ctx.fillStyle = colors[i];
        ctx.moveTo(_x, _y);
        ctx.arc(_x, _y, dotRadius, 0, Math.PI*2, false);
        ctx.fill();
        // 从小圆点画45°斜线，根据点所在的象限确定角度，居中则向右下
        // 斜线后画对应的横线
        ctx.strokeStyle = colors[i];
        ctx.beginPath();
        ctx.moveTo(_x, _y);
        // 圆点在中心点上，则角度向上，比y
        // 圆点在中心点左，则角度向左，比x
        var dotX = centerX > _x ? (_x - obliqueWidth) : (_x + obliqueWidth);
        var dotY = centerY > _y ? (_y - obliqueWidth) : (_y + obliqueWidth);
        ctx.lineTo(dotX, dotY);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(dotX, dotY);
        // 同样划线，x左到0，右到边，y不变
        var lineX = centerX > _x ? 0 : canvas.width;
        var lineY = centerY > _y ? (_y - obliqueWidth) : (_y + obliqueWidth);
        ctx.lineTo(lineX, lineY);
        ctx.stroke();
        
        // 写字，写数据
        ctx.textAlign = centerX > _x ? 'left' : 'right';
        ctx.fillStyle = '#666';
        ctx.font = "24px Microsoft YaHei Arial";
        ctx.fillText(formatMoney(oriData[i]), lineX, lineY - 5*2);
        ctx.fillText(names[i], lineX, lineY + 15*2);
        // 下一个角
        angle0 = angle1;
    }
    // 空心环
    ctx.beginPath();
    ctx.fillStyle = '#fff';
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, raidus/2, 0, Math.PI*2, false);
    ctx.fill();
    // 若没有数据，画个灰色的圆
    if(!hasData) {
        ctx.beginPath();
        ctx.fillStyle = '#ddd';
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, raidus, 0, Math.PI*2, false);
        ctx.fill();
    }
}
// 设置最小比例
// 这玩意的作用是：当一个数组里面的数字过小时，将它变大，变大的最小比例为ratio
// 数字为0，则不变
// 即，将[1, 100, 100]，按最小数字占比13%，变成[26.13, 74.87, 100]，其他的，不重要
// 而[27, 60, 100],13% 则保持不变
function setNum(arr, ratio){
    if(!ratio) ratio = 0.13;
    var sum = 0;
    var dataArr = []
    for(var i=0; i<arr.length; i++) {
        sum += arr[i]
        dataArr.push(arr[i]);
    }
    
    var changedVal = 0;
    var hasChanged = false;
    for(var i=0; i<arr.length; i++) {
        if(arr[i] == 0) continue;
        if(arr[i]/sum< ratio) {
            changedVal = arr[i];
            arr[i] = sum * ratio;
            hasChanged = true;
            break;
        }
    }
    if(!hasChanged) return arr;
    dataArr.sort(function(a, b){return a-b});
    var max = dataArr.pop();
    for(var i=0; i<arr.length; i++) {
        if(arr[i] == max) {
            arr[i]-= (sum * ratio-changedVal)
            break;
        }
    }
    return setNum(arr);
}
// 设置折线图数据
function setLinechart(arr, date){
    // 初始化
    var canvas = document.getElementById('linechart');
    canvas.width = canvas.parentElement.offsetWidth * 2;
    canvas.height = 240;
    var ctx = canvas.getContext('2d');
    var centerX = canvas.width/2;
    var centerY = canvas.height/2;
    // 处理数据
    arr.reverse();
    var arrName = [];
    var arrData = [];
    var numArr = [];
    var index = 0;
    var month = new Date(date.replace(/-/g, '/') + '/1').getMonth() + 1;
    for(var i=0; i<arr.length; i++){
        if(month == arr[i].month) index = i;
        arrName.push(arr[i].month + '月');
        arrData.push(arr[i].monthProfit);
        numArr.push(arr[i].monthProfit);
    }
    
    // 排序，取出最大最小
    numArr.sort(function(a, b){return a-b});
    var minNum = numArr[0];
    var maxNum = numArr[numArr.length - 1];
    // x个点将画布左右纵向分成x+1份，间隔相同
    // 将画布上下横向分成x+1份，中间的一半高度按数据比例分割
    ctx.beginPath();
    ctx.lineWidth = 2.5 * 2;
    ctx.moveTo(0, centerY);
    var dotArr = [];
    for(var i=0; i<arrData.length; i++){
        // 确定点，与上一个点相连划线
        var x = canvas.width * (i+1) /(arrData.length + 1);
        var y = centerY;
        if(minNum != maxNum) y = canvas.height * 0.75 - canvas.height * (arrData[i]-minNum)/(2 *(maxNum-minNum))
        ctx.strokeStyle = i == 0 ? '#ffc9bf' : '#fd5638';
        dotArr.push([x, y]);
        ctx.lineTo(x, y);
        ctx.stroke();
        // 确定点，准备重新开始划线
        ctx.beginPath();
        ctx.moveTo(x, y);
    }
    ctx.strokeStyle = '#ddd';
    ctx.setLineDash([5 * 2, 3 * 2]);    
    ctx.lineTo(canvas.width, centerY);
    ctx.stroke();

    // 画个中线试试
    // ctx.beginPath();
    // ctx.lineWidth = 1 * 2;
    // ctx.strokeStyle = '#ddd';
    // ctx.setLineDash([4 * 2, 4 * 2]);
    // ctx.moveTo(0, centerY);
    // ctx.lineTo(canvas.width, centerY + 0.5);
    // ctx.stroke();

    // 画点和环顺便写字
    for(var i = 0; i < dotArr.length; i++){
        var x = dotArr[i][0];
        var y = dotArr[i][1];
        // 环
        ctx.beginPath();
        ctx.fillStyle = '#fd5638';
        ctx.moveTo(x, y);
        ctx.arc(x, y, index == i ? 11: 7, 0, Math.PI*2, false);
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = '#fff';
        ctx.moveTo(x, y);
        ctx.arc(x, y, 2.5 * 2, 0, Math.PI*2, false);
        ctx.fill();
        // 字
        ctx.textAlign = 'center';
        ctx.fillStyle = index == i ? '#fd5638': '#666';
        ctx.font = index == i ? "24px Microsoft YaHei Arial": "20px Microsoft YaHei Arial";
        ctx.fillText(formatMoney(arrData[i]), x, y - 10 * 2);
        ctx.fillStyle = '#333';
        ctx.font = "24px Microsoft YaHei Arial";
        ctx.fillText(arrName[i], x, canvas.height*0.75 + 20 * 2);
    }
}

// 格式化金额
function formatMoney(money){
    if(isNaN(Number(money)) || money.length == 0) return '0.00';
    var str = parseFloat(money).toFixed(2);
    var numStr = str.split('.')[0];
    numStr = numStr.split('').reverse().join('').match(/\d{1,3}/g).join(',').split('').reverse().join('');
    return numStr + '.' + str.split('.')[1];
}

module.exports = {
    setPiechart: setPiechart,
    setLinechart: setLinechart,
    formatMoney: formatMoney
}