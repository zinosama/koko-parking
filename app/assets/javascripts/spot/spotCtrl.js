function SpotCtrl($stateParams, $http, MapService, AssetService, spots, $scope){
	var that = this;
	var infoHash = AssetService.infoHash;
	
	function loadSlots(){
		$http.get('/spots/'+that.spotSelected.id+'/slots')
		.success(function(data){
			that.selectedSlots = data.slots;
		})
		.error(function(error){
			console.error(error.errors);
		});
	};

	function toggle(target){
		var el = document.querySelector(target);
		if(el.classList.contains('hide')){
			el.classList.remove('hide');
		}else{
			el.classList.add('hide');
		}
	};

	this.spotMenuSwitch = false;
	this.spotMenu = AssetService.spotMenu;
	this.carMenuSwitch = false;
	this.carMenu = AssetService.carMenu;
	this.priceMenu= AssetService.priceMenu;

	this.minDate = new Date();
	this.maxDate = new Date();
	this.maxDate.setFullYear(that.minDate.getFullYear()+1);
	this.cal1 = {opened: false};
	this.openCal1 = function(){
		that.cal1.opened = true;
	};
	this.cal2 = {opened: false};
	this.openCal2 = function(){
		that.cal2.opened = true;
	}

	this.spots = spots;
	this.slotError;
	this.spotSelected;
	this.selectedSlots;

	this.addSlot = function(){
		that.slotError="";
		if(that.startDate > that.endDate){
			that.slotError = "Sorry, ending date cannot be earlier than starting date.";
		}else{
			var data={
				start_time: that.startDate,
				end_time: that.endDate,
				spot_id: that.spotSelected.id,
				unavailable: true
			};
			$http.post('/slots',data)
			.success(function(result){
				that.selectedSlots.push(result.slot);
			})
			.error(function(error){
				console.error(error.errors);
			});
		}
	};

	this.removeSlot = function(slot, index){
		$http.delete('/slots/'+slot.id)
		.success(function(){
			that.selectedSlots.splice(index, 1);
		})
		.error(function(error){
			console.error(error.errors);
		});
	};

	this.toggleInstant = function(){
		that.spotSelected.instant = !that.spotSelected.instant;
	};

	this.closeAccordion = function(target){
		if(target === 'spot'){
			that.spotMenuSwitch = !that.spotMenuSwitch;
		}else{
			that.carMenuSwitch = !that.carMenuSwitch;
		}
	}

	this.setPrice = function(key){
		var titleTimeframe;
		if(key==="d_price"){
			titleTimeframe = "Daily";
		}else if(key==="w_price"){
			titleTimeframe = "Weekly";
		}else{
			titleTimeframe = "Monthly";
		}

		swal({
				title:"Set "+titleTimeframe+" Rate",
				text:"Please enter number only:",
				type:"input",
				showCancelButton:true,
				closeOnConfirm:true,
				animation:"slide-from-top",
				inputPlaceholder:"30",
				showLoaderOnConfirm:true
			},
			function(inputValue){
				if(inputValue===false) return false;
				if(inputValue===""){
					swal.showInputError("Please set "+titleTimeframe.toLowerCase()+" rate for your parking slot.");
					return false;
				}else if(!isFinite(inputValue)){
					swal.showInputError("Please enter numbers only");
					return false;
				}
				$scope.$apply(function(){
					that.spotSelected[key] = parseInt(inputValue,10);
				});
			});
	};

	this.createSpots = function(inputNum){
		var spotNum = inputNum || this.spotNum;
		var postData = {
			spot_num: spotNum,
			listing_id: $stateParams.listingId
		}
		toggle('#spotNumDiv');
		$http.post('/spots', postData)
		.success(function(data){
			if(inputNum){
				that.spots.push(data.newSpots[0]);
			}else{
				that.spots = data.newSpots;
			}
		})
		.error(function(error){
			console.error(error);
		});
	};

	this.destroySpot = function(spotId, index){
		swal({title: "Are you sure?",
			text: "You may be financially liable for renters who have already rented this spot!",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Yes, delete it!",
			closeOnConfirm: false
		}, function(){
			$http.delete('/spots/'+spotId)
			.success(function(){
				that.spots.splice(index, 1);
				swal("Deleted!", "Your information has been updated.", "success");
			})
			.error(function(error){
				console.error(error);
			});
		});
	};	

	this.editSpot = function(targetSpot){
		toggle('#spotList');
		that.spotSelected = targetSpot;
		toggle('#spotMenu');
		loadSlots();
	};

	this.publishSpot = function(spot){
		$http.put('/spots/'+spot.id, {published: true})
		.success(function(){
			spot.published = true;
			swal({
				title: "Congratulations!",
				text: "Your parking spot is now available online.",
				timer: 2000,
				type:"success",
				showConfirmButton: true
			});
		})
		.error(function(error){
			console.error(error);
		});
	};

	this.suspendSpot = function(spot){
		swal({
			title: "Are you sure?",
			text: "Your parking spot will no longer be available online!",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Yes, take it off-line!",
			closeOnConfirm: false
		}, function(){
			$http.put('/spots/'+spot.id, {published: false})
			.success(function(){
				spot.published = false;
				swal({
					title: "Suspended!",
					text: "This parking spot is now off-line.",
					type: "success",
					timer: 1200,
					showConfirmButton: false
				});
			})
			.error(function(error){
				console.error(error);
			});
		});
	};

	this.infoTransform = function(info, type){
		return infoHash[type][parseInt(info, 10)];
	};

	this.saveNReturn = function(){
		if(that.spotSelected){
			if(!that.spotSelected.completed){
				if(that.spotSelected.car_class && that.spotSelected.spot_class && (that.spotSelected.d_price || that.spotSelected.w_price || that.spotSelected.m_price)){
					that.spotSelected.completed = true;
				}
			}
			$http.put('/spots/'+that.spotSelected.id, that.spotSelected)
			.success(function(){
				toggle('#spotMenu');
				toggle('#spotList');
			})
			.error(function(error){
				console.error(error);
			});
		}
	};
};

angular
.module('koko')
.controller('SpotCtrl', SpotCtrl);