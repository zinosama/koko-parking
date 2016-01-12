function ListingCtrl(MapService){
	var that = this;
	var map, addressInput;
	this.create = function(){
		var output = {
			"address": addressInput.value,
			"transitInfo": this.transitInfo,
			"rule": this.rule,
			"otherInfo": this.otherInfo
		};
		console.log(output);	
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

	angular.element(document).ready(function(){
		addressInput = document.getElementById('listingInput');
		if(MapService.isMapReady()){
			MapService.appendMap();

			map = MapService.getMap();
			google.maps.event.trigger(map, 'resize');
			map.setCenter(MapService.getLocation());
		}else{
			MapService.registerCallback(MapService.appendMap);
		}

		if(map){
			var autoComplete = new google.maps.places.Autocomplete(addressInput);

			google.maps.event.addListener(autoComplete, 'place_changed', function(){
				var geocoder = new google.maps.Geocoder();
				MapService.geocodeAddress(geocoder, map, addressInput.value);
			});
		}


	});

}

angular
.module('koko')
.controller('ListingCtrl',ListingCtrl);