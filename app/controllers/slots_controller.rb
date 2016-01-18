class SlotsController < ApplicationController
	def index
		spot = Spot.find_by(id:params[:spot_id])
		if spot
			slots = spot.slots
			render json: {slots: slots}, status: 200
		else
			render json: {errors: 'Error loading spot.'}, status: 500
		end
	end

	def create
		spot = Spot.find_by(id:params[:spot_id])
		if spot
			slot = spot.slots.build(start_time:params[:start_time], end_time:params[:end_time], unavailable:params[:unavailable])
			if slot.save
				render json: {slot: slot}, status:200
			else
				render json: {errors: slot.errors.full_messages}, status: 500
			end
		else
			render json: {errors: 'Error loading spot.'}, status: 500
		end
	end

	def destroy
		slot = Slot.find_by(id:params[:id])
		if slot
			slot.destroy
			render nothing: true
		else
			render json: {errors: 'Error loading time slot.'}, status: 500
		end
	end
end
