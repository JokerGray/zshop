/**
 *
 */

	var captions = ['通过线上、线下大量活动、卡券、优惠吸引拓客。',
	                '设定 “爆点”让体验顾客不得不留在店面，以便追销锁客。',
	                '设定长期的、连续的追销系统让顾客连续消费，创造收益，让其成为长期稳定顾客。',
	                '因应消费者权益向粉丝权益的消费升级改变，设定本商品及服务的粉丝权益，从而服务升级——供给侧改革，顾客变粉丝...',
	                '建立粉团队，组织化发展，娱乐性实现 。体验参与、搭建平台、社会推动——变成员工、顾客、社会的共享性平台——...',
	                '客户定位——你的顾客在哪？'];



var block = $("#circle-animated div").get();
var increase = Math.PI * 2 / block.length;
var x = 0, y = 0, angleInit = Math.PI * 1.1667; /* 偏移 1.1667 */

var activeIndex = 0;
var bgAngle = 0;
reposition(0);
// genBubbles();

var paper, circs, i, nowX, nowY, timer, props = {}, toggler = 0, elie, dx, dy, rad, cur, opa;

function reposition(index) {
	var abc = angleInit;
	abc = abc + increase * index * (-1);
	for (var i = 0; i < block.length; i++) {
		var elem = block[i];
		//半径
		x = 185 * Math.cos(abc) + 200;
		y = 183 * Math.sin(abc) + 200;
		elem.style.position = 'absolute';
		elem.style.left = x + 'px';
		elem.style.top = y + 'px';

		abc += increase;
	}
}

/* 生成一个随机数 */
function ran(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function genBubbles() {
	if (paper) {
		paper.clear();
	} else {
		paper = Raphael("bubbles", 500, 768);
	}
	circs = paper.set();
	for (i = 0; i < 15; ++i) {
		opa = ran(3, 10) / 10;

		var buble = paper.circle(ran(0, 400), ran(0, 768), ran(10, 30)).attr({
			"fill-opacity" : opa,
			"stroke-opacity" : opa
		})
		buble.attr({
			fill : "#B6DCE0",
			stroke : "#B6DCE0"
		});
		circs.push(buble);
	}
	// circs.attr({fill: "#00CAE1", stroke: "#00CAE1"});

}

$("document").ready(function() {

  // 设置方案文本
	$("#txtFA").text(captions[activeIndex]);
	// 设置转盘旋转事件
	$("#circle-animated div").rotate({
		bind : {
			click : function() {

				var color = $(this).data("color");
				// 当前元素的位置
				var index = $(this).data("index");
				if (activeIndex == index) {
					return false;
				}
				var lastIndex = activeIndex;
				activeIndex = index;

				$(".msgboard").hide();
				$(".wire").hide();

				// 转背景
				bgAngle += 60 * ((6 + lastIndex - index) % 6);
				$("#bg").rotate({
					animateTo : bgAngle,
					callback : function() {

						// 设置文本框边框色
						$(".msgboard").show();
						$(".wire").show();
						$(".msgboard").css("border-color", color);
						$(".wire").css("border-color", color);
						$(".msgboard").css("color", color);
						$("#btnUpload").css("color", color);

						/*$("#circle-animated>div[data-index=" + lastIndex + "]").connections('remove');
            $('.msgboard').connections({
              to: "#circle-animated>div[data-index=" + activeIndex + "]",
              class: 'wire2'
            });*/
						$("#txtFA").text(captions[activeIndex]);
						//genBubbles();
					}
				});

				$("#circle-animated").rotate({
					animateTo : bgAngle,
					callback : function() {
					}
				});

				// issue: 第一次为什么会转360度?
				$("#circle-animated div").rotate({
					animateTo : 360 - bgAngle
				});

			}
		}
	});



});
