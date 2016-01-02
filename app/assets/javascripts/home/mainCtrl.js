function MainCtrl(AuthService){
	this.currentUser=AuthService.currentUser;
	var that=this;
	var updateCurrentUserM = function mainUserObserver(){
		that.currentUser = AuthService.currentUser;
	};
	AuthService.registerObserverCallback(updateCurrentUserM);
}

angular.module('koko')
.controller('MainCtrl',MainCtrl);