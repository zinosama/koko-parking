class UsersController < ApplicationController
	def create
		# respond_with User.create(user_params)
		unless User.where(fire_ref: params[:fire_ref]).exists?
			if User.create(user_params)
				render nothing: true
			else
				render nothing: true, status: 422
			end
		else
			render nothing: true
		end
	end

	def user_params
		params.permit(:fire_ref)
	end
end
