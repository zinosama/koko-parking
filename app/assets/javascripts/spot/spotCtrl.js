function SpotCtrl($stateParams, MapService){ //MapSerivce is introduced so that map will always load upon refresh
	this.listingId = $stateParams.listingId;
};

angular
.module('koko')
.controller('SpotCtrl', SpotCtrl);