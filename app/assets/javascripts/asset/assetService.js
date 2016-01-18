function AssetService(AuthService, $http){
	var listings=[];
	var callbacks=[];
	var notifyObservers = function(){
		angular.forEach(callbacks, function(callback){
			callback();
		});
	};

	var deleteRepeatObserver = function(inputCallback){
		var i;
		for(i=0;i<callbacks.length;i++){
			if(callbacks[i].name === inputCallback.name){
				callbacks.splice(i,1);
			}
		};
	}

	var AssetService = {};

	AssetService.loadSpots = function(listingId){
		return $http.get('/listings/'+listingId+'/spots')
	};

	AssetService.loadListings = function(){
		var fire_ref = AuthService.getUid();
		$http.get('/listings?fire_ref='+fire_ref)
		.success(function(data){
			listings = data.listings;
			notifyObservers();
		})
		.error(function(error){
			console.error(error);
		});
	};
	
	AssetService.loadListings();
	AssetService.setListings = function(input){
		listings = input;
	}

	AssetService.getListings = function(){
		return listings;
	}

	AssetService.registerCallback = function(callback){
		deleteRepeatObserver(callback);
		callbacks.push(callback);
	};

	AssetService.verifyListingAccess = function(listingId){
		var i;
		listingId = parseInt(listingId, 10);
		for(i=0; i<listings.length; i++){
			if(listings[i].id === listingId){
				return true;
			}
		}
		return false;
	};

	AssetService.spotMenu = [{
			type:"Driveway",
			description:"this parking spot is part of my driveway"
		},{
			type:"Lawn",
			description:"this parking spot is part of my lawn"
		},{
			type:"Street Side",
			description:"I have a permit that allows renters to park on street side"
		},{
			type:"Permit",
			description:"I have a permit that allows renters to park in nearby private facilities"
		}];

	AssetService.carMenu = [{
			type:"Compact",
			description:"ex. Chevy Spark, Toyota Yaris, Honda Civic, etc."
		},{
			type:"Full Size",
			description:"ex. Chevy Malibu, Toyota Camery, Honda Accord, etc."
		},{
			type:"SUV",
			description:"ex. Chevy Tahoe, Toyota RAV4, Honda CRV, etc."
		}];

	AssetService.priceMenu = [{
			type:"Daily Price",
			description:"set daily price for this parking spot",
			key:"d_price"
		},{
			type:"Weekly",
			description:"set weekly price for this parking spot",
			key:"w_price"
		},{
			type:"Monthly",
			description:"set monthly price for this parking spot",
			key:"m_price"
		}];

	AssetService.infoHash = {
		"car_class":['undefined', 'Compact & Smaller', 'Full-size & Smaller', 'SUV & Smaller'],
		"spot_class":['undefined', 'Driveway', 'Lawn', 'Street Side', 'Permit']
	};

	return AssetService;
};

angular
.module('koko')
.factory('AssetService', AssetService);