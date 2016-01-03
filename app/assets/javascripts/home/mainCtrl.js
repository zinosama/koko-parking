function MainCtrl(AuthService, MapService){
	var that = this;

	this.currentUser=AuthService.currentUser;
	var updateCurrentUserM = function mainUserObserver(){
		that.currentUser = AuthService.currentUser;
	};
	AuthService.registerObserverCallback(updateCurrentUserM);




}

angular.module('koko')
.controller('MainCtrl',MainCtrl);