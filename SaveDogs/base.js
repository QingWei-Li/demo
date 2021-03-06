var MAX_NUMBER = 30;
var imageSize = 1;
var tempXY = {
	x: -1,
	y: -1
};
var Game = {
	holes: [],
	dogs: [],
	over: false,
	msgHead: '',
	msgContent: '',
	remainHoles:[],
	scoreDog: 0,
	scoreCouple: 0,
	speed: 500,
	addScoreDog:function () {
		var elem = document.getElementById('dog');
		this.scoreDog++;
		elem.innerHTML = this.scoreDog;
	},
	addScoreCouple:function () {
		var elem = document.getElementById('couple');
		this.scoreCouple++;
		elem.innerHTML = this.scoreCouple;
		if (this.speed > 200) this.speed-=10;
	},
	init:function () {
			var self = this;
			var body = document.getElementsByTagName('body')[0];
			body.style.width = window.innerWidth + 'px';
			var main = document.getElementById('main');
			var ul = document.getElementsByTagName('ul')[0];
			var liWidth = Math.floor((main.clientWidth - 11) / 5);
			if(liWidth<64) imageSize = 0;

			for (var i = 0; i < MAX_NUMBER; i++) {
				//地洞初始化
				var li = document.createElement('li');
				li.style.width = liWidth + 'px';
				li.style.height = li.style.width;
				ul.appendChild(li);
				this.holes.push(li);
				this.remainHoles.push(i);

				//狗初始化
				var dog = new Dog(parseInt(Math.random()*10)>0?'couple':'dog');
				dog.onbeat = function () {
					if(this.info.type == 'couple'){
						this.onend();
						self.addScoreCouple();
					}else{
						self.over = true;
						self.msgHead = '打到狗了';
					}
				};
				dog.ondrag = function () {
					if(this.info.type == 'dog'){
						this.onend();
						self.addScoreDog();
						
						var li = self.holes[this.hole];
						var dogSave = document.createElement('div');
						dogSave.style.width = 64*(imageSize?1:0.75)+'px';
						dogSave.style.height = dogSave.style.width;
						dogSave.style.background = 'url(dog'+(imageSize?'@2x':'')+'.jpg) -'+64*(imageSize?1:0.75)+'px -0px no-repeat';
						li.appendChild(dogSave);
						setTimeout(function () {
							li.removeChild(dogSave);	
						},100);
					}else{
						self.over = true;
						self.msgHead = '游戏结束';
					}
				};
				dog.onend = function () {
					var li = self.holes[this.hole];
					li.removeChild(li.dog.info);

					this.info.isLive = true;
					var type = parseInt(Math.random()*8)>0?'couple':'dog';
					this.info.type = type;
					if(type == 'couple'){
						this.info.style.background = 'url(dog'+(imageSize?'@2x':'')+'.jpg) -'+128*(imageSize?1:0.75)+'px -0px no-repeat';
					}else{
						this.info.style.background = 'url(dog'+(imageSize?'@2x':'')+'.jpg) -0px -0px no-repeat';
					}
					self.remainHoles.push(this.hole);
				};
				this.dogs.push(dog);
			}

	},
	start: function () {
		if (!this.remainHoles.length || this.over) {
			return MsgBox.show();
		};

		var r = parseInt(Math.random()*this.remainHoles.length);
		var num = this.remainHoles[r];
		this.remainHoles.splice(r,1);

		this.dogs[num].hole = num;
		this.holes[num].appendChild(this.dogs[num].info);
		this.holes[num].dog = this.dogs[num];
		
		var self = this;
		setTimeout(function () {
			self.start();
		}, self.speed);
	},
	reset: function () {
		var ul = document.getElementsByTagName('ul')[0];
		ul.innerHTML = '';
		this.holes = [];
		this.msgHead = '';
		this.msgContent = '';
		this.dogs = [];
		this.over = false;
		this.remainHoles = [];
		this.scoreDog = 0;
		this.scoreCouple = 0;
		this.speed = 500;
		var elem = document.getElementById('dog');
		elem.innerHTML = 0;
		elem = document.getElementById('couple');
		elem.innerHTML = 0;
	}
}
var MsgBox = {
	msgBox: document.getElementById('start'),
	fullbg: document.getElementById('fullbg'),
	show: function () {
		this.msgBox.style.display = 'block';
		this.fullbg.style.display = 'block';
		this.msgBox.style.height = '50%';

		var head = this.msgBox.getElementsByTagName('h2')[0];
		var p = this.msgBox.getElementsByTagName('p')[0];
		var button = this.msgBox.getElementsByTagName('button')[0];

		this.Achievement();

		head.innerHTML = Game.msgHead?Game.msgHead:'游戏结束';
		p.innerHTML = '你一共消灭了 '+Game.scoreCouple+' 对情侣, 并拯救了 '+ Game.scoreDog+' 条单身狗。';
		p.innerHTML += '<br>'+Game.msgContent;
		p.innerHTML += '<br>分享朋友圈让小伙伴一起加入吧！';
		button.innerHTML = '重新开始';
	},
	hide: function () {
		this.msgBox.style.display = 'none';
		this.fullbg.style.display = 'none';
	},
	Achievement: function () {
		document.title = '我消灭了'+Game.scoreCouple+'对情侣, 拯救了'+ Game.scoreDog+'条单身狗。';
		if (Game.remainHoles.length <=0 && Game.scoreCouple == 0 && Game.scoreDog == 0) {
			Game.msgHead = "旁观狗";
			Game.msgContent = "\"我就看看不说话\"";
		}else if(Game.scoreCouple > 1000){
			Game.msgHead = "我是传奇";
			Game.msgContent = "\"还有谁！！！！！\"";
		}else if(Game.scoreCouple > 300){
			Game.msgHead = "屏幕没坏吧";
			Game.msgContent = "\"我真的是寂寞了\"";
		}else if(Game.scoreCouple == 1 && Game.scoreDog == 1){
			Game.msgHead = "狗,男,女";
			Game.msgContent = "\"嘿嘿嘿嘿嘿嘿\"";
		}else if(Game.scoreDog > 50){
			Game.msgHead = "注孤生";
			Game.msgContent = "\"其实我也是单身狗\"";
		}else if(Game.scoreCouple <= 0 && Game.scoreDog && Game.scoreCouple == 0){
			Game.msgHead = "专业单身狗救助员";
			Game.msgContent = "\"帮助同类是我应尽的义务\"";
		}else if(Game.remainHoles <= 0 && Game.scoreCouple && Game.scoreDog == 0){
			Game.msgHead = "大FFF团优秀团员";
			Game.msgContent = "\"为什么我的手上多了汽油和火把\"";
		}else if(Game.remainHoles && Game.scoreCouple == 0 && Game.scoreDog == 0){
			Game.msgContent = "╮(╯▽╰)╭";
		}
		if (Game.msgHead != '游戏结束' && Game.msgHead != '打到狗了'){
			document.title = document.title + '获得'+Game.msgHead+'称号,'+Game.msgContent;
			Game.msgContent = '继续继续';
		}else{
			document.title += '来和我一起拯救单身狗吧';
		}
	}
}
var Dog = function(type){
	this.info = null;
	this.hole = -1;
	this.init(type);
}
Dog.prototype = {
	init: function (type) {
		var self = this;
		type = type || 'couple';
		this.info = document.createElement('div');
		this.info.type = type;
		this.info.isLive = true;
		this.info.style.width = 64*(imageSize?1:0.75)+'px';
		this.info.style.height = this.info.style.width;
		if(type == 'couple'){
			this.info.style.background = 'url(dog'+(imageSize?'@2x':'')+'.jpg) -'+128*(imageSize?1:0.75)+'px -0px no-repeat';
		}else{
			this.info.style.background = 'url(dog'+(imageSize?'@2x':'')+'.jpg) -0px -0px no-repeat';
		}
		var touchXY = {};
		TouchFix.bind(this.info,'touchstart',function(e){
			e.preventDefault(); 
			var t = e.touches[0];
			touchXY.startx=t.pageX;
    		touchXY.starty=t.pageY;
		})
		TouchFix.bind(this.info,'touchmove',function(e){
			e.preventDefault(); 
			var t = e.touches[0];
			touchXY.endx=t.pageX;
    		touchXY.endy=t.pageY;
		});
		TouchFix.bind(this.info,'touchend',function(e){
			e.preventDefault(); 
			if (Math.abs(touchXY.startx - tempXY.x) <5 && Math.abs(touchXY.starty - tempXY.y)<5) return;
			tempXY.x = touchXY.startx;
			tempXY.y = touchXY.starty;
			var touchX =Math.abs(touchXY.endx - touchXY.startx);
			var touchY = Math.abs(touchXY.endy - touchXY.starty);
			var ismove = touchX > 50|| touchY > 50;
			touchXY = {};
			if (ismove){
				self.drag(e);
			}else{
				self.beat(e);
			}
		});
	},
	beat: function (e) {
		if(this.info.isLive){
			this.info.isLive = false;
			this.onbeat(e);
		}
	},
	drag: function (e) {
		if(this.info.isLive){
			this.info.isLive = false;
			this.ondrag(e);
		}
	},
	onbeat: function(e) {},
	ondrag: function (e) {},
	onend: function(e) {},
	onreset: function (e) {}
}

