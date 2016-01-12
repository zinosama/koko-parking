function MainCtrl($window, AuthService, MapService){	
	var that = this;

	this.currentUser=AuthService.currentUser;
	var updateCurrentUserM = function mainUserObserver(){
		that.currentUser = AuthService.currentUser;
	};
	AuthService.registerObserverCallback(updateCurrentUserM);

	angular.element(document).ready(function(){
		if(MapService.isMapReady()){

			MapService.appendMap();

			var map = MapService.getMap();
			google.maps.event.trigger(map, 'resize');
			map.setCenter(MapService.getLocation());
		}else{
			MapService.registerCallback(MapService.appendMap);
		}
	});
}

angular
.module('koko')
.controller('MainCtrl',MainCtrl);