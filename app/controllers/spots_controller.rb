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

	def show

	end

	def create

	end

	def update

	end

	def destroy

	end

end