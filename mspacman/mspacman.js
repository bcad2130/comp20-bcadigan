	  function start_game(){
		//image source
	    var image = document.createElement("img");
		image.id = "sprites";
		image.src = "pacman10-hp-sprite.png";
		var gameDiv = document.getElementById('game_div');
		gameDiv.appendChild(image).style.display="none";
		
        var canvas = document.getElementById('game');
		//if canvas is supported
        if (canvas.getContext){
			//get image
			var img = document.getElementById("sprites");
			var ctx = canvas.getContext('2d');
			
			//game board
			ctx.drawImage(img,315,0,471,138,0,0,471,138);
			
			//ms pac man
			ctx.drawImage(img,80,0,20,20,274,115,20,20);
			
			//you're a ghooOOoost
			ctx.drawImage(img,80,120,20,20,296,115,20,20);
        }
		//if canvas is not supported
		else {
            alert('Sorry, canvas is not supported on your browser!');
			}
      }