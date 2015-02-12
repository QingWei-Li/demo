var MAX_NUMBER = 30;
var Game = {
	holes: [],
	dogs: [],
	dogMap: null,
	number: MAX_NUMBER,
	remainHoles:[],
	init:function () {
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
					// body...
				}
				dog.ondrag = function () {
					// body...
				}
				dog.onend = function () {
					// body...
				}
				this.dogs.push(dog);
			}

	},
	start: function () {
		if (!this.number) return alert('game over');
		var num;
		//这里有bug啊
		var r = parseInt(Math.random()*this.remainHoles.length);
		while(this.holes[r].innerHTML){
			r = parseInt(Math.random()*this.remainHoles.length);
		}
		num = this.remainHoles[r];
		this.remainHoles.splice(r,1);
		console.log('remain:'+this.remainHoles.length);
		console.log('num:'+num);
		console.log('r:'+r);

		this.dogs[num].hole = num;
		this.holes[num].appendChild(this.dogs[num].dog);
		this.holes[num].dog = this.dogs[num];
		
		this.number--;
		var self = this;
		setTimeout(function () {
			self.start();
		},200);
	}
}

var Dog = function(type){
	this.dog = null;
	this.hole = -1;
	this.init(type);
}
Dog.prototype = {
	init: function (type) {
		type = type || 'couple';
		this.dog = document.createElement('div');
		this.dog.mousetype = type;
		this.dog.isLive = true;
		this.dog.innerHTML = type;

		this.dog.onclick = function (e) {
			beat();
		};
		this.dog.addEventListener('touchmove',function (e) {
			e.preventDefault(); 
			drag();
		});
	},
	beat: function () {
		if(this.dog.isLive){
			this.dog.isLive = false;
			onbeat();
			this.dog.style.display = 'none';
		}
	},
	drag: function () {
		if(this.dog.isLive){
			this.dog.isLive = false;
			ondrag();
			this.dog.src = 'none';
		}
	},
	onbeat: function() {},
	ondrag: function () {},
	onend: function(){}
}

Game.init();
Game.start();