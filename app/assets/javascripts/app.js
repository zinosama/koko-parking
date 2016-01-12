angular.module('koko', ['ui.router','templates','firebase'])
.constant('ROOTURL','https://kokoparking.firebaseio.com')
.config([
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider){
		
		$stateProvider
		.state('home',{
			url:'/home',
			templateUrl:'home/_home.html',
			controller:'MainCtrl',
			controllerAs:'main',
		})
		.state('login',{
			url:'/login',
			templateUrl:'auth/_login.html',
			controller:'AuthCtrl',
			controllerAs:'auth',
			onEnter:['$state','AuthService',function($state, AuthService){
				AuthService.errors=[];
				if(AuthService.currentUser){
					$state.go('home');
				}				
			}]
		})
		.state('register',{
			url:'/register',
			templateUrl:'auth/_register.html',
			controller:'AuthCtrl',
			controllerAs:'auth',
			onEnter:['$state','AuthService',function($state, AuthService){
				AuthService.errors=[];
				if(AuthService.currentUser){
					$state.go('home');
				}
			}]
		})
		.state('resetPassword',{
			url:'/resetPassword',
			templateUrl:'auth/_resetPassword.html',
			controller:'AuthCtrl',
			controllerAs:'auth',
			onEnter:['$state','AuthService',function($state, AuthService){
				AuthService.errors=[];
				if(!AuthService.currentUser){
					$state.go('home');
				}
			}]
		})
		.state('profile',{
			url:'/profile',
			templateUrl:'profile/_index.html',
			controller:'ProfileCtrl',
			controllerAs:'profile',
			onEnter:['$state','AuthService',function($state, AuthService){
				if(!AuthService.currentUser){
					$state.go('home');
				}
			}]
		})
		.state('newListing',{
			url:'/newListing',
			templateUrl:'listing/_newListing.html',
			controller:'ListingCtrl',
			controllerAs:'listing',
			onEnter:['$state','AuthService',function($state, AuthService){
				if(!AuthService.currentUser){
					$state.go('home');
				}
			}]
		});

		$urlRouterProvider.otherwise('home');
	}]);