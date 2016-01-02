function AuthCtrl($rootScope, $state, AuthService){
	var that = this;
	this.errors=AuthService.errors;

	var updateErrors = function authErrorObserver(){
		that.errors = AuthService.errors;
	}
	AuthService.registerObserverCallback(updateErrors);

	this.register = function(){
		AuthService.register(this.newUser);
	};

	this.login = function(){
		AuthService.login(this.newUser);
	};

	this.resetPassword = function(){
		AuthService.resetPassword(this.reset.email);
	}

};

angular
.module('koko')
.controller('AuthCtrl',AuthCtrl);