function SpotCtrl($stateParams, $http, MapService, spots, $scope){
	var that = this;
	this.spotMenuSwitch = false;
	this.spotMenu=[{
			type:"Driveway",
			description:"this parking spot is part of my driveway"
		},{
			type:"Lawn",
			description:"this parking spot is part of my lawn"
		},{
			type:"Street Side",
			description:"I have a permit that allows renters to park on street side"
		},{
			type:"Permit",
			description:"I have a permit that allows renters to park in nearby private facilities"
		}];
	this.carMenuSwitch = false;
	this.carMenu=[{
			type:"Compact",
			description:"ex. Chevy Spark, Toyota Yaris, Honda Civic, etc."
		},{
			type:"Full Size",
			description:"ex. Chevy Malibu, Toyota Camery, Honda Accord, etc."
		},{
			type:"SUV",
			description:"ex. Chevy Tahoe, Toyota RAV4, Honda CRV, etc."
		}];
	this.priceMenu=[{
			type:"Daily Price",
			description:"set daily price for this parking spot",
			key:"d_price"
		},{
			type:"Weekly",
			description:"set weekly price for this parking spot",
			key:"w_price"
		},{
			type:"Monthly",
			description:"set monthly price for this parking spot",
			key:"m_price"
		}];

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
	this.showTime = function(){
		console.log(that.startDate);
		console.log(typeof that.startDate);
	};

	this.spots = spots;
	this.spotSelected;
	this.toggleInstant = function(){
		that.spotSelected.instant = !that.spotSelected.instant;
	};

	function toggle(target){
		var el = document.querySelector(target);
		if(el.classList.contains('hide')){
			el.classList.remove('hide');
		}else{
			el.classList.add('hide');
		}
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
				that.spots.push(data.newSpotIndices);
			}else{
				that.spots = data.newSpotIndices;
			}
		})
		.error(function(error){
			console.error(error);
		});
	};

	this.destroySpot = function(spotId, index){
		$http.delete('/spots/'+spotId)
		.success(function(){
			that.spots.splice(index, 1);
		})
		.error(function(error){
			console.error(error);
		});
	};	



	this.editSpot = function(targetSpot){
		toggle('#spotList');
		that.spotSelected = targetSpot;

		toggle('#spotMenu');
	};
};

angular
.module('koko')
.controller('SpotCtrl', SpotCtrl);