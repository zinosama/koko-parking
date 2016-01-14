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

	var AssetService={};

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

	return AssetService;
};

angular
.module('koko')
.factory('AssetService', AssetService);