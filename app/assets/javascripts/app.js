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
			resolve:{
				currentAuth: function(AuthService){
					return AuthService.waitForAuth()
					.then(function(authObj){
						if(authObj){
							AuthService.setUid(authObj.uid);
							return authObj;
						}
					})
				}
			},
			onEnter:['$state', 'currentAuth', function($state, currentAuth){
				if(!currentAuth){
					$state.go('home');
				}else{
				}
			}]
		})
		.state('newListing',{
			url:'/newListing',
			templateUrl:'listing/_new.html',
			controller:'ListingCtrl',
			controllerAs:'listing',
			resolve:{
				currentAuth: function(AuthService){
					return AuthService.waitForAuth()
					.then(function(authObj){
						if(authObj){
							AuthService.setUid(authObj.uid);
							return authObj;
						}
					})
				}
			},
			onEnter:['$state', 'currentAuth', function($state, currentAuth){
				if(!currentAuth){
					$state.go('home');
				}else{
				}
			}]
		})
		.state('spots',{
			url:'/listings/:listingId/spots',
			templateUrl:'spot/_index.html',
			controller:'SpotCtrl',
			controllerAs:'spot',
			resolve:{
				currentAuth: function(AuthService, MapService){
					return AuthService.waitForAuth()
					.then(function(authObj){
						AuthService.setUid(authObj.uid);
						return authObj;
					});
				},
				load: function($http, currentAuth){
					if(currentAuth){
						return $http.get('/listings?fire_ref='+currentAuth.uid)
						.then(function(message){
							return message.data.listings;
						})
						.catch(function(error){
							return {error: error};
						});
					}
				},
				spots: function(AssetService, $stateParams, currentAuth, load){
					AssetService.setListings(load);
					if(AssetService.verifyListingAccess($stateParams.listingId)){
						return AssetService.loadSpots($stateParams.listingId)
						.then(function(response){
							return response.data.spots;
						})
						.catch(function(response){
							return {error: response.data.errors};
						});
					}else{
						return {error:"Unauthorized"};
					}
				}
			},
			onEnter:['$state','spots','currentAuth', 'load', function($state, spots, load, currentAuth){
				if(!currentAuth){
					$state.go('login');
				}else if(load.error){
					console.error(load.error);
					$state.go('profile');
				}else if(spots.error && spots.error === "Unauthorized"){
					console.error(spots.error);
					$state.go('profile');
				}
			}]
		});

		$urlRouterProvider.otherwise('home');
	}]);