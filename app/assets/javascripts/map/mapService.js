function MapService($window){
	var map;
	var geoMarker;
	var location = {lat: -34.397, lng: 150.644};//default map center

	function onload(position){
		if(map){//if google map loads before geolocation, modify map object
			map.setCenter({
				lat:position.coords.latitude,
				lng:position.coords.longitude
			});
			geoMarker.setPosition({
				lat:position.coords.latitude,
				lng:position.coords.longitude
			});
		}else{
			location = position;
		}
	};

	navigator.geolocation.getCurrentPosition(onload,function(error){
		console.error(error);
	});

	//How to avoid polluting global namespace?
	$window.initMap = function(){
		var styles = [{"featureType":"landscape","stylers":[{"hue":"#FFBB00"},{"saturation":43.400000000000006},{"lightness":37.599999999999994},{"gamma":1}]},{"featureType":"road.highway","stylers":[{"hue":"#FFC200"},{"saturation":-61.8},{"lightness":45.599999999999994},{"gamma":1}]},{"featureType":"road.arterial","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":51.19999999999999},{"gamma":1}]},{"featureType":"road.local","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":52},{"gamma":1}]},{"featureType":"water","stylers":[{"hue":"#0078FF"},{"saturation":-13.200000000000003},{"lightness":2.4000000000000057},{"gamma":1}]},{"featureType":"poi","stylers":[{"hue":"#00FF6A"},{"saturation":-1.0989010989011234},{"lightness":11.200000000000017},{"gamma":1}]}];

	  map = new google.maps.Map(document.getElementById('map'), {
	    center: location,
	    zoom: 16,
	    mapTypeControl:false,
	    styles: styles
	  });

	 	geoMarker = new google.maps.Marker({
	 		position:location,
	 		map:map,
	 		title:"Hello World!"
	 	});
	};

	// var mapCallbacks = [];
	// var notifyMapCallbacks = function(){
	// 	angular.forEach(mapCallbacks, function(callback){
	// 		callback();
	// 	});
	// };

	// var MapService = {};
	// MapService.registerCallback = function(callback){
	// 	mapCallbacks.push(callback);
	// };

	return MapService;
};

angular
.module('koko')
.factory('MapService',MapService);