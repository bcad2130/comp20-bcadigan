	var img;
	var gameDiv;
	var canvas;
	var ctx;
	var deathimage;
	var drawdeath = "false";
	var death_x;
	var death_y;
	var death_time;
	var life_score = 1;
	var frog_x_start = 170;
	var frog_y_start = 485;
	var frog_x = frog_x_start;
	var frog_y = frog_y_start;
	var direct;
	var level = 1;
	var lives = 5;
	var score = 0;
	var delay = 70;
	var death = new Boolean();
	var game_over = false;
	var game_won = false;
	var upright_frog_x = 13;
	var updown_frog_y = 368;
	var leftright_frog_y = 335;
	var leftdown_frog_x = 80;
	var crop_frog_y = updown_frog_y;
	var crop_frog_x = upright_frog_x;
	var east_bound = 380;
	var west_bound = 0;
	var north_bound = 110;
	var south_bound = 480;
	var max_y = south_bound;
	var frog_jump = 34;
	var frog_width = 23;
	var frog_height = 23;
	var frog_speed = 0;
	var longlogs = new Array();
	var medlogs = new Array();	
	var shortlogs = new Array();
	var turtles1 = [];
	var turtles2 = new Array();
	var purpcars = new Array();
	var whicars = new Array();
	var tractors = new Array();
	var trucks = new Array();
	var yellcars = new Array();
	var lilies = new Array();
	var won_pads = new Array();
	var pads_won = 0;
	var time = 220;
	var highscore;
	
	function start_game(){
		gameDiv = document.getElementById('game_div');
		canvas = document.getElementById('game');
		death = false;
		set_arrays();
		document.onkeydown = function(evt) {
			evt = evt || window.event;
			var keyCode = evt.keyCode;
			if (keyCode >= 37 && keyCode <= 40) {
				return false;
			}
		};
		if(typeof localStorage["high"] != "undefined" )
			highscore = localStorage["high"];
		else highscore = 0;	
		deathimage = new Image();
		deathimage.src = "assets/dead_frog.png";
		//if canvas is supported
		if (canvas.getContext){
			ctx = canvas.getContext('2d');
			img = new Image();
			img.src = "assets/frogger_sprites.png";
			img.onload = draw();
			setInterval(loop, delay);
		}
		//if canvas is not supported
		else {
            alert('Sorry, canvas is not supported on your browser!');
		}
	}	
	
	function set_arrays(){
		for(var i=0; i<5; i++){
			lilies[i] = new lilypad( 26+i*85, 80, 0, 1, 10, false);
		}
		for(var i=0; i<3; i++){
			longlogs[i] = new log( 250*i, 178, 5, 177, 22);
		}
		for(var i=0; i<4; i++){
			medlogs[i] = new log( 140*i, 112, 4, 117, 22);
		}
		for(var i=0; i<3; i++){
			shortlogs[i] = new log( 140*i, 212, 3, 85, 22);
		}
		for(var i=0; i<5; i++){
			turtles1[i] = new Array();
			for(var j=0; j<2; j++){		
				turtles1[i][j] = new turtle( 110*i+35*j, 139, -4, 39, 32);
			}
		}
		for(var i=0; i<5; i++){
			turtles2[i] = new Array();
			for(var j=0; j<3; j++){		
				turtles2[i][j] = new turtle( 150*i+35*j, 242, -4, 39, 32);
			}
		}		
		for(var i=0; i<3; i++){
			purpcars[i] = new purple_car( 100*i, 372, -4, 33, 35);
		}
		for(var i=0; i<2; i++){
			trucks[i] = new truck( 120*i, 309, -4, 52, 35);
		}		
		for(var i=0; i<3; i++){
			whicars[i] = new white_car( 100*i, 345, 4, 35, 35);
		}
		for(var i=0; i<3; i++){
			tractors[i] = new tractor( 130+90*i, 411, 4, 30, 30);
		}
		for(var i=0; i<3; i++){
			yellcars[i] = new yellow_car( 100*i, 450, -3, 27, 30);
		}
	}
	
	function loop(){
		if (game_over == false){
			//check user input;
			document.addEventListener("keydown", function() {				
				if (event.keyCode == 37) {
					if(frog_x > west_bound){
						direct = "left"
					}
				}
				if (event.keyCode == 38) {
					if(frog_y > north_bound){
						direct = "up"
					}
				}
				if (event.keyCode == 39) {
					if(frog_x < east_bound){
						direct = "right"
					}
				}
				if (event.keyCode == 40) {
					if(frog_y < south_bound){
						direct = "down"
					}
				}
			});
			collisionChecker();
			update(direct); // move sprites, update coordinates, resolve collisions
			draw(); // redraw everything on canvas
			direct = "none";
		} else if(game_over == true){
			//lose text
			if(typeof localStorage["high"] == "undefined" )
				localStorage["high"] = score;
			else if(localStorage["high"] < score)
				localStorage["high"] = score;				
			ctx.font="24px sans-serif"; 
			ctx.fillStyle="#00FF00";
			ctx.fillText("GAME OVER", 140,300);
		}
	}
	
	function collisionChecker(){
		for(var i=0;i<2;i++){
			if(collides(trucks[i]))
				death = true;
		}
		for(var i=0;i<3;i++){
			if(collides(whicars[i])||collides(purpcars[i])||collides(purpcars[i])||collides(yellcars[i])||collides(tractors[i]))
				death = true;
			if(collides(longlogs[i]))
				frog_speed = longlogs[i].speed;
			if(collides(shortlogs[i]))
				frog_speed = shortlogs[i].speed;
		}
		for(var i=0;i<4;i++)
			if(collides(medlogs[i]))
				frog_speed = medlogs[i].speed;
		for(var i=0;i<5;i++){
			if(collides(lilies[i])){
				if(lilies[i].occupied == true){
					death = true;
				}
				else winner(i);
			}
			for(var j=0;j<2;j++){
				if(collides(turtles1[i][j]))
					frog_speed = turtles1[i][j].speed;
			}
			for(var j=0;j<3;j++){
				if(collides(turtles2[i][j]))
					frog_speed = turtles2[i][j].speed;
			}
		}
	}
	
	function update(direct){
		if(score/10000>=life_score && lives <5){
			life_score++;
			lives++;
		}
		time--;
		if(time ==0)
			death = true;
		if(frog_y < 250 && frog_speed == 0)
			death = true;
		frog_x += frog_speed;
		if(frog_x > east_bound || frog_x < west_bound){
			death = true;
		}
		frog_speed = 0;
		if(death){
			time = 220;
			death_time = 20;
			drawdeath = "true";
			death_x = frog_x;
			death_y = frog_y;
			frog_x = frog_x_start;
			frog_y = frog_y_start;
			lives--;
			max_y=south_bound;
			death = false;
		}
		if(lives == 0){
			game_over = true;
		}
		for(var i=0;i<3;i++)
			longlogs[i].xcoord+=longlogs[i].speed;
		for(var i=0;i<3;i++){
			if(longlogs[i].xcoord > 600)
				longlogs[i].xcoord = -200;
		}
		for(var i=0;i<4;i++)
			medlogs[i].xcoord+=medlogs[i].speed;
		for(var i=0;i<4;i++){
			if(medlogs[i].xcoord > 500)
				medlogs[i].xcoord = -200;
		}
		for(var i=0;i<3;i++)
			shortlogs[i].xcoord+=shortlogs[i].speed;
		for(var i=0;i<3;i++){
			if(shortlogs[i].xcoord > 400)
				shortlogs[i].xcoord = -200;
		}
		for(var i=0;i<5;i++){
			for(var j=0; j<2; j++){	
				turtles1[i][j].xcoord+=turtles1[i][j].speed;
			}
		}
		for(var i=0;i<5;i++){
				for(var j=0; j<2; j++){		
					if(turtles1[i][j].xcoord < -200)
						turtles1[i][j].xcoord = 500;
			}
		}
		for(var i=0;i<5;i++){
			for(var j=0; j<3; j++){	
				turtles2[i][j].xcoord+=turtles2[i][j].speed;
			}
		}		
		for(var i=0;i<5;i++){
				for(var j=0; j<3; j++){		
					if(turtles2[i][j].xcoord < -200)
						turtles2[i][j].xcoord = 600;
			}
		}
		for(var i=0;i<3;i++)
			purpcars[i].xcoord+=purpcars[i].speed;
		for(var i=0;i<3;i++){
			if(purpcars[i].xcoord < -120)
				purpcars[i].xcoord = 400;
		}
		for(var i=0;i<2;i++)
			trucks[i].xcoord+=trucks[i].speed;
		for(var i=0;i<2;i++){
			if(trucks[i].xcoord < -120)
				trucks[i].xcoord = 400;
		}		
		for(var i=0;i<3;i++)
			whicars[i].xcoord+=whicars[i].speed;
		for(var i=0;i<3;i++){
			if(whicars[i].xcoord > 400)
				whicars[i].xcoord = -120;
		}
		for(var i=0;i<3;i++)
			tractors[i].xcoord+=tractors[i].speed;
		for(var i=0;i<3;i++){
			if(tractors[i].xcoord > 400)
				tractors[i].xcoord = -120;
		}		
		for(var i=0;i<3;i++)
			yellcars[i].xcoord+=yellcars[i].speed;
		for(var i=0;i<3;i++){
			if(yellcars[i].xcoord < -120)
				yellcars[i].xcoord = 400;
		}
		
		if(direct == "left"){
			//frog coords change
			frog_x -= frog_jump;
			//frog image change
			crop_frog_y = leftright_frog_y;
			crop_frog_x = leftdown_frog_x;
		}
		if(direct == "up"){
			//frog coords change
			frog_y -= frog_jump;
			//frog image change
			crop_frog_y = updown_frog_y;
			crop_frog_x = upright_frog_x;
			if(frog_y < max_y){
				max_y = frog_y;
				score+=10;
			}
		}
		if(direct == "right"){
			//frog coords change
			frog_x += frog_jump;
			//frog image change
			crop_frog_y = leftright_frog_y;
			crop_frog_x = upright_frog_x;
		}
		if(direct == "down"){
			//frog coords change
			frog_y += frog_jump;
			//frog image change
			crop_frog_y = updown_frog_y;
			crop_frog_x = leftdown_frog_x;
		}
	}
	
		function draw(){
			//water
			ctx.fillStyle = "#191970";
			ctx.fillRect (0, 0, 400, 290);
			//road
			ctx.fillStyle = "#000000";
			ctx.fillRect (0, 300, 400, 280);
			//frogger title
			ctx.drawImage(img,0,0,399,110,0,0,399,110);
			//roads
			ctx.drawImage(img,0,110,399,50,0,265,399,50);
			ctx.drawImage(img,0,110,399,50,0,470,399,50);
			//Time
			ctx.fillStyle = "#FFA200";
			ctx.fillRect (180, 520, time, 20);
			//lives
			for( var i = 0;i<lives;i++){
				ctx.drawImage(img,upright_frog_x,leftright_frog_y,24,24,20*i,520,20,20);
			}
			//bottom of screen text
			ctx.font="24px sans-serif"; 
			ctx.fillStyle="#00FF00";
			ctx.fillText("Level "+level, 100,540);
			ctx.font="16px sans-serif"; 
			ctx.fillText("Score:"+score, 10,560);
			ctx.fillText("Highscore:"+highscore, 190,560);
			//long logs
			for(var i=0;i<3;i++){
				ctx.drawImage(img,8,165,longlogs[i].width,longlogs[i].height,longlogs[i].xcoord,longlogs[i].ycoord,longlogs[i].width,longlogs[i].height);
			}
			//medium logs
			for(var i=0;i<4;i++){
				ctx.drawImage(img,8,198,medlogs[i].width,medlogs[i].height,medlogs[i].xcoord,medlogs[i].ycoord,medlogs[i].width,medlogs[i].height);
			}
			//short logs
			for(var i=0;i<3;i++){
				ctx.drawImage(img,8,229,shortlogs[i].width,shortlogs[i].height,shortlogs[i].xcoord,shortlogs[i].ycoord,shortlogs[i].width,shortlogs[i].height);
			}
			//turtles
			for(var i=0;i<5;i++){
				for(var j=0; j<2; j++){
					ctx.drawImage(img,8,400,turtles1[i][j].width,turtles1[i][j].height,turtles1[i][j].xcoord,turtles1[i][j].ycoord,turtles1[i][j].width,turtles1[i][j].height);
				}
			}
			for(var i=0;i<5;i++){
				for(var j=0; j<3; j++){
					ctx.drawImage(img,10,400,turtles2[i][j].width,turtles2[i][j].height,turtles2[i][j].xcoord,turtles2[i][j].ycoord,turtles2[i][j].width,turtles2[i][j].height);
				}
			}		
			//purple cars
			for(var i=0;i<3;i++){
				ctx.drawImage(img,10,255,purpcars[i].width,purpcars[i].height,purpcars[i].xcoord,purpcars[i].ycoord,purpcars[i].width,purpcars[i].height);
			}
			//trucks
			for(var i=0;i<2;i++){
				ctx.drawImage(img,103,295,trucks[i].width,trucks[i].height,trucks[i].xcoord,trucks[i].ycoord,trucks[i].width,trucks[i].height);
			}	
			//white cars
			for(var i=0;i<3;i++){
				ctx.drawImage(img,42,265,whicars[i].width,whicars[i].height,whicars[i].xcoord,whicars[i].ycoord,whicars[i].width,whicars[i].height);
			}
			//tractors
			for(var i=0;i<3;i++){
				ctx.drawImage(img,10,295,tractors[i].width,tractors[i].height,tractors[i].xcoord,tractors[i].ycoord,tractors[i].width,tractors[i].height);
			}
			//yellow cars
			for(var i=0;i<3;i++){
				ctx.drawImage(img,82,265,yellcars[i].width,yellcars[i].height,yellcars[i].xcoord,yellcars[i].ycoord,yellcars[i].width,yellcars[i].height);
			}
			//lily pads
			for(var i=0;i<5;i++){
				ctx.fillStyle = "#00FF00";
				ctx.fillRect (16+i*85, 80, 20, 20);	
				ctx.fillStyle = "#000000";
				ctx.fillRect (lilies[i].xcoord, lilies[i].ycoord, lilies[i].width, lilies[i].height);
			}
			//death image
			if(drawdeath == "true" && death_time >0){
				ctx.drawImage(deathimage, death_x, death_y, 10*death_time, 10*death_time);
				death_time--;
			}
			//sitting frog
			for(var i =0;i<5; i++){
				if(lilies[i].occupied==true){
					ctx.drawImage(img,leftdown_frog_x,updown_frog_y,frog_width,frog_height,lilies[i].xcoord-10,lilies[i].ycoord,frog_width,frog_height);
				}
			}
			//starting frog
			ctx.drawImage(img,crop_frog_x,crop_frog_y,frog_width,frog_height,frog_x,frog_y,frog_width,frog_height);
		}

