var MAX_NUMBER = 30;
var Game = {
	holes: [],
	dogs: [],
	dogMap: null,
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
					this.onend();
				}
				dog.ondrag = function () {
					// body...
				}
				dog.onend = function () {
					var li = self.holes[this.hole];
					li.removeChild(this.info);
					li.dog = null;
					self.remainHoles.push(this.hole);
					console.log(self.remainHoles);
				}
				this.dogs.push(dog);
			}

	},
	start: function () {
		if (!this.remainHoles.length) return alert('game over');

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
		this.info.mousetype = type;
		this.info.isLive = true;
		this.info.innerHTML = type;

		this.info.onclick = function (e) {
			self.beat(e);
		};
		this.info.addEventListener('touchmove',function (e) {
			e.preventDefault(); 
			self.drag(e);
		});
	},
	beat: function (e) {
		if(this.info.isLive){
			this.info.isLive = false;
			this.onbeat(e);
			this.info.style.display = 'none';
		}
	},
	drag: function (e) {
		if(this.info.isLive){
			this.info.isLive = false;
			this.ondrag();
			this.info.src = 'none';
		}
	},
	onbeat: function(e) {},
	ondrag: function (e) {},
	onend: function(e){}
}

Game.init();
Game.start();