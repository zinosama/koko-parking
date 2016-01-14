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

	AssetService.getListings = function(){
		return listings;
	}

	AssetService.registerCallback = function(callback){
		deleteRepeatObserver(callback);
		callbacks.push(callback);
	};

	return AssetService;
};

angular
.module('koko')
.factory('AssetService', AssetService);