function winner(winning_pad){
	score += 50;
	score+= Math.floor((time/12)*10);
	lilies[winning_pad].occupied = true;
	pads_won++;
	max_y = south_bound;
	time = 220;
	if(pads_won == 5){
		score += 1000;
		level_up()
	}
	frog_x = frog_x_start;
	frog_y = frog_y_start;
}

function level_up(){
	level++;
	for(var i=0; i<4; i++){
		medlogs[i].speed++;
	}
	for(var i=0; i<5; i++){
		for(var j=0; j<2; j++){		
			turtles1[i][j].speed--;
		}
	}
	for(var i=0; i<5; i++){
		for(var j=0; j<3; j++){		
			turtles2[i][j].speed--;
		}
	}
	for(var i=0; i<2; i++){
		trucks[i].speed--;
	}		
	for(var i=0; i<3; i++){
		longlogs[i].speed++;
		shortlogs[i].speed++;
		whicars[i].speed++;
		tractors[i].speed++;
		yellcars[i].speed--;
		purpcars[i].speed--;
	}
	for(var i=0;i<5;i++){
		lilies[i].occupied =false;
	}
	pads_won = 0;
}

function collides(b) {
  return frog_x < b.xcoord + b.width &&
         frog_x + frog_width > b.xcoord &&
         frog_y < b.ycoord + b.height &&
         frog_y + frog_height > b.ycoord;
}

