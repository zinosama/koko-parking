class SpotsController < ApplicationController
	def index
		listing = Listing.find_by(id:params[:listing_id])
		if listing
			spots = listing.spots
			render json:{spots: spots}, status: 200
		else
			render json: {errors: 'Error loading listing.'}, status: 500
		end
	end

	def create
		listing = Listing.find_by(id:params[:listing_id])
		if listing
			spotNum = params[:spot_num].to_i
			newSpotIndices = []
			error = ""

			spotNum.times do
				spot = listing.spots.build()
				if spot.save
					newSpotIndices.push(spot)
				else
					error = spot.errors.full_messages
				end
			end
			
			if error == ""
				render json:{newSpotIndices: newSpotIndices}, status: 200
			else
				render json:{errors: error}, status: 500
			end
		else
			render json:{errors: 'Error loading listing.'}, status: 500
		end
	end

	def show

	end


	def update

	end

	def destroy
		spot = Spot.find_by(id: params[:id])
		if spot
			spot.destroy
			render nothing: true
		else
			render json: {errors: spot.errors.full_messages}, status: 500
		end
	end

end