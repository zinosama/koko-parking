function MapService($window){
	var newEl = document.createElement('div');
	newEl.style.width = "80%";
	newEl.style.height = "300px";
	var map, geoMarker, addressMarker;
	var location;
	var mapReady = false;

	var mapCallbacks = [];
	var notifyMapCallbacks = function(){
		angular.forEach(mapCallbacks, function(callback){
			callback();
		});
		mapCallbacks = [];
	};

	function onload(position){
		if(map){//if google map loads before geolocation, modify map object
			location = {lat:position.coords.latitude, lng:position.coords.longitude};
			map.setCenter(location);

		 	mapReady = true; //map and geolocation both finished
		 	if(mapCallbacks.length) notifyMapCallbacks();
		}else{
			location = {lat:position.coords.latitude, lng:position.coords.longitude};
		}
	};

	navigator.geolocation.getCurrentPosition(onload,function(error){
		console.error(error);
	});

	$window.initMap = function(){
		map = new google.maps.Map(newEl,{
			center: location || {lat: 85.7064218, lng: -74.0091584},
			zoom:16,
			styles:[{"featureType":"administrative","elementType":"all","stylers":[{"visibility":"on"},{"lightness":33}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2e5d4"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#c5dac6"}]},{"featureType":"poi.park","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":20}]},{"featureType":"road","elementType":"all","stylers":[{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#c5c6c6"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#e4d7c6"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#fbfaf7"}]},{"featureType":"water","elementType":"all","stylers":[{"visibility":"on"},{"color":"#acbcc9"}]}],
			mapTypeControl:false
		});

		if(location){
		 	mapReady=true; //map and geolocation both finished
		 	if(mapCallbacks.length) notifyMapCallbacks();
		}
	};

	var MapService = {};

	MapService.getMapEl = function(){
		return newEl;
	};

	MapService.getMap = function(){
		return map;
	}
	MapService.isMapReady = function(){
		return mapReady;
	};

	MapService.appendMap = function(){
	 	geoMarker = new google.maps.Marker({
	 		position:location,
	 		map:map
	 	});
		document.querySelector("#mapDiv").appendChild(newEl);
	};

	MapService.getLocation = function(){
		return location;
	}

	MapService.registerCallback = function(callback){
		mapCallbacks.push(callback);
	};

	MapService.geocodeAddress = function(geocoder, map, address){
		var options = {
			'address': address,
			'region': 'US'
		};
		geocoder.geocode(options,function(results, status){
			if(status === google.maps.GeocoderStatus.OK){	
				map.setCenter(results[0].geometry.location);
				addressMarker = new google.maps.Marker({
					map: map,
					position: results[0].geometry.location
				});

				MapService.coord = {
					lat: results[0].geometry.location.lat(),
					lng: results[0].geometry.location.lng()
				};
			}else{
				console.error(status);
			}
		});
	};

	return MapService;
};

angular
.module('koko')
.factory('MapService',MapService);	