var loadImage = function () {
	var main = document.getElementById('main');
	var liWidth = Math.floor((main.clientWidth - 11) / 5);
	var imageSize = 1;
	if(liWidth<64) imageSize = 0;
	var tempImg = document.createElement('img');
	tempImg.src = 'dog'+(imageSize?'@2x':'')+'.jpg';
	tempImg.style.display = 'none';
	main.appendChild(tempImg);
}
loadImage();

var GameStart = function () {
	Game.reset();
	Game.init();
	MsgBox.hide();
	Game.start();
}

var TouchFix = {};
(function() {
    var MSPointerType={
        start:'MSPointerOver',
        move:'MSPointerMove',
        end:'MSPointerOut'
    },
    pointerType={
        start:'pointerover',
        move:'pointermove',
        end:'pointerout'
    },
    touchType={
        start:'touchstart',
        move:'touchmove',
        end:'touchend'
    },
    mouseType={
        start:'mousedown',
        move:'mousemove',
        end:'mouseup',
        out:'mouseout'
    };
    function isTouch() {
        return typeof window.ontouchstart !== 'undefined';
    }

    function isMSPointer() {
        return window.navigator.msPointerEnabled;
    }

    function isPointer() {
        return window.navigator.pointerEnabled;
    }

    function bindStart(el,cb) {
        el.addEventListener(pointerType.start,
            function (e) {
                pointerHandler(e,cb);
            });
        el.addEventListener(MSPointerType.start, 
            function (e) {
                MSPointerHandler(e,cb);    
            });
        el.addEventListener(touchType.start,  
            function (e) {
                touchHandler(e,cb);
            });
        if (!isTouch() && !isMSPointer() && !isPointer()) {
            el.addEventListener(mouseType.start,  
            function (e) {
                mouseHandler(e,cb);
            });
        }
    }

    function bindMove(el,cb) {
        el.addEventListener(pointerType.move,  
            function (e) {
                pointerHandler(e,cb);
                cb(e);
            });
        el.addEventListener(MSPointerType.move,  
            function (e) {
                MSPointerHandler(e,cb);
                cb(e);
            });
        el.addEventListener(touchType.move,  
            function (e) {
                touchHandler(e,cb);
            });
        
        if (!isTouch() && !isMSPointer() && !isPointer()) {
            el.addEventListener(mouseType.move,  
            function (e) {
                mouseHandler(e,cb);
            });
        }
    }

    function bindEnd(el,cb) {
        el.addEventListener(pointerType.end,  
            function (e) {
                pointerHandler(e,cb);
            });
        el.addEventListener(MSPointerType.end,  
            function (e) {
                MSPointerHandler(e,cb);
            });
        el.addEventListener(touchType.end,  
            function (e) {
                touchHandler(e,cb);
            });
        
        if (!isTouch() && !isMSPointer() && !isPointer()) {
            el.addEventListener(mouseType.end,  
            function (e) {
                mouseHandler(e,cb);
            });
            el.addEventListener(mouseType.out,  
            function (e) {
                mouseHandler(e,cb);
            });
        }
    }
    
    TouchFix.bind = function(el,type,cb) {
        switch (type) {
            case touchType.start:
                bindStart(el,cb);
                break;
            case touchType.move:
                bindMove(el,cb);
                break;
            case touchType.end:
                bindEnd(el,cb);
                break;
            default:
                break;
        }
    }
    var hasTouchStart=false;
    function commonHandler (e) {
        if(e.type===MSPointerType.start
            ||e.type===pointerType.start
            ||e.type===mouseType.start){
            e.type=touchType.start;                
        }else if(e.type===MSPointerType.move
            ||e.type===pointerType.move
            ||e.type===mouseType.move){
            e.type=touchType.move;                
        }else if(e.type===MSPointerType.end
            ||e.type===pointerType.end
            ||e.type===mouseType.end
            ||e.type===mouseType.out){
            e.type=touchType.end;                
        }
            
        e.touches=[];
        e.pageX=e.clientX;
        e.pageY=e.clientX;
        e.touches[0]=e;
    }
    function MSPointerHandler(e,cb) {
        commonHandler(e);
        cb(e);
    }
    function pointerHandler (e,cb) {
        commonHandler(e);
        cb(e);
    }
    function touchHandler (e,cb) {
        cb(e);
    }
    
    function mouseHandler (e,cb) {
        commonHandler(e);
        cb(e);
    }

})();