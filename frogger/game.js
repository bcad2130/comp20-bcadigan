	  function start_game(){
		//image source
	    var image = document.createElement("img");
		image.id = "sprites";
		image.src = "assets/frogger_sprites.png";
		var gameDiv = document.getElementById('game_div');
		gameDiv.appendChild(image).style.display="none";
		
        var canvas = document.getElementById('game');
		//if canvas is supported
        if (canvas.getContext){
			var ctx = canvas.getContext('2d');
			//water
			ctx.fillStyle = "#191970";
			ctx.fillRect (0, 0, 400, 280);
			//road
			ctx.fillStyle = "#000000";
			ctx.fillRect (0, 300, 400, 280);
			//get image
			var img=document.getElementById("sprites");
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
			//starting frog
			ctx.drawImage(img,0,368,40,35,180,485,40,35);
			//log
			ctx.drawImage(img,0,155,399,40,0,150,399,40);
			//cars
			ctx.drawImage(img,0,255,40,40,300,330,40,40);
			ctx.drawImage(img,40,255,40,40,20,380,40,40);
        }
		//if canvas is not supported
		else {
            alert('Sorry, canvas is not supported on your browser!');
			}
      }