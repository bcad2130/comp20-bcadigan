var request = new XMLHttpRequest();
var thequest = new XMLHttpRequest();
var waldoimage = "waldo.png";
var carmenimage = "carmen.png";
var mapOptions;
var map;
var waldoiru = {"boo":false, "lat": 0, "lon": 0};
var carmeniru = {"boo":false, "lat": 0, "lon": 0};
var herelat;
var herelon;
var overlay;
var sched;
var post = new Array();
var trimage = "train.png";
var stations = [	  
	{"stn": "Alewife Station",		"lat": 42.395428,	"lon": -71.142483, "ncode":"RALEN", "scode":""},
	{"stn": "Davis Station",	"lat": 42.39674,	"lon": -71.121815, "ncode":"RDAVN", "scode":"RDAVS"},
	{"stn": "Porter Square Station",	"lat": 42.3884,	"lon": 	-71.119149, "ncode":"RPORN", "scode":"RPORS"},
	{"stn": "Harvard Square Station",	"lat": 42.373362,	"lon": 	-71.118956, "ncode":"RHARN", "scode":"RHARS"},
	{"stn": "Central Square Station",	"lat": 42.365486,	"lon": 	-71.103802, "ncode":"RCENN", "scode":"RCENS"},
	{"stn": "Kendall/MIT Station",	"lat": 42.36249079,	"lon": 	-71.08617653, "ncode":"RKENN", "scode":"RKENS"},
	{"stn": "Charles/MGH Station",	"lat": 42.361166,	"lon": 	-71.070628, "ncode":"RMGHN", "scode":"RMGHS"},
	{"stn": "Park St. Station",		"lat": 42.35639457,	"lon": 	-71.0624242, "ncode":"RPRKN", "scode":"RPRKS"},
	{"stn": "Downtown Crossing Station",		"lat": 42.355518,	"lon": 	-71.060225, "ncode":"RDTCN", "scode":"RDTCS"},
	{"stn": "South Station",		"lat": 42.352271,	"lon": 	-71.055242, "ncode":"RSOUN", "scode":"RSOUS"},
	{"stn": "Broadway Station",		"lat": 42.342622,	"lon": 	-71.056967, "ncode":"RBRON", "scode":"RBROS"},
	{"stn": "Andrew Station",		"lat": 42.330154,	"lon": 	-71.057655, "ncode":"RANDN", "scode":"RANDS"},
	{"stn": "JFK/UMass Station",		"lat": 42.320685,	"lon": 	-71.052391, "ncode":"RJFKN", "scode":"RJFKS"},
	{"stn": "Savin Hill Station",		"lat": 42.31129,	"lon": 	-71.053331, "ncode":"RSAVN", "scode":"RSAVS"},
	{"stn": "Fields Corner Station",		"lat": 42.300093,	"lon": 	-71.061667, "ncode":"RFIEN", "scode":"RFIES"},
	{"stn": "Shawmut Station",		"lat": 42.29312583,	"lon": 	-71.06573796, "ncode":"RSHAN", "scode":"RSHAS"},
	{"stn": "Ashmont Station",		"lat": 42.284652,	"lon": 	-71.064489, "ncode":"", "scode":"RASHS"},
	{"stn": "North Quincy Station",		"lat": 42.275275,	"lon": 	-71.029583, "ncode":"RNQUN", "scode":"RNQUS"},
	{"stn": "Wollaston Station",		"lat": 42.2665139,	"lon": 	-71.0203369, "ncode":"RWOLN", "scode":"RWOLS"},
	{"stn": "Quincy Center Station",		"lat": 42.251809,	"lon": 	-71.005409, "ncode":"RQUCN", "scode":"RQUCS"},
	{"stn": "Quincy Adams Station",		"lat": 42.233391,	"lon": 	-71.007153, "ncode":"RQUAN", "scode":"RQUAS"},
	{"stn": "Braintree Station",		"lat": 42.2078543,	"lon": 	-71.0011385, "ncode":"", "scode":"RBRAS"}
	];

	
	function initialize() {
			var landmark = new google.maps.LatLng(42.327, -71.094);
			mapOptions = {
				center: landmark,
				zoom: 11,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

			request.open("GET", "http://messagehub.herokuapp.com/a3.json", true);
			request.send();
			request.onreadystatechange = callback;
			
			thequest.open("GET", "http://mbtamap-cedar.herokuapp.com/mapper/redline.json", true);
			thequest.send();
 			thequest.onreadystatechange = throwback;
						
			for(var i=0; i<22; i++){
				setMarker(i);
			}
			pather();
			
			geolock();
		}

      function handleNoGeolocation(errorFlag) {
        if (errorFlag) {
          var content = 'Error: The Geolocation service failed.';
        } else {
          var content = 'Error: Your browser doesn\'t support geolocation.';
        }
      }
	  
	function setMarker(iter){
		post[iter] = new google.maps.LatLng(stations[iter].lat, stations[iter].lon);
		var mark = new google.maps.Marker({
			position: post[iter],
			map: map,
			title: stations[iter].stn,
			icon: trimage
		});
		var code = Array();
		code[0] = stations[iter].ncode;
		code[1] = stations[iter].scode;
		var schedwindow = new google.maps.InfoWindow();
		var content = mark.title;

		google.maps.event.addListener(mark, 'click', (function(mark, content, schedwindow) {
			return function() {
				content += "<br/>Northbound: " + scheduler(code[0]);
				content += "<br/>Southbound: " + scheduler(code[1]);
				
				schedwindow.setContent(content);
				schedwindow.open(map,mark);
			}
		})(mark,content,schedwindow));
	}
	
	function callback() {
        if (request.readyState == 4 && request.status == 200) {
			try {
				wheres(request.responseText);
			}
			catch (unfound) {
				alert("Carmen and Waldo Request not found!");
			}
        }
		else if(request.status == 0)
			alert("Carmen and Waldo locations do not exist.");
	}
	
	function throwback() {
        if (thequest.readyState == 4 && thequest.status == 200) {
			try {
				var presched = thequest.responseText;
				sched = eval("("+presched+")");
			}
			catch (unfound) {
				alert("Schedule Request not found!");
			}
        }
		else if(request.status == 0)
			alert("Schdule does not exist.");
	}
	
	function wheres(str){
		var jsp = eval("("+str+")");
		if (jsp[0].Line == "Red"){
			return 0;
		}
		if(jsp!="NULL")
			if(jsp[0].name=="Waldo"){
				waldoiru.boo = true;
				waldoiru.lat = jsp[0].loc.latitude;
				waldoiru.lon =	jsp[0].loc.longitude;
				var walLatLng = new google.maps.LatLng(jsp[0].loc.latitude, jsp[0].loc.longitude);
				
				var mark1 = new google.maps.Marker({
					position: walLatLng,
					map: map,
					title: jsp[0].loc.note,
					icon: waldoimage
				});
			}
			else if(jsp[0].name=="Carmen Sandiego"){
				carmeniru.boo = true;
				carmeniru.lat = jsp[0].loc.latitude;
				carmeniru.lon =	jsp[0].loc.longitude;
				var carmLatLng = new google.maps.LatLng(jsp[0].loc.latitude, jsp[0].loc.longitude);
				var mark2 = new google.maps.Marker({
					position: carmLatLng,
					map: map,
					title: jsp[0].loc.note,
					icon: carmenimage
				});
			}
			if(jsp[1]!=null){
				if(jsp[1].name=="Carmen Sandiego"){
					carmeniru.boo = true;
					carmeniru.lat = jsp[1].loc.latitude;
					carmeniru.lon =	jsp[1].loc.longitude;
					var carmLatLng = new google.maps.LatLng(jsp[1].loc.latitude, jsp[1].loc.longitude);
					var mark2 = new google.maps.Marker({
						position: carmLatLng,
						map: map,
						title: jsp[1].loc.note,
						icon: carmenimage
					});
				}
			}
	}
	
	function haversine(lt1,ln1,lt2,ln2){
		var R = 6371; // km
		var dLat = toRad(lt2-lt1);
		var dLon = toRad(ln2-ln1);
		var lat1 = toRad(lt1);
		var lat2 = toRad(lt2);

		var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
			Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
		var d = R * c;
		return d;
	}
	
	function toRad(Value) {
    // Converts numeric degrees to radians
    return Value * Math.PI / 180;
}
	function whereDistance(){
		var strang= "";
				if(waldoiru.boo == true){
					var wdis = haversine(herelat,herelon,waldoiru.lat,waldoiru.lon);
					strang += "<br/>The distance to Wally is " + wdis + ".";
				}
					
				if(carmeniru.boo == true){
					var cdis = haversine(herelat,herelon,carmeniru.lat,carmeniru.lon);
					strang += "<br/>The distance to Carmen is " + cdis + ".";
				} 
				return strang;
	}
	
	function scheduler(code){
		for(var i=0; i<sched.length; i++){
			if(code == sched[i].PlatformKey){
				return sched[i].Time;
			}		
		}
		return "N/A"
	}
	
	function pather(){
		var trainPathA = new Array();

			for(var i=0; i<17; i++){
				trainPathA[i] = new google.maps.LatLng(stations[i].lat, stations[i].lon);
			}
			
			var trainPathT = new google.maps.Polyline({
				path: trainPathA,
				strokeColor: "#FF0000",
				strokeOpacity: 1.0,
				strokeWeight: 3,
				map: map
			});
			
			var trainPathB = new Array();

			trainPathB[0] = new google.maps.LatLng(stations[12].lat, stations[12].lon);
			for(var i=1; i<6; i++){
				trainPathB[i] = new google.maps.LatLng(stations[i+16].lat, stations[i+16].lon);
			}
			
			var trainPathJ = new google.maps.Polyline({
				path: trainPathB,
				strokeColor: "#FF0000",
				strokeOpacity: 1.0,
				strokeWeight: 3,
				map: map
			});
	}
	
	function geolock(){
		if (navigator.geolocation)
			{
				navigator.geolocation.getCurrentPosition(function(position){
					herelat = position.coords.latitude;
					herelon = position.coords.longitude;
					var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
					
					var closest = {stn:"None",dis:99999};
					for(i=0;i<22;i++){
						var have = haversine(position.coords.latitude,position.coords.longitude,stations[i].lat,stations[i].lon);
						if(closest.dis > have){
							closest.stn = stations[i].stn;
							closest.dis = have;
						}
					}
					
					var str = 'You are here at ' + position.coords.latitude+ ", " + position.coords.longitude + ".<br/>The closest station is " + closest.stn + " at a distance of " + closest.dis + " miles. ";
					str += whereDistance();
					var marker = new google.maps.Marker({
						position: pos,
						map: map,
						title: "You are here!"
					});
					var infowindow = new google.maps.InfoWindow({
						map: map,
						position: pos,
						content: str,
						maxWidth: 300
					});
					infowindow.open(map);
				},
				function() {
					handleNoGeolocation(true);
				});
				
			}
	}