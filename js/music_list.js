(function($){
	var repeat = localStorage.repeat || 0,
		continous = true,
		autoplay = true,
		playlist = [
		{
		title: '红妆',
		artist: '徐良&阿悄',
		mp3: './media/徐良&阿悄-红妆.mp3',
		},
		{
		title: '坏女孩',
		artist: '徐良',
		mp3: './media/徐良-坏女孩.mp3',
		},
		{
		title: '那时雨',
		artist: '徐良',
		mp3: './media/徐良-那时雨.mp3',
		},
		{
		title: '小幸运',
		artist: '桃子鱼仔的Ukulele教室',
		mp3: './media/小幸运.mp3',
		},
		{
		title: '红妆',
		artist: '徐良&阿悄',
		mp3: './media/徐良&阿悄-红妆.mp3',
		},
		{
		title: '坏女孩',
		artist: '徐良',
		mp3: './media/徐良-坏女孩.mp3',
		},
		{
		title: '那时雨',
		artist: '徐良',
		mp3: './media/徐良-那时雨.mp3',
		},
		{
		title: '小幸运',
		artist: '桃子鱼仔的Ukulele教室',
		mp3: './media/小幸运.mp3',
		},
		{
		title: '红妆',
		artist: '徐良&阿悄',
		mp3: './media/徐良&阿悄-红妆.mp3',
		},
		{
		title: '坏女孩',
		artist: '徐良',
		mp3: './media/徐良-坏女孩.mp3',
		},
		{
		title: '那时雨',
		artist: '徐良',
		mp3: './media/徐良-那时雨.mp3',
		},
		{
		title: '小幸运',
		artist: '桃子鱼仔的Ukulele教室',
		mp3: './media/小幸运.mp3',
		}];

	var sWidth = window.innerWidth,
		sHeight = window.innerHeight;
	// 初始化界面大小
	var music = $("main .disc #music");
	// music.width(sWidth*0.5);
	// music.height(sWidth*0.5);
	// music.css("top",(sHeight-sWidth*0.5)/2-20+"px");
	// music.css("left",sWidth*0.25+"px");
	music.width(sHeight*0.27);
	music.height(sHeight*0.27);
	music.css("top",(sHeight*0.73)/2+"px");
	music.css("left",(sWidth-sHeight*0.27-4)/2+"px");

	//直接从audio处理音频源，声明一些必要的变量
	var context1,
		source,
		analyserfa,
		canvasFormAudio,
		ctxfa;
	//珺改
	var Dots = [];
	var size = 128;

	//初始化画布
	var canvasFormAudio = document.getElementById('canvasFormAudio');
	canvasFormAudio.width = sWidth ;
	canvasFormAudio.height = sHeight ;
    ctxfa = canvasFormAudio.getContext("2d");
	var WIDTH = sWidth;
    var HEIGHT= sHeight;


	//加载列表&绑定点击事件
	for (var i=0; i<playlist.length; i++){
		var item = playlist[i];
		$('#playlist').append('<li>'+item.artist+' - '+item.title+'</li>');

		//点击播放列表的li，进入音乐圆盘
		var li = $('#playlist li')[i];
		li.addEventListener("click",function(event){
			$("main .disc").removeClass('hide');
			$("main .list").addClass('hide');
		},false);
	}
	//点击返回键<，进入音乐列表
	var menuReturn = $('main .glyphicon-menu-left')[0];
	menuReturn.addEventListener("click",function(event){
		$("main .disc").addClass('hide');
		$("main .list").removeClass('hide');
	},false);

	//声明audio播放的变量
	var time = new Date(),
		currentTrack = 0,
		trigger = false,
		audio, timeout, isPlaying, playCounts;

	var play = function(){
		audio.play();
		$('.playback').addClass('playing');
		isPlaying = true;
	}

	var pause = function(){
		audio.pause();
		$('.playback').removeClass('playing');		
		isPlaying = false;
	}


	var volume = localStorage.volume || 0.5;//控制音量

	// 切换列表
	var switchTrack = function(i){
		if (i < 0){
			track = currentTrack = playlist.length - 1;
		} else if (i >= playlist.length){
			track = currentTrack = 0;
		} else {
			track = i;
		}
		$('audio').remove();
		loadMusic(track);
		if (isPlaying == true) play();
	}


	// 播放结束
	var ended = function(){
		pause();
		audio.currentTime = 0;
		playCounts++;
		if (continous == true) isPlaying = true;
		if (repeat == 1){
			play();
		} 
		else{
			if (repeat == 2){
				switchTrack(++currentTrack);
			} 
			else{
				if (currentTrack < playlist.length) switchTrack(++currentTrack);
			}
		}
	}

	// 加载完成
	var afterLoad = function(){
		if (autoplay == true) play();
	}

	//建立一个音频环境，因为浏览器实现不同，做了一点兼容性处理
    try {
    	 context1 = new (window.AudioContext || window.webkitAudioContext);
    } catch(e) {
    	 throw new Error('The Web Audio API is unavailable');
    }	

	//绘图函数
	function drawSpectrumfa() {     
		var WIDTH = canvasFormAudio.width;
        var HEIGHT= canvasFormAudio.height;
  
		var array =  new Uint8Array(128);    
        analyserfa.getByteFrequencyData(array);//复制当前的频率值到一个无符号数组中
        ctxfa.clearRect(0, 0, WIDTH, HEIGHT);//clearRect(矩形左上角x坐标，矩形左上角y坐标，清除矩形的宽，清除矩形的高)
        
  		//循环生成圆点        
	    for ( var i = 0; i < (array.length)/4; i++ ){
	        ctxfa.beginPath();
	        var o = Dots[i];
	        var r = array[i]/256*50;
	        ctxfa.arc(o.x, o.y, r, 0, Math.PI*2,true);
	        var g = ctxfa.createRadialGradient(o.x, o.y, 0, o.x, o.y, r);
	        g.addColorStop(0,"#fff");
	        g.addColorStop(1, o.color);
	        ctxfa.fillStyle = g;
	        ctxfa.fill();
	        ctxfa.closePath();
	    }
    	//这里我们的array一共有128组数据，所以我们当时canvas设置的宽度为5*128=640
    	//根据浏览器频率绘图或者操作一些非css效果
	    requestAnimationFrame = window.requestAnimationFrame ||
	                            window.webkitRequestAnimationFrame ||
	                            window.mozRequestAnimationFrame;
	    requestAnimationFrame(drawSpectrumfa);
    }


	//音频分析
	function audioAnalayser(){ 	
		analyserfa=context1.createAnalyser();//建立一个分析器	
	  	var audio =jQuery("audio")[0];// 从audio标签获取声音源 source
	 	var source = context1.createMediaElementSource(audio);
	 	source.connect(analyserfa);
	  	analyserfa.connect(context1.destination);
	  	drawSpectrumfa();//调用绘图函数  
	}

/********************************random**********************************/
    function random(m,n){
        return  Math.round(Math.random()*(n-m) + m);
    }
/********************************END**********************************/



/*******************球球窗口自适应*******************************/
	function resize(){
	    height = canvasFormAudio.width;
	    width = canvasFormAudio.height;
	    ctxfa.height = height;
	    ctxfa.width = width;
	    getDots();
	}
	resize();
	window.onresize = resize;
/*********************** 自适应END*****************************/
	function getDots(){
	    Dots = [];
	    for(var i =0; i<size; i++){
	        var x = random(0,width);
	        var y = random(0,height);
	        var color = "rgba("+random(0,255)+"," + random(0,255)+","+random(0,255)+",0)";
	        Dots.push({
	            x: x,
	            y: y,
	            color: color
	        });
	    }
	}

	// 加载音乐
	var loadMusic = function(i){
		var item = playlist[i],
		newaudio = $('<audio>').html('<source src="'+item.mp3+'">').appendTo('#player');
		$('#playlist li').removeClass('playing').eq(i).addClass('playing');
		audio = newaudio[0];
        audio.volume =  volume;
        audioAnalayser();
		audio.addEventListener('canplay', afterLoad, false);
		audio.addEventListener('ended', ended, false);
	}

	loadMusic(currentTrack);

	$('.playback').on('click', function(){
		if ($(this).hasClass('playing')){
			pause();
		} else {
			play();
		}
	});

	$('#playlist li').each(function(i){
		var _i = i;
		$(this).on('click', function(){
			switchTrack(_i);
			music_disc.setAttribute("class","play"); //光盘旋转
		});
	});

	// 改-珺
    var music = document.getElementById("music");
    var audio = jQuery("audio")[0];
    var music_disc = document.getElementById('music_disc');
   	
    music.addEventListener("click",function(event){
    	if(audio.paused){
    		// alert(audio.paused);
			audio.play();
			music_disc.setAttribute("class","play");
		}
		else{
			// alert(audio.paused);
			audio.pause();
			music_disc.setAttribute("class","");
		}
    },false);

    // 音乐停止，光盘停止旋转
    music.addEventListener("ended",function(event){
		music_disc.setAttribute("class","");
    },false);

})(jQuery);