function log(xcoord, ycoord, speed, width, height){
	this.xcoord = xcoord;
	this.ycoord = ycoord;
	this.speed = speed;
	this.width = width;
	this.height = height;
}

function turtle(xcoord, ycoord, speed, width, height){
	this.xcoord = xcoord;
	this.ycoord = ycoord;
	this.speed = speed;
	this.width = width;
	this.height = height;	
}

function truck(xcoord, ycoord, speed, width, height){
	this.xcoord = xcoord;
	this.ycoord = ycoord;
	this.speed = speed;
	this.width = width;
	this.height = height;	
}

function purple_car(xcoord, ycoord, speed, width, height){
	this.xcoord = xcoord;
	this.ycoord = ycoord;
	this.speed = speed;
	this.width = width;
	this.height = height;	
}

function white_car(xcoord, ycoord, speed, width, height){
	this.xcoord = xcoord;
	this.ycoord = ycoord;
	this.speed = speed;
	this.width = width;
	this.height = height;
}

function tractor(xcoord, ycoord, speed, width, height){
	this.xcoord = xcoord;
	this.ycoord = ycoord;
	this.speed = speed;
	this.width = width;
	this.height = height;	
}
function yellow_car(xcoord, ycoord, speed, width, height){
	this.xcoord = xcoord;
	this.ycoord = ycoord;
	this.speed = speed;
	this.width = width;
	this.height = height;	
}
function turtle(xcoord, ycoord, speed, width, height){
	this.xcoord = xcoord;
	this.ycoord = ycoord;
	this.speed = speed;
	this.width = width;
	this.height = height;	
}
function lilypad(xcoord, ycoord, speed, width, height, occupied){
	this.xcoord = xcoord;
	this.ycoord = ycoord;
	this.speed = speed;
	this.width = width;
	this.height = height;	
	this.occupied = occupied;
}