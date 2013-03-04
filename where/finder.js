	function initialize() {
			var landmark = new google.maps.LatLng(42.367, -71.094);
			var mapOptions = {
				center: landmark,
				zoom: 12,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
			var marker = new google.maps.Marker({
				position: landmark,
				map: map,
				title: "Here!"
			});
			//marker.setMap(map);
			if (navigator.geolocation)
			{
				console.log("geo");
				navigator.geolocation.getCurrentPosition(function(position){
					console.log("location");
					var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

					var infowindow = new google.maps.InfoWindow({
						map: map,
						position: pos,
						content: 'You are here at ' + position.coords.latitude+ ", " + position.coords.longitude
					});
					console.log("opensessame");
					infowindow.open(map);

				//map.setCenter(pos);
				})
				console.log("fin");
				//function() {
				//	handleNoGeolocation(true);
				//});
			}
			
		}

      /*function handleNoGeolocation(errorFlag) {
        if (errorFlag) {
          var content = 'Error: The Geolocation service failed.';
        } else {
          var content = 'Error: Your browser doesn\'t support geolocation.';
        }

        var options = {
          map: map,
          position: new google.maps.LatLng(60, 105),
          content: content
        };

        var infowindow = new google.maps.InfoWindow(options);
        map.setCenter(options.position);
      }*/