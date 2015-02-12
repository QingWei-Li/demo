var MAX_NUMBER = 30;
var Game = {
	holes: [],
	dogs: [],
	over: false,
	message: '',
	remainHoles:[],
	init:function () {
			var self = this;
			var body = document.getElementsByTagName('body')[0];
			body.style.width = window.innerWidth + 'px';
			var main = document.getElementById('main');
			var ul = document.getElementsByTagName('ul')[0];

			for (var i = 0; i < MAX_NUMBER; i++) {
				//地洞初始化
				var li = document.createElement('li');
				li.style.width = Math.floor((main.clientWidth - 11) / 5) + 'px';
				li.style.height = li.style.width;
				ul.appendChild(li);
				this.holes.push(li);
				this.remainHoles.push(i);

				//狗初始化
				var dog = new Dog(parseInt(Math.random()*10)>0?'couple':'dog');
				dog.onbeat = function () {
					if(this.info.type == 'couple'){
						this.onend();
					}else{
						self.over = true;
					}
				};
				dog.ondrag = function () {
					if(this.info.type == 'dog'){
						this.onend();
					}else{
						self.over = true;
					}
				};
				dog.onend = function () {
					var li = self.holes[this.hole];
					li.removeChild(li.dog.info);
					
					this.info.isLive = true;
					var type = parseInt(Math.random()*8)>0?'couple':'dog';
					this.info.type = type;
					this.info.innerHTML = type;
					self.remainHoles.push(this.hole);
				};
				this.dogs.push(dog);
			}

	},
	start: function () {
		if (!this.remainHoles.length || this.over) return alert('game over');

		var r = parseInt(Math.random()*this.remainHoles.length);
		var num = this.remainHoles[r];
		this.remainHoles.splice(r,1);

		this.dogs[num].hole = num;
		this.holes[num].appendChild(this.dogs[num].info);
		this.holes[num].dog = this.dogs[num];
		
		var self = this;
		setTimeout(function () {
			self.start();
		},200);
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
		this.info.innerHTML = type;

		this.info.addEventListener('touchmove',function (e) {
			e.preventDefault(); 
			self.touchmove = true;
		});
		this.info.addEventListener('touchend',function (e) {
			e.preventDefault(); 
			if (self.touchmove){
				self.drag(e);
			}else{
				self.beat(e);
			}
			self.touchmove = false;
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

Game.init();
Game.start();