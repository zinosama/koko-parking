function NavCtrl(AuthService){
	var that=this;
	this.currentUser=AuthService.currentUser;

	this.logout = function(){
		AuthService.logout();
	}

	var updateCurrentUser = function navUserObserver(){
		that.currentUser = AuthService.currentUser;
	};
	AuthService.registerObserverCallback(updateCurrentUser);
}

angular
.module('koko')
.controller('NavCtrl',NavCtrl);