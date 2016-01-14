function ListingCtrl(MapService, AuthService, AssetService, $http, $state){
	var that = this;
	var map, addressInput;
	this.create = function(){
		var output = {
			address: addressInput.value,
			transit_info: this.transitInfo,
			rules: this.rule,
			other_info: this.otherInfo,
			lat: MapService.coord.lat,
			lng: MapService.coord.lng,
			fire_ref: AuthService.getUid() 
		};
		$http.post('/listings.json', output)
		.success(function(){
			AssetService.loadListings();
			$state.go("profile");
			console.log("success");
		})
		.error(function(error){
			console.error(error);
		});
	};

	this.toggleDisplay = function(){
		var infoArea = document.querySelector("#listingInfo");
		var addressArea = document.querySelector("#listingAddress");
		if(infoArea.classList.contains('hide')){
			infoArea.classList.remove('hide');
			addressArea.classList.add('hide');
		}else{
			infoArea.classList.add('hide');
			addressArea.classList.remove('hide');
		}
	};

	var addAutoComplete = function(){
		return new google.maps.places.Autocomplete(addressInput);
	};

	var allowMapUpdate = function(autoComplete){
		google.maps.event.addListener(autoComplete, 'place_changed', function(){
			var geocoder = new google.maps.Geocoder();
			MapService.geocodeAddress(geocoder, map, addressInput.value);
		});
	};

	var adjustMap = function(){
		MapService.appendMap();
		map = MapService.getMap();
		google.maps.event.trigger(map, 'resize');
		map.setCenter(MapService.getLocation());
		allowMapUpdate(addAutoComplete());
	};

	angular.element(document).ready(function(){
		addressInput = document.getElementById('listingInput');
		if(MapService.isMapReady()){
			adjustMap();
		}else{
			MapService.registerCallback(adjustMap);
		}
	});

}

angular
.module('koko')
.controller('ListingCtrl',ListingCtrl);