	var image;
	var gameDiv;
	var canvas;
	var ctx;
	var frog_x = 180;
	var frog_y = 485;
	var direct;
	
	function start_game(){
		var delay = 100;
		//image source
		gameDiv = document.getElementById('game_div');
		//gameDiv.appendChild(image).style.display="none"; 
		canvas = document.getElementById('game'); 
		
		//image = document.createElement("img");
		draw();
		setInterval(loop, delay);
	}	
	
	function loop(){
		//while (true){
			//check user input;
			
			
			document.addEventListener("keydown", function(event) {
				console.log(event.keyCode);
				
				if (event.keyCode == 37) {
					direct = "left"
					//event.keyCode = 40;
					
					//break;
					//console.log("I see that you pressed the space bar!");
				}
				if (event.keyCode == 38) {
					direct = "up"
					//event.keyCode = 40;
					
					//break;
					//console.log("I see that you pressed the space bar!");
				}
				if (event.keyCode == 39) {
					direct = "right"
					//event.keyCode = 40;
					
					//break;
					//console.log("I see that you pressed the space bar!");
				}
				if (event.keyCode == 40) {
					direct = "down"
					//event.keyCode = 40;
					
					//break;
					//console.log("I see that you pressed the space bar!");
				}
			});
			//event.keyCode = 40;
			console.log("HEY");
			update(direct); // move sprites, update coordinates, resolve collisions
			draw(); // redraw everything on canvas
			direct = "none";
		//}
	}
	
	function update(direct){
		console.log(direct);
		if(direct == "left"){
			frog_x -=30;
			//direct = "no";
		}
		if(direct == "up"){
			frog_y -=30;
			//direct = "no";
		}
		if(direct == "right"){
			frog_x +=30;
			//direct = "no";
		}
		if(direct == "down"){
			frog_y +=30;
			//direct = "no";
		}
	}
	
function draw(){
	//if canvas is supported
	if (canvas.getContext){
		//image.id = "sprites";
		img = new Image();
		img.src = "assets/frogger_sprites.png";
		img.onload = function(){
			ctx = canvas.getContext('2d');
			//water
			ctx.fillStyle = "#191970";
			ctx.fillRect (0, 0, 400, 280);
			//road
			ctx.fillStyle = "#000000";
			ctx.fillRect (0, 300, 400, 280);
			//get image
			//var img=document.getElementById("sprites");
			//frogger title
			ctx.drawImage(img,0,0,399,110,0,0,399,110);
			//roads
			ctx.drawImage(img,0,110,399,50,0,260,399,50);
			ctx.drawImage(img,0,110,399,50,0,470,399,50);
			//lives
			ctx.drawImage(img,0,330,40,30,0,520,30,24);
			ctx.drawImage(img,0,330,40,30,20,520,30,24);
			//bottom of screen text
			ctx.font="24px sans-serif"; 
			ctx.fillStyle="#00FF00";
			ctx.fillText("Level 1", 70,540);
			ctx.font="16px sans-serif"; 
			ctx.fillText("Score:0", 10,560);
			ctx.fillText("Highscore:0", 90,560);
			//log
			ctx.drawImage(img,0,155,399,40,0,150,399,40);
			//cars
			ctx.drawImage(img,0,255,40,40,300,330,40,40);
			ctx.drawImage(img,40,255,40,40,20,380,40,40);
			//starting frog
			ctx.drawImage(img,0,368,40,35,frog_x,frog_y,40,35);
		}
	}//if canvas is not supported
	else {
            alert('Sorry, canvas is not supported on your browser!');
	}
}