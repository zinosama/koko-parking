class ListingsController < ApplicationController

	def create
		user = User.find_by(fire_ref: params[:fire_ref])
		if user
			newListing = user.listings.build(listing_params)
			if newListing.save
				render nothing: true
			else
				render json: {errors: newListing.errors.full_messages.join('. ')}, status: 422
			end
		else
			render json: {errors: "Error loading user info. Please login in again."}, status: 500
		end
	end

	def index
		user = User.find_by(fire_ref: params[:fire_ref])
		if user
			listings = user.listings.pluck(:id, :address, :lat, :lng, :published, :completed)
			objArray = []

			listings.each do |listing|
				obj={
					id: listing[0],
					address: listing[1],
					lat: listing[2],
					lng: listing[3],
					published: listing[4],
					completed: listing[5]
				}
				objArray.push(obj)
			end
			render json: {listings: objArray}, status: 200
		else
			render json: {errors: "Error loading user info. Please login in again."}, status: 500
		end
	end

	def show
		
	end
	
	# def update

	# end


	# def destroy

	# end

	def listing_params
		params.permit(:address, :transit_info, :rules, :other_info, :lat, :lng)
	end

end