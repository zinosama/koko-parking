function SpotCtrl($stateParams, MapService, spots){ //MapSerivce is introduced so that map will always load upon refresh
	this.spots = spots;
	this.listingId = $stateParams.listingId;
};

angular
.module('koko')
.controller('SpotCtrl', SpotCtrl);