function AuthService($firebaseAuth, $firebaseObject, $state, $http){
	var ref = new Firebase("https://kokoparking.firebaseio.com");
	var auth = $firebaseAuth(ref);

	var observerCallbacks = [];//observer pattern is used here to update controller variables from changes occurred in service
	var notifyObservers = function(){
		angular.forEach(observerCallbacks, function(callback){
			callback();
		});
	};
	var deleteRepeatObserver = function(inputCallback){ //when redundant observers, delete the previous, outdated observer
		var i;
		for(i=0;i<observerCallbacks.length;i++){
			if(observerCallbacks[i].name === inputCallback.name){
				observerCallbacks.splice(i,1);
			}
		};
	}

	var currentUserUid; //consumed by removeAccountInfo()
	var removeAccountInfo = function(){//remove user info
		var userRef = ref.child("users").child(currentUserUid);
		var userObj = $firebaseObject(userRef);
		userObj.$remove();
	};

	var newUserApi = function(data){
		$http.post('/users.json', data)
		.success(function(){
		})
		.error(function(error){
			console.error(error);
		});
	}

	auth.$onAuth(function(authData){
		if(authData){
			currentUserUid = authData.uid;
			var userRef = ref.child("users").child(authData.uid).child("name");
			var userObj = $firebaseObject(userRef);
			userObj.$loaded()
			.then(function(obj){
				AuthServiceObj.currentUser = obj.$value;
				notifyObservers();
			})
			.catch(function(error){
				console.error(error);
			});			
		}else{
			AuthServiceObj.currentUser='';
			notifyObservers();
		}
	});

	//Returning AuthServiceObj as suggested by Todd Motto @ "https://toddmotto.com/opinionated-angular-js-styleguide-for-teams/"
	var AuthServiceObj = {};

	AuthServiceObj.errors = [];

	AuthServiceObj.clearErrors = function(){
		AuthServiceObj.errors = [];
		notifyObservers();
	}

	AuthServiceObj.registerObserverCallback = function(callback){
		deleteRepeatObserver(callback);
		observerCallbacks.push(callback);
	};

	AuthServiceObj.register = function(newUser){
		auth.$createUser({
			email : newUser.email,
			password : newUser.password
		})
		.then(function(userData){
			AuthServiceObj.addUserName(newUser,userData.uid);
			AuthServiceObj.login(newUser);

			var data = {fire_ref: userData.uid};//storing the firebase user_id ref in rails' sql database
			newUserApi(data);
		})
		.catch(function(error){
			AuthServiceObj.errors=[];
			error.code === 'EMAIL_TAKEN' ? AuthServiceObj.errors.push('Sorry, this email has been taken.') 
			: AuthServiceObj.errors.push(error.message);
			notifyObservers();
		});
	};

	AuthServiceObj.addUserName = function(newUser, uid){
		ref.child('users').child(uid).set({
			name : newUser.name
		});
	};

	AuthServiceObj.getUid = function(){
		return currentUserUid;
	}

	AuthServiceObj.login = function(newUser){
		auth.$authWithPassword(newUser)
			.then(function(authData){
				$state.go("home");
				newUserApi({fire_ref: authData.uid}); //in case sql fails upon registration
			})
			.catch(function(error){
				AuthServiceObj.errors=[];
				AuthServiceObj.errors.push(error.message);
				notifyObservers();
			});
	};

	AuthServiceObj.logout = function(){
		auth.$unauth();
	};

	AuthServiceObj.resetPassword = function(inputEmail){
		auth.$resetPassword({
			email : inputEmail
		}).then(function(){
			$state.go("home");
		}).catch(function(error){
			AuthServiceObj.errors=[];
			AuthServiceObj.errors.push(error.message);
			notifyObservers();
		});
	};

	AuthServiceObj.changePassword = function(user, callback){
		AuthServiceObj.clearErrors();
		auth.$changePassword(user)
		.then(function(){
			callback();
		})
		.catch(function(error){
			AuthServiceObj.errors.push(error.message);
			notifyObservers();
		});
	};

	AuthServiceObj.changeEmail = function(user, callback){
		AuthServiceObj.clearErrors();
		auth.$changeEmail(user)
		.then(function(){
			callback();
		})
		.catch(function(error){
			AuthServiceObj.errors.push(error.message);
			notifyObservers();
		});
	};

	AuthServiceObj.removeUser = function(user, callback){
		AuthServiceObj.clearErrors();
		auth.$removeUser(user)
		.then(function(){
			callback();
			removeAccountInfo();
			$state.go('home');

		})
		.catch(function(error){
			AuthServiceObj.errors.push(error.message);
			notifyObservers();
		});
	};

	return AuthServiceObj;
}

angular
.module('koko')
.factory('AuthService',AuthService);