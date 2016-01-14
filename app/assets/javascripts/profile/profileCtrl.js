function ProfileCtrl(AuthService, AssetService, MapService, $state){
	this.currentUser = AuthService.currentUser;
	this.errors = AuthService.errors;
	var that=this;

	var updateCurrentUser = function profileUserObserver(){
		that.currentUser = AuthService.currentUser;
	};
	var updateErrors = function profileErrorObserver(){
		that.errors = AuthService.errors;
	};
	AuthService.registerObserverCallback(updateErrors);
	AuthService.registerObserverCallback(updateCurrentUser);

	//==asset
	this.listings = AssetService.getListings();
	var updateListing = function profileListingObserver(){
		that.listings = AssetService.getListings();
	};
	AssetService.registerCallback(updateListing);

	//==asset


	var afterSuccess = function(target){ 
		return function(){
			if(target === "#removeUserDiv"){
				swal({
					title: "Bye-bye",
					type: "success",
					text: "Thanks for being with us. We will miss you!",
					timer: 1500,
					showConfirmButton: false
				});
			}else{
				that.toggle(target);
				swal({
					title: "Success",
					type: "success",
					text: "Your account has been updated.",
					timer: 1500,
					showConfirmButton: false
				});
			}
		};
	};

	this.toggle = function(target){
		AuthService.clearErrors();
		var el = document.querySelector(target);
		if(el.classList.contains('hide')){
			el.classList.remove('hide');
			this.user={};
		}else{
			el.classList.add('hide');
		}
	};

	this.changePassword = function(){
		AuthService.changePassword(this.user, afterSuccess('#changePasswordDiv'));
	};

	this.changeEmail = function(){
		AuthService.changeEmail(this.user, afterSuccess('#changeEmailDiv'));
	};

	this.removeUser = function(){
		if(this.user.check.toLowerCase().trim() === "i understand"){
			AuthService.removeUser(this.user, afterSuccess('#removeUserDiv'));
		}else{
			this.errors.push("Please type in 'I Understand' to confirm.");
		}
	};
};

angular
.module('koko')
.controller('ProfileCtrl',ProfileCtrl);