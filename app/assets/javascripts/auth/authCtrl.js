angular.module('koko')
.controller('AuthCtrl',[
	'$scope',
	'$state',
	'Auth',
	function($scope, $state, Auth){
		var config = {
      headers: {
      	'X-HTTP-Method-Override': 'POST'
    	}
    };
		$scope.login = function(){
			Auth.login($scope.user,config)
			.then(function(result){
				$state.go('home');
			},function(RESPONSE_ERROR){
				console.log(RESPONSE_ERROR);
			});
		};

		$scope.register = function(){
			Auth.register($scope.user,config).then(function(){
				$state.go('home');
			},function(error){
				$scope.errors=compileRegisterError(error.data.errors);
			});
		};

		function compileRegisterError(inputError){
			var errorArray=[];
			for(var prop in inputError){
				console.log(prop);
				errorArray = inputError[prop];
				for(var i=0;i<errorArray.length;i++){
					errorArray.push(prop+" "+errorArray[i]);
				}
			}
			console.log(errorArray);
			return errorArray;
		}
	